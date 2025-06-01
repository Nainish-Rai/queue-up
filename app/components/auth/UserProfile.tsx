"use client";

import { useSession } from "@/lib/auth-client";
import { SignOutButton } from "./SignOutButton";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail } from "lucide-react";

type SessionType = {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
} | null;

export function UserProfile({
  initialSession = null,
}: {
  initialSession?: SessionType;
}) {
  const { data: clientSession, isPending } = useSession();
  const [session, setSession] = useState<SessionType>(initialSession);

  useEffect(() => {
    if (clientSession) {
      setSession(clientSession as SessionType);
    }
  }, [clientSession]);

  if (typeof window === "undefined") {
    return initialSession ? (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {initialSession.user.image ? (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">
                {initialSession.user.name || "User"}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {initialSession.user.email}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="w-full h-9 bg-muted rounded-md flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Sign out</span>
          </div>
        </CardContent>
      </Card>
    ) : (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Not signed in
        </CardContent>
      </Card>
    );
  }

  if (isPending && !session) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Not signed in
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={40}
              height={40}
              className="rounded-full border-2 border-muted"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">
              {session.user.name || "User"}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate">{session.user.email}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <SignOutButton className="w-full justify-center" />
      </CardContent>
    </Card>
  );
}
