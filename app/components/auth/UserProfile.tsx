"use client";

import { useSession } from "@/lib/auth-client";
import { SignOutButton } from "./SignOutButton";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Mail, ChevronDown } from "lucide-react";

type SessionType = {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
} | null;

interface UserProfileProps {
  initialSession?: SessionType;
  variant?: "default" | "navbar";
}

export function UserProfile({
  initialSession = null,
  variant = "default",
}: UserProfileProps) {
  const { data: clientSession, isPending } = useSession();
  const [session, setSession] = useState<SessionType>(initialSession);

  useEffect(() => {
    if (clientSession) {
      setSession(clientSession as SessionType);
    }
  }, [clientSession]);

  if (typeof window === "undefined") {
    if (variant === "navbar") {
      return initialSession ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      ) : (
        <Button variant="ghost" size="sm">
          Sign in
        </Button>
      );
    }
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
    if (variant === "navbar") {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-4 h-4" />
        </div>
      );
    }
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
    if (variant === "navbar") {
      return (
        <Button variant="ghost" size="sm">
          Sign in
        </Button>
      );
    }
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Not signed in
        </CardContent>
      </Card>
    );
  }

  if (variant === "navbar") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-auto px-2 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
              )}
              <span className="text-sm font-medium max-w-[100px] truncate">
                {session.user.name || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name || "User"}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span className="truncate">{session.user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <div className="w-full">
              <SignOutButton className="w-full justify-start h-auto p-2 border-0 bg-transparent hover:bg-accent text-left font-normal" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
