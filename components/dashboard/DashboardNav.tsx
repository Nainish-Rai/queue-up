"use client";

import { useState, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  List,
  Plus,
  Menu,
  X,
  Settings,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { CreateWaitlistDialog } from "@/components/waitlist/CreateWaitlistDialog";
import { useWaitlists } from "@/app/providers/WaitlistProvider";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Waitlist } from "@prisma/client";
import { GalleryVerticalEndIcon } from "../ui/gallery-vertical-end";

const gradients = [
  "from-purple-600 via-pink-600 to-blue-600",
  "from-green-400 via-blue-500 to-purple-600",
  "from-yellow-400 via-red-500 to-pink-500",
  "from-indigo-400 via-purple-500 to-pink-500",
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-orange-400 via-red-500 to-yellow-500",
  "from-teal-400 via-green-500 to-blue-500",
  "from-rose-400 via-pink-500 to-purple-600",
];

function generateGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return gradients[Math.abs(hash) % gradients.length];
}

interface WaitlistItemProps {
  waitlist: Waitlist;
  isExpanded: boolean;
  onToggle: () => void;
  pathname: string;
  onLinkClick: () => void;
}

function WaitlistItem({
  waitlist,
  isExpanded,
  onToggle,
  pathname,
  onLinkClick,
}: WaitlistItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  const gradientClass = generateGradient(waitlist.id);
  const isActive = pathname.startsWith(`/dashboard/${waitlist.id}`);

  const handleMouseEnter = () => {
    scale.set(1.02);
    rotateY.set(2);
  };

  const handleMouseLeave = () => {
    scale.set(1);
    rotateY.set(0);
  };

  return (
    <div className="space-y-1">
      <motion.div
        ref={ref}
        className={`relative overflow-hidden  transition-all duration-300 cursor-pointer group ${
          isActive ? "ring-2 ring-primary/20" : ""
        }`}
        style={{ scale, rotateY }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onToggle}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10 group-hover:opacity-50 transition-opacity duration-300 `}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)] group-hover:opacity-100 opacity-0 transition-opacity duration-300" />

        <div className="relative px-3 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass} shadow-lg`}
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium truncate block group-hover:text-primary transition-colors">
                {waitlist.name}
              </span>
              {/* <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs px-1.5 py-0.5 bg-background/50"
                >
                  {waitlist.slug}
                </Badge>
              </div> */}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="text-muted-foreground group-hover:text-primary transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-4 space-y-1 py-1 border-l border-border/50 pl-4">
              <Link
                href={`/dashboard/${waitlist.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 ${
                  pathname === `/dashboard/${waitlist.id}`
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
                onClick={onLinkClick}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Analytics</span>
              </Link>
              <Link
                href={`/dashboard/${waitlist.id}/settings`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 ${
                  pathname === `/dashboard/${waitlist.id}/settings`
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
                onClick={onLinkClick}
              >
                <Settings className="w-3 h-3" />
                <span>Settings</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedWaitlist, setExpandedWaitlist] = useState<string | null>(null);
  const { waitlists, isLoading } = useWaitlists();
  const pathname = usePathname();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard" && pathname === "/dashboard") return true;
    if (route !== "/dashboard" && pathname.startsWith(route)) return true;
    return false;
  };

  const currentWaitlistId = pathname.split("/")[2];

  const toggleWaitlist = (waitlistId: string) => {
    setExpandedWaitlist(expandedWaitlist === waitlistId ? null : waitlistId);
  };

  const isWaitlistExpanded = (waitlistId: string) => {
    return expandedWaitlist === waitlistId || currentWaitlistId === waitlistId;
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden backdrop-blur-sm bg-background/80"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isOpen || isLargeScreen ? 0 : "-100%",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 left-0 rounded-2xl  z-40 w-64 h-full bg-card/95 backdrop-blur-xl border-r border-border/50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-background border" />
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(120,119,198,0.1),transparent_50%)]" /> */}

        <div className="relative flex flex-col h-full">
          <motion.div
            className="p-6 border-b border-border/50 backdrop-blur-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <GalleryVerticalEndIcon />

                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <span className="text-xl font-medium ">Queue Up</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  Beta v1
                </div>
              </div>
            </Link>
          </motion.div>

          <nav className="flex-1 p-3 space-y-3 hide-scrollbar overflow-y-auto">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActiveRoute("/dashboard")
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-accent/50 hover:scale-105"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {isActiveRoute("/dashboard") && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />
                )}
                <div className="relative flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Overview</span>
                </div>
              </Link>
            </motion.div>

            <Separator className="my-4 opacity-50" />

            <motion.div
              className="space-y-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Waitlists
                </h3>
                <CreateWaitlistDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  }
                />
              </div>

              {isLoading ? (
                <div className="px-3 py-6 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Loading waitlists...
                  </p>
                </div>
              ) : waitlists.length === 0 ? (
                <motion.div
                  className="px-3 py-6 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <List className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    No waitlists yet
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Create your first waitlist to get started
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-2 scrollbar-hide hide-scrollbar overflow-y-auto">
                  {waitlists.map((waitlist, index) => (
                    <motion.div
                      key={waitlist.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <WaitlistItem
                        waitlist={waitlist}
                        isExpanded={isWaitlistExpanded(waitlist.id)}
                        onToggle={() => toggleWaitlist(waitlist.id)}
                        pathname={pathname}
                        onLinkClick={() => setIsOpen(false)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </nav>
        </div>
      </motion.aside>
    </>
  );
}
