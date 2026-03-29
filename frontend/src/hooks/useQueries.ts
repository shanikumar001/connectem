import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { useAuth } from "./useAuth";
import type {
  CompanyProfile,
  MentorProfile,
  UserProfile,
  UserRole,
} from "../types";

export function useUserProfile() {
  const { isLoggedIn } = useAuth();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const data = await apiFetch<{ user: UserProfile }>("/api/profile");
      return data.user;
    },
    enabled: isLoggedIn,
  });
}

export function useIsProfileComplete() {
  const { isLoggedIn } = useAuth();
  return useQuery<boolean>({
    queryKey: ["isProfileComplete"],
    queryFn: async () => {
      const data = await apiFetch<{ isComplete: boolean }>(
        "/api/profile/complete",
      );
      return data.isComplete;
    },
    enabled: isLoggedIn,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (profile: {
      role: UserRole;
      mentorProfile?: MentorProfile;
      companyProfile?: CompanyProfile;
    }) => {
      await apiFetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          mentorProfile: profile.mentorProfile,
          companyProfile: profile.companyProfile,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["isProfileComplete"] });
      refreshUser();
    },
  });
}

export function useSubmitRequestAccess() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      roleInterest: string;
      message: string;
    }) => {
      await apiFetch("/api/request-access", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
}

// Admin Hooks
export function useUsers() {
  const { user } = useAuth();
  return useQuery<UserProfile[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const data = await apiFetch<{ users: UserProfile[] }>("/api/users");
      return data.users;
    },
    enabled: !!user?.isAdmin,
  });
}

export function useUpdateUserAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UserProfile> }) => {
      await apiFetch(`/api/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(`/api/users/${id}/approve`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(`/api/users/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export type { UserRole };
