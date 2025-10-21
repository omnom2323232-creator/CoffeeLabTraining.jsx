import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Coffee, GraduationCap, HelpCircle, Home, ListChecks, Menu, Shield, Shirt, Users, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// --- Generic content templates ---
const GENERIC_RECIPES = [
  {
    name: "Espresso (Template)",
    summary: "Foundational recipe template for any espresso-based beverage.",
    details: {
      dose: "18 g (±0.5 g)",
      yield: "36 g in cup",
      time: "25–30 sec",
      notes: [
        "Purge group head, warm cup.",
        "Grind size: adjust to hit time window.",
        "Target TDS and flavor balance per shop standards.",
      ],
    },
    steps: [
      "Purge group and flush briefly.",
      "Dose and distribute evenly; tamp level and firm.",
      "Start shot; stop at target yield/time.",
      "Serve immediately or use as base for milk drinks.",
    ],
  },
  {
    name: "Iced Latte (Template)",
    summary: "Milk-forward iced beverage template; adjust syrups per menu.",
    details: {
      cup: "16 oz cold cup",
      espresso: "Double (36 g)",
      milk: "Cold milk to top",
      ice: "3/4 cup ice",
      notes: ["Add 10–30 ml syrup as applicable", "Stir to integrate"],
    },
    steps: [
      "Fill cup with ice to 3/4.",
      "Pull double espresso over ice or into separate cup first to cool.",
      "Add syrup (if any).",
      "Top with milk; lid and present with straw.",
    ],
  },
  {
    name: "Cold Brew (Template)",
    summary: "Batch brew template for immersion-style cold brew.",
    details: {
      ratio: "1:7 coffee to water by weight",
      grind: "Coarse (similar to French press)",
      brew: "12–18 hours cold steep",
      notes: ["Filter with paper or mesh", "Store refrigerated 24–48h"],
    },
    steps: [
      "Combine ground coffee and filtered water in sanitized vessel.",
      "Stir to wet all grounds; cover.",
      "Steep refrigerated for 12–18 hours.",
      "Filter; label with batch date/time and discard-by.",
    ],
  },
];

const POLICY_SECTIONS = [
  {
    key: "conduct",
    icon: Users,
    title: "Workplace Conduct (Template)",
    bullets: [
      "Treat guests and teammates with respect; no harassment or discrimination.",
      "Follow manager directions; raise issues promptly and professionally.",
      "No phone use at bar unless authorized for POS/operations.",
    ],
  },
  {
    key: "service",
    icon: Coffee,
    title: "Customer Service Standards (Template)",
    bullets: [
      "Greet within 10 seconds; eye contact and genuine welcome.",
      "Repeat order back; confirm size, milk, and modifiers.",
      "Quality check before handoff; thank guest by name if available.",
    ],
  },
  {
    key: "safety",
    icon: Shield,
    title: "Health & Safety / Food Handling (Template)",
    bullets: [
      "Wash hands: upon clock-in, after breaks, after handling money, every 30 minutes.",
      "Sanitize surfaces hourly; use labeled, dated sanitizing solutions.",
      "Allergens: prevent cross-contact; use dedicated tools when required.",
    ],
  },
  {
    key: "dress",
    icon: Shirt,
    title: "Dress Code & Hygiene (Template)",
    bullets: [
      "Clean, logo-forward top; closed-toe, non-slip shoes.",
      "Hair secured; minimal jewelry per safety guidance.",
      "Apron clean at start of shift; replace if heavily soiled.",
    ],
  },
  {
    key: "attendance",
    icon: CalendarCheck2,
    title: "Attendance & Shifts (Template)",
    bullets: [
      "Arrive 10 minutes early to prep and handoff.",
      "Swap shifts per manager approval; provide 24h notice if possible.",
      "Clock in/out accurately; breaks per local law and policy.",
    ],
  },
];

const QUIZ_BANK = [
  {
    id: "q1",
    prompt: "What is the primary purpose of a recipe template?",
    options: [
      "To provide consistent quality and steps that can be customized",
      "To restrict baristas from adjusting for equipment and beans",
      "To eliminate training altogether",
    ],
    answerIndex: 0,
    rationale:
      "Templates ensure baseline consistency while allowing team-specific adjustments.",
  },
  {
    id: "q2",
    prompt: "Which action best prevents allergen cross-contact?",
    options: [
      "Rinsing tools in room-temp water",
      "Using dedicated tools and sanitizing between drinks",
      "Wiping with a dry towel",
    ],
    answerIndex: 1,
    rationale: "Dedicated tools + sanitation reduces risk of residual allergens.",
  },
  {
    id: "q3",
    prompt: "A guest approaches the bar. What should happen first?",
    options: [
      "Continue phone use until free",
      "Greet within 10 seconds with eye contact",
      "Begin cleaning before acknowledging the guest",
    ],
    answerIndex: 1,
    rationale: "A prompt, friendly greeting sets the tone and reduces perceived wait time.",
  },
];

