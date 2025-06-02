import { getWaitlistOverview } from "@/lib/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { AnalyticsClient } from "./analytics-client";

interface AnalyticsPageProps {
  params: Promise<{
    waitlistId: string;
  }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { waitlistId } = await params;
  const requestHeaders = await headers();

  let waitlistData;
  try {
    waitlistData = await getWaitlistOverview(waitlistId, requestHeaders);
  } catch (error) {
    console.error("Error fetching waitlist data:", error);
    notFound();
  }

  return (
    <AnalyticsClient waitlistId={waitlistId} waitlistName={waitlistData.name} />
  );
}
