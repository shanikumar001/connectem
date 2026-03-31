import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Handshake, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { MentorCard } from "../components/MentorCard";
import { useSelectedMentors } from "../hooks/useQueries";

interface HomePageProps {
  onRequestAccess: () => void;
  onSignIn: () => void;
  isLoggedIn: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] as [number, number, number, number] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function HomePage({ onRequestAccess, onSignIn, isLoggedIn }: HomePageProps) {
  const { data: mentors } = useSelectedMentors();
  const featuredMentors = mentors?.slice(0, 3) || [];

  return (
    <main className="overflow-x-hidden">
      {/* HERO */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.21, 0.45, 0.32, 0.9] as [number, number, number, number] }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1 rounded-full text-foreground/60 border-foreground/10 uppercase tracking-widest text-[10px] bg-background/50 backdrop-blur-sm shadow-sm">
              Private Mentor Staffing
            </Badge>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.05] text-foreground mb-6 tracking-tight">
              Mentors are placed,
              <br />
              <span className="text-muted-foreground/60">not discovered.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[480px] mb-10">
              ConnectEm is a controlled, admin-managed platform for placing
              verified industry mentors with teams and institutions — without
              public listings or exposure.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onRequestAccess}
                className="rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85 px-8 py-6 text-sm font-medium shadow-lg shadow-foreground/10 transition-all hover:scale-105 active:scale-95"
              >
                Request Access
              </Button>
              {!isLoggedIn && (
                <Button
                  variant="outline"
                  onClick={onSignIn}
                  className="rounded-full border-foreground/10 hover:border-foreground/30 text-foreground px-8 py-6 text-sm font-medium transition-all hover:bg-muted"
                >
                  Existing account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.21, 0.45, 0.32, 1] as [number, number, number, number], delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 blur-2xl rounded-full" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 aspect-[4/3]">
              <img
                src="./src/assets/connect_em.jpg"
                alt="Professional mentor placement"
                className="w-full h-full object-cover grayscale-[20%] sepia-[10%] hover:scale-105 transition-transform duration-[2s] ease-out"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY STRIP */}
      <motion.section 
        id="philosophy" 
        className="border-y border-border bg-muted/30 backdrop-blur-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
          <p className="font-serif text-2xl sm:text-4xl text-foreground text-center leading-tight max-w-2xl mx-auto tracking-tight">
            We don’t run a marketplace. We don’t allow browsing or applying.
            <span className="text-muted-foreground/50 block sm:inline italic">
              {" "}
              We manage every placement by hand.
            </span>
          </p>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 lg:py-32"
      >
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <Badge variant="outline" className="mb-4 text-[10px] tracking-widest uppercase text-muted-foreground/60 border-none">
            Process
          </Badge>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-foreground tracking-tight">
            How ConnectEm Works
          </h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
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
          ].map((item) => (
            <motion.div
              key={item.step}
              variants={sectionVariants}
              className="group rounded-3xl border border-border p-8 bg-card shadow-sm hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:translate-y-[-4px]"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="p-3 rounded-2xl bg-foreground text-primary-foreground transform group-hover:rotate-12 transition-transform duration-500">
                  {item.icon}
                </div>
                <span className="font-serif text-4xl text-muted-foreground/10 font-bold">
                  {item.step}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-4 tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* MENTORS SECTION */}
      {featuredMentors.length > 0 && (
        <section className="bg-muted/30 border-y border-border overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 lg:py-32">
            <motion.div 
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
            >
              <div className="max-w-xl">
                <Badge variant="outline" className="mb-4 text-[10px] tracking-widest uppercase text-muted-foreground/60 border-none">
                  Expertise
                </Badge>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] text-foreground tracking-tight leading-[1.1]">
                  Guided by the world’s most <br />
                  <span className="text-muted-foreground/50">capable industry minds.</span>
                </h2>
              </div>
              <Button asChild variant="ghost" className="rounded-full group px-6 text-muted-foreground hover:text-foreground">
                <Link to="/mentors">
                  View All Mentors <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {featuredMentors.map((user, i) => (
                <MentorCard key={user._id} user={user} index={i} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* TRUST SECTION */}
      <section id="trust" className="bg-foreground text-primary-foreground overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 lg:py-32">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1 rounded-full text-primary-foreground/40 border-primary-foreground/10 uppercase tracking-widest text-[10px]">
              Philosophy
            </Badge>
            <h2 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] mb-8 tracking-tight leading-[1.05]">
              Designed for trust, <br />
              <span className="text-primary-foreground/40">not traffic.</span>
            </h2>
            <p className="text-primary-foreground/60 text-lg sm:text-xl leading-relaxed font-light">
              The ConnectEm platform is intentionally closed. There is no direct
              contact between mentors and companies until a placement is
              confirmed. This ensures privacy and reduces noise.
            </p>
          </motion.div>

          <motion.div 
            className="grid sm:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
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
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={sectionVariants}
                className="rounded-3xl border border-primary-foreground/10 p-8 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500"
              >
                <div className="inline-block p-1.5 rounded-full bg-emerald-500/10 mb-6">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <h4 className="font-serif text-2xl mb-4 tracking-tight">{item.label}</h4>
                <p className="text-primary-foreground/50 leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section
        id="cta"
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 lg:py-40 text-center relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div 
          className="max-w-2xl mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-foreground mb-8 tracking-tighter leading-[1.1]">
            If you’re looking for a serious <br />
            mentor placement — <span className="italic text-muted-foreground/60 font-light">ConnectEm may be a fit.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed max-w-lg mx-auto font-light">
            Access is strictly reviewed for both mentors and organizations to ensure mutual success.
          </p>
          <Button
            onClick={onRequestAccess}
            className="rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85 px-12 py-7 text-base font-medium shadow-2xl shadow-foreground/20 transition-all hover:scale-105 active:scale-95"
          >
            Request Access Now
          </Button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-foreground flex items-center justify-center font-serif font-bold text-lg text-primary-foreground">CE</div>
            <span className="font-medium text-foreground tracking-tight">ConnectEm Managed Mentorship</span>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>

          <p className="font-light">
            © {new Date().getFullYear()} ConnectEm. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
