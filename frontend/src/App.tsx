import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { Navbar } from "./components/Navbar";
import { RequestAccessModal } from "./components/RequestAccessModal";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProfileSetupPage } from "./pages/ProfileSetupPage";

// Root layout component
function RootLayout() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [requestOpen, setRequestOpen] = useState(false);

  function openSignIn() {
    setAuthTab("signin");
    setAuthOpen(true);
  }
  function openRequestAccess() {
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
    const [authOpen, setAuthOpen] = useState(false);
    const [requestOpen, setRequestOpen] = useState(false);
    return (
      <>
        <HomePage
          onRequestAccess={() => setRequestOpen(true)}
          onSignIn={() => setAuthOpen(true)}
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileSetupRoute,
  profileRoute,
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
