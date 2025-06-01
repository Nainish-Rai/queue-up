"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Eye, Code2 } from "lucide-react";

interface EmbedCodeGeneratorProps {
  waitlistSlug: string;
  waitlistName: string;
}

interface EmbedOptions {
  buttonText: string;
  primaryColor: string;
  width: string;
  height: string;
  embedType: "iframe" | "script";
}

const presetSizes = [
  { label: "Small (400x300)", width: "400", height: "300" },
  { label: "Medium (500x400)", width: "500", height: "400" },
  { label: "Large (600x500)", width: "600", height: "500" },
  { label: "Full Width (100%x400)", width: "100%", height: "400" },
  { label: "Custom", width: "custom", height: "custom" },
];

const colorPresets = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
  { name: "Pink", value: "#ec4899" },
];

export function EmbedCodeGenerator({ waitlistSlug }: EmbedCodeGeneratorProps) {
  const [options, setOptions] = useState<EmbedOptions>({
    buttonText: "Join Waitlist",
    primaryColor: "#3b82f6",
    width: "500",
    height: "400",
    embedType: "iframe",
  });

  const [customSize] = useState({ width: "500", height: "400" });
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const generateEmbedUrl = () => {
    const params = new URLSearchParams();
    if (options.buttonText !== "Join Waitlist") {
      params.set("buttonText", options.buttonText);
    }
    if (options.primaryColor !== "#3b82f6") {
      params.set("color", options.primaryColor.replace("#", "%23"));
    }

    const queryString = params.toString();
    return `${baseUrl}/embed/${waitlistSlug}${queryString ? `?${queryString}` : ""}`;
  };

  const generateIframeCode = () => {
    const embedUrl = generateEmbedUrl();
    return `<iframe src="${embedUrl}" width="${options.width}" height="${options.height}" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;
  };

  const generateScriptCode = () => {
    const embedUrl = generateEmbedUrl();
    return `<div id="waitlist-embed-${waitlistSlug}"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${embedUrl}';
    iframe.width = '${options.width}';
    iframe.height = '${options.height}';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    document.getElementById('waitlist-embed-${waitlistSlug}').appendChild(iframe);
  })();
</script>`;
  };

  const getEmbedCode = () => {
    return options.embedType === "iframe"
      ? generateIframeCode()
      : generateScriptCode();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getEmbedCode()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSizeChange = (value: string) => {
    const preset = presetSizes.find(
      (size) => `${size.width}x${size.height}` === value
    );
    if (preset) {
      if (preset.width === "custom") {
        setOptions((prev) => ({
          ...prev,
          width: customSize.width,
          height: customSize.height,
        }));
      } else {
        setOptions((prev) => ({
          ...prev,
          width: preset.width,
          height: preset.height,
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={options.buttonText}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, buttonText: e.target.value }))
              }
              placeholder="Join Waitlist"
            />
          </div>

          <div>
            <Label htmlFor="embedType">Embed Type</Label>
            <Select
              value={options.embedType}
              onValueChange={(value: "iframe" | "script") =>
                setOptions((prev) => ({ ...prev, embedType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iframe">iFrame</SelectItem>
                <SelectItem value="script">JavaScript</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Primary Color</Label>
            <div className="flex gap-2 mt-2">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  className={`w-8 h-8 rounded-full border-2 ${
                    options.primaryColor === color.value
                      ? "border-gray-400"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      primaryColor: color.value,
                    }))
                  }
                  title={color.name}
                />
              ))}
            </div>
            <Input
              type="color"
              value={options.primaryColor}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  primaryColor: e.target.value,
                }))
              }
              className="mt-2 h-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Size Preset</Label>
            <Select onValueChange={handleSizeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {presetSizes.map((size) => (
                  <SelectItem
                    key={size.label}
                    value={`${size.width}x${size.height}`}
                  >
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={options.width}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, width: e.target.value }))
                }
                placeholder="500"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={options.height}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, height: e.target.value }))
                }
                placeholder="400"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>
      </div>

      {showPreview && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Preview</h4>
          <div className="border rounded-lg p-4 bg-gray-50">
            <iframe
              src={generateEmbedUrl()}
              width={options.width}
              height={options.height}
              style={{ border: "none", borderRadius: "8px", maxWidth: "100%" }}
              title="Waitlist Preview"
            />
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            {options.embedType === "iframe" ? "iFrame" : "JavaScript"} Embed
            Code
          </h4>
          <Button onClick={copyToClipboard} size="sm">
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </div>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{getEmbedCode()}</code>
        </pre>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Usage Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Copy the code above and paste it into your website&apos;s HTML
          </li>
          <li>
            • The embed will automatically match your customization options
          </li>
          <li>
            •{" "}
            {options.embedType === "iframe"
              ? "iFrame embeds are simpler but less flexible"
              : "JavaScript embeds offer more integration options"}
          </li>
          <li>• Test the embed on a staging environment before going live</li>
        </ul>
      </div>
    </div>
  );
}
