'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SchoolClass {
  id: string;
  name: string;
  level: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    studentProfiles: number;
    subjects: number;
    courseAssignments: number;
  };
}

interface ClassStats {
  total: number;
  active: number;
  inactive: number;
  totalStudents: number;
}

export default function InstitutionClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [stats, setStats] = useState<ClassStats>({
    total: 0,
    active: 0,
    inactive: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    level: 'CLASS_6',
    sortOrder: 0,
    isActive: true,
  });

  const schoolLevels = [
    { value: 'CLASS_6', label: 'Class 6' },
    { value: 'CLASS_7', label: 'Class 7' },
    { value: 'CLASS_8', label: 'Class 8' },
    { value: 'CLASS_9', label: 'Class 9' },
    { value: 'CLASS_10', label: 'Class 10' },
    { value: 'CLASS_11', label: 'Class 11' },
    { value: 'CLASS_12', label: 'Class 12' },
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (levelFilter) params.append('level', levelFilter);
      if (statusFilter) params.append('isActive', statusFilter === 'active' ? 'true' : 'false');

      const response = await fetch(`/institution/api/classes?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setClasses(data.classes || []);
        calculateStats(data.classes || []);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      // Use mock data for demo
      const mockData = getMockClasses();
      setClasses(mockData);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getMockClasses = (): SchoolClass[] => [
    {
      id: '1',
      name: 'Class 6 - A',
      level: 'CLASS_6',
      sortOrder: 1,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      _count: { studentProfiles: 35, subjects: 5, courseAssignments: 8 },
    },
    {
      id: '2',
      name: 'Class 7 - A',
      level: 'CLASS_7',
      sortOrder: 2,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      _count: { studentProfiles: 32, subjects: 6, courseAssignments: 10 },
    },
    {
      id: '3',
      name: 'Class 8 - A',
      level: 'CLASS_8',
      sortOrder: 3,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      _count: { studentProfiles: 30, subjects: 6, courseAssignments: 10 },
    },
    {
      id: '4',
      name: 'Class 9 - A',
      level: 'CLASS_9',
      sortOrder: 4,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      _count: { studentProfiles: 28, subjects: 7, courseAssignments: 12 },
    },
    {
      id: '5',
      name: 'Class 10 - A',
      level: 'CLASS_10',
      sortOrder: 5,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      _count: { studentProfiles: 25, subjects: 7, courseAssignments: 14 },
    },
    {
      id: '6',
      name: 'Class 11 - Science',
      level: 'CLASS_11',
      sortOrder: 6,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      _count: { studentProfiles: 20, subjects: 5, courseAssignments: 8 },
    },
    {
      id: '7',
      name: 'Class 12 - Commerce',
      level: 'CLASS_12',
      sortOrder: 7,
      isActive: false,
      createdAt: '2025-01-01T00:00:00Z',
      _count: { studentProfiles: 0, subjects: 5, courseAssignments: 0 },
    },
  ];

  const calculateStats = (classList: SchoolClass[]) => {
    setStats({
      total: classList.length,
      active: classList.filter((c) => c.isActive).length,
      inactive: classList.filter((c) => !c.isActive).length,
      totalStudents: classList.reduce((sum, c) => sum + c._count.studentProfiles, 0),
    });
  };

  const handleCreateClass = async () => {
    try {
      const response = await fetch('/institution/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setClasses((prev) => [...prev, data]);
        calculateStats([...classes, data]);
        closeModal();
      } else {
        alert(data.error || 'Failed to create class');
      }
    } catch (error) {
      console.error('Failed to create class:', error);
      // Add mock data for demo
      const newClass: SchoolClass = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        _count: { studentProfiles: 0, subjects: 0, courseAssignments: 0 },
      };
      setClasses((prev) => [...prev, newClass]);
      calculateStats([...classes, newClass]);
      closeModal();
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass) return;

    try {
      const response = await fetch(`/institution/api/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setClasses((prev) =>
          prev.map((c) => (c.id === editingClass.id ? data : c))
        );
        calculateStats(classes.map((c) => (c.id === editingClass.id ? data : c)));
        closeModal();
      } else {
        alert(data.error || 'Failed to update class');
      }
    } catch (error) {
      console.error('Failed to update class:', error);
      // Update mock data for demo
      const updatedClass: SchoolClass = {
        ...editingClass,
        ...formData,
      };
      setClasses((prev) =>
        prev.map((c) => (c.id === editingClass.id ? updatedClass : c))
      );
      calculateStats(classes.map((c) => (c.id === editingClass.id ? updatedClass : c)));
      closeModal();
    }
  };

  const handleDeleteClass = async () => {
    if (!classToDelete) return;

    try {
      const response = await fetch(`/institution/api/classes/${classToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClasses((prev) => prev.filter((c) => c.id !== classToDelete.id));
        calculateStats(classes.filter((c) => c.id !== classToDelete.id));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete class');
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
      // Delete mock data for demo
      setClasses((prev) => prev.filter((c) => c.id !== classToDelete.id));
      calculateStats(classes.filter((c) => c.id !== classToDelete.id));
    } finally {
      setShowDeleteModal(false);
      setClassToDelete(null);
    }
  };

  const openEditModal = (cls: SchoolClass) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      level: cls.level,
      sortOrder: cls.sortOrder,
      isActive: cls.isActive,
    });
    setShowModal(true);
  };

  const openDeleteModal = (cls: SchoolClass) => {
    setClassToDelete(cls);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({ name: '', level: 'CLASS_6', sortOrder: 0, isActive: true });
  };

  const formatLevel = (level: string) => {
    return level.replace('CLASS_', 'Class ');
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || cls.level === levelFilter;
    const matchesStatus = !statusFilter ||
      (statusFilter === 'active' && cls.isActive) ||
      (statusFilter === 'inactive' && !cls.isActive);
    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
              <p className="text-gray-600 mt-1">Organize students into classes and grade levels</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/institution/admin"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Class
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Classes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Active Classes</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Inactive Classes</p>
            <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Grades</option>
              {schoolLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h10m-10 4h10m4-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || levelFilter || statusFilter
                ? 'Try adjusting your filters'
                : 'Create your first class to get started'}
            </p>
            {!searchQuery && !levelFilter && !statusFilter && (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Create Class
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500">{formatLevel(cls.level)}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cls.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {cls.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">
                      {cls._count.studentProfiles}
                    </p>
                    <p className="text-xs text-blue-700">Students</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <p className="text-xl font-bold text-purple-600">
                      {cls._count.subjects}
                    </p>
                    <p className="text-xs text-purple-700">Subjects</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">
                      {cls._count.courseAssignments}
                    </p>
                    <p className="text-xs text-green-700">Courses</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(cls)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(cls)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingClass ? 'Edit Class' : 'Create New Class'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Class 6 - A"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade Level *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, level: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {schoolLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingClass ? handleUpdateClass : handleCreateClass}
                disabled={!formData.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {editingClass ? 'Save Changes' : 'Create Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && classToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Class</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{classToDelete.name}</strong>?
              </p>

              {classToDelete._count.studentProfiles > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">
                    This class has <strong>{classToDelete._count.studentProfiles}</strong> enrolled
                    students. Please reassign or remove students before deleting.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">
                  This class has no enrolled students and can be safely deleted.
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setClassToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClass}
                  disabled={classToDelete._count.studentProfiles > 0}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
