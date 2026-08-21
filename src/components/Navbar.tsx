import React from "react";
import {
  ShieldCheck,
  Globe,
  Settings,
  Sparkles,
  BookOpen,
  Calculator,
  AlertTriangle,
  BarChart3,
  MessageSquareText,
  Layers,
} from "lucide-react";
import { StewardshipMode } from "../types";
import { STEWARDSHIP_MODES } from "../data/modes";

interface NavbarProps {
  activeTab: "chat" | "tdm" | "interactions" | "audit" | "reference" | "deck";
  setActiveTab: (tab: "chat" | "tdm" | "interactions" | "audit" | "reference" | "deck") => void;
  selectedMode: StewardshipMode;
  setSelectedMode: (mode: StewardshipMode) => void;
  searchGrounding: boolean;
  setSearchGrounding: (enabled: boolean) => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedMode,
  setSelectedMode,
  searchGrounding,
  setSearchGrounding,
  onOpenSettings,
}) => {
  const currentModeInfo = STEWARDSHIP_MODES.find((m) => m.id === selectedMode);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm ring-4 ring-teal-50 dark:ring-teal-950/50">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                FungiSteward<span className="text-teal-600 dark:text-teal-400">-AI</span>
              </h1>
              <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20 dark:bg-teal-950 dark:text-teal-300 dark:ring-teal-500/30">
                AMS Copilot
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              Evidence-Grounded Antifungal Stewardship & Clinical Pharmacy Suite
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "chat"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-900 dark:text-teal-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <MessageSquareText className="h-3.5 w-3.5" />
            Copilot
          </button>
          <button
            onClick={() => setActiveTab("tdm")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "tdm"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-900 dark:text-teal-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            TDM & PK
          </button>
          <button
            onClick={() => setActiveTab("interactions")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "interactions"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-900 dark:text-teal-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Drug Interactions
          </button>
          <button
            onClick={() => setActiveTab("deck")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "deck"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-900 dark:text-teal-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Teaching Decks
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "audit"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-900 dark:text-teal-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            AMS Audit & KPIs
          </button>
          <button
            onClick={() => setActiveTab("reference")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "reference"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-900 dark:text-teal-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Antifungal Formulary
          </button>
        </nav>

        {/* Right Tools: Search Grounding & Institutional Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Grounding Toggle */}
          <button
            onClick={() => setSearchGrounding(!searchGrounding)}
            title={searchGrounding ? "Live Google Search Grounding is ON" : "Search Grounding is OFF (Fast reasoning)"}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
              searchGrounding
                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-500/30 dark:bg-blue-950 dark:text-blue-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            <Globe className={`h-3.5 w-3.5 ${searchGrounding ? "text-blue-600 animate-pulse" : ""}`} />
            <span className="hidden sm:inline">Search Grounding</span>
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                searchGrounding ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </button>

          {/* Institutional Antibiogram & Formulary Config */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Institutional Antibiogram, Formulary & TDM Thresholds"
          >
            <Settings className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden md:inline">Formulary Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-100 px-4 py-1.5 no-scrollbar dark:border-slate-800">
        <div className="flex gap-1 min-w-max">
          {[
            { id: "chat", label: "Copilot", icon: MessageSquareText },
            { id: "tdm", label: "TDM & PK", icon: Calculator },
            { id: "interactions", label: "Interactions", icon: AlertTriangle },
            { id: "deck", label: "Decks", icon: Layers },
            { id: "audit", label: "Audit & KPIs", icon: BarChart3 },
            { id: "reference", label: "Formulary", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
