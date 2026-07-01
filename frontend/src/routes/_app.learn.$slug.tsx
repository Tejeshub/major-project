import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { SEED_GUIDES } from "@/data/seed";
import { Lightbulb } from "lucide-react";

export const Route = createFileRoute("/_app/learn/$slug")({
  component: GuideDetail,
});

function GuideDetail() {
  const { slug } = useParams({ from: "/_app/learn/$slug" });
  const guide = SEED_GUIDES.find(g => g.slug === slug);
  if (!guide) return <div className="text-center py-20">Guide not found.</div>;
  const related = SEED_GUIDES.filter(g => g.slug !== slug).slice(0, 3);

  return (
    <article className="max-w-3xl mx-auto">
      <img src={guide.cover} alt="" className="w-full aspect-[2/1] object-cover rounded-2xl shadow-warm" />
      <div className="mt-6">
        <span className="eyebrow">{guide.category}</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2 leading-tight">{guide.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">By PlantNest Editorial · {guide.readTime} read</p>
      </div>
      <div className="mt-8 space-y-4 text-ink/85 leading-relaxed">
        <p className="text-lg first-letter:font-display first-letter:text-4xl first-letter:text-rust first-letter:mr-1 first-letter:float-left">{guide.body}</p>
        <h2 className="font-display text-2xl pt-4">Key tips</h2>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Start with the right pot size — too small and roots cramp.</li>
          <li>Use well-draining mix: 50% cocopeat, 30% compost, 20% perlite.</li>
          <li>Water when the top inch of soil is dry to the touch.</li>
          <li>Feed monthly during the growing season.</li>
        </ul>
        <div className="card-warm bg-amber-soft/40 p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-rust shrink-0 mt-0.5" />
          <p className="text-sm">Pro tip: most balcony plant failures trace back to overwatering. When in doubt, wait a day.</p>
        </div>
        <p>Apply these consistently and you'll see results in a few weeks.</p>
      </div>
      <div className="mt-12">
        <h3 className="font-display text-2xl mb-4">Related guides</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {related.map(g => (
            <Link key={g.slug} to="/learn/$slug" params={{ slug: g.slug }} className="card-warm card-warm-hover overflow-hidden block">
              <img src={g.cover} alt="" className="aspect-video object-cover w-full" loading="lazy" />
              <div className="p-3">
                <p className="font-display text-base leading-tight">{g.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{g.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