// --- UI helpers ---
const SectionShell = ({ title, subtitle, children, onComplete, completed }) => (
  <Card className="rounded-2xl shadow-lg border-0">
    <CardHeader className="pb-2">
      <CardTitle className="text-2xl">{title}</CardTitle>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </CardHeader>
    <CardContent className="space-y-6">
      {children}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {completed ? (
            <Badge className="rounded-full" variant="secondary"><Check className="w-3 h-3 mr-1"/>Completed</Badge>
          ) : (
            <Badge className="rounded-full" variant="outline">In progress</Badge>
          )}
        </div>
        {!completed && (
          <Button onClick={onComplete} className="rounded-2xl px-5">Mark Complete</Button>
        )}
      </div>
    </CardContent>
  </Card>
);

// --- Main App ---
export default function CoffeeLabTraining() {
  const [openNav, setOpenNav] = useState(true);
  const [active, setActive] = useState("welcome");
  const [completed, setCompleted] = useState({});
  const [quizState, setQuizState] = useState({}); // { [id]: {choice, correct} }

  const sections = useMemo(
    () => [
      { key: "welcome", label: "Welcome", icon: Home },
      { key: "recipes", label: "Recipes", icon: Coffee },
      { key: "policies", label: "Policies", icon: ListChecks },
      { key: "quiz", label: "Knowledge Check", icon: HelpCircle },
      { key: "certificate", label: "Certificate", icon: GraduationCap },
    ],
    []
  );

  const totalTrackable = 1 /*welcome*/ + 1 /*recipes*/ + POLICY_SECTIONS.length + 1 /*quiz*/;
  const progress = useMemo(() => {
    const done = Object.values(completed).filter(Boolean).length;
    const pct = Math.round((done / totalTrackable) * 100);
    return Math.min(100, pct);
  }, [completed, totalTrackable]);

  const quizScore = useMemo(() => {
    let correct = 0;
    QUIZ_BANK.forEach((q) => {
      if (quizState[q.id]?.correct) correct += 1;
    });
    return { correct, total: QUIZ_BANK.length };
  }, [quizState]);

  const canDownloadCert = progress === 100 && quizScore.correct === quizScore.total;

  const markComplete = (key) => setCompleted((prev) => ({ ...prev, [key]: true }));

  const handleQuizSelect = (qid, idx) => {
    const question = QUIZ_BANK.find((q) => q.id === qid);
    const correct = question.answerIndex === idx;
    setQuizState((s) => ({ ...s, [qid]: { choice: idx, correct } }));
  };

  const Certificate = () => (
    <div className="bg-white rounded-2xl p-8 shadow-xl border">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Coffee className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-semibold">CoffeeLab Training — Completion Certificate</h2>
        <p className="text-muted-foreground">Generic eLearning Module</p>
      </div>
      <div className="mt-6">
        <p className="text-center text-lg">
          This is to certify that <span className="font-semibold">____________________</span> has completed the
          CoffeeLab onboarding training covering Recipes (templates), Policies, and Health & Safety.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <p><span className="font-medium">Completion Date:</span> {new Date().toLocaleDateString()}</p>
            <p><span className="font-medium">Score:</span> {quizScore.correct}/{quizScore.total}</p>
          </div>
          <div>
            <p><span className="font-medium">Trainer/Manager:</span> ____________________</p>
            <p><span className="font-medium">Location:</span> ____________________</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Button onClick={() => window.print()} className="rounded-2xl px-6">Print / Save as PDF</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpenNav((v) => !v)}>
            <Menu className="w-5 h-5" />
          </Button>
          <Coffee className="w-5 h-5" />
          <span className="font-semibold">CoffeeLab • Training Portal (Generic)</span>
          <div className="ml-auto w-40 hidden md:block">
            <Progress value={progress} />
          </div>
          <Badge className="ml-2 rounded-full" variant={progress === 100 ? "default" : "secondary"}>
            {progress}% Complete
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
        {/* Sidebar */}
        <aside className={`${openNav ? "block" : "hidden"} md:block`}>
          <div className="bg-white shadow-sm rounded-2xl border p-2">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-neutral-50 ${
                  active === s.key ? "bg-neutral-100" : ""
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="flex-1">{s.label}</span>
                {s.key !== "certificate" && (
                  <span className="text-xs text-muted-foreground">
                    {completed[s.key] ? "✓" : ""}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="space-y-6">
          {active === "welcome" && (
            <SectionShell
              title="Welcome to CoffeeLab (Generic Module)"
              subtitle="This course covers templates for recipes, core policies, and a brief knowledge check."
              onComplete={() => markComplete("welcome")}
              completed={!!completed["welcome"]}
            >
              <div className="grid md:grid-cols-3 gap-4">
                {["Recipes", "Policies", "Knowledge Check"].map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="rounded-2xl shadow-md border-0">
                      <CardHeader>
                        <CardTitle className="text-lg">{t}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Explore the {t.toLowerCase()} section to learn the core standards. Mark each section complete.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </SectionShell>
          )}

          {active === "recipes" && (
            <SectionShell
              title="Recipe Templates"
              subtitle="Use these as placeholders your team can adapt to local equipment and beans."
              onComplete={() => markComplete("recipes")}
              completed={!!completed["recipes"]}
            >
              <div className="space-y-4">
                {GENERIC_RECIPES.map((r) => (
                  <Card key={r.name} className="border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="rounded-full">Template</Badge>
                        <CardTitle className="text-xl">{r.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.summary}</p>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Specs</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {Object.entries(r.details).map(([k, v]) => (
                            <li key={k}>
                              <span className="font-medium capitalize">{k}:</span>{" "}
                              {Array.isArray(v) ? (
                                <ul className="list-[circle] pl-5">
                                  {v.map((x, i) => (
                                    <li key={i}>{x}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span>{v}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Steps</h4>
                        <ol className="list-decimal pl-5 text-sm space-y-1">
                          {r.steps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>
          )}

          {active === "policies" && (
            <SectionShell
              title="Company Policies (Generic Templates)"
              subtitle="Adapt these bullet points to your local laws and CoffeeLab standards."
              onComplete={() => markComplete("policies")}
              completed={!!completed["policies"]}
            >
              <div className="space-y-4">
                {POLICY_SECTIONS.map((p) => (
                  <Card key={p.key} className="border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-3 flex flex-row items-center gap-3">
                      <p.icon className="w-5 h-5" />
                      <CardTitle className="text-xl">{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {p.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                      <div className="mt-3">
                        <Badge variant="outline" className="rounded-full">Customize locally</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={() => POLICY_SECTIONS.forEach((p) => markComplete(p.key))} variant="secondary" className="rounded-2xl">
                  Mark all policy subsections complete
                </Button>
              </div>
            </SectionShell>
          )}

          {active === "quiz" && (
            <SectionShell
              title="Knowledge Check"
              subtitle="Answer all questions to unlock your certificate."
              onComplete={() => markComplete("quiz")}
              completed={!!completed["quiz"]}
            >
              <div className="space-y-4">
                {QUIZ_BANK.map((q, qi) => (
                  <Card key={q.id} className="rounded-2xl border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">{qi + 1}. {q.prompt}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {q.options.map((opt, i) => {
                          const selected = quizState[q.id]?.choice === i;
                          const answered = typeof quizState[q.id]?.choice === "number";
                          const isCorrect = answered && i === q.answerIndex;
                          const isWrongSel = answered && selected && !isCorrect;
                          return (
                            <button
                              key={i}
                              onClick={() => handleQuizSelect(q.id, i)}
                              className={`w-full text-left px-3 py-2 rounded-xl border transition ${
                                selected ? "border-neutral-900" : "border-neutral-200"
                              } ${isCorrect ? "bg-green-50" : ""} ${isWrongSel ? "bg-red-50" : ""}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {typeof quizState[q.id]?.choice === "number" && (
                        <p className={`mt-2 text-sm ${quizState[q.id].correct ? "text-green-700" : "text-red-700"}`}>
                          {quizState[q.id].correct ? "Correct." : "Not quite."} {q.rationale}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>
          )}

          {active === "certificate" && (
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Your Certificate</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete all sections and pass the knowledge check to enable printing.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {canDownloadCert ? (
                  <Certificate />
                ) : (
                  <div className="p-6 bg-neutral-50 rounded-xl border text-sm">
                    <p className="mb-2">Progress required:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Welcome marked complete</li>
                      <li>Recipes marked complete</li>
                      <li>All Policy subsections marked complete</li>
                      <li>Knowledge Check marked complete and all answers correct</li>
                    </ul>
                    <div className="mt-4">
                      <Progress value={progress} />
                      <p className="mt-2">Current: {progress}% • Quiz Score: {quizScore.correct}/{quizScore.total}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <footer className="py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CoffeeLab — Generic Training Module Template
      </footer>

      <style>{`
        @media print {
          body { background: white; }
          header, footer, aside, nav, .sticky { display: none !important; }
          main { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
