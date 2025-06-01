import { getWaitlistOverview } from "@/lib/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  ExternalLink,
  Trophy,
  Link as LinkIcon,
  Settings,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { SignupsTable } from "../../../components/SignupsTable";
import { ExportButton } from "../../../components/ExportButton";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {waitlistData.name}
              </h1>
              <p className="text-muted-foreground mt-1">/{waitlistData.slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/${waitlistData.id}/settings`}>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link href={publicUrl} target="_blank">
                <Button variant="outline">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  View Public Page
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </Link>
              <ExportButton
                waitlistId={waitlistData.id}
                waitlistSlug={waitlistData.slug}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-4 h-4 text-primary" />
                  Total Signups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {waitlistData.signupCount}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-4 h-4 text-primary" />
                  Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(waitlistData.createdAt), {
                    addSuffix: true,
                  })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(new Date(waitlistData.createdAt), "MMM d, yyyy")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="w-4 h-4 text-primary" />
                  Top Referrer
                </CardTitle>
              </CardHeader>
              <CardContent>
                {waitlistData.topReferrers.length > 0 ? (
                  <div>
                    <div className="font-medium text-sm">
                      {waitlistData.topReferrers[0].name ||
                        waitlistData.topReferrers[0].email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {waitlistData.topReferrers[0].referralCount} referrals
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No referrals yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  Public Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={publicUrl} target="_blank">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-left justify-start"
                  >
                    <div className="text-xs text-blue-600 hover:text-blue-800 truncate">
                      /waitlist/{waitlistData.slug}
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {waitlistData.topReferrers.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Top Referrers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {waitlistData.topReferrers.map((referrer, index) => (
                    <div
                      key={referrer.referralId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {referrer.name || referrer.email}
                          </div>
                          {referrer.name && (
                            <div className="text-sm text-muted-foreground">
                              {referrer.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {referrer.referralCount} referrals
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <SignupsTable signups={waitlistData.signups} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
