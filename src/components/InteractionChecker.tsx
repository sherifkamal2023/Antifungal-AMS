import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { DRUG_INTERACTIONS } from "../data/interactions";
import { DrugInteractionRecord } from "../types";

export const InteractionChecker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    "All",
    "Chemotherapy & Targeted",
    "Immunosuppressant",
    "Cardiovascular & Anticoagulant",
    "CNS & Anticonvulsant",
    "GI & Other",
  ];

  const filteredInteractions = DRUG_INTERACTIONS.filter((item) => {
    const matchesSearch =
      item.interactingDrug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.antifungal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mechanism.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (item: DrugInteractionRecord) => {
    const note = `[ANTIFUNGAL INTERACTION ALERT - PHARMACIST RECOMMENDATION]
Interacting Drug: ${item.interactingDrug} + ${item.antifungal}
Severity: ${item.severity}
Mechanism: ${item.mechanism}
Clinical Risk: ${item.clinicalImpact}
Action Plan: ${item.recommendedAction}`;

    navigator.clipboard.writeText(note);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 rounded-2xl bg-linear-to-r from-purple-900 to-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-purple-300 ring-1 ring-purple-400/40">
              CYP450 & P-gp Interaction Matrix
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Antifungal Drug-Drug Interaction Checker</h2>
          <p className="text-xs text-slate-300">
            Evidence-grounded CYP3A4/CYP2C19/CYP2C9 pharmacokinetic mitigation protocols for high-risk co-prescriptions.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interacting drug (e.g., Venetoclax, Vincristine, Tacrolimus, Apixaban, Rifampin)..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interaction Cards Grid */}
      <div className="space-y-4">
        {filteredInteractions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No interactions matched your search query. Try searching by generic drug name or CYP substrate.
          </div>
        ) : (
          filteredInteractions.map((item) => {
            const isContraindicated = item.severity === "Contraindicated";
            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-5 shadow-xs transition-all dark:bg-slate-900 ${
                  isContraindicated
                    ? "border-rose-200 ring-1 ring-rose-500/20 dark:border-rose-900"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-2xs font-extrabold uppercase tracking-wide ${
                          isContraindicated
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-2xs font-semibold text-slate-400 dark:text-slate-500">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {item.interactingDrug}
                      <span className="text-xs font-normal text-slate-400">+</span>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
                        {item.antifungal}
                      </span>
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopy(item)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-teal-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy Note
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Mechanism</span>
                    <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {item.mechanism}
                    </p>
                  </div>
                  <div>
                    <span className="text-2xs font-bold uppercase tracking-wider text-rose-500">Clinical Impact</span>
                    <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {item.clinicalImpact}
                    </p>
                  </div>
                  <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-2.5 dark:border-teal-900/50 dark:bg-teal-950/20">
                    <span className="text-2xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Recommended Pharmacist Action
                    </span>
                    <p className="mt-0.5 text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
