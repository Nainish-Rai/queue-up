import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { subDays, format, startOfDay } from "date-fns";

export async function GET(
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

    const thirtyDaysAgo = subDays(new Date(), 30);

    // Get daily signup counts for the last 30 days
    const dailySignups = await prisma.signup.groupBy({
      by: ["createdAt"],
      where: {
        waitlistId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    // Create a map for quick lookup
    const signupMap = new Map();
    dailySignups.forEach((item) => {
      const date = format(startOfDay(item.createdAt), "yyyy-MM-dd");
      signupMap.set(date, item._count.id);
    });

    // Generate complete 30-day dataset with cumulative counts
    const analyticsData = [];
    let cumulativeTotal = 0;

    // Get total signups before the 30-day period
    const previousSignups = await prisma.signup.count({
      where: {
        waitlistId,
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    cumulativeTotal = previousSignups;

    for (let i = 29; i >= 0; i--) {
      const currentDate = subDays(new Date(), i);
      const dateKey = format(currentDate, "yyyy-MM-dd");
      const dailyCount = signupMap.get(dateKey) || 0;

      cumulativeTotal += dailyCount;

      analyticsData.push({
        date: format(currentDate, "MMM dd"),
        fullDate: dateKey,
        signups: dailyCount,
        totalSignups: cumulativeTotal,
      });
    }

    // Get additional metrics
    const totalSignups = await prisma.signup.count({
      where: { waitlistId },
    });

    const last7DaysSignups = await prisma.signup.count({
      where: {
        waitlistId,
        createdAt: {
          gte: subDays(new Date(), 7),
        },
      },
    });

    const previousWeekSignups = await prisma.signup.count({
      where: {
        waitlistId,
        createdAt: {
          gte: subDays(new Date(), 14),
          lt: subDays(new Date(), 7),
        },
      },
    });

    const weeklyGrowth =
      previousWeekSignups > 0
        ? ((last7DaysSignups - previousWeekSignups) / previousWeekSignups) * 100
        : last7DaysSignups > 0
          ? 100
          : 0;

    return NextResponse.json({
      analyticsData,
      metrics: {
        totalSignups,
        last7DaysSignups,
        weeklyGrowth: Math.round(weeklyGrowth * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
