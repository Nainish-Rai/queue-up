import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Waitlist } from "@/lib/api";
import { ExternalLink, Settings, Calendar, Hash, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface WaitlistCardProps {
  waitlist: Waitlist & { isOptimistic?: boolean };
  index?: number;
}

export function WaitlistCard({ waitlist, index = 0 }: WaitlistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      layout
      layoutId={`waitlist-${waitlist.id}`}
    >
      <Card
        className={`group hover:shadow-lg transition-all duration-300 border-muted hover:border-border ${
          waitlist.isOptimistic ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
              {waitlist.isOptimistic && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              )}
              {waitlist.name}
            </CardTitle>
            <Badge
              variant={waitlist.isOptimistic ? "outline" : "secondary"}
              className="text-xs"
            >
              {waitlist.isOptimistic ? "Creating..." : "Active"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Hash className="w-4 h-4" />
            <span className="font-mono bg-muted px-2 py-1 rounded-md text-xs">
              {waitlist.slug}
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Calendar className="w-4 h-4" />
            <span>
              Created{" "}
              {formatDistanceToNow(new Date(waitlist.createdAt), {
                addSuffix: true,
              })}
            </span>
          </motion.div>
        </CardContent>

        <CardFooter className="pt-3 border-t bg-muted/30">
          <motion.div
            className="flex w-full gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 hover:scale-105 transition-transform"
              disabled={waitlist.isOptimistic}
            >
              <Link href={`/dashboard/${waitlist.id}`}>
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex-1 hover:scale-105 transition-transform"
              disabled={waitlist.isOptimistic}
            >
              <Link href={`/waitlist/${waitlist.slug}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
