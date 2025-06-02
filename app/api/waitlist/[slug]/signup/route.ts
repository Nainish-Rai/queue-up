import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  referredBy: z.string().optional(),
});

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Waitlist slug is required",
        },
        { status: 400, headers: corsHeaders }
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
        { status: 404, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
      );
    }

    const { email, name, referredBy } = validation.data;

    // Check if email already exists for this waitlist
    const existingSignup = await prisma.signup.findFirst({
      where: {
        email,
        waitlistId: waitlist.id,
      },
    });

    if (existingSignup) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is already on the waitlist",
        },
        { status: 409, headers: corsHeaders }
      );
    }

    // Generate unique referral ID
    const referralId = nanoid(8);

    // Create signup
    const signup = await prisma.signup.create({
      data: {
        email,
        name,
        referralId,
        referredBy,
        waitlist: {
          connect: { id: waitlist.id },
        },
      },
    });

    // Get position on waitlist
    const position = await prisma.signup.count({
      where: {
        waitlistId: waitlist.id,
        createdAt: {
          lte: signup.createdAt,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully joined the waitlist!",
        position,
        referralId: signup.referralId,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating signup:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
