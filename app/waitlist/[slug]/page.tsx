import { getWaitlistBySlug } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ExternalLink, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { SignupForm } from "@/components/waitlist/SignupForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface WaitlistPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    ref?: string;
  }>;
}

export default async function WaitlistPage({
  params,
  searchParams,
}: WaitlistPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { slug } = await params;
  const { ref } = await searchParams;

  let waitlist;
  try {
    waitlist = await getWaitlistBySlug(slug);
  } catch (error: unknown) {
    console.error("Error fetching waitlist:", error);
    notFound();
  }

  if (waitlist.ownerId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            {waitlist.logo && (
              <div className="w-16 h-16 rounded-xl overflow-hidden border bg-card shadow-lg">
                <Image
                  src={waitlist.logo}
                  alt={`${waitlist.name} logo`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {waitlist.name}
              </h1>
              <Badge
                variant="secondary"
                className="mt-2 bg-primary/10 text-primary border-primary/20"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Early Access
              </Badge>
            </div>
          </div>

          {waitlist.description && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {waitlist.description}
            </p>
          )}

          {ref && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
              <Users className="w-4 h-4" />
              You were referred by a friend!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SignupForm waitlistSlug={slug} referredBy={ref} />
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {waitlist._count.signups.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {waitlist._count.signups === 1
                      ? "person has"
                      : "people have"}{" "}
                    joined
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((waitlist._count.signups / 100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Launched{" "}
                    <span className="font-medium text-foreground">
                      {formatDistanceToNow(new Date(waitlist.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {waitlist.owner.name && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Created by</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-lg font-semibold text-primary">
                        {waitlist.owner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{waitlist.owner.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {waitlist.owner.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-6 py-4 bg-muted/50 rounded-2xl border">
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-medium text-primary"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Sublist
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
