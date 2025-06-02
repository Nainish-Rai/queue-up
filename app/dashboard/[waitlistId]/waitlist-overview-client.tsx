"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import {
  Users,
  Calendar,
  Trophy,
  LinkIcon,
  ExternalLink,
  Settings,
} from "lucide-react";
import Link from "next/link";

import AnimatedStatsCard from "@/components/animated-stats-card";
import { ExportButton } from "@/components/ExportButton";
import { SignupsTable } from "@/components/SignupsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WaitlistOverview } from "@/lib/api";

interface WaitlistOverviewClientProps {
  waitlistData: WaitlistOverview;
  publicUrl: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function WaitlistOverviewClient({
  waitlistData,
  publicUrl,
}: WaitlistOverviewClientProps) {
  return (
    <motion.div
      className="max-w-7xl p-4 mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl times font-medium">{waitlistData.name}</h1>
          <Badge className="text-black dark:text-slate-50 dark:bg-black bg-transparent border border-border">
            / {waitlistData.slug}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/${waitlistData.id}/settings`}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Link href={publicUrl} target="_blank">
            <Button variant="outline" size="sm">
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
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedStatsCard
          title="Total Signups"
          value={waitlistData.signupCount}
          icon={<Users className="w-4 h-4" />}
          index={0}
        />

        <AnimatedStatsCard
          title="Created"
          value=""
          icon={<Calendar className="w-4 h-4" />}
          index={1}
        >
          <div className="text-sm dark:text-white/80">
            {formatDistanceToNow(new Date(waitlistData.createdAt), {
              addSuffix: true,
            })}
          </div>
          <div className="text-xs dark:text-white/60 mt-1">
            {format(new Date(waitlistData.createdAt), "MMM d, yyyy")}
          </div>
        </AnimatedStatsCard>

        <AnimatedStatsCard
          title="Top Referrer"
          value=""
          icon={<Trophy className="w-4 h-4" />}
          index={2}
        >
          {waitlistData.topReferrers.length > 0 ? (
            <div>
              <div className="font-medium text-sm dark:text-white">
                {waitlistData.topReferrers[0].name ||
                  waitlistData.topReferrers[0].email}
              </div>
              <div className="text-xs dark:text-white/70">
                {waitlistData.topReferrers[0].referralCount} referrals
              </div>
            </div>
          ) : (
            <div className="text-sm dark:text-white/70">No referrals yet</div>
          )}
        </AnimatedStatsCard>

        <AnimatedStatsCard
          title="Public Link"
          value=""
          icon={<LinkIcon className="w-4 h-4" />}
          index={3}
          onClick={() => window.open(publicUrl, "_blank")}
        >
          <div className="text-xs dark:text-white/80 font-mono bg-white/20 backdrop-blur-sm px-2 py-1 rounded truncate cursor-pointer hover:bg-white/30 transition-all">
            /waitlist/{waitlistData.slug}
          </div>
        </AnimatedStatsCard>
      </div>

      {waitlistData.topReferrers.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 opacity-5"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Top Referrers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {waitlistData.topReferrers.map((referrer, index) => (
                  <motion.div
                    key={referrer.referralId}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-sm font-medium text-primary">
                          #{index + 1}
                        </span>
                      </motion.div>
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-5"
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
          <CardHeader>
            <CardTitle>All Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <SignupsTable signups={waitlistData.signups} />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
