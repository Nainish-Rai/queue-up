import { getWaitlistOverview } from "@/lib/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmbedCodeGenerator } from "@/components/embed-code-generator";
import { Settings, Code } from "lucide-react";

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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Configure your waitlist settings and embed options
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline">{waitlistData.name}</Badge>
          <span className="text-sm text-muted-foreground">
            /{waitlistData.slug}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Embed Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmbedCodeGenerator
            waitlistName={waitlistData.name}
            waitlistSlug={waitlistData.slug}
          />
        </CardContent>
      </Card>
    </div>
  );
}
