import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/apiClient";

export type Reminder = {
  id: string;
  plantId: number;
  task: "Water" | "Fertilize" | "Prune";
  dueAt: string; // ISO
  repeat: "none" | "daily" | "2day" | "weekly";
  status: "pending" | "completed";
};

const QUERY_KEYS = {
  reminders: ["reminders"] as const,
};

// We redefine the frontend shape here, or keep using the one from app.ts (temporarily)
export function useReminders() {
  return useQuery({
    queryKey: QUERY_KEYS.reminders,
    queryFn: async () => {
      const data = await fetchWithAuth("/reminders");
      return (data.items || []) as Reminder[];
    },
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Reminder, "id" | "status">) => {
      const response = await fetchWithAuth("/reminders", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response as Reminder;
    },
    onSuccess: (newReminder) => {
      queryClient.setQueryData(QUERY_KEYS.reminders, (old: Reminder[] | undefined) => {
        return old ? [...old, newReminder] : [newReminder];
      });
      // Optionally invalidate to ensure sync
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
    },
  });
}

export function useCompleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetchWithAuth(`/reminders/${id}/complete`, {
        method: "POST",
      });
      return response as Reminder;
    },
    onSuccess: (updatedReminder) => {
      queryClient.setQueryData(QUERY_KEYS.reminders, (old: Reminder[] | undefined) => {
        if (!old) return [];
        return old.map(r => r.id === updatedReminder.id ? updatedReminder : r);
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
    },
  });
}

export function useEditReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Reminder, "id">> }) => {
      const response = await fetchWithAuth(`/reminders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response as Reminder;
    },
    onSuccess: (updatedReminder) => {
      queryClient.setQueryData(QUERY_KEYS.reminders, (old: Reminder[] | undefined) => {
        if (!old) return [];
        return old.map(r => r.id === updatedReminder.id ? updatedReminder : r);
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetchWithAuth(`/reminders/${id}`, {
        method: "DELETE",
      });
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(QUERY_KEYS.reminders, (old: Reminder[] | undefined) => {
        if (!old) return [];
        return old.filter(r => r.id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reminders });
    },
  });
}
