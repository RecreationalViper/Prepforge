import { notFound } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import { PAGES } from "@/lib/pages";
import ContactForm from "./ContactForm";

export const dynamicParams = false;
export function generateStaticParams() { return [...Object.keys(PAGES), "contact"].map((slug) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) { return { title: params.slug === "contact" ? "Contact Us" : PAGES[params.slug]?.title }; }

export default function Page({ params }: { params: { slug: string } }) {
  if (params.slug === "contact") return (
    <div className="page"><GlassCard className="prose"><h1>Contact Us</h1><p>Questions, press, partnerships or a recipe you think we should feature. We read everything.</p><ContactForm /></GlassCard></div>
  );
  const d = PAGES[params.slug]; if (!d) notFound();
  return (
    <div className="page">
      <GlassCard as="article" className="prose">
        <h1>{d.title}</h1>
        <p>{d.lead}</p>
        {d.sections.map(([h, ps]) => (<section key={h}><h2>{h}</h2>{ps.map((p, i) => <p key={i}>{p}</p>)}</section>))}
      </GlassCard>
    </div>
  );
}
