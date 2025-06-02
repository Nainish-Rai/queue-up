"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Users,
  Trophy,
  CheckCircle2,
  Loader2,
  BarChart3,
} from "lucide-react";
import { CustomizationOptions, animationVariants } from "./types";

interface LivePreviewFormProps {
  options: CustomizationOptions;
  waitlistName: string;
}

export function LivePreviewForm({
  options,
  waitlistName,
}: LivePreviewFormProps) {
  const [previewState, setPreviewState] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const animation = animationVariants[options.animation];
  const signupCount = 1234;

  // Theme-aware styling logic
  const getThemeColors = () => {
    switch (options.theme) {
      case "light":
        return {
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          shouldUseCustomColors: true,
        };
      case "dark":
        return {
          backgroundColor: "#171717",
          textColor: "#f9fafb",
          shouldUseCustomColors: true,
        };
      case "auto":
      default:
        return {
          backgroundColor: options.backgroundColor,
          textColor: options.textColor,
          shouldUseCustomColors: false,
        };
    }
  };

  const themeColors = getThemeColors();
  const shouldUseCustomColors = themeColors.shouldUseCustomColors;

  const cardStyle = {
    maxWidth: `${options.formWidth}px`,
    borderRadius: `${options.borderRadius}px`,
    boxShadow: `0 ${options.shadowIntensity * 2}px ${options.shadowIntensity * 8}px rgba(0,0,0,${options.shadowIntensity * 0.1})`,
    fontSize: `${options.fontSize}px`,
    ...(shouldUseCustomColors && {
      backgroundColor: themeColors.backgroundColor,
      color: themeColors.textColor,
      borderColor: "transparent",
    }),
  };

  const handlePreviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setPreviewState("success");
      setTimeout(() => setPreviewState("form"), 3000);
    }, 1500);
  };

  if (previewState === "success") {
    return (
      <motion.div
        {...animation}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto"
        style={cardStyle}
      >
        <Card
          className={`border-green-200 bg-green-50/50 ${
            shouldUseCustomColors
              ? ""
              : "dark:border-green-800 dark:bg-green-950/50"
          }`}
          style={cardStyle}
        >
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${options.buttonColor}20` }}
              >
                <CheckCircle2
                  className="w-8 h-8"
                  style={{ color: options.buttonColor }}
                />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  Welcome aboard!
                </h3>
                <p className="text-green-700 mt-2">
                  You&apos;ve been added to the waitlist!
                </p>

                {options.includeLeaderboard && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge
                      className="mt-3 text-sm font-medium py-2 px-4"
                      style={{
                        backgroundColor: options.buttonColor,
                        color: options.buttonTextColor,
                      }}
                    >
                      <Trophy className="w-4 h-4 mr-1" />
                      #42 on the waitlist
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
          {options.includeBrandBadge && (
            <div className="px-6 pb-4">
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  Powered by Waitlist
                </Badge>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...animation}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto"
      style={cardStyle}
    >
      <Card
        className="hover:shadow-xl border-border transition-shadow duration-300"
        style={cardStyle}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${options.buttonColor}20`,
                borderRadius: `${options.borderRadius * 0.6}px`,
              }}
            >
              <Mail
                className="w-5 h-5"
                style={{ color: options.buttonColor }}
              />
            </motion.div>
            <div>
              <CardTitle
                className="text-lg"
                style={{
                  color: shouldUseCustomColors
                    ? themeColors.textColor
                    : options.textColor,
                }}
              >
                {options.headerText || waitlistName}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{signupCount.toLocaleString()} joined</span>
              </div>
            </div>
          </div>
          {options.descriptionText && (
            <p
              className="text-sm"
              style={{
                color: shouldUseCustomColors
                  ? themeColors.textColor
                  : options.textColor,
                opacity: 0.8,
              }}
            >
              {options.descriptionText}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handlePreviewSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="preview-email"
                className="text-sm font-medium"
                style={{
                  color: shouldUseCustomColors
                    ? themeColors.textColor
                    : options.textColor,
                }}
              >
                Email Address
              </Label>
              <Input
                id="preview-email"
                type="email"
                placeholder={options.placeholderText}
                className="h-10"
                style={{
                  borderRadius: `${options.borderRadius * 0.5}px`,
                  fontSize: `${options.fontSize * 0.9}px`,
                  ...(shouldUseCustomColors && {
                    backgroundColor:
                      options.theme === "dark" ? "#374151" : "#f9fafb",
                    borderColor:
                      options.theme === "dark" ? "#4b5563" : "#d1d5db",
                    color: themeColors.textColor,
                  }),
                }}
                disabled={isSubmitting}
                defaultValue="demo@example.com"
              />
            </div>

            {options.includeNameField && (
              <div className="space-y-2">
                <Label
                  htmlFor="preview-name"
                  className="text-sm font-medium"
                  style={{
                    color: shouldUseCustomColors
                      ? themeColors.textColor
                      : options.textColor,
                  }}
                >
                  Name{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="preview-name"
                  type="text"
                  placeholder="Your name"
                  className="h-10"
                  style={{
                    borderRadius: `${options.borderRadius * 0.5}px`,
                    fontSize: `${options.fontSize * 0.9}px`,
                    ...(shouldUseCustomColors && {
                      backgroundColor:
                        options.theme === "dark" ? "#374151" : "#f9fafb",
                      borderColor:
                        options.theme === "dark" ? "#4b5563" : "#d1d5db",
                      color: themeColors.textColor,
                    }),
                  }}
                  disabled={isSubmitting}
                  defaultValue="Demo User"
                />
              </div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full h-11 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  backgroundColor: options.buttonColor,
                  color: options.buttonTextColor,
                  borderColor: options.buttonColor,
                  borderRadius: `${options.borderRadius * 0.5}px`,
                  fontSize: `${options.fontSize * 0.9}px`,
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  options.buttonText
                )}
              </Button>
            </motion.div>
          </form>

          {options.includeLeaderboard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  borderRadius: `${options.borderRadius * 0.3}px`,
                }}
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                See your position after joining
              </Badge>
            </motion.div>
          )}

          <div className="text-center">
            <p
              className="text-xs text-muted-foreground"
              style={{ fontSize: `${options.fontSize * 0.75}px` }}
            >
              By joining, you agree to receive updates about the launch.
            </p>
          </div>

          {options.includeBrandBadge && (
            <div className="text-center pt-2">
              <Badge variant="outline" className="text-xs">
                Powered by Waitlist
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
