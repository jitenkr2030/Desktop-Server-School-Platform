import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/institution/classes - List all classes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const level = searchParams.get('level') || '';
    const isActive = searchParams.get('isActive');

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (level) {
      where.level = level;
    }

    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    const [classes, total] = await Promise.all([
      prisma.schoolClass.findMany({
        where,
        include: {
          _count: {
            select: {
              studentProfiles: true,
              subjects: true,
              courseAssignments: true,
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.schoolClass.count({ where }),
    ]);

    return NextResponse.json({
      classes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

// POST /api/institution/classes - Create new class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, level, sortOrder, isActive = true } = body;

    if (!name || !level) {
      return NextResponse.json(
        { error: 'Name and level are required' },
        { status: 400 }
      );
    }

    // Check if class with same name exists
    const existingClass = await prisma.schoolClass.findUnique({
      where: { name },
    });

    if (existingClass) {
      return NextResponse.json(
        { error: 'A class with this name already exists' },
        { status: 409 }
      );
    }

    const newClass = await prisma.schoolClass.create({
      data: {
        name,
        level,
        sortOrder: sortOrder || 0,
        isActive,
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

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}
