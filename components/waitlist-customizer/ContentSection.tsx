"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomizationOptions } from "./types";

interface ContentSectionProps {
  options: CustomizationOptions;
  updateOption: <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => void;
}

export function ContentSection({ options, updateOption }: ContentSectionProps) {
  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="headerText" className="text-sm font-medium">
          Header Text
        </Label>
        <Input
          id="headerText"
          value={options.headerText}
          onChange={(e) => updateOption("headerText", e.target.value)}
          placeholder="Join our waitlist"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="descriptionText" className="text-sm font-medium">
          Description
        </Label>
        <Input
          id="descriptionText"
          value={options.descriptionText}
          onChange={(e) => updateOption("descriptionText", e.target.value)}
          placeholder="Be the first to know when we launch!"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="buttonText" className="text-sm font-medium">
          Button Text
        </Label>
        <Input
          id="buttonText"
          value={options.buttonText}
          onChange={(e) => updateOption("buttonText", e.target.value)}
          placeholder="Join Waitlist"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="placeholderText" className="text-sm font-medium">
          Email Placeholder
        </Label>
        <Input
          id="placeholderText"
          value={options.placeholderText}
          onChange={(e) => updateOption("placeholderText", e.target.value)}
          placeholder="Enter your email"
        />
      </div>
    </>
  );
}
