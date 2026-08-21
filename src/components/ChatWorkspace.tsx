import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Layers,
  FileText,
  AlertTriangle,
  Stethoscope,
  Activity,
  Droplets,
  ShieldAlert,
  Clock,
  BarChart3,
  BookOpen,
  PlusCircle,
  HelpCircle,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { ChatMessage, StewardshipMode, CaseTemplate } from "../types";
import { STEWARDSHIP_MODES } from "../data/modes";
import { CASE_TEMPLATES } from "../data/caseTemplates";
import { extractSbarNote, isTeachingDeck } from "../utils/parser";

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, mode?: StewardshipMode) => void;
  isLoading: boolean;
  selectedMode: StewardshipMode;
  setSelectedMode: (mode: StewardshipMode) => void;
  searchGrounding: boolean;
  onLaunchDeck: (markdown: string) => void;
  onClearChat: () => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedMode,
  setSelectedMode,
  searchGrounding,
  onLaunchDeck,
  onClearChat,
}) => {
  const [input, setInput] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSbarId, setCopiedSbarId] = useState<string | null>(null);
  const [showCaseBuilder, setShowCaseBuilder] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Structured Case Builder Fields
  const [builderAge, setBuilderAge] = useState<string>("62");
  const [builderSex, setBuilderSex] = useState<string>("Female");
  const [builderWeight, setBuilderWeight] = useState<string>("74");
  const [builderHost, setBuilderHost] = useState<string>("Emergency Hartmann procedure for perforated diverticulitis with septic shock");
  const [builderMicro, setBuilderMicro] = useState<string>("Blood culture: Yeast cells visible on Gram stain at 18h; species pending");
  const [builderDrug, setBuilderDrug] = useState<string>("Fluconazole 200 mg IV daily");
  const [builderCrCl, setBuilderCrCl] = useState<string>("38 mL/min (Serum Cr 1.6 mg/dL)");
  const [builderLfts, setBuilderLfts] = useState<string>("AST 45, ALT 52, T.Bili 0.8");
  const [builderLines, setBuilderLines] = useState<string>("Right internal jugular triple-lumen CVC placed 8 days ago with TPN");
  const [builderOtherMeds, setBuilderOtherMeds] = useState<string>("Meropenem 1g q12h, Norepinephrine, Fentanyl");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), selectedMode);
    setInput("");
  };

  const handleSelectTemplate = (template: CaseTemplate) => {
    setSelectedMode(template.mode);
    onSendMessage(template.prompt, template.mode);
  };

  const handleBuildCaseSubmit = () => {
    const prompt = `${selectedMode} Review this de-identified clinical antifungal case:
- Patient Demographics: ${builderAge}yo ${builderSex}, Weight: ${builderWeight} kg
- Host Risk & Clinical History: ${builderHost}
- Microbiology & Biomarkers: ${builderMicro}
- Current Antifungal & Dose: ${builderDrug}
- Organ Function: CrCl ${builderCrCl}; LFTs: ${builderLfts}
- Lines & Source Control: ${builderLines}
- Concomitant Medications: ${builderOtherMeds}
Please provide a full antifungal stewardship assessment, pharmacist action table, regimen evaluation, diagnostic test-to-action plan, 48-72h decision rules, an editable SBAR note, and evidence citations.`;

    setShowCaseBuilder(false);
    onSendMessage(prompt, selectedMode);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopySbar = (id: string, sbarText: string) => {
    navigator.clipboard.writeText(sbarText);
    setCopiedSbarId(id);
    setTimeout(() => setCopiedSbarId(null), 2000);
  };

  const currentMode = STEWARDSHIP_MODES.find((m) => m.id === selectedMode) || STEWARDSHIP_MODES[0];

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col bg-slate-50 dark:bg-slate-950">
      {/* Operating Mode Bar */}
      <div className="border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
              Mode:
            </span>
            {STEWARDSHIP_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                  title={mode.shortDesc}
                >
                  <span>{mode.id}</span>
                  <span className="hidden sm:inline font-normal">({mode.name})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCaseBuilder(!showCaseBuilder)}
              className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 shadow-2xs hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Structured Case Intake</span>
            </button>

            {messages.length > 0 && (
              <button
                onClick={onClearChat}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                title="Clear Conversation"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Case Builder Drawer Modal */}
      {showCaseBuilder && (
        <div className="border-b border-teal-100 bg-teal-50/40 p-4 dark:border-teal-900/40 dark:bg-teal-950/20">
          <div className="mx-auto max-w-5xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-teal-600" />
                Structured Antifungal Case Intake Form
              </h4>
              <button
                onClick={() => setShowCaseBuilder(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Age & Sex</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={builderAge}
                    onChange={(e) => setBuilderAge(e.target.value)}
                    placeholder="Age (e.g. 62)"
                    className="w-1/2 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    value={builderSex}
                    onChange={(e) => setBuilderSex(e.target.value)}
                    placeholder="Sex"
                    className="w-1/2 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Weight (kg)</label>
                <input
                  type="text"
                  value={builderWeight}
                  onChange={(e) => setBuilderWeight(e.target.value)}
                  placeholder="e.g. 74 kg"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Current Antifungal & Dose</label>
                <input
                  type="text"
                  value={builderDrug}
                  onChange={(e) => setBuilderDrug(e.target.value)}
                  placeholder="e.g. Fluconazole 200mg IV daily"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Host Risk & Presentation</label>
                <input
                  type="text"
                  value={builderHost}
                  onChange={(e) => setBuilderHost(e.target.value)}
                  placeholder="e.g. ICU shock, bowel resection, neutropenia, transplant..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Microbiology / Biomarkers / MICs</label>
                <input
                  type="text"
                  value={builderMicro}
                  onChange={(e) => setBuilderMicro(e.target.value)}
                  placeholder="e.g. Blood bottle yeast at 18h, galactomannan 1.8..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">CrCl & Renal Status</label>
                <input
                  type="text"
                  value={builderCrCl}
                  onChange={(e) => setBuilderCrCl(e.target.value)}
                  placeholder="e.g. 38 mL/min (Cr 1.6)"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Lines & Source Control</label>
                <input
                  type="text"
                  value={builderLines}
                  onChange={(e) => setBuilderLines(e.target.value)}
                  placeholder="e.g. CVC Day 8 with TPN, urinary catheter..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Concomitant Interacting Meds</label>
                <input
                  type="text"
                  value={builderOtherMeds}
                  onChange={(e) => setBuilderOtherMeds(e.target.value)}
                  placeholder="e.g. Tacrolimus, Venetoclax, Meropenem..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleBuildCaseSubmit}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-500"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Submit Case for AI Stewardship Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Welcome Screen when Empty */}
          {messages.length === 0 && (
            <div className="space-y-6 py-4">
              {/* De-identification & Compliance Banner */}
              <div className="flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900/50 dark:bg-teal-950/30">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="text-xs text-teal-950 dark:text-teal-200">
                  <strong>Clinical Decision-Support & De-identified Data Only:</strong> FungiSteward-AI is an evidence-grounded clinical copilot designed for pharmacists and multidisciplinary stewardship teams. Always use de-identified patient data. Final recommendations require confirmation against local protocols and treating clinical teams.
                </div>
              </div>

              {/* Mode Hero */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  <Sparkles className="h-4 w-4" />
                  Active Operating Mode: {currentMode.id}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                  {currentMode.name}
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentMode.shortDesc}. Reconstructs timelines, separates colonization from invasive infection, validates loading and renal-adjusted dosing, audits source control, checks drug interactions, generates editable SBAR notes, and defines 48–72h step-down rules.
                </p>

                {/* Preset Clinical Cases */}
                <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    High-Yield Clinical Case Presets (Click to Execute)
                  </span>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {CASE_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl)}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left shadow-2xs transition-all hover:border-teal-500 hover:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-white px-2 py-0.5 text-2xs font-bold text-teal-700 shadow-2xs dark:bg-slate-900 dark:text-teal-300">
                              {tmpl.mode}
                            </span>
                            <span className="text-2xs font-semibold text-slate-400">{tmpl.category}</span>
                          </div>
                          <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-400">
                            {tmpl.title}
                          </h4>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
                            {tmpl.summary}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-2xs font-semibold text-teal-600 dark:text-teal-400">
                          <span>Run Case Review</span>
                          <Zap className="h-3 w-3" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages Loop */}
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const sbarNote = !isUser ? extractSbarNote(msg.content) : null;
            const hasTeachingDeck = !isUser && isTeachingDeck(msg.content);
            const isUrgent = msg.content.includes("URGENT ESCALATION") || msg.content.includes("Urgency: Urgent escalation");

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {/* User Prompt Message */}
                {isUser ? (
                  <div className="max-w-2xl rounded-2xl bg-teal-700 px-5 py-3.5 text-xs text-white shadow-xs sm:text-sm">
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <span className="mt-1.5 block text-right text-2xs text-teal-200">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  /* Assistant Full Clinical Output */
                  <div className="w-full space-y-4">
                    {/* Urgent Escalation Callout if present */}
                    {isUrgent && (
                      <div className="flex items-center gap-2.5 rounded-2xl border-2 border-rose-500 bg-rose-50 p-4 text-rose-950 dark:bg-rose-950/50 dark:text-rose-200">
                        <AlertTriangle className="h-5 w-5 text-rose-600 animate-pulse shrink-0" />
                        <div className="text-xs font-bold">
                          URGENT ESCALATION REQUIRED: Immediate medical/surgical specialist consultation or life-saving antifungal therapy adjustment indicated.
                        </div>
                      </div>
                    )}

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                      {/* Message Actions Bar */}
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                            <ShieldAlert className="h-4 w-4" />
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            FungiSteward-AI Response
                          </span>
                          {msg.mode && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-2xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {msg.mode}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {hasTeachingDeck && (
                            <button
                              onClick={() => onLaunchDeck(msg.content)}
                              className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                            >
                              <Layers className="h-3.5 w-3.5" />
                              Interactive Slide Presenter
                            </button>
                          )}

                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-teal-600" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy Full Note
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Rendered Markdown Body */}
                      <div className="prose prose-slate max-w-none text-xs sm:text-sm dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-h4:text-base prose-h4:text-teal-700 dark:prose-h4:text-teal-400 prose-h4:border-b prose-h4:border-slate-100 dark:prose-h4:border-slate-800 prose-h4:pb-1.5 prose-table:text-xs prose-th:bg-slate-50 dark:prose-th:bg-slate-800 prose-th:p-2.5 prose-td:p-2.5 prose-td:border-b prose-td:border-slate-100 dark:prose-td:border-slate-800">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      {/* Dedicated SBAR Note Copy Card if extracted */}
                      {sbarNote && (
                        <div className="mt-6 rounded-2xl border-2 border-teal-300 bg-linear-to-r from-teal-50/70 to-slate-50 p-5 dark:border-teal-800 dark:from-teal-950/40 dark:to-slate-900">
                          <div className="flex items-center justify-between border-b border-teal-200 pb-3 dark:border-teal-800">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-teal-700 dark:text-teal-400" />
                              <h5 className="text-xs font-bold text-teal-950 dark:text-teal-200">
                                SBAR Pharmacist EHR Communication Note (Ready to Paste)
                              </h5>
                            </div>

                            <button
                              onClick={() => handleCopySbar(msg.id, sbarNote)}
                              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-500"
                            >
                              {copiedSbarId === msg.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  Copied SBAR
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy SBAR Note
                                </>
                              )}
                            </button>
                          </div>

                          <div className="mt-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono bg-white/70 p-3 rounded-xl dark:bg-slate-950/50">
                            {sbarNote}
                          </div>
                        </div>
                      )}

                      {/* Grounding Sources */}
                      {msg.groundingSources && msg.groundingSources.length > 0 && (
                        <div className="mt-6 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Live Grounded Web Sources:
                          </span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {msg.groundingSources.map((source, sIdx) => (
                              <a
                                key={sIdx}
                                href={source.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-2xs font-medium text-blue-700 hover:underline dark:bg-blue-950 dark:text-blue-300"
                              >
                                {source.title || source.uri}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                FungiSteward-AI is synthesizing clinical timeline, MIC breakpoints, and therapeutic drug monitoring...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Prompt Box */}
      <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="mx-auto max-w-5xl">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 shadow-2xs focus-within:border-teal-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-teal-500 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:bg-slate-800">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={`Enter clinical case or command (e.g. ${currentMode.id} Review 62yo F with yeast in blood culture... Shift+Enter for new line)`}
              className="w-full resize-none bg-transparent p-3.5 pr-20 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden dark:text-slate-100 sm:text-sm"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs transition-colors hover:bg-teal-500 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between px-1 text-2xs text-slate-400 dark:text-slate-500">
            <span>
              Supports /case, /timeout, /candidemia, /mold, /tdm, /deck, /audit, /policy
            </span>
            <span>Temperature: 0.15 (High Precision Clinical Reasoning)</span>
          </div>
        </form>
      </div>
    </div>
  );
};
