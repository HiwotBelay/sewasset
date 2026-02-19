"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Calendar, Phone, Mail, Clock, Users, Target } from "lucide-react";

export default function TrainingProposalPage() {
  const router = useRouter();
  const [trainingData, setTrainingData] = useState<any>(null);

  useEffect(() => {
    // Load training data from sessionStorage
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("trainingSubmissionData");
      if (saved) {
        try {
          setTrainingData(JSON.parse(saved));
        } catch (e) {
          console.error("Error loading training data:", e);
        }
      } else {
        // If no data, redirect to home
        router.push("/");
      }
    }
  }, [router]);

  if (!trainingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E4059] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your training proposal...</p>
        </div>
      </div>
    );
  }

  // Calculate total duration
  const getTotalDuration = () => {
    // This would come from the actual topic data
    return "2-3 Days"; // Placeholder
  };

  const getSelectedTopics = () => {
    // Import topics data (simplified - in real app this would come from API/DB)
    const topicMap: Record<string, string> = {
      "effective-communication": "Effective Communication",
      "team-collaboration": "Team Collaboration",
      "managing-teams-effectively": "Managing Teams Effectively",
      "decision-making-uncertainty": "Decision Making Under Uncertainty",
      "delegation-empowerment": "Delegation & Empowerment",
      "visionary-leadership": "Visionary Leadership & Change",
      "ethical-leadership": "Ethical Leadership & Governance",
      "management-identity": "Building Your Management Identity",
      "digital-literacy": "Digital Literacy & Tools",
    };
    
    const topicIds = trainingData.selectedTopics || [];
    return topicIds.map((id: string) => topicMap[id] || id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2E4059] to-[#3E587C] text-white py-4 sm:py-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white mb-2 sm:mb-3 transition-smooth text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back To Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8 animate-fade-in-up">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2E4059] mb-4">
            Your Personalized Training Plan
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            We've prepared a customized training proposal based on your selections. 
            Schedule a call with our team to discuss details and get started.
          </p>
        </div>

        <Card className="p-6 sm:p-8 lg:p-10 bg-white shadow-2xl border-2 border-slate-100 rounded-2xl animate-fade-in-up delay-200">
          {/* Training Summary */}
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#2E4059] mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-[#FDC700]" />
                Training Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-[#FDC700]" />
                    <span className="text-sm font-semibold text-[#6B7280]">Estimated Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-[#2E4059]">{getTotalDuration()}</p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-[#FDC700]" />
                    <span className="text-sm font-semibold text-[#6B7280]">Audience</span>
                  </div>
                  <p className="text-lg font-semibold text-[#2E4059] capitalize">
                    {trainingData.trainingAudience || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Topics */}
            {getSelectedTopics().length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#2E4059] mb-3">Selected Training Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {getSelectedTopics().slice(0, 10).map((topic: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#FDC700]/10 text-[#2E4059] border border-[#FDC700]/30 rounded-full text-sm font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                  {getSelectedTopics().length > 10 && (
                    <span className="px-3 py-1.5 bg-slate-100 text-[#6B7280] rounded-full text-sm">
                      +{getSelectedTopics().length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Custom Topics */}
            {trainingData.customTopics && trainingData.customTopics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#2E4059] mb-3">Custom Training Requests</h3>
                <div className="flex flex-wrap gap-2">
                  {trainingData.customTopics.map((topic: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="border-t border-slate-200 pt-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[#2E4059] mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-[#6B7280]">
                Schedule a call with our training experts to discuss your personalized plan
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="flex-1 bg-[#FDC700] text-[#2E4059] hover:bg-[#F5AF19] font-bold py-6 text-lg rounded-xl"
              >
                <a href="tel:+251911234567">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-2 border-[#FDC700] text-[#FDC700] hover:bg-[#FDC700]/10 font-bold py-6 text-lg rounded-xl"
              >
                <a href="mailto:info@sewasset.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us
                </a>
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#6B7280]">
                Or fill out our contact form and we'll reach out within 24 hours
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
