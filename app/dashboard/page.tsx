import { getUserWaitlists } from "@/lib/api";
import { auth } from "@/lib/auth";
import { UserProfile } from "@/app/components/auth/UserProfile";
import { redirect } from "next/navigation";
import { WaitlistCard } from "../components/waitlist/WaitlistCard";
import { CreateWaitlistDialog } from "../components/waitlist/CreateWaitlistDialog";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { List } from "lucide-react";

function WaitlistsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 rounded-lg border bg-card">
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-40 mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
      <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
        <List className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No waitlists yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Get started by creating your first waitlist to collect and manage
        signups for your product or service.
      </p>
      <CreateWaitlistDialog />
    </div>
  );
}

async function WaitlistsGrid() {
  const requestHeaders = await headers();
  const waitlists = await getUserWaitlists(requestHeaders);

  if (waitlists.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {waitlists.map((waitlist) => (
        <WaitlistCard key={waitlist.id} waitlist={waitlist} />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your waitlists and track signups
            </p>
          </div>
          <div className="hidden sm:block">
            <CreateWaitlistDialog />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <UserProfile initialSession={session} />
            </div>
          </div>

          {/* Waitlists Section */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Your Waitlists</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage and monitor your active waitlists
                  </p>
                </div>
                <div className="sm:hidden">
                  <CreateWaitlistDialog />
                </div>
              </div>

              <Suspense fallback={<WaitlistsSkeleton />}>
                <WaitlistsGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
