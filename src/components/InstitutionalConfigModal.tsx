import React, { useState, useEffect } from "react";
import { X, Save, RotateCcw, Hospital, ShieldCheck, Check } from "lucide-react";
import { InstitutionalConfig } from "../types";

interface InstitutionalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: InstitutionalConfig;
  onSaveConfig: (newConfig: InstitutionalConfig) => void;
}

export const InstitutionalConfigModal: React.FC<InstitutionalConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<InstitutionalConfig>(config);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    setFormData(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <Hospital className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Institutional Formulary & Antibiogram Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground AI reasoning against your local hospital protocols and resistance rates.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Hospital & Unit */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Institution Name</label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Primary Clinical Unit</label>
              <input
                type="text"
                value={formData.unitType}
                onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* First-line Preferences */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Formulary First-Line for Candidemia
              </label>
              <select
                value={formData.candidemiaFirstLine}
                onChange={(e) => setFormData({ ...formData, candidemiaFirstLine: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Anidulafungin 200mg load then 100mg daily">Anidulafungin (Eraxis)</option>
                <option value="Caspofungin 70mg load then 50mg daily">Caspofungin (Cancidas)</option>
                <option value="Micafungin 100mg daily">Micafungin (Mycamine)</option>
                <option value="Fluconazole 800mg load then 400mg daily">Fluconazole (Selected Low Risk)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Formulary First-Line for Invasive Mould
              </label>
              <select
                value={formData.aspergillosisFirstLine}
                onChange={(e) => setFormData({ ...formData, aspergillosisFirstLine: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Voriconazole IV/PO with TDM">Voriconazole (IV / PO with TDM)</option>
                <option value="Isavuconazole IV/PO (Cresemba)">Isavuconazonium sulfate (Cresemba)</option>
                <option value="Liposomal Amphotericin B 3-5 mg/kg">Liposomal Amphotericin B (AmBisome)</option>
                <option value="Posaconazole DR Tablets">Posaconazole DR Tablets (Noxafil)</option>
              </select>
            </div>
          </div>

          {/* Local Fungal Antibiogram & C. auris Prevalence */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Local C. glabrata Fluconazole Resistance Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.localFluconazoleResistanceGlabrata}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localFluconazoleResistanceGlabrata: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Local Candida auris Epidemiological Status
              </label>
              <select
                value={formData.localCandidaAurisPrevalence}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localCandidaAurisPrevalence: e.target.value as any,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="None/Rare">None / Rare (No known local endemicity)</option>
                <option value="Sporadic">Sporadic Cases (Enhanced IP screening)</option>
                <option value="Endemic">Endemic / Active Outbreak (Strict IP protocol)</option>
              </select>
            </div>
          </div>

          {/* Biomarker Turnaround Times */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Galactomannan Turnaround (Hours)
              </label>
              <input
                type="number"
                value={formData.galactomannanTurnaroundHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    galactomannanTurnaroundHours: parseInt(e.target.value) || 24,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                1,3-Beta-D-Glucan (BDG) Turnaround (Hours)
              </label>
              <input
                type="number"
                value={formData.bdgTurnaroundHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bdgTurnaroundHours: parseInt(e.target.value) || 48,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Custom Institutional Guidance */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Custom Stewardship Restrictions or Notes
            </label>
            <textarea
              rows={3}
              value={formData.customNotes}
              onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
              placeholder="e.g. Liposomal Amphotericin B requires ID approval; Voriconazole TDM automated order set on Day 4..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-teal-500"
            >
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved Profile" : "Save Institutional Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
