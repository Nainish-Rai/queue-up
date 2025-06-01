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

    // Create the new signup
    const newSignup = await prisma.signup.create({
      data: {
        email,
        name: name || null,
        waitlistId: waitlist.id,
        ...(referredBy ? { referredBy } : {}),
        referralId,
      },
    });

    // If there's a referrer, increment their referral count
    if (referredBy) {
      try {
        // Find the referrer's signup
        const referrerSignup = await prisma.signup.findFirst({
          where: {
            referralId: referredBy,
            waitlistId: waitlist.id,
          },
        });

        // If referrer exists, update their referral count in a separate field
        // (This would require a schema modification, but we're handling the count logic here)
        if (referrerSignup) {
          // Count how many people this user has referred
          const referralsCount = await prisma.signup.count({
            where: {
              referredBy: referredBy,
              waitlistId: waitlist.id,
            },
          });

          console.log(
            `User with referralId ${referredBy} has referred ${referralsCount} people`
          );
        }
      } catch (referralError) {
        // Log but don't fail if referral processing has issues
        console.error("Error processing referral:", referralError);
      }
    }

    // Calculate user's position in the waitlist
    const signupsBeforeUser = await prisma.signup.count({
      where: {
        waitlistId: waitlist.id,
        createdAt: {
          lt: newSignup.createdAt,
        },
      },
    });

    // Position is 1-based (first person is #1)
    const position = signupsBeforeUser + 1;

    return NextResponse.json({
      success: true,
      message: "Successfully joined the waitlist!",
      referralId,
      position,
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
