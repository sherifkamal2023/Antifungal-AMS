import React, { useState } from "react";
import { Search, BookOpen, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { ANTIFUNGAL_DATABASE } from "../data/antifungals";
import { AntifungalDrug } from "../types";

export const AntifungalReference: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("voriconazole");

  const classes = ["All", "Triazole", "Echinocandin", "Polyene", "Pyrimidine Analog"];

  const filteredDrugs = ANTIFUNGAL_DATABASE.filter((drug) => {
    const matchesSearch =
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.indications.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
      drug.cypInteractions.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "All" || drug.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 rounded-2xl bg-linear-to-r from-teal-900 to-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-teal-500/30 px-2.5 py-0.5 text-xs font-semibold text-teal-300 ring-1 ring-teal-400/40">
              Clinical Pharmacology Guide
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Antifungal Formulary & Breakpoint Reference</h2>
          <p className="text-xs text-slate-300">
            Dosing, loading protocols, organ-function adjustments, spectrum, and TDM targets.
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
            placeholder="Search antifungal (e.g. Voriconazole, Anidulafungin, Liposomal Amphotericin)..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                selectedClass === cls
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Drug Cards List */}
      <div className="space-y-4">
        {filteredDrugs.map((drug) => {
          const isExpanded = expandedId === drug.id;
          return (
            <div
              key={drug.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpand(drug.id)}
                className="flex cursor-pointer items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-teal-50 px-2 py-0.5 text-2xs font-bold text-teal-700 ring-1 ring-inset ring-teal-600/20 dark:bg-teal-950 dark:text-teal-300">
                      {drug.class}
                    </span>
                    {drug.tdmRequired && (
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-2xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950 dark:text-blue-300">
                        TDM Required
                      </span>
                    )}
                    <span
                      className={`rounded-md px-2 py-0.5 text-2xs font-semibold ${
                        drug.qtcEffect === "Prolongs QTc"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : drug.qtcEffect === "Shortens QTc"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {drug.qtcEffect}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">{drug.name}</h3>
                </div>

                <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              {/* Collapsed Preview */}
              {!isExpanded && (
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Key Indications:</span>{" "}
                  {drug.indications.slice(0, 2).join("; ")}
                </div>
              )}

              {/* Expanded Full Details */}
              {isExpanded && (
                <div className="mt-5 space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {/* Spectrum Grid */}
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Antifungal Spectrum & Activity
                    </span>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                      <div>
                        <strong>Candida:</strong> <span className="text-slate-700 dark:text-slate-300">{drug.spectrum.candida}</span>
                      </div>
                      <div>
                        <strong>Aspergillus:</strong> <span className="text-slate-700 dark:text-slate-300">{drug.spectrum.aspergillus}</span>
                      </div>
                      <div>
                        <strong>Mucorales:</strong> <span className="text-slate-700 dark:text-slate-300 font-semibold">{drug.spectrum.mucorales}</span>
                      </div>
                      <div>
                        <strong>Cryptococcus:</strong> <span className="text-slate-700 dark:text-slate-300">{drug.spectrum.cryptococcus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dosing Section */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                      <span className="text-2xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        Loading Dose Protocol
                      </span>
                      <p className="mt-1 text-xs text-slate-800 dark:text-slate-200 font-medium">{drug.adultDosing.loading}</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                      <span className="text-2xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        Maintenance Dose & Route
                      </span>
                      <p className="mt-1 text-xs text-slate-800 dark:text-slate-200 font-medium">{drug.adultDosing.maintenance}</p>
                      {drug.adultDosing.oralBioavailability && (
                        <p className="mt-1 text-2xs text-slate-500">Bioavailability: {drug.adultDosing.oralBioavailability}</p>
                      )}
                    </div>
                  </div>

                  {/* Adjustments */}
                  <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 text-xs space-y-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Patient-Specific Adjustments</span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-2xs">
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Renal & SBECD:</strong> {drug.adjustments.renal}
                      </div>
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Hepatic (Child-Pugh):</strong> {drug.adjustments.hepatic}
                      </div>
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Obesity / Adjusted Weight:</strong> {drug.adjustments.obesity}
                      </div>
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Dialysis / CRRT:</strong> {drug.adjustments.crrt_ihd}
                      </div>
                    </div>
                  </div>

                  {/* TDM & Toxicity */}
                  {drug.tdmRequired && drug.tdmTarget && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs dark:border-blue-900/50 dark:bg-blue-950/20">
                      <span className="font-bold text-blue-900 dark:text-blue-300">TDM Target & Timing:</span>
                      <p className="mt-0.5 text-slate-800 dark:text-slate-200">{drug.tdmTarget}</p>
                      {drug.tdmSamplingTime && <p className="mt-1 text-2xs text-slate-500">{drug.tdmSamplingTime}</p>}
                    </div>
                  )}

                  {/* CYP Interactions */}
                  <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">CYP Metabolism & Interactions:</span>
                    <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed">{drug.cypInteractions}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
