"use client";

import { motion } from "framer-motion";
import {
  Slack,
  Zap,
  Webhook,
  Palette,
  Mail,
  MessageSquare,
  Database,
  BarChart3,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WaitlistOverview } from "@/lib/api";

interface IntegrationsClientProps {
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

const upcomingIntegrations = [
  {
    name: "Slack",
    description: "Get real-time notifications when users join your waitlist",
    icon: <Slack className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600",
    status: "Coming Soon",
    features: [
      "Real-time notifications",
      "Custom channels",
      "Rich message formatting",
    ],
  },
  {
    name: "Zapier",
    description: "Connect your waitlist to 5,000+ apps with automation",
    icon: <Zap className="w-6 h-6" />,
    color: "from-orange-500 to-orange-600",
    status: "Coming Soon",
    features: [
      "5,000+ app connections",
      "Custom triggers",
      "Multi-step workflows",
    ],
  },
  {
    name: "Webhooks",
    description: "Send data to any endpoint when events occur",
    icon: <Webhook className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
    status: "Coming Soon",
    features: ["Custom endpoints", "Event filtering", "Retry mechanisms"],
  },
  {
    name: "Custom CSS",
    description:
      "Full control over your waitlist's appearance with custom styling",
    icon: <Palette className="w-6 h-6" />,
    color: "from-pink-500 to-pink-600",
    status: "Coming Soon",
    features: ["Custom CSS injection", "Advanced theming", "Brand consistency"],
  },
  {
    name: "Email Marketing",
    description:
      "Connect with Mailchimp, ConvertKit, and other email platforms",
    icon: <Mail className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
    status: "Coming Soon",
    features: ["Auto-sync contacts", "Segmentation", "Campaign triggers"],
  },
  {
    name: "Discord",
    description: "Notify your Discord community about new signups",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-indigo-500 to-indigo-600",
    status: "Coming Soon",
    features: [
      "Server notifications",
      "Role assignments",
      "Community engagement",
    ],
  },
  {
    name: "Database Sync",
    description: "Sync waitlist data with your existing database",
    icon: <Database className="w-6 h-6" />,
    color: "from-gray-500 to-gray-600",
    status: "Planning",
    features: ["Real-time sync", "Custom mapping", "Data validation"],
  },
  {
    name: "Analytics",
    description: "Advanced analytics and reporting for your waitlist",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "from-emerald-500 to-emerald-600",
    status: "Planning",
    features: ["Advanced metrics", "Custom dashboards", "Export reports"],
  },
];

export function IntegrationsClient({ waitlistData }: IntegrationsClientProps) {
  return (
    <motion.div
      className="max-w-7xl p-4 mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl times font-medium">Integrations</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect your waitlist with your favorite tools and automate your
            workflow. More integrations are coming soon!
          </p>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Clock className="w-3 h-3 mr-1" />
            More features launching soon
          </Badge>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{waitlistData.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {waitlistData.signupCount} signups • Created{" "}
                  {new Date(waitlistData.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Upcoming Integrations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingIntegrations.map((integration) => (
            <motion.div
              key={integration.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                />

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${integration.color} text-white`}
                      >
                        {integration.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {integration.name}
                        </CardTitle>
                        <Badge
                          variant={
                            integration.status === "Coming Soon"
                              ? "secondary"
                              : "outline"
                          }
                          className="mt-1"
                        >
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {integration.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Features:</p>
                    <ul className="space-y-1">
                      {integration.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full" disabled>
                      {integration.status === "Coming Soon"
                        ? "Notify Me"
                        : "In Planning"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-dashed">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Have a suggestion?</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              We&apos;re always looking to add new integrations. Let us know
              what tools you&apos;d like to see connected!
            </p>
            <Button variant="outline">Request Integration</Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
