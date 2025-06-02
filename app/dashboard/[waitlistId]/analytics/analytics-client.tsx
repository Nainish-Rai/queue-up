"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  BarChart3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import AnimatedStatsCard from "@/components/animated-stats-card";

interface AnalyticsData {
  date: string;
  fullDate: string;
  signups: number;
  totalSignups: number;
}

interface AnalyticsMetrics {
  totalSignups: number;
  last7DaysSignups: number;
  weeklyGrowth: number;
}

interface AnalyticsClientProps {
  waitlistId: string;
  waitlistName: string;
}

const chartConfig = {
  totalSignups: {
    label: "Total Signups",
    color: "var(--chart-1)",
  },
  signups: {
    label: "Daily Signups",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

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

export function AnalyticsClient({
  waitlistId,
  waitlistName,
}: AnalyticsClientProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/waitlists/${waitlistId}/analytics`);
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const data = await response.json();
        setAnalyticsData(data.analyticsData);
        setMetrics(data.metrics);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [waitlistId]);

  if (error) {
    return (
      <div className="max-w-7xl p-4 mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl p-4 mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div>
          <h1 className="text-3xl times font-medium">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Signup trends and insights for {waitlistName}
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-32 rounded-lg border bg-card animate-pulse"
              variants={itemVariants}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedStatsCard
              title="Total Signups"
              value={metrics?.totalSignups || 0}
              icon={<Users className="w-4 h-4" />}
              index={0}
            />

            <AnimatedStatsCard
              title="Last 7 Days"
              value={metrics?.last7DaysSignups || 0}
              icon={<Calendar className="w-4 h-4" />}
              index={1}
            />

            <AnimatedStatsCard
              title="Weekly Growth"
              value=""
              icon={
                (metrics?.weeklyGrowth || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )
              }
              index={2}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-medium ${
                    (metrics?.weeklyGrowth || 0) >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {(metrics?.weeklyGrowth || 0) >= 0 ? "+" : ""}
                  {metrics?.weeklyGrowth || 0}%
                </span>
              </div>
            </AnimatedStatsCard>
          </div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Signup Trends (Last 30 Days)
                </CardTitle>
                <CardDescription>
                  Daily signups and cumulative total over the past month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[400px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analyticsData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="fillDailySignups"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="25%"
                            stopColor="#3b82f6"
                            stopOpacity={0.7}
                          />
                          <stop
                            offset="50%"
                            stopColor="#06b6d4"
                            stopOpacity={0.5}
                          />
                          <stop
                            offset="75%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="100%"
                            stopColor="#f59e0b"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value}
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="signups"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#fillDailySignups)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
