"use client";

import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { GraduationCap, BookOpen, Users, Sparkles } from "lucide-react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: GraduationCap, text: "Academic Excellence" },
    { icon: BookOpen, text: "Smart Learning" },
    { icon: Users, text: "Community Driven" },
    { icon: Sparkles, text: "AI Powered" },
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-950" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Panel - Animated Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div className="max-w-md space-y-8">
            {/* Logo/Brand */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-4 animate-bounce">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CollegeGPT
              </h1>
              <p className="text-slate-400 mt-2">
                Your AI-powered academic companion
              </p>
            </div>

            {/* Animated Features */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = index === currentFeature;

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                      isActive
                        ? "bg-purple-500/20 border border-purple-500/30 scale-105"
                        : "bg-slate-800/30 border border-slate-700/30"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-all duration-500 ${
                        isActive ? "bg-purple-500/30" : "bg-slate-700/30"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors duration-500 ${
                          isActive ? "text-purple-400" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium transition-colors duration-500 ${
                        isActive ? "text-purple-300" : "text-slate-300"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">10K+</div>
                <div className="text-sm text-slate-400">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">500+</div>
                <div className="text-sm text-slate-400">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">99%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                CollegeGPT
              </h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-400">
                Continue your learning journey with AI-powered insights
              </p>
            </div>

            {/* Sign In Component Container */}
            <div className="backdrop-blur-lg bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-center">
                <SignIn
                  appearance={{
                    baseTheme: undefined,
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm normal-case transition-all duration-200 transform hover:scale-105",
                      formButtonSecondary:
                        "border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-all duration-200",
                      socialButtonsBlockButton:
                        "border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-all duration-200",
                      formFieldInput:
                        "bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20",
                      formFieldLabel: "text-slate-300",
                      identityPreviewText: "text-slate-300",
                      identityPreviewEditButton:
                        "text-purple-400 hover:text-purple-300",
                      formHeaderTitle: "text-white",
                      formHeaderSubtitle: "text-slate-400",
                      socialButtonsBlockButtonText: "text-slate-300",
                      dividerText: "text-slate-400",
                      footerActionText: "text-slate-400",
                      footerActionLink: "text-purple-400 hover:text-purple-300",
                      card: "bg-transparent shadow-none",
                      headerTitle: "text-white",
                      headerSubtitle: "text-slate-400",
                    },
                    variables: {
                      colorPrimary: "#8b5cf6",
                      colorBackground: "transparent",
                      colorInputBackground: "rgba(30, 41, 59, 0.5)",
                      colorInputText: "#ffffff",
                    },
                  }}
                />
              </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-sm">
                Secure authentication powered by{" "}
                <span className="text-purple-400">Clerk</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
