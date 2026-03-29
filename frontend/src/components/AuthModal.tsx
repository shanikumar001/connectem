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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({
  open,
  onClose,
  defaultTab = "signin",
}: AuthModalProps) {
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.mentor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      resetAndClose();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(email, password, selectedRole);
      toast.success("Account created successfully!");
      resetAndClose();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetAndClose() {
    setEmail("");
    setPassword("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent
        className="sm:max-w-md shadow-modal"
        data-ocid="auth.modal"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {tab === "signin" ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {tab === "signin"
              ? "Sign in with your email and password."
              : "Create an account to get started."}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "signin" | "signup")}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" data-ocid="auth.signin.tab">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" data-ocid="auth.signup.tab">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="pt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  data-ocid="auth.signin.email.input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  data-ocid="auth.signin.password.input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-ocid="auth.signin.submit_button"
                className="w-full rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </>
                )}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full"
                onClick={async () => {
                  setEmail("admin@connectem.com");
                  setPassword("AdminPass123");
                  // Small delay to allow state update if needed, but login() takes values from closure usually.
                  // Actually, better to just call login directly with the values.
                  setIsSubmitting(true);
                  try {
                    await login("admin@connectem.com", "AdminPass123");
                    toast.success("Logged in as Admin");
                    resetAndClose();
                  } catch (err: unknown) {
                    toast.error("Admin login failed");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                Login as Admin
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="pt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  data-ocid="auth.signup.email.input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  data-ocid="auth.signup.password.input"
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-1.5">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    data-ocid="auth.mentor_role.toggle"
                    onClick={() => setSelectedRole(UserRole.mentor)}
                    className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      selectedRole === UserRole.mentor
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className="font-semibold text-sm">Mentor</div>
                    <div
                      className={`text-xs mt-1 ${
                        selectedRole === UserRole.mentor
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      Industry professional offering expertise
                    </div>
                  </button>
                  <button
                    type="button"
                    data-ocid="auth.company_role.toggle"
                    onClick={() => setSelectedRole(UserRole.company)}
                    className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      selectedRole === UserRole.company
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className="font-semibold text-sm">Company</div>
                    <div
                      className={`text-xs mt-1 ${
                        selectedRole === UserRole.company
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      Team or institution seeking mentors
                    </div>
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-ocid="auth.signup.submit_button"
                className="w-full rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    account…
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" /> Create Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
