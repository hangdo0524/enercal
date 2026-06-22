import { useState } from "react";
import type { RoadmapPhase, NumerologyPerson } from "../types";

interface Props {
  roadmap: {
    vision: string;
    phases: RoadmapPhase[];
  };
  individuals: NumerologyPerson[];
}

function PhaseCard({ phase, individuals, isExpanded, onToggle }: {
  phase: RoadmapPhase;
  individuals: NumerologyPerson[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getPersonName = (id: string) => {
    if (id === "all") return "Cả nhà";
    if (id === "family") return "Cả nhà";
    const person = individuals.find((p) => p.id === id);
    return person?.name.split(" ").pop() ?? id;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-energy-purple to-energy-orange flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {phase.period.split("/")[0]?.replace("Q", "") || phase.period.slice(0, 4)}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400">{phase.period}</p>
            <p className="font-bold text-slate-800">{phase.theme}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-semibold bg-energy-purple/10 text-energy-purple rounded-full">
            {getPersonName(phase.priorityMember.id)}
            {phase.priorityMember.secondary && ` + ${getPersonName(phase.priorityMember.secondary)}`}
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          {/* Priority reason */}
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-energy-purple">Lý do ưu tiên:</span>{" "}
              {phase.priorityMember.reason}
            </p>
          </div>

          {/* Focus traits */}
          {phase.focusTraits && phase.focusTraits.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Đặc điểm tập trung:</p>
              <div className="flex flex-wrap gap-1">
                {phase.focusTraits.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-energy-orange/10 text-energy-orange rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold text-slate-500">Hành động cụ thể:</p>
            {Object.entries(phase.actions).map(([personId, actions]) => (
              <div key={personId} className="bg-white border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-bold text-energy-purple mb-1.5">
                  {getPersonName(personId)}
                </p>
                <ul className="space-y-1">
                  {actions.map((action, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-energy-green mt-0.5">&#10003;</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Recognition */}
          {phase.recognition && Object.keys(phase.recognition).length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">Cách ghi nhận:</p>
              <div className="space-y-1">
                {Object.entries(phase.recognition).map(([key, value]) => (
                  <p key={key} className="text-xs text-slate-600">
                    <span className="font-medium text-slate-700">{key}:</span> {value}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Evaluation */}
          {phase.evaluation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-blue-700 mb-1">Đánh giá hiệu quả:</p>
              <ul className="space-y-0.5">
                {phase.evaluation.metrics.map((m, i) => (
                  <li key={i} className="text-xs text-blue-600 flex items-start gap-2">
                    <span>&#8226;</span> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Milestones (for final phases) */}
          {phase.milestones && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">Mục tiêu hoàn thiện:</p>
              <div className="grid gap-2">
                {Object.entries(phase.milestones).map(([personId, goals]) => (
                  <div key={personId} className="bg-gradient-to-r from-energy-purple/5 to-energy-orange/5 rounded-lg p-3">
                    <p className="text-xs font-bold text-slate-700 mb-1">{getPersonName(personId)}</p>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p><span className="font-medium text-energy-purple">Tâm:</span> {goals.tam}</p>
                      <p><span className="font-medium text-energy-green">Trí:</span> {goals.tri}</p>
                      <p><span className="font-medium text-energy-orange">Lực:</span> {goals.luc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function NumerologyRoadmap({ roadmap, individuals }: Props) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

  const togglePhase = (index: number) => {
    setExpandedPhase(expandedPhase === index ? null : index);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto space-y-4 p-2 md:p-4">
        {/* Vision Header */}
        <div className="bg-gradient-to-r from-energy-purple to-energy-orange rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-lg font-bold mb-2">Lộ trình 2026 - 2030</h2>
          <p className="text-sm opacity-90 italic">"{roadmap.vision}"</p>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Tổng quan</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-energy-purple to-energy-orange" />

            <div className="space-y-3">
              {roadmap.phases.map((phase, i) => {
                const isActive = i === 0;
                return (
                  <button
                    key={i}
                    onClick={() => setExpandedPhase(i)}
                    className={`relative flex items-center gap-3 w-full text-left pl-10 pr-3 py-2 rounded-lg transition-colors ${
                      expandedPhase === i ? "bg-energy-purple/10" : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                      isActive
                        ? "bg-energy-purple border-energy-purple"
                        : "bg-white border-slate-300"
                    }`} />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400">{phase.period}</p>
                      <p className={`text-sm font-semibold truncate ${
                        expandedPhase === i ? "text-energy-purple" : "text-slate-700"
                      }`}>
                        {phase.theme}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Phase Details */}
        <div className="space-y-3">
          {roadmap.phases.map((phase, i) => (
            <PhaseCard
              key={i}
              phase={phase}
              individuals={individuals}
              isExpanded={expandedPhase === i}
              onToggle={() => togglePhase(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
