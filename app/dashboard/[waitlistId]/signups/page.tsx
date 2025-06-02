import { getWaitlistOverview } from "@/lib/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { SignupsClient } from "./signups-client";

interface SignupsPageProps {
  params: Promise<{
    waitlistId: string;
  }>;
}

export default async function SignupsPage({ params }: SignupsPageProps) {
  const { waitlistId } = await params;
  const requestHeaders = await headers();

  let waitlistData;
  try {
    waitlistData = await getWaitlistOverview(waitlistId, requestHeaders);
  } catch (error) {
    console.error("Error fetching waitlist data:", error);
    notFound();
  }

  return <SignupsClient waitlistData={waitlistData} />;
}
