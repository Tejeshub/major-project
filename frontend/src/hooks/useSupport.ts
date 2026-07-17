import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/apiClient";

export type SupportTicket = {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  attachmentUrl: string | null;
  assignedTo: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
};

const QUERY_KEYS = {
  supportTickets: ["supportTickets"] as const,
  supportTicket: (id: string) => ["supportTickets", id] as const,
};

export function useSupportTickets() {
  return useQuery({
    queryKey: QUERY_KEYS.supportTickets,
    queryFn: async () => {
      const data = await fetchWithAuth("/support/tickets");
      return (data.items || []) as SupportTicket[];
    },
  });
}

export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.supportTicket(id),
    queryFn: async () => {
      const data = await fetchWithAuth(`/support/tickets/${id}`);
      return data as SupportTicket;
    },
    enabled: !!id,
  });
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: Partial<SupportTicket>) => {
      const response = await fetchWithAuth("/support/tickets", {
        method: "POST",
        body: JSON.stringify(ticket),
      });
      return response as SupportTicket;
    },
    onSuccess: (newTicket) => {
      queryClient.setQueryData(QUERY_KEYS.supportTickets, (old: SupportTicket[] | undefined) => {
        return old ? [newTicket, ...old] : [newTicket];
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.supportTickets });
    },
  });
}
