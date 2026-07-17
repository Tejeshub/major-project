import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/apiClient";

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  readAt: string | null;
  actionUrl: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
};

const QUERY_KEYS = {
  notifications: ["notifications"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: async () => {
      const data = await fetchWithAuth("/notifications");
      return (data.items || []) as Notification[];
    },
    refetchInterval: 30000, // Poll every 30s
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetchWithAuth(`/notifications/${id}/read`, {
        method: "PATCH",
      });
      return response as Notification;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications });
      const previous = queryClient.getQueryData<Notification[]>(QUERY_KEYS.notifications);
      if (previous) {
        queryClient.setQueryData<Notification[]>(QUERY_KEYS.notifications, (old) => {
          if (!old) return [];
          return old.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n);
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.notifications, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetchWithAuth("/notifications/read-all", { method: "POST" });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications });
      const previous = queryClient.getQueryData<Notification[]>(QUERY_KEYS.notifications);
      if (previous) {
        queryClient.setQueryData<Notification[]>(QUERY_KEYS.notifications, (old) => {
          if (!old) return [];
          return old.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }));
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.notifications, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
}
