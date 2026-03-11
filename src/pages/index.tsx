'use client';

import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import styles from "@/styles/Home.module.scss";

const phaseColors: Record<string, string> = {
  violet: "#EDE9FE",
  blue:   "#DBEAFE",
  teal:   "#CCFBF1",
  orange: "#FFEDD5",
  green:  "#DCFCE7",
  pink:   "#FCE7F3",
};

const phases = [
  {
    number: "01",
    title: "Discovery & research",
    color: "violet",
    ideas: [
      { emoji: "📋", trigger: "Paste in raw user interview transcripts", result: "Claude extracts key pain points, quotes, and patterns" },
      { emoji: "🔭", trigger: "Feed it a competitor's website or app description", result: "Claude identifies what's working, what's missing, and how to differentiate" },
      { emoji: "🧭", trigger: "Describe your product and target user", result: "Claude suggests what research methods would be most valuable and why" },
      { emoji: "🔗", trigger: "Paste multiple research sources", result: "Claude synthesizes cross-source trends and surfaces unexpected connections" },
      { emoji: "❓", trigger: "Give Claude your problem space", result: "It generates a list of assumptions you should validate before designing" },
      { emoji: "⚡", trigger: "Paste stakeholder interview notes", result: "Claude identifies misalignments between stakeholder and user needs" },
      { emoji: "👤", trigger: "Describe your user segment", result: "Claude generates a draft user persona to pressure-test with your team" },
      { emoji: "📊", trigger: "Share raw survey results", result: "Claude quantifies themes and ranks them by frequency and severity" },
      { emoji: "💬", trigger: "Describe your product context", result: "Claude generates a discussion guide for user interviews you can run immediately" },
      { emoji: "🗂️", trigger: "Give it your research findings", result: "Claude drafts a research readout deck outline, ready to present to stakeholders" },
      { emoji: "⭐", trigger: "Paste a competitor's reviews (App Store, G2, etc.)", result: "Claude extracts the top complaints and desires from real users" },
      { emoji: "🌐", trigger: "Describe your market", result: "Claude identifies adjacent industries solving similar problems you could draw inspiration from" },
    ],
  },
  {
    number: "02",
    title: "Define & ideate",
    color: "blue",
    ideas: [
      { emoji: "🧠", trigger: "Paste your team's raw brainstorm", result: "Claude synthesizes into key themes and ranks ideas by potential impact" },
      { emoji: "🎯", trigger: "Share your research findings", result: "Claude writes a crisp problem statement you can align the team around" },
      { emoji: "✨", trigger: "Give Claude your problem statement", result: "It generates 15–20 solution directions spanning obvious to unconventional" },
      { emoji: "😈", trigger: "Describe a design direction", result: "Claude stress-tests it by arguing the case against it (devil's advocate)" },
      { emoji: "⚖️", trigger: "Share your constraints (time, tech, budget)", result: "Claude filters and prioritizes ideas that are actually feasible" },
      { emoji: "💡", trigger: "Paste your HMW (How Might We) questions", result: "Claude generates specific concept ideas for each one" },
      { emoji: "🔍", trigger: "Describe your user persona", result: "Claude generates edge case users you might have missed" },
      { emoji: "🆚", trigger: "Give Claude two competing design directions", result: "It maps the pros, cons, and risks of each to help you decide" },
      { emoji: "🌊", trigger: "Share your product vision", result: "Claude identifies potential unintended consequences or user friction points" },
      { emoji: "🔄", trigger: "Paste your problem statement", result: "Claude rewrites it from 3 different angles to challenge your framing" },
      { emoji: "🗺️", trigger: "Describe your feature idea", result: "Claude maps out the full downstream effects across the user journey" },
      { emoji: "🏛️", trigger: "Share a rough concept", result: "Claude suggests analogous patterns from other industries or apps that solved it well" },
    ],
  },
  {
    number: "03",
    title: "Design & prototype",
    color: "teal",
    ideas: [
      { emoji: "🗺️", trigger: "Describe a user flow", result: "Claude writes it out step by step, including edge cases and error states you might miss" },
      { emoji: "📐", trigger: "Share your screen's purpose", result: "Claude suggests the hierarchy of information and what should be above the fold" },
      { emoji: "🧩", trigger: "Describe a UI component", result: "Claude gives you 3–4 interaction pattern options with trade-offs for each" },
      { emoji: "✏️", trigger: "Paste your copy drafts", result: "Claude rewrites them to be clearer, shorter, and more action-oriented" },
      { emoji: "🏷️", trigger: "Describe your design system needs", result: "Claude generates a naming convention for components, tokens, and variants" },
      { emoji: "📉", trigger: "Share a user flow", result: "Claude identifies where users are most likely to drop off or get confused" },
      { emoji: "💬", trigger: "Paste your onboarding flow", result: "Claude rewrites the microcopy for each step with tone and clarity improvements" },
      { emoji: "📭", trigger: "Describe your feature", result: "Claude generates all the empty/error/loading states you need to design for" },
      { emoji: "♿", trigger: "Share your layout idea", result: "Claude checks it against accessibility best practices and flags issues" },
      { emoji: "📎", trigger: "Describe your design", result: "Claude writes the annotation copy for your Figma handoff specs" },
      { emoji: "✅", trigger: "Give Claude your feature scope", result: "It generates a checklist of all the screens and states you need to design" },
      { emoji: "📖", trigger: "Paste a wall of body copy", result: "Claude rewrites it for scanability using headers, bullets, and plain language" },
      { emoji: "🗂️", trigger: "Describe your IA", result: "Claude maps out potential navigation structures and compares their trade-offs" },
    ],
  },
  {
    number: "04",
    title: "Testing & validation",
    color: "orange",
    ideas: [
      { emoji: "📋", trigger: "Describe your prototype", result: "Claude writes a usability test script with tasks and follow-up questions" },
      { emoji: "🔬", trigger: "Paste usability test notes", result: "Claude synthesizes findings into prioritized issues by severity" },
      { emoji: "🔍", trigger: "Share test observations", result: "Claude identifies patterns across sessions that aren't obvious in individual notes" },
      { emoji: "💬", trigger: "Paste user quotes", result: "Claude clusters them into themes and suggests design implications for each" },
      { emoji: "🛠️", trigger: "Describe a usability issue", result: "Claude generates 3–5 redesign directions to solve it" },
      { emoji: "📊", trigger: "Share your test findings", result: "Claude writes the findings summary you can send to stakeholders immediately" },
      { emoji: "⚖️", trigger: "Paste conflicting user feedback", result: "Claude helps you evaluate which feedback to act on and what to deprioritize" },
      { emoji: "🎭", trigger: "Describe your test scenario", result: "Claude role-plays as a user persona and reacts to your design decisions" },
      { emoji: "🔮", trigger: "Share a feature", result: "Claude generates a list of edge cases and stress scenarios to include in your test" },
      { emoji: "🎥", trigger: "Paste session recording notes", result: "Claude flags moments of hesitation or confusion across users" },
      { emoji: "🧐", trigger: "Describe your current design", result: "Claude generates devil's advocate feedback from a skeptical stakeholder's POV" },
      { emoji: "📈", trigger: "Share A/B test results", result: "Claude helps you interpret what the data means and what to do next" },
    ],
  },
  {
    number: "05",
    title: "Handoff & implementation",
    color: "green",
    ideas: [
      { emoji: "📝", trigger: "Describe a component's behavior", result: "Claude writes the interaction specs in plain English for your dev handoff" },
      { emoji: "📚", trigger: "Paste your design decisions", result: "Claude writes the rationale documentation so engineers understand the \"why\"" },
      { emoji: "🗂️", trigger: "Share your Figma structure", result: "Claude suggests how to organize and name files, pages, and layers for clarity" },
      { emoji: "💻", trigger: "Describe a complex interaction", result: "Claude writes pseudocode or logic flows engineers can use as a reference" },
      { emoji: "💬", trigger: "Paste a dev's question about your design", result: "Claude helps you write a clear, precise answer" },
      { emoji: "✅", trigger: "Share your component", result: "Claude writes the acceptance criteria engineers use to know when it's built correctly" },
      { emoji: "📋", trigger: "Describe your design", result: "Claude drafts the changelog entry for your design system or release notes" },
      { emoji: "🔧", trigger: "Paste engineer feedback on your design", result: "Claude helps you evaluate what's a valid technical constraint vs. a pushback to negotiate" },
      { emoji: "🔍", trigger: "Share your handoff checklist", result: "Claude identifies what's missing before you hand off to dev" },
      { emoji: "📖", trigger: "Describe a design edge case", result: "Claude writes the decision log entry to document how and why it was resolved" },
      { emoji: "🐛", trigger: "Paste your QA findings", result: "Claude prioritizes which issues are blocking vs. polish, and drafts the fix requests" },
      { emoji: "🧪", trigger: "Describe your component", result: "Claude generates suggested QA test cases for the engineering team to run" },
    ],
  },
  {
    number: "06",
    title: "Post-launch & iteration",
    color: "pink",
    ideas: [
      { emoji: "📊", trigger: "Paste analytics data", result: "Claude identifies behavioral patterns and flags what needs investigation" },
      { emoji: "🎫", trigger: "Share user feedback or support tickets", result: "Claude clusters them by theme and ranks by frequency" },
      { emoji: "📉", trigger: "Describe a metric drop", result: "Claude generates hypotheses for what might be causing it" },
      { emoji: "💬", trigger: "Paste NPS comments", result: "Claude extracts the most actionable design insights from qualitative responses" },
      { emoji: "🚀", trigger: "Share your current design", result: "Claude suggests quick wins vs. larger structural changes based on the feedback" },
      { emoji: "🕳️", trigger: "Describe a retention problem", result: "Claude generates a list of experience gaps likely causing drop-off" },
      { emoji: "🗺️", trigger: "Paste your roadmap", result: "Claude identifies where design debt might be creating user friction to prioritize" },
      { emoji: "🪞", trigger: "Share post-launch learnings", result: "Claude writes the retrospective summary for your team" },
      { emoji: "📢", trigger: "Describe what changed in the product", result: "Claude drafts the in-app changelog or release communication for users" },
      { emoji: "📈", trigger: "Paste multiple rounds of feedback", result: "Claude tracks how sentiment has shifted over time and what's improved" },
      { emoji: "💡", trigger: "Share a struggling feature", result: "Claude generates re-engagement or discoverability ideas to improve adoption" },
      { emoji: "🎯", trigger: "Describe your product goals", result: "Claude audits your current feature set and identifies experience gaps to close" },
    ],
  },
];

