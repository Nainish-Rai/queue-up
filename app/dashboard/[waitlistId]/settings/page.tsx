import { getWaitlistOverview } from "@/lib/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { WaitlistCustomizer } from "@/components/waitlist-customizer/index";

interface WaitlistSettingsPageProps {
  params: Promise<{
    waitlistId: string;
  }>;
}

export default async function WaitlistSettingsPage({
  params,
}: WaitlistSettingsPageProps) {
  const { waitlistId } = await params;
  const requestHeaders = await headers();

  let waitlistData;
  try {
    waitlistData = await getWaitlistOverview(waitlistId, requestHeaders);
  } catch (error) {
    console.error("Error fetching waitlist overview:", error);
    notFound();
  }

  return (
    <div className="h-[calc(100vh-7.1rem)]  flex flex-col overflow-hidden">
      {/* <div className="p-4 md:p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Customize your waitlist appearance and embed options
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="outline" className="text-xs md:text-sm">
            {waitlistData.name}
          </Badge>
          <span className="text-xs md:text-sm text-muted-foreground">
            /{waitlistData.slug}
          </span>
        </div>
      </div> */}

      <div className="flex-1 overflow-hidden px-4 min-w-0">
        <WaitlistCustomizer
          waitlistName={waitlistData.name}
          waitlistSlug={waitlistData.slug}
        />
      </div>
    </div>
  );
}
