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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure your waitlist settings and embed options
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-muted-foreground">Waitlist:</span>
            <Badge variant="outline">{waitlistData.name}</Badge>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Embed Code Generator
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate customizable embed code to add your waitlist to any
                website
              </p>
            </CardHeader>
            <CardContent>
              <EmbedCodeGenerator
                waitlistSlug={waitlistData.slug}
                waitlistName={waitlistData.name}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
