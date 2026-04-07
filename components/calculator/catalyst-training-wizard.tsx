"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/catalyst-flow-theme.css";
import { ROUTE_IDENTITY_COMPLETE_KEY, peekRouteIdentityPayload, type RouteIdentityPayload } from "@/lib/route-selection-bridge";
import { readSessionJson } from "@/lib/session-json";
import {
  mapRouteAuthority,
  mapRouteClientCompanySize,
  mapRouteClientIndustry,
  mapRouteCompanySize,
  mapRouteConsultPurpose,
  mapRouteEducation,
  mapRouteFormat,
  mapRouteFunding,
  mapRouteIndustrySlug,
  mapRouteLearningGoal,
  mapRouteYears,
} from "@/lib/route-selection-field-maps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TRAINING_CAPABILITY_CATEGORIES,
  recommendModules,
  searchCatalog,
  type ScoredModule,
} from "@/lib/catalyst-training-catalog";

const STORAGE_KEY = "catalystTrainingWizard_v1";
const TRAINING_FROM_ROUTE_KEY = "catalystTrainingFromRouteSelection";

export type TrainingWizardStep = "id" | "aud" | "cat" | "goals" | "modules" | "out" | "unlock" | "final";

const STEP_ORDER: TrainingWizardStep[] = ["id", "aud", "cat", "goals", "modules", "out", "unlock", "final"];

/** Horizontal stepper + progress bar (HTML prototype); excludes unlock / final */
const TRAINING_STEP_BAR: { step: TrainingWizardStep; label: string }[] = [
  { step: "id", label: "Who You Are" },
  { step: "aud", label: "Audience" },
  { step: "cat", label: "Capability Areas" },
  { step: "goals", label: "Goals" },
  { step: "modules", label: "Modules" },
  { step: "out", label: "Your Plan" },
];

const TARGET_DEPTS = [
  "Sales",
  "Customer Service",
  "Operations",
  "Finance & Accounting",
  "HR",
  "Executive Leadership",
  "Senior Management",
  "Line Management",
  "Supervisor",
  "Supply Chain",
  "IT & Technology",
  "Cross-functional",
  "Whole Organization",
] as const;

const DELIVERY_OPTIONS = [
  "Virtual / Live Online",
  "In-Person",
  "Blended",
  "Self-Paced (LMS)",
] as const;

type Identity = "individual" | "business" | "consultant" | null;

type Audience = "myself" | "team" | "dept" | "org" | null;

interface WizardState {
  step: TrainingWizardStep;
  identity: Identity;
  individual: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    jobTitle: string;
    yearsExperience: string;
    areaOfInterest: string;
    educationLevel: string;
    learningGoal: string;
    preferredFormat: string;
    fundingSource: string;
  };
  business: {
    fullName: string;
    workEmail: string;
    jobTitle: string;
    companyName: string;
    authorityLevel: string;
    industry: string;
    companySize: string;
  };
  consultant: {
    fullName: string;
    firm: string;
    email: string;
    phone: string;
    purpose: string;
    country: string;
    clientIndustry: string;
    clientCompanySize: string;
    nda: boolean;
  };
  audience: Audience;
  teamSize: string;
  orgSize: string;
  targetDepts: string[];
  deliveryModes: string[];
  categories: string[];
  goals: string[];
  topics: Record<string, { name: string; hours: number }>;
  /** Step 4 optional notes (HTML: #notesField) */
  specificNotes: string;
  /** Step 5 custom module description (HTML: #customTopic) */
  customTopic: string;
  unlockPhone: string;
  unlockFollowup: string;
  unlockBestTime: string;
  consent: boolean;
}

const defaultState = (): WizardState => ({
  step: "id",
  identity: null,
  individual: {
    fullName: "",
    email: "",
    phone: "",
    country: "Ethiopia",
    jobTitle: "",
    yearsExperience: "",
    areaOfInterest: "",
    educationLevel: "Degree",
    learningGoal: "Upskilling",
    preferredFormat: "Virtual / Live",
    fundingSource: "Self-Funded",
  },
  business: {
    fullName: "",
    workEmail: "",
    jobTitle: "",
    companyName: "",
    authorityLevel: "Decision Maker",
    industry: "",
    companySize: "",
  },
  consultant: {
    fullName: "",
    firm: "",
    email: "",
    phone: "",
    purpose: "",
    country: "Ethiopia",
    clientIndustry: "",
    clientCompanySize: "",
    nda: false,
  },
  audience: null,
  teamSize: "",
  orgSize: "",
  targetDepts: [],
  deliveryModes: [],
  categories: [],
  goals: [],
  topics: {},
  specificNotes: "",
  customTopic: "",
  unlockPhone: "",
  unlockFollowup: "Phone Call",
  unlockBestTime: "",
  consent: false,
});

function stepIndex(s: TrainingWizardStep): number {
  return STEP_ORDER.indexOf(s);
}

