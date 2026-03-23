"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import "../catalyst-tool.css";
import { Playfair_Display, Syne } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"] });
const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function RouteSelectionPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // s0 = path gate, id = identity gate
  const [stage, setStage] = useState<0 | 1>(0);
  const [selectedRoute, setSelectedRoute] = useState<"training" | "consulting" | "not-sure" | "">("");
  const [selectedRole, setSelectedRole] = useState<"individual" | "business" | "consultant" | "">("");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredFormat: "",
    jobTitle: "",
    company: "",
    workEmail: "",
    industry: "",
    companySize: "",
    budgetBand: "",
    firm: "",
    purpose: "",
  });
  const [agreeNda, setAgreeNda] = useState(false);
  const [identityError, setIdentityError] = useState("");

  // Triage modal state (prototype triage)
  const [triOpen, setTriOpen] = useState(false);
  const [triSld, setTriSld] = useState(0);
  const [triCause, setTriCause] = useState<"people" | "process" | "strategy" | "culture" | "unsure" | null>(null);
  const [triRec, setTriRec] = useState<"training" | "consulting" | null>(null);

  useEffect(() => {
    setIsClient(true);
    const accepted = sessionStorage.getItem("disclaimerAccepted");
    if (!accepted) {
      router.push("/disclaimer");
    } else {
      setDisclaimerAccepted(true);
      const route = sessionStorage.getItem("selectedRoute");
      const savedProfile = sessionStorage.getItem("routeSelectionProfile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile) as typeof profile;
          setProfile((prev) => ({ ...prev, ...parsed }));
        } catch {
          // Ignore malformed session data
        }
      }
      const savedNda = sessionStorage.getItem("routeSelectionNda");
      if (savedNda === "true") setAgreeNda(true);
      if (route === "training" || route === "consulting") {
        setSelectedRoute(route);
      } else {
        setSelectedRoute("training");
      }
      setStage(1);
    }
  }, []);

  useEffect(() => {
    if (!triOpen) return;
    const v = triSld;
    const useC =
      v >= 3 || (triCause && ["process", "strategy", "culture"].includes(triCause));
    setTriRec(useC ? "consulting" : "training");
  }, [triOpen, triSld, triCause]);

  useEffect(() => {
    sessionStorage.setItem("routeSelectionProfile", JSON.stringify(profile));
    sessionStorage.setItem("routeSelectionNda", String(agreeNda));
  }, [profile, agreeNda]);

  const handleRoleSelect = (role: "individual" | "business" | "consultant") => {
    setSelectedRole(role);
    setIdentityError("");
    sessionStorage.setItem("selectedRole", role);
  };

  const updateProfile =
    (key: keyof typeof profile) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setIdentityError("");
      setProfile((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const getIdentityValidationError = () => {
    if (!selectedRole) return "Please select your role.";
    if (selectedRole === "individual") {
      if (!profile.fullName.trim()) return "Full name is required.";
      if (!profile.email.trim()) return "Email is required.";
      if (!profile.phone.trim()) return "Phone is required.";
      if (!profile.preferredFormat) return "Preferred format is required.";
      return "";
    }
    if (selectedRole === "business") {
      if (!profile.fullName.trim()) return "Full name is required.";
      if (!profile.jobTitle.trim()) return "Job title is required.";
      if (!profile.company.trim()) return "Company is required.";
      if (!profile.workEmail.trim()) return "Work email is required.";
      if (!profile.industry) return "Industry is required.";
      if (!profile.companySize) return "Company size is required.";
      if (!profile.budgetBand) return "Budget band is required.";
      return "";
    }
    if (!profile.fullName.trim()) return "Full name is required.";
    if (!profile.firm.trim()) return "Firm is required.";
    if (!profile.email.trim()) return "Email is required.";
    if (!profile.purpose) return "Purpose is required.";
    if (!agreeNda) return "You must agree to the terms.";
    return "";
  };

  const renderRoleForm = () => {
    if (!selectedRole) return null;

    if (selectedRole === "individual") {
      return (
        <div className="role-form">
          <div className="rf-grid two">
            <label className="rf-field">
              <span>FULL NAME *</span>
              <input placeholder="Your name" value={profile.fullName} onChange={updateProfile("fullName")} />
            </label>
            <label className="rf-field">
              <span>EMAIL *</span>
              <input placeholder="you@email.com" value={profile.email} onChange={updateProfile("email")} />
            </label>
            <label className="rf-field">
              <span>PHONE *</span>
              <input placeholder="+251..." value={profile.phone} onChange={updateProfile("phone")} />
            </label>
            <label className="rf-field">
              <span>PREFERRED FORMAT *</span>
              <select value={profile.preferredFormat} onChange={updateProfile("preferredFormat")}>
                <option value="">Select...</option>
                <option value="virtual-live">Virtual / Live</option>
                <option value="in-person">In-Person</option>
                <option value="self-paced">Self-paced (LMS)</option>
              </select>
            </label>
          </div>
        </div>
      );
    }

    if (selectedRole === "business") {
      return (
        <div className="role-form">
          <div className="rf-grid two">
            <label className="rf-field">
              <span>FULL NAME *</span>
              <input placeholder="Your full name" value={profile.fullName} onChange={updateProfile("fullName")} />
            </label>
            <label className="rf-field">
              <span>JOB TITLE *</span>
              <input placeholder="e.g HR Director" value={profile.jobTitle} onChange={updateProfile("jobTitle")} />
            </label>
            <label className="rf-field">
              <span>COMPANY *</span>
              <input placeholder="Company name" value={profile.company} onChange={updateProfile("company")} />
            </label>
            <label className="rf-field">
              <span>WORK EMAIL *</span>
              <input placeholder="you@company.com" value={profile.workEmail} onChange={updateProfile("workEmail")} />
            </label>
          </div>
          <div className="rf-grid three">
            <label className="rf-field">
              <span>INDUSTRY *</span>
              <select value={profile.industry} onChange={updateProfile("industry")}>
                <option value="">Select...</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="financial-services">Financial Services</option>
                <option value="telecom-tech">Telecom & Tech</option>
                <option value="retail">Retail</option>
                <option value="healthcare">Healthcare</option>
                <option value="government">Government</option>
                <option value="logistics">Logistics</option>
                <option value="ngo">NGO</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="rf-field">
              <span>COMPANY SIZE *</span>
              <select value={profile.companySize} onChange={updateProfile("companySize")}>
                <option value="">Select...</option>
                <option value="1-50">1-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </label>
            <label className="rf-field">
              <span>BUDGET BAND *</span>
              <select value={profile.budgetBand} onChange={updateProfile("budgetBand")}>
                <option value="">Select...</option>
                <option value="under-50k">Under 50k ETB</option>
                <option value="50k-150k">50k - 150k ETB</option>
                <option value="150k-500k">150k - 500k ETB</option>
                <option value="500k+">500k+ ETB</option>
              </select>
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="role-form">
        <div className="rf-grid two">
          <label className="rf-field">
            <span>FULL NAME *</span>
            <input placeholder="Your name" value={profile.fullName} onChange={updateProfile("fullName")} />
          </label>
          <label className="rf-field">
            <span>FIRM *</span>
            <input placeholder="Firm name" value={profile.firm} onChange={updateProfile("firm")} />
          </label>
          <label className="rf-field">
            <span>EMAIL *</span>
            <input placeholder="you@firm.com" value={profile.email} onChange={updateProfile("email")} />
          </label>
          <label className="rf-field">
            <span>PURPOSE *</span>
            <select value={profile.purpose} onChange={updateProfile("purpose")}>
              <option value="">Select...</option>
              <option value="support-client">Supporting a client</option>
              <option value="research-benchmarking">Research & benchmarking</option>
              <option value="partnership-inquiry">Partnership inquiry</option>
            </select>
          </label>
        </div>
        <label className="rf-check">
          <input type="checkbox" checked={agreeNda} onChange={(e) => setAgreeNda(e.target.checked)} />
          <span>
            I agree not to replicate SewAsset&apos;s proprietary frameworks, catalog structures, or SPSC™ methodology. *
          </span>
        </label>
      </div>
    );
  };

  const handleContinueGate = () => {
    if (!selectedRoute) return;
    if (selectedRoute === "not-sure") return;
    setStage(1);
  };

  const handleConfirmTriage = () => {
    if (!triRec) return;
    setSelectedRoute(triRec);
    sessionStorage.setItem("selectedRoute", triRec);
    setTriOpen(false);
    // After triage, go to identity gate (matches the "Use Recommendation" intent)
    setStage(1);
  };

  const handleContinueIdentity = () => {
    if (!selectedRoute || !selectedRole) return;
    const validationError = getIdentityValidationError();
    if (validationError) {
      setIdentityError(validationError);
      return;
    }
    sessionStorage.setItem("selectedRoute", selectedRoute);
    sessionStorage.setItem("selectedRole", selectedRole);
    router.push(selectedRoute === "training" ? "/training" : "/consulting");
  };

  return (
    <div className={`tool-overlay ${syne.className}`}>
      {!isClient || !disclaimerAccepted ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E4059] mx-auto mb-4" />
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="tool-nav">
            <div className="tool-logo">
              Sew<span>Asset</span>™ Catalyst
            </div>
            <div className="tool-nav-right">
              <button
                className="close-tool"
                onClick={() => router.push("/")}
                type="button"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <div className="tool-progress">
            <div
              className="tool-progress-fill"
              style={{ width: stage === 0 ? "0%" : "55%" }}
            />
          </div>

          <div className="tool-main">
            {/* s0 Gate */}
            <div className={`tscreen ${stage === 0 ? "active" : ""}`}>
              <div className="t-eyebrow">SewAsset Catalyst™ 2.0</div>
              <div className={`t-title`}>
                What do you need<br />
                <em>right now?</em>
              </div>
              <div className="t-sub">Choose your path. You can switch at any time.</div>

              <div className="gate-grid">
                <div
                  className={`gate-card g-train ${selectedRoute === "training" ? "sel" : ""}`}
                  onClick={() => setSelectedRoute("training")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="gc-tag">Capability Development</div>
                  <div className="gc-title">Training & Development</div>
                  <div className="gc-desc">
                    Design a targeted training program. Smart module recommendations based on your capability goals. Proposal in 10 minutes.
                  </div>
                </div>

                <div
                  className={`gate-card g-consult ${selectedRoute === "consulting" ? "sel" : ""}`}
                  onClick={() => setSelectedRoute("consulting")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="gc-tag">Capability Transformation</div>
                  <div className="gc-title">Strategic Consulting & Diagnostic</div>
                  <div className="gc-desc">
                    Full SPSC organizational diagnostic. Capability gap mapping. Business case with ROI and cost-of-inaction analysis.
                  </div>
                </div>

                <div
                  className="gate-ns"
                  onClick={() => {
                    setSelectedRoute("not-sure");
                    setTriOpen(true);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className="gate-ns-text">
                    Not sure which path fits? → Run a 60-second triage assessment
                  </span>
                  <span className="gate-ns-arrow">→</span>
                </div>
              </div>
            </div>

            {/* Identity gate */}
            <div className={`tscreen ${stage === 1 ? "active" : ""}`}>
              <div className="t-eyebrow">
                Capability {selectedRoute === "consulting" ? "Transformation" : "Development"} · Step 1 of 6
              </div>
              <div className="t-title">
                Who are <em>you?</em>
              </div>
              <div className="t-sub">
                This personalizes your entire experience - the questions, the recommendations, and the final output.
              </div>

              <div className="id-grid">
                <div
                  className={`id-card ${selectedRole === "individual" ? "sel" : ""}`}
                  onClick={() => handleRoleSelect("individual")}
                  role="button"
                  tabIndex={0}
                >
                  <span className="id-icon">👤</span>
                  <div className="id-name">Individual</div>
                  <div className="id-desc">Personal learning and professional development.</div>
                </div>

                <div
                  className={`id-card ${selectedRole === "business" ? "sel" : ""}`}
                  onClick={() => handleRoleSelect("business")}
                  role="button"
                  tabIndex={0}
                >
                  <span className="id-icon">🏢</span>
                  <div className="id-name">Business / Organization</div>
                  <div className="id-desc">HR manager, department head, or executive requesting capability development for a team.</div>
                </div>

                <div
                  className={`id-card ${selectedRole === "consultant" ? "sel" : ""}`}
                  onClick={() => handleRoleSelect("consultant")}
                  role="button"
                  tabIndex={0}
                >
                  <span className="id-icon">🤝</span>
                  <div className="id-name">Consultant / Partner</div>
                  <div className="id-desc">Building a capability proposal for a client or benchmarking on their behalf.</div>
                </div>
              </div>
              {renderRoleForm()}
              {identityError && <div style={{ marginTop: 10, color: "#b84c2b", fontSize: "0.8rem" }}>{identityError}</div>}
            </div>
          </div>

          <div className="bottom-nav">
            <button
              className="btn-back"
              style={{ visibility: stage === 0 ? "hidden" : "visible" }}
              onClick={() => setStage(0)}
              type="button"
            >
              ← Back
            </button>

            <span className="nav-hint-txt">
              {stage === 0 ? "Choose your path to continue" : "Select your role to continue"}
            </span>

            <button
              className="btn-next"
              onClick={() => {
                if (stage === 0) {
                  if (!selectedRoute || selectedRoute === "not-sure") return;
                  if (selectedRoute) {
                    sessionStorage.setItem("selectedRoute", selectedRoute);
                    handleContinueGate();
                  }
                } else {
                  handleContinueIdentity();
                }
              }}
              disabled={stage === 0 ? !selectedRoute || selectedRoute === "not-sure" : !selectedRole}
              type="button"
            >
              Continue →
            </button>
          </div>

          {/* TRIAGE MODAL */}
          <div className={`modal-ov ${triOpen ? "open" : ""}`} role="dialog" aria-modal="true">
            <div className="modal">
              <div className="modal-title">60-Second Triage</div>
              <div className="modal-sub">Two quick questions to recommend the right path for your situation.</div>

              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--tool-ink)" }}>
                How seriously is this affecting business results?
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={triSld}
                onChange={(e) => setTriSld(parseInt(e.target.value, 10))}
              />

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--tool-mid)" }}>
                <span>Not serious</span>
                <span style={{ color: "var(--tool-gold)", fontWeight: 700 }}>{triSld}</span>
                <span>Critical</span>
              </div>

              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--tool-ink)", marginBottom: 8 }}>
                Primary cause of the issue?
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 4 }}>
                {[
                  { key: "people", label: "People" },
                  { key: "process", label: "Process / Systems" },
                  { key: "strategy", label: "Strategy" },
                  { key: "culture", label: "Culture" },
                  { key: "unsure", label: "Unsure" },
                ].map((c) => (
                  <span
                    key={c.key}
                    className={`ttag ${triCause === c.key ? "sel" : ""}`}
                    onClick={() => setTriCause(c.key as any)}
                    role="button"
                    tabIndex={0}
                  >
                    {c.label}
                  </span>
                ))}
              </div>

              {triRec && (
                <div className={`modal-res ${triRec === "consulting" ? "cr" : "tr"}`}>
                  Recommendation:{" "}
                  {triRec === "consulting"
                    ? "Capability Transformation (Consulting Diagnostic)"
                    : "Capability Development (Training Path)"}
                </div>
              )}

              <div className="modal-btns">
                <button className="mbtn-p" onClick={handleConfirmTriage} type="button">
                  Use Recommendation
                </button>
                <button className="mbtn-s" onClick={() => setTriOpen(false)} type="button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
