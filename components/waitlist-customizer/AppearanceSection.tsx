"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomizationOptions, colorPresets } from "./types";

interface AppearanceSectionProps {
  options: CustomizationOptions;
  updateOption: <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => void;
}

export function AppearanceSection({
  options,
  updateOption,
}: AppearanceSectionProps) {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-medium">Theme</Label>
        <Select
          value={options.theme}
          onValueChange={(value: "light" | "dark" | "auto") =>
            updateOption("theme", value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Button Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {colorPresets.map((color) => (
            <button
              key={color.value}
              className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-105 ${
                options.buttonColor === color.value
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => updateOption("buttonColor", color.value)}
              title={color.name}
            />
          ))}
        </div>
        <Input
          type="color"
          value={options.buttonColor}
          onChange={(e) => updateOption("buttonColor", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Border Radius: {options.borderRadius}px
        </Label>
        <Slider
          value={[options.borderRadius]}
          onValueChange={([value]) => updateOption("borderRadius", value)}
          max={24}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Shadow Intensity: {options.shadowIntensity}
        </Label>
        <Slider
          value={[options.shadowIntensity]}
          onValueChange={([value]) => updateOption("shadowIntensity", value)}
          max={10}
          min={0}
          step={1}
          className="w-full"
        />
      </div>
    </>
  );
}
