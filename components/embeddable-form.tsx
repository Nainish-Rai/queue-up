"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { createSignup } from "@/lib/api";

interface EmbeddableWaitlistFormProps {
  waitlistSlug: string;
  waitlistName: string;
  signupCount: number;
  buttonText: string;
  primaryColor: string;
}

type FormState = {
  isSubmitting: boolean;
  result: {
    success: boolean;
    message: string;
    position?: number;
  } | null;
};

export function EmbeddableWaitlistForm({
  waitlistSlug,
  waitlistName,
  signupCount,
  buttonText,
  primaryColor,
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

  if (result?.success) {
    return (
      <Card className="shadow-lg border-green-200 bg-green-50/50 max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <CheckCircle2
                className="w-8 h-8"
                style={{ color: primaryColor }}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-900">
                Welcome aboard!
              </h3>
              <p className="text-green-700 mt-2">{result.message}</p>

              {result.position && (
                <p
                  className="mt-3 text-sm font-medium py-1 px-3 rounded-full inline-block text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  #{result.position} on the waitlist
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-md mx-auto">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Mail className="w-5 h-5" style={{ color: primaryColor }} />
          </div>
          <div>
            <CardTitle className="text-lg">{waitlistName}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{signupCount.toLocaleString()} joined</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className="h-10"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name{" "}
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="h-10"
              disabled={isSubmitting}
            />
          </div>

          {result?.success === false && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {result.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By joining, you agree to receive updates about the launch.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
