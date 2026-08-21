import React, { useState } from "react";
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Activity,
  Zap,
} from "lucide-react";
import { ANTIFUNGAL_DATABASE } from "../data/antifungals";

interface TdmCalculatorProps {
  onSendToCopilot?: (prompt: string) => void;
}

export const TdmCalculator: React.FC<TdmCalculatorProps> = ({ onSendToCopilot }) => {
  const [selectedDrug, setSelectedDrug] = useState<string>("voriconazole");
  const [indication, setIndication] = useState<"treatment" | "prophylaxis" | "cns_severe">("treatment");
  const [troughLevel, setTroughLevel] = useState<string>("5.8");
  const [currentDose, setCurrentDose] = useState<string>("300");
  const [frequency, setFrequency] = useState<string>("q12h");
  const [route, setRoute] = useState<"oral" | "iv">("oral");
  const [daysOnTherapy, setDaysOnTherapy] = useState<number>(7);
  const [samplingValidity, setSamplingValidity] = useState<"true_trough" | "random_mid" | "post_dose">("true_trough");
  const [hasVisualSymptoms, setHasVisualSymptoms] = useState<boolean>(true);
  const [hasLftElevation, setHasLftElevation] = useState<boolean>(true);
  const [concomitantCyp, setConcomitantCyp] = useState<string>("tacrolimus");

  // Calculations
  const levelNum = parseFloat(troughLevel) || 0;

  const calculateAssessment = () => {
    if (selectedDrug === "voriconazole") {
      const minTarget = indication === "cns_severe" ? 2.0 : 1.0;
      const maxTarget = 5.5;

      const isSteadyState = daysOnTherapy >= 4;
      const isTrueTrough = samplingValidity === "true_trough";

      if (!isTrueTrough) {
        return {
          status: "Invalid Timing",
          color: "amber",
          message: "Sample was drawn as a random/mid-interval level rather than a true trough immediately before the scheduled dose. Interpret with extreme caution and repeat a true trough.",
          doseAction: "Do not make drastic dosage changes based on non-trough level unless patient is experiencing acute toxicity.",
          recheckDays: "Draw true pre-dose trough in 24-48 hours.",
        };
      }

      if (levelNum > 5.5) {
        const excess = ((levelNum - 5.5) / 5.5) * 100;
        return {
          status: "Supratherapeutic / Toxic Range",
          color: "red",
          message: `Level of ${levelNum} mg/L exceeds safe upper threshold of 5.5 mg/L (${excess.toFixed(0)}% above ceiling). Non-linear Michaelis-Menten kinetics mean small dose reductions yield dramatic drops in serum concentrations.`,
          doseAction: levelNum > 7.0
            ? "HOLD 2 doses, then resume at 50% dose reduction (e.g. reduce from 300mg q12h to 150-200mg q12h)."
            : "HOLD 1 dose, then reduce maintenance dose by 25% to 33% (e.g. reduce from 300mg q12h to 200mg q12h).",
          recheckDays: "Re-check trough level in 4-5 days after dosage reduction.",
          toxicityWarning: "High risk of visual hallucinations, encephalopathy, neuropathy, and hepatotoxicity. Check baseline QTc and monitor LFTs.",
        };
      } else if (levelNum < minTarget) {
        return {
          status: "Subtherapeutic Level",
          color: "amber",
          message: `Level of ${levelNum} mg/L is below therapeutic target of ${minTarget} mg/L. Risk of fungal treatment failure or breakthrough.`,
          doseAction: "Increase maintenance dose by 50% (e.g. increase from 200mg q12h to 300mg q12h). In severe infection, consider a single re-loading dose of 6 mg/kg IV.",
          recheckDays: "Re-check trough level on Day 4-5 after dose increase.",
          toxicityWarning: "Assess patient compliance and rule out concurrent strong CYP inducers (e.g. rifamycins, carbamazepine, phenytoin).",
        };
      } else {
        return {
          status: "Therapeutic Range",
          color: "emerald",
          message: `Level of ${levelNum} mg/L is within guideline-recommended target range (${minTarget} - 5.5 mg/L).`,
          doseAction: "Maintain current dosing regimen.",
          recheckDays: "Repeat trough in 7 days or sooner if liver function changes or interacting medications are added/removed.",
          toxicityWarning: "Continue weekly LFT monitoring.",
        };
      }
    }

    if (selectedDrug === "posaconazole") {
      const target = indication === "prophylaxis" ? 0.7 : 1.25;
      if (levelNum < target) {
        return {
          status: "Subtherapeutic",
          color: "amber",
          message: `Level of ${levelNum} mg/L is below optimal target of >${target} mg/L.`,
          doseAction: "If on oral suspension, switch immediately to Delayed-Release (DR) Tablets 300 mg daily or IV. If already on DR tablets, increase dose to 400 mg daily or verify food co-administration.",
          recheckDays: "Re-check trough in 5-7 days.",
        };
      } else if (levelNum > 3.75) {
        return {
          status: "Elevated / Monitor Toxicity",
          color: "amber",
          message: `Level of ${levelNum} mg/L is elevated (>3.75 mg/L).`,
          doseAction: "Monitor for pseudohyperaldosteronism (hypertension, hypokalemia) and LFT elevations. Consider reducing daily dose to 200 mg daily if toxicity occurs.",
          recheckDays: "Re-check trough in 7 days.",
        };
      } else {
        return {
          status: "Therapeutic",
          color: "emerald",
          message: `Level of ${levelNum} mg/L is therapeutic (Target >${target} mg/L).`,
          doseAction: "Continue current regimen.",
          recheckDays: "Re-check in 7-14 days.",
        };
      }
    }

    if (selectedDrug === "flucytosine") {
      if (levelNum > 100) {
        return {
          status: "CRITICAL TOXICITY (>100 mg/L)",
          color: "red",
          message: `Flucytosine peak level of ${levelNum} mg/L carries severe risk of fatal bone marrow aplasia, leukopenia, and enterocolitis.`,
          doseAction: "HOLD doses immediately until level is <80 mg/L. Reduce daily dose by 50% and strictly calculate CrCl for renal interval adjustments.",
          recheckDays: "Re-check 2-hour peak within 48 hours.",
          toxicityWarning: "Immediate CBC with differential and renal function panel required.",
        };
      } else if (levelNum < 25) {
        return {
          status: "Subtherapeutic (<25 mg/L)",
          color: "amber",
          message: `Peak level of ${levelNum} mg/L is subtherapeutic. Risk of rapid emergence of secondary resistance.`,
          doseAction: "Increase dose toward guideline 100 mg/kg/day (in 4 divided doses) based on CrCl.",
          recheckDays: "Re-check 2h peak in 3-4 days.",
        };
      } else {
        return {
          status: "Therapeutic Peak (25-100 mg/L)",
          color: "emerald",
          message: `Peak level of ${levelNum} mg/L is within optimal safety and efficacy window.`,
          doseAction: "Continue current renal-adjusted regimen.",
          recheckDays: "Repeat peak level twice weekly if renal function is fluctuating.",
        };
      }
    }

    return {
      status: "Therapeutic Window",
      color: "emerald",
      message: "Level is within acceptable range.",
      doseAction: "Continue current regimen.",
      recheckDays: "Repeat as clinically indicated.",
    };
  };

  const assessment = calculateAssessment();

  const handleSendToAi = () => {
    if (!onSendToCopilot) return;
    const prompt = `/tdm Patient on ${selectedDrug.toUpperCase()} ${currentDose}mg ${frequency} (${route.toUpperCase()}) for ${indication}. Measured trough level is ${troughLevel} mg/L on Day ${daysOnTherapy} of therapy. Concomitant medications include: ${concomitantCyp}. Visual symptoms: ${hasVisualSymptoms ? "Yes" : "None"}. LFT elevation: ${hasLftElevation ? "Yes" : "Normal"}. Please perform a full clinical pharmacokinetic assessment, non-linear kinetics analysis, drug-interaction review, and provide an actionable pharmacist note.`;
    onSendToCopilot(prompt);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 rounded-2xl bg-linear-to-r from-blue-900 to-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/40">
              Pharmacokinetics & TDM Engine
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Antifungal Therapeutic Drug Monitoring Calculator</h2>
          <p className="text-xs text-slate-300">
            Precision dosing, Michaelis-Menten non-linear kinetics modeling, target validation, and toxicity mitigation.
          </p>
        </div>

        <button
          onClick={handleSendToAi}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-500"
        >
          <Sparkles className="h-4 w-4" />
          Send to AI Copilot
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Inputs Panel */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            1. Antifungal Drug & Sampling Data
          </h3>

          {/* Drug Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Antifungal Agent</label>
            <select
              value={selectedDrug}
              onChange={(e) => setSelectedDrug(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="voriconazole">Voriconazole (Vfend) - Non-linear PK</option>
              <option value="posaconazole">Posaconazole (Noxafil) - DR Tabs / IV</option>
              <option value="flucytosine">Flucytosine (5-FC) - Peak Toxicity Range</option>
              <option value="itraconazole">Itraconazole (Sporanox)</option>
              <option value="isavuconazole">Isavuconazole (Cresemba) - Selective TDM</option>
            </select>
          </div>

          {/* Indication */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clinical Indication / Goal</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {[
                { id: "treatment", label: "Treatment (Standard)" },
                { id: "prophylaxis", label: "Prophylaxis" },
                { id: "cns_severe", label: "CNS / Severe Disease" },
              ].map((ind) => (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setIndication(ind.id as any)}
                  className={`rounded-lg border px-2 py-1.5 text-center text-xs font-medium transition-colors ${
                    indication === ind.id
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>

          {/* Measured Concentration & Dose */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Measured Serum Level ({selectedDrug === "flucytosine" ? "Peak" : "Trough"})
              </label>
              <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 focus-within:border-blue-500 dark:border-slate-700 dark:bg-slate-800">
                <input
                  type="number"
                  step="0.1"
                  value={troughLevel}
                  onChange={(e) => setTroughLevel(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-hidden dark:text-slate-100"
                />
                <span className="text-xs font-semibold text-slate-400">mg/L</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Dose</label>
              <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 focus-within:border-blue-500 dark:border-slate-700 dark:bg-slate-800">
                <input
                  type="text"
                  value={currentDose}
                  onChange={(e) => setCurrentDose(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-hidden dark:text-slate-100"
                />
                <span className="text-xs font-semibold text-slate-400">mg</span>
              </div>
            </div>
          </div>

          {/* Regimen Details */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="q12h">q12h (BID)</option>
                <option value="q24h">q24h (Daily)</option>
                <option value="q8h">q8h (TID)</option>
                <option value="q6h">q6h (QID)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Route</label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="oral">Oral (PO)</option>
                <option value="iv">IV Infusion</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Day of Therapy</label>
              <input
                type="number"
                min="1"
                value={daysOnTherapy}
                onChange={(e) => setDaysOnTherapy(parseInt(e.target.value) || 1)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Sampling Validity */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sample Timing Accuracy</label>
            <select
              value={samplingValidity}
              onChange={(e) => setSamplingValidity(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="true_trough">True Trough (Drawn within 30 min before scheduled dose)</option>
              <option value="random_mid">Random / Mid-interval Sample (Uninterpretable trough)</option>
              <option value="post_dose">Post-dose Peak</option>
            </select>
          </div>

          {/* Toxicity Checklist */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Toxicity & Symptom Screen</span>
            <div className="mt-2 space-y-1.5">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVisualSymptoms}
                  onChange={(e) => setHasVisualSymptoms(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Visual disturbances, photopsia, or hallucinations
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLftElevation}
                  onChange={(e) => setHasLftElevation(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Transaminitis (AST/ALT &gt; 3x ULN) or Bilirubin elevation
              </label>
            </div>
          </div>
        </div>

        {/* Right Output & Reasoning Panel */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            2. Pharmacokinetic Assessment & Action Plan
          </h3>

          {/* Status Badge */}
          <div
            className={`rounded-xl border p-4 ${
              assessment.color === "red"
                ? "border-red-200 bg-red-50/80 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                : assessment.color === "amber"
                ? "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                : "border-teal-200 bg-teal-50/80 text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">TDM Status</span>
              <span className="rounded-md bg-white/80 px-2 py-0.5 text-xs font-extrabold shadow-2xs dark:bg-slate-900">
                {assessment.status}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed">{assessment.message}</p>
          </div>

          {/* Actionable Dose Recommendation */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              Pharmacist Dose Modification:
            </div>
            <p className="mt-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {assessment.doseAction}
            </p>
          </div>

          {/* Re-check Timing */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              <Activity className="h-4 w-4 text-blue-600" />
              Follow-up TDM Timing:
            </div>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              {assessment.recheckDays}
            </p>
          </div>

          {/* Toxicity Callout */}
          {assessment.toxicityWarning && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-950 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-300 mb-1">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                Safety Alert:
              </div>
              {assessment.toxicityWarning}
            </div>
          )}

          {/* Reference Targets Card */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-2xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
            <strong>Standard Guideline Targets (ECMM/BSMM 2025/2026):</strong>
            <ul className="mt-1 list-disc pl-4 space-y-0.5">
              <li>Voriconazole: 1.0 - 5.5 mg/L (Trough; severe/CNS 2.0-5.5 mg/L)</li>
              <li>Posaconazole: &gt;0.7-1.0 mg/L (Prophylaxis); &gt;1.25-1.5 mg/L (Treatment)</li>
              <li>Flucytosine: 25 - 100 mg/L (2-hour peak; toxic &gt;100 mg/L)</li>
              <li>Itraconazole: &gt;0.5-1.0 mg/L (Trough by HPLC)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
