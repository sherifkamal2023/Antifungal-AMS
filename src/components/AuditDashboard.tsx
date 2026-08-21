import React, { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Download,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export const AuditDashboard: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [quarter, setQuarter] = useState<string>("Q3 2026");

  const kpiData = {
    dotOverall: 84.2, // DOT per 1000 PD
    dotTarget: 75.0,
    dotTrend: -12.4, // % reduction
    candidemiaBundleCompliance: 88.5, // %
    bundleTarget: 90.0,
    timeout48hRate: 91.2, // %
    timeoutTarget: 85.0,
    tdmComplianceRate: 94.7, // % (benchmarked from Ibrahim 2026)
    tdmTarget: 90.0,
    empiricGuidelineConcordance: 82.6, // %
    concordanceTarget: 85.0,
  };

  const bundleElements = [
    { title: "Echinocandin Initial Empiric Therapy", compliance: 96, target: 95, status: "Optimal" },
    { title: "Daily Follow-up Blood Cultures to Clearance", compliance: 92, target: 90, status: "Optimal" },
    { title: "Dilated Ophthalmic Examination Ordered", compliance: 78, target: 85, status: "Needs Improvement" },
    { title: "CVC / Source Control Assessed within 48h", compliance: 94, target: 90, status: "Optimal" },
    { title: "Duration Counted 14 Days Post-Clearance", compliance: 86, target: 90, status: "Target Range" },
  ];

  const handleCopyReport = () => {
    const report = `### ANTIFUNGAL ANTIMICROBIAL STEWARDSHIP PROGRAM (ASP) AUDIT REPORT
Period: ${quarter} | Institution: Tertiary University Hospital

1. UTILIZATION METRICS:
- Antifungal DOT / 1,000 Patient-Days: ${kpiData.dotOverall} (Target: <${kpiData.dotTarget}, 12.4% reduction from baseline)
- Echinocandin DOT / 1,000 PD: 42.1
- Mould-active Triazole DOT / 1,000 PD: 31.8
- Liposomal Amphotericin B DOT / 1,000 PD: 10.3

2. PROCESS & QUALITY MEASURES:
- Candidemia 5-Point Bundle Compliance: ${kpiData.candidemiaBundleCompliance}% (Target: >${kpiData.bundleTarget}%)
- 48-72h Antifungal Time-out Rate: ${kpiData.timeout48hRate}% (Target: >${kpiData.timeoutTarget}%)
- TDM Protocol Adherence (Voriconazole/Posaconazole): ${kpiData.tdmComplianceRate}% (Target: >${kpiData.tdmTarget}%)
- Indication & Review Date Documented in EHR: 93.4%

3. CANDIDEMIA BUNDLE BREAKDOWN:
${bundleElements.map((b) => `- ${b.title}: ${b.compliance}% (Target: ${b.target}%) -> ${b.status}`).join("\n")}

4. BALANCING SAFETY MEASURES:
- 30-Day All-Cause Candidemia Mortality: 18.2% (Historical baseline: 24.5%)
- Unplanned Fungal-Related 30-Day Readmission: 3.4%
- Severe Antifungal Adverse Drug Events (ADEs): 0.8 per 1,000 DOT

Evidence Benchmark: Kara E et al. Int J Clin Pharm 2026; Ibrahim MM et al. Inform Health Soc Care 2026; Ng BY et al. JAC-AMR 2026.`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-3 rounded-2xl bg-linear-to-r from-emerald-900 to-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/40">
              Mode: /audit
            </span>
            <span className="text-xs text-slate-300">Continuous Stewardship Quality Dashboard</span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Antifungal AMS Audit & KPI Dashboard</h2>
          <p className="text-xs text-slate-300">
            Process, clinical, and safety metrics based on international ECMM, BSMM, and CDC stewardship core elements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 focus:outline-hidden"
          >
            <option value="Q3 2026">Q3 2026 (Current)</option>
            <option value="Q2 2026">Q2 2026</option>
            <option value="Q1 2026">Q1 2026</option>
            <option value="Annual 2025">Annual 2025</option>
          </select>

          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-500"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Export Audit"}
          </button>
        </div>
      </div>

      {/* High-Level Metric Gauges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Antifungal DOT */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Antifungal DOT / 1,000 PD
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{kpiData.dotOverall}</span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-3.5 w-3.5" />
              12.4% vs baseline
            </span>
          </div>
          <p className="mt-1 text-2xs text-slate-400">Institutional Target: &lt;75.0 DOT</p>
        </div>

        {/* Candidemia Bundle */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Candidemia Bundle Compliance
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {kpiData.candidemiaBundleCompliance}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Near Target</span>
          </div>
          <p className="mt-1 text-2xs text-slate-400">5-Point Care Bundle Target: &gt;90%</p>
        </div>

        {/* 48-72h Time-out Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            48–72h Time-out Rate
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {kpiData.timeout48hRate}%
            </span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">Target Met</span>
          </div>
          <p className="mt-1 text-2xs text-slate-400">Target: &gt;85% of empiric starts</p>
        </div>

        {/* TDM Compliance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            TDM Protocol Compliance
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {kpiData.tdmComplianceRate}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Optimal</span>
          </div>
          <p className="mt-1 text-2xs text-slate-400">Target: &gt;90% timely action</p>
        </div>
      </div>

      {/* Candidemia Care Bundle Deep Dive */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Candidemia Care Bundle Performance Elements
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Standardized 5-element bundle tracked across ICU, surgical, and hematology units.
        </p>

        <div className="mt-5 space-y-4">
          {bundleElements.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.compliance}%</span>
                  <span className="text-slate-400">(Target: {item.target}%)</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.compliance >= item.target ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${item.compliance}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
