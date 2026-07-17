import { createFileRoute, Link } from "@tanstack/react-router";
import { useSupportTickets, useCreateSupportTicket } from "@/hooks/useSupport";
import { HelpCircle, Plus, AlertCircle, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_app/support")({
  component: SupportPage,
});

function SupportPage() {
  const { data: tickets = [], isLoading, isError } = useSupportTickets();
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-ink/60">Loading support tickets...</div>;
  }

  if (isError) {
    return (
      <div className="card-warm p-8 text-center text-destructive flex flex-col items-center gap-3 max-w-xl mx-auto mt-12">
        <AlertCircle className="w-8 h-8" />
        <p>Failed to load support tickets. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-rust" /> Help & Support
        </h1>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="btn-rust flex items-center gap-2"
        >
          {isCreating ? "Cancel" : <><Plus className="w-4 h-4" /> New Ticket</>}
        </button>
      </div>

      {isCreating && <CreateTicketForm onCreated={() => setIsCreating(false)} />}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border/50 pb-2">Your Tickets</h2>
        {tickets.length === 0 ? (
          <div className="card-warm p-12 text-center text-ink/60">
            You don't have any open support tickets.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tickets.map(t => (
              <div key={t.id} className="card-warm p-5 flex flex-col hover:border-rust/30 transition-colors">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-semibold text-lg line-clamp-1" title={t.subject}>{t.subject}</h3>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-sm text-ink/70 line-clamp-2 mb-4 flex-1">{t.description}</p>
                <div className="flex items-center justify-between text-xs text-ink/50 mt-auto pt-4 border-t border-border/50">
                  <span className="uppercase tracking-wide font-medium">{t.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                {t.resolution && (
                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-xs font-semibold text-green-700 mb-1">Resolution:</p>
                    <p className="text-sm text-ink/80">{t.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'open':
      return <span className="chip !bg-blue-100 text-blue-700 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Open</span>;
    case 'in_progress':
      return <span className="chip !bg-amber-100 text-amber-700 flex items-center gap-1"><MoreHorizontal className="w-3 h-3" /> In Progress</span>;
    case 'resolved':
      return <span className="chip !bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
    default:
      return <span className="chip">{status}</span>;
  }
}

function CreateTicketForm({ onCreated }: { onCreated: () => void }) {
  const { mutate: createTicket, isPending } = useCreateSupportTicket();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createTicket(
      {
        subject: form.get("subject") as string,
        description: form.get("description") as string,
        category: form.get("category") as string,
        priority: "normal"
      },
      {
        onSuccess: () => {
          toast.success("Support ticket created");
          onCreated();
        },
        onError: () => {
          toast.error("Failed to create ticket");
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="card-warm p-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
      <h2 className="text-xl font-semibold mb-2">Create New Support Ticket</h2>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Category</label>
        <select name="category" required className="input-field cursor-pointer">
          <option value="technical">Technical Issue (App/AI)</option>
          <option value="payment">Payment & Billing</option>
          <option value="consultation">Expert Consultation</option>
          <option value="marketplace">Marketplace Order</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Subject</label>
        <input name="subject" required className="input-field" placeholder="Brief summary of the issue" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description</label>
        <textarea 
          name="description" 
          required 
          className="input-field min-h-[120px] resize-y" 
          placeholder="Please describe your issue in detail..." 
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCreated} className="btn-ghost" disabled={isPending}>Cancel</button>
        <button type="submit" className="btn-rust" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Ticket"}
        </button>
      </div>
    </form>
  );
}
