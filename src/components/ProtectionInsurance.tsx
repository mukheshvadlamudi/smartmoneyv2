import React, { useState } from "react";
import { UserFinancialState, InsurancePolicy } from "../types";
import { 
  ShieldCheck, HelpCircle, Sparkles, AlertTriangle, BookOpen, Clock, 
  CheckCircle2, Info, ChevronRight, Landmark, Plus 
} from "lucide-react";

interface ProtectionInsuranceProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
}

export default function ProtectionInsurance({ financialState, setFinancialState }: ProtectionInsuranceProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    type: "health" as InsurancePolicy["type"],
    coverage: 500000,
    premium: 1200,
    deductible: 5000,
    coPay: 10
  });

  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(financialState.policies[0]?.id || null);

  const handleCreatePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicy.name.trim()) return;

    if (editingPolicyId) {
      setFinancialState(prev => ({
        ...prev,
        policies: prev.policies.map(p => p.id === editingPolicyId ? {
          ...p,
          name: newPolicy.name,
          type: newPolicy.type,
          coverage: Number(newPolicy.coverage),
          premium: Number(newPolicy.premium),
          deductible: Number(newPolicy.deductible),
          coPay: Number(newPolicy.coPay),
          jargonKeyTerms: [
            { term: "Deductible Split", explanation: "You pay terms up to the deductible limit, after which active coverage is valid." },
            { term: "Co-Payment Portion", explanation: `The specific ${newPolicy.coPay}% ratio of final billed charges that you split.` }
          ]
        } : p)
      }));
      setEditingPolicyId(null);
    } else {
      const created: InsurancePolicy = {
        id: "pol_" + Date.now(),
        name: newPolicy.name,
        type: newPolicy.type,
        coverage: Number(newPolicy.coverage),
        premium: Number(newPolicy.premium),
        premiumFrequency: "monthly",
        deductible: Number(newPolicy.deductible),
        coPay: Number(newPolicy.coPay),
        jargonKeyTerms: [
          { term: "Deductible Split", explanation: "You pay terms up to the deductible limit, after which active coverage is valid." },
          { term: "Co-Payment Portion", explanation: `The specific ${newPolicy.coPay}% ratio of final billed charges that you split.` }
        ],
        lapsedStatus: false
      };

      setFinancialState(prev => ({
        ...prev,
        policies: [...prev.policies, created]
      }));

      setSelectedPolicyId(created.id);
    }

    setShowAddForm(false);
    setNewPolicy({
      name: "",
      type: "health",
      coverage: 500000,
      premium: 1200,
      deductible: 5000,
      coPay: 10
    });
  };

  const handleErasePolicy = (id: string) => {
    setFinancialState(prev => ({
      ...prev,
      policies: prev.policies.filter(p => p.id !== id)
    }));
    if (selectedPolicyId === id) {
      setSelectedPolicyId(null);
    }
  };

  const selectedPolicy = financialState.policies.find(p => p.id === selectedPolicyId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-600 font-mono">Mitigation & Safety</span>
          <h2 className="text-2xl font-sans tracking-tight font-medium text-slate-800">Protection & Insurance Workspace</h2>
          <p className="text-slate-700 text-sm font-light mt-1">Audit active healthcare buffers, resolve policy wording terms, and ask the conversational claims advisor helper.</p>
        </div>

        <button
          onClick={() => {
            if (showAddForm) {
              setEditingPolicyId(null);
              setNewPolicy({
                name: "",
                type: "health",
                coverage: 500000,
                premium: 1200,
                deductible: 5000,
                coPay: 10
              });
            }
            setShowAddForm(prev => !prev);
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {showAddForm ? "Collapse Policy Builder" : "Integrate Protective Cover"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreatePolicySubmit} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 flex flex-col justify-end">
            <label className="text-xs text-slate-600 font-semibold uppercase font-mono">Policy Name / Insurer</label>
            <input 
              type="text" 
              placeholder="e.g., Tata AIG Gold, Max Health Companion"
              value={newPolicy.name}
              onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-slate-900 text-xs text-slate-800 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-semibold uppercase font-mono">Coverage Type</label>
              <select
                value={newPolicy.type}
                onChange={(e) => setNewPolicy({ ...newPolicy, type: e.target.value as InsurancePolicy["type"] })}
                className="w-full p-2.5 border border-[#E2E8F0] bg-white rounded-xl focus:outline-none text-xs text-slate-750 font-medium"
              >
                <option value="health">Healthcare Policy</option>
                <option value="gadget">Personal Device Buffer</option>
                <option value="life">Term Life Asset</option>
                <option value="travel">Global Travel Cover</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-semibold uppercase font-mono">Total Covered limit (₹)</label>
              <input 
                type="number" 
                value={newPolicy.coverage}
                onChange={(e) => setNewPolicy({ ...newPolicy, coverage: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-semibold uppercase font-mono">Premium / mo (₹)</label>
              <input 
                type="number" 
                value={newPolicy.premium}
                onChange={(e) => setNewPolicy({ ...newPolicy, premium: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-semibold uppercase font-mono">Deductible Outlay (₹)</label>
              <input 
                type="number" 
                value={newPolicy.deductible}
                onChange={(e) => setNewPolicy({ ...newPolicy, deductible: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-semibold uppercase font-mono font-light">Co-Pay Split %</label>
              <input 
                type="number" 
                value={newPolicy.coPay}
                onChange={(e) => setNewPolicy({ ...newPolicy, coPay: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => {
                setShowAddForm(false);
                setEditingPolicyId(null);
                setNewPolicy({
                  name: "",
                  type: "health",
                  coverage: 500000,
                  premium: 1200,
                  deductible: 5000,
                  coPay: 10
                });
              }}
              className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 text-xs rounded-xl"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
            >
              {editingPolicyId ? "Update Policy Parameters" : "Add Protective Entry"}
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left policy catalogs */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 font-mono">Active Protectors</h3>
          
          <div className="space-y-3">
            {financialState.policies.map((p) => {
              const isSelected = p.id === selectedPolicyId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPolicyId(p.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                    isSelected ? "border-slate-900 bg-slate-50/50" : "border-slate-100 hover:border-slate-200 bg-[#FBFBFD]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-xs text-slate-800 truncate block max-w-[155px]">{p.name}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setEditingPolicyId(p.id);
                          setNewPolicy({
                            name: p.name,
                            type: p.type,
                            coverage: p.coverage,
                            premium: p.premium,
                            deductible: p.deductible,
                            coPay: p.coPay
                          });
                          setShowAddForm(true);
                        }}
                        className="text-slate-350 hover:text-indigo-600 rounded transition-colors text-xxs font-light"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleErasePolicy(p.id); }}
                        className="text-slate-350 hover:text-rose-500 rounded transition-colors text-xxs font-light"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-xxs block text-slate-600 mt-2 font-mono">
                    <span>Limit: ₹{p.coverage.toLocaleString()}</span>
                    <span>₹{p.premium}/mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Policy Jargon Translator and Conversational assistant */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPolicy ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xxs uppercase tracking-wider text-indigo-600 font-semibold font-mono">Protection Policy detail</span>
                    <h3 className="text-base font-semibold text-slate-800 block">{selectedPolicy.name}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase block text-slate-600 font-mono">Monthly Premium</span>
                  <span className="text-sm font-semibold text-slate-800 font-mono">₹{selectedPolicy.premium.toLocaleString()}</span>
                </div>
              </div>

              {/* Jargon key translator section */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Translating Fine-Print Clauses
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPolicy.jargonKeyTerms.map((j, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100/50 rounded-xl space-y-1">
                      <span className="block font-semibold text-xxs text-indigo-950 font-sans">{j.term}</span>
                      <p className="text-[11px] text-slate-700 font-light leading-relaxed">{j.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center flex flex-col justify-center items-center min-h-[300px]">
              <ShieldCheck className="w-8 h-8 text-slate-300 animate-pulse mb-3" />
              <p className="text-sm font-medium text-slate-700">No active protectors selected</p>
              <p className="text-xs text-slate-600 mt-1 font-light max-w-sm">Please select an insurance helper catalog on the left pane to analyze policy language rules.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
