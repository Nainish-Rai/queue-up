import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import type { Waitlist } from "@prisma/client";

interface WaitlistCardProps {
  waitlist: Waitlist;
}

export function WaitlistCard({ waitlist }: WaitlistCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{waitlist.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Slug:{" "}
          <span className="font-mono bg-gray-100 px-1 rounded">
            {waitlist.slug}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Created{" "}
          {formatDistanceToNow(new Date(waitlist.createdAt), {
            addSuffix: true,
          })}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/dashboard/waitlists/${waitlist.id}`}>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </Link>
        <Link href={`/waitlist/${waitlist.slug}`} target="_blank">
          <Button variant="ghost" size="sm">
            View Page
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