function applyTrainingFromRouteSelection(base: WizardState, p: RouteIdentityPayload): WizardState {
  const profile = p.profile;
  if (p.role === "individual") {
    return {
      ...base,
      identity: "individual",
      individual: {
        ...base.individual,
        fullName: profile.fullName ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        country: profile.country || "Ethiopia",
        jobTitle: profile.jobTitle ?? "",
        yearsExperience: mapRouteYears(profile.yearsExperience ?? ""),
        areaOfInterest: profile.areaOfInterest ?? "",
        educationLevel: mapRouteEducation(profile.educationLevel ?? ""),
        learningGoal: mapRouteLearningGoal(profile.learningGoal ?? ""),
        preferredFormat: mapRouteFormat(profile.preferredFormat ?? ""),
        fundingSource: mapRouteFunding(profile.fundingSource ?? ""),
      },
    };
  }
  if (p.role === "business") {
    return {
      ...base,
      identity: "business",
      business: {
        ...base.business,
        fullName: profile.fullName ?? "",
        workEmail: profile.workEmail ?? "",
        jobTitle: profile.jobTitle ?? "",
        companyName: profile.company ?? "",
        authorityLevel: mapRouteAuthority(profile.authorityLevel ?? ""),
        industry: mapRouteIndustrySlug(profile.industry ?? ""),
        companySize: mapRouteCompanySize(profile.companySize ?? ""),
      },
    };
  }
  return {
    ...base,
    identity: "consultant",
    consultant: {
      ...base.consultant,
      fullName: profile.fullName ?? "",
      firm: profile.firm ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      purpose: mapRouteConsultPurpose(profile.purpose ?? ""),
      country: profile.country || "Ethiopia",
      clientIndustry: mapRouteClientIndustry(profile.clientIndustry ?? ""),
      clientCompanySize: mapRouteClientCompanySize(profile.clientCompanySize ?? ""),
      nda: p.nda,
    },
  };
}

function TrainingLiveReview({ state }: { state: WizardState }) {
  const mods = Object.values(state.topics).map((t) => t.name);
  return (
    <>
      <div className="catalyst-flow-summary-block">
        <strong>Direction:</strong> You are building a <strong>Capability Development Plan</strong>.
      </div>
      {state.categories.length > 0 && (
        <div className="catalyst-flow-summary-block">
          <strong>Areas:</strong> You are focusing on <strong>{state.categories.join(", ")}</strong>.
        </div>
      )}
      {state.goals.length > 0 && (
        <div className="catalyst-flow-summary-block">
          <strong>Goals:</strong> Your main goals are to <strong>{state.goals.join(", ")}</strong>.
        </div>
      )}
      {mods.length > 0 && (
        <div className="catalyst-flow-summary-block">
          <strong>Modules:</strong> You have selected <strong>{mods.length} module(s)</strong> ({mods.join(", ")}).
        </div>
      )}
    </>
  );
}

