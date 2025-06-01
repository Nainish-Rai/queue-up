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

    const signupsWithReferralData = await Promise.all(
      waitlist.signups.map(async (signup) => {
        const referralCount = await prisma.signup.count({
          where: { referredBy: signup.referralId },
        });

        let referrerName = "";
        if (signup.referredBy) {
          const referrer = await prisma.signup.findFirst({
            where: { referralId: signup.referredBy },
            select: { name: true, email: true },
          });
          referrerName = referrer?.name || referrer?.email || "";
        }

        return {
          name: signup.name || "",
          email: signup.email,
          referralCount,
          referredBy: referrerName,
          dateJoined: signup.createdAt.toISOString().split("T")[0],
          referralId: signup.referralId || "",
        };
      })
    );

    const csvHeaders = [
      "Name",
      "Email",
      "Referral Count",
      "Referred By",
      "Date Joined",
      "Referral ID",
    ];

    const csvRows = signupsWithReferralData.map((signup) => [
      `"${signup.name}"`,
      `"${signup.email}"`,
      signup.referralCount.toString(),
      `"${signup.referredBy}"`,
      signup.dateJoined,
      `"${signup.referralId}"`,
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${waitlist.slug}-signups.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting signups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
