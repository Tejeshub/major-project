import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/stores/app";
import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/seller/products")({
  component: SellerProducts,
});

function SellerProducts() {
  const products = useApp(s => s.sellerProducts);
  const add = useApp(s => s.addSellerProduct);
  const update = useApp(s => s.updateSellerProduct);
  const del = useApp(s => s.deleteSellerProduct);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const blank: Omit<import("@/data/seed").Product, "id"> = { name: "", category: "Plants", price: 199, gstRate: 5, seller: "Your Nursery", verified: true, stock: 10, rating: 4.5, image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=70", description: "" };
  const [form, setForm] = useState<Omit<import("@/data/seed").Product, "id">>(blank);

  const openEdit = (id: string) => {
    const p = products.find(x => x.id === id);
    if (p) { setForm({ ...p }); setEditing(id); setOpen(true); }
  };
  const openNew = () => { setForm(blank); setEditing(null); setOpen(true); };
  const save = () => {
    if (editing) update(editing, form);
    else add(form);
    setOpen(false);
    toast.success(editing ? "Product updated" : "Product published");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-xl">Products</h3>
        <button onClick={openNew} className="btn-rust !py-2 !px-4 text-sm"><Plus className="w-4 h-4" /> Add product</button>
      </div>
      <div className="card-warm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr><th className="p-3">Product</th><th>Cat</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-border/60">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-secondary" alt="" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td className="text-right p-3">
                  <button onClick={() => openEdit(p.id)} className="p-2 hover:bg-secondary rounded"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { del(p.id); toast.success("Deleted"); }} className="p-2 hover:bg-secondary rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-ink/40 z-50 flex justify-end">
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} onClick={e => e.stopPropagation()} className="bg-card w-full max-w-md h-full p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-xl">{editing ? "Edit" : "Add"} product</h3>
                <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <Field l="Name"><input className="input-warm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
                <Field l="Category"><select className="input-warm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })}>{["Plants", "Seeds", "Fertilizers", "Pots", "Tools"].map(c => <option key={c}>{c}</option>)}</select></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field l="Price ₹"><input type="number" className="input-warm" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} /></Field>
                  <Field l="Stock"><input type="number" className="input-warm" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} /></Field>
                </div>
                <Field l="GST rate"><select className="input-warm" value={form.gstRate} onChange={e => setForm({ ...form, gstRate: +e.target.value })}>{[0, 5, 12, 18].map(g => <option key={g} value={g}>{g}%</option>)}</select></Field>
                <Field l="Description"><textarea rows={3} className="input-warm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
                <Field l="Image URL"><input className="input-warm" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></Field>
                <button onClick={save} className="btn-rust w-full">{editing ? "Save changes" : "Publish product"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-medium block mb-1">{l}</label>{children}</div>;
}
