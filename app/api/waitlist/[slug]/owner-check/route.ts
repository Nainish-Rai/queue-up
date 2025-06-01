import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ isOwner: false }, { status: 401 });
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ isOwner: false }, { status: 400 });
    }

    const waitlist = await prisma.waitlist.findUnique({
      where: { slug },
      select: {
        ownerId: true,
      },
    });

    if (!waitlist) {
      return NextResponse.json({ isOwner: false }, { status: 404 });
    }

    const isOwner = waitlist.ownerId === session.user.id;

    return NextResponse.json({ isOwner });
  } catch (error) {
    console.error("Error checking waitlist ownership:", error);
    return NextResponse.json({ isOwner: false }, { status: 500 });
  }
}
