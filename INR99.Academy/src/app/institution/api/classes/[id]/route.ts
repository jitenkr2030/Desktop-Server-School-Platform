import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/db';

// GET /api/institution/classes/[id] - Get single class
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = createClient()
    const { id } = await params;

    const schoolClass = await db.schoolClass.findUnique({
      where: { id },
      include: {
        subjects: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        studentProfiles: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        courseAssignments: {
          where: { isActive: true },
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        _count: {
          select: {
            studentProfiles: true,
            subjects: true,
            courseAssignments: true,
          },
        },
      },
    });

    if (!schoolClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(schoolClass);
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class' },
      { status: 500 }
    );
  }
}

// PUT /api/institution/classes/[id] - Update class
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = createClient()
    const { id } = await params;
    const body = await request.json();
    const { name, level, sortOrder, isActive } = body;

    // Check if class exists
    const existingClass = await db.schoolClass.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if new name conflicts with existing class
    if (name && name !== existingClass.name) {
      const nameConflict = await db.schoolClass.findUnique({
        where: { name },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'A class with this name already exists' },
          { status: 409 }
        );
      }
    }

    const updatedClass = await db.schoolClass.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(level && { level }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        _count: {
          select: {
            studentProfiles: true,
            subjects: true,
            courseAssignments: true,
          },
        },
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    );
  }
}

// DELETE /api/institution/classes/[id] - Delete class
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = createClient()
    const { id } = await params;

    // Check if class exists
    const existingClass = await db.schoolClass.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if class has students
    const studentCount = await db.studentProfile.count({
      where: { classId: id },
    });

    if (studentCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete class with enrolled students. Please reassign or remove students first.' },
        { status: 400 }
      );
    }

    await db.schoolClass.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    );
  }
}
