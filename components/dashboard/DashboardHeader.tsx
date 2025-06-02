"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfile } from "@/components/auth/UserProfile";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  session: {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [waitlistName, setWaitlistName] = useState<string>("");

  useEffect(() => {
    const fetchWaitlistName = async () => {
      const pathSegments = pathname.split("/");
      if (pathSegments[1] === "dashboard" && pathSegments[2]) {
        try {
          const response = await fetch(`/api/waitlists/${pathSegments[2]}`);
          if (response.ok) {
            const data = await response.json();
            setWaitlistName(data.name);
          }
        } catch (error) {
          console.error("Failed to fetch waitlist name:", error);
        }
      }
    };

    fetchWaitlistName();
  }, [pathname]);

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    breadcrumbs.push({
      label: "Dashboard",
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    });

    if (pathSegments[1] && pathSegments[2]) {
      breadcrumbs.push({
        label: waitlistName || "Waitlist",
        href: `/dashboard/${pathSegments[2]}`,
        isActive: pathname === `/dashboard/${pathSegments[2]}`,
      });

      if (pathSegments[3] === "settings") {
        breadcrumbs.push({
          label: "Settings",
          href: `/dashboard/${pathSegments[2]}/settings`,
          isActive: true,
        });
      }

      if (pathSegments[3] === "signups") {
        breadcrumbs.push({
          label: "Signups",
          href: `/dashboard/${pathSegments[2]}/signups`,
          isActive: true,
        });
      }

      if (pathSegments[3] === "integrations") {
        breadcrumbs.push({
          label: "Integrations",
          href: `/dashboard/${pathSegments[2]}/integrations`,
          isActive: true,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-30 lg:pl-0 pl-16">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center space-x-2">
          <nav className="flex items-center space-x-1 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                )}
                {breadcrumb.isActive ? (
                  <span className="font-medium text-foreground">
                    {breadcrumb.label}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {breadcrumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden lg:block">
            <UserProfile initialSession={session} variant="navbar" />
          </div>
        </div>
      </div>
    </header>
  );
}
