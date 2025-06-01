"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createWaitlist } from "@/lib/api";
import { useRouter } from "next/navigation";

interface CreateWaitlistDialogProps {
  trigger?: React.ReactNode;
}

export function CreateWaitlistDialog({ trigger }: CreateWaitlistDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      await createWaitlist({ name, slug });
      setIsOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to create waitlist");
    } finally {
      setIsCreating(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, "-")) {
      setSlug(newName.toLowerCase().replace(/\s+/g, "-"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-1">
            <Plus size={16} /> Create Waitlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Waitlist</DialogTitle>
            <DialogDescription>
              Create a new waitlist for your product or service.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                className="col-span-3"
                placeholder="My Awesome Product"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="col-span-3"
                placeholder="my-awesome-product"
                pattern="^[a-z0-9-]+$"
                title="Lowercase letters, numbers and hyphens only"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 p-3 rounded text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
