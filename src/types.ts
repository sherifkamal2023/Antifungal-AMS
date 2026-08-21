export type StewardshipMode =
  | "/case"
  | "/timeout"
  | "/candidemia"
  | "/mold"
  | "/tdm"
  | "/deck"
  | "/audit"
  | "/policy";

export interface ModeInfo {
  id: StewardshipMode;
  name: string;
  shortDesc: string;
  iconName: string;
  badgeColor: string;
  samplePrompt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  mode?: StewardshipMode;
  groundingSources?: Array<{ uri?: string; title?: string }>;
  isStreaming?: boolean;
}

export interface CaseTemplate {
  id: string;
  title: string;
  mode: StewardshipMode;
  category: "Candidemia" | "Mould" | "TDM & Interactions" | "ICU Time-out" | "Audit & Policy" | "Education Deck";
  description: string;
  summary: string;
  prompt: string;
}

export interface SlideContent {
  slideNumber: number;
  title: string;
  bullets: string[];
  visualOrTable?: string;
  speakerNotes?: string;
  audienceQuestion?: string;
  answerRationale?: string;
  evidenceCitation?: string;
}

export interface AntifungalDrug {
  id: string;
  name: string;
  class: "Echinocandin" | "Triazole" | "Polyene" | "Pyrimidine Analog";
  indications: string[];
  spectrum: {
    candida: string;
    aspergillus: string;
    mucorales: string;
    cryptococcus: string;
    endemic: string;
  };
  adultDosing: {
    loading: string;
    maintenance: string;
    oralAvailable: boolean;
    oralBioavailability?: string;
  };
  adjustments: {
    renal: string;
    hepatic: string;
    obesity: string;
    crrt_ihd: string;
  };
  tdmRequired: boolean;
  tdmTarget?: string;
  tdmSamplingTime?: string;
  majorToxicities: string[];
  qtcEffect: "Prolongs QTc" | "Shortens QTc" | "Neutral / Negligible";
  cypInteractions: string;
  keyMonitoring: string[];
}

export interface DrugInteractionRecord {
  id: string;
  interactingDrug: string;
  category: "Chemotherapy & Targeted" | "Immunosuppressant" | "Cardiovascular & Anticoagulant" | "CNS & Anticonvulsant" | "GI & Other";
  antifungal: string;
  severity: "Contraindicated" | "Major Risk (Dose Adjust / Monitor)" | "Moderate" | "Minor";
  mechanism: string;
  clinicalImpact: string;
  recommendedAction: string;
}

export interface InstitutionalConfig {
  institutionName: string;
  unitType: string;
  candidemiaFirstLine: string;
  aspergillosisFirstLine: string;
  localFluconazoleResistanceGlabrata: number; // percentage
  localCandidaAurisPrevalence: "None/Rare" | "Sporadic" | "Endemic";
  voriconazoleTargetRange: string;
  posaconazoleTargetRange: string;
  bdgTurnaroundHours: number;
  galactomannanTurnaroundHours: number;
  customNotes: string;
}
