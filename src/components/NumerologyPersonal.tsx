import { useState } from "react";
import type { NumerologyPerson, DualPersonalYear, PersonalYearNumber } from "../types";
import { getRawNumerologyData } from "../data/numerologyData";
import { calculatePinnacles, getCurrentPinnacle, parseDateString, calculateAge, type Pinnacle } from "../utils/numerologyCalc";

interface Props {
  person: NumerologyPerson;
}

// Get number detail from metadata
function getNumberDetail(num: number) {
  const rawData = getRawNumerologyData() as any;
  const details = rawData?.metadata?.giaiThichThuatNgu?.yNghiaChiTietCacSo;
  return details?.[`so${num}`] || null;
}


// Expandable number detail component
function NumberDetailCard({
  number,
  label,
  context,
  highlight = false,
  masterNumber = false
}: {
  number: number;
  label: string;
  context: 'lifePath' | 'expression' | 'soulUrge' | 'birthday' | 'personality' | 'maturity';
  highlight?: boolean;
  masterNumber?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const detail = getNumberDetail(number);

  if (!detail) return null;

  const contextKey = {
    lifePath: 'khiLaSoChủDao',
    expression: 'khiLaSoBieuDat',
    soulUrge: 'khiLaSoLinhHon',
    birthday: 'khiLaSoNgaySinh',
    personality: 'khiLaSoBieuDat',
    maturity: 'khiLaSoChủDao'
  }[context];

  return (
    <div className={`rounded-xl transition-all ${highlight ? "bg-energy-purple/10 ring-2 ring-energy-purple" : "bg-slate-50"}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-3xl md:text-4xl font-black ${highlight ? "text-energy-purple" : "text-slate-700"}`}>
              {number}
              {masterNumber && <span className="text-sm text-yellow-500 ml-1">★</span>}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">{label}</div>
              <div className="text-sm text-slate-400">{detail.tuKhoa}</div>
            </div>
          </div>
          <span className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-200 pt-3">
          <p className="text-sm text-slate-600 font-medium">{detail.banChat}</p>

          {/* Context-specific meaning */}
          {detail[contextKey] && (
            <div className="p-2 bg-energy-purple/5 rounded-lg">
              <p className="text-sm text-energy-purple font-medium">{detail[contextKey]}</p>
            </div>
          )}

          {/* Traits */}
          <div className="flex flex-wrap gap-1.5">
            {detail.matTichCuc?.slice(0, 4).map((t: string, i: number) => (
              <span key={i} className="px-2 py-0.5 text-sm bg-green-50 text-green-700 rounded-full">
                {t}
              </span>
            ))}
            {detail.matTieuCuc?.slice(0, 3).map((t: string, i: number) => (
              <span key={i} className="px-2 py-0.5 text-sm bg-red-50 text-red-700 rounded-full">
                {t}
              </span>
            ))}
          </div>

          {/* Careers */}
          {detail.ngheThuHop && (
            <div>
              <p className="text-sm text-slate-400 mb-1">Nghề phù hợp:</p>
              <p className="text-sm text-slate-600">{detail.ngheThuHop.join(' • ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Expandable section showing all number details
function ExpandableNumberDetails({
  actualLifePath,
  actualBirthday,
  expressionNumber,
  soulUrgeNumber,
  personalityNumber
}: {
  actualLifePath: number;
  actualBirthday: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber?: number;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 text-sm text-energy-purple hover:text-energy-purple/80 font-medium"
      >
        <span>{showDetails ? '▼' : '▶'}</span>
        <span>{showDetails ? 'Ẩn chi tiết từng số' : '📖 Xem chi tiết ý nghĩa từng số'}</span>
      </button>

      {showDetails && (
        <div className="mt-4 space-y-3">
          <NumberDetailCard number={actualLifePath} label="Số Chủ Đạo" context="lifePath" highlight />
          <NumberDetailCard number={actualBirthday} label="Số Ngày Sinh" context="birthday" />
          <NumberDetailCard number={expressionNumber} label="Số Biểu Đạt" context="expression" />
          <NumberDetailCard number={soulUrgeNumber} label="Số Linh Hồn" context="soulUrge" />
          {personalityNumber && (
            <NumberDetailCard number={personalityNumber} label="Số Nhân Cách" context="personality" />
          )}
        </div>
      )}
    </div>
  );
}

// Get individual's additional numerology data (new sections)
function getIndividualData(personId: string) {
  const rawData = getRawNumerologyData() as any;
  const individual = rawData?.individuals?.find((p: any) => p.id === personId);
  return individual?.cacSoCotLoi || {};
}

// Karmic Debt Section
function KarmicDebtSection({ personId }: { personId: string }) {
  const data = getIndividualData(personId);
  const karmicDebt = data?.soNoNghiep;

  if (!karmicDebt) return null;

  const hasDebt = karmicDebt.ketQua?.coNoNghiep;

  return (
    <div className={`rounded-xl border p-4 ${hasDebt ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
      <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${hasDebt ? 'text-red-800' : 'text-green-800'}`}>
        <span>⚖️</span> Số Nợ Nghiệp (Karmic Debt)
      </h3>

      {hasDebt ? (
        <div className="space-y-3">
          <p className="text-base text-red-700">{karmicDebt.ketQua?.chiTiet}</p>

          {karmicDebt.phanTich && Object.entries(karmicDebt.phanTich).map(([key, value]: [string, any]) => (
            <div key={key} className="bg-white rounded-lg p-4 border border-red-200">
              <p className="text-base font-bold text-red-800">{value.tenGoi}</p>
              <p className="text-base text-slate-600 mt-2">Nguồn gốc: {value.nguonGoc}</p>
              <p className="text-base text-red-600 mt-2">Biểu hiện: {value.bieuHien}</p>
              <p className="text-base text-green-600 mt-2">Bài học: {value.baiHoc}</p>
              {value.lienKet && <p className="text-sm text-slate-500 mt-2 italic">{value.lienKet}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-base text-green-700 font-medium">✅ Không có số nợ nghiệp trực tiếp</p>
          <p className="text-base text-slate-600 leading-relaxed">{karmicDebt.ketQua?.chiTiet || karmicDebt.phanTich}</p>
          {karmicDebt.thongDiepChoBMe && (
            <p className="text-base text-green-600 mt-2 p-3 bg-green-100 rounded-lg">{karmicDebt.thongDiepChoBMe}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Life Cycles Section (3 periods)
function LifeCyclesSection({ personId }: { personId: string }) {
  const data = getIndividualData(personId);
  const cycles = data?.chuKyDuongDoi;

  if (!cycles) return null;

  const hasDual = !!cycles.theoNgaySinhThuc && !!cycles.theoNgayKhaiSinh;

  const renderCycle = (cycle: any, index: number, color: string) => (
    <div key={index} className={`p-4 rounded-lg bg-white border border-${color}-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-500">{cycle.ten || `Chu kỳ ${index + 1}`}</span>
        <span className="text-sm text-slate-500">{cycle.tuoi}</span>
      </div>
      <div className={`text-3xl font-black text-${color}-600 mb-2`}>
        {cycle.so}
        {cycle.laSoChu && <span className="text-base text-yellow-500 ml-1">★</span>}
      </div>
      <p className="text-base text-slate-600 leading-relaxed">{cycle.yNghia}</p>
      {cycle.loiKhuyen && (
        <p className="text-sm text-slate-500 mt-2 pt-2 border-t border-slate-100 italic">{cycle.loiKhuyen}</p>
      )}
      {cycle.loiKhuyenChoBMe && (
        <p className="text-sm text-slate-500 mt-2 pt-2 border-t border-slate-100 italic">{cycle.loiKhuyenChoBMe}</p>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200 p-4">
      <h3 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
        <span>🔄</span> Chu Kỳ Đường Đời (3 Giai Đoạn Lớn)
      </h3>

      {cycles.thongDiepChung && (
        <p className="text-base text-teal-600 mb-4 p-3 bg-white/60 rounded-lg leading-relaxed">{cycles.thongDiepChung}</p>
      )}

      {hasDual ? (
        <div className="space-y-4">
          {/* Theo ngày sinh thực */}
          <div>
            <p className="text-base font-medium text-energy-purple mb-3">🟣 Theo ngày thực - Năng lượng BÊN TRONG</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[cycles.theoNgaySinhThuc.chuKy1, cycles.theoNgaySinhThuc.chuKy2, cycles.theoNgaySinhThuc.chuKy3]
                .map((c, i) => renderCycle(c, i, 'purple'))}
            </div>
          </div>

          {/* Theo ngày khai sinh */}
          <div>
            <p className="text-base font-medium text-energy-orange mb-3">🟠 Theo ngày khai sinh - Năng lượng BÊN NGOÀI</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[cycles.theoNgayKhaiSinh.chuKy1, cycles.theoNgayKhaiSinh.chuKy2, cycles.theoNgayKhaiSinh.chuKy3]
                .map((c, i) => renderCycle(c, i, 'orange'))}
            </div>
          </div>

          {cycles.phanTichKetHop && (
            <div className="p-4 bg-white/60 rounded-lg border-2 border-teal-200">
              <p className="text-base font-semibold text-teal-700 mb-2">🔄 Phân tích kết hợp:</p>
              <p className="text-base text-slate-600 leading-relaxed">{cycles.phanTichKetHop}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[cycles.chuKy1, cycles.chuKy2, cycles.chuKy3].map((c, i) => renderCycle(c, i, 'teal'))}
          </div>
          {cycles.hienTai && (
            <p className="text-base text-teal-700 p-3 bg-white/60 rounded-lg leading-relaxed">{cycles.hienTai}</p>
          )}
          {cycles.ghiChu && (
            <p className="text-base text-slate-600 italic p-3 bg-teal-100/50 rounded-lg">{cycles.ghiChu}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Hidden Passion Section
function HiddenPassionSection({ personId }: { personId: string }) {
  const data = getIndividualData(personId);
  const passion = data?.damMeAn;

  if (!passion) return null;

  return (
    <div className="bg-pink-50 rounded-xl border border-pink-200 p-4">
      <h3 className="text-lg font-bold text-pink-800 mb-3 flex items-center gap-2">
        <span>💖</span> Đam Mê Ẩn (Hidden Passion)
      </h3>

      {passion.so ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center">
              <span className="text-3xl font-black text-white">{passion.so}</span>
            </div>
            <div>
              <p className="text-base font-bold text-pink-800">{passion.ten || 'Đam Mê Ẩn'}</p>
              <p className="text-base font-semibold text-pink-700">{passion.yNghia}</p>
              {passion.tanSuat && <p className="text-sm text-slate-500">Xuất hiện {passion.tanSuat} lần trong tên</p>}
            </div>
          </div>
          {passion.bieuHien && (
            <p className="text-base text-slate-600 leading-relaxed">{passion.bieuHien}</p>
          )}
          {passion.thongDiepYeuThuong && (
            <p className="text-base text-pink-600 p-3 bg-pink-100 rounded-lg leading-relaxed">{passion.thongDiepYeuThuong}</p>
          )}
          {passion.loiKhuyen && (
            <p className="text-sm text-slate-500 italic border-t border-pink-200 pt-3 mt-2">{passion.loiKhuyen}</p>
          )}
          {passion.lienKet && (
            <p className="text-sm text-pink-600 italic">{passion.lienKet}</p>
          )}
        </div>
      ) : passion.ketQua ? (
        <div className="space-y-3">
          <p className="text-base text-slate-600">{passion.ketQua.caoNhat || passion.ketQua.tanSuat}</p>
          {passion.phanTich && Object.entries(passion.phanTich).map(([key, value]) => (
            <p key={key} className="text-base text-pink-700 leading-relaxed">{value as string}</p>
          ))}
          <p className="text-base text-pink-600 font-medium">{passion.yNghia}</p>
          {passion.thongDiepYeuThuong && (
            <p className="text-base text-pink-600 p-3 bg-pink-100 rounded-lg leading-relaxed mt-2">{passion.thongDiepYeuThuong}</p>
          )}
          {passion.thongDiepChoBMe && (
            <p className="text-sm text-slate-500 italic border-t border-pink-200 pt-3 mt-2">{passion.thongDiepChoBMe}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

// Subconscious Self Section
function SubconsciousSelfSection({ personId }: { personId: string }) {
  const data = getIndividualData(personId);
  const subconscious = data?.soTiemThuc;

  if (!subconscious) return null;

  const getLevel = (num: number) => {
    if (num >= 8) return { label: 'Cao', color: 'green' };
    if (num >= 6) return { label: 'Khá', color: 'blue' };
    if (num >= 4) return { label: 'Trung bình', color: 'yellow' };
    return { label: 'Thấp', color: 'red' };
  };

  const level = getLevel(subconscious.so);

  return (
    <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
      <h3 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
        <span>🧠</span> Số Tiềm Thức (Subconscious Self)
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full bg-${level.color}-500 flex items-center justify-center`}>
          <span className="text-3xl font-black text-white">{subconscious.so}</span>
        </div>
        <div>
          <p className={`text-base font-bold text-${level.color}-700`}>Mức độ: {level.label}</p>
          <p className="text-sm text-slate-500">{subconscious.congThuc}</p>
        </div>
      </div>

      {subconscious.moTa && (
        <p className="text-base text-slate-700 leading-relaxed mb-3">{subconscious.moTa}</p>
      )}
      <p className="text-base text-slate-600 leading-relaxed">{subconscious.yNghia}</p>
      {subconscious.thongDiepYeuThuong && (
        <p className="text-base text-indigo-600 mt-3 p-3 bg-indigo-100 rounded-lg leading-relaxed">{subconscious.thongDiepYeuThuong}</p>
      )}
      {subconscious.loiKhuyen && (
        <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-indigo-200 italic">{subconscious.loiKhuyen}</p>
      )}
      {subconscious.loiKhuyenChoBMe && (
        <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-indigo-200 italic">{subconscious.loiKhuyenChoBMe}</p>
      )}
      {subconscious.ghiChu && (
        <p className="text-sm text-indigo-600 mt-3 italic">{subconscious.ghiChu}</p>
      )}
    </div>
  );
}

// Inclusion Chart Section
function InclusionChartSection({ personId }: { personId: string }) {
  const data = getIndividualData(personId);
  const chart = data?.bieuDoBaoHam;

  if (!chart || !chart.tanSuat) return null;

  const getColor = (freq: number) => {
    if (freq === 0) return 'bg-red-100 text-red-700 border-red-300';
    if (freq === 1) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (freq === 2) return 'bg-green-100 text-green-700 border-green-300';
    if (freq >= 3) return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const [expandedNum, setExpandedNum] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span>📊</span> Biểu Đồ Bao Hàm (Inclusion Chart)
      </h3>

      {chart.thongDiepChung && (
        <p className="text-base text-slate-600 mb-4 p-3 bg-white rounded-lg leading-relaxed">{chart.thongDiepChung}</p>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const info = chart.tanSuat[`so${num}`];
          if (!info) return null;

          return (
            <button
              key={num}
              onClick={() => setExpandedNum(expandedNum === num ? null : num)}
              className={`p-3 rounded-lg border ${getColor(info.lan)} text-center cursor-pointer hover:opacity-80 transition-opacity ${expandedNum === num ? 'ring-2 ring-slate-400' : ''}`}
            >
              <div className="text-2xl font-black">{num}</div>
              <div className="text-sm font-medium">{info.lan} lần</div>
            </button>
          );
        })}
      </div>

      {/* Expanded detail */}
      {expandedNum && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200">
          {(() => {
            const info = chart.tanSuat[`so${expandedNum}`];
            if (!info) return null;
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-700">{expandedNum}</span>
                  <span className="text-sm text-slate-500">xuất hiện {info.lan} lần</span>
                </div>
                <p className="text-base text-slate-600 leading-relaxed">
                  {info.moTa || info.danhGia}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-sm mb-4">
        <span className="px-2 py-1 rounded bg-red-100 text-red-700">0 = Thiếu</span>
        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">1 = Yếu</span>
        <span className="px-2 py-1 rounded bg-green-100 text-green-700">2 = Cân bằng</span>
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">3+ = Mạnh</span>
      </div>

      {chart.tomTat && (
        <p className="text-base text-slate-600 p-3 bg-white rounded-lg leading-relaxed">{chart.tomTat}</p>
      )}

      {chart.thongDiepYeuThuong && (
        <p className="text-base text-slate-700 mt-3 p-3 bg-slate-100 rounded-lg leading-relaxed">{chart.thongDiepYeuThuong}</p>
      )}

      {chart.thongDiepChoBMe && (
        <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-200 italic">{chart.thongDiepChoBMe}</p>
      )}
    </div>
  );
}

// Missing Numbers Section with expandable details
function MissingNumbersSection({ missingNumbers }: { missingNumbers: any }) {
  const [expandedNum, setExpandedNum] = useState<number | null>(null);

  return (
    <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
      <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
        <span>🔍</span> Số Thiếu (Năng Lượng Khuyết)
      </h3>

      {/* Number circles - clickable */}
      <div className="flex flex-wrap gap-3 mb-4">
        {missingNumbers.cacSoThieu.map((num: number) => (
          <button
            key={num}
            onClick={() => setExpandedNum(expandedNum === num ? null : num)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              expandedNum === num
                ? 'bg-orange-500 text-white ring-4 ring-orange-300'
                : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
            }`}
          >
            <span className="text-lg font-black">{num}</span>
          </button>
        ))}
      </div>

      {/* Expanded detail */}
      {expandedNum && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-orange-200">
          {(() => {
            const detail = getNumberDetail(expandedNum);
            if (!detail) return null;
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-orange-600">{expandedNum}</span>
                  <span className="text-sm font-semibold text-orange-800">{detail.tuKhoa}</span>
                </div>
                <p className="text-sm text-orange-700 font-medium">
                  Thiếu số {expandedNum}: {detail.khiLaSoThieu}
                </p>
                <div className="pt-2 border-t border-orange-100">
                  <p className="text-sm text-slate-500 mb-1">Cách bổ sung năng lượng số {expandedNum}:</p>
                  <p className="text-sm text-slate-600">
                    Nghề/hoạt động liên quan: {detail.ngheThuHop?.slice(0, 3).join(', ')}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Analysis from data */}
      <div className="space-y-2">
        {Object.entries(missingNumbers.phanTich).map(([key, value]) => (
          <p key={key} className="text-sm text-orange-700">
            <strong className="text-orange-800">Thiếu {key.replace('thieu', '')}:</strong> {value as string}
          </p>
        ))}
      </div>

      {missingNumbers.ghiChu && (
        <p className="text-sm text-orange-800 mt-3 pt-3 border-t border-orange-200 italic">
          {missingNumbers.ghiChu}
        </p>
      )}
    </div>
  );
}

function PillarBar({ label, score, maxScore, color }: { label: string; score: number; maxScore: number; color: string }) {
  const pct = (score / maxScore) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-sm font-semibold text-slate-600">{label}</span>
      <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 text-sm font-bold text-slate-700 text-right">
        {score}/{maxScore}
      </span>
    </div>
  );
}

// Get pinnacle meaning from JSON metadata
function getPinnacleMeaning(num: number): string {
  const rawData = getRawNumerologyData() as any;
  const meanings = rawData?.metadata?.giaiThichThuatNgu?.dinhCao?.yNghiaCacSo;
  return meanings?.[`so${num}`] || `Giai đoạn với năng lượng số ${num}`;
}

// Get pinnacle phase info from JSON metadata
function getPinnaclePhaseInfo() {
  const rawData = getRawNumerologyData() as any;
  const dinhCao = rawData?.metadata?.giaiThichThuatNgu?.dinhCao;
  return {
    cachDoc: dinhCao?.cachDoc || "Cách đọc Pinnacles:",
    phases: [
      dinhCao?.cacGiaiDoan?.dinh1 || { ten: "Đỉnh 1", moTa: "" },
      dinhCao?.cacGiaiDoan?.dinh2 || { ten: "Đỉnh 2", moTa: "" },
      dinhCao?.cacGiaiDoan?.dinh3 || { ten: "Đỉnh 3", moTa: "" },
      dinhCao?.cacGiaiDoan?.dinh4 || { ten: "Đỉnh 4", moTa: "" },
    ]
  };
}

// Pinnacles Section - 4 life phases
function PinnaclesSection({ birthDate, hasDual, actualDate, officialDate }: {
  birthDate: string;
  hasDual: boolean;
  actualDate?: string;
  officialDate?: string;
}) {
  const [showDetail, setShowDetail] = useState(false);

  // Calculate pinnacles
  const actualPinnacles = actualDate ? calculatePinnacles(actualDate) : calculatePinnacles(birthDate);
  const officialPinnacles = hasDual && officialDate ? calculatePinnacles(officialDate) : null;

  // Get current age
  const dateInfo = parseDateString(actualDate || birthDate);
  const age = dateInfo ? calculateAge(dateInfo.year) : 0;

  // Get current pinnacle
  const currentActual = getCurrentPinnacle(actualPinnacles, age);
  const currentOfficial = officialPinnacles ? getCurrentPinnacle(officialPinnacles, age) : null;

  const renderPinnacleCard = (p: Pinnacle, isCurrent: boolean, color: string) => {
    const meaning = getPinnacleMeaning(p.number);
    return (
      <div
        key={p.phase}
        className={`p-3 rounded-lg border ${isCurrent ? `ring-2 ring-${color} bg-${color}/10` : 'bg-white'}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Đỉnh {p.phase}</span>
          <span className="text-sm text-slate-500">
            {p.startAge}-{p.endAge ?? '∞'} tuổi
          </span>
        </div>
        <div className={`text-2xl font-black ${isCurrent ? `text-${color}` : 'text-slate-700'}`}>
          {p.number}
          {(p.number === 11 || p.number === 22) && <span className="text-sm text-yellow-500 ml-1">★</span>}
        </div>
        {showDetail && (
          <p className="text-sm text-slate-500 mt-2">{meaning}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
          <span>🏔️</span> Chu Kỳ Đỉnh Cao (Pinnacles)
        </h3>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          {showDetail ? 'Ẩn chi tiết' : 'Chi tiết'}
        </button>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        Hiện tại: <strong className="text-indigo-700">{age} tuổi</strong>
        {currentActual && (
          <span className="ml-2">
            → Đang ở <strong className="text-indigo-700">Đỉnh {currentActual.phase}</strong> (Số {currentActual.number})
          </span>
        )}
      </p>

      {hasDual && officialPinnacles ? (
        <div className="space-y-4">
          {/* Actual date pinnacles */}
          <div>
            <p className="text-sm font-medium text-energy-purple mb-2">🟣 Theo ngày thực - Đỉnh cao BÊN TRONG</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {actualPinnacles.map(p => renderPinnacleCard(p, currentActual?.phase === p.phase, 'energy-purple'))}
            </div>
          </div>

          {/* Official date pinnacles */}
          <div>
            <p className="text-sm font-medium text-energy-orange mb-2">🟠 Theo ngày khai sinh - Đỉnh cao BÊN NGOÀI</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {officialPinnacles.map(p => renderPinnacleCard(p, currentOfficial?.phase === p.phase, 'energy-orange'))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {actualPinnacles.map(p => renderPinnacleCard(p, currentActual?.phase === p.phase, 'indigo'))}
        </div>
      )}

      {showDetail && (() => {
        const phaseInfo = getPinnaclePhaseInfo();
        return (
          <div className="mt-4 p-3 bg-white/50 rounded-lg text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">📖 {phaseInfo.cachDoc}</p>
            <ul className="space-y-1">
              {phaseInfo.phases.map((phase, i) => (
                <li key={i}>• <strong>{phase.ten}:</strong> {phase.moTa}</li>
              ))}
            </ul>
          </div>
        );
      })()}
    </div>
  );
}

// Personal Compatibility - how this person relates to family
function PersonCompatibilitySection({ personId }: { personId: string }) {
  const rawData = getRawNumerologyData() as any;
  const supportMatrix = rawData?.maHoTro?.danhSach || [];
  const dynamics = rawData?.phanTichGiaDinh?.dongLucBoTro || {};

  // Find this person's support info
  const mySupport = supportMatrix.find((s: any) => s.nguoiHoTro?.toLowerCase().includes(personId.replace('father', 'bố').replace('mother', 'mẹ')));

  // Find dynamics involving this person
  const personNames: Record<string, string> = {
    father: 'Bố',
    mother: 'Mẹ',
    daughter1: 'Con 1',
    daughter2: 'Con 2'
  };
  const myName = personNames[personId] || personId;

  const myStrengths = (dynamics.diemManh || []).filter((d: any) => d.cap?.includes(myName));
  const myTensions = (dynamics.xungDot || []).filter((d: any) => d.cap?.includes(myName));

  if (!mySupport && myStrengths.length === 0 && myTensions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4">
      <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
        <span>👨‍👩‍👧‍👦</span> Tương Hợp Gia Đình
      </h3>

      {/* My strengths with others */}
      {myStrengths.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-green-700 mb-2">✅ Điểm mạnh bổ trợ:</p>
          <div className="space-y-2">
            {myStrengths.map((s: any, i: number) => (
              <div key={i} className="p-2 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-green-800">{s.cap}</p>
                <p className="text-sm text-green-600 mt-1">{s.moTa}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My tensions with others */}
      {myTensions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-red-700 mb-2">⚠️ Điểm cần lưu ý:</p>
          <div className="space-y-2">
            {myTensions.map((t: any, i: number) => (
              <div key={i} className="p-2 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-semibold text-red-800">{t.cap}</p>
                <p className="text-sm text-red-600 mt-1">{t.xungDot}</p>
                <p className="text-sm text-green-600 mt-1 italic">→ {t.giaiPhap}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How I support others */}
      {mySupport && (
        <div>
          <p className="text-sm font-medium text-blue-700 mb-2">🤝 Cách tôi hỗ trợ người khác:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {mySupport.hoTro?.map((h: any, i: number) => (
              <div key={i} className="p-2 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-800">{h.nguoiNhan}</p>
                <p className="text-sm text-blue-600 mt-1">{h.cachThuc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function isDualPersonalYear(data: any): data is DualPersonalYear {
  return data && typeof data.theoNgaySinhThuc === 'object';
}

function PersonalYearSection({ personalYear }: { personalYear: any }) {
  if (isDualPersonalYear(personalYear)) {
    const getYearEntries = (obj: any) =>
      Object.entries(obj).filter(([key]) => /^\d{4}$/.test(key)) as [string, PersonalYearNumber][];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-energy-green">📅</span> Số Năm Cá Nhân (2026-2030)
        </h3>
        <div className="space-y-4">
          {personalYear.ghiChu && (
            <p className="text-sm text-slate-500 italic">{personalYear.ghiChu}</p>
          )}

          {/* Theo ngày sinh thực */}
          <div className="bg-energy-purple/5 rounded-lg p-3 border border-energy-purple/20">
            <p className="text-sm font-semibold text-energy-purple mb-3">
              🟣 {personalYear.theoNgaySinhThuc.note || "Theo ngày sinh thực"} - Năng lượng BÊN TRONG
            </p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
              {getYearEntries(personalYear.theoNgaySinhThuc).map(([year, data]) => (
                <div key={year} className={`text-center p-2 rounded-lg ${data.laSoChu ? "bg-yellow-50 border-2 border-yellow-300" : "bg-white"}`}>
                  <p className="text-sm text-slate-400">{year}</p>
                  <p className={`text-xl font-black ${data.laSoChu ? "text-yellow-600" : "text-energy-purple"}`}>
                    {data.number}
                    {data.laSoChu && <span className="text-sm ml-0.5">★</span>}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {getYearEntries(personalYear.theoNgaySinhThuc).map(([year, data]) => (
                <p key={year} className="text-sm text-slate-600">
                  <strong className="text-energy-purple">{year}:</strong>{' '}
                  <span className="text-slate-500">{data.chuDe}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Theo ngày khai sinh */}
          {personalYear.theoNgayKhaiSinh && (
            <div className="bg-energy-orange/5 rounded-lg p-3 border border-energy-orange/20">
              <p className="text-sm font-semibold text-energy-orange mb-3">
                🟠 {personalYear.theoNgayKhaiSinh.note || "Theo ngày khai sinh"} - Năng lượng BÊN NGOÀI
              </p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                {getYearEntries(personalYear.theoNgayKhaiSinh).map(([year, data]) => (
                  <div key={year} className={`text-center p-2 rounded-lg ${data.laSoChu ? "bg-yellow-50 border-2 border-yellow-300" : "bg-white"}`}>
                    <p className="text-sm text-slate-400">{year}</p>
                    <p className={`text-xl font-black ${data.laSoChu ? "text-yellow-600" : "text-energy-orange"}`}>
                      {data.number}
                      {data.laSoChu && <span className="text-sm ml-0.5">★</span>}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {getYearEntries(personalYear.theoNgayKhaiSinh).map(([year, data]) => (
                  <p key={year} className="text-sm text-slate-600">
                    <strong className="text-energy-orange">{year}:</strong>{' '}
                    <span className="text-slate-500">{data.chuDe}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Phân tích kết hợp */}
          {personalYear.ketHop && (
            <div className="p-3 bg-slate-50 rounded-lg border-2 border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-1">🔄 Phân tích kết hợp:</p>
              <p className="text-sm text-slate-600">{personalYear.ketHop}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const yearEntries = Object.entries(personalYear).filter(([key]) => /^\d{4}$/.test(key)) as [string, PersonalYearNumber][];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span className="text-energy-green">📅</span> Số Năm Cá Nhân (2026-2030)
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {yearEntries.map(([year, data]) => (
          <div key={year} className={`text-center p-3 rounded-lg ${data.laSoChu ? "bg-yellow-50 border-2 border-yellow-300" : "bg-slate-50"}`}>
            <p className="text-sm text-slate-400">{year}</p>
            <p className={`text-2xl font-black ${data.laSoChu ? "text-yellow-600" : "text-slate-700"}`}>
              {data.number}
              {data.laSoChu && <span className="text-sm ml-0.5">★</span>}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {yearEntries.map(([year, data]) => (
          <p key={year} className="text-sm text-slate-500">
            <strong className={data.laSoChu ? "text-yellow-600" : ""}>{year}:</strong> {data.chuDe}
          </p>
        ))}
      </div>
    </div>
  );
}

function NumberCard({ number, label, subLabel, highlight, masterNumber }: { number: number; label: string; subLabel?: string; highlight?: boolean; masterNumber?: boolean }) {
  return (
    <div className={`text-center p-4 rounded-xl ${highlight ? "bg-energy-purple/10 ring-2 ring-energy-purple" : "bg-slate-50"}`}>
      <div className={`text-3xl md:text-4xl font-black ${highlight ? "text-energy-purple" : "text-slate-700"}`}>
        {number}
        {masterNumber && <span className="text-sm text-yellow-500 ml-1">★</span>}
      </div>
      <div className="text-sm font-semibold text-slate-600 mt-1">{label}</div>
      {subLabel && <div className="text-sm text-slate-400">{subLabel}</div>}
    </div>
  );
}

// Tab definitions
const TABS = [
  { id: 'overview', label: '📖 Tổng quan', shortLabel: 'Tổng quan' },
  { id: 'numbers', label: '🔢 Số học', shortLabel: 'Số học' },
  { id: 'lifecycle', label: '🏔️ Vòng đời', shortLabel: 'Vòng đời' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Gia đình', shortLabel: 'Gia đình' },
] as const;

type TabId = typeof TABS[number]['id'];

export function NumerologyPersonal({ person }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { coreNumbers, threePillars } = person;

  const hasActualDate = !!coreNumbers.byActualBirthDate;
  const hasOfficialDate = !!coreNumbers.byOfficialBirthDate;
  const hasDualAnalysis = hasActualDate && hasOfficialDate;

  const actualLife = coreNumbers.byActualBirthDate?.lifePath ?? coreNumbers.lifePath;
  const actualBirthday = coreNumbers.byActualBirthDate?.birthdayNumber ?? coreNumbers.birthdayNumber;
  const officialLife = coreNumbers.byOfficialBirthDate?.lifePath;
  const officialBirthday = coreNumbers.byOfficialBirthDate?.birthdayNumber;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto p-2 md:p-4">
        {/* Header - Always visible */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-energy-purple to-energy-orange flex items-center justify-center text-white text-xl md:text-2xl font-bold shrink-0">
              {person.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 truncate">{person.name}</h2>
              <p className="text-sm text-slate-500">{person.role}</p>
              <p className="text-sm text-slate-400 mt-1">
                {hasDualAnalysis ? (
                  <>
                    Thực: {coreNumbers.byActualBirthDate?.date} | Khai sinh: {coreNumbers.byOfficialBirthDate?.date}
                  </>
                ) : (
                  person.birthDate.used
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 mb-3 sticky top-0 z-10">
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 py-2 rounded-lg text-sm md:text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-energy-purple text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">

          {/* ===== TAB: OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <>
        {/* Personal Portrait - Chân dung tổng hợp */}
        {person.personalPortrait && (
          <div className="bg-gradient-to-br from-energy-purple/5 to-energy-orange/5 rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span>📖</span> {person.personalPortrait.tieuDe}
            </h3>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              {person.personalPortrait.moTa.map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
              ))}
            </div>
            <div className="mt-4 p-3 bg-energy-purple/10 rounded-lg border border-energy-purple/20">
              <p className="text-sm text-energy-purple font-semibold" dangerouslySetInnerHTML={{ __html: person.personalPortrait.thongDiepChinh.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
            {person.personalPortrait.dieuCanLuuY && person.personalPortrait.dieuCanLuuY.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">Lưu ý:</p>
                <ul className="space-y-1">
                  {person.personalPortrait.dieuCanLuuY.map((note, i) => (
                    <li key={i} className="text-sm text-slate-500 flex items-start gap-2">
                      <span className="text-energy-orange mt-0.5">•</span>
                      <span dangerouslySetInnerHTML={{ __html: note.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-600">$1</strong>') }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Core Numbers */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-energy-purple">&#9733;</span> Các Số Cốt Lõi
          </h3>

          {hasDualAnalysis ? (
            <div className="space-y-4">
              {/* Actual birth date numbers */}
              <div>
                <p className="text-sm text-slate-500 mb-2 font-medium">
                  Ngày thực ({coreNumbers.byActualBirthDate?.date}) - Bản chất sâu xa
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <NumberCard number={actualLife?.number ?? 0} label="Chủ đạo" highlight />
                  <NumberCard number={actualBirthday?.number ?? 0} label="Ngày sinh" />
                  <NumberCard number={coreNumbers.expressionNumber.number} label="Biểu đạt" />
                  <NumberCard number={coreNumbers.soulUrge.number} label="Linh hồn" />
                </div>
                {actualLife?.masterInfluence && (
                  <div className="mt-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-sm font-semibold text-yellow-700">
                      ⚡ {actualLife.masterInfluence}
                    </span>
                  </div>
                )}
              </div>

              {/* Official birth date numbers */}
              <div>
                <p className="text-sm text-slate-500 mb-2 font-medium">
                  Ngày khai sinh ({coreNumbers.byOfficialBirthDate?.date}) - Mặt nạ xã hội
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <NumberCard number={officialLife?.number ?? 0} label="Chủ đạo" subLabel="Đối ngoại" />
                  <NumberCard number={officialBirthday?.number ?? 0} label="Ngày sinh" subLabel="Đối ngoại" />
                </div>
              </div>

              {/* Dual analysis insight */}
              {coreNumbers.dualDateAnalysis && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm font-bold text-energy-purple mb-3">
                    {coreNumbers.dualDateAnalysis.summary}
                  </p>
                  <div className="space-y-3 text-sm text-slate-600">
                    <p><strong>Bên trong:</strong> {coreNumbers.dualDateAnalysis.interpretation.innerSelf.description}</p>
                    <p><strong>Bên ngoài:</strong> {coreNumbers.dualDateAnalysis.interpretation.outerSelf.description}</p>
                    <p className="text-energy-red"><strong>Xung đột:</strong> {coreNumbers.dualDateAnalysis.interpretation.conflict.currentState}</p>
                    <p className="text-energy-green"><strong>Giải pháp:</strong> {coreNumbers.dualDateAnalysis.interpretation.conflict.solution}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <NumberCard number={actualLife?.number ?? 0} label="Chủ đạo" highlight />
                <NumberCard number={actualBirthday?.number ?? 0} label="Ngày sinh" />
                <NumberCard number={coreNumbers.expressionNumber.number} label="Biểu đạt" />
                <NumberCard number={coreNumbers.soulUrge.number} label="Linh hồn" />
              </div>
              {actualLife?.masterInfluence && (
                <div className="mt-3 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-sm font-semibold text-yellow-700">
                    ⚡ {actualLife.masterInfluence}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Expandable Detail Section */}
          <ExpandableNumberDetails
            actualLifePath={actualLife?.number ?? 0}
            actualBirthday={actualBirthday?.number ?? 0}
            expressionNumber={coreNumbers.expressionNumber.number}
            soulUrgeNumber={coreNumbers.soulUrge.number}
            personalityNumber={coreNumbers.personalityNumber?.number}
          />

          {/* Life Path meaning */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-base font-semibold text-slate-700">{actualLife?.meaning}</p>
            {actualLife?.traits && (
              <div className="mt-3 flex flex-wrap gap-2">
                {actualLife.traits.positive.slice(0, 3).map((t, i) => (
                  <span key={i} className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full">
                    {t}
                  </span>
                ))}
                {actualLife.traits.negative.slice(0, 2).map((t, i) => (
                  <span key={i} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Additional Numbers: Personality + Maturity */}
          {(coreNumbers.personalityNumber || coreNumbers.maturityNumber) && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-3 font-medium">Các số bổ sung</p>

              {/* Số Nhân Cách */}
              {coreNumbers.personalityNumber && (
                <div className="mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                      <span className="text-2xl font-black text-slate-700">{coreNumbers.personalityNumber.number}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Số Nhân Cách</p>
                      <p className="text-sm text-slate-400">Ấn tượng người khác thấy</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{coreNumbers.personalityNumber.meaning}</p>
                  {coreNumbers.personalityNumber.note && (
                    <p className="text-sm text-slate-500 mt-1 italic">{coreNumbers.personalityNumber.note}</p>
                  )}
                </div>
              )}

              {/* Số Trưởng Thành - check if dual */}
              {coreNumbers.maturityNumber && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {'theoNgaySinhThuc' in coreNumbers.maturityNumber ? (
                    /* Dual maturity number */
                    <div className="space-y-3">
                      <p className="font-semibold text-slate-700">Số Trưởng Thành (Đích đến cuộc đời sau 40 tuổi)</p>
                      {(coreNumbers.maturityNumber as any).ghiChu && (
                        <p className="text-sm text-slate-500 italic">{(coreNumbers.maturityNumber as any).ghiChu}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Bên trong */}
                        <div className="p-3 bg-energy-purple/5 rounded-lg border border-energy-purple/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-3xl font-black text-energy-purple">{(coreNumbers.maturityNumber as any).theoNgaySinhThuc.number}</span>
                            <div>
                              <span className="text-sm text-energy-purple font-semibold block">🟣 Bên trong</span>
                              <span className="text-[10px] text-slate-400">{(coreNumbers.maturityNumber as any).theoNgaySinhThuc.congThuc}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 font-medium">{(coreNumbers.maturityNumber as any).theoNgaySinhThuc.yNghia}</p>
                          {(coreNumbers.maturityNumber as any).theoNgaySinhThuc.chiTiet && (
                            <p className="text-sm text-slate-500 mt-2">{(coreNumbers.maturityNumber as any).theoNgaySinhThuc.chiTiet}</p>
                          )}
                        </div>
                        {/* Bên ngoài */}
                        {(coreNumbers.maturityNumber as any).theoNgayKhaiSinh && (
                          <div className="p-3 bg-energy-orange/5 rounded-lg border border-energy-orange/20">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-3xl font-black text-energy-orange">{(coreNumbers.maturityNumber as any).theoNgayKhaiSinh.number}</span>
                              <div>
                                <span className="text-sm text-energy-orange font-semibold block">🟠 Bên ngoài</span>
                                <span className="text-[10px] text-slate-400">{(coreNumbers.maturityNumber as any).theoNgayKhaiSinh.congThuc}</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-700 font-medium">{(coreNumbers.maturityNumber as any).theoNgayKhaiSinh.yNghia}</p>
                            {(coreNumbers.maturityNumber as any).theoNgayKhaiSinh.chiTiet && (
                              <p className="text-sm text-slate-500 mt-2">{(coreNumbers.maturityNumber as any).theoNgayKhaiSinh.chiTiet}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {(coreNumbers.maturityNumber as any).ketHop && (
                        <div className="p-3 bg-slate-50 rounded-lg border-2 border-slate-200">
                          <p className="text-sm font-semibold text-slate-700 mb-1">🔄 Kết hợp:</p>
                          <p className="text-sm text-slate-600">{(coreNumbers.maturityNumber as any).ketHop}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Simple maturity number */
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="text-2xl font-black text-slate-700">{(coreNumbers.maturityNumber as any).number}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">Số Trưởng Thành</p>
                          <p className="text-sm text-slate-400">Đích đến cuộc đời sau 40 tuổi</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{(coreNumbers.maturityNumber as any).meaning || (coreNumbers.maturityNumber as any).yNghia}</p>
                      {(coreNumbers.maturityNumber as any).note && (
                        <p className="text-sm text-slate-500 mt-1 italic">{(coreNumbers.maturityNumber as any).note}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
            </>
          )}

          {/* ===== TAB: NUMBERS ===== */}
          {activeTab === 'numbers' && (
            <>
        {/* Personal Year 2026-2030 */}
        {coreNumbers.personalYear && (
          <PersonalYearSection personalYear={coreNumbers.personalYear} />
        )}

        {/* Challenge Numbers */}
        {coreNumbers.challengeNumbers && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
              <span>⚔️</span> Số Thử Thách (Bài Học Cuộc Đời)
            </h3>

            {/* For dual date analysis */}
            {coreNumbers.challengeNumbers.theoNgaySinhThuc && coreNumbers.challengeNumbers.theoNgayKhaiSinh ? (
              <div className="space-y-4">
                {/* Theo ngày sinh thực */}
                <div className="bg-white rounded-lg p-3 border border-red-100">
                  <p className="text-sm font-semibold text-energy-purple mb-3">
                    🟣 Theo ngày thực ({coreNumbers.challengeNumbers.theoNgaySinhThuc.date}) - Thử thách BÊN TRONG
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[1, 2, 3, 4].map(n => {
                      const ch = coreNumbers.challengeNumbers?.theoNgaySinhThuc?.[`thuThach${n}` as keyof typeof coreNumbers.challengeNumbers.theoNgaySinhThuc] as any;
                      return ch ? (
                        <div key={n} className={`text-center p-2 rounded-lg ${n === 3 ? 'bg-energy-purple/10 ring-2 ring-energy-purple' : 'bg-slate-50'}`}>
                          <p className="text-sm text-slate-400">{n === 3 ? 'CHÍNH' : `TT${n}`}</p>
                          <p className={`text-xl font-black ${n === 3 ? 'text-energy-purple' : 'text-slate-700'}`}>{ch.number}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    {[1, 2, 3, 4].map(n => {
                      const ch = coreNumbers.challengeNumbers?.theoNgaySinhThuc?.[`thuThach${n}` as keyof typeof coreNumbers.challengeNumbers.theoNgaySinhThuc] as any;
                      return ch ? (
                        <p key={n} className={n === 3 ? 'font-medium text-energy-purple' : ''}>
                          <strong>TT{n}:</strong> {ch.yNghia}
                        </p>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Theo ngày khai sinh */}
                <div className="bg-white rounded-lg p-3 border border-red-100">
                  <p className="text-sm font-semibold text-energy-orange mb-3">
                    🟠 Theo ngày khai sinh ({coreNumbers.challengeNumbers.theoNgayKhaiSinh.date}) - Thử thách BÊN NGOÀI
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[1, 2, 3, 4].map(n => {
                      const ch = coreNumbers.challengeNumbers?.theoNgayKhaiSinh?.[`thuThach${n}` as keyof typeof coreNumbers.challengeNumbers.theoNgayKhaiSinh] as any;
                      return ch ? (
                        <div key={n} className={`text-center p-2 rounded-lg ${n === 3 ? 'bg-energy-orange/10 ring-2 ring-energy-orange' : 'bg-slate-50'}`}>
                          <p className="text-sm text-slate-400">{n === 3 ? 'CHÍNH' : `TT${n}`}</p>
                          <p className={`text-xl font-black ${n === 3 ? 'text-energy-orange' : 'text-slate-700'}`}>{ch.number}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    {[1, 2, 3, 4].map(n => {
                      const ch = coreNumbers.challengeNumbers?.theoNgayKhaiSinh?.[`thuThach${n}` as keyof typeof coreNumbers.challengeNumbers.theoNgayKhaiSinh] as any;
                      return ch ? (
                        <p key={n} className={n === 3 ? 'font-medium text-energy-orange' : ''}>
                          <strong>TT{n}:</strong> {ch.yNghia}
                        </p>
                      ) : null;
                    })}
                  </div>
                </div>

                {coreNumbers.challengeNumbers.phanTichKetHop && (
                  <div className="p-3 bg-white rounded-lg border-2 border-red-200">
                    <p className="text-sm font-semibold text-red-700 mb-1">🔄 Phân tích kết hợp:</p>
                    <p className="text-sm text-red-700">{coreNumbers.challengeNumbers.phanTichKetHop}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(n => {
                    const ch = coreNumbers.challengeNumbers?.[`thuThach${n}` as keyof typeof coreNumbers.challengeNumbers] as any;
                    return ch ? (
                      <div key={n} className="text-center p-2 bg-white rounded-lg">
                        <p className="text-sm text-slate-400">TT{n}</p>
                        <p className="text-xl font-black text-red-700">{ch.number}</p>
                        <p className="text-sm text-slate-500 mt-1 leading-tight">{ch.yNghia?.split(' - ')[0]}</p>
                      </div>
                    ) : null;
                  })}
                </div>
                {coreNumbers.challengeNumbers.phanTich && (
                  <p className="text-sm text-red-700 mt-3 p-3 bg-white rounded-lg">
                    {coreNumbers.challengeNumbers.phanTich}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Missing Numbers */}
        {coreNumbers.missingNumbers && (
          <MissingNumbersSection missingNumbers={coreNumbers.missingNumbers} />
        )}

        {/* Karmic Debt */}
        <KarmicDebtSection personId={person.id} />

        {/* Hidden Passion */}
        <HiddenPassionSection personId={person.id} />

        {/* Subconscious Self */}
        <SubconsciousSelfSection personId={person.id} />

        {/* Inclusion Chart */}
        <InclusionChartSection personId={person.id} />
            </>
          )}

          {/* ===== TAB: LIFECYCLE ===== */}
          {activeTab === 'lifecycle' && (
            <>
        {/* Pinnacles - Life Phases */}
        <PinnaclesSection
          birthDate={person.birthDate.used}
          hasDual={hasDualAnalysis}
          actualDate={coreNumbers.byActualBirthDate?.date}
          officialDate={coreNumbers.byOfficialBirthDate?.date}
        />

        {/* Life Cycles - 3 major periods */}
        <LifeCyclesSection personId={person.id} />
            </>
          )}

          {/* ===== TAB: FAMILY ===== */}
          {activeTab === 'family' && (
            <>
        {/* Personal Family Compatibility */}
        <PersonCompatibilitySection personId={person.id} />

        {/* Three Pillars */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-energy-orange">&#9650;</span> Ba Trụ Cột
          </h3>
          <div className="space-y-4">
            <div>
              <PillarBar label="Tâm" score={threePillars.tam.score} maxScore={threePillars.tam.maxScore} color="bg-energy-purple" />
              <p className="text-sm text-slate-500 mt-2 ml-14">{threePillars.tam.analysis}</p>
            </div>
            <div>
              <PillarBar label="Trí" score={threePillars.tri.score} maxScore={threePillars.tri.maxScore} color="bg-energy-green" />
              <p className="text-sm text-slate-500 mt-2 ml-14">{threePillars.tri.analysis}</p>
            </div>
            <div>
              <PillarBar label="Lực" score={threePillars.luc.score} maxScore={threePillars.luc.maxScore} color="bg-energy-orange" />
              <p className="text-sm text-slate-500 mt-2 ml-14">{threePillars.luc.analysis}</p>
            </div>
          </div>
        </div>

        {/* Challenges & Potential */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span className="text-energy-red">!</span> Thách thức hiện tại
            </h3>
            <ul className="space-y-2">
              {person.currentChallenges.map((c, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-energy-red mt-0.5">&#8226;</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span className="text-energy-green">&#9889;</span> Tiềm năng khai phá
            </h3>
            <ul className="space-y-2">
              {person.unlockPotential.map((p, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-energy-green mt-0.5">&#8226;</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ideal Model */}
        <div className="bg-gradient-to-br from-energy-purple/5 to-energy-orange/5 rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>&#127775;</span> Hình mẫu hoàn thiện
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 text-sm font-semibold bg-energy-purple/10 text-energy-purple rounded">Tâm</span>
              <p className="text-sm text-slate-600 flex-1">{person.idealModel.tam}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 text-sm font-semibold bg-energy-green/10 text-energy-green rounded">Trí</span>
              <p className="text-sm text-slate-600 flex-1">{person.idealModel.tri}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 text-sm font-semibold bg-energy-orange/10 text-energy-orange rounded">Lực</span>
              <p className="text-sm text-slate-600 flex-1">{person.idealModel.luc}</p>
            </div>
          </div>
        </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
