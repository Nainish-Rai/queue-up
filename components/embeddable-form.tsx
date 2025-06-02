"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
  Trophy,
  BarChart3,
} from "lucide-react";
import { createSignup } from "@/lib/api";

interface CustomizationOptions {
  theme: "light" | "dark" | "auto";
  formWidth: number;
  buttonColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  includeLeaderboard: boolean;
  referrerTracking: boolean;
  includeBrandBadge: boolean;
  buttonText: string;
  headerText: string;
  descriptionText: string;
  placeholderText: string;
  animation: "none" | "fade" | "slide" | "bounce";
  fontSize: number;
  padding: number;
  shadowIntensity: number;
  includeNameField: boolean;
}

interface EmbeddableWaitlistFormProps {
  waitlistSlug: string;
}

type FormState = {
  isSubmitting: boolean;
  result: {
    success: boolean;
    message: string;
    position?: number;
  } | null;
};

const animationVariants = {
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
};

export function EmbeddableWaitlistForm({
  waitlistSlug,
}: EmbeddableWaitlistFormProps) {
  const [config, setConfig] = useState<{
    waitlist: {
      id: string;
      name: string;
      slug: string;
      signupCount: number;
    };
    customization: CustomizationOptions;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    result: null,
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`/api/widget/${waitlistSlug}/config`);
        if (!response.ok) {
          throw new Error("Failed to load waitlist configuration");
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load waitlist"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [waitlistSlug]);

  async function handleSubmit(formData: FormData) {
    if (!config) return;

    setFormState((prev) => ({ ...prev, isSubmitting: true, result: null }));

    try {
      const email = formData.get("email") as string;
      const name = formData.get("name") as string | undefined;

      const signupData = {
        email,
        name,
        waitlistSlug,
      };

      const response = await createSignup(signupData);
      setFormState({ isSubmitting: false, result: response });
    } catch (error) {
      console.error("Signup error:", error);
      setFormState({
        isSubmitting: false,
        result: {
          success: false,
          message: "An unexpected error occurred. Please try again.",
        },
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-foreground" />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-destructive">
            {error || "Failed to load waitlist"}
          </p>
        </div>
      </div>
    );
  }

  const { waitlist, customization } = config;
  const { isSubmitting, result } = formState;
  const animation = animationVariants[customization.animation];

  const getThemeColors = () => {
    switch (customization.theme) {
      case "light":
        return {
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          cardClass: "bg-white text-gray-800",
          shouldUseCustomColors: true,
        };
      case "dark":
        return {
          backgroundColor: "#171717",
          textColor: "#f9fafb",
          cardClass: "bg-gray-800 text-gray-100",
          shouldUseCustomColors: true,
        };
      case "auto":
      default:
        return {
          backgroundColor: customization.backgroundColor,
          textColor: customization.textColor,
          cardClass: "bg-card text-card-foreground border-border",
          shouldUseCustomColors: false,
        };
    }
  };

  const themeColors = getThemeColors();
  const shouldUseCustomColors = themeColors.shouldUseCustomColors;

  const cardStyle = {
    maxWidth: `${customization.formWidth}px`,
    borderRadius: `${customization.borderRadius}px`,
    boxShadow: `0 ${customization.shadowIntensity * 2}px ${
      customization.shadowIntensity * 8
    }px rgba(0,0,0,${customization.shadowIntensity * 0.1})`,
    fontSize: `${customization.fontSize}px`,
    ...(shouldUseCustomColors && {
      backgroundColor: themeColors.backgroundColor,
      color: themeColors.textColor,
    }),
  };

  if (result?.success) {
    return (
      <motion.div
        {...animation}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto"
        style={cardStyle}
      >
        <Card
          className={`border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50 ${
            shouldUseCustomColors ? "" : themeColors.cardClass
          }`}
          style={shouldUseCustomColors ? cardStyle : undefined}
        >
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{
                  backgroundColor: shouldUseCustomColors
                    ? `${customization.buttonColor}20`
                    : `hsl(var(--primary) / 0.1)`,
                }}
              >
                <CheckCircle2
                  className="w-8 h-8"
                  style={{
                    color: shouldUseCustomColors
                      ? customization.buttonColor
                      : `hsl(var(--primary))`,
                  }}
                />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
                  Welcome aboard!
                </h3>
                <p className="text-green-700 dark:text-green-300 mt-2">
                  {result.message}
                </p>

                {result.position && customization.includeLeaderboard && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge
                      className="mt-3 text-sm font-medium py-2 px-4"
                      style={
                        shouldUseCustomColors
                          ? {
                              backgroundColor: customization.buttonColor,
                              color: customization.buttonTextColor,
                            }
                          : undefined
                      }
                    >
                      <Trophy className="w-4 h-4 mr-1" />#{result.position} on
                      the waitlist
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
          {customization.includeBrandBadge && (
            <div className="px-6 pb-4">
              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  Powered by Queue-Up
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
        className={`hover:shadow-xl transition-shadow duration-300 ${
          shouldUseCustomColors ? "" : themeColors.cardClass
        }`}
        style={
          shouldUseCustomColors
            ? cardStyle
            : {
                maxWidth: `${customization.formWidth}px`,
                borderRadius: `${customization.borderRadius}px`,
                fontSize: `${customization.fontSize}px`,
              }
        }
      >
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-lg flex  items-center justify-center"
              style={{
                backgroundColor: shouldUseCustomColors
                  ? `${customization.buttonColor}20`
                  : `hsl(var(--primary) / 0.1)`,
                borderRadius: `${customization.borderRadius * 0.6}px`,
              }}
            >
              <Mail
                className="w-5 h-5"
                style={{
                  color: shouldUseCustomColors
                    ? customization.buttonColor
                    : `hsl(var(--primary))`,
                }}
              />
            </motion.div>
            <div>
              <CardTitle
                className="text-lg"
                style={
                  shouldUseCustomColors
                    ? {
                        color: themeColors.textColor,
                      }
                    : undefined
                }
              >
                {customization.headerText || waitlist.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{waitlist.signupCount.toLocaleString()} joined</span>
              </div>
            </div>
          </div>
          {customization.descriptionText && (
            <p
              className="text-sm opacity-80"
              style={
                shouldUseCustomColors
                  ? {
                      color: themeColors.textColor,
                    }
                  : undefined
              }
            >
              {customization.descriptionText}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium"
                style={
                  shouldUseCustomColors
                    ? {
                        color: themeColors.textColor,
                      }
                    : undefined
                }
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={customization.placeholderText}
                className={`h-10 ${
                  shouldUseCustomColors
                    ? ""
                    : "bg-background border-input text-foreground"
                }`}
                style={{
                  borderRadius: `${customization.borderRadius * 0.5}px`,
                  fontSize: `${customization.fontSize * 0.9}px`,
                  ...(shouldUseCustomColors && {
                    backgroundColor:
                      customization.theme === "dark" ? "#374151" : "#f9fafb",
                    borderColor:
                      customization.theme === "dark" ? "#4b5563" : "#d1d5db",
                    color: themeColors.textColor,
                  }),
                }}
                required
                disabled={isSubmitting}
              />
            </div>

            {customization.includeNameField && (
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium"
                  style={
                    shouldUseCustomColors
                      ? {
                          color: themeColors.textColor,
                        }
                      : undefined
                  }
                >
                  Name{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className={`h-10 ${
                    shouldUseCustomColors
                      ? ""
                      : "bg-background border-input text-foreground"
                  }`}
                  style={{
                    borderRadius: `${customization.borderRadius * 0.5}px`,
                    fontSize: `${customization.fontSize * 0.9}px`,
                    ...(shouldUseCustomColors && {
                      backgroundColor:
                        customization.theme === "dark" ? "#374151" : "#f9fafb",
                      borderColor:
                        customization.theme === "dark" ? "#4b5563" : "#d1d5db",
                      color: themeColors.textColor,
                    }),
                  }}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {result?.success === false && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg"
                style={{
                  borderRadius: `${customization.borderRadius * 0.5}px`,
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {result.message}
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full h-11 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                style={
                  shouldUseCustomColors
                    ? {
                        backgroundColor: customization.buttonColor,
                        color: customization.buttonTextColor,
                        borderColor: customization.buttonColor,
                        borderRadius: `${customization.borderRadius * 0.5}px`,
                        fontSize: `${customization.fontSize * 0.9}px`,
                      }
                    : {
                        borderRadius: `${customization.borderRadius * 0.5}px`,
                        fontSize: `${customization.fontSize * 0.9}px`,
                      }
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  customization.buttonText
                )}
              </Button>
            </motion.div>
          </form>

          {customization.includeLeaderboard && (
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
                  borderRadius: `${customization.borderRadius * 0.3}px`,
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
              style={{ fontSize: `${customization.fontSize * 0.75}px` }}
            >
              By joining, you agree to receive updates about the launch.
            </p>
          </div>

          {customization.includeBrandBadge && (
            <div className="text-center pt-2">
              <Badge variant="outline" className="text-xs">
                Powered by Queue-Up
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
