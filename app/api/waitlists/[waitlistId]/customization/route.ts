import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const customizationSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]),
  formWidth: z.number().min(300).max(800),
  buttonColor: z.string(),
  buttonTextColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  borderRadius: z.number().min(0).max(24),
  includeLeaderboard: z.boolean(),
  referrerTracking: z.boolean(),
  includeBrandBadge: z.boolean(),
  includeNameField: z.boolean(),
  buttonText: z.string(),
  headerText: z.string(),
  descriptionText: z.string(),
  placeholderText: z.string(),
  animation: z.enum(["none", "fade", "slide", "bounce"]),
  fontSize: z.number().min(12).max(24),
  padding: z.number().min(12).max(48),
  shadowIntensity: z.number().min(0).max(10),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ waitlistId: string }> }
) {
  try {
    const { waitlistId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const waitlist = await prisma.waitlist.findFirst({
      where: {
        id: waitlistId,
        ownerId: session.user.id,
      },
    });

    if (!waitlist) {
      return NextResponse.json(
        { error: "Waitlist not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = customizationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid customization data", details: validation.error },
        { status: 400 }
      );
    }

    const updatedWaitlist = await prisma.waitlist.update({
      where: { id: waitlistId },
      data: {
        customization: validation.data,
      },
    });

    return NextResponse.json(updatedWaitlist);
  } catch (error) {
    console.error("Error updating customization:", error);
    return NextResponse.json(
      { error: "Failed to update customization" },
      { status: 500 }
    );
  }
}
