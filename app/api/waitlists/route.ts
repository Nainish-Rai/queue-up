import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log(session, "session");

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const waitlists = await prisma.waitlist.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(waitlists);
  } catch (error) {
    console.error("Error fetching waitlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { name, slug } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug must contain only lowercase letters, numbers and hyphens",
        },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existing = await prisma.waitlist.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A waitlist with this slug already exists" },
        { status: 409 }
      );
    }

    const newWaitlist = await prisma.waitlist.create({
      data: {
        name,
        slug,
        createdAt: new Date(),
        owner: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json(newWaitlist, { status: 201 });
  } catch (error) {
    console.error("Error creating waitlist:", error);
    return NextResponse.json(
      { error: "Failed to create waitlist" },
      { status: 500 }
    );
  }
}
