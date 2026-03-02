import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useAccount() {
  return useQuery({
    queryKey: [api.accounts.get.path],
    queryFn: async () => {
      const res = await fetch(api.accounts.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch account");
      return api.accounts.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.transfers.create.input>) => {
      const res = await fetch(api.transfers.create.path, {
        method: api.transfers.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Virement refusé: Le compte est bloqué.");
        }
        throw new Error(json.message || "Erreur lors du virement");
      }
      
      return api.transfers.create.responses[200].parse(json);
    },
    onSettled: () => {
      // Invalidate notifications regardless of success/fail to show alerts
      queryClient.invalidateQueries({ queryKey: [api.notifications.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.accounts.get.path] });
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: [api.notifications.list.path],
    queryFn: async () => {
      const res = await fetch(api.notifications.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return api.notifications.list.responses[200].parse(await res.json());
    },
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.notifications.markRead.path, {
        method: api.notifications.markRead.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark read");
      return api.notifications.markRead.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notifications.list.path] });
    },
  });
}

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profilePicture: string) => {
      const res = await fetch(api.profile.updatePicture.path, {
        method: api.profile.updatePicture.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update picture");
      return api.profile.updatePicture.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}
