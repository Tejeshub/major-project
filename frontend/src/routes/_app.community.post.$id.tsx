import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { usePosts, useToggleLike, useAddComment } from "@/hooks/useCommunity";
import { Heart, ArrowLeft, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/community/post/$id")({
  component: PostDetail,
});

function PostDetail() {
  const { id } = useParams({ from: "/_app/community/post/$id" });
  const [text, setText] = useState("");

  const { data: posts = [], isLoading, isError, refetch } = usePosts();
  const toggleLikeMut = useToggleLike();
  const addCommentMut = useAddComment();

  const post = posts.find((p) => p.id === id);

  const toggleLike = (postId: string) => {
    if (post) toggleLikeMut.mutate({ postId, liked: !post.liked });
  };

  const addComment = (postId: string, commentText: string) => {
    if (commentText.trim() && !addCommentMut.isPending) {
      addCommentMut.mutate({ postId, text: commentText });
      setText("");
    }
  };

  if (isLoading) return <div className="text-center py-20 animate-pulse text-muted-foreground">Loading post...</div>;
  if (isError) return (
    <div className="max-w-xl mx-auto py-20 text-center flex flex-col items-center gap-4">
      <p className="text-muted-foreground">Unable to load the post right now.</p>
      <button onClick={() => refetch()} className="btn-ghost-border px-6 py-2">Retry</button>
    </div>
  );
  if (!post) return <div className="text-center py-20 text-muted-foreground">Post not found.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/community" className="text-sm text-muted-foreground mb-4 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <article className="card-warm overflow-hidden">
        <img src={post.image} alt="" className="w-full aspect-video object-cover" />
        <div className="p-5">
          <div className="flex items-center gap-3">
            <img src={post.avatar} className="w-11 h-11 rounded-full" alt="" />
            <div>
              <p className="font-medium">{post.user}</p>
              <p className="text-xs text-muted-foreground">{post.city} · {post.ts}</p>
            </div>
            <button onClick={() => toggleLike(post.id)} className="ml-auto flex items-center gap-1.5">
              <motion.div whileTap={{ scale: 1.4 }}><Heart className={`w-6 h-6 ${post.liked ? "fill-rust text-rust" : "text-ink/60"}`} /></motion.div>
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
          </div>
          <p className="mt-4 text-ink/85 leading-relaxed">{post.caption}</p>
        </div>
      </article>

      <div className="mt-6 space-y-3">
        <h3 className="font-display text-lg">Comments</h3>
        {post.comments.length === 0 && <p className="text-sm text-muted-foreground italic">No comments yet — be the first.</p>}
        {post.comments.map(c => (
          <div key={c.id} className="flex gap-3">
            <img src={c.avatar} className="w-9 h-9 rounded-full bg-secondary" alt="" />
            <div className="card-warm p-3 flex-1">
              <p className="font-medium text-sm">{c.user} <span className="text-xs text-muted-foreground font-normal">· {c.ts}</span></p>
              <p className="text-sm text-ink/80 mt-1">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-20 md:bottom-4 mt-6 flex gap-2 bg-card p-3 rounded-full shadow-warm">
        <input className="input-warm !border-0 !p-2 flex-1 !bg-transparent" placeholder="Add a comment..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && text.trim()) { addComment(post.id, text); setText(""); } }} />
        <button onClick={() => { if (text.trim()) { addComment(post.id, text); setText(""); } }} className="w-9 h-9 bg-rust rounded-full text-white flex items-center justify-center"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
