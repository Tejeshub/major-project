import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useState } from "react";
import { Send, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_app/consultations/$id/chat")({
  component: Chat,
});

function Chat() {
  const { id } = useParams({ from: "/_app/consultations/$id/chat" });
  const c = useApp(s => s.consultations.find(x => x.id === id));
  const send = useApp(s => s.sendMessage);
  const [text, setText] = useState("");

  if (!c) return <div className="text-center py-20">Session not found.</div>;

  return (
    <div className="max-w-3xl mx-auto grid md:grid-cols-[200px_1fr] gap-4 min-h-[70vh]">
      <aside className="card-warm p-4 hidden md:block">
        <Link to="/consultations" className="text-xs text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Back</Link>
        <img src={c.expertAvatar} className="w-16 h-16 rounded-full mx-auto mt-3" alt="" />
        <p className="font-display text-center mt-2">{c.expertName}</p>
        <p className="text-xs text-muted-foreground text-center">{c.specialisation}</p>
        <p className="text-xs text-center mt-3 chip mx-auto inline-flex">{c.slot}</p>
      </aside>

      <div className="card-warm flex flex-col">
        <div className="p-3 border-b border-border flex items-center gap-2 md:hidden">
          <Link to="/consultations"><ArrowLeft className="w-4 h-4" /></Link>
          <img src={c.expertAvatar} className="w-8 h-8 rounded-full" alt="" />
          <p className="font-medium text-sm">{c.expertName}</p>
        </div>
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {c.messages.map(m => (
            <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${m.from === "user" ? "bg-rust text-white" : "bg-indigo-dusk text-sand"}`}>
                {m.text}
                <p className={`text-[10px] mt-1 opacity-60`}>{m.ts}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border flex gap-2">
          <input className="input-warm flex-1" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && text.trim()) { send(c.id, text); setText(""); } }} />
          <button onClick={() => { if (text.trim()) { send(c.id, text); setText(""); } }} className="w-10 h-10 bg-rust text-white rounded-full flex items-center justify-center"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
