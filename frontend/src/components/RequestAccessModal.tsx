import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitRequestAccess } from "../hooks/useQueries";

interface RequestAccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function RequestAccessModal({ open, onClose }: RequestAccessModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    roleInterest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useSubmitRequestAccess();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.roleInterest) {
      toast.error("Please select your role.");
      return;
    }
    if (form.message.trim().length < 20) {
      toast.error("Message must be at least 20 characters.");
      return;
    }
    try {
      await mutateAsync(form);
      setSubmitted(true);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit. Please try again.",
      );
    }
  }

  function handleClose() {
    setSubmitted(false);
    setForm({ name: "", email: "", roleInterest: "", message: "" });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="sm:max-w-lg shadow-modal"
        data-ocid="request_access.modal"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Request Access
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Access is reviewed for both mentors and organizations. We'll be in
            touch.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div
            className="py-8 text-center space-y-3"
            data-ocid="request_access.success_state"
          >
            <CheckCircle className="h-12 w-12 text-foreground mx-auto" />
            <p className="font-serif text-xl">Request received</p>
            <p className="text-sm text-muted-foreground">
              We review every request personally. Expect a response within 3–5
              business days.
            </p>
            <Button
              onClick={handleClose}
              data-ocid="request_access.close_button"
              className="mt-2 rounded-full"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ra-name">Full Name</Label>
                <Input
                  id="ra-name"
                  data-ocid="request_access.name.input"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ra-email">Email</Label>
                <Input
                  id="ra-email"
                  type="email"
                  data-ocid="request_access.email.input"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>I am a</Label>
              <Select
                value={form.roleInterest}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, roleInterest: v }))
                }
                required
              >
                <SelectTrigger data-ocid="request_access.role.select">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentor">
                    Mentor — industry professional
                  </SelectItem>
                  <SelectItem value="company">
                    Company — team or institution
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ra-message">Message</Label>
              <Textarea
                id="ra-message"
                data-ocid="request_access.message.textarea"
                placeholder="Tell us briefly about yourself and what you're looking for…"
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                required
                minLength={20}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="request_access.submit_button"
              className="w-full rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
