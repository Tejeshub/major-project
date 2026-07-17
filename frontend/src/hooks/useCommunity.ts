import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/apiClient";
import type { CommunityPost } from "@/data/seed";

export const QUERY_KEYS = {
  posts: (params: any) => ["posts", params],
};

export function usePosts(params: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.posts(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.set("limit", params.limit.toString());
      if (params.offset) searchParams.set("offset", params.offset.toString());
      
      const qs = searchParams.toString();
      const res = await fetchWithAuth(`/posts${qs ? `?${qs}` : ""}`);
      return res.items as CommunityPost[];
    },
    retry: 1, // Don't aggressively retry on the feed to fail faster for empty states
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { image: string; caption: string }) => {
      return fetchWithAuth("/posts", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (liked) {
        return fetchWithAuth(`/posts/${postId}/like`, { method: "POST" });
      } else {
        return fetchWithAuth(`/posts/${postId}/like`, { method: "DELETE" });
      }
    },
    // Optimistic Update
    onMutate: async ({ postId, liked }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ queryKey: ["posts"] });

      // Optimistically update to the new value
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: CommunityPost[] | undefined) => {
        if (!old) return old;
        return old.map(p => 
          p.id === postId 
            ? { ...p, liked, likes: liked ? p.likes + 1 : p.likes - 1 } 
            : p
        );
      });

      // Return a context object with the snapshotted value
      return { previousQueries };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newLike, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, text }: { postId: string; text: string }) => {
      return fetchWithAuth(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
