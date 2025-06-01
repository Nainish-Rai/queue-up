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
import { Plus, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useWaitlists } from "@/app/providers/WaitlistProvider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
      <DialogContent className="sm:max-w-[425px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Plus className="w-5 h-5 text-primary" />
                </motion.div>
                Create New Waitlist
              </DialogTitle>
              <DialogDescription>
                Create a new waitlist for your product or service.
              </DialogDescription>
            </DialogHeader>

            <motion.div
              className="grid gap-4 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
                  disabled={createWaitlistMutation.isPending}
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
                  disabled={createWaitlistMutation.isPending}
                />
              </div>

              <AnimatePresence>
                {createWaitlistMutation.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-600 text-sm"
                  >
                    {createWaitlistMutation.error.message ||
                      "Failed to create waitlist"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={createWaitlistMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createWaitlistMutation.isPending}
                className="min-w-[100px]"
              >
                <AnimatePresence mode="wait">
                  {createWaitlistMutation.isPending ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
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
                    >
                      Create
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
