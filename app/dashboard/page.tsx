"use client";

import { WaitlistCard } from "../components/waitlist/WaitlistCard";
import { CreateWaitlistDialog } from "../components/waitlist/CreateWaitlistDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { List, Sparkles } from "lucide-react";
import { useWaitlists } from "../providers/WaitlistProvider";
import { motion, AnimatePresence } from "framer-motion";

function WaitlistsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="p-6 rounded-lg border bg-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-40 mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-dashed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <List className="w-8 h-8 text-muted-foreground" />
      </motion.div>
      <motion.h3
        className="text-lg font-semibold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        No waitlists yet
      </motion.h3>
      <motion.p
        className="text-muted-foreground mb-6 max-w-sm mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Get started by creating your first waitlist to collect and manage
        signups for your product or service.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <CreateWaitlistDialog />
      </motion.div>
    </motion.div>
  );
}

function WaitlistsGrid() {
  const { waitlists, isLoading } = useWaitlists();

  if (isLoading) {
    return <WaitlistsSkeleton />;
  }

  if (waitlists.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      layout
    >
      <AnimatePresence mode="popLayout">
        {waitlists.map((waitlist, index) => (
          <WaitlistCard key={waitlist.id} waitlist={waitlist} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <motion.h1
              className="text-3xl font-bold tracking-tight flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              Overview
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage your waitlists and track signups
            </motion.p>
          </div>
          <motion.div
            className="sm:hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <CreateWaitlistDialog />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="bg-card rounded-xl border shadow-sm p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h2
              className="text-xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your Waitlists
            </motion.h2>
            <motion.p
              className="text-sm text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Manage and monitor your active waitlists
            </motion.p>
          </div>
          <motion.div
            className="hidden sm:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <CreateWaitlistDialog />
          </motion.div>
        </div>

        <WaitlistsGrid />
      </motion.div>
    </div>
  );
}
