import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
      include: {
        signups: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!waitlist) {
      return NextResponse.json(
        { error: "Waitlist not found" },
        { status: 404 }
      );
    }

    const signupsWithReferralCount = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      waitlist.signups.map(async (signup: any) => {
        const referralCount = await prisma.signup.count({
          where: { referredBy: signup.referralId },
        });

        let referrerName: string | undefined;
        if (signup.referredBy) {
          const referrer = await prisma.signup.findFirst({
            where: { referralId: signup.referredBy },
            select: { name: true, email: true },
          });
          referrerName = referrer?.name || referrer?.email;
        }

        return {
          id: signup.id,
          email: signup.email,
          name: signup.name,
          referralId: signup.referralId,
          referredBy: signup.referredBy,
          createdAt: signup.createdAt,
          referralCount,
          referrerName,
        };
      })
    );

    const topReferrers = await prisma.signup.findMany({
      where: { waitlistId },
      select: {
        referralId: true,
        name: true,
        email: true,
      },
    });

    const referrerCounts = new Map<
      string,
      { name?: string; email: string; count: number }
    >();

    for (const signup of waitlist.signups) {
      if (signup.referredBy) {
        const current = referrerCounts.get(signup.referredBy) || {
          email: "",
          count: 0,
        };
        referrerCounts.set(signup.referredBy, {
          ...current,
          count: current.count + 1,
        });
      }
    }

    for (const referrer of topReferrers) {
      if (referrer.referralId && referrerCounts.has(referrer.referralId)) {
        const current = referrerCounts.get(referrer.referralId)!;
        referrerCounts.set(referrer.referralId, {
          ...current,
          name: referrer.name || "",
          email: referrer.email,
        });
      }
    }

    const topReferrersList = Array.from(referrerCounts.entries())
      .map(([referralId, data]) => ({
        referralId,
        name: data.name,
        email: data.email,
        referralCount: data.count,
      }))
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, 5);

    return NextResponse.json({
      id: waitlist.id,
      name: waitlist.name,
      slug: waitlist.slug,
      signupCount: waitlist.signups.length,
      createdAt: waitlist.createdAt,
      signups: signupsWithReferralCount,
      topReferrers: topReferrersList,
    });
  } catch (error) {
    console.error("Error fetching waitlist overview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
