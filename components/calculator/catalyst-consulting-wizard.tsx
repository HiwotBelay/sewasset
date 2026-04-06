"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import "@/app/catalyst-flow-theme.css";
import { useRouter } from "next/navigation";
import { ROUTE_IDENTITY_COMPLETE_KEY, peekRouteIdentityPayload, type RouteIdentityPayload } from "@/lib/route-selection-bridge";
import {
  mapRouteAuthority,
  mapRouteClientCompanySize,
  mapRouteClientIndustry,
  mapRouteCompanySize,
  mapRouteConsultPurpose,
  mapRouteIndustrySlug,
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
  CONSULTING_INTENTS,
  PILLAR_COMPS,
  PILLAR_TILES,
  SPSC_BLOCKS,
  SPSC_KEYS,
} from "@/lib/catalyst-consulting-config";

const STORAGE_KEY = "catalystConsultingWizard_v1";
const CONSULTING_FROM_ROUTE_KEY = "catalystConsultingFromRouteSelection";

export type ConsultingWizardStep =
  | "c0"
  | "cid"
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c5"
  | "c6"
  | "c7"
  | "summary"
  | "unlock"
  | "final";

const STEP_ORDER: ConsultingWizardStep[] = [
  "c0",
  "cid",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "summary",
  "unlock",
  "final",
];

/** Stepper labels (HTML prototype); excludes unlock / final */
const CONSULTING_STEP_BAR: { step: ConsultingWizardStep; label: string }[] = [
  { step: "c0", label: "Intent" },
  { step: "cid", label: "Who You Are" },
  { step: "c1", label: "Discovery" },
  { step: "c2", label: "Alignment" },
  { step: "c3", label: "Scope" },
  { step: "c4", label: "Gaps" },
  { step: "c5", label: "SPSC™" },
  { step: "c6", label: "KPI" },
  { step: "c7", label: "ROI" },
  { step: "summary", label: "Review" },
];

type CIdentity = "individual" | "business" | "consultant" | null;

const BIZ_PROBLEMS = [
  "Low Sales Conversion",
  "Quality Issues / High Errors",
  "Culture & Change",
  "Bad Customer Service",
  "Operation Efficiency",
  "Compliance",
  "Low Employee Retention",
  "Strategic Alignment",
  "Time to Market",
] as const;

const IMPACT_TYPES = [
  "Lost Revenue",
  "Reduced Efficacy",
  "Low Morale",
  "High Turnover",
  "Poor Customer Satisfaction",
  "Compliance Risk",
  "Lost of Competitive Edge",
  "Damaged External Reputation",
  "Other",
] as const;

const AFF_DEPTS = [
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
  "Other",
] as const;

const IMP_GOALS = [
  "Increase revenue",
  "Reduce cost",
  "Improve speed",
  "Improve customer satisfaction",
  "Improve quality",
  "Reduce errors",
  "Strengthen leadership",
  "Improve culture",
  "Reduce turnover",
  "Improve process efficiency",
] as const;

const STAKE_OPTIONS: { id: string; label: string; detail?: "csuite" | "dept" | "front" }[] = [
  { id: "ceo", label: "CEO" },
  { id: "csuite", label: "C-Suite", detail: "csuite" },
  { id: "deptheads", label: "Department Heads", detail: "dept" },
  { id: "frontline", label: "Frontline Managers", detail: "front" },
  { id: "hr", label: "HR / L&D" },
  { id: "employees", label: "Employees" },
  { id: "clients", label: "Clients / Customers" },
];

const URGENCY_LABELS = ["", "Mild frustration", "Minor problem", "Affecting performance", "Major problem", "Critical — urgent action needed"];

function initSpsc(): Record<string, number> {
  const o: Record<string, number> = {};
  (Object.values(SPSC_KEYS) as string[][]).flat().forEach((k) => {
    o[k] = 3;
  });
  return o;
}

interface KpiRow {
  id: string;
  name: string;
  impactArea: string;
  current: string;
  target: string;
  freq: string;
}

interface CState {
  step: ConsultingWizardStep;
  cOption: string | null;
  cIdentity: CIdentity;
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
  problem: string;
  bizIssues: string[];
  impacts: string[];
  pastFailures: string;
  urgency: number;
  coiVal: "nothing" | "worse" | "major" | null;
  whyNow: string;
  budget: string;
  stakeholders: string[];
  shCsuite: string;
  shDeptHeads: string;
  shFrontline: string;
  affDepts: string[];
  otherDept: string;
  impGoals: string[];
  success: string;
  pillars: string[];
  pillarScores: Record<string, Record<string, number>>;
  spsc: Record<string, number>;
  spscComments: Record<string, string>;
  spscTouched: boolean;
  kpiStatus: "yes" | "partial" | "no" | null;
  kpiYesRows: KpiRow[];
  kpiPartialRows: KpiRow[];
  roiTurn: string;
  roiErr: string;
  roiRev: string;
  roiTime: string;
  roiPct: number;
  unlockPhone: string;
  unlockFollowup: string;
  unlockBestTime: string;
  consent: boolean;
  leadScore: number;
  /** When true, advance c0 → c1 without showing cid (identity already captured on /route-selection). */
  skipConsultingIdentityStep: boolean;
  /** Consulting + Individual from route: hide role cards on cid, show only training-path prompt. */
  identityLockedFromRoute: boolean;
}

let kpiYesSeq = 0;
let kpiPartialSeq = 0;

const defaultCState = (): CState => ({
  step: "c0",
  cOption: null,
  cIdentity: null,
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
  problem: "",
  bizIssues: [],
  impacts: [],
  pastFailures: "",
  urgency: 0,
  coiVal: null,
  whyNow: "",
  budget: "",
  stakeholders: [],
  shCsuite: "",
  shDeptHeads: "",
  shFrontline: "",
  affDepts: [],
  otherDept: "",
  impGoals: [],
  success: "",
  pillars: [],
  pillarScores: {},
  spsc: initSpsc(),
  spscComments: {},
  spscTouched: false,
  kpiStatus: null,
  kpiYesRows: [{ id: "y0", name: "", impactArea: "", current: "", target: "", freq: "Monthly" }],
  kpiPartialRows: [{ id: "p0", name: "", impactArea: "", current: "", target: "", freq: "Monthly" }],
  roiTurn: "",
  roiErr: "",
  roiRev: "",
  roiTime: "",
  roiPct: 10,
  unlockPhone: "",
  unlockFollowup: "Phone Call",
  unlockBestTime: "",
  consent: false,
  leadScore: 0,
  skipConsultingIdentityStep: false,
  identityLockedFromRoute: false,
});

