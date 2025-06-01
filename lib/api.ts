// Type definitions
export type Waitlist = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  ownerId: string;
  description?: string;
  logo?: string;
};

export type WaitlistWithDetails = Waitlist & {
  owner: {
    name: string | null;
    email: string;
  };
  _count: {
    signups: number;
  };
};

export type SignupData = {
  email: string;
  name?: string;
  waitlistSlug: string;
  referredBy?: string;
};

export type SignupResult = {
  success: boolean;
  message: string;
  referralId?: string;
  position?: number;
};

// Helper function to get the base URL
export function getBaseUrl() {
  // Use environment variables to determine the base URL consistently between client and server
  const host =
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.NEXT_PUBLIC_HOST ||
    "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

// Fetch waitlists for the authenticated user
export async function getUserWaitlists(
  serverHeaders?: Headers
): Promise<Waitlist[]> {
  const baseUrl = getBaseUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (serverHeaders && serverHeaders.has("cookie")) {
    headers["cookie"] = serverHeaders.get("cookie") as string;
  }

  const response = await fetch(`${baseUrl}/api/waitlists`, {
    method: "GET",
    headers,
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

// Get waitlist by slug (public endpoint)
export async function getWaitlistBySlug(
  slug: string
): Promise<WaitlistWithDetails> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/waitlist/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch waitlist");
  }

  return response.json();
}

// Sign up to a waitlist (client-side)
export async function createSignup(data: SignupData): Promise<SignupResult> {
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/api/waitlist/${data.waitlistSlug}/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          referredBy: data.referredBy,
        }),
      }
    );

    return response.json();
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "Failed to join waitlist. Please try again.",
    };
  }
}
