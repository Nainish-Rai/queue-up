import type { SpringOptions } from "framer-motion";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Settings, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import type { Waitlist } from "@/lib/api";
import { useRouter } from "next/navigation";

interface TiltedCardProps {
  waitlist?: Waitlist & { isOptimistic?: boolean };
  imageSrc?: React.ComponentProps<"img">["src"];
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties["height"];
  containerWidth?: React.CSSProperties["width"];
  imageHeight?: React.CSSProperties["height"];
  imageWidth?: React.CSSProperties["width"];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  index?: number;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const gradients = [
  "from-purple-600 via-pink-600 to-blue-600",
  "from-green-400 via-blue-500 to-purple-600",
  "from-yellow-400 via-red-500 to-pink-500",
  "from-indigo-400 via-purple-500 to-pink-500",
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-orange-400 via-red-500 to-yellow-500",
  "from-teal-400 via-green-500 to-blue-500",
  "from-rose-400 via-pink-500 to-purple-600",
];

function generateGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export default function TiltedCard({
  waitlist,
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "320px",
  containerWidth = "100%",
  imageHeight = "320px",
  imageWidth = "280px",
  scaleOnHover = 1.05,
  rotateAmplitude = 14,
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  index = 0,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  const router = useRouter();
  function handleCardClick(e: React.MouseEvent) {
    if (waitlist && !waitlist.isOptimistic) {
      const target = e.target as HTMLElement;
      if (!target.closest("button") && !target.closest("a")) {
        router.push(`/dashboard/${waitlist.id}`);
      }
    }
  }

  const gradientClass = waitlist
    ? generateGradient(waitlist.id)
    : "from-gray-600 to-gray-800";

  return (
    <figure
      ref={ref}
      className={`relative w-full h-full [perspective:800px] flex flex-col items-center justify-center cursor-pointer ${
        waitlist?.isOptimistic ? "opacity-70 pointer-events-none" : ""
      }`}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      // initial={{ opacity: 0, y: 20, scale: 0.95 }}
      // animate={{ opacity: 1, y: 0, scale: 1 }}
      // exit={{ opacity: 0, y: -20, scale: 0.95 }}
      // transition={{
      //   duration: 0.3,
      //   delay: index * 0.1,
      //   ease: "easeOut",
      // }}
      // layout
      // layoutId={waitlist ? `waitlist-${waitlist.id}` : undefined}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d] group"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={altText}
            className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
          />
        ) : (
          <motion.div
            className={`absolute top-0 left-0 rounded-[15px] will-change-transform [transform:translateZ(0)] bg-gradient-to-br ${gradientClass}  overflow-hidden`}
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />
            </div>
          </motion.div>
        )}

        {waitlist && (
          <motion.div
            className="absolute inset-0 p-5 text-white [transform:translateZ(20px)] flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl  font-mono  text-slate-100 font-medium drop-shadow-md flex items-center gap-2">
                  {waitlist.name}
                </h3>
                <Badge
                  variant={waitlist.isOptimistic ? "outline" : "secondary"}
                  className="text-xs bg-white/20 backdrop-blur-sm border-white/30"
                >
                  {waitlist.isOptimistic ? "Creating..." : "Active"}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/90">
                  <Hash className="w-3 h-3" />
                  <span className="font-mono bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs">
                    {waitlist.slug}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">
                    Created{" "}
                    {formatDistanceToNow(new Date(waitlist.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all"
                disabled={waitlist.isOptimistic}
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`/dashboard/${waitlist.id}`}>
                  <Settings className="w-3 h-3 mr-1" />
                  Manage
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all"
                disabled={waitlist.isOptimistic}
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`/waitlist/${waitlist.slug}`} target="_blank">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {!waitlist && displayOverlayContent && overlayContent && (
          <motion.div className="absolute top-4 left-4 z-[2] will-change-transform bg-background/50 rounded-3xl overflow-clip backdrop-blur-3xl p-2 [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
