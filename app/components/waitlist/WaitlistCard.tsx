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
import type { Waitlist } from "@prisma/client";
import { ExternalLink, Settings, Calendar, Hash } from "lucide-react";
import Link from "next/link";

interface WaitlistCardProps {
  waitlist: Waitlist;
}

export function WaitlistCard({ waitlist }: WaitlistCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-muted hover:border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {waitlist.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hash className="w-4 h-4" />
          <span className="font-mono bg-muted px-2 py-1 rounded-md text-xs">
            {waitlist.slug}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            Created{" "}
            {formatDistanceToNow(new Date(waitlist.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t bg-muted/30">
        <div className="flex w-full gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/dashboard/waitlists/${waitlist.id}`}>
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="flex-1">
            <Link href={`/waitlist/${waitlist.slug}`} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
