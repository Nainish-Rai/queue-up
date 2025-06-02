import { getWaitlistOverview } from "@/lib/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { IntegrationsClient } from "./integrations-client";

interface IntegrationsPageProps {
  params: Promise<{
    waitlistId: string;
  }>;
}

export default async function IntegrationsPage({
  params,
}: IntegrationsPageProps) {
  const { waitlistId } = await params;
  const requestHeaders = await headers();

  let waitlistData;
  try {
    waitlistData = await getWaitlistOverview(waitlistId, requestHeaders);
  } catch (error) {
    console.error("Error fetching waitlist data:", error);
    notFound();
  }

  return <IntegrationsClient waitlistData={waitlistData} />;
}
