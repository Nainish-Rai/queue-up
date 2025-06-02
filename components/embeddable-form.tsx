"use client";

import { useState } from "react";
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
}

interface EmbeddableWaitlistFormProps {
  waitlistSlug: string;
  waitlistName: string;
  signupCount: number;
  customization: CustomizationOptions;
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
  waitlistName,
  signupCount,
  customization,
}: EmbeddableWaitlistFormProps) {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    result: null,
  });

  async function handleSubmit(formData: FormData) {
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

  const { isSubmitting, result } = formState;
  const animation = animationVariants[customization.animation];

  const cardStyle = {
    maxWidth: `${customization.formWidth}px`,
    borderRadius: `${customization.borderRadius}px`,
    boxShadow: `0 ${customization.shadowIntensity * 2}px ${customization.shadowIntensity * 8}px rgba(0,0,0,${customization.shadowIntensity * 0.1})`,
    fontSize: `${customization.fontSize}px`,
    color: customization.textColor,
  };

  if (result?.success) {
    return (
      <motion.div
        {...animation}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto"
        style={cardStyle}
      >
        <Card className="border-green-200 bg-green-50/50" style={cardStyle}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${customization.buttonColor}20` }}
              >
                <CheckCircle2
                  className="w-8 h-8"
                  style={{ color: customization.buttonColor }}
                />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  Welcome aboard!
                </h3>
                <p className="text-green-700 mt-2">{result.message}</p>

                {result.position && customization.includeLeaderboard && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge
                      className="mt-3 text-sm font-medium py-2 px-4"
                      style={{
                        backgroundColor: customization.buttonColor,
                        color: customization.buttonTextColor,
                      }}
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
        className="hover:shadow-xl transition-shadow duration-300"
        style={cardStyle}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${customization.buttonColor}20`,
                borderRadius: `${customization.borderRadius * 0.6}px`,
              }}
            >
              <Mail
                className="w-5 h-5"
                style={{ color: customization.buttonColor }}
              />
            </motion.div>
            <div>
              <CardTitle
                className="text-lg"
                style={{ color: customization.textColor }}
              >
                {customization.headerText || waitlistName}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{signupCount.toLocaleString()} joined</span>
              </div>
            </div>
          </div>
          {customization.descriptionText && (
            <p
              className="text-sm"
              style={{ color: customization.textColor, opacity: 0.8 }}
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
                style={{ color: customization.textColor }}
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={customization.placeholderText}
                className="h-10"
                style={{
                  borderRadius: `${customization.borderRadius * 0.5}px`,
                  fontSize: `${customization.fontSize * 0.9}px`,
                }}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium"
                style={{ color: customization.textColor }}
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
                className="h-10"
                style={{
                  borderRadius: `${customization.borderRadius * 0.5}px`,
                  fontSize: `${customization.fontSize * 0.9}px`,
                }}
                disabled={isSubmitting}
              />
            </div>

            {result?.success === false && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
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
                style={{
                  backgroundColor: customization.buttonColor,
                  color: customization.buttonTextColor,
                  borderColor: customization.buttonColor,
                  borderRadius: `${customization.borderRadius * 0.5}px`,
                  fontSize: `${customization.fontSize * 0.9}px`,
                }}
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
                Powered by Waitlist
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
