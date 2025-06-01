"use client";

import { createContext, useContext, ReactNode } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { createWaitlist } from "@/lib/api";
import type { Waitlist } from "@/lib/api";
import { toast } from "sonner";

interface WaitlistContextType {
  waitlists: Waitlist[];
  isLoading: boolean;
  createWaitlistMutation: UseMutationResult<
    Waitlist,
    Error,
    { name: string; slug: string },
    unknown
  >;
  refetch: () => void;
}

const WaitlistContext = createContext<WaitlistContextType | undefined>(
  undefined
);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: waitlists = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["waitlists"],
    queryFn: async () => {
      const response = await fetch("/api/waitlists");
      if (!response.ok) throw new Error("Failed to fetch waitlists");
      return response.json();
    },
  });

  const createWaitlistMutation = useMutation({
    mutationFn: createWaitlist,
    onMutate: async (newWaitlist) => {
      await queryClient.cancelQueries({ queryKey: ["waitlists"] });

      const previousWaitlists = queryClient.getQueryData(["waitlists"]);

      const optimisticWaitlist = {
        id: `temp-${Date.now()}`,
        name: newWaitlist.name,
        slug: newWaitlist.slug,
        createdAt: new Date().toISOString(),
        signupCount: 0,
        isOptimistic: true,
      };

      queryClient.setQueryData(["waitlists"], (old: Waitlist[] = []) => [
        optimisticWaitlist,
        ...old,
      ]);

      return { previousWaitlists };
    },
    onError: (err, newWaitlist, context) => {
      queryClient.setQueryData(["waitlists"], context?.previousWaitlists);
      toast.error("Failed to create waitlist", {
        description: err.message || "Please try again.",
      });
    },
    onSuccess: (data) => {
      toast.success("Waitlist created successfully!", {
        description: `${data.name} is now ready to collect signups.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlists"] });
    },
  });

  return (
    <WaitlistContext.Provider
      value={{
        waitlists,
        isLoading,
        createWaitlistMutation,
        refetch,
      }}
    >
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlists() {
  const context = useContext(WaitlistContext);
  if (context === undefined) {
    throw new Error("useWaitlists must be used within a WaitlistProvider");
  }
  return context;
}
