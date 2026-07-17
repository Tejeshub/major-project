import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/apiClient";

export const QUERY_KEYS = {
  experts: (params: any) => ["experts", params],
  expert: (id: string) => ["expert", id],
  consultations: (params: any) => ["consultations", params],
  consultationMessages: (id: string) => ["consultation-messages", id],
};

export function useExperts(params: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.experts(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.set("limit", params.limit.toString());
      if (params.offset) searchParams.set("offset", params.offset.toString());
      
      const qs = searchParams.toString();
      const res = await fetchWithAuth(`/experts${qs ? `?${qs}` : ""}`);
      return res.items;
    },
    retry: 1,
  });
}

export function useExpert(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.expert(id),
    queryFn: async () => {
      return await fetchWithAuth(`/experts/${id}`);
    },
    retry: 1,
    enabled: !!id,
  });
}

export function useBookConsultation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { expert_id: string; slot: string; mode: string }) => {
      return await fetchWithAuth("/consultations", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.consultations({}) });
    }
  });
}

export function useConsultations(params: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.consultations(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.set("limit", params.limit.toString());
      if (params.offset) searchParams.set("offset", params.offset.toString());
      
      const qs = searchParams.toString();
      const res = await fetchWithAuth(`/consultations${qs ? `?${qs}` : ""}`);
      return res.items || [];
    },
    retry: 1,
  });
}

export function useConsultation(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.consultationMessages(id),
    queryFn: async () => {
      return await fetchWithAuth(`/consultations/${id}`);
    },
    retry: 1,
    enabled: !!id,
  });
}

export function useSendMessage(consultationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      return await fetchWithAuth(`/consultations/${consultationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text })
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.consultationMessages(consultationId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.consultations({}) });
    }
  });
}
