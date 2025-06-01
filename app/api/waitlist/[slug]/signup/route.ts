import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  referredBy: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Waitlist slug is required",
        },
        { status: 400 }
      );
    }

    const waitlist = await prisma.waitlist.findUnique({
      where: { slug },
    });

    if (!waitlist) {
      return NextResponse.json(
        {
          success: false,
          message: "Waitlist not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.errors[0]?.message || "Invalid form data",
        },
        { status: 400 }
      );
    }

    const { email, name, referredBy } = validation.data;

    const existingSignup = await prisma.signup.findFirst({
      where: {
        email,
        waitlistId: waitlist.id,
      },
    });

    if (existingSignup) {
      return NextResponse.json({
        success: false,
        message: "You're already on this waitlist!",
      });
    }

    const referralId = nanoid(8);

    await prisma.signup.create({
      data: {
        email,
        name: name || null,
        waitlistId: waitlist.id,
        ...(referredBy ? { referredBy } : {}),
        referralId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully joined the waitlist!",
      referralId,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to join waitlist. Please try again.",
      },
      { status: 500 }
    );
  }
}
