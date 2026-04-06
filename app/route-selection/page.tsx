"use client";

import { useState, useEffect, type ChangeEvent, Fragment } from "react";
import { useRouter } from "next/navigation";
import "../catalyst-tool.css";
import { ROUTE_IDENTITY_COMPLETE_KEY } from "@/lib/route-selection-bridge";

const STEPPER_STEPS = [1, 2, 3, 4, 5, 6] as const;

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
    country: "Ethiopia",
    preferredFormat: "virtual-live",
    jobTitle: "",
    company: "",
    workEmail: "",
    industry: "",
    companySize: "",
    authorityLevel: "decision-maker",
    budgetBand: "",
    firm: "",
    clientIndustry: "",
    clientCompanySize: "",
    purpose: "",
    yearsExperience: "",
    areaOfInterest: "",
    educationLevel: "degree",
    learningGoal: "upskilling",
    fundingSource: "self-funded",
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
      return;
    }
    setDisclaimerAccepted(true);

    const route = sessionStorage.getItem("selectedRoute");
    const savedStage = sessionStorage.getItem("routeSelectionStage");

    const savedProfile = sessionStorage.getItem("routeSelectionProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as typeof profile;
        setProfile((prev) => ({ ...prev, ...parsed }));
      } catch {
        /* ignore */
      }
    }
    const savedNda = sessionStorage.getItem("routeSelectionNda");
    if (savedNda === "true") setAgreeNda(true);

    if (savedStage === "1" && (route === "training" || route === "consulting")) {
      setSelectedRoute(route);
      setStage(1);
    } else {
      setStage(0);
      setSelectedRoute(route === "training" || route === "consulting" ? route : "");
    }
  }, [router]);

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
      if (!profile.email.trim()) return "Personal email is required.";
      if (!profile.country.trim()) return "Country is required.";
      if (!profile.jobTitle.trim()) return "Current job title is required.";
      if (!profile.yearsExperience) return "Years of experience is required.";
      if (!profile.areaOfInterest.trim()) return "Area of interest is required.";
      if (!profile.educationLevel) return "Education level is required.";
      if (!profile.learningGoal) return "Learning goal is required.";
      if (!profile.preferredFormat) return "Preferred format is required.";
      if (!profile.fundingSource) return "Funding source is required.";
      return "";
    }
    if (selectedRole === "business") {
      if (!profile.fullName.trim()) return "Full name is required.";
      if (!profile.workEmail.trim()) return "Work email is required.";
      if (!profile.company.trim()) return "Company name is required.";
      if (!profile.authorityLevel) return "Authority level is required.";
      if (!profile.industry) return "Industry is required.";
      if (!profile.companySize) return "Company size is required.";
      return "";
    }
    if (!profile.fullName.trim()) return "Your full name is required.";
    if (!profile.firm.trim()) return "Firm name is required.";
    if (!profile.email.trim()) return "Work email is required.";
    if (!profile.phone.trim()) return "Phone number is required.";
    if (!profile.country.trim()) return "Country is required.";
    if (!profile.purpose) return "Purpose is required.";
    if (!profile.clientIndustry) return "Client industry is required.";
    if (!profile.clientCompanySize) return "Client company size is required.";
    if (!agreeNda) return "You must agree to the terms.";
    return "";
  };

  const renderRoleForm = () => {
    if (!selectedRole) return null;

    if (selectedRole === "individual") {
      const req = (
        <span style={{ color: "var(--tool-gold)", fontWeight: 900 }} aria-hidden>
          *
        </span>
      );
      return (
        <div className="role-form role-form-elevated">
          <header className="rf-role-intro">
            <p className="rf-role-kicker">Individual</p>
            <h3 className="rf-role-title">Your profile &amp; learning context</h3>
            <p className="rf-role-sub">
              Sharper module picks, pacing, and format when we know your goals, experience, and constraints.
            </p>
          </header>
          <div className="rf-grid two">
            <label className="rf-field">
              <span>
                FULL NAME {req}
              </span>
              <input placeholder="Your name" value={profile.fullName} onChange={updateProfile("fullName")} />
            </label>
            <label className="rf-field">
              <span>
                PERSONAL EMAIL {req}
              </span>
              <input type="email" placeholder="you@email.com" value={profile.email} onChange={updateProfile("email")} />
            </label>
            <label className="rf-field">
              <span>PHONE NUMBER</span>
              <input type="tel" placeholder="+251..." value={profile.phone} onChange={updateProfile("phone")} />
            </label>
            <label className="rf-field">
              <span>
                COUNTRY {req}
              </span>
              <input placeholder="e.g. Ethiopia" value={profile.country} onChange={updateProfile("country")} />
            </label>
            <label className="rf-field">
              <span>
                CURRENT JOB TITLE {req}
              </span>
              <input placeholder="e.g. Sales Executive" value={profile.jobTitle} onChange={updateProfile("jobTitle")} />
            </label>
            <label className="rf-field rf-field-choice">
              <span>
                YEARS OF EXPERIENCE {req}
              </span>
              <select value={profile.yearsExperience} onChange={updateProfile("yearsExperience")}>
                <option value="">Select...</option>
                <option value="0-2">0–2 years</option>
                <option value="3-5">3–5 years</option>
                <option value="6-10">6–10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </label>
            <label className="rf-field">
              <span>
                AREA OF INTEREST {req}
              </span>
              <input
                placeholder="e.g. Data Science, Leadership"
                value={profile.areaOfInterest}
                onChange={updateProfile("areaOfInterest")}
              />
            </label>
            <label className="rf-field rf-field-choice">
              <span>
                EDUCATION LEVEL {req}
              </span>
              <select value={profile.educationLevel} onChange={updateProfile("educationLevel")}>
                <option value="">Select...</option>
                <option value="certificate">Certificate</option>
                <option value="diploma">Diploma</option>
                <option value="degree">Degree</option>
                <option value="masters">Masters / postgraduate</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="rf-field rf-field-choice">
              <span>
                LEARNING GOAL {req}
              </span>
              <select value={profile.learningGoal} onChange={updateProfile("learningGoal")}>
                <option value="">Select...</option>
                <option value="upskilling">Upskilling</option>
                <option value="reskilling">Reskilling</option>
                <option value="certification">Certification prep</option>
                <option value="leadership">Leadership growth</option>
                <option value="career-shift">Career shift</option>
              </select>
            </label>
            <label className="rf-field rf-field-choice">
              <span>
                PREFERRED FORMAT {req}
              </span>
              <select value={profile.preferredFormat} onChange={updateProfile("preferredFormat")}>
                <option value="">Select...</option>
                <option value="virtual-live">Virtual / Live</option>
                <option value="in-person">In-Person</option>
                <option value="self-paced">Self-paced (LMS)</option>
              </select>
            </label>
            <label className="rf-field rf-field-choice">
              <span>
                FUNDING SOURCE {req}
              </span>
              <select value={profile.fundingSource} onChange={updateProfile("fundingSource")}>
                <option value="">Select...</option>
                <option value="self-funded">Self-funded</option>
                <option value="employer">Employer-sponsored</option>
                <option value="scholarship">Scholarship / grant</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        </div>
      );
    }

    if (selectedRole === "business") {
      const req = (
        <span style={{ color: "var(--tool-gold)", fontWeight: 900 }} aria-hidden>
          *
        </span>
      );
      return (
        <div className="role-form role-form-elevated">
          <header className="rf-role-intro">
            <p className="rf-role-kicker">Business / Organization</p>
            <h3 className="rf-role-title">Tell us about your company</h3>
            <p className="rf-role-sub">Bold fields shape approvals, benchmarking, and team-scale recommendations.</p>
          </header>
          <div className="rf-grid two">
            <label className="rf-field">
              <span>
                FULL NAME {req}
              </span>
              <input placeholder="Full name" value={profile.fullName} onChange={updateProfile("fullName")} />
            </label>
            <label className="rf-field">
              <span>
                WORK EMAIL {req}
              </span>
              <input type="email" placeholder="you@company.com" value={profile.workEmail} onChange={updateProfile("workEmail")} />
            </label>
            <label className="rf-field">
              <span>JOB TITLE</span>
              <input placeholder="e.g. HR Manager" value={profile.jobTitle} onChange={updateProfile("jobTitle")} />
            </label>
            <label className="rf-field">
              <span>
                COMPANY NAME {req}
              </span>
              <input placeholder="Company name" value={profile.company} onChange={updateProfile("company")} />
            </label>
          </div>
          <div className="rf-grid three rf-grid-business-choices">
            <label className="rf-field rf-field-choice">
              <span>
                AUTHORITY LEVEL {req}
              </span>
              <select value={profile.authorityLevel} onChange={updateProfile("authorityLevel")}>
                <option value="decision-maker">Decision maker</option>
                <option value="influencer">Influencer / recommender</option>
                <option value="people-culture">People &amp; culture lead</option>
                <option value="finance-procurement">Finance / procurement</option>
                <option value="line-manager">Line manager</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="rf-field rf-field-choice">
              <span>
                INDUSTRY {req}
              </span>
              <select value={profile.industry} onChange={updateProfile("industry")}>
                <option value="">Select...</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="financial-services">Financial services</option>
                <option value="telecom-tech">Telecom &amp; tech</option>
                <option value="retail">Retail</option>
                <option value="healthcare">Healthcare</option>
                <option value="government">Government</option>
                <option value="logistics">Logistics</option>
                <option value="ngo">NGO</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="rf-field rf-field-choice">
              <span>
                COMPANY SIZE {req}
              </span>
              <select value={profile.companySize} onChange={updateProfile("companySize")}>
                <option value="">Select...</option>
                <option value="1-50">1–50</option>
                <option value="51-200">51–200</option>
                <option value="201-500">201–500</option>
                <option value="501-1000">501–1,000</option>
                <option value="1000+">1,000+</option>
              </select>
            </label>
          </div>
        </div>
      );
    }

    const req = (
      <span style={{ color: "var(--tool-gold)", fontWeight: 900 }} aria-hidden>
        *
      </span>
    );
    return (
      <div className="role-form role-form-elevated">
        <header className="rf-role-intro">
          <p className="rf-role-kicker">Consultant / Partner</p>
          <h3 className="rf-role-title">Your firm &amp; client context</h3>
          <p className="rf-role-sub">
            We use this to benchmark responsibly, keep outputs client-appropriate, and protect SewAsset IP in partner
            engagements.
          </p>
        </header>
        <div className="rf-grid two">
          <label className="rf-field">
            <span>
              YOUR FULL NAME {req}
            </span>
            <input placeholder="Your name" value={profile.fullName} onChange={updateProfile("fullName")} />
          </label>
          <label className="rf-field">
            <span>
              FIRM NAME {req}
            </span>
            <input placeholder="Firm name" value={profile.firm} onChange={updateProfile("firm")} />
          </label>
          <label className="rf-field">
            <span>
              WORK EMAIL {req}
            </span>
            <input type="email" placeholder="you@firm.com" value={profile.email} onChange={updateProfile("email")} />
          </label>
          <label className="rf-field">
            <span>
              PHONE NUMBER {req}
            </span>
            <input type="tel" placeholder="+251..." value={profile.phone} onChange={updateProfile("phone")} />
          </label>
          <label className="rf-field rf-field-choice">
            <span>
              PURPOSE {req}
            </span>
            <select value={profile.purpose} onChange={updateProfile("purpose")}>
              <option value="">Select...</option>
              <option value="support-client">Supporting a client</option>
              <option value="research-benchmarking">Research &amp; benchmarking</option>
              <option value="partnership-inquiry">Partnership inquiry</option>
            </select>
          </label>
          <label className="rf-field">
            <span>
              COUNTRY LOCATED? {req}
            </span>
            <input placeholder="e.g. Ethiopia" value={profile.country} onChange={updateProfile("country")} />
          </label>
          <label className="rf-field rf-field-choice">
            <span>
              CLIENT INDUSTRY (FOR CONTEXT) {req}
            </span>
            <select value={profile.clientIndustry} onChange={updateProfile("clientIndustry")}>
              <option value="">Select...</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="financial-services">Financial services</option>
              <option value="telecom-tech">Telecom &amp; tech</option>
              <option value="retail">Retail</option>
              <option value="healthcare">Healthcare</option>
              <option value="government">Government</option>
              <option value="logistics">Logistics</option>
              <option value="ngo">NGO</option>
              <option value="professional-services">Professional services</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="rf-field rf-field-choice">
            <span>
              CLIENT COMPANY SIZE {req}
            </span>
            <select value={profile.clientCompanySize} onChange={updateProfile("clientCompanySize")}>
              <option value="">Select...</option>
              <option value="1-50">1–50</option>
              <option value="51-200">51–200</option>
              <option value="201-500">201–500</option>
              <option value="501-1000">501–1,000</option>
              <option value="1000+">1,000+</option>
              <option value="unknown">Prefer not to say / varies</option>
            </select>
          </label>
        </div>
        <label className="rf-check">
          <input type="checkbox" checked={agreeNda} onChange={(e) => setAgreeNda(e.target.checked)} />
          <span>
            I agree not to replicate SewAsset&apos;s proprietary frameworks, catalog structures, or SPSC™ methodology.{" "}
            {req}
          </span>
        </label>
      </div>
    );
  };

  const handleContinueGate = () => {
    if (!selectedRoute) return;
    if (selectedRoute === "not-sure") return;
    sessionStorage.setItem("selectedRoute", selectedRoute);
    sessionStorage.setItem("routeSelectionStage", "1");
    setStage(1);
  };

  const handleConfirmTriage = () => {
    if (!triRec) return;
    setSelectedRoute(triRec);
    sessionStorage.setItem("selectedRoute", triRec);
    sessionStorage.setItem("routeSelectionStage", "1");
    setTriOpen(false);
    setStage(1);
  };

  const liveReviewAside =
    stage === 1 && selectedRoute && selectedRoute !== "not-sure" ? (
      <aside
        className={`live-review ${selectedRoute === "consulting" ? "consulting-path" : ""}`}
        aria-label="Live review"
      >
        <div className="live-review-title">Live review</div>
        <div className="live-review-box">
          <strong>Direction:</strong>{" "}
          {selectedRoute === "consulting" ? (
            <>
              You are building a <strong>Capability Transformation</strong> diagnostic, gap map, and business case.
            </>
          ) : (
            <>
              You are building a <strong>Capability Development Plan</strong>.
            </>
          )}
          {selectedRole === "individual" && (
            <>
              <br />
              <br />
              You chose <strong>Individual</strong>; questions and module picks will follow your personal goals, format,
              and context.
            </>
          )}
          {selectedRole === "business" && (
            <>
              <br />
              <br />
              You chose <strong>Business / Organization</strong>; we’ll align recommendations to team scale and
              sponsorship.
            </>
          )}
          {selectedRole === "consultant" && (
            <>
              <br />
              <br />
              You chose <strong>Consultant / Partner</strong>. Client industry and company size tune benchmarks; deliverables
              stay proposal-ready and IP-safe.
            </>
          )}
        </div>
      </aside>
    ) : null;

  const handleContinueIdentity = () => {
    if (!selectedRoute || !selectedRole) return;
    const validationError = getIdentityValidationError();
    if (validationError) {
      setIdentityError(validationError);
      return;
    }
    sessionStorage.setItem("selectedRoute", selectedRoute);
    sessionStorage.setItem("selectedRole", selectedRole);
    /** Wizards consume this once so “Who are you” is not repeated (matches single-file HTML flow). */
    sessionStorage.setItem(ROUTE_IDENTITY_COMPLETE_KEY, "true");
    router.push(selectedRoute === "training" ? "/training" : "/consulting");
  };

  return (
    <div className="tool-overlay">
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
              {stage === 1 && selectedRoute && selectedRoute !== "not-sure" && (
                <span
                  className={`tool-path-badge ${selectedRoute === "training" ? "show-training" : "show-consulting"}`}
                >
                  {selectedRoute === "training" ? "Capability Development" : "Capability Transformation"}
                </span>
              )}
              <button
                className="close-tool"
                onClick={() => router.push("/")}
                type="button"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {stage === 0 && (
            <div className="tool-progress">
              <div className="tool-progress-fill" style={{ width: "6%" }} />
            </div>
          )}

          {stage === 1 && (
            <div className="tool-stepper-wrap">
              <div className="tool-stepper" role="list" aria-label="Assessment progress, step 1 of 6">
                {STEPPER_STEPS.map((n, i) => (
                  <Fragment key={n}>
                    <div className={`tool-step-item ${n > 1 ? "is-future" : ""}`} role="listitem">
                      <div className={`tool-step-circle ${n === 1 ? "is-active" : ""}`}>{n}</div>
                      <div className="tool-step-label">{n === 1 ? "Who you are" : "\u00a0"}</div>
                    </div>
                    {i < STEPPER_STEPS.length - 1 ? <div className="tool-step-connector" aria-hidden /> : null}
                  </Fragment>
                ))}
              </div>
            </div>
          )}

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
            <div className={`tscreen tscreen-wide ${stage === 1 ? "active" : ""}`}>
              <div className="identity-shell">
                <div className="identity-shell-main">
                  <div className="t-eyebrow">
                    Capability {selectedRoute === "consulting" ? "Transformation" : "Development"} · Step 1 of 6
                  </div>
                  <div className="t-title">
                    Who are <em>you?</em>
                  </div>
                  <div className="t-sub">
                    This personalizes your entire experience — the questions, the recommendations, and the final output.
                  </div>

                  <div className="id-grid">
                    <div
                      className={`id-card ${selectedRole === "individual" ? "sel" : ""}`}
                      data-role="individual"
                      onClick={() => handleRoleSelect("individual")}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="id-icon">
                        <span className="id-icon-pad id-icon-individual" aria-hidden>
                          👤
                        </span>
                      </span>
                      <div className="id-name">Individual</div>
                      <div className="id-desc">Personal learning and professional development.</div>
                    </div>

                    <div
                      className={`id-card ${selectedRole === "business" ? "sel" : ""}`}
                      data-role="business"
                      onClick={() => handleRoleSelect("business")}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="id-icon">
                        <span className="id-icon-pad id-icon-business" aria-hidden>
                          🏢
                        </span>
                      </span>
                      <div className="id-name">Business / Organization</div>
                      <div className="id-desc">
                        HR manager, department head, or executive requesting capability development for a team.
                      </div>
                    </div>

                    <div
                      className={`id-card ${selectedRole === "consultant" ? "sel" : ""}`}
                      data-role="consultant"
                      onClick={() => handleRoleSelect("consultant")}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="id-icon">
                        <span className="id-icon-pad id-icon-consultant" aria-hidden>
                          🤝
                        </span>
                      </span>
                      <div className="id-name">Consultant / Partner</div>
                      <div className="id-desc">Building a capability proposal for a client or benchmarking on their behalf.</div>
                    </div>
                  </div>
                  {renderRoleForm()}
                  {identityError && (
                    <div style={{ marginTop: 10, color: "#b84c2b", fontSize: "0.8rem" }}>{identityError}</div>
                  )}
                </div>
                {liveReviewAside}
              </div>
            </div>
          </div>

          <div className="bottom-nav">
            <button
              className="btn-back"
              style={{ visibility: stage === 0 ? "hidden" : "visible" }}
              onClick={() => {
                sessionStorage.setItem("routeSelectionStage", "0");
                setStage(0);
              }}
              type="button"
            >
              ← Back
            </button>

            <span className="nav-hint-txt">
              {stage === 0 ? "Choose your path to begin" : "Tell us who you are"}
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
