import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  onRequestAccess: () => void;
  onSignIn: () => void;
}

export function Navbar({ onRequestAccess, onSignIn }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const displayName =
    user?.mentorProfile?.fullName ??
    user?.companyProfile?.companyName ??
    user?.email?.split("@")[0] ??
    "User";

  const initials = displayName
    ? displayName
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Services", href: "/#philosophy" },
    { label: "Trust", href: "/#trust" },
    { label: "Contact", href: "/#cta" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif font-bold text-xl text-foreground">
            CE
          </span>
          <span className="text-foreground font-semibold tracking-tight text-sm hidden sm:inline">
            ConnectEm
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-7"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={onRequestAccess}
            data-ocid="nav.request_access.button"
            className="rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85 text-sm px-5"
          >
            Request Mentor
          </Button>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="nav.profile.dropdown_menu"
                  className="flex items-center gap-2 hover:bg-muted rounded-full px-2 py-1 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-foreground text-primary-foreground text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-modal">
                <div className="px-3 py-3 border-b border-border">
                  <p className="font-semibold text-sm truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {user?.role ?? "Member"}
                  </p>
                </div>
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    data-ocid="nav.view_profile.link"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin"
                      data-ocid="nav.admin_dashboard.link"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  data-ocid="nav.sign_out.button"
                  className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              data-ocid="nav.sign_in.button"
              className="text-sm text-foreground hover:underline transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Button
              onClick={() => {
                onRequestAccess();
                setMobileOpen(false);
              }}
              className="w-full rounded-full"
            >
              Request Mentor
            </Button>
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-center hover:underline"
                >
                  View Profile
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-center hover:underline"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-sm text-destructive hover:underline"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onSignIn();
                  setMobileOpen(false);
                }}
                className="text-sm hover:underline"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
