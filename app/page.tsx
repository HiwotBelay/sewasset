"use client";

import { Playfair_Display, Syne } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./catalyst-landing.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"] });
const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const animated = Array.from(document.querySelectorAll(".c-animate"));
    if (!animated.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    animated.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className={`catalyst-page ${syne.className}`}>
      <nav className={`c-nav ${scrolled ? "scrolled" : ""}`}>
        <div>
          <span className={`c-nav-logo-main ${playfair.className}`}>SewAsset</span>
          <span style={{ fontSize: "0.6rem", color: "#c8973a", marginLeft: 2 }}>TM</span>
        </div>
        <div className="c-nav-links">
          <a href="#problem" className="c-nav-link">
            The Problem
          </a>
          <a href="#engine" className="c-nav-link">
            How It Works
          </a>
          <a href="#methodology" className="c-nav-link">
            Methodology
          </a>
          <a href="#who" className="c-nav-link">
            Who It&apos;s For
          </a>
        </div>
        <Link className="c-nav-cta" href="/route-selection">
          Start Assessment →
        </Link>
      </nav>

      <section className="c-hero">
        <div className="c-hero-grid" />
        <div className="c-hero-glow" />
        <div className="c-hero-inner">
          <div>
            <div className="c-eyebrow c-animate">Capability Transformation Platform</div>
            <h1 className={`c-h1 ${playfair.className} c-animate c-delay-1`}>
              Transform Workforce Skills Into
              <br />
              <em>Measurable Business Capability</em>
            </h1>
            <p className="c-sub c-animate c-delay-2">
              SewAsset Catalyst helps organizations diagnose capability gaps, design targeted training
              programs, and build strategic business cases for workforce transformation.
            </p>
            <div className="c-actions c-animate c-delay-3">
              <Link href="/training" className="c-btn-primary">
                Build Capability Plan →
              </Link>
              <a href="#engine" className="c-btn-ghost">
                See How It Works
              </a>
            </div>
            <div className="c-hero-stats c-animate c-delay-4">
              <div>
                <div className={`c-stat-value ${playfair.className}`}>400+</div>
                <div className="c-stat-label">Training Modules</div>
              </div>
              <div>
                <div className={`c-stat-value ${playfair.className}`}>7</div>
                <div className="c-stat-label">Capability Pillars</div>
              </div>
              <div>
                <div className={`c-stat-value ${playfair.className}`}>SPSC</div>
                <div className="c-stat-label">Diagnostic Model</div>
              </div>
              <div>
                <div className={`c-stat-value ${playfair.className}`}>15 min</div>
                <div className="c-stat-label">To Full Business Case</div>
              </div>
            </div>
          </div>
          <div className="c-hero-card c-animate c-delay-2">
            <div className="c-eyebrow" style={{ marginBottom: 14 }}>
              The Catalyst Journey
            </div>
            <div className="c-journey-list">
              <div className="c-journey-item">
                <span className="c-journey-num">1</span>
                <div>
                  <strong>Diagnose</strong>
                  <p>Identify capability gaps using the SPSC framework.</p>
                </div>
              </div>
              <div className="c-journey-item">
                <span className="c-journey-num">2</span>
                <div>
                  <strong>Map</strong>
                  <p>Align gaps to targeted development modules.</p>
                </div>
              </div>
              <div className="c-journey-item">
                <span className="c-journey-num">3</span>
                <div>
                  <strong>Design</strong>
                  <p>Build a structured training or consulting plan.</p>
                </div>
              </div>
              <div className="c-journey-item">
                <span className="c-journey-num">4</span>
                <div>
                  <strong>Justify</strong>
                  <p>Generate ROI estimates and a business case.</p>
                </div>
              </div>
            </div>
            <div className="c-journey-badge">
              Built on <strong>7-Pillar Capability Model</strong> linking workforce skills to measurable
              organizational performance.
            </div>
          </div>
        </div>
      </section>

      <section id="problem" style={{ background: "#fdfcf9" }}>
        <div className="c-section">
          <div className="c-eyebrow c-animate">The Problem</div>
          <h2 className={`c-title ${playfair.className} c-animate c-delay-1`}>
            Most training investment
            <br />
            doesn&apos;t <em>move the needle</em>
          </h2>
          <div className="c-divider c-animate c-delay-2" />
          <div className="c-problem-grid c-animate c-delay-3">
            <div className="c-problem-left c-glide-left">
              <h3 className={playfair.className}>
                Organizations invest in training without a clear link to <em>business outcomes.</em>
              </h3>
              <ul className="c-point-list c-point-list-danger">
                <li>Training topics are selected based on gut feeling, not capability data</li>
                <li>Learning objectives don&apos;t connect to strategic business goals</li>
                <li>Training budgets are approved without a proper business case</li>
                <li>Skills developed in workshops don&apos;t translate into operational performance</li>
                <li>ROI is never measured - so the cycle repeats</li>
              </ul>
            </div>
            <div className="c-problem-right c-glide-right">
              <h3 className={playfair.className}>SewAsset Catalyst™ bridges the gap.</h3>
              <ul className="c-point-list c-point-list-light c-point-list-success">
                <li>Diagnose the real root cause - Strategy, People, Systems, or Culture</li>
                <li>Map capability gaps to targeted development modules across 7 pillars</li>
                <li>Generate a professional training proposal in under 10 minutes</li>
                <li>Build a boardroom-ready business case with ROI and cost-of-inaction analysis</li>
                <li>Receive a structured consulting or training roadmap with clear deliverables</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="engine" className="c-engine">
        <div className="c-section" style={{ color: "white", paddingTop: 0, paddingBottom: 0 }}>
          <div className="c-eyebrow c-animate">How Catalyst Works</div>
          <h2 className={`c-title ${playfair.className} c-animate c-delay-1`} style={{ color: "white" }}>
            Three stages.
            <br />
            <em>One powerful output.</em>
          </h2>
          <div className="c-engine-grid c-animate c-delay-2">
            <article className="c-engine-card c-card-pop" data-step="01">
              <span className="c-engine-icon">🔬</span>
              <h3 className={playfair.className}>Capability Diagnostics</h3>
              <p>
                Input your business problem, department, and performance challenges. The SPSC model
                identifies whether the root cause lies in Strategy, People, Systems, or Culture.
              </p>
              <span className="c-engine-bar" />
            </article>
            <article className="c-engine-card c-card-pop" data-step="02">
              <span className="c-engine-icon">🗺️</span>
              <h3 className={playfair.className}>Training Architecture</h3>
              <p>
                The Goal-Fit Scoring Engine maps your capability gaps to the right development modules
                from a catalog of 400+ training programs across 7 capability pillars.
              </p>
              <span className="c-engine-bar" />
            </article>
            <article className="c-engine-card c-card-pop" data-step="03">
              <span className="c-engine-icon">📊</span>
              <h3 className={playfair.className}>Business Case Generation</h3>
              <p>
                Receive an executive-ready proposal - complete with ROI scenarios, cost-of-inaction
                analysis, solution pathway, and a structured consulting or training investment range.
              </p>
              <span className="c-engine-bar" />
            </article>
          </div>
        </div>
      </section>

      <section id="methodology" className="c-methodology">
        <div className="c-section">
          <div className="c-eyebrow c-animate">The Catalyst Engine</div>
          <h2 className={`c-title ${playfair.className} c-animate c-delay-1`}>
            Input → Intelligence → <em>Output</em>
          </h2>
          <div className="c-model-diagram c-animate c-delay-2">
            <div className="c-model-box">
              <div className="c-model-head">Input</div>
              <div className="c-model-items">
                <div>Business goals &amp; priorities</div>
                <div>Department scope</div>
                <div>Performance challenges</div>
                <div>Capability gap areas</div>
                <div>KPI baseline data</div>
              </div>
            </div>
            <div className="c-model-arrow">→</div>
            <div className="c-model-center">
              <span className="c-model-center-icon">⚡</span>
              <div className={`c-model-center-title ${playfair.className}`}>Catalyst Engine™</div>
              <div className="c-model-center-sub">
                SPSC Root Cause Model · 7-Pillar Capability Map · Goal-Fit Scoring · ROI Calculator
              </div>
            </div>
            <div className="c-model-arrow">→</div>
            <div className="c-model-box">
              <div className="c-model-head">Output</div>
              <div className="c-model-items">
                <div>Recommended training modules</div>
                <div>Capability roadmap</div>
                <div>Solution pathway</div>
                <div>ROI &amp; cost-of-inaction</div>
                <div>Investment proposal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="who" style={{ background: "#fdfcf9" }}>
        <div className="c-section">
          <div className="c-eyebrow c-animate">Who It&apos;s For</div>
          <h2 className={`c-title ${playfair.className} c-animate c-delay-1`}>
            Built for every stakeholder
            <br />
            in the <em>capability conversation</em>
          </h2>
          <div className="c-who-grid c-animate c-delay-2">
            <div className="c-who-card c-card-pop">
              <div className="c-who-card-icon" aria-hidden="true">
                🏢
              </div>
              <div className={`c-who-card-title ${playfair.className}`}>
                Business Leaders
              </div>
              <div className="c-who-card-desc">
                Design workforce capability strategies aligned with performance goals. Build
                business cases that speak your CFO&apos;s language.
              </div>
            </div>
            <div className="c-who-card c-card-pop">
              <div className="c-who-card-icon" aria-hidden="true">
                🎓
              </div>
              <div className={`c-who-card-title ${playfair.className}`}>
                HR &amp; L&amp;D Professionals
              </div>
              <div className="c-who-card-desc">
                Move from guessing training topics to diagnosing real capability gaps. Present
                training investment with measurable ROI evidence.
              </div>
            </div>
            <div className="c-who-card c-card-pop">
              <div className="c-who-card-icon" aria-hidden="true">
                🤝
              </div>
              <div className={`c-who-card-title ${playfair.className}`}>
                Consultants &amp; Partners
              </div>
              <div className="c-who-card-desc">
                Generate data-backed capability transformation proposals for clients. Use the
                SPSC&apos;T diagnostic to anchor recommendations in evidence.
              </div>
            </div>
            <div className="c-who-card c-card-pop">
              <div className="c-who-card-icon" aria-hidden="true">
                👤
              </div>
              <div className={`c-who-card-title ${playfair.className}`}>
                Individual Professionals
              </div>
              <div className="c-who-card-desc">
                Identify skill gaps, design your personal development plan, and access training
                programs that genuinely advance your career.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="c-spsc-section">
        <div className="c-section">
          <div className="c-eyebrow c-animate">Proprietary Methodology</div>
          <h2 className={`c-title ${playfair.className} c-animate c-delay-1`}>The SPSC™ Diagnostic Model</h2>
          <p className="c-subtitle c-animate c-delay-2">
            Every capability problem has a root cause. The SPSC model identifies whether the real issue
            lies in Strategy, People, Systems, or Culture - before recommending any solution.
          </p>

          <div className="c-spsc-grid c-animate c-delay-3">
            <article className="c-spsc-card c-card-pop">
              <div className={`c-spsc-letter ${playfair.className}`}>S</div>
              <div className="c-spsc-word">Strategy</div>
              <p>Clarity of direction, goal alignment, and prioritization discipline</p>
              <ul>
                <li>Strategic clarity</li>
                <li>Goal alignment</li>
                <li>Communication of expectations</li>
              </ul>
            </article>
            <article className="c-spsc-card c-card-pop">
              <div className={`c-spsc-letter ${playfair.className}`}>P</div>
              <div className="c-spsc-word">People</div>
              <p>Human enablers - role clarity, talent fit, and accountability culture</p>
              <ul>
                <li>Role clarity</li>
                <li>Capability fit</li>
                <li>Performance accountability</li>
              </ul>
            </article>
            <article className="c-spsc-card c-card-pop">
              <div className={`c-spsc-letter ${playfair.className}`}>S</div>
              <div className="c-spsc-word">Systems</div>
              <p>Workflows, processes, and tools that enable or block performance</p>
              <ul>
                <li>Process clarity</li>
                <li>Workflow efficiency</li>
                <li>Tool adoption</li>
              </ul>
            </article>
            <article className="c-spsc-card c-card-pop">
              <div className={`c-spsc-letter ${playfair.className}`}>C</div>
              <div className="c-spsc-word">Culture</div>
              <p>Behavioral environment - the hidden driver of every outcome</p>
              <ul>
                <li>Leadership modeling</li>
                <li>Psychological safety</li>
                <li>Openness to change</li>
              </ul>
            </article>
          </div>

          <div className="c-eyebrow c-pillars-eyebrow c-animate c-delay-4">The 7-Pillar Capability Model™</div>
          <div className="c-pillars-grid c-animate c-delay-4">
            <div className="c-pillar-badge">🧭 Strategy</div>
            <div className="c-pillar-badge">👥 People</div>
            <div className="c-pillar-badge">📚 Skills &amp; Competence</div>
            <div className="c-pillar-badge">⚙️ Systems &amp; Processes</div>
            <div className="c-pillar-badge">🖥️ Tools &amp; Technology</div>
            <div className="c-pillar-badge">🎯 Leadership &amp; Culture</div>
            <div className="c-pillar-badge">📊 Governance &amp; Measurement</div>
            <div className="c-pillar-badge c-pillar-powered">⚡ Powered by SewAsset</div>
          </div>
        </div>
      </section>

      <section className="c-entry">
        <div className="c-entry-grid" />
        <div className="c-entry-inner">
          <div className="c-eyebrow c-entry-eyebrow c-animate">Start Your Assessment</div>
          <h2 className={`c-entry-title ${playfair.className} c-animate c-delay-1`}>
            Build Your Capability
            <br />
            <em>Transformation Plan</em>
          </h2>
          <p className="c-entry-sub c-animate c-delay-2">
            Choose your path. The tool adapts to your needs - whether you know exactly what training
            you want, or need a full organizational diagnostic.
          </p>
          <div className="c-entry-paths c-animate c-delay-3">
            <Link href="/training" className="c-entry-path c-card-pop">
              <div className="c-entry-path-tag">Capability Development Path</div>
              <strong className="c-entry-path-title">I need a training program</strong>
              <p className="c-entry-path-desc">
                Fast, structured training plan. Select capability areas, set goals, get smart module
                recommendations and a proposal in 10 minutes.
              </p>
            </Link>
            <Link href="/consulting" className="c-entry-path c-card-pop">
              <div className="c-entry-path-tag">Capability Transformation Path</div>
              <strong className="c-entry-path-title">I need a full diagnostic</strong>
              <p className="c-entry-path-desc">
                SPSC-powered business diagnostic. Map root causes, capability gaps, and generate a
                boardroom-ready business case with ROI analysis.
              </p>
            </Link>
          </div>
          <div className="c-entry-small c-animate c-delay-4">
            Not sure which path is right? - Take the 60-second triage assessment
          </div>
        </div>
      </section>

      <footer className="c-footer">
        <div className={`c-footer-logo ${playfair.className}`}>
          Sew<span style={{ color: "#fdc700" }}>Asset</span>TM
        </div>
        <div className="c-footer-links">
          <span>Capability Development</span>
          <span>SPSC™ Model</span>
          <span>7 Pillars</span>
          <span>Contact Us</span>
        </div>
        <div className="c-footer-copy">
          © 2025 SewAsset. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