function applyConsultingFromRouteSelection(base: CState, p: RouteIdentityPayload): CState {
  const profile = p.profile;
  if (p.role === "business") {
    return {
      ...base,
      cIdentity: "business",
      skipConsultingIdentityStep: true,
      identityLockedFromRoute: false,
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
  if (p.role === "consultant") {
    return {
      ...base,
      cIdentity: "consultant",
      skipConsultingIdentityStep: true,
      identityLockedFromRoute: false,
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
  return {
    ...base,
    cIdentity: "individual",
    skipConsultingIdentityStep: false,
    identityLockedFromRoute: true,
  };
}

function stepIx(s: ConsultingWizardStep) {
  return STEP_ORDER.indexOf(s);
}

function computeSpscAvgs(spsc: Record<string, number>) {
  const avgs = { s: 3, p: 3, sy: 3, c: 3 };
  (Object.keys(SPSC_KEYS) as (keyof typeof SPSC_KEYS)[]).forEach((g) => {
    const keys = SPSC_KEYS[g];
    const vs = keys.map((k) => spsc[k] ?? 3);
    avgs[g] = Math.round((vs.reduce((a, b) => a + b, 0) / vs.length) * 10) / 10;
  });
  return avgs;
}

function dominantSpsc(avgs: { s: number; p: number; sy: number; c: number }) {
  const entries: [keyof typeof avgs, number][] = [
    ["s", avgs.s],
    ["p", avgs.p],
    ["sy", avgs.sy],
    ["c", avgs.c],
  ];
  const min = Math.min(...entries.map(([, v]) => v));
  const tied = entries.filter(([, v]) => v === min).map(([k]) => k);
  const labels: Record<string, string> = { s: "Strategy", p: "People", sy: "Systems", c: "Culture" };
  if (tied.length > 1) return { kind: "blended" as const, tied, text: tied.map((k) => labels[k]).join(" & ") };
  const k0 = tied[0]!;
  return { kind: "single" as const, key: k0, text: labels[k0] };
}

function formatStakeholders(state: CState): string {
  return state.stakeholders
    .map((id) => {
      const opt = STAKE_OPTIONS.find((o) => o.id === id);
      let t = opt?.label ?? id;
      if (id === "csuite" && state.shCsuite.trim()) t += ` (${state.shCsuite.trim()})`;
      if (id === "deptheads" && state.shDeptHeads.trim()) t += ` (${state.shDeptHeads.trim()})`;
      if (id === "frontline" && state.shFrontline.trim()) t += ` (${state.shFrontline.trim()})`;
      return t;
    })
    .join(", ");
}

function ConsultingLiveReview({
  state,
  affDeptsLabel,
  domRoot,
}: {
  state: CState;
  affDeptsLabel: string;
  domRoot: ReturnType<typeof dominantSpsc>;
}) {
  const coiText =
    state.coiVal === "nothing"
      ? "nothing significant changes"
      : state.coiVal === "worse"
        ? "the problem will get worse — we lose money, people, or time"
        : state.coiVal === "major"
          ? "the business will face major consequences"
          : "…";
  const urgencyLabel = URGENCY_LABELS[state.urgency] ?? "";

  const hasDiscovery =
    Boolean(state.problem.trim()) ||
    state.bizIssues.length > 0 ||
    state.impacts.length > 0 ||
    Boolean(state.coiVal) ||
    Boolean(state.pastFailures.trim());

  const pillarRatingItems = Object.entries(state.pillarScores).flatMap(([pillar, scores]) =>
    Object.entries(scores)
      .filter(([, val]) => Number(val) !== 3)
      .map(([sub, val]) => ({ key: `${pillar}-${sub}`, sub, val: Number(val) }))
  );

  const hasAlign =
    Boolean(state.whyNow.trim()) ||
    Boolean(state.success.trim()) ||
    Boolean(state.budget) ||
    state.stakeholders.length > 0;
  const hasScope = Boolean(affDeptsLabel) || state.impGoals.length > 0;
  const hasAny =
    hasDiscovery ||
    hasAlign ||
    hasScope ||
    state.pillars.length > 0 ||
    pillarRatingItems.length > 0 ||
    state.spscTouched ||
    Boolean(state.kpiStatus);

  return (
    <>
      {!hasAny && (
        <p className="catalyst-flow-summary-empty">Your summary will appear here as you make selections.</p>
      )}
      {hasDiscovery && (
        <div className="catalyst-flow-summary-block">
          <strong>Discovery:</strong> Core problem: <em>&quot;{state.problem.trim() || "…"}&quot;</em>
          {state.pastFailures.trim()
            ? (
                <>
                  {" "}
                  Past attempts: <em>&quot;{state.pastFailures.trim()}&quot;</em>.
                </>
              )
            : null}{" "}
          Issues: <strong>{state.bizIssues.join(", ") || "…"}</strong>. Impact:{" "}
          <strong>{state.impacts.join(", ") || "…"}</strong>. Urgency:{" "}
          <strong>{urgencyLabel || "…"}</strong>. If nothing is done: <strong>{coiText}</strong>.
        </div>
      )}
      {hasAlign && (
        <div className="catalyst-flow-summary-block">
          <strong>Alignment:</strong> Why now: <em>&quot;{state.whyNow.trim() || "…"}&quot;</em>. Success:{" "}
          <em>&quot;{state.success.trim() || "…"}&quot;</em>.{" "}
          {state.budget ? (
            <>
              Budget: <strong>{state.budget}</strong>.{" "}
            </>
          ) : null}
          Stakeholders: <strong>{formatStakeholders(state) || "…"}</strong>.
        </div>
      )}
      {hasScope && (
        <div className="catalyst-flow-summary-block">
          <strong>Scope:</strong> Departments affected: <strong>{affDeptsLabel || "…"}</strong>. Improvement goals:{" "}
          <strong>{state.impGoals.join(", ") || "…"}</strong>.
        </div>
      )}
      {state.pillars.length > 0 && (
        <div className="catalyst-flow-summary-block">
          <strong>Capability gaps:</strong> Weakest pillars:{" "}
          <strong>{state.pillars.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}</strong>.
        </div>
      )}
      {pillarRatingItems.length > 0 && (
        <div className="catalyst-flow-summary-block">
          <strong>Capability pillar ratings:</strong>
          <ul>
            {pillarRatingItems.map((row) => (
              <li key={row.key}>
                {row.sub}: {row.val}/5
              </li>
            ))}
          </ul>
        </div>
      )}
      {state.spscTouched && (
        <div className="catalyst-flow-summary-block">
          <strong>SPSC scores:</strong> Dominant root cause leans toward <strong>{domRoot.text}</strong>.
        </div>
      )}
      {state.kpiStatus && (
        <div className="catalyst-flow-summary-block">
          <strong>Data baseline:</strong>{" "}
          {state.kpiStatus === "yes" || state.kpiStatus === "partial"
            ? "You have identified specific KPIs to track this problem."
            : "No formal KPIs are currently tracking this problem."}
        </div>
      )}
    </>
  );
}

function calcRoiOutputs(turn: string, err: string, rev: string, time: string, pct: number) {
  const t = parseFloat(turn) || 0;
  const e = parseFloat(err) || 0;
  const r = parseFloat(rev) || 0;
  const tm = parseFloat(time) || 0;
  const total = t + e + r + tm;
  const cost = 100000;
  const fROI = (ben: number) => Math.round(((ben - cost) / cost) * 100) + "%";
  if (!total) {
    return { low: "—", exp: "—", high: "—", monthly: "—", total: 0 };
  }
  return {
    low: fROI(total * (pct * 0.6) / 100),
    exp: fROI(total * (pct / 100)),
    high: fROI(total * (pct * 1.4) / 100),
    monthly: Math.round(total / 12).toLocaleString() + " ETB",
    total,
  };
}

export function CatalystConsultingWizard({ onProgressChange }: { onProgressChange?: (n: number) => void }) {
  const router = useRouter();
  const [state, setState] = useState<CState>(defaultCState);
  const [toast, setToast] = useState("");
  /** Avoid overwriting sessionStorage with default state before the load effect runs (Strict Mode safe). */
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const incoming = peekRouteIdentityPayload();
      if (incoming?.route === "consulting") {
        sessionStorage.removeItem(ROUTE_IDENTITY_COMPLETE_KEY);
        const merged = applyConsultingFromRouteSelection(defaultCState(), incoming);
        setState(merged);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        sessionStorage.setItem(CONSULTING_FROM_ROUTE_KEY, "1");
        setStorageReady(true);
        return;
      }

      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<CState>;
        setState({
          ...defaultCState(),
          ...p,
          spsc: { ...initSpsc(), ...(p.spsc || {}) },
          pillarScores: p.pillarScores || {},
          spscComments: p.spscComments || {},
          kpiYesRows: p.kpiYesRows?.length ? p.kpiYesRows : defaultCState().kpiYesRows,
          kpiPartialRows: p.kpiPartialRows?.length ? p.kpiPartialRows : defaultCState().kpiPartialRows,
          skipConsultingIdentityStep: p.skipConsultingIdentityStep ?? false,
          identityLockedFromRoute: p.identityLockedFromRoute ?? false,
        });
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

  const spscAvgs = useMemo(() => computeSpscAvgs(state.spsc), [state.spsc]);
  const domRoot = useMemo(() => dominantSpsc(spscAvgs), [spscAvgs]);
  const roiOut = useMemo(
    () => calcRoiOutputs(state.roiTurn, state.roiErr, state.roiRev, state.roiTime, state.roiPct),
    [state.roiTurn, state.roiErr, state.roiRev, state.roiTime, state.roiPct]
  );

  const thinBarPct = useMemo(() => {
    if (state.step === "unlock" || state.step === "final") return 100;
    const i = CONSULTING_STEP_BAR.findIndex((x) => x.step === state.step);
    if (i < 0) return 0;
    return Math.round((i / (CONSULTING_STEP_BAR.length - 1)) * 100);
  }, [state.step]);
  useEffect(() => onProgressChange?.(thinBarPct), [thinBarPct, onProgressChange]);

  const showConsultingChrome = state.step !== "unlock" && state.step !== "final";
  const showConsultingSidebar =
    showConsultingChrome &&
    !(state.step === "cid" && state.cIdentity === "individual" && !state.identityLockedFromRoute);

  const affDeptsLabel = useMemo(() => {
    let d = state.affDepts.join(", ");
    if (state.affDepts.includes("Other") && state.otherDept.trim()) {
      d = d.replace("Other", `Other (${state.otherDept.trim()})`);
    }
    return d;
  }, [state.affDepts, state.otherDept]);

  const validate = (step: ConsultingWizardStep): boolean => {
    if (step === "c0") {
      if (!state.cOption) {
        showToast("Select your diagnostic intent.");
        return false;
      }
      return true;
    }
    if (step === "cid") {
      if (!state.cIdentity) {
        showToast("Select who you are.");
        return false;
      }
      if (state.cIdentity === "individual") return false;
      if (state.cIdentity === "business") {
        if (!state.business.fullName.trim() || !state.business.workEmail.trim()) {
          showToast("Name and Work Email are required.");
          return false;
        }
        return true;
      }
      if (state.cIdentity === "consultant") {
        const c = state.consultant;
        if (!c.fullName.trim() || !c.firm.trim() || !c.email.trim() || !c.phone.trim()) {
          showToast("Please fill in all required contact details.");
          return false;
        }
        return true;
      }
      return true;
    }
    if (step === "c1") {
      if (!state.problem.trim()) {
        showToast("Describe the business problem.");
        return false;
      }
      if (!state.coiVal) {
        showToast("Select the consequence of inaction.");
        return false;
      }
      return true;
    }
    if (step === "c2") {
      if (!state.whyNow.trim()) {
        showToast("Please answer why now is the right time.");
        return false;
      }
      if (!state.budget) {
        showToast("Please select a budget status.");
        return false;
      }
      if (state.stakeholders.length === 0) {
        showToast("Please select at least one key stakeholder.");
        return false;
      }
      return true;
    }
    if (step === "c3") {
      if (state.affDepts.length === 0) {
        showToast("Select at least one affected department.");
        return false;
      }
      if (state.impGoals.length === 0) {
        showToast("Select at least one improvement goal.");
        return false;
      }
      if (!state.success.trim()) {
        showToast("Describe what success looks like.");
        return false;
      }
      return true;
    }
    if (step === "c4") {
      if (state.pillars.length === 0) {
        showToast("Select at least one capability pillar.");
        return false;
      }
      return true;
    }
    if (step === "c5") {
      if (!state.spscTouched) {
        showToast("Please adjust the sliders to reflect your organization.");
        return false;
      }
      return true;
    }
    if (step === "unlock") {
      if (!state.unlockPhone.trim()) {
        showToast("Phone number is required to receive the report.");
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

  const computeLeadScore = () => {
    let score = 0;
    if (state.business.companySize === "1000+") score += 20;
    else if (state.business.companySize === "501–1000") score += 15;
    if (state.urgency >= 4) score += 15;
    if (state.coiVal === "major") score += 20;
    else if (state.coiVal === "worse") score += 10;
    return score;
  };

  const submitPayload = async () => {
    const leadScore = computeLeadScore();
    setState((s) => ({ ...s, leadScore }));
    const payload = {
      type: "consulting_wizard_v1" as const,
      data: {
        ...state,
        leadScore,
        spscAvgs,
        dominantRoot: domRoot,
        roiComputed: roiOut,
      },
    };
    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* non-blocking */
    }
    showToast("Packaging diagnostic data...");
  };

  const goNext = () => {
    if (state.step === "cid" && state.cIdentity === "individual") return;
    if (!validate(state.step)) return;

    if (state.step === "unlock") {
      void submitPayload();
    }

    const i = stepIx(state.step);
    if (i < STEP_ORDER.length - 1) {
      let nextStep = STEP_ORDER[i + 1]!;
      if (state.skipConsultingIdentityStep && state.step === "c0" && nextStep === "cid") {
        nextStep = "c1";
      }
      setState((s) => ({ ...s, step: nextStep }));
    }
  };

  const goBack = () => {
    const i = stepIx(state.step);
    if (i <= 0) return;
    let prevStep = STEP_ORDER[i - 1]!;
    if (state.skipConsultingIdentityStep && state.step === "c1" && prevStep === "cid") {
      prevStep = "c0";
    }
    setState((s) => ({ ...s, step: prevStep }));
  };

  const toggleIn = (key: "bizIssues" | "impacts" | "affDepts" | "impGoals", val: string) => {
    setState((s) => {
      const cur = s[key];
      const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
      return { ...s, [key]: next };
    });
  };

  const toggleStakeholder = (id: string) => {
    setState((s) => {
      const next = s.stakeholders.includes(id) ? s.stakeholders.filter((x) => x !== id) : [...s.stakeholders, id];
      return { ...s, stakeholders: next };
    });
  };

  const togglePillar = (id: string) => {
    setState((s) => {
      const has = s.pillars.includes(id);
      const pillars = has ? s.pillars.filter((x) => x !== id) : [...s.pillars, id];
      const pillarScores = { ...s.pillarScores };
      if (!has) {
        const comps = PILLAR_COMPS[id] || [];
        pillarScores[id] = {};
        comps.forEach((c) => {
          pillarScores[id][c] = 3;
        });
      } else {
        delete pillarScores[id];
      }
      return { ...s, pillars, pillarScores };
    });
  };

  const setPillarComp = (pillar: string, comp: string, v: number) => {
    setState((s) => ({
      ...s,
      pillarScores: {
        ...s.pillarScores,
        [pillar]: { ...(s.pillarScores[pillar] || {}), [comp]: v },
      },
    }));
  };

  const setSpsc = (key: string, val: number) => {
    setState((s) => ({ ...s, spsc: { ...s.spsc, [key]: val }, spscTouched: true }));
  };

  const setSpscComment = (key: string, text: string) => {
    setState((s) => ({ ...s, spscComments: { ...s.spscComments, [key]: text } }));
  };

  const addKpiRow = (mode: "yes" | "partial") => {
    const id = mode === "yes" ? `y${++kpiYesSeq}` : `p${++kpiPartialSeq}`;
    const row: KpiRow = { id, name: "", impactArea: "", current: "", target: "", freq: "Monthly" };
    setState((s) =>
      mode === "yes"
        ? { ...s, kpiYesRows: [...s.kpiYesRows, row] }
        : { ...s, kpiPartialRows: [...s.kpiPartialRows, row] }
    );
  };

  const updateKpiRow = (mode: "yes" | "partial", id: string, field: keyof KpiRow, value: string) => {
    setState((s) => {
      const key = mode === "yes" ? "kpiYesRows" : "kpiPartialRows";
      const rows = s[key].map((r) => (r.id === id ? { ...r, [field]: value } : r));
      return { ...s, [key]: rows };
    });
  };

  const resetAndHome = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(CONSULTING_FROM_ROUTE_KEY);
    setState(defaultCState());
    window.location.href = "/";
  };

  const impactsDisplay = state.impacts.length ? state.impacts.join(", ") : "None selected in Discovery stage.";
  const hideBottom = state.step === "final" || state.step === "summary";
  const hideNextIndividual = state.step === "cid" && state.cIdentity === "individual";

  const cardBase = "relative text-left cw-pick-card cursor-pointer";
  const cardSel = "is-selected";

  const nextLabel =
    state.step === "c7"
      ? "Continue →"
      : state.step === "summary"
        ? "Proceed to Final Step →"
        : state.step === "unlock"
          ? "Submit →"
          : "Continue →";

  const stepLabel = ((): string => {
    const m: Record<ConsultingWizardStep, string> = {
      c0: "Select your diagnostic intent",
      cid: "Tell us who you are",
      c1: "Be specific for accurate results",
      c2: "Define success clearly",
      c3: "Define the scope",
      c4: "Select all affected pillars",
      c5: "Rate all four foundations honestly",
      c6: "Choose KPI status",
      c7: "Enter costs for ROI calculation",
      summary: "Review your inputs before submitting",
      unlock: "Final details to unlock report",
      final: "",
    };
    return m[state.step];
  })();

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

      {showConsultingChrome && (
        <div className="catalyst-flow-step-progress">
          <div className="catalyst-flow-step-track">
            {CONSULTING_STEP_BAR.map((item, si) => {
              const rawIdx = CONSULTING_STEP_BAR.findIndex((x) => x.step === state.step);
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
                  {si < CONSULTING_STEP_BAR.length - 1 && (
                    <div className={`catalyst-flow-step-line${isDone ? " is-done" : ""}`} />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      )}

      <div className="catalyst-flow-layout">
        <div className="catalyst-flow-main">
          <div className="max-w-3xl mx-auto px-4 py-6 pb-32">
      {/* c0 */}
      {state.step === "c0" && (
        <div className="space-y-6">
          <div className="cw-step-eyebrow">Capability Transformation · Step 1 of 12</div>
          <h2 className="cw-step-title">
            What strategic challenge do you want to <em>diagnose?</em>
          </h2>
          <p className="cw-step-lead">Select your primary purpose. The SPSC™ model will be tailored to your situation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONSULTING_INTENTS.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setState((s) => ({ ...s, cOption: it.id }))}
                className={`${cardBase} ${state.cOption === it.id ? cardSel : ""}`}
              >
                <span className="text-2xl block mb-2">{it.icon}</span>
                <div className="font-bold text-[#0f172a] mb-1">{it.title}</div>
                <div className="text-xs text-[#6B7280] leading-snug">{it.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* cid */}
      {state.step === "cid" && (
        <div className="space-y-6">
          <div className="cw-step-eyebrow">Capability Transformation · Step 2 of 12</div>
          {state.identityLockedFromRoute ? (
            <>
              <h2 className="cw-step-title">
                Your <em>next step</em>
              </h2>
              <p className="text-sm text-[#6B7280]">
                You already chose <strong>Individual</strong> when you started. The deep diagnostic is designed for teams and organizations.
              </p>
            </>
          ) : (
            <h2 className="cw-step-title">
              Tell us <em>who you are</em>
            </h2>
          )}
          {!state.identityLockedFromRoute && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { id: "individual" as const, icon: "👤", name: "Individual", desc: "Personal or academic use of the diagnostic framework." },
                  { id: "business" as const, icon: "🏢", name: "Business / Organization", desc: "I represent a company and am authorized or influential in this decision." },
                  { id: "consultant" as const, icon: "🤝", name: "Consultant / Partner", desc: "Building a capability transformation proposal for a client." },
                ] as const
              ).map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, cIdentity: x.id }))}
                  className={`${cardBase} ${state.cIdentity === x.id ? cardSel : ""}`}
                >
                  <span className="text-2xl block mb-2">{x.icon}</span>
                  <div className="font-bold text-sm text-[#0f172a] mb-1">{x.name}</div>
                  <div className="text-[11px] text-[#6B7280] leading-snug">{x.desc}</div>
                </button>
              ))}
            </div>
          )}

          {state.cIdentity === "individual" && (
            <div className="rounded-md border-2 border-[var(--cw-accent)] bg-[var(--cw-accent-soft)] p-8 text-center space-y-4">
              <div className="text-4xl">👋</div>
              <h3 className="font-bold text-lg text-[#0f172a]">Let&apos;s build your personal training plan!</h3>
              <p className="text-sm text-[#374151] max-w-md mx-auto">
                The consulting diagnostic requires organizational KPI and team performance data. For personal career development, our{" "}
                <strong>Capability Development</strong> path is designed for you.
              </p>
              <Button
                className="rounded-full bg-[var(--cw-accent)] hover:bg-[var(--cw-accent-hover)] text-[var(--cw-on-accent)] font-bold px-8"
                onClick={() => router.push("/training")}
              >
                Switch to Training Path →
              </Button>
            </div>
          )}

          {state.cIdentity === "business" && (
            <div className="space-y-3 border rounded-md p-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    className="mt-1"
                    value={state.business.fullName}
                    onChange={(e) => setState((s) => ({ ...s, business: { ...s.business, fullName: e.target.value } }))}
                  />
                </div>
                <div>
                  <Label>Work Email *</Label>
                  <Input
                    type="email"
                    className="mt-1"
                    value={state.business.workEmail}
                    onChange={(e) => setState((s) => ({ ...s, business: { ...s.business, workEmail: e.target.value } }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    className="mt-1"
                    value={state.business.jobTitle}
                    onChange={(e) => setState((s) => ({ ...s, business: { ...s.business, jobTitle: e.target.value } }))}
                  />
                </div>
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    className="mt-1"
                    value={state.business.companyName}
                    onChange={(e) => setState((s) => ({ ...s, business: { ...s.business, companyName: e.target.value } }))}
                  />
                </div>
                <div>
                  <Label>Authority Level</Label>
                  <Select
                    value={state.business.authorityLevel}
                    onValueChange={(v) => setState((s) => ({ ...s, business: { ...s.business, authorityLevel: v } }))}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Industry</Label>
                  <Select
                    value={state.business.industry || undefined}
                    onValueChange={(v) => setState((s) => ({ ...s, business: { ...s.business, industry: v } }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["Manufacturing", "Financial Services", "Telecom & Tech", "Retail", "Healthcare", "Government", "Logistics", "NGO", "Other"].map(
                        (x) => (
                          <SelectItem key={x} value={x}>
                            {x}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Company Size</Label>
                  <Select
                    value={state.business.companySize || undefined}
                    onValueChange={(v) => setState((s) => ({ ...s, business: { ...s.business, companySize: v } }))}
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

          {state.cIdentity === "consultant" && (
            <div className="space-y-3 border rounded-md p-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Your Full Name *</Label>
                  <Input
                    className="mt-1"
                    value={state.consultant.fullName}
                    onChange={(e) => setState((s) => ({ ...s, consultant: { ...s.consultant, fullName: e.target.value } }))}
                  />
                </div>
                <div>
                  <Label>Firm Name *</Label>
                  <Input
                    className="mt-1"
                    value={state.consultant.firm}
                    onChange={(e) => setState((s) => ({ ...s, consultant: { ...s.consultant, firm: e.target.value } }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Work Email *</Label>
                  <Input
                    type="email"
                    className="mt-1"
                    value={state.consultant.email}
                    onChange={(e) => setState((s) => ({ ...s, consultant: { ...s.consultant, email: e.target.value } }))}
                  />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    className="mt-1"
                    value={state.consultant.phone}
                    onChange={(e) => setState((s) => ({ ...s, consultant: { ...s.consultant, phone: e.target.value } }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Purpose</Label>
                  <Select
                    value={state.consultant.purpose || undefined}
                    onValueChange={(v) => setState((s) => ({ ...s, consultant: { ...s.consultant, purpose: v } }))}
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
                  <Label>Country located?</Label>
                  <Input
                    className="mt-1"
                    value={state.consultant.country}
                    onChange={(e) => setState((s) => ({ ...s, consultant: { ...s.consultant, country: e.target.value } }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Client Industry</Label>
                  <Select
                    value={state.consultant.clientIndustry || undefined}
                    onValueChange={(v) => setState((s) => ({ ...s, consultant: { ...s.consultant, clientIndustry: v } }))}
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
                    value={state.consultant.clientCompanySize || undefined}
                    onValueChange={(v) => setState((s) => ({ ...s, consultant: { ...s.consultant, clientCompanySize: v } }))}
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
              <div className="flex items-start gap-2 bg-[var(--cw-accent-soft)] p-3 rounded">
                <Checkbox
                  id="cnda"
                  checked={state.consultant.nda}
                  onCheckedChange={(c) => setState((s) => ({ ...s, consultant: { ...s.consultant, nda: !!c } }))}
                />
                <Label htmlFor="cnda" className="text-xs font-normal">
                  I agree not to replicate SewAsset&apos;s proprietary frameworks, catalog structures, or SPSC™ methodology. *
                </Label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* c1 Discovery */}
      {state.step === "c1" && (
        <div className="space-y-5">
          <div className="cw-step-eyebrow">Capability Transformation · Stage 1 — Discovery</div>
          <h2 className="cw-step-title text-2xl">
            What is the <em>real problem?</em>
          </h2>
          <div>
            <Label>Describe the business problem *</Label>
            <Textarea className="mt-1 min-h-[90px]" value={state.problem} onChange={(e) => setState((s) => ({ ...s, problem: e.target.value }))} />
          </div>
          <div>
            <Label>Select the core issue(s)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {BIZ_PROBLEMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleIn("bizIssues", t)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border-2 transition-all ${state.bizIssues.includes(t) ? "bg-[var(--cw-accent)] text-[var(--cw-on-accent)] border-[var(--cw-accent)] shadow-sm" : "bg-white border-[#e5e7eb] text-[#0f172a] hover:border-[var(--cw-accent-border-40)]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>The impact of this problem</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {IMPACT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleIn("impacts", t)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border-2 transition-all ${state.impacts.includes(t) ? "bg-[var(--cw-accent)] text-[var(--cw-on-accent)] border-[var(--cw-accent)] shadow-sm" : "bg-white border-[#e5e7eb] text-[#0f172a] hover:border-[var(--cw-accent-border-40)]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>What have you already tried to fix this?</Label>
            <Textarea className="mt-1" value={state.pastFailures} onChange={(e) => setState((s) => ({ ...s, pastFailures: e.target.value }))} />
          </div>
          <div>
            <Label>How serious is this?</Label>
            <input
              type="range"
              min={0}
              max={5}
              value={state.urgency}
              onChange={(e) => setState((s) => ({ ...s, urgency: parseInt(e.target.value, 10) }))}
              className="w-full accent-[var(--cw-accent)]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7280]">
              <span>Mild</span>
              <span className="font-bold text-[var(--cw-accent)]">{URGENCY_LABELS[state.urgency]}</span>
              <span>Critical</span>
            </div>
          </div>
          <div>
            <Label>What happens if you do nothing? *</Label>
            <div className="grid gap-2 mt-2">
              {(
                [
                  { v: "nothing" as const, t: "Nothing significant changes" },
                  { v: "worse" as const, t: "Problem will get worse — we lose money, people, or time" },
                  { v: "major" as const, t: "The business will face major consequences" },
                ] as const
              ).map((x) => (
                <button
                  key={x.v}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, coiVal: x.v }))}
                  className={`${cardBase} p-3 text-sm font-bold ${state.coiVal === x.v ? cardSel : ""}`}
                >
                  {x.t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* c2 */}
      {state.step === "c2" && (
        <div className="space-y-5">
          <div className="cw-step-eyebrow">Capability Transformation · Stage 2 — Alignment</div>
          <h2 className="cw-step-title text-2xl">
            Why now, and <em>who owns this?</em>
          </h2>
          <div>
            <Label>Why is now the right time? *</Label>
            <Textarea className="mt-1" value={state.whyNow} onChange={(e) => setState((s) => ({ ...s, whyNow: e.target.value }))} />
          </div>
          <div>
            <Label>Has a budget been allocated? *</Label>
            <Select value={state.budget || undefined} onValueChange={(v) => setState((s) => ({ ...s, budget: v }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes, fully approved">Yes, fully approved</SelectItem>
                <SelectItem value="We are building the business case now">We are building the business case now</SelectItem>
                <SelectItem value="No, just exploring">No, just exploring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Key stakeholders *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {STAKE_OPTIONS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => toggleStakeholder(st.id)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border ${state.stakeholders.includes(st.id) ? "bg-[var(--cw-accent)] text-[var(--cw-on-accent)] border-[var(--cw-accent)]" : "bg-white border-[#e5e7eb]"}`}
                >
                  {st.label}
                </button>
              ))}
            </div>
            {(state.stakeholders.includes("csuite") || state.stakeholders.includes("deptheads") || state.stakeholders.includes("frontline")) && (
              <div className="mt-3 space-y-2">
                {state.stakeholders.includes("csuite") && (
                  <Input
                    placeholder="Which C-Suite? (e.g. CFO)"
                    value={state.shCsuite}
                    onChange={(e) => setState((s) => ({ ...s, shCsuite: e.target.value }))}
                    className="bg-[var(--cw-accent-soft)]"
                  />
                )}
                {state.stakeholders.includes("deptheads") && (
                  <Input
                    placeholder="Which Department Heads?"
                    value={state.shDeptHeads}
                    onChange={(e) => setState((s) => ({ ...s, shDeptHeads: e.target.value }))}
                    className="bg-[var(--cw-accent-soft)]"
                  />
                )}
                {state.stakeholders.includes("frontline") && (
                  <Input
                    placeholder="Which Frontline Managers?"
                    value={state.shFrontline}
                    onChange={(e) => setState((s) => ({ ...s, shFrontline: e.target.value }))}
                    className="bg-[var(--cw-accent-soft)]"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* c3 */}
      {state.step === "c3" && (
        <div className="space-y-5">
          <div className="cw-step-eyebrow">Capability Transformation · Stage 3 — Scope</div>
          <h2 className="cw-step-title text-2xl">
            Departments & <em>improvement goals</em>
          </h2>
          <div>
            <Label>Which departments are affected? *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {AFF_DEPTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleIn("affDepts", d)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border ${state.affDepts.includes(d) ? "bg-[var(--cw-accent)] text-[var(--cw-on-accent)] border-[var(--cw-accent)]" : "bg-white border-[#e5e7eb]"}`}
                >
                  {d}
                </button>
              ))}
            </div>
            {state.affDepts.includes("Other") && (
              <Input
                className="mt-2 bg-[var(--cw-accent-soft)]"
                placeholder="Please specify..."
                value={state.otherDept}
                onChange={(e) => setState((s) => ({ ...s, otherDept: e.target.value }))}
              />
            )}
          </div>
          <div>
            <Label>Top improvement goals *</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {IMP_GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleIn("impGoals", g)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border ${state.impGoals.includes(g) ? "bg-[var(--cw-accent)] text-[var(--cw-on-accent)] border-[var(--cw-accent)]" : "bg-white border-[#e5e7eb]"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>What does success look like? *</Label>
            <Textarea className="mt-1" value={state.success} onChange={(e) => setState((s) => ({ ...s, success: e.target.value }))} />
          </div>
        </div>
      )}

      {/* c4 pillars */}
      {state.step === "c4" && (
        <div className="space-y-5">
          <div className="cw-step-eyebrow">Capability Transformation · Stage 4 — Capability Gaps</div>
          <h2 className="cw-step-title text-2xl">
            Which capability pillars are <em>weakest?</em>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PILLAR_TILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePillar(p.id)}
                className={`${cardBase} p-3 text-center ${state.pillars.includes(p.id) ? cardSel : ""}`}
              >
                <span className="text-xl block">{p.icon}</span>
                <div className="font-bold text-xs mt-1">{p.name}</div>
                <div className="text-[10px] text-[#6B7280] leading-tight">{p.tip}</div>
              </button>
            ))}
          </div>
          {state.pillars.map((pid) => {
            const comps = PILLAR_COMPS[pid] || [];
            const scores = state.pillarScores[pid] || {};
            return (
              <div key={pid} className="border rounded-md p-4 bg-white space-y-2">
                <div className="font-bold text-[#0f172a] capitalize">{pid} competencies</div>
                {comps.map((c) => (
                  <div key={c}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{c}</span>
                      <span className="font-bold text-[var(--cw-accent)]">{scores[c] ?? 3}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={scores[c] ?? 3}
                      onChange={(e) => setPillarComp(pid, c, parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--cw-accent)]"
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* c5 SPSC */}
      {state.step === "c5" && (
        <div className="space-y-5">
          <div className="cw-step-eyebrow">Capability Transformation · Stage 5 — SPSC™</div>
          <h2 className="cw-step-title text-2xl">
            Rate your organization&apos;s <em>four foundations</em>
          </h2>
          <p className="text-sm text-[#6B7280]">1 = very weak, 5 = very strong. Moving any slider marks this section complete.</p>
          {SPSC_BLOCKS.map((block) => (
            <div key={block.id} className="border rounded-md p-4 bg-white space-y-3">
              <div className="font-bold text-[#0f172a]">
                {block.emoji} {block.title}
              </div>
              <div className="text-xs text-[#6B7280] border-b pb-2">{block.hint}</div>
              {block.rows.map((row) => {
                const v = state.spsc[row.key] ?? 3;
                const low = v < 3;
                return (
                  <div key={row.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{row.label}</span>
                      <span className="font-bold text-[var(--cw-accent)]">{v}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={v}
                      onChange={(e) => setSpsc(row.key, parseInt(e.target.value, 10))}
                      className="w-full accent-[var(--cw-accent)]"
                    />
                    {row.desc && <p className="text-[11px] text-[#6B7280] italic mt-1">{row.desc}</p>}
                    {low && (
                      <Textarea
                        className="mt-2 text-sm min-h-[50px]"
                        placeholder="Describe briefly..."
                        value={state.spscComments[row.key] || ""}
                        onChange={(e) => setSpscComment(row.key, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="border rounded-md p-4 bg-[#FAFAFA]">
            <div className="text-[10px] font-bold uppercase text-[var(--cw-accent)] mb-2">SPSC™ Score Summary</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  ["s", "S", "Strategy", spscAvgs.s],
                  ["p", "P", "People", spscAvgs.p],
                  ["sy", "S", "Systems", spscAvgs.sy],
                  ["c", "C", "Culture", spscAvgs.c],
                ] as const
              ).map(([key, letter, name, val]) => {
                const isDom =
                  domRoot.kind === "single"
                    ? domRoot.key === key
                    : domRoot.kind === "blended" && domRoot.tied.includes(key as "s" | "p" | "sy" | "c");
                return (
                  <div
                    key={key}
                    className={`text-center p-3 rounded border ${isDom ? "border-red-400 bg-red-50" : "border-[#e5e7eb]"}`}
                  >
                    <div className="text-xl font-black text-[var(--cw-accent)]">{letter}</div>
                    <div className="text-[10px] uppercase text-[#6B7280]">{name}</div>
                    <div className="font-black text-lg text-[#0f172a]">{val}</div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs mt-3 text-[#374151]">
              Dominant root cause leans toward: <strong>{domRoot.text}</strong>
            </p>
          </div>
        </div>
      )}

      {/* c6 KPI */}
      {state.step === "c6" && (
        <div className="space-y-5">
          <div className="cw-step-eyebrow">Capability Transformation · Stage 6 — KPI Baseline</div>
          <h2 className="cw-step-title text-2xl">
            Do you measure <em>this problem?</em>
          </h2>
          <div className="text-sm bg-[#F3F4F6] border-l-4 border-[var(--cw-accent)] p-3 rounded">
            <strong>Selected Impacts:</strong> {impactsDisplay}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(
              [
                { m: "yes" as const, icon: "✅", l: "Yes, we have KPIs" },
                { m: "partial" as const, icon: "🔶", l: "Partially" },
                { m: "no" as const, icon: "❌", l: "Not yet" },
              ] as const
            ).map((x) => (
              <button
                key={x.m}
                type="button"
                onClick={() => setState((s) => ({ ...s, kpiStatus: x.m }))}
                className={`relative cw-pick-card p-4 text-center cursor-pointer ${state.kpiStatus === x.m ? cardSel : ""}`}
              >
                <span className="text-2xl block mb-1">{x.icon}</span>
                <span className="text-sm font-bold">{x.l}</span>
              </button>
            ))}
          </div>
          {state.kpiStatus === "yes" && (
            <div className="space-y-3">
              {state.kpiYesRows.map((row, idx) => (
                <div key={row.id} className="border rounded p-3 space-y-2 bg-white">
                  <div className="text-xs font-bold uppercase text-[var(--cw-accent)]">KPI Data #{idx + 1}</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">KPI Name</Label>
                      <Input value={row.name} onChange={(e) => updateKpiRow("yes", row.id, "name", e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Impact Area</Label>
                      <Input value={row.impactArea} onChange={(e) => updateKpiRow("yes", row.id, "impactArea", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Current Value</Label>
                      <Input value={row.current} onChange={(e) => updateKpiRow("yes", row.id, "current", e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Target Value</Label>
                      <Input value={row.target} onChange={(e) => updateKpiRow("yes", row.id, "target", e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Frequency</Label>
                      <Select value={row.freq} onValueChange={(v) => updateKpiRow("yes", row.id, "freq", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Daily", "Weekly", "Monthly", "Quarterly"].map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="text-sm" onClick={() => addKpiRow("yes")}>
                + Add Another KPI
              </Button>
            </div>
          )}
          {state.kpiStatus === "partial" && (
            <div className="space-y-3">
              {state.kpiPartialRows.map((row, idx) => (
                <div key={row.id} className="border rounded p-3 space-y-2 bg-white">
                  <div className="text-xs font-bold uppercase text-[var(--cw-accent)]">Estimated KPI #{idx + 1}</div>
                  <div className="grid sm:grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Estimated Current</Label>
                      <Input value={row.current} onChange={(e) => updateKpiRow("partial", row.id, "current", e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Estimated Target</Label>
                      <Input value={row.target} onChange={(e) => updateKpiRow("partial", row.id, "target", e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Frequency</Label>
                      <Select value={row.freq} onValueChange={(v) => updateKpiRow("partial", row.id, "freq", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Daily", "Weekly", "Monthly", "Quarterly"].map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="text-sm" onClick={() => addKpiRow("partial")}>
                + Add Another KPI
              </Button>
            </div>
          )}
        </div>
      )}

      {/* c7 ROI */}
      {state.step === "c7" && (
        <div className="space-y-5">
          <div className="cw-step-eyebrow">Capability Transformation · Stage 7 — ROI</div>
          <h2 className="cw-step-title text-2xl">
            Quantify the <em>cost of doing nothing</em>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Turnover cost (annual)</Label>
              <Input
                type="number"
                className="mt-1"
                value={state.roiTurn}
                onChange={(e) => setState((s) => ({ ...s, roiTurn: e.target.value }))}
              />
            </div>
            <div>
              <Label>Error / rework cost (annual)</Label>
              <Input
                type="number"
                className="mt-1"
                value={state.roiErr}
                onChange={(e) => setState((s) => ({ ...s, roiErr: e.target.value }))}
              />
            </div>
            <div>
              <Label>Lost revenue / missed targets</Label>
              <Input
                type="number"
                className="mt-1"
                value={state.roiRev}
                onChange={(e) => setState((s) => ({ ...s, roiRev: e.target.value }))}
              />
            </div>
            <div>
              <Label>Time waste cost (annual)</Label>
              <Input
                type="number"
                className="mt-1"
                value={state.roiTime}
                onChange={(e) => setState((s) => ({ ...s, roiTime: e.target.value }))}
              />
            </div>
          </div>
          <div className="rounded-lg bg-[#0f172a] text-white p-6 space-y-4">
            <div className="font-bold text-[var(--cw-accent)] text-lg">ROI Simulator</div>
            <p className="text-sm text-white/70">
              {state.kpiYesRows.some((r) => r.target) || state.kpiPartialRows.some((r) => r.target)
                ? `Adjust expected improvement — your Stage 6 targets help frame this.`
                : "Adjust expected improvement to see projected return across three scenarios."}
            </p>
            <div>
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>Expected improvement %</span>
                <span className="font-bold text-[var(--cw-accent)]">{state.roiPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={state.roiPct}
                onChange={(e) => setState((s) => ({ ...s, roiPct: parseInt(e.target.value, 10) }))}
                className="w-full accent-[var(--cw-accent)]"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 border border-white/10 rounded p-3">
                <div className="text-[10px] uppercase text-white/50">Conservative</div>
                <div className="text-xl font-black text-[var(--cw-accent)]">{roiOut.low}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded p-3">
                <div className="text-[10px] uppercase text-white/50">Expected</div>
                <div className="text-xl font-black text-[var(--cw-accent)]">{roiOut.exp}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded p-3">
                <div className="text-[10px] uppercase text-white/50">Optimistic</div>
                <div className="text-xl font-black text-[var(--cw-accent)]">{roiOut.high}</div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-red-950/30 border border-red-400/30 rounded p-3">
              <span className="text-sm">Monthly Cost of Inaction</span>
              <span className="text-lg font-black text-red-300">{roiOut.monthly}</span>
            </div>
          </div>
        </div>
      )}

      {/* summary */}
      {state.step === "summary" && (
        <div className="space-y-5 border rounded-lg p-6 bg-white">
          <div className="cw-step-eyebrow">Capability Transformation · Review</div>
          <h2 className="cw-step-title text-2xl">
            Let&apos;s review your <em>diagnostic inputs</em>
          </h2>
          <div className="space-y-4 text-sm border-t pt-4">
            <div>
              <div className="text-xs font-bold uppercase text-[var(--cw-accent)] mb-2">Stage 1 &amp; 2</div>
              <p>
                <strong>Core Problem:</strong> {state.problem || "—"}
              </p>
              <p className="mt-2">
                <strong>Definition of Success:</strong> {state.success || "—"}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-[var(--cw-accent)] mb-2">Stage 3 &amp; 4</div>
              <p>
                <strong>Affected Departments:</strong> {affDeptsLabel || "—"}
              </p>
              <p className="mt-2">
                <strong>Improvement Goals:</strong> {state.impGoals.join(", ") || "—"}
              </p>
              <p className="mt-2">
                <strong>Weakest Pillars:</strong> {state.pillars.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ") || "—"}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-[var(--cw-accent)] mb-2">SPSC™</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="border rounded p-2">
                  <div className="font-black text-[var(--cw-accent)]">S</div>
                  <div className="font-bold">{spscAvgs.s}</div>
                </div>
                <div className="border rounded p-2">
                  <div className="font-black text-[var(--cw-accent)]">P</div>
                  <div className="font-bold">{spscAvgs.p}</div>
                </div>
                <div className="border rounded p-2">
                  <div className="font-black text-[var(--cw-accent)]">S</div>
                  <div className="font-bold">{spscAvgs.sy}</div>
                </div>
                <div className="border rounded p-2">
                  <div className="font-black text-[var(--cw-accent)]">C</div>
                  <div className="font-bold">{spscAvgs.c}</div>
                </div>
              </div>
              <p className="mt-2 text-xs text-[#6B7280]">Dominant root: {domRoot.text}</p>
            </div>
          </div>
          <Button
            className="w-full rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold py-6 text-base shadow-md"
            onClick={goNext}
          >
            Proceed to Final Step →
          </Button>
        </div>
      )}

      {/* unlock */}
      {state.step === "unlock" && (
        <div className="space-y-6">
          <div className="cw-step-eyebrow">Capability Transformation · Final Step</div>
          <h2 className="cw-step-title">
            Where should we send <em>your report?</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--cw-accent-soft)] p-4 rounded-md border-l-4 border-[var(--cw-accent)] text-sm">
              <h3 className="font-bold mb-2 text-[#0f172a]">You are 1 step away from your Transformation Blueprint.</h3>
              <ul className="list-disc ml-5 space-y-1 text-[#374151]">
                <li>SPSC Root Cause Diagnosis</li>
                <li>7-Pillar Capability Gap Map</li>
                <li>Custom ROI &amp; Cost of Inaction Data</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Phone Number *</Label>
                <Input
                  className="mt-1"
                  value={state.unlockPhone}
                  onChange={(e) => setState((s) => ({ ...s, unlockPhone: e.target.value }))}
                  placeholder="+251..."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Preferred follow-up</Label>
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
                    className="mt-1"
                    value={state.unlockBestTime}
                    onChange={(e) => setState((s) => ({ ...s, unlockBestTime: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="cconsent" checked={state.consent} onCheckedChange={(c) => setState((s) => ({ ...s, consent: !!c }))} />
                <Label htmlFor="cconsent" className="text-xs font-normal leading-snug">
                  I agree to the SewAsset Privacy Policy and consent to my data being processed to generate this report. *
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* final */}
      {state.step === "final" && (
        <div className="text-center py-12 px-6 bg-white border-2 border-[var(--cw-accent-soft)] rounded-lg shadow-lg max-w-lg mx-auto">
          <div className="text-5xl text-green-600 mb-4">✓</div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-3">Your diagnostic has been successfully submitted.</h2>
          <p className="text-[#6B7280] mb-8">
            The SewAsset team will review your inputs and build a tailored solution pathway. We will be in contact shortly.
          </p>
          <Button className="rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold px-8" onClick={resetAndHome}>
            Return to Home
          </Button>
        </div>
      )}
          </div>
        </div>

        {showConsultingSidebar && (
          <aside className="catalyst-flow-sidebar">
            <h3 className="catalyst-flow-sidebar-title">Live Review</h3>
            <ConsultingLiveReview state={state} affDeptsLabel={affDeptsLabel} domRoot={domRoot} />
          </aside>
        )}
      </div>

      {!hideBottom && (
        <div className="bottom-nav">
          <button
            type="button"
            className="btn-back"
            style={{ visibility: state.step === "c0" ? "hidden" : "visible" }}
            onClick={goBack}
          >
            ← Back
          </button>
          <span className="nav-hint-txt text-center text-xs sm:text-sm px-2">{stepLabel}</span>
          {!hideNextIndividual && state.step !== "summary" && (
            <button type="button" className="btn-next" onClick={goNext}>
              {nextLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
