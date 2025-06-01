"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  List,
  Plus,
  Menu,
  X,
  Settings,
  BarChart3,
} from "lucide-react";
import { CreateWaitlistDialog } from "@/app/components/waitlist/CreateWaitlistDialog";

interface Waitlist {
  id: string;
  name: string;
  signupCount: number;
}

export function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchWaitlists = async () => {
      try {
        const data = await fetch("/api/waitlists").then((res) => res.json());
        setWaitlists(data);
      } catch (error) {
        console.error("Failed to fetch waitlists:", error);
      }
    };

    fetchWaitlists();
  }, []);

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard" && pathname === "/dashboard") return true;
    if (route !== "/dashboard" && pathname.startsWith(route)) return true;
    return false;
  };

  const currentWaitlistId = pathname.split("/")[2];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <List className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Sublist</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActiveRoute("/dashboard")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Waitlists
                </h3>
                <CreateWaitlistDialog
                  trigger={
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                  }
                />
              </div>

              {waitlists.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No waitlists yet
                </div>
              ) : (
                <div className="space-y-1">
                  {waitlists.map((waitlist) => (
                    <div key={waitlist.id} className="space-y-1">
                      <Link
                        href={`/dashboard/${waitlist.id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          pathname === `/dashboard/${waitlist.id}`
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <List className="w-4 h-4" />
                        <span className="truncate flex-1">{waitlist.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {waitlist.signupCount || 0}
                        </Badge>
                      </Link>

                      {currentWaitlistId === waitlist.id && (
                        <div className="ml-6 space-y-1">
                          <Link
                            href={`/dashboard/${waitlist.id}`}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors ${
                              pathname === `/dashboard/${waitlist.id}`
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <BarChart3 className="w-3 h-3" />
                            <span>Analytics</span>
                          </Link>
                          <Link
                            href={`/dashboard/${waitlist.id}/settings`}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors ${
                              pathname === `/dashboard/${waitlist.id}/settings`
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="w-3 h-3" />
                            <span>Settings</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
