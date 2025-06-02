"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupsTable } from "@/components/SignupsTable";
import { ExportButton } from "@/components/ExportButton";
import type { WaitlistOverview } from "@/lib/api";

interface SignupsClientProps {
  waitlistData: WaitlistOverview;
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

export function SignupsClient({ waitlistData }: SignupsClientProps) {
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
          <h1 className="text-3xl times font-medium">Signups</h1>
          <p className="text-muted-foreground mt-1">
            All signups for {waitlistData.name}
          </p>
        </div>
        <ExportButton
          waitlistId={waitlistData.id}
          waitlistSlug={waitlistData.slug}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Signups ({waitlistData.signupCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <SignupsTable signups={waitlistData.signups} />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
