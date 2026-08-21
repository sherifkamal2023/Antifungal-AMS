import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { SlideContent } from "../types";
import { parseTeachingDeck } from "../utils/parser";

interface InteractiveDeckViewerProps {
  deckMarkdown?: string;
  onGenerateNewDeck?: (topic: string) => void;
  isLoading?: boolean;
}

const SAMPLE_FALLBACK_DECK: SlideContent[] = [
  {
    slideNumber: 1,
    title: "Title & Learning Objectives: Breakthrough Candidemia in Hematology",
    bullets: [
      "Target Audience: Clinical Pharmacists, ID Fellows, Oncology Specialists",
      "Duration: 45-minute interactive case discussion",
      "Objective 1: Reconstruct clinical timeline and identify breakthrough risk during azole prophylaxis",
      "Objective 2: Apply 2025/2026 ECMM & BSMM guidelines for empiric vs targeted antifungal therapy",
      "Objective 3: Execute candidemia bundle (CVC management, blood clearance, TDM, step-down)",
    ],
    speakerNotes: "Welcome everyone. Today's case explores real-world clinical ambiguity in a patient developing bloodstream infection while receiving mould-active azole prophylaxis. We will evaluate species-specific resistance and pharmacokinetic drivers of breakthrough.",
    evidenceCitation: "Cornely OA et al. Lancet Infect Dis 2025 (PMID: 39956121) & Kara E et al. Int J Clin Pharm 2026 (PMID: 42029838).",
  },
  {
    slideNumber: 2,
    title: "Initial Case Presentation: 58-Year-Old Male with Relapsed MM",
    bullets: [
      "Host Risk: Relapsed multiple myeloma on salvage Daratumumab-Pomalidomide-Dexamethasone",
      "Prophylaxis: Posaconazole DR tablets 300 mg daily for past 6 weeks (history of prior fungal pneumonia)",
      "Acute Event: Day +18 admitted with fever 39.1°C, rigors, systolic BP 82 mmHg (Septic Shock)",
      "Access: Left subclavian dual-lumen chemoport placed 10 months ago",
      "Initial Labs: WBC 1.1 x 10^9/L (ANC 0.65), Serum Cr 1.8 mg/dL (baseline 0.9 mg/dL), Lactate 3.4 mmol/L",
    ],
    speakerNotes: "Note the presence of a chronic vascular access device and the acute presentation with septic shock requiring fluid resuscitation and vasopressors.",
    visualOrTable: "Timeline: Salvage Chemotherapy -> Posaconazole Prophylaxis -> Shock + Fever -> Blood Cultures Drawn",
    evidenceCitation: "Schelenz S et al. Lancet Infect Dis 2026 (PMID: 41232547).",
  },
  {
    slideNumber: 3,
    title: "Host-Risk Stratification & Clinical Timeline",
    bullets: [
      "Immunosuppression: High-dose dexamethasone + immunomodulators + secondary hypogammaglobulinemia",
      "Critical Problem: Breakthrough fever despite ongoing posaconazole",
      "Differential Diagnoses: Azole-resistant Candida (e.g. C. glabrata, C. krusei, C. auris), Non-azole-covered mould (Mucorales), or Bacterial sepsis",
      "Immediate Action: Two sets of blood cultures drawn (1 peripheral, 1 through chemoport)",
    ],
    speakerNotes: "Ask participants: What are the primary reasons for breakthrough infection on mould-active prophylaxis? (1. Subtherapeutic TDM level, 2. Non-compliance, 3. Inherently resistant organism like Mucorales or C. glabrata).",
  },
  {
    slideNumber: 4,
    title: "Decision Point 1: Infection vs Colonization & Diagnostics",
    bullets: [
      "At 14 Hours: Chemoport and peripheral blood bottles flag positive for budding yeast",
      "Urinalysis: Moderate yeast seen in clean catch urine",
      "Sputum: Scant normal flora",
      "Clinical State: Patient remains in ICU on low-dose norepinephrine",
    ],
    audienceQuestion: "Poll: Can we attribute this positive blood culture to catheter colonization alone without starting systemic therapy?",
    answerRationale: "CORRECT ANSWER: NO. Any yeast in a blood culture is a medical emergency representing true invasive candidiasis until proven otherwise. Never dismiss positive blood culture as a contaminant or colonization. Immediate initiation of antifungal therapy is mandatory.",
    evidenceCitation: "ECMM/ISHAM/ASM Global Candidiasis Guideline 2025 (PMID: 39956121).",
  },
  {
    slideNumber: 5,
    title: "Diagnostic Action Plan: Test-to-Action Framework",
    bullets: [
      "Repeat Daily Blood Cultures: Must obtain blood cultures every 24h until documented clearance (Day 1 of 14 starts at first negative culture)",
      "Rapid Species Identification: Order MALDI-TOF or Multiplex Blood Culture PCR for immediate speciation",
      "Antifungal Susceptibility Testing: Mandatory for all bloodstream isolates (Echinocandins + Azoles with EUCAST/CLSI breakpoints)",
      "Baseline Dilated Ophthalmic Exam: To exclude Candida endophthalmitis (within 1 week, or once conscious)",
      "Echocardiogram (TTE/TEE): Recommended if persistent candidemia >48h or prosthetic valve",
    ],
    speakerNotes: "Emphasize that the 14-day duration clock does NOT start on the day therapy begins; it starts on the day of documented negative blood cultures.",
  },
  {
    slideNumber: 6,
    title: "Decision Point 2: Initial Antifungal Regimen Selection",
    bullets: [
      "Patient is in septic shock with acute kidney injury (CrCl 34 mL/min)",
      "Patient was on Posaconazole at time of breakthrough",
      "Yeast morphology: Small budding yeast without pseudohyphae (suspicious for C. glabrata)",
    ],
    audienceQuestion: "What is the guideline-recommended first-line empiric regimen?",
    answerRationale: "CORRECT ANSWER: An Echinocandin (Anidulafungin 200mg load then 100mg daily, Caspofungin 70mg load then 50mg daily, or Micafungin 100mg daily). Fluconazole is inappropriate due to breakthrough on an azole and high risk of azole-resistant C. glabrata. Liposomal Amphotericin B is alternative if echinocandin resistance is suspected.",
    evidenceCitation: "ECMM Candidiasis Guideline 2025 & BSMM 2026 Update.",
  },
  {
    slideNumber: 7,
    title: "48–72h Update: Speciation, Susceptibility & Posaconazole Level",
    bullets: [
      "MALDI-TOF Result: Candida glabrata (Nakaseomyces glabratus)",
      "CLSI Microdilution MICs: Fluconazole MIC = 64 mg/L (Resistant); Anidulafungin MIC = 0.03 mg/L (Susceptible)",
      "Posaconazole Trough Level (drawn at admission): 0.42 mg/L (Subtherapeutic, target >0.7-1.0 mg/L)",
      "Repeat Blood Cultures at 48h: Repeat set 1 still positive; Repeat set 2 at 72h negative (Clearance confirmed Day 3)",
      "Source Control: Chemoport removed on Day 2; tip culture grew >15 CFU C. glabrata",
    ],
    speakerNotes: "The subtherapeutic posaconazole trough explained the breakthrough. C. glabrata has high baseline azole resistance.",
  },
  {
    slideNumber: 8,
    title: "Pharmacist Stewardship Intervention: Optimization & Step-Down",
    bullets: [
      "Maintain Echinocandin: Continue Anidulafungin 100 mg IV daily (susceptible isolate, normal liver function)",
      "Do NOT step down to Oral Fluconazole: Isolate is resistant (MIC 64 mg/L)",
      "Oral Step-down Option: If clinically stable, afebrile, and oral route required, consider oral Voriconazole only if MIC is proven susceptible, or continue IV echinocandin",
      "Duration: 14 days from Day 3 (documented negative blood culture) = Total therapy through Day 17",
      "Ophthalmology: Bedside dilated fundus exam performed Day 4: No chorioretinal lesions",
    ],
    speakerNotes: "Review oral step-down criteria: clinical stability, clearance documented, isolate susceptible, able to take oral medications.",
  },
  {
    slideNumber: 9,
    title: "Patient Outcome, Stewardship KPIs & Pitfalls",
    bullets: [
      "Clinical Course: Vasopressors weaned at 48h, acute kidney injury resolved (Cr back to 1.0 mg/dL)",
      "Stewardship KPIs Met: Candidemia 5-point bundle completed 100% within 72 hours",
      "What Could Have Gone Wrong: (1) Continuing azole monotherapy, (2) Leaving infected chemoport in situ leading to endocarditis, (3) Stopping therapy at 7 days instead of 14 days post-clearance",
    ],
    visualOrTable: "Bundle Checklist: [x] Echinocandin First-line, [x] Port Removed, [x] Daily BCs to Clearance, [x] Eye Exam Done, [x] 14d Post-clearance count",
    evidenceCitation: "Ibrahim MM et al. Inform Health Soc Care 2026 (PMID: 41706911).",
  },
  {
    slideNumber: 10,
    title: "Five Key Take-Home Messages for Clinical Pharmacists",
    bullets: [
      "1. Breakthrough on Azole Prophylaxis = Assume resistant pathogen and immediately check trough TDM level.",
      "2. Echinocandins are cornerstone first-line therapy for candidemia across adult ICU and oncology patients.",
      "3. The 14-day duration clock strictly begins on the date of FIRST NEGATIVE blood culture, not date of diagnosis.",
      "4. Source control (early CVC removal) is non-negotiable for catheter-associated candidemia.",
      "5. Step-down to fluconazole requires documented clearance AND species susceptibility (never for C. krusei or resistant C. glabrata).",
    ],
    evidenceCitation: "Cornely OA et al. Lancet Infect Dis 2025; Schelenz S et al. 2026; Stemler J et al. 2026.",
  },
];

