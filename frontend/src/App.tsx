import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { Navbar } from "./components/Navbar";
import { RequestAccessModal } from "./components/RequestAccessModal";
import { useAuth } from "./hooks/useAuth";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProfileSetupPage } from "./pages/ProfileSetupPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MentorsPage } from "@/pages/MentorsPage";
import { useEffect } from "react";

// Root layout component
function RootLayout() {
  const { isLoggedIn, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [requestOpen, setRequestOpen] = useState(false);

  // Onboarding guard
  useEffect(() => {
    if (!isLoading && isLoggedIn && user && !user.isProfileCompleted) {
      const path = window.location.pathname;
      if (path !== "/profile/setup") {
        navigate({ to: "/profile/setup" });
      }
    }
  }, [isLoggedIn, user, isLoading, navigate]);

  function openSignIn() {
    setAuthTab("signin");
    setAuthOpen(true);
  }
  function openRequestAccess() {
    if (!isLoggedIn) {
      setAuthTab("signin");
      setAuthOpen(true);
      return;
    }
    setRequestOpen(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onRequestAccess={openRequestAccess} onSignIn={openSignIn} />
      <Outlet />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
      <RequestAccessModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
      />
      <Toaster />
    </div>
  );
}

// Routes
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    const { isLoggedIn } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [requestOpen, setRequestOpen] = useState(false);
    return (
      <>
        <HomePage
          onRequestAccess={() => {
            if (!isLoggedIn) {
              setAuthOpen(true);
              return;
            }
            setRequestOpen(true);
          }}
          onSignIn={() => setAuthOpen(true)}
          isLoggedIn={isLoggedIn}
        />
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          defaultTab="signin"
        />
        <RequestAccessModal
          open={requestOpen}
          onClose={() => setRequestOpen(false)}
        />
      </>
    );
  },
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/setup",
  component: ProfileSetupPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const mentorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mentors",
  component: MentorsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileSetupRoute,
  profileRoute,
  adminRoute,
  dashboardRoute,
  mentorsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
