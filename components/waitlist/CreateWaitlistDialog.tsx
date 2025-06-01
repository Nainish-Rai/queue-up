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
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWaitlists } from "@/app/providers/WaitlistProvider";
import { motion, AnimatePresence } from "framer-motion";

interface CreateWaitlistDialogProps {
  trigger?: React.ReactNode;
}

export function CreateWaitlistDialog({ trigger }: CreateWaitlistDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const { createWaitlistMutation } = useWaitlists();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createWaitlistMutation.mutateAsync({ name, slug });
      setIsOpen(false);
      setName("");
      setSlug("");
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Error creating waitlist:", error);
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
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Create Waitlist
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-0 border bg-background/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-none">
        <motion.div
          className="relative rounded-2xl shadow-2xl overflow-hidden"
          // initial={{ opacity: 0, scale: 0.95 }}
          // animate={{ opacity: 1, scale: 1 }}
          // exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 " />

          <div className="relative p-8">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="mb-6">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                  Create New Waitlist
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-2">
                  Create a new waitlist for your product or service.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="font-medium">
                    Waitlist Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    className="bg-white/10 backdrop-blur-sm border-white/20 focus:border-white/40"
                    placeholder="My Awesome Product"
                    required
                    disabled={createWaitlistMutation.isPending}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="slug" className="font-medium">
                    URL Slug
                  </Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/20 focus:border-white/40"
                    placeholder="my-awesome-product"
                    pattern="^[a-z0-9-]+$"
                    title="Lowercase letters, numbers and hyphens only"
                    required
                    disabled={createWaitlistMutation.isPending}
                  />
                </div>

                <AnimatePresence>
                  {createWaitlistMutation.error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 p-4 rounded-lg text-red-600 text-sm"
                    >
                      {createWaitlistMutation.error.message ||
                        "Failed to create waitlist"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DialogFooter className="mt-8 gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsOpen(false)}
                  disabled={createWaitlistMutation.isPending}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createWaitlistMutation.isPending}
                  className="min-w-[120px] "
                >
                  <AnimatePresence mode="wait">
                    {createWaitlistMutation.isPending ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center  gap-2"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="create"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </DialogFooter>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
