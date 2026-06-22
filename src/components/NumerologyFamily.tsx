import type { NumerologyData } from "../types";

interface Props {
  data: NumerologyData;
}

function MemberCard({ name, role, lifePath }: { name: string; role: string; lifePath: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-md transition-shadow">
      <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-energy-purple to-energy-orange flex items-center justify-center text-white text-xl font-bold mb-2">
        {lifePath}
      </div>
      <p className="text-base font-semibold text-slate-700">{name}</p>
      <p className="text-sm text-slate-500">{role}</p>
    </div>
  );
}

export function NumerologyFamily({ data }: Props) {
  const { familyAnalysis, supportMatrix, recognitionGuide, individuals } = data;

  const getLifePath = (id: string) => {
    const person = individuals.find((p) => p.id === id);
    if (!person) return 0;
    return person.coreNumbers.byActualBirthDate?.lifePath.number ??
           person.coreNumbers.lifePath?.number ?? 0;
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto space-y-4 p-2 md:p-4">
        {/* Family Number Header */}
        <div className="bg-gradient-to-r from-energy-purple to-energy-orange rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Gia đình số</p>
              <h2 className="text-5xl font-black">{familyAnalysis.familyLifePath.number}</h2>
              <p className="text-lg font-semibold mt-1">{familyAnalysis.familyLifePath.meaning}</p>
            </div>
            <div className="text-right text-sm opacity-90 max-w-xs">
              <p className="italic">"{familyAnalysis.familyLifePath.familyMission}"</p>
            </div>
          </div>
          <p className="text-xs opacity-70 mt-3">
            {familyAnalysis.familyLifePath.calculation}
          </p>
        </div>

        {/* Family Members */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-base font-bold text-slate-700 mb-4">Thành viên</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {individuals.map((p) => (
              <MemberCard
                key={p.id}
                name={p.name.split(" ").pop() ?? p.name}
                role={p.role}
                lifePath={getLifePath(p.id)}
              />
            ))}
          </div>
        </div>

        {/* Master Numbers */}
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <h3 className="text-base font-bold text-yellow-800 mb-3 flex items-center gap-2">
            <span>⚡</span> Master Numbers trong gia đình
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            {familyAnalysis.masterNumbersInFamily.count}/4 thành viên có Master Number
          </p>
          <ul className="space-y-2">
            {familyAnalysis.masterNumbersInFamily.details.map((d, i) => (
              <li key={i} className="text-sm text-yellow-700 flex items-center gap-2">
                <span>&#8226;</span> {d}
              </li>
            ))}
          </ul>
          <p className="text-sm text-yellow-800 font-semibold mt-3 pt-3 border-t border-yellow-200">
            {familyAnalysis.masterNumbersInFamily.significance}
          </p>
        </div>

        {/* Dynamics */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-4">
            <h3 className="text-base font-bold text-green-800 mb-3">Điểm mạnh bổ trợ</h3>
            <div className="space-y-4">
              {familyAnalysis.complementaryDynamics.strengths.map((s, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-green-700">{s.pair}</p>
                  <p className="text-sm text-green-600 mt-1">{s.dynamic}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tensions */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <h3 className="text-base font-bold text-red-800 mb-3">Xung đột tiềm ẩn</h3>
            <div className="space-y-4">
              {familyAnalysis.complementaryDynamics.tensions.map((t, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-red-700">{t.pair}</p>
                  <p className="text-sm text-red-600 mt-1">{t.tension}</p>
                  <p className="text-sm text-green-600 mt-1 italic">→ {t.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Matrix */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
            <span>🤝</span> Ma trận hỗ trợ
          </h3>
          <p className="text-sm text-slate-500 mb-4">{supportMatrix.description}</p>

          <div className="overflow-x-auto -mx-2 px-2">
            <div className="space-y-4 min-w-[400px]">
              {supportMatrix.matrix.map((row, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm font-bold text-energy-purple mb-3">
                    {row.supporter} hỗ trợ:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {row.supports.map((s, j) => (
                      <div key={j} className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-sm font-semibold text-slate-700">{s.receiver}</p>
                        <p className="text-xs text-slate-500 mt-1">{s.how}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recognition Guide */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
            <span>💝</span> Cách ghi nhận đúng
          </h3>
          <p className="text-sm text-slate-500 mb-4 italic">{recognitionGuide.principle}</p>

          <div className="grid md:grid-cols-2 gap-4">
            {recognitionGuide.byPerson.map((p, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-bold text-slate-700 mb-3">{p.person}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-green-600 font-semibold mb-1">Nên nói:</p>
                    {p.rightWay.map((r, j) => (
                      <p key={j} className="text-sm text-slate-600 ml-2">"{r}"</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-red-600 font-semibold mb-1">Tránh:</p>
                    {p.avoid.map((a, j) => (
                      <p key={j} className="text-sm text-slate-400 ml-2 line-through">{a}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
