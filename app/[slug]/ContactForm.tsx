"use client";
import { useState } from "react";
// Sends through the visitor's own mail app to the address in NEXT_PUBLIC_CONTACT_EMAIL.
const TO = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", topic: "General", msg: "" });
  const [sent, setSent] = useState(false);
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${f.msg}\n\n— ${f.name} (${f.email})`;
    if (TO) location.href = `mailto:${TO}?subject=${encodeURIComponent(`[PrepForge] ${f.topic}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  if (sent) return <p>Thank you{f.name ? `, ${f.name.split(" ")[0]}` : ""}. {TO ? "Your mail app has the message ready to send." : "Messages open shortly; please check back soon."}</p>;
  return (
    <form onSubmit={send} className="stack" style={{ marginTop: 16 }}>
      <input className="input" required placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input className="input" required type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <select className="input" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>{["General", "Help", "Press", "Partnerships", "Careers"].map((t) => <option key={t}>{t}</option>)}</select>
      <textarea className="input" required rows={5} placeholder="Message" style={{ padding: 12, minHeight: 120 }} value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} />
      <button className="btn primary">Send</button>
    </form>
  );
}
