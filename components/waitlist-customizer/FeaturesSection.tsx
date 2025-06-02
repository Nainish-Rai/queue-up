"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Link, Crown } from "lucide-react";
import { CustomizationOptions } from "./types";

interface FeaturesSectionProps {
  options: CustomizationOptions;
  updateOption: <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => void;
}

export function FeaturesSection({
  options,
  updateOption,
}: FeaturesSectionProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Include Leaderboard
            </Label>
            <p className="text-xs text-muted-foreground">
              Show position in waitlist
            </p>
          </div>
          <Switch
            checked={options.includeLeaderboard}
            onCheckedChange={(checked) =>
              updateOption("includeLeaderboard", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Link className="w-4 h-4" />
              Referrer Tracking
            </Label>
            <p className="text-xs text-muted-foreground">
              Track UTM parameters and referrals
            </p>
          </div>
          <Switch
            checked={options.referrerTracking}
            onCheckedChange={(checked) =>
              updateOption("referrerTracking", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Brand Badge
            </Label>
            <p className="text-xs text-muted-foreground">
              Show &quot;Powered by&quot; attribution
            </p>
          </div>
          <Switch
            checked={options.includeBrandBadge}
            onCheckedChange={(checked) =>
              updateOption("includeBrandBadge", checked)
            }
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Embed Type</Label>
        <Select
          value={options.embedType}
          onValueChange={(value: "iframe" | "script") =>
            updateOption("embedType", value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iframe">iFrame (Simple)</SelectItem>
            <SelectItem value="script">JavaScript (Advanced)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
