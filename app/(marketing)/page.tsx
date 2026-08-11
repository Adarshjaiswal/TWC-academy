import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  Gem,
  GraduationCap,
  MapPin,
  MessageCircle,
  NotebookPen,
  ShieldCheck,
  TimerReset
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqList } from "@/components/marketing/faq-list";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { MarketParticleField } from "@/components/marketing/market-particle-field";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { env } from "@/lib/env";
import {
  academyBonusFixtures,
  academyRoadmapFixtures,
  faqFixtures,
  marketCoverageFixtures,
  packageFixtures,
  serviceFixtures,
  testimonialFixtures
} from "@/lib/data/fixtures";
import { formatMoney } from "@/lib/utils";

const whyChoose = [
  ["Professional Curriculum", "Structured modules from market basics to live-market review."],
  ["Smart Money Concepts", "Liquidity, order blocks, FVG, BOS and CHoCH taught with risk context."],
  ["Live Sessions and Q&A", "Weekly market analysis, trade reviews, and practical learning support."],
  ["Risk and Psychology", "Position sizing, drawdown control, discipline, fear, greed, and journaling."]
] as const;

export default function HomePage() {
  const faqs = faqFixtures
    .flatMap((category) => category.items.map((item) => ({ question: item.question, answer: item.answer })))
    .slice(0, 5);

  return (
    <div className="relative isolate overflow-hidden">
      <MarketParticleField />
      <section className="section relative min-h-[calc(100vh-4rem)] pb-12 pt-12 md:pt-16">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <ScrollReveal className="max-w-3xl">
            <Badge tone="premium">Premium Course Brochure</Badge>
            <h1 className="mt-5 text-balance text-5xl font-black leading-[0.9] tracking-normal md:text-7xl">
              TWC Academy
            </h1>
            <p className="mt-4 text-balance text-4xl font-black leading-[0.96] md:text-6xl">
              Discover the World of <span className="gold-glow-text">Trading</span>
            </p>
            <p className="mt-5 text-balance text-2xl font-black leading-tight text-[var(--premium)] md:text-4xl">
              Trade with Confidence. Build Wealth with Discipline.
            </p>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-[var(--muted)]">
              Master financial markets with professional trading education, live mentorship, structured risk management, and practical market application.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Gold", "Forex", "Crypto", "Indices", "Live Sessions + Mentorship"].map((item) => (
                <span className="rounded-full border border-[rgba(229,185,91,0.34)] bg-[rgba(229,185,91,0.1)] px-3 py-1.5 text-xs font-black uppercase text-[var(--premium)]" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/packages">
                Enroll Today <ArrowRight aria-hidden className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="#curriculum" variant="secondary">
                <BookOpen aria-hidden className="h-4 w-4" />
                View Curriculum
              </ButtonLink>
              <ButtonLink href={env.TELEGRAM_FREE_CHANNEL_URL} variant="ghost">
                <MessageCircle aria-hidden className="h-4 w-4" />
                Telegram
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {[
                ["9", "Years trading experience"],
                ["5+", "Years in CFDs"],
                ["Dubai", "UAE based mentor"],
                ["Lifetime", "Resources access"]
              ].map(([value, label]) => (
                <div className="line-tile px-4 py-3" key={label}>
                  <p className="text-2xl font-black text-[var(--primary)]">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase text-[var(--muted)]">{label}</p>
                </div>
              ))}
            </div>
            <p className="risk-copy mt-6 max-w-2xl">
              Educational content only. Trading involves risk and no profits are guaranteed. TWC does not operate as a broker, exchange, live trading terminal, investment adviser, or automated trade copier.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <HeroVisual />
          </ScrollReveal>
        </div>
      </section>

      <section className="section-band py-5">
        <div className="container-shell grid gap-4 text-sm text-[var(--muted)] md:grid-cols-3">
          <div className="flex items-center gap-3">
            <GraduationCap aria-hidden className="h-5 w-5 text-[var(--primary)]" />
            Structured step-by-step academy curriculum.
          </div>
          <div className="flex items-center gap-3">
            <TimerReset aria-hidden className="h-5 w-5 text-[var(--premium)]" />
            Live sessions, trade reviews, Q&A, and lifetime resources.
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden className="h-5 w-5 text-[var(--info)]" />
            Risk management and psychology before execution.
          </div>
        </div>
      </section>

      <section className="section" id="curriculum">
        <ScrollReveal className="container-shell">
          <div className="mb-8 max-w-3xl">
            <Badge>Course Curriculum</Badge>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">From first candle to confident, independent trader.</h2>
            <p className="mt-4 text-[var(--muted)]">
              The brochure frames TWC Academy as a complete roadmap for analysis, planning, risk control, psychology, and live-market learning.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviceFixtures.map((service, index) => (
              <Card className="transition hover:-translate-y-1 hover:border-[rgba(229,185,91,0.42)]" key={service.slug}>
                <span className="text-xs font-black text-[var(--premium)]">0{index + 1}</span>
                <CardHeader className="mt-3">
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.summary}</CardDescription>
                </CardHeader>
                <p className="text-sm leading-6 text-[var(--muted)]">{service.body}</p>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="section section-band">
        <ScrollReveal className="container-shell grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <Badge tone="premium">Why Choose Us</Badge>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Premium trading education designed for practical execution.</h2>
            <p className="mt-4 text-[var(--muted)]">
              Learn to trade with structure, discipline, and risk-first decision making.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyChoose.map(([title, body]) => (
              <Card key={title}>
                <Award aria-hidden className="h-5 w-5 text-[var(--premium)]" />
                <h3 className="mt-3 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="section">
        <ScrollReveal className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge>Markets Covered</Badge>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Gold-led, multi-asset learning.</h2>
            <p className="mt-4 text-[var(--muted)]">
              The academy has a strong focus on Gold and high-liquidity instruments, with technical plus fundamental analysis.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {marketCoverageFixtures.map((market) => (
              <div className="line-tile p-4 text-sm font-black" key={market}>
                {market}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="section section-band">
        <ScrollReveal className="container-shell">
          <div className="mb-8 max-w-3xl">
            <Badge tone="info">Student Success Roadmap</Badge>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Eight stages toward independent trading.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {academyRoadmapFixtures.map((step, index) => (
              <Card className="p-5" key={step}>
                <span className="text-sm font-black text-[var(--primary)]">{index + 1}</span>
                <h3 className="mt-3 text-lg font-black">{step}</h3>
              </Card>
            ))}
          </div>
          <Card className="mt-5 border-[rgba(255,209,102,0.42)]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-black uppercase text-[var(--primary)]">Outcome</p>
                <h3 className="mt-2 text-2xl font-black">Become an Independent Trader</h3>
              </div>
              <ButtonLink href="/packages">Select Program</ButtonLink>
            </div>
          </Card>
        </ScrollReveal>
      </section>

      <section className="section">
        <ScrollReveal className="container-shell">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge tone="premium">Course Comparison</Badge>
              <h2 className="mt-4 text-3xl font-black md:text-5xl">Choose your academy track.</h2>
              <p className="mt-4 max-w-2xl text-[var(--muted)]">
                Pricing follows the supplied brochure and can be edited from the admin-backed package data.
              </p>
            </div>
            <ButtonLink href="/packages" variant="secondary">Compare all</ButtonLink>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {packageFixtures.map((plan) => (
              <Card className={plan.isFeatured ? "border-[rgba(229,185,91,0.62)] shadow-[0_22px_80px_rgba(229,185,91,0.1)]" : ""} key={plan.slug}>
                {plan.isFeatured ? <Badge tone="premium">Most Popular</Badge> : null}
                <CardHeader className="mt-4">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.summary}</CardDescription>
                </CardHeader>
                <p className="text-3xl font-black">{formatMoney(plan.priceMinor, plan.currency)}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{Math.round(plan.durationDays / 7)} weeks access</p>
                <ul className="mt-5 grid gap-2 text-sm text-[var(--muted)]">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li className="flex gap-2" key={feature}>
                      <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <ButtonLink className="mt-6 w-full" href={`/packages?plan=${plan.slug}`}>
                  Enroll
                </ButtonLink>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="section section-band">
        <ScrollReveal className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-[rgba(229,185,91,0.34)]">
            <Badge tone="premium">Meet Your Mentor</Badge>
            <h2 className="mt-4 text-3xl font-black">A R Danish</h2>
            <p className="mt-2 text-sm font-bold text-[var(--muted)]">Trader + Founder | TWC Capital / TWC Academy</p>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              Based in Dubai, UAE, A R Danish focuses on price action, risk management, disciplined execution, macro-driven behavior, and structured professional trading approaches.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="line-tile p-4">
                <MapPin aria-hidden className="h-4 w-4 text-[var(--premium)]" />
                <p className="mt-2 text-sm font-black">Dubai, UAE</p>
              </div>
              <div className="line-tile p-4">
                <Brain aria-hidden className="h-4 w-4 text-[var(--primary)]" />
                <p className="mt-2 text-sm font-black">Technical and macro analysis</p>
              </div>
            </div>
          </Card>
          <Card>
            <Badge>Every Student Receives</Badge>
            <h2 className="mt-4 text-3xl font-black">Templates, calculators, checklists, and community access.</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {academyBonusFixtures.map((bonus) => (
                <div className="line-tile flex items-center gap-3 p-3 text-sm font-bold" key={bonus}>
                  <NotebookPen aria-hidden className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                  {bonus}
                </div>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </section>

      <section className="section">
        <ScrollReveal className="container-shell grid gap-8 lg:grid-cols-2">
          <Card>
            <Badge tone="info">Telegram</Badge>
            <h2 className="mt-4 text-3xl font-black">Community access with clear eligibility.</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Public visitors can join the free Telegram channel for updates. Premium instructions appear only after active program eligibility is confirmed server-side.
            </p>
            <ButtonLink className="mt-6" href={env.TELEGRAM_FREE_CHANNEL_URL} variant="secondary">
              Join Free Telegram
            </ButtonLink>
          </Card>
          <Card>
            <Badge tone="premium">Approved content only</Badge>
            <h2 className="mt-4 text-3xl font-black">Student feedback is published only after approval.</h2>
            <div className="mt-5 grid gap-3">
              {testimonialFixtures.map((item) => (
                <blockquote className="line-tile p-4 text-sm leading-6 text-[var(--muted)]" key={item.authorName}>
                  “{item.quote}”
                  <footer className="mt-3 font-bold text-[var(--text)]">{item.authorName}</footer>
                  <p className="mt-1 text-xs text-[var(--premium)]">{item.disclosure}</p>
                </blockquote>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      </section>

      <section className="section section-band">
        <ScrollReveal className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge>FAQ</Badge>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Clear answers before enrollment.</h2>
          </div>
          <FaqList items={faqs} />
        </ScrollReveal>
      </section>

      <section className="section">
        <ScrollReveal className="container-shell futuristic-panel border border-[rgba(229,185,91,0.34)] bg-[linear-gradient(135deg,rgba(229,185,91,0.18),rgba(255,255,255,0.035),rgba(255,183,3,0.12))] p-8 md:p-12">
          <div className="flex items-start gap-4">
            <Gem aria-hidden className="mt-1 h-7 w-7 shrink-0 text-[var(--premium)]" />
            <div>
              <h2 className="text-3xl font-black md:text-5xl">Enroll and start the roadmap with live instruction.</h2>
              <p className="mt-4 max-w-3xl text-[var(--muted)]">
                Select your program, confirm seat availability, and begin with structured education, risk tools, weekly market outlook, and community support.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/packages">Enroll Today</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">Get In Touch</ButtonLink>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
