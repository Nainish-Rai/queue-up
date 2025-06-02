"use client";

import { getWaitlistBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { SignupForm } from "@/components/waitlist/SignupForm";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import type { Waitlist } from "@/lib/api";

interface WaitlistPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    ref?: string;
  }>;
}

export default function WaitlistPage({
  params,
  searchParams,
}: WaitlistPageProps) {
  const [waitlist, setWaitlist] = useState<Waitlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState<string | undefined>();
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        const resolvedSearchParams = await searchParams;

        setSlug(resolvedParams.slug);
        setRef(resolvedSearchParams.ref);

        const waitlistData = await getWaitlistBySlug(resolvedParams.slug);
        setWaitlist(waitlistData);
      } catch (error) {
        console.error("Error fetching waitlist:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-lg font-mono"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!waitlist) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"
      />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      <div className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-mono tracking-wide">
              Early Access
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-6 font-mono"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              {waitlist.name}
            </span>
          </motion.h1>

          {waitlist.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
            >
              {waitlist.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center justify-center gap-8 mt-12"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-sm font-mono">Users</span>
            </div>
            <div className="w-px h-6 bg-gray-600" />
            <div className="flex items-center gap-2 text-gray-400">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-mono">{slug}</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 md:p-8 shadow-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                <SignupForm waitlistSlug={slug} referredBy={ref} />
              </motion.div>
            </motion.div>

            <motion.div
              animate={{
                rotate: [0, 1, -1, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-xl -z-10"
            />
          </div>
        </motion.div>

        {ref && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300">
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm font-mono">Referred by a friend</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 text-gray-500 text-sm">
            <div className="w-12 h-px bg-gray-600" />
            <span className="font-mono tracking-wider">QUEUE-UP</span>
            <div className="w-12 h-px bg-gray-600" />
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
      />
    </div>
  );
}