export const InteractiveDeckViewer: React.FC<InteractiveDeckViewerProps> = ({
  deckMarkdown,
  onGenerateNewDeck,
  isLoading = false,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [customTopic, setCustomTopic] = useState<string>("");

  const slides: SlideContent[] = deckMarkdown
    ? parseTeachingDeck(deckMarkdown).length >= 2
      ? parseTeachingDeck(deckMarkdown)
      : SAMPLE_FALLBACK_DECK
    : SAMPLE_FALLBACK_DECK;

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
  };

  const toggleAnswer = (slideNum: number) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [slideNum]: !prev[slideNum],
    }));
  };

  const handleCopyDeck = () => {
    const text = slides
      .map(
        (s) =>
          `### Slide ${s.slideNumber}: ${s.title}\n${s.bullets.map((b) => `- ${b}`).join("\n")}${
            s.speakerNotes ? `\n\nSpeaker Notes: ${s.speakerNotes}` : ""
          }${s.audienceQuestion ? `\n\nAudience Question: ${s.audienceQuestion}` : ""}${
            s.answerRationale ? `\nCorrect Answer: ${s.answerRationale}` : ""
          }${s.evidenceCitation ? `\nEvidence: ${s.evidenceCitation}` : ""}`
      )
      .join("\n\n---\n\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Top Banner & Generation Controls */}
      <div className="flex flex-col gap-4 rounded-2xl bg-linear-to-r from-indigo-900 to-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-400/40">
              Mode: /deck
            </span>
            <span className="text-xs text-slate-300">10-Slide Interactive Presentation</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Unfolding Case-Based Teaching Deck</h2>
          <p className="text-xs text-slate-300">
            Interactive clinical pharmacy education module with hidden audience polls and evidence rationales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDeck}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Deck"}
          </button>
        </div>
      </div>

      {/* Slide Navigation Stepper */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 no-scrollbar dark:border-slate-800 dark:bg-slate-900">
        {slides.map((s, idx) => {
          const isCurrent = idx === currentSlideIndex;
          return (
            <button
              key={s.slideNumber || idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                isCurrent
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Slide Card */}
      <div className="relative min-h-[440px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        {/* Slide Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Slide {currentSlide.slideNumber} of {slides.length}
            </span>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
              {currentSlide.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                showSpeakerNotes
                  ? "bg-amber-50 text-amber-800 ring-1 ring-amber-500/20 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              {showSpeakerNotes ? "Hide Notes" : "Speaker Notes"}
            </button>
          </div>
        </div>

        {/* Slide Bullets */}
        <div className="space-y-3">
          {currentSlide.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
              <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {bullet}
              </p>
            </div>
          ))}
        </div>

        {/* Visual / Table Suggestion */}
        {currentSlide.visualOrTable && (
          <div className="mt-6 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              <Layers className="h-3.5 w-3.5" />
              Suggested Visual / Flowchart
            </div>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-mono">
              {currentSlide.visualOrTable}
            </p>
          </div>
        )}

        {/* Audience Poll & Interactive Reveal */}
        {currentSlide.audienceQuestion && (
          <div className="mt-6 rounded-xl border-2 border-indigo-300 bg-linear-to-b from-indigo-50/70 to-slate-50 p-5 dark:border-indigo-700/60 dark:from-indigo-950/40 dark:to-slate-900">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-200">
              <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Audience Poll / Decision Point
            </div>
            <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
              {currentSlide.audienceQuestion}
            </p>

            <div className="mt-4">
              <button
                onClick={() => toggleAnswer(currentSlide.slideNumber)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
              >
                {revealedAnswers[currentSlide.slideNumber] ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Hide Answer & Rationale
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Reveal Correct Answer & Rationale
                  </>
                )}
              </button>

              {revealedAnswers[currentSlide.slideNumber] && currentSlide.answerRationale && (
                <div className="mt-3 rounded-lg border border-teal-200 bg-teal-50/80 p-3.5 text-xs leading-relaxed text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
                  <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300 mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                    Clinical Evidence Rationale:
                  </div>
                  {currentSlide.answerRationale}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evidence Citation */}
        {currentSlide.evidenceCitation && (
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            <span>
              <strong>Evidence Grounding:</strong> {currentSlide.evidenceCitation}
            </span>
          </div>
        )}

        {/* Speaker Notes Drawer */}
        {showSpeakerNotes && currentSlide.speakerNotes && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
            <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Presenter / Speaker Notes:
            </div>
            <p className="leading-relaxed">{currentSlide.speakerNotes}</p>
          </div>
        )}
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Slide
        </button>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Slide {currentSlideIndex + 1} of {slides.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentSlideIndex === slides.length - 1}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-indigo-700 disabled:opacity-40"
        >
          Next Slide
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Generate Custom Deck Form */}
      {onGenerateNewDeck && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Generate Custom 10-Slide Interactive Deck
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Specify a clinical scenario (e.g., Mucormycosis in Renal Transplant, Voriconazole-Tacrolimus TDM, or Neonatal Candidemia).
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Aspergillosis breakthrough in AML on posaconazole with CYP3A4 interactions..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              onClick={() => {
                if (customTopic.trim()) {
                  onGenerateNewDeck(customTopic);
                }
              }}
              disabled={isLoading || !customTopic.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Build Deck"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
