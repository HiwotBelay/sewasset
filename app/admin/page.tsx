"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Submission {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  submittedAt: string;
  data: any;
  pricing: any;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchSubmissions = async () => {
    if (!authToken.trim()) {
      setError("Please enter admin secret key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/submissions", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        setError("Invalid authorization token");
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch submissions");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2E4059] mb-6">
          Admin - View Submissions
        </h1>

        {/* Authentication */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#2E4059] mb-4">
            Authentication
          </h2>
          <div className="flex gap-4">
            <Input
              type="password"
              placeholder="Enter Admin Secret Key"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && fetchSubmissions()}
            />
            <Button
              onClick={fetchSubmissions}
              disabled={loading}
              className="bg-[#FFC72F] text-[#2E4059] font-bold hover:bg-[#FFC72F]/90"
            >
              {loading ? "Loading..." : "View Submissions"}
            </Button>
          </div>
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </Card>

        {/* Submissions List */}
        {isAuthenticated && (
          <div>
            <div className="mb-4">
              <p className="text-lg font-semibold text-[#2E4059]">
                Total Submissions: {submissions.length}
              </p>
            </div>

            {submissions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-600">No submissions found.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="p-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600">Company Name</p>
                        <p className="font-semibold text-[#2E4059]">
                          {submission.companyName || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Contact Name</p>
                        <p className="font-semibold text-[#2E4059]">
                          {submission.contactName || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="font-semibold text-[#2E4059]">
                          {submission.email || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Phone</p>
                        <p className="font-semibold text-[#2E4059]">
                          {submission.phone || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Submitted At</p>
                        <p className="font-semibold text-[#2E4059]">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      {submission.pricing && (
                        <div>
                          <p className="text-sm text-slate-600">
                            Total Investment
                          </p>
                          <p className="font-semibold text-green-600">
                            {submission.pricing.costBreakdown
                              ?.totalInvestment || "—"}
                          </p>
                        </div>
                      )}
                    </div>

                    <details className="mt-4">
                      <summary className="cursor-pointer text-[#2E4059] font-semibold hover:text-[#FFC72F]">
                        View Full Data
                      </summary>
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg overflow-auto max-h-96">
                        <pre className="text-xs">
                          {JSON.stringify(submission.data, null, 2)}
                        </pre>
                      </div>
                    </details>

                    {submission.pricing && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-[#2E4059] font-semibold hover:text-[#FFC72F]">
                          View Pricing & ROI
                        </summary>
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg overflow-auto max-h-96">
                          <pre className="text-xs">
                            {JSON.stringify(submission.pricing, null, 2)}
                          </pre>
                        </div>
                      </details>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
