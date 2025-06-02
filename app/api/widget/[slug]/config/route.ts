import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Waitlist slug is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const waitlist = await prisma.waitlist.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        customization: true,
        _count: {
          select: {
            signups: true,
          },
        },
      },
    });

    if (!waitlist) {
      return NextResponse.json(
        { error: "Waitlist not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const defaultCustomization = {
      theme: "light",
      formWidth: 400,
      buttonColor: "#3b82f6",
      buttonTextColor: "#ffffff",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      borderRadius: 8,
      includeLeaderboard: true,
      referrerTracking: true,
      includeBrandBadge: false,
      includeNameField: true,
      buttonText: "Join Waitlist",
      headerText: `Join ${waitlist.name}`,
      descriptionText: "Be the first to know when we launch!",
      placeholderText: "Enter your email",
      animation: "fade",
      fontSize: 16,
      padding: 24,
      shadowIntensity: 2,
    };

    const customization =
      waitlist.customization && typeof waitlist.customization === "object"
        ? { ...defaultCustomization, ...waitlist.customization }
        : defaultCustomization;

    return NextResponse.json(
      {
        waitlist: {
          id: waitlist.id,
          name: waitlist.name,
          slug: waitlist.slug,
          signupCount: waitlist._count.signups,
        },
        customization,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error fetching waitlist config:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist configuration" },
      { status: 500, headers: corsHeaders }
    );
  }
}
