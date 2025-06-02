"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import { createSignup } from "@/lib/api";

interface SignupFormProps {
  waitlistSlug: string;
  referredBy?: string;
}

type FormState = {
  isSubmitting: boolean;
  result: {
    success: boolean;
    message: string;
    referralId?: string;
    position?: number;
  } | null;
};

export function SignupForm({ waitlistSlug, referredBy }: SignupFormProps) {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    result: null,
  });
  const [copied, setCopied] = useState(false);

  async function handleSubmit(formData: FormData) {
    setFormState((prev) => ({ ...prev, isSubmitting: true, result: null }));

    formData.append("waitlistSlug", waitlistSlug);
    if (referredBy) {
      formData.append("referredBy", referredBy);
    }

    try {
      const email = formData.get("email") as string;
      const name = formData.get("name") as string | undefined;

      const signupData = {
        email,
        name,
        waitlistSlug,
        referredBy,
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  if (formState.result?.success) {
    const { result } = formState;
    const referralUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/waitlist/${waitlistSlug}?ref=${result.referralId}`
        : "";

    return (
      <Card className="shadow-lg border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                Welcome aboard!
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300 mt-2">
                {result.message}
              </p>

              {result.position && (
                <p className="mt-3 text-sm font-medium bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 py-1 px-3 rounded-full inline-block">
                  #{result.position} on the waitlist
                </p>
              )}
            </div>

            {result.referralId && (
              <div className="space-y-4">
                <div className="bg-card/80 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium mb-2">
                    Your referral link:
                  </p>
                  <div className="flex items-center">
                    <code className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1.5 rounded block break-all flex-1 overflow-hidden text-left">
                      {referralUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 h-7 px-2 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                      onClick={() => copyToClipboard(referralUrl)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Share with friends to move up the waitlist!
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#1DA1F2] text-white hover:bg-[#1a94df] border-0 dark:bg-[#1DA1F2] dark:hover:bg-[#1a94df]"
                      onClick={() => {
                        window.open(
                          `https://twitter.com/intent/tweet?text=Join me on the waitlist for ${encodeURIComponent(waitlistSlug)}!&url=${encodeURIComponent(referralUrl)}`,
                          "_blank"
                        );
                      }}
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#0A66C2] text-white hover:bg-[#0958a8] border-0 dark:bg-[#0A66C2] dark:hover:bg-[#0958a8]"
                      onClick={() => {
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
                          "_blank"
                        );
                      }}
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { isSubmitting, result } = formState;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Join the Waitlist</CardTitle>
            <CardDescription className="text-sm">
              Get early access and be notified when we launch
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className="h-11"
              required
              disabled={isSubmitting}
              aria-describedby="email-error"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Name{" "}
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="h-11"
              disabled={isSubmitting}
            />
          </div>

          {result?.success === false && (
            <div
              className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
              id="email-error"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {result.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              "Join the Waitlist"
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By joining, you agree to receive updates about our launch.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
