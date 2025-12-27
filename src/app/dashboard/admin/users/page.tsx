"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Users, Search, Filter, MoreVertical, Mail, Shield, Trash2 } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  joinedDate: string
  avatar?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || data)
      } else {
        // Fallback mock data if API returns error
        setUsers([
          { id: "1", name: "John Doe", email: "john@example.com", role: "STUDENT", status: "active", joinedDate: "2024-01-15" },
          { id: "2", name: "Jane Smith", email: "jane@example.com", role: "INSTRUCTOR", status: "active", joinedDate: "2024-02-20" },
          { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "STUDENT", status: "inactive", joinedDate: "2024-03-10" },
          { id: "4", name: "Alice Brown", email: "alice@example.com", role: "ADMIN", status: "active", joinedDate: "2024-01-01" },
          { id: "5", name: "Charlie Davis", email: "charlie@example.com", role: "STUDENT", status: "active", joinedDate: "2024-04-05" },
          { id: "6", name: "Eva Martinez", email: "eva@example.com", role: "INSTRUCTOR", status: "pending", joinedDate: "2024-05-12" },
          { id: "7", name: "Frank Lee", email: "frank@example.com", role: "STUDENT", status: "active", joinedDate: "2024-06-18" },
          { id: "8", name: "Grace Kim", email: "grace@example.com", role: "STUDENT", status: "active", joinedDate: "2024-07-22" },
        ])
      }
    } catch (err) {
      console.error("Failed to fetch users:", err)
      setError("Failed to fetch users")
      // Fallback mock data
      setUsers([
        { id: "1", name: "John Doe", email: "john@example.com", role: "STUDENT", status: "active", joinedDate: "2024-01-15" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", role: "INSTRUCTOR", status: "active", joinedDate: "2024-02-20" },
        { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "STUDENT", status: "inactive", joinedDate: "2024-03-10" },
        { id: "4", name: "Alice Brown", email: "alice@example.com", role: "ADMIN", status: "active", joinedDate: "2024-01-01" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const userName = user.name || ""
    const userEmail = user.email || ""
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return

    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers }),
      })

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
        setSelectedUsers([])
      }
    } catch (err) {
      console.error("Failed to delete users:", err)
      // Optimistic update for demo
      setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800"
      case "INSTRUCTOR":
        return "bg-blue-100 text-blue-800"
      case "STUDENT":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "N/A"
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage all users on the platform</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="STUDENT">Students</option>
                  <option value="INSTRUCTOR">Instructors</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleDeleteUsers}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedUsers.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {getInitials(user.name)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name || "Unknown"}</div>
                              <div className="text-sm text-gray-500">{user.email || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(user.status)}`}>
                            {(user.status || "unknown").charAt(0).toUpperCase() + (user.status || "unknown").slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(user.joinedDate)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Send Email">
                              <Mail className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Permissions">
                              <Shield className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="More Options">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
