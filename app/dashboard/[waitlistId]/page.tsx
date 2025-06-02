import { getWaitlistOverview } from "@/lib/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { WaitlistOverviewClient } from "./waitlist-overview-client";

interface WaitlistOverviewPageProps {
  params: Promise<{
    waitlistId: string;
  }>;
}

export default async function WaitlistOverviewPage({
  params,
}: WaitlistOverviewPageProps) {
  const { waitlistId } = await params;
  const requestHeaders = await headers();

  let waitlistData;
  try {
    waitlistData = await getWaitlistOverview(waitlistId, requestHeaders);
  } catch (error) {
    console.error("Error fetching waitlist overview:", error);
    notFound();
  }

  const publicUrl = `/waitlist/${waitlistData.slug}`;

  return (
    <WaitlistOverviewClient waitlistData={waitlistData} publicUrl={publicUrl} />
  );
}