export default function Home() {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [ideaIndex, setIdeaIndex] = useState(0);

  const openPhase = (index: number) => {
    setActivePhase(index);
    setIdeaIndex(0);
  };

  const closeModal = () => setActivePhase(null);

  const prev = useCallback(() => {
    if (activePhase === null) return;
    setIdeaIndex((i) => (i - 1 + phases[activePhase].ideas.length) % phases[activePhase].ideas.length);
  }, [activePhase]);

  const next = useCallback(() => {
    if (activePhase === null) return;
    setIdeaIndex((i) => (i + 1) % phases[activePhase].ideas.length);
  }, [activePhase]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activePhase === null) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activePhase, prev, next]);

  const phase = activePhase !== null ? phases[activePhase] : null;
  const idea = phase ? phase.ideas[ideaIndex] : null;

  return (
    <>
      <Head>
        <title>How Claude can help — by design phase</title>
        <meta name="description" content="Explore how Claude can accelerate every phase of the design process." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.page}>
        <div className={styles.blobBg} aria-hidden="true">
          <span /><span /><span />
        </div>
        <header className={styles.siteHeader}>
          <p className={styles.siteEyebrow}>Claude for designers</p>
          <h1 className={styles.siteTitle}>How Claude can help</h1>
          <p className={styles.siteSubtitle}>Pick a phase of the design process to explore ideas.</p>
        </header>

        <main className={styles.main}>
          <div className={styles.grid}>
            {phases.map((p, i) => (
              <button
                key={p.number}
                className={`${styles.card} ${styles[`card--${p.color}`]}`}
                onClick={() => openPhase(i)}
              >
                <span className={styles.cardNumber}>{p.number}</span>
                <span className={styles.cardTitle}>{p.title}</span>
                <span className={styles.cardCount}>{p.ideas.length} ideas</span>
              </button>
            ))}
          </div>
        </main>

        {/* Modal */}
        {phase && idea && (
          <div className={styles.overlay} onClick={closeModal} role="dialog" aria-modal="true">
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={styles.modalHeader}>
                <span className={styles.modalPhaseLabel}>{phase.number} — {phase.title}</span>
                <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>
              </div>

              {/* Idea content */}
              <div className={styles.modalBody}>
                <div
                  className={styles.ideaVisual}
                  style={{ backgroundColor: phaseColors[phase.color] }}
                >
                  <span className={styles.ideaEmoji}>{idea.emoji}</span>
                </div>
                <p className={styles.ideaTrigger}>{idea.trigger}</p>
                <p className={styles.ideaResult}>{idea.result}</p>
              </div>

              {/* Navigation */}
              <div className={styles.modalNav}>
                <button className={styles.navBtn} onClick={prev} aria-label="Previous idea">←</button>
                <span className={styles.ideaCounter}>{ideaIndex + 1} / {phase.ideas.length}</span>
                <button className={styles.navBtn} onClick={next} aria-label="Next idea">→</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
