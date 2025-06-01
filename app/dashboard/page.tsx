import { getUserWaitlists } from "@/lib/api";
import { auth } from "@/lib/auth";
import { UserProfile } from "@/app/components/auth/UserProfile";
import { redirect } from "next/navigation";
import { WaitlistCard } from "../components/waitlist/WaitlistCard";
import { CreateWaitlistDialog } from "../components/waitlist/CreateWaitlistDialog";
import { headers } from "next/headers";

export default async function DashboardPage() {
  // Get session using the correct Better Auth method
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Server-side redirect if not authenticated
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Get request headers to pass along for authentication
  const requestHeaders = await headers();

  // Fetch the user's waitlists with authentication headers
  const waitlists = await getUserWaitlists(requestHeaders);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <CreateWaitlistDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <UserProfile />
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Waitlists</h2>

              {waitlists.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">
                    You haven&apos;t created any waitlists yet.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the &quot;Create Waitlist&quot; button to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {waitlists.map((waitlist) => (
                    <WaitlistCard key={waitlist.id} waitlist={waitlist} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
