// Type definitions
export type Waitlist = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  ownerId: string;
};

// Helper function to get the base URL
function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: Use relative URL
    return "";
  }
  // Server-side: Need absolute URL
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = process.env.VERCEL_URL || process.env.HOST || "localhost:3000";
  return `${protocol}://${host}`;
}

// Fetch waitlists for the authenticated user
export async function getUserWaitlists(
  serverHeaders?: Headers
): Promise<Waitlist[]> {
  const baseUrl = getBaseUrl();

  // Prepare headers with authentication cookies if on server-side
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // If server headers are provided, forward the cookie header for authentication
  if (serverHeaders && serverHeaders.has("cookie")) {
    headers["cookie"] = serverHeaders.get("cookie") as string;
  }

  const response = await fetch(`${baseUrl}/api/waitlists`, {
    method: "GET",
    headers,
    // This ensures the request isn't cached and is made fresh every time
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch waitlists");
  }

  return response.json();
}

// Create a new waitlist for the authenticated user
export async function createWaitlist(
  data: {
    name: string;
    slug: string;
  },
  serverHeaders?: Headers
): Promise<Waitlist> {
  const baseUrl = getBaseUrl();

  // Prepare headers with authentication cookies if on server-side
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // If server headers are provided, forward the cookie header for authentication
  if (serverHeaders && serverHeaders.has("cookie")) {
    headers["cookie"] = serverHeaders.get("cookie") as string;
  }

  const response = await fetch(`${baseUrl}/api/waitlists`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    // This ensures the request isn't cached and is made fresh every time
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create waitlist");
  }

  return response.json();
}
