export interface EvidenceItem {
  id: string;
  citation: string;
  shortTitle: string;
  journal: string;
  year: number;
  pmid: string;
  doi: string;
  evidenceLevel: "Practice Guideline" | "Systematic Review / Meta-Analysis" | "Randomized Controlled Trial" | "Cohort / Descriptive Study" | "Implementation CDSS";
  keyTakeaway: string;
}

export const SEED_EVIDENCE_BASE: EvidenceItem[] = [
  {
    id: "cornely-2025-candidiasis",
    citation: "Cornely OA, et al. Global guideline for the diagnosis and management of candidiasis: an initiative of the ECMM in cooperation with ISHAM and ASM.",
    shortTitle: "ECMM / ISHAM / ASM Global Candidiasis Guideline",
    journal: "Lancet Infectious Diseases",
    year: 2025,
    pmid: "39956121",
    doi: "10.1016/S1473-3099(24)00749-7",
    evidenceLevel: "Practice Guideline",
    keyTakeaway: "Recommends initial echinocandin therapy for most adults with candidemia, early CVC removal, daily blood cultures to document clearance, baseline ophthalmologic exam, and 14 days duration from first negative blood culture.",
  },
  {
    id: "schelenz-2026-bsmm",
    citation: "Schelenz S, et al. British Society for Medical Mycology best practice recommendations for the diagnosis of serious fungal diseases: 2025/2026 update.",
    shortTitle: "BSMM Best Practice Recommendations for Serious Fungal Diseases",
    journal: "Lancet Infectious Diseases",
    year: 2026,
    pmid: "41232547",
    doi: "10.1016/S1473-3099(25)00550-X",
    evidenceLevel: "Practice Guideline",
    keyTakeaway: "Comprehensive diagnostic framework defining optimal sample collection, galactomannan cutoffs (BAL >=1.0, serum >=0.5), beta-D-glucan limitations, and molecular testing integration.",
  },
  {
    id: "kara-2026-ams-review",
    citation: "Kara E, et al. Pharmacist involvement in antifungal stewardship programs: a systematic review of clinical, utilization, and economic outcomes.",
    shortTitle: "Systematic Review of Pharmacist Antifungal Stewardship",
    journal: "International Journal of Clinical Pharmacy",
    year: 2026,
    pmid: "42029838",
    doi: "10.1007/s11096-026-02149-5",
    evidenceLevel: "Systematic Review / Meta-Analysis",
    keyTakeaway: "Demonstrates consistent improvement in guideline concordance, DOT/DDD utilization, and TDM compliance; clinical outcome improvements (e.g. mortality) vary based on baseline infrastructure.",
  },
  {
    id: "ng-2026-myst",
    citation: "Ng BY, et al. MYcology Stewardship Tool (MyST): a retrospective, descriptive multidisciplinary team review of antifungal prescribing practice in a UK tertiary centre.",
    shortTitle: "Mycology Stewardship Tool (MyST) MDT Review",
    journal: "JAC-Antimicrobial Resistance",
    year: 2026,
    pmid: "42524201",
    doi: "10.1093/jacamr/dlag149",
    evidenceLevel: "Cohort / Descriptive Study",
    keyTakeaway: "Structured MDT stewardship rounds utilizing systematic case templates cut unnecessary empiric antifungal days and identified unoptimized TDM and line management.",
  },
  {
    id: "ibrahim-2026-tdm-cdss",
    citation: "Ibrahim MM, et al. Improving voriconazole therapeutic drug monitoring-guided dosing through a clinical decision support system: enhancing antifungal stewardship.",
    shortTitle: "Voriconazole TDM Clinical Decision Support System",
    journal: "Informatics for Health and Social Care",
    year: 2026,
    pmid: "41706911",
    doi: "10.1080/17538157.2026.2624688",
    evidenceLevel: "Implementation CDSS",
    keyTakeaway: "EHR-integrated TDM-guided clinical decision support increased protocol compliance from 52.2% to 94.7% across 2,199 orders and reduced neurotoxicity events.",
  },
  {
    id: "stemler-2026-aspergillosis-stop",
    citation: "Stemler J, et al. How to safely discontinue antifungal treatment in invasive pulmonary aspergillosis? Clinical considerations in haematology.",
    shortTitle: "Criteria for Discontinuing Invasive Aspergillosis Therapy",
    journal: "Clinical Microbiology and Infection",
    year: 2026,
    pmid: "41796963",
    doi: "10.1016/j.cmi.2026.03.001",
    evidenceLevel: "Practice Guideline",
    keyTakeaway: "Tripartite criteria: complete neutrophil recovery/immunosuppression resolution, clinical symptom resolution, and CT chest documentation of lesion regression or stable scar (avoid stopping purely on a single negative serum GM).",
  },
  {
    id: "miyazaki-2026-pcr-candidemia",
    citation: "Miyazaki K, et al. Effect of polymerase chain reaction-based antifungal stewardship on candidemia management in small- and medium-sized hospitals.",
    shortTitle: "PCR-Based Stewardship in Candidemia Management",
    journal: "Journal of Pharmaceutical Health Care and Sciences",
    year: 2026,
    pmid: "42277927",
    doi: "10.1186/s40780-026-00596-w",
    evidenceLevel: "Cohort / Descriptive Study",
    keyTakeaway: "Rapid molecular identification shortens time to targeted echinocandin or azole therapy, but requires structured pharmacist bundling to achieve hard clinical endpoints.",
  },
  {
    id: "caro-flautero-2026-hematology",
    citation: "Caro Flautero MA, et al. Optimizing Antifungal Use Through Interdisciplinary Intervention in the Hematology Unit.",
    shortTitle: "Interdisciplinary Antifungal Optimization in Hematology",
    journal: "Journal of Fungi",
    year: 2026,
    pmid: "41745271",
    doi: "10.3390/jof12020127",
    evidenceLevel: "Cohort / Descriptive Study",
    keyTakeaway: "Demonstrated feasibility of weekly pharmacist-ID audit and feedback in hematology, reducing targeted therapy delay and dangerous azole-kinase/venetoclax co-prescriptions.",
  },
  {
    id: "li-2026-fluconazole-resistance",
    citation: "Li X, et al. Global prevalence and trends of fluconazole resistance in non-albicans Candida species: a systematic review and meta-analysis.",
    shortTitle: "Global Fluconazole Resistance Trends in Non-albicans Candida",
    journal: "BMC Infectious Diseases",
    year: 2026,
    pmid: "41612235",
    doi: "10.1186/s12879-026-12653-8",
    evidenceLevel: "Systematic Review / Meta-Analysis",
    keyTakeaway: "Highlights steep rising trends in azole resistance among C. glabrata (upwards of 15-25% in high-exposure centers) and emergence of multi-drug resistant C. auris, emphasizing species-level MIC verification before step-down.",
  }
];