export function CatalystTrainingWizard({
  onProgressChange,
}: {
  onProgressChange?: (percent: number) => void;
}) {
  const router = useRouter();
  const [state, setState] = useState<WizardState>(defaultState);
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reco, setReco] = useState<ScoredModule[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const incoming = peekRouteIdentityPayload();
      if (incoming?.route === "training") {
        sessionStorage.removeItem(ROUTE_IDENTITY_COMPLETE_KEY);
        const merged = applyTrainingFromRouteSelection(defaultState(), incoming);
        merged.step = "aud";
        setState(merged);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        sessionStorage.setItem(TRAINING_FROM_ROUTE_KEY, "1");
        setStorageReady(true);
        return;
      }

      const parsed = readSessionJson<Partial<WizardState>>(STORAGE_KEY);
      if (parsed) {
        setState(() => ({ ...defaultState(), ...parsed, step: parsed.step ?? "id" }));
      }
    } catch {
      /* ignore */
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, storageReady]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  const thinBarPct = useMemo(() => {
    if (state.step === "unlock" || state.step === "final") return 100;
    const i = TRAINING_STEP_BAR.findIndex((x) => x.step === state.step);
    if (i < 0) return 0;
    return Math.round((i / (TRAINING_STEP_BAR.length - 1)) * 100);
  }, [state.step]);

  useEffect(() => {
    onProgressChange?.(thinBarPct);
  }, [thinBarPct, onProgressChange]);

  const showTrainingChrome = state.step !== "unlock" && state.step !== "final";

  useEffect(() => {
    if (state.step !== "modules") return;
    const r = recommendModules(state.categories, state.goals, state.targetDepts, state.audience);
    setReco(r);
  }, [state.step, state.categories, state.goals, state.targetDepts, state.audience]);

  const searchResults = useMemo(() => searchCatalog(searchQuery), [searchQuery]);

  const validate = (step: TrainingWizardStep): boolean => {
    if (step === "id") {
      if (!state.identity) {
        showToast("Select who you are.");
        return false;
      }
      if (state.identity === "business") {
        if (!state.business.fullName.trim() || !state.business.workEmail.trim()) {
          showToast("Name and Work Email are required.");
          return false;
        }
      }
      if (state.identity === "individual") {
        if (!state.individual.fullName.trim() || !state.individual.email.trim()) {
          showToast("Name and Personal Email are required.");
          return false;
        }
      }
      if (state.identity === "consultant") {
        const c = state.consultant;
        if (!c.fullName.trim() || !c.firm.trim() || !c.email.trim() || !c.phone.trim()) {
          showToast("Please fill in all required contact details.");
          return false;
        }
      }
      return true;
    }
    if (step === "aud") {
      if (!state.audience) {
        showToast("Select who this is for.");
        return false;
      }
      if (
        (state.audience === "team" || state.audience === "dept") &&
        state.targetDepts.length === 0
      ) {
        showToast("Select at least one target department.");
        return false;
      }
      return true;
    }
    if (step === "cat") {
      if (state.categories.length === 0) {
        showToast("Select at least one capability area.");
        return false;
      }
      return true;
    }
    if (step === "goals") {
      if (state.goals.length === 0) {
        showToast("Select at least one outcome goal.");
        return false;
      }
      return true;
    }
    if (step === "modules") {
      if (Object.keys(state.topics).length === 0 && !state.customTopic.trim()) {
        showToast("Select at least one module or describe a custom need.");
        return false;
      }
      return true;
    }
    if (step === "unlock") {
      if (!state.unlockPhone.trim()) {
        showToast("Phone number is required.");
        return false;
      }
      if (!state.consent) {
        showToast("Please agree to the privacy policy.");
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!validate(state.step)) return;

    if (state.step === "unlock") {
      void submitPayload();
    }

    const i = stepIndex(state.step);
    if (i < STEP_ORDER.length - 1) {
      let next = STEP_ORDER[i + 1];
      setState((s) => ({ ...s, step: next }));
    }
  };

  const goBack = () => {
    if (
      state.step === "aud" &&
      typeof window !== "undefined" &&
      sessionStorage.getItem(TRAINING_FROM_ROUTE_KEY) === "1"
    ) {
      sessionStorage.removeItem(TRAINING_FROM_ROUTE_KEY);
      router.push("/route-selection");
      return;
    }
    const i = stepIndex(state.step);
    if (i > 0) setState((s) => ({ ...s, step: STEP_ORDER[i - 1] }));
  };

  const submitPayload = async () => {
    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "training_wizard_v1",
          data: state,
        }),
      });
    } catch {
      /* non-blocking */
    }
    showToast("Packaging plan...");
  };

  const toggleCategory = (c: string) => {
    setState((s) => ({
      ...s,
      categories: s.categories.includes(c) ? s.categories.filter((x) => x !== c) : [...s.categories, c],
    }));
  };

  const toggleGoal = (g: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.includes(g) ? s.goals.filter((x) => x !== g) : [...s.goals, g],
    }));
  };

  const toggleDelivery = (d: string) => {
    setState((s) => ({
      ...s,
      deliveryModes: s.deliveryModes.includes(d)
        ? s.deliveryModes.filter((x) => x !== d)
        : [...s.deliveryModes, d],
    }));
  };

  const toggleDept = (d: string) => {
    setState((s) => ({
      ...s,
      targetDepts: s.targetDepts.includes(d) ? s.targetDepts.filter((x) => x !== d) : [...s.targetDepts, d],
    }));
  };

  const toggleTopic = (id: string, name: string, hours: number) => {
    setState((s) => {
      const next = { ...s.topics };
      if (next[id]) delete next[id];
      else next[id] = { name, hours };
      return { ...s, topics: next };
    });
  };

  const removeTopic = (id: string) => {
    setState((s) => {
      const next = { ...s.topics };
      delete next[id];
      return { ...s, topics: next };
    });
  };

  const addSearchTopic = (id: string, name: string, hours: number) => {
    setState((s) => ({ ...s, topics: { ...s.topics, [id]: { name, hours } } }));
    setSearchQuery("");
    showToast(`"${name}" added.`);
  };

  const resetAndHome = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(TRAINING_FROM_ROUTE_KEY);
    setState(defaultState());
    window.location.href = "/";
  };

  const hideBottom = state.step === "final" || state.step === "out";

  const nextLabel =
    state.step === "modules"
      ? "Generate Capability Plan →"
      : state.step === "unlock"
        ? "Submit →"
        : "Continue →";

  const outcomeSections: { title: string; items: string[] }[] = [
    {
      title: "Performance & Productivity",
      items: ["Improve team productivity", "Reduce errors", "Increase speed of work", "Improve problem-solving"],
    },
    {
      title: "People & Communication",
      items: [
        "Improve communication",
        "Improve teamwork",
        "Improve customer service",
        "Strengthen emotional intelligence",
      ],
    },
    { title: "Culture & Retention", items: ["Improve engagement", "Reduce turnover", "Strengthen culture"] },
    {
      title: "Leadership Capability",
      items: [
        "Improve leadership capability",
        "Strengthen coaching skills",
        "Improve conflict resolution",
        "Improve decision-making",
      ],
    },
    {
      title: "Commercial Impact",
      items: ["Improve sales performance", "Increase customer satisfaction", "Reduce complaints"],
    },
    {
      title: "Technical & Digital",
      items: ["Improve technical skill proficiency", "Improve digital / software skill levels"],
    },
    {
      title: "Compliance",
      items: ["Ensure 100% compliance", "Reduce regulatory or process errors"],
    },
  ];

  return (
    <div className="catalyst-flow-shell">
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[700] bg-[#0f172a] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg border border-white/10">
          {toast}
        </div>
      )}

      <div className="catalyst-flow-prog-bar">
        <div className="catalyst-flow-prog-fill" style={{ width: `${thinBarPct}%` }} />
      </div>

      {showTrainingChrome && (
        <div className="catalyst-flow-step-progress">
          <div className="catalyst-flow-step-track">
            {TRAINING_STEP_BAR.map((item, si) => {
              const rawIdx = TRAINING_STEP_BAR.findIndex((x) => x.step === state.step);
              const activeIdx = rawIdx >= 0 ? rawIdx : 0;
              const isDone = si < activeIdx;
              const isActive = si === activeIdx;
              const isFuture = si > activeIdx;
              const dotClass = [
                "catalyst-flow-step-dot",
                isDone ? "catalyst-flow-step-dot-done" : "",
                isActive ? "catalyst-flow-step-dot-active" : "",
              ]
                .filter(Boolean)
                .join(" ");
              const lblClass = [
                "catalyst-flow-step-lbl",
                isActive ? "catalyst-flow-step-lbl-active" : "",
                isDone ? "catalyst-flow-step-lbl-done" : "",
                isFuture ? "catalyst-flow-step-lbl-future" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <Fragment key={item.step}>
                  <div className="catalyst-flow-step-item">
                    <div className={dotClass}>{isDone ? "✓" : si + 1}</div>
                    <div className={lblClass}>{item.label}</div>
                  </div>
                  {si < TRAINING_STEP_BAR.length - 1 && (
                    <div className={`catalyst-flow-step-line${isDone ? " is-done" : ""}`} />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      )}

      <div className={`catalyst-flow-layout${state.step === "final" ? " catalyst-flow-layout--success" : ""}`}>
        <div className="catalyst-flow-main">
          <div
            className={
              state.step === "final"
                ? "w-full px-4 py-8"
                : "max-w-3xl mx-auto px-4 py-6 pb-32"
            }
          >
      {state.step === "id" && (
        <div className="space-y-6 animate-fade-in">
          <div className="cw-step-eyebrow">Capability Development · Step 1 of 8</div>
          <h2 className="cw-step-title">
            Who are <em>you?</em>
          </h2>
          <p className="cw-step-lead max-w-xl">
            This personalizes your entire experience — the questions, the recommendations, and the final output.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(
              [
                ["individual", "👤", "Individual", "Personal learning and professional development."],
                ["business", "🏢", "Business / Organization", "HR manager, department head, or executive."],
                ["consultant", "🤝", "Consultant / Partner", "Building a capability proposal for a client."],
              ] as const
            ).map(([id, icon, title, desc]) => (
              <button
                key={id}
                type="button"
                onClick={() => setState((s) => ({ ...s, identity: id }))}
                className={`relative text-left cw-pick-card ${state.identity === id ? "is-selected" : ""}`}
              >
                {state.identity === id && (
                  <span className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full bg-[var(--cw-accent)] text-[var(--cw-on-accent)] text-[10px] flex items-center justify-center shadow-sm">
                    ✓
                  </span>
                )}
                <span className="text-xl block mb-2">{icon}</span>
                <div className="font-bold text-[#0f172a]">{title}</div>
                <div className="text-xs text-[#6B7280] mt-1 leading-snug">{desc}</div>
              </button>
            ))}
          </div>

          {state.identity === "individual" && (
            <div className="role-form space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={state.individual.fullName}
                    onChange={(e) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, fullName: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Personal Email *</Label>
                  <Input
                    type="email"
                    value={state.individual.email}
                    onChange={(e) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, email: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={state.individual.phone}
                    onChange={(e) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, phone: e.target.value } }))
                    }
                    placeholder="+251..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={state.individual.country}
                    onChange={(e) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, country: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Current Job Title</Label>
                  <Input
                    value={state.individual.jobTitle}
                    onChange={(e) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, jobTitle: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Select
                    value={state.individual.yearsExperience}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, yearsExperience: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0–2 years">0–2 years</SelectItem>
                      <SelectItem value="3–5 years">3–5 years</SelectItem>
                      <SelectItem value="6–10 years">6–10 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Area of Interest</Label>
                  <Input
                    value={state.individual.areaOfInterest}
                    onChange={(e) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, areaOfInterest: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Education Level</Label>
                  <Select
                    value={state.individual.educationLevel}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, educationLevel: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Degree">Degree</SelectItem>
                      <SelectItem value="Masters">Masters</SelectItem>
                      <SelectItem value="Certification">Certification</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Learning Goal</Label>
                  <Select
                    value={state.individual.learningGoal}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, learningGoal: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upskilling">Upskilling</SelectItem>
                      <SelectItem value="Career Pivot">Career Pivot</SelectItem>
                      <SelectItem value="Certification">Certification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Preferred Format</Label>
                  <Select
                    value={state.individual.preferredFormat}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, preferredFormat: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Virtual / Live">Virtual / Live</SelectItem>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Self-paced (LMS)">Self-paced (LMS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Funding Source</Label>
                  <Select
                    value={state.individual.fundingSource}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, individual: { ...s.individual, fundingSource: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Self-Funded">Self-Funded</SelectItem>
                      <SelectItem value="My Company is Paying">My Company is Paying</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {state.identity === "business" && (
            <div className="role-form space-y-3 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={state.business.fullName}
                    onChange={(e) =>
                      setState((s) => ({ ...s, business: { ...s.business, fullName: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Work Email *</Label>
                  <Input
                    type="email"
                    value={state.business.workEmail}
                    onChange={(e) =>
                      setState((s) => ({ ...s, business: { ...s.business, workEmail: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={state.business.jobTitle}
                    onChange={(e) =>
                      setState((s) => ({ ...s, business: { ...s.business, jobTitle: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    value={state.business.companyName}
                    onChange={(e) =>
                      setState((s) => ({ ...s, business: { ...s.business, companyName: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Authority Level</Label>
                  <Select
                    value={state.business.authorityLevel}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, business: { ...s.business, authorityLevel: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Decision Maker">Decision Maker</SelectItem>
                      <SelectItem value="Influencer">Influencer</SelectItem>
                      <SelectItem value="End User">End User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Industry</Label>
                  <Select
                    value={state.business.industry}
                    onValueChange={(v) => setState((s) => ({ ...s, business: { ...s.business, industry: v } }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["Manufacturing", "Financial Services", "Telecom & Tech", "Retail", "Healthcare", "Government", "Logistics", "NGO", "Other"].map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Company Size</Label>
                  <Select
                    value={state.business.companySize}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, business: { ...s.business, companySize: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["1–50", "51–200", "201–500", "501–1000", "1000+"].map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {state.identity === "consultant" && (
            <div className="role-form space-y-3 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Your Full Name *</Label>
                  <Input
                    value={state.consultant.fullName}
                    onChange={(e) =>
                      setState((s) => ({ ...s, consultant: { ...s.consultant, fullName: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Firm Name *</Label>
                  <Input
                    value={state.consultant.firm}
                    onChange={(e) =>
                      setState((s) => ({ ...s, consultant: { ...s.consultant, firm: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Work Email *</Label>
                  <Input
                    type="email"
                    value={state.consultant.email}
                    onChange={(e) =>
                      setState((s) => ({ ...s, consultant: { ...s.consultant, email: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    value={state.consultant.phone}
                    onChange={(e) =>
                      setState((s) => ({ ...s, consultant: { ...s.consultant, phone: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Purpose</Label>
                  <Select
                    value={state.consultant.purpose}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, consultant: { ...s.consultant, purpose: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Helping a client">Helping a client</SelectItem>
                      <SelectItem value="Research & Benchmarking">Research & Benchmarking</SelectItem>
                      <SelectItem value="Exploring Partnership">Exploring Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={state.consultant.country}
                    onChange={(e) =>
                      setState((s) => ({ ...s, consultant: { ...s.consultant, country: e.target.value } }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Client Industry</Label>
                  <Select
                    value={state.consultant.clientIndustry}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, consultant: { ...s.consultant, clientIndustry: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["Manufacturing", "Financial Services", "Telecom & Tech", "Healthcare", "NGO / Government", "Other / Multiple"].map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Client Company Size</Label>
                  <Select
                    value={state.consultant.clientCompanySize}
                    onValueChange={(v) =>
                      setState((s) => ({ ...s, consultant: { ...s.consultant, clientCompanySize: v } }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["1–50", "51–200", "201–500", "501–1000", "1000+"].map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <Checkbox
                  id="t-nda"
                  checked={state.consultant.nda}
                  onCheckedChange={(c) =>
                    setState((s) => ({ ...s, consultant: { ...s.consultant, nda: !!c } }))
                  }
                />
                <Label htmlFor="t-nda" className="text-xs font-normal leading-snug text-[#6B7280]">
                  I agree not to replicate SewAsset&apos;s proprietary frameworks, catalog structures, or SPSC™
                  methodology. *
                </Label>
              </div>
            </div>
          )}
        </div>
      )}

      {state.step === "aud" && (
        <div className="space-y-6">
          <div className="cw-step-eyebrow">Capability Development · Step 2 of 8</div>
          <h2 className="cw-step-title">
            Who is this <em>for?</em>
          </h2>
          <p className="cw-step-lead max-w-xl">
            Understanding the audience helps us tailor the recommendation algorithm.
          </p>

          <div className="cw-zone-label">
            <span>👥</span> Audience
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                ["myself", "👤", "Myself", "Personal development."],
                ["team", "👥", "My Team", "A group I manage directly."],
                ["dept", "🏬", "A Department", "Full functional unit."],
                ["org", "🏢", "Entire Organization", "Company-wide initiative."],
              ] as const
            ).map(([id, icon, title, tip]) => {
              const hide =
                state.identity === "individual" && (id === "dept" || id === "org");
              if (hide) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, audience: id }))}
                  className={`relative text-left cw-pick-card ${state.audience === id ? "is-selected" : ""}`}
                >
                  {state.audience === id && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--cw-accent)] text-[var(--cw-on-accent)] text-xs flex items-center justify-center shadow-sm">
                      ✓
                    </span>
                  )}
                  <span className="text-2xl block mb-2">{icon}</span>
                  <div className="font-bold text-[#0f172a]">{title}</div>
                  <div className="text-xs text-[#6B7280]">{tip}</div>
                  {id === "team" && state.audience === "team" && (
                    <Input
                      type="number"
                      min={2}
                      placeholder="Team size"
                      className="mt-2"
                      value={state.teamSize}
                      onChange={(e) => setState((s) => ({ ...s, teamSize: e.target.value }))}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {id === "org" && state.audience === "org" && (
                    <Select value={state.orgSize} onValueChange={(v) => setState((s) => ({ ...s, orgSize: v }))}>
                      <SelectTrigger className="mt-2" onClick={(e) => e.stopPropagation()}>
                        <SelectValue placeholder="Org size..." />
                      </SelectTrigger>
                      <SelectContent>
                        {["1–50", "51–200", "201–500", "501–1000", "1000+"].map((x) => (
                          <SelectItem key={x} value={x}>
                            {x}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </button>
              );
            })}
          </div>

          {(state.audience === "team" || state.audience === "dept") && (
            <div>
              <Label className="text-xs font-bold uppercase tracking-wide text-[#0f172a]">
                Target Department / Role *
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TARGET_DEPTS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDept(d)}
                    className={`px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                      state.targetDepts.includes(d)
                        ? "border-[var(--cw-accent)] bg-[var(--cw-accent-soft)] text-[#0f172a]"
                        : "border-[#e5e7eb] bg-white text-[#0f172a] hover:border-[var(--cw-accent-border-35)]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="cw-zone-label mt-2">
            <span>📍</span> Preferred delivery mode
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {DELIVERY_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDelivery(d)}
                className={`px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                  state.deliveryModes.includes(d)
                    ? "border-[var(--cw-accent)] bg-[var(--cw-accent)] text-[var(--cw-on-accent)] shadow-md"
                    : "border-[#e5e7eb] bg-white text-[#0f172a] hover:border-[var(--cw-accent-border-40)]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.step === "cat" && (
        <div className="space-y-4">
          <div className="cw-step-eyebrow">Capability Development · Step 3 of 8</div>
          <h2 className="cw-step-title">
            Select your <em>capability areas</em>
          </h2>
          <p className="cw-step-lead">Choose all development areas that match your priorities.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRAINING_CAPABILITY_CATEGORIES.map((cat) => {
              const meta: Record<string, { emoji: string; tip: string }> = {
                "Soft Skills": { emoji: "💬", tip: "Communication, teamwork, time management." },
                "Leadership & Management": { emoji: "🎯", tip: "Leading teams, delegation, coaching." },
                "Technical / Hard Skills": { emoji: "⚙️", tip: "Software, systems, digital tools." },
                "Compliance & Mandatory": { emoji: "📋", tip: "Regulatory, safety, ethics." },
                "Behavioral & Mindset": { emoji: "🧠", tip: "Accountability, resilience, EQ." },
                "Team & Culture Development": { emoji: "🌱", tip: "Collaboration, trust, engagement." },
                "Industry / Department Specific": { emoji: "🏭", tip: "Sales, finance, HR, IT, and more." },
                "Motivation & Engagement": { emoji: "🔥", tip: "Inspiration and morale." },
              };
              const m = meta[cat] ?? { emoji: "•", tip: "" };
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`relative cw-pick-card flex gap-3 items-start text-left ${state.categories.includes(cat) ? "is-selected" : ""}`}
                >
                  {state.categories.includes(cat) && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--cw-accent)] text-[var(--cw-on-accent)] text-xs flex items-center justify-center shadow-sm">
                      ✓
                    </span>
                  )}
                  <span className="text-2xl flex-shrink-0">{m.emoji}</span>
                  <div>
                    <div className="font-bold text-[#0f172a]">{cat}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">{m.tip}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {state.step === "goals" && (
        <div className="space-y-5">
          <div className="cw-step-eyebrow">Capability Development · Step 4 of 8</div>
          <h2 className="cw-step-title">
            What <em>outcomes</em> matter most?
          </h2>
          <p className="cw-step-lead">Select the performance results you want this program to support.</p>
          {outcomeSections.map((sec) => (
            <div key={sec.title}>
              <div className="text-xs font-bold uppercase tracking-wide text-[var(--cw-accent)] border-b border-[#e5e7eb] pb-2 mb-2">
                {sec.title}
              </div>
              <div className="flex flex-wrap gap-2">
                {sec.items.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                      state.goals.includes(g)
                        ? "border-[var(--cw-accent)] bg-[var(--cw-accent)] text-[var(--cw-on-accent)] shadow-sm"
                        : "border-[#e5e7eb] bg-white text-[#0f172a] hover:border-[var(--cw-accent-border-40)]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <Label>Anything specific to add? (Optional)</Label>
            <Textarea
              className="mt-1 min-h-[80px]"
              placeholder="e.g. We are preparing for ISO certification..."
              value={state.specificNotes}
              onChange={(e) => setState((s) => ({ ...s, specificNotes: e.target.value }))}
            />
          </div>
        </div>
      )}

      {state.step === "modules" && (
        <div className="space-y-6">
          <div className="cw-step-eyebrow">Capability Development · Step 5 of 8</div>
          <h2 className="cw-step-title">
            Select your <em>modules</em>
          </h2>
          <p className="cw-step-lead">
            Smart recommendations based on your capability areas, goals, and audience.
          </p>

          <div>
            <div className="cw-zone-label mb-2">
              <span>⭐</span> Recommended modules
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reco.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTopic(t.id, t.n, t.h)}
                  className={`relative cw-pick-card flex gap-3 items-start text-left ${state.topics[t.id] ? "is-selected" : ""}`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs ${
                      state.topics[t.id]
                      ? "bg-[var(--cw-accent)] border-[var(--cw-accent)] text-[var(--cw-on-accent)]"
                      : "border-[#e5e7eb]"
                    }`}
                  >
                    {state.topics[t.id] ? "✓" : ""}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0f172a]">{t.n}</div>
                    <div className="text-xs text-[#6B7280]">
                      {t.cat} · {t.h} hrs · {t.difficulty}
                    </div>
                    <div className="text-[10px] font-bold text-[var(--cw-accent)] mt-1 inline-block bg-[var(--cw-accent-soft)] px-2 py-0.5 rounded-full">
                      Score: {t.score} (Goals: +{t.goalMatches * 2} | Cat: +{t.catScore} | Dept: +{t.deptScore})
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="cw-zone-label mb-2">
              <span>🔎</span> Search full catalog
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, skill, or department..."
              className="border-[#e5e7eb] focus-visible:ring-2 focus-visible:ring-[var(--cw-focus-ring)]"
            />
            {searchResults.length > 0 && (
              <div className="mt-2 border border-[#e5e7eb] rounded-lg max-h-48 overflow-y-auto bg-white shadow-md">
                {searchResults.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="w-full text-left px-4 py-3 border-b border-[#f3f4f6] hover:bg-[#fff8f3] flex justify-between gap-2"
                    onClick={() => addSearchTopic(t.id, t.n, t.h)}
                  >
                    <span className="font-semibold text-sm text-[#0f172a]">{t.n}</span>
                    <span className="text-xs text-[#6B7280]">
                      {t.cat} · {t.h}h
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border border-[#e5e7eb] rounded-xl p-4 bg-white shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--cw-accent)] mb-2">Selected modules</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(state.topics).length === 0 && (
                <span className="text-xs italic text-[#6B7280]">No modules selected yet.</span>
              )}
              {Object.entries(state.topics).map(([id, { name }]) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cw-accent-soft)] border-2 border-[var(--cw-accent-border-35)] text-sm font-semibold text-[#0f172a]"
                >
                  {name}
                  <button type="button" className="text-[#c45c5c] hover:text-red-700" onClick={() => removeTopic(id)}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
            {Object.keys(state.topics).length > 0 && (
              <div className="mt-3 flex gap-6 text-sm text-[#6B7280] pt-3 border-t border-dashed border-[#e5e7eb]">
                <span>
                  Modules: <strong className="text-[#0f172a]">{Object.keys(state.topics).length}</strong>
                </span>
                <span>
                  Est. Duration:{" "}
                  <strong className="text-[#0f172a]">
                    {Object.values(state.topics).reduce((a, t) => a + t.hours, 0)} hrs
                  </strong>
                </span>
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs font-bold uppercase">Custom module (optional)</Label>
            <Textarea
              className="mt-1 min-h-[60px]"
              maxLength={160}
              placeholder="Describe a custom module..."
              value={state.customTopic}
              onChange={(e) => setState((s) => ({ ...s, customTopic: e.target.value }))}
            />
          </div>
        </div>
      )}

      {state.step === "out" && (
        <div className="space-y-4">
          <div className="cw-step-eyebrow">Capability Development · Your Plan</div>
          <h2 className="cw-step-title">
            Your Capability <em>Development Plan</em>
          </h2>
          <p className="cw-step-lead">
            A SewAsset specialist will confirm this plan within 24 hours. Book a call to secure your dates.
          </p>

          <div className="rounded-2xl overflow-hidden border-2 border-[var(--cw-mist)] shadow-xl max-w-3xl">
            <div className="cw-prop-header">
              <div>
                <div className="text-sm font-black tracking-tight">
                  Sew<span className="text-[var(--cw-accent)]">Asset</span>™ Catalyst
                </div>
                <div className="text-2xl font-extrabold mt-2">Capability Development Plan</div>
                <div className="text-white/65 text-sm mt-1">
                  Prepared{" "}
                  {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
              <span className="cw-prop-badge">Draft Proposal</span>
            </div>

            <div className="cw-prop-body">
              <section className="cw-psec">
                <span className="cw-ps-lbl">Plan Overview</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="cw-ps-item">
                    <div className="cw-ps-item-label">Capability Areas</div>
                    <div className="cw-ps-item-val">{state.categories.join(", ") || "—"}</div>
                  </div>
                  <div className="cw-ps-item">
                    <div className="cw-ps-item-label">Primary Goals</div>
                    <div className="cw-ps-item-val">
                      {state.goals.length
                        ? `${state.goals.slice(0, 3).join(", ")}${state.goals.length > 3 ? ` +${state.goals.length - 3} more` : ""}`
                        : "—"}
                    </div>
                  </div>
                  <div className="cw-ps-item">
                    <div className="cw-ps-item-label">Audience</div>
                    <div className="cw-ps-item-val">
                      {state.audience === "myself" && "Individual"}
                      {state.audience === "team" && `Team (${state.teamSize || "?"} people)`}
                      {state.audience === "dept" && "Department"}
                      {state.audience === "org" && `Entire Organization (${state.orgSize || "?"})`}
                    </div>
                  </div>
                  <div className="cw-ps-item">
                    <div className="cw-ps-item-label">Total Modules</div>
                    <div className="cw-ps-item-val">
                      {Object.keys(state.topics).length + (state.customTopic.trim() ? 1 : 0)} module
                      {Object.keys(state.topics).length + (state.customTopic.trim() ? 1 : 0) !== 1 ? "s" : ""} ·{" "}
                      {Object.values(state.topics).reduce((a, t) => a + t.hours, 0)}+ hrs
                    </div>
                  </div>
                </div>
              </section>

              <section className="cw-psec">
                <span className="cw-ps-lbl">Development Modules</span>
                <div className="flex flex-col gap-2.5">
                  {Object.entries(state.topics).map(([id, t]) => (
                    <div key={id} className="cw-trow">
                      <span className="cw-trow-name">{t.name}</span>
                      <span className="cw-trow-meta">{t.hours} hrs</span>
                    </div>
                  ))}
                  {state.customTopic.trim() && (
                    <div className="cw-trow">
                      <span className="cw-trow-name">Custom: {state.customTopic.trim()}</span>
                      <span className="cw-trow-meta">TBD</span>
                    </div>
                  )}
                  {Object.keys(state.topics).length === 0 && !state.customTopic.trim() && (
                    <p className="text-sm text-[var(--cw-mid)] italic py-2">
                      A SewAsset specialist will build a customized module plan based on your capability needs.
                    </p>
                  )}
                </div>
              </section>

              <section className="cw-psec">
                <span className="cw-ps-lbl">What Happens Next</span>
                <div className="cw-ns-list">
                  <div className="cw-ns">
                    <div className="cw-ns-num">1</div>
                    <div>
                      <div className="cw-ns-title">Planning Call</div>
                      <div className="cw-ns-desc">
                        A SewAsset specialist reviews your plan, confirms scope, dates, and delivery format.
                      </div>
                    </div>
                  </div>
                  <div className="cw-ns">
                    <div className="cw-ns-num">2</div>
                    <div>
                      <div className="cw-ns-title">Full Proposal Delivered</div>
                      <div className="cw-ns-desc">
                        Detailed capability plan with modules, timeline, and investment breakdown within 24 hours.
                      </div>
                    </div>
                  </div>
                  <div className="cw-ns">
                    <div className="cw-ns-num">3</div>
                    <div>
                      <div className="cw-ns-title">Capability Development Begins</div>
                      <div className="cw-ns-desc">
                        In-person, virtual, or LMS — built around your team&apos;s schedule and context.
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="cw-plan-validity">
                <span aria-hidden>⏰</span>
                <span>
                  This plan is held for <strong>7 days</strong>. Book your call to secure preferred dates.
                </span>
              </div>

              <button type="button" className="cw-book-btn" onClick={goNext}>
                📅 Book a Planning Call
              </button>
            </div>
          </div>
        </div>
      )}

      {state.step === "unlock" && (
        <div className="space-y-6 max-w-3xl">
          <div className="cw-step-eyebrow">Capability Development · Final Step</div>
          <h2 className="cw-step-title">
            Where should we send <em>your plan?</em>
          </h2>
          <p className="cw-step-lead">One last step—how we reach you to finalize your blueprint.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--cw-accent-soft)] p-4 rounded-lg border-l-4 border-[var(--cw-accent)] text-sm text-[#0f172a] shadow-sm">
              <h3 className="font-bold mb-2">You are 1 step away from your custom Training Blueprint.</h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Tailored Module Recommendations</li>
                <li>Targeted Skill Gap Mapping</li>
                <li>Investment Breakdown</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={state.unlockPhone}
                  onChange={(e) => setState((s) => ({ ...s, unlockPhone: e.target.value }))}
                  placeholder="+251..."
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Preferred mode for follow-up</Label>
                  <Select
                    value={state.unlockFollowup}
                    onValueChange={(v) => setState((s) => ({ ...s, unlockFollowup: v }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone Call">Phone Call</SelectItem>
                      <SelectItem value="Video Meet">Video Meet</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Best time to reach out?</Label>
                  <Input
                    value={state.unlockBestTime}
                    onChange={(e) => setState((s) => ({ ...s, unlockBestTime: e.target.value }))}
                    placeholder="e.g. Mornings"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={state.consent}
                  onCheckedChange={(c) => setState((s) => ({ ...s, consent: !!c }))}
                />
                <Label htmlFor="consent" className="text-xs font-normal leading-snug">
                  I agree to the SewAsset Privacy Policy and consent to my data being processed to generate this plan. *
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.step === "final" && (
        <div className="text-center py-12 px-6 sm:px-10 bg-white border-2 border-[var(--cw-mist,#e5e7eb)] rounded-xl shadow-xl w-full max-w-lg mx-auto">
          <div className="text-5xl text-[#16a34a] mb-4">✓</div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-3">Your capability plan has been successfully submitted.</h2>
          <p className="text-[#6B7280] mb-8">
            The SewAsset team will review your goals and module selections. We will be in contact with you shortly.
          </p>
          <Button
            className="rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold px-8"
            onClick={resetAndHome}
          >
            Return to Home
          </Button>
        </div>
      )}
          </div>
        </div>

        {showTrainingChrome && (
          <aside className="catalyst-flow-sidebar">
            <h3 className="catalyst-flow-sidebar-title">Live Review</h3>
            <TrainingLiveReview state={state} />
          </aside>
        )}
      </div>

      {!hideBottom && (
        <div className="bottom-nav">
          <button
            type="button"
            className="btn-back"
            style={{ visibility: state.step === "id" ? "hidden" : "visible" }}
            onClick={goBack}
          >
            ← Back
          </button>
          <span className="nav-hint-txt text-center text-xs sm:text-sm px-2">
            {state.step === "id" && "Tell us who you are"}
            {state.step === "aud" && "Define your audience"}
            {state.step === "cat" && "Select all that apply"}
            {state.step === "goals" && "Select your priority outcomes"}
            {state.step === "modules" && "Build your development plan"}
            {state.step === "unlock" && "Final details to unlock plan"}
          </span>
          {state.step !== "out" && (
            <button type="button" className="btn-next" onClick={goNext}>
              {nextLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
