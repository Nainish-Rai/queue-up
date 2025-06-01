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
import { Mail, User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
// import { signupAction } from "@/lib/actions/signup";
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
  } | null;
};

export function SignupForm({ waitlistSlug, referredBy }: SignupFormProps) {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    result: null,
  });

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

  if (formState.result?.success) {
    const { result } = formState;
    return (
      <Card className="shadow-lg border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-900">
                Welcome aboard!
              </h3>
              <p className="text-green-700 mt-2">{result.message}</p>
            </div>
            {result.referralId && (
              <div className="bg-white/80 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-800 font-medium">
                  Your referral link:
                </p>
                <code className="text-xs bg-green-100 px-2 py-1 rounded mt-1 block break-all">
                  {typeof window !== "undefined" &&
                    `${window.location.origin}/waitlist/${waitlistSlug}?ref=${result.referralId}`}
                </code>
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
