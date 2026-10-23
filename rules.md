# Frontend Design Directives

## Anti-Patterns (Do NOT Do This)
- Do NOT use generic purple/blue gradients or centered feature cards with huge stock icons.
- Do NOT use generic 1px gray borders on flat pure-black backgrounds.
- Do NOT build static buttons without hover, active, and focus-visible states.

## Visual Craft & Modern Polish
- **Color & Depth:** Use a unified dark theme (e.g., `zinc-950` base, `zinc-900/60` elevated surfaces, `white/10` borders).
- **Typography:** Tight tracking (`tracking-tight`) on large headings, clear contrast ratios (avoid low-contrast gray text on gray backgrounds).
- **Micro-interactions:** Add smooth transitions (`transition-all duration-200 ease-out`), subtle scale clicks (`active:scale-[0.98]`), and clear focus rings (`focus-visible:ring-2`).
- **Components:** Rely on accessible primitives (Radix / shadcn/ui) instead of custom unstyled divs.