"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomizationOptions } from "./types";

interface LayoutSectionProps {
  options: CustomizationOptions;
  updateOption: <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => void;
}

export function LayoutSection({ options, updateOption }: LayoutSectionProps) {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Form Width: {options.formWidth}px
        </Label>
        <Slider
          value={[options.formWidth]}
          onValueChange={([value]) => updateOption("formWidth", value)}
          max={800}
          min={300}
          step={10}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Font Size: {options.fontSize}px
        </Label>
        <Slider
          value={[options.fontSize]}
          onValueChange={([value]) => updateOption("fontSize", value)}
          max={24}
          min={12}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Padding: {options.padding}px
        </Label>
        <Slider
          value={[options.padding]}
          onValueChange={([value]) => updateOption("padding", value)}
          max={48}
          min={12}
          step={4}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Animation</Label>
        <Select
          value={options.animation}
          onValueChange={(value: "none" | "fade" | "slide" | "bounce") =>
            updateOption("animation", value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="fade">Fade In</SelectItem>
            <SelectItem value="slide">Slide Up</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
