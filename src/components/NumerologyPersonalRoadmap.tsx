import { useState } from "react";
import type { NumerologyPerson, PersonalRoadmapPhase } from "../types";

interface Props {
  person: NumerologyPerson;
}

function PhaseCard({ phase, isExpanded, onToggle }: {
  phase: PersonalRoadmapPhase;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const soNam = typeof phase.soNamCaNhan === 'object'
    ? `${phase.soNamCaNhan.thuc}/${phase.soNamCaNhan.khaiSinh}`
    : phase.soNamCaNhan;

  const isMasterYear = phase.laSoChu || (typeof phase.soNamCaNhan === 'number' && phase.soNamCaNhan === 11);

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${isMasterYear ? 'border-yellow-300 ring-2 ring-yellow-200' : 'border-slate-200'} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${
            isMasterYear
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
              : 'bg-gradient-to-br from-energy-purple to-energy-orange'
          }`}>
            {soNam}
            {isMasterYear && <span className="text-xs ml-0.5">★</span>}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-400">{phase.nam}</p>
              {phase.tuoi && <span className="text-xs text-slate-300">• {phase.tuoi}</span>}
            </div>
            <p className="font-bold text-slate-800">{phase.chuDe}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 leading-relaxed">{phase.moTa}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-500 mb-2">Hành động cụ thể:</p>
            <ul className="space-y-2">
              {phase.hanhDong.map((action, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-energy-green mt-0.5">✓</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-energy-purple/5 to-energy-orange/5 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 mb-2">Mục tiêu cuối năm:</p>
            <div className="space-y-1 text-sm text-slate-600">
              <p><span className="font-medium text-energy-purple">Tâm:</span> {phase.mucTieuCuoiNam.tam}</p>
              <p><span className="font-medium text-energy-green">Trí:</span> {phase.mucTieuCuoiNam.tri}</p>
              <p><span className="font-medium text-energy-orange">Lực:</span> {phase.mucTieuCuoiNam.luc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function NumerologyPersonalRoadmap({ person }: Props) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const roadmap = person.personalRoadmap;

  if (!roadmap) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        Chưa có dữ liệu lộ trình cá nhân
      </div>
    );
  }

  const togglePhase = (index: number) => {
    setExpandedPhase(expandedPhase === index ? null : index);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto space-y-4 p-2 md:p-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-energy-purple to-energy-orange rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {person.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold">Lộ trình 5 năm</h2>
              <p className="text-sm opacity-80">{person.name} ({person.role})</p>
            </div>
          </div>
          <p className="text-sm opacity-90 italic">"{roadmap.tamNhin}"</p>
          {roadmap.chuKy && (
            <p className="text-xs opacity-70 mt-2">Chu kỳ: {roadmap.chuKy}</p>
          )}
          {roadmap.chuKyHienTai && (
            <div className="text-xs opacity-70 mt-2 space-y-0.5">
              <p>Ngày thực: {roadmap.chuKyHienTai.theoNgayThuc}</p>
              <p>Ngày khai sinh: {roadmap.chuKyHienTai.theoNgayKhaiSinh}</p>
            </div>
          )}
        </div>

        {/* Timeline Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Tổng quan chu kỳ</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-energy-purple to-energy-orange" />
            <div className="space-y-2">
              {roadmap.cacGiaiDoan.map((phase, i) => {
                const soNam = typeof phase.soNamCaNhan === 'object'
                  ? phase.soNamCaNhan.thuc
                  : phase.soNamCaNhan;
                const isMasterYear = phase.laSoChu || soNam === 11;
                const isActive = i === 0;

                return (
                  <button
                    key={i}
                    onClick={() => setExpandedPhase(i)}
                    className={`relative flex items-center gap-3 w-full text-left pl-10 pr-3 py-2 rounded-lg transition-colors ${
                      expandedPhase === i ? "bg-energy-purple/10" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                      isMasterYear
                        ? "bg-yellow-400 border-yellow-400"
                        : isActive
                        ? "bg-energy-purple border-energy-purple"
                        : "bg-white border-slate-300"
                    }`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400">{phase.nam}</p>
                        <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                          isMasterYear ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {typeof phase.soNamCaNhan === 'object'
                            ? `${phase.soNamCaNhan.thuc}/${phase.soNamCaNhan.khaiSinh}`
                            : phase.soNamCaNhan}
                          {isMasterYear && "★"}
                        </span>
                      </div>
                      <p className={`text-sm font-semibold truncate ${
                        expandedPhase === i ? "text-energy-purple" : "text-slate-700"
                      }`}>
                        {phase.chuDe}
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
          {roadmap.cacGiaiDoan.map((phase, i) => (
            <PhaseCard
              key={i}
              phase={phase}
              isExpanded={expandedPhase === i}
              onToggle={() => togglePhase(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
