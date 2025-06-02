"use client";

import { motion, useSpring } from "framer-motion";
import type { SpringOptions } from "framer-motion";

interface AnimatedStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  index: number;
  onClick?: () => void;
  children?: React.ReactNode;
}

const springValues: SpringOptions = {
  damping: 25,
  stiffness: 120,
  mass: 1,
};

export default function AnimatedStatsCard({
  title,
  value,
  icon,
  index,
  onClick,
  children,
}: AnimatedStatsCardProps) {
  const scale = useSpring(1, springValues);

  function handleMouseEnter() {
    scale.set(1.02);
  }

  function handleMouseLeave() {
    scale.set(1);
  }

  return (
    <motion.div
      className={`relative h-32 ${onClick ? "cursor-pointer" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      style={{ scale }}
    >
      <motion.div className="relative w-full h-full group overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
        <motion.div
          className="absolute inset-0 p-6 flex flex-col justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">{icon}</div>
              <span className="text-sm font-medium text-muted-foreground tracking-wide">
                {title}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {value && (
              <div className="text-3xl font-bold text-foreground">{value}</div>
            )}
            {children && (
              <div className="space-y-1 text-muted-foreground">{children}</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
