import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

interface HomePageProps {
  onRequestAccess: () => void;
  onSignIn: () => void;
  isLoggedIn: boolean;
}

export function HomePage({ onRequestAccess, onSignIn, isLoggedIn }: HomePageProps) {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    for (const el of elements) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6 font-sans">
              Private Mentor Staffing
            </p>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.08] text-foreground mb-6">
              Mentors are placed,
              <br />
              not discovered.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[480px] mb-8">
              ConnectEm is a controlled, admin-managed platform for placing
              verified industry mentors with teams and institutions — without
              public listings, applications, or exposure.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onRequestAccess}
                data-ocid="hero.request_access.primary_button"
                className="rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85 px-7 py-5 text-sm font-medium"
              >
                Request Access
              </Button>
              {!isLoggedIn && (
                <Button
                  variant="outline"
                  onClick={onSignIn}
                  data-ocid="hero.sign_in.secondary_button"
                  className="rounded-full border-foreground/30 hover:border-foreground text-foreground px-7 py-5 text-sm font-medium"
                >
                  Existing account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="hidden lg:block"
          >
            <div className="rounded-2xl overflow-hidden shadow-card border border-border aspect-[4/3]">
              <img
                src="./src/assets/connect_em.jpg"
                alt="Professional mentor placement"
                className="w-full h-full object-cover grayscale-[30%]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY STRIP */}
      <section id="philosophy" className="border-y border-border bg-muted/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 reveal">
          <p className="font-serif text-2xl sm:text-3xl text-foreground text-center leading-snug max-w-2xl mx-auto">
            We don’t run a marketplace. We don’t allow browsing or applying.
            <span className="text-muted-foreground">
              {" "}
              We manage every placement by hand.
            </span>
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 lg:py-28"
      >
        <div className="text-center mb-14 reveal">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Process
          </p>
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] text-foreground">
            How ConnectEm Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Users className="h-6 w-6" />,
              step: "01",
              title: "Mentors apply once",
              desc: "Submit your profile and credentials. Our team reviews every application manually — no automated filtering.",
            },
            {
              icon: <Handshake className="h-6 w-6" />,
              step: "02",
              title: "Companies submit needs",
              desc: "Describe your mentor requirements without browsing profiles. Your needs are reviewed confidentially.",
            },
            {
              icon: <Shield className="h-6 w-6" />,
              step: "03",
              title: "We manage the match",
              desc: "Our platform team assigns and manages mentors end-to-end. No direct contact until we facilitate the introduction.",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`reveal reveal-delay-${i + 1} rounded-2xl border border-border p-7 bg-card shadow-xs hover:shadow-card transition-shadow duration-300`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="p-2.5 rounded-xl bg-foreground text-primary-foreground">
                  {item.icon}
                </div>
                <span className="font-serif text-3xl text-muted-foreground/30 font-bold">
                  {item.step}
                </span>
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section id="trust" className="bg-foreground text-primary-foreground">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <div className="max-w-2xl mx-auto text-center reveal">
            <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/50 mb-4">
              Philosophy
            </p>
            <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] mb-6">
              Designed for trust, not traffic.
            </h2>
            <p className="text-primary-foreground/70 text-base sm:text-lg leading-relaxed">
              The ConnectEm platform is intentionally closed. There is no direct
              contact between mentors and companies until a placement is
              confirmed. This protects both parties — ensuring privacy, reducing
              noise, and producing better outcomes for everyone involved.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-14">
            {[
              {
                label: "Privacy-first",
                desc: "No profiles are public. No contact details shared until placement is confirmed.",
              },
              {
                label: "Curated quality",
                desc: "Every mentor is reviewed. Every company need is assessed. No open marketplace dynamics.",
              },
              {
                label: "Managed outcomes",
                desc: "We stay involved throughout. Placements are managed, not just facilitated.",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`reveal reveal-delay-${i + 1} rounded-xl border border-primary-foreground/10 p-6`}
              >
                <p className="font-serif text-lg mb-2">{item.label}</p>
                <p className="text-sm text-primary-foreground/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section
        id="cta"
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center"
      >
        <div className="reveal max-w-xl mx-auto">
          <h2 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] text-foreground mb-5">
            If you’re looking for a serious mentor placement —
            <em className="block">ConnectEm may be a fit.</em>
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Access is reviewed for both mentors and organizations.
          </p>
          <Button
            onClick={onRequestAccess}
            data-ocid="cta.request_access.primary_button"
            className="rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85 px-9 py-5 text-sm font-medium"
          >
            Request Access
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-foreground">CE</span>
            <span>ConnectEm</span>
          </div>
          <p>
            © {new Date().getFullYear()}. Built with {" "}
            <a
              href={``}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              ConnectEm
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
