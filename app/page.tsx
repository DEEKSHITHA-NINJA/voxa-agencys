"use client";

import { FormEvent, useState } from "react";

const sectors = [
  { icon: "⌂", name: "Real estate", metric: "3.4× more viewings", call: "Qualifies buyer budget and schedules property tours", color: "#d8ff55" },
  { icon: "✦", name: "Salons & spas", metric: "42% fewer no-shows", call: "Books appointments and fills last-minute slots", color: "#ffb5d8" },
  { icon: "▣", name: "E-commerce", metric: "+19% cart recovery", call: "Recovers carts and answers order questions", color: "#a7d7ff" },
  { icon: "✚", name: "Clinics & hospitals", metric: "24/7 patient care", call: "Triages callers and books the right specialist", color: "#baf3dc" },
  { icon: "▱", name: "Schools & academies", metric: "2.6× enrollment", call: "Follows up with families and secures admissions", color: "#ffe394" },
  { icon: "⌁", name: "Hotels & restaurants", metric: "31% more covers", call: "Takes reservations and upsells every booking", color: "#d2c2ff" },
  { icon: "↗", name: "Home services", metric: "Every lead answered", call: "Captures job details and dispatches faster", color: "#ffb18d" },
  { icon: "◒", name: "Logistics & local", metric: "60% less admin", call: "Shares live updates and handles routine requests", color: "#bdeaff" }
  ,{ icon: "☕", name: "College canteens", metric: "Faster pre-orders", call: "Takes meal orders, shares menus and reduces busy-hour queues", color: "#ffd6a5" }
];

function LeadForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "sms-off" | "error">("idle");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, source: compact ? "footer" : "hero" }) });
    const result = await res.json().catch(() => null);
    setStatus(res.ok ? (result?.smsStatus === "sent" ? "done" : "sms-off") : "error");
    if (res.ok) form.reset();
  }
  if (status === "done") return <div className="success">You’re on the list. We’ll be in touch within one business day. ✦</div>;
  if (status === "sms-off") return <div className="success">Your booking request was received. SMS confirmation is temporarily unavailable; our team will contact you shortly.</div>;
  return <form className={compact ? "footer-form" : "lead-form"} onSubmit={submit}>
    <input name="name" placeholder="Your name" required aria-label="Your name" />
    <input name="email" type="email" placeholder="Work email" required aria-label="Work email" />
    {!compact && <><input name="mobile" type="tel" placeholder="Mobile number" required aria-label="Mobile number" /><input name="city" placeholder="City" required aria-label="City" /><textarea name="message" placeholder="What would you like your agent to handle?" aria-label="Message" rows={3}/></>}
    <button type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending..." : "Book my conversion call →"}</button>
    {status === "error" && <small>Something went wrong. Please try again.</small>}
  </form>;
}

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [menu, setMenu] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const current = sectors[selected];
  return <main>
    <nav>
      <a className="logo" href="#top"><span>V</span> VOXA</a>
      <div className={menu ? "nav-links open" : "nav-links"}><a href="#solutions">Solutions</a><a href="#how">How it works</a><a href="#results">Results</a></div>
      <a className="nav-cta" href="#contact">Let&apos;s talk <b>↗</b></a>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">☰</button>
    </nav>

    <section className="hero" id="top">
      <div className="halo one"/><div className="halo two"/>
      <div className="eyebrow"><i/> THE ALWAYS-ON REVENUE TEAM</div>
      <h1>Your best closer<br/>never <em>clocks out.</em></h1>
      <p className="hero-copy">Voice and chat agents that answer, qualify, convince and convert — in every language your customers speak. Your customers get a real conversation, never a dead end.</p>
      <div className="hero-actions"><a className="primary" href="#contact">Build my agent <span>→</span></a><a className="play" href="#how"><i>▶</i> See it in action</a></div><p className="hero-slogan">Every ring is a revenue opportunity.</p>
      <div className="proof"><div className="avatars"><b>J</b><b>R</b><b>A</b><b>+</b></div><span>Trusted by growth-minded<br/><strong>teams worldwide</strong></span></div>
      <div className="hero-3d" aria-label="Animated VOXA conversion workflow"><div className="hero-ring ring-a"/><div className="hero-ring ring-b"/><div className="hero-ring ring-c"/><div className="hero-core"><span>V</span><i/></div><div className="hero-float float-lead"><small>NEW LEAD</small><b>Maya Sharma</b><span>Property viewing</span></div><div className="hero-float float-booked"><small>VOXA ACTION</small><b>Viewing booked</b><span>Saturday · 2:30 PM</span><i>✓</i></div><div className="hero-float float-language"><small>LANGUAGE</small><b>हिन्दी · ಕನ್ನಡ</b><span>Voice detected</span></div><div className="hero-float float-spark">✦</div><div className="hero-label">VOXA IS WORKING <span>●</span></div></div>
    </section>

    <section className="logos"><p>BUILT FOR TEAMS WHO REFUSE TO LEAVE REVENUE ON THE TABLE</p><div><b>northstar</b><b>arc<span>®</span></b><b>HORIZON</b><b>GOODFORM</b><b>mango<span>+</span></b></div></section>

    <section className="solutions" id="solutions"><div className="section-intro"><div className="eyebrow dark"><i/> ONE AGENT. EVERY INDUSTRY.</div><h2>It sounds like it<br/>was <em>built for you.</em></h2><p>Because it was. Every VOXA agent is trained on your business, your workflows and the conversations that move your customers to yes.</p></div><div className="sector-list">{sectors.map((s, i) => <button className={i === selected ? "sector active" : "sector"} key={s.name} onClick={() => setSelected(i)}><span style={{background:s.color}}>{s.icon}</span><b>{s.name}</b><i>→</i></button>)}</div>
      <div className="sector-demo" style={{"--accent": current.color} as React.CSSProperties}><div className="demo-top"><span>YOUR {current.name.toUpperCase()} AGENT</span><b>● LIVE</b></div><div className="demo-icon">{current.icon}</div><p className="demo-metric">{current.metric}</p><p className="demo-copy">{current.call} — in a voice that feels completely on-brand.</p><div className="steps"><span>01 <b>Answer instantly</b></span><span>02 <b>Have a real conversation</b></span><span>03 <b>Close the loop</b></span></div><a href="#contact">Explore this workflow →</a></div>
    </section>

    <section className="how" id="how"><div className="eyebrow"><i/> FROM HELLO TO HANDSHAKE</div><h2>Conversations that<br/><em>move people.</em></h2><div className="flow"><article><label>01</label><div className="line-icon">⌁</div><h3>Listen</h3><p>We map the questions, objections and moments that matter in your customer journey.</p></article><article><label>02</label><div className="line-icon">◌</div><h3>Build</h3><p>Your AI agent learns your brand, your offers, and how your best people sell.</p></article><article><label>03</label><div className="line-icon">↗</div><h3>Convert</h3><p>It answers every lead, every time — then books, sells and follows through.</p></article></div></section>

    <section className="video-section"><div className="video-copy"><div className="eyebrow dark"><i/> BUILT TO CONVERT</div><h2>A closer that<br/>never <em>blinks.</em></h2><p>VOXA listens, understands and responds in seconds. Every conversation moves through a clear path from question to confirmed next step.</p><div className="video-points"><span>✓ Natural voice</span><span>✓ Multilingual</span><span>✓ Instant follow-up</span></div></div><div className="three-d-stage" aria-label="Move your cursor over the VOXA agent workflow visual" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientY - r.top) / r.height - .5) * -14, y: ((e.clientX - r.left) / r.width - .5) * 16 }); }} onPointerLeave={() => setTilt({ x: 0, y: 0 })} style={{ "--tilt-x": `${tilt.x}deg`, "--tilt-y": `${tilt.y}deg` } as React.CSSProperties}><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="floating-card back-card"><span>LANGUAGE</span><b>ಕನ್ನಡ · తెలుగు · தமிழ் · हिंदी</b></div><div className="floating-card main-card"><div className="card-top"><span className="pulse"/> VOXA ACTIVE <i>•••</i></div><div className="agent-orb"><span>V</span></div><b>New enquiry received</b><p>“I’d like to book a property viewing.”</p><div className="card-status"><span>QUALIFIED</span><span>BOOKED</span></div></div><div className="floating-card front-card"><span>FOLLOW-UP</span><b>Sent in 2 seconds</b><i>↗</i></div><small className="move-hint">MOVE TO EXPLORE</small></div></section>

    <section className="results" id="results"><div><div className="eyebrow dark"><i/> THE NUMBERS TALK</div><h2>Less hold music.<br/><em>More hell yes.</em></h2><p>When every enquiry gets your best possible answer, growth gets very simple.</p><a className="text-link" href="#contact">See what VOXA can unlock →</a></div><div className="stats"><div><b>24<span>/7</span></b><p>Always there<br/>for your customers</p></div><div><b>38<span>%</span></b><p>Average lead-to-<br/>meeting conversion</p></div><div><b>14<span>+</span></b><p>Languages your<br/>agent can speak</p></div><div><b>3.2<span>×</span></b><p>Average ROI in<br/>the first 90 days</p></div></div></section>

    <section className="contact" id="contact"><div className="contact-copy"><div className="eyebrow"><i/> YOUR NEXT BEST HIRE</div><h2>Ready to make<br/>every lead <em>count?</em></h2><p>Tell us a little about your business. We&apos;ll show you exactly where an agent can start winning for you.</p><div className="mini-proof"><span>✓ No hard sell</span><span>✓ Live strategy call</span><span>✓ Custom use-case map</span></div></div><div className="form-card"><span className="form-kicker">LIMITED WEEKLY SLOTS</span><h3>Book your conversion call.</h3><p>In 20 minutes, we&apos;ll map the calls, follow-ups and customer questions your agent can handle from day one.</p><LeadForm /></div></section>
    <footer><a className="logo" href="#top"><span>V</span> VOXA</a><p>Make every conversation count.<br/><a className="support" href="mailto:support@deekshithac2@gmail.com">support@deekshithac2@gmail.com</a></p><div><a href="#solutions">Solutions</a><a href="#how">Process</a><a href="#contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div><small>© 2026 VOXA. All good conversations reserved.</small></footer>
  </main>;
}
