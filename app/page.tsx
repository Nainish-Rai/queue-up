"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Zap,
  BarChart3,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "No-Code Waitlists",
    description:
      "Create viral waitlists in minutes without any coding knowledge",
  },
  {
    icon: Share2,
    title: "Referral System",
    description: "Built-in referral tracking to boost organic growth",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track signups, referrals, and growth metrics in real-time",
  },
  {
    icon: Zap,
    title: "Embed Anywhere",
    description: "Embed your waitlist on any website with our simple widget",
  },
];

export default function Home() {
  const { data: session, isPending } = useSession();

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"
      />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center py-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-mono tracking-wide">
              No-Code Waitlist Builder
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-8xl font-bold tracking-tight mb-6 font-mono"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Launch Viral
            </span>
            <br />
            <span className="text-purple-400">Waitlists</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-12"
          >
            Create beautiful waitlists with built-in referral systems,
            analytics, and embeddable widgets. No coding required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            {isPending ? (
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-mono">Loading...</span>
              </div>
            ) : session ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Link href="/dashboard">Create Waitlist</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
                >
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </motion.div>

          {session && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-sm text-gray-400 font-mono"
            >
              Welcome back, {session.user.email}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="py-20 max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-mono text-white">
              Everything you need to grow
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              Build anticipation, track growth, and turn signups into customers
              with our comprehensive waitlist platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white font-mono">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-light">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-center py-20"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 font-mono text-white">
              Ready to build your waitlist?
            </h2>
            <p className="text-gray-300 mb-8 font-light">
              Join thousands of creators who trust QueueUp to launch and grow
              their products.
            </p>
            <div className="relative inline-block">
              <Button
                asChild
                size="lg"
                className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white"
              >
                <Link href={session ? "/dashboard" : "/login"}>
                  {session
                    ? "Create Your First Waitlist"
                    : "Start Building Today"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
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
                className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30 rounded-lg blur-lg -z-10"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
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
    </main>
  );
}
