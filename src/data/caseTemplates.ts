import { CaseTemplate } from "../types";

export const CASE_TEMPLATES: CaseTemplate[] = [
  {
    id: "suggested-test-case",
    title: "Suggested First Test Case (Prompt Benchmark)",
    mode: "/case",
    category: "Candidemia",
    description: "Standard benchmark stewardship case testing full reasoning pipeline and SBAR generation.",
    summary: "62yo F in ICU post-bowel resection with central line, new positive yeast in blood culture, empiric fluconazole 200mg daily, CrCl 45 mL/min.",
    prompt: `/case Review this de-identified antifungal case as a stewardship pharmacist:
Patient: 62-year-old female, 74 kg, admitted to Surgical ICU Day 8 post-emergency Hartmann procedure for perforated diverticulitis with septic shock.
Access: Right internal jugular triple-lumen CVC placed on Day 1. Total parenteral nutrition (TPN) running through distal port.
Vitals/Status: Intubated, norepinephrine 0.08 mcg/kg/min, temp 38.6°C, WBC 18.2 x 10^9/L.
Microbiology: Blood culture drawn 24h ago from CVC hub and peripheral vein flagged positive for budding yeast at 18 hours. Gram stain shows yeast cells, species identification and susceptibilities pending.
Current Antifungals: Started on Fluconazole 200 mg IV once daily 6 hours ago by primary team.
Renal/Hepatic: Serum Cr 1.6 mg/dL (baseline 0.9 mg/dL), calculated CrCl 38 mL/min (Cockcroft-Gault). AST 45 U/L, ALT 52 U/L, T.Bili 0.8 mg/dL.
Other Meds: Meropenem 1g q12h (adjusted), Fentanyl infusion, Norepinephrine, Pantoprazole 40mg IV daily.
Questions for stewardship: Evaluate drug selection, loading dose, maintenance dose, central line management, missing bundle diagnostics, and 48-72h step-down / decision rules. Finish with an editable SBAR note and evidence references.`,
  },
  {
    id: "aspergillus-neutropenic-fever",
    title: "Invasive Pulmonary Aspergillosis in AML Induction",
    mode: "/mold",
    category: "Mould",
    description: "High-risk hematology patient with persistent neutropenic fever, halo sign on CT, and pending voriconazole TDM.",
    summary: "54yo M with AML undergoing 7+3 induction, Day 14 profound neutropenia (ANC 0.05), new hemoptysis, serum galactomannan index 1.8.",
    prompt: `/mold Comprehensive mould stewardship review:
Patient: 54-year-old male, 82 kg, Day 14 post 7+3 induction for acute myeloid leukemia (AML).
Host Risk: Absolute Neutrophil Count (ANC) < 0.1 x 10^9/L for 14 consecutive days.
Clinical: New pleuritic right-sided chest pain, mild hemoptysis, fever 38.9°C refractory to 5 days of IV Cefepime and Vancomycin.
Diagnostics:
- High-resolution chest CT: 2.2 cm nodular opacity with surrounding ground-glass attenuation ('halo sign') in right upper lobe.
- Serum Galactomannan: 1.8 (Positive, cutoff >= 0.5).
- BAL performed today: Mycological culture pending, BAL Galactomannan index 3.4.
Current Regimen: Primary team ordered Voriconazole 200 mg IV q12h without loading dose.
Concomitant Meds: Venetoclax 400 mg daily (holding), Ondansetron 8mg IV q8h, Pantoprazole 40mg IV daily.
Renal/Hepatic: Serum Cr 1.1 mg/dL, CrCl 85 mL/min, baseline LFTs normal.
Stewardship Tasks: Assess loading dose omission, voriconazole IV vs oral formulations & SBECD, TDM timing and target, QTc and antiemetic interactions, and 48-72h reassessment criteria.`,
  },
  {
    id: "mucormycosis-dka",
    title: "Suspected Rhino-Orbital Mucormycosis in DKA",
    mode: "/mold",
    category: "Mould",
    description: "Emergency surgical & medical escalation for acute necrotic facial/sinus lesion in uncontrolled diabetic ketoacidosis.",
    summary: "48yo M with DKA, unilateral periorbital swelling, black eschar on hard palate, non-septate broad ribbon-like hyphae on frozen biopsy.",
    prompt: `/mold URGENT ESCALATION REVIEW:
Patient: 48-year-old male, 85 kg, presenting with severe Diabetic Ketoacidosis (DKA) (glucose 680 mg/dL, pH 7.12, beta-hydroxybutyrate 5.8 mmol/L).
History: 3 days of progressive right periorbital facial pain, ptosis, and proptosis.
Physical Exam: Necrotic black palatal eschar on hard palate; right facial numbness and unilateral periorbital erythema.
Microbiology/Pathology: Urgent bedside sinus scraping shows wide (10-20 um), ribbon-like, non-septate or sparsely septate hyphae with right-angle branching on calcofluor white and frozen section.
Current Antifungals: Primary team started Voriconazole 400 mg IV q12h x 2 then 200 mg q12h.
Stewardship Tasks: Identify critical spectrum failure (voriconazole lack of Mucorales activity), immediate first-line Liposomal Amphotericin B dosing (5-10 mg/kg), urgent ENT/Oculoplastic surgical debridement escalation, renal pre-hydration protocol, and role of isavuconazole.`,
  },
  {
    id: "voriconazole-tdm-toxicity-interaction",
    title: "Voriconazole TDM >6.5 mg/L & Tacrolimus Neurotoxicity",
    mode: "/tdm",
    category: "TDM & Interactions",
    description: "Allogeneic HSCT recipient with supratherapeutic voriconazole level, visual hallucinations, and elevated tacrolimus.",
    summary: "45yo F post-allogeneic HSCT Day +45 on Tacrolimus and Voriconazole 300mg PO BID; trough VRC 6.8 mg/L, Tacrolimus 22 ng/mL.",
    prompt: `/tdm Therapeutic Drug Monitoring and Toxicity Assessment:
Patient: 45-year-old female, 60 kg, Day +45 post-allogeneic HSCT for ALL with Grade II skin GVHD.
Current Antifungals: Voriconazole 300 mg PO q12h for probable pulmonary aspergillosis (started 10 days ago).
TDM Result: Voriconazole trough level drawn 30 min before morning dose today is 6.8 mg/L (Local institutional reference target: 1.0 - 5.5 mg/L).
Clinical Findings: Patient reports seeing waving floral patterns on the ceiling (visual hallucinations) and tremors.
Concurrent Meds: Tacrolimus 2 mg PO BID (Current Tacrolimus trough: 22.4 ng/mL; target 8-12 ng/mL), Prednisone 20 mg PO daily, Valacyclovir 500 mg daily.
Renal/Hepatic: Serum Cr increased from 0.8 to 1.7 mg/dL over 5 days. ALT 142 U/L, AST 118 U/L, T.Bili 1.4 mg/dL.
Stewardship Tasks: Interpret non-linear voriconazole kinetics, recommend specific dose withholding and reduction percentage, manage tacrolimus toxicity, and recommend repeat TDM sampling timeline.`,
  },
  {
    id: "icu-48h-timeout-candiduria",
    title: "48-Hour Time-Out: Asymptomatic Candiduria & Colonization",
    mode: "/timeout",
    category: "ICU Time-out",
    description: "Stewardship de-escalation review for positive Candida in sputum and Foley catheter in a non-neutropenic patient.",
    summary: "71yo M in Medical ICU on Caspofungin 50mg daily for 3 days with Candida albicans in endotracheal aspirate and Foley bag urine.",
    prompt: `/timeout 48-Hour Antifungal Time-out Review:
Patient: 71-year-old male with COPD exacerbation and aspiration pneumonia on mechanical ventilation Day 4.
Antifungal: Caspofungin 70 mg load then 50 mg IV daily started 72 hours ago empirically for 'fever and infiltrates'.
Microbiology:
- Blood cultures x 2 sets drawn at admission: NO GROWTH at 72 hours.
- Endotracheal aspirate: Heavy growth Candida albicans (>100,000 CFU/mL) and normal oral flora.
- Urine culture from indwelling catheter: >100,000 CFU/mL Candida albicans.
Clinical Status: Afebrile for 36 hours, WBC normalized to 8.4 x 10^9/L, extubated today. Foley catheter still in place.
Questions: Distinguish colonization/contamination from invasive candidiasis, evaluate caspofungin urinary penetration limitations, recommend discontinuation of caspofungin, Foley catheter exchange, and criteria for surveillance.`,
  },
  {
    id: "teaching-deck-unfolding-case",
    title: "10-Slide Interactive Pharmacist Teaching Deck",
    mode: "/deck",
    category: "Education Deck",
    description: "Generate an unfolding case-based interactive presentation for clinical pharmacy residents and AMS team.",
    summary: "Unfolding clinical scenario of Candida glabrata breakthrough candidemia in an oncology patient on posaconazole prophylaxis.",
    prompt: `/deck Create an interactive 10-slide unfolding case-based teaching deck for hospital pharmacists and ID fellows:
Scenario: 58-year-old male with relapsed Multiple Myeloma on Posaconazole prophylaxis who develops breakthrough fever, septic shock, and yeast in blood cultures (subsequently identified as Candida glabrata with high azole and echinocandin MICs).
Include all 10 standard slides with speaker notes, audience questions, revealable rationales, and evidence citations.`,
  },
  {
    id: "antifungal-audit-dashboard-kpi",
    title: "Antifungal Stewardship Program Audit & KPI Framework",
    mode: "/audit",
    category: "Audit & Policy",
    description: "Design comprehensive audit parameters, DOT/1000 PD tracking, candidemia bundle metrics, and balancing safety measures.",
    summary: "Establish tertiary hospital antifungal stewardship metrics, numerator/denominator definitions, and monthly dashboard targets.",
    prompt: `/audit Design an institutional Antifungal Stewardship Program (ASP) audit and dashboard metric framework for our 650-bed tertiary university hospital with adult hematology/BMT, surgical/medical ICUs, and solid organ transplant services.
Include DOT/1000 patient-days, DDD/100 bed-days, candidemia bundle compliance %, 48-72h time-out rate, TDM compliance, and balancing clinical measures.`,
  }
];
