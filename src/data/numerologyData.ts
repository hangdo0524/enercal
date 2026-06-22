import type { NumerologyData, NumerologyPerson, FamilyAnalysis, RoadmapPhase, SupportMatrix } from "../types";
import rawData from "./numerology-analysis.json";

// Transform Vietnamese JSON to English types
function transformPerson(raw: any): NumerologyPerson {
  const core = raw.cacSoCotLoi || {};
  const actual = core.theoNgaySinhThuc;
  const official = core.theoNgayKhaiSinh;

  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    birthDate: raw.birthDate,
    coreNumbers: {
      byActualBirthDate: actual ? {
        date: actual.date,
        note: actual.note,
        lifePath: {
          number: actual.soChủDao?.number || 0,
          meaning: actual.soChủDao?.yNghia || "",
          masterInfluence: actual.soChủDao?.soChuAnhHuong || null,
          traits: actual.soChủDao?.dacDiem ? {
            positive: actual.soChủDao.dacDiem.tichCuc || [],
            negative: actual.soChủDao.dacDiem.tieuCuc || []
          } : undefined
        },
        birthdayNumber: {
          number: actual.soNgaySinh?.number || 0,
          meaning: actual.soNgaySinh?.yNghia || ""
        }
      } : undefined,
      byOfficialBirthDate: official ? {
        date: official.date,
        note: official.note,
        lifePath: {
          number: official.soChủDao?.number || 0,
          meaning: official.soChủDao?.yNghia || "",
          masterInfluence: official.soChủDao?.soChuAnhHuong || null,
          traits: official.soChủDao?.dacDiem ? {
            positive: official.soChủDao.dacDiem.tichCuc || [],
            negative: official.soChủDao.dacDiem.tieuCuc || []
          } : undefined
        },
        birthdayNumber: {
          number: official.soNgaySinh?.number || 0,
          meaning: official.soNgaySinh?.yNghia || ""
        }
      } : undefined,
      dualDateAnalysis: core.phanTichKetHop2NgaySinh ? {
        summary: core.phanTichKetHop2NgaySinh.tomTat,
        interpretation: {
          innerSelf: {
            numbers: core.phanTichKetHop2NgaySinh.dienGiai?.benTrong?.cacSo || "",
            description: core.phanTichKetHop2NgaySinh.dienGiai?.benTrong?.moTa || ""
          },
          outerSelf: {
            numbers: core.phanTichKetHop2NgaySinh.dienGiai?.benNgoai?.cacSo || "",
            description: core.phanTichKetHop2NgaySinh.dienGiai?.benNgoai?.moTa || ""
          },
          conflict: {
            description: core.phanTichKetHop2NgaySinh.dienGiai?.xungDot?.moTa || "",
            currentState: core.phanTichKetHop2NgaySinh.dienGiai?.xungDot?.hienTrang || "",
            solution: core.phanTichKetHop2NgaySinh.dienGiai?.xungDot?.giaiPhap || ""
          }
        }
      } : undefined,
      // For non-dual date persons
      lifePath: core.soChủDao ? {
        number: core.soChủDao.number,
        meaning: core.soChủDao.yNghia,
        masterInfluence: core.soChủDao.soChuAnhHuong || null,
        traits: core.soChủDao.dacDiem ? {
          positive: core.soChủDao.dacDiem.tichCuc || [],
          negative: core.soChủDao.dacDiem.tieuCuc || []
        } : undefined
      } : undefined,
      birthdayNumber: core.soNgaySinh ? {
        number: core.soNgaySinh.number,
        reducedTo: core.soNgaySinh.rutGon,
        meaning: core.soNgaySinh.yNghia,
        masterNumber: core.soNgaySinh.laSoChu
      } : undefined,
      expressionNumber: {
        number: core.soBieuDat?.number || 0,
        calculation: core.soBieuDat?.congThuc || "",
        meaning: core.soBieuDat?.yNghia || ""
      },
      soulUrge: {
        number: core.soLinhHon?.number || 0,
        calculation: core.soLinhHon?.congThuc || "",
        meaning: core.soLinhHon?.yNghia || ""
      },
      // New fields
      personalityNumber: core.soNhanCach ? {
        number: core.soNhanCach.number,
        calculation: core.soNhanCach.congThuc || "",
        meaning: core.soNhanCach.yNghia || "",
        note: core.soNhanCach.ghiChu
      } : undefined,
      maturityNumber: core.soTruongThanh ? (
        // Check if dual structure (has theoNgaySinhThuc)
        core.soTruongThanh.theoNgaySinhThuc ? core.soTruongThanh : {
          number: core.soTruongThanh.number,
          calculation: core.soTruongThanh.congThuc || "",
          meaning: core.soTruongThanh.yNghia || "",
          note: core.soTruongThanh.ghiChu
        }
      ) : undefined,
      personalYear: core.soNamCaNhan,
      challengeNumbers: core.soThuThach,
      missingNumbers: core.soThieu
    },
    threePillars: {
      tam: {
        score: raw.baTruCot?.tam?.diem || 0,
        maxScore: raw.baTruCot?.tam?.diemToiDa || 10,
        analysis: raw.baTruCot?.tam?.phanTich || ""
      },
      tri: {
        score: raw.baTruCot?.tri?.diem || 0,
        maxScore: raw.baTruCot?.tri?.diemToiDa || 10,
        analysis: raw.baTruCot?.tri?.phanTich || ""
      },
      luc: {
        score: raw.baTruCot?.luc?.diem || 0,
        maxScore: raw.baTruCot?.luc?.diemToiDa || 10,
        analysis: raw.baTruCot?.luc?.phanTich || ""
      }
    },
    currentChallenges: raw.thachThucHienTai || [],
    unlockPotential: raw.tiemNangCanKhaiPha || [],
    idealModel: {
      tam: raw.hinhMauHoanThien?.tam || "",
      tri: raw.hinhMauHoanThien?.tri || "",
      luc: raw.hinhMauHoanThien?.luc || ""
    },
    // Personal portrait (chân dung tổng hợp)
    personalPortrait: raw.chanDungTongHop,
    // Personal 5-year roadmap
    personalRoadmap: raw.loTrinhCaNhan2026_2030,
    // Additional Vietnamese-only fields
    numerologyGuidance: raw.huongDanTuThanSoHoc,
    specificSuggestions: raw.goiYCuThe
  };
}

function transformFamilyAnalysis(raw: any): FamilyAnalysis {
  const family = raw.phanTichGiaDinh || {};
  return {
    familyLifePath: {
      calculation: family.soGiaDinh?.congThuc || "",
      number: family.soGiaDinh?.number || 0,
      meaning: family.soGiaDinh?.yNghia || "",
      familyMission: family.soGiaDinh?.suMenhGiaDinh || ""
    },
    numberDistribution: {
      dominant: family.phanBoSo?.chiPhoi || [],
      pattern: family.phanBoSo?.moHinh || "",
      significance: family.phanBoSo?.yNghia || ""
    },
    masterNumbersInFamily: {
      count: family.soChuTrongGiaDinh?.soLuong || 0,
      details: family.soChuTrongGiaDinh?.chiTiet || [],
      significance: family.soChuTrongGiaDinh?.yNghia || ""
    },
    complementaryDynamics: {
      strengths: (family.dongLucBoTro?.diemManh || []).map((s: any) => ({
        pair: s.cap,
        dynamic: s.moTa
      })),
      tensions: (family.dongLucBoTro?.xungDot || []).map((t: any) => ({
        pair: t.cap,
        tension: t.xungDot,
        solution: t.giaiPhap
      }))
    }
  };
}

function transformRoadmap(raw: any): { vision: string; phases: RoadmapPhase[] } {
  const roadmap = raw.loTrinh2026_2030 || {};
  return {
    vision: roadmap.tamNhin || "",
    phases: (roadmap.cacGiaiDoan || []).map((p: any) => ({
      period: p.thoiGian,
      theme: p.chuDe,
      priorityMember: {
        id: p.thanhVienUuTien?.id || "all",
        secondary: p.thanhVienUuTien?.phu,
        reason: p.thanhVienUuTien?.lyDo || ""
      },
      focusTraits: p.dacDiemTapTrung,
      actions: p.hanhDong || {},
      milestones: p.mucTieu
    }))
  };
}

function transformSupportMatrix(raw: any): { description: string; matrix: SupportMatrix[] } {
  const support = raw.maHoTro || {};
  return {
    description: support.moTa || "",
    matrix: (support.danhSach || []).map((s: any) => ({
      supporter: s.nguoiHoTro,
      supports: (s.hoTro || []).map((h: any) => ({
        receiver: h.nguoiNhan,
        how: h.cachThuc
      }))
    }))
  };
}

function transformRecognitionGuide(raw: any): { principle: string; byPerson: { person: string; rightWay: string[]; avoid: string[] }[] } {
  const guide = raw.huongDanGhiNhan || {};
  return {
    principle: guide.nguyenTac || "",
    byPerson: (guide.theoNguoi || []).map((p: any) => ({
      person: p.nguoi,
      rightWay: p.cachDung || [],
      avoid: p.tranh || []
    }))
  };
}

export function loadNumerologyData(): NumerologyData {
  const raw = rawData as any;

  return {
    metadata: {
      createdAt: raw.metadata?.createdAt || "",
      version: raw.metadata?.version || "",
      calculationMethod: raw.metadata?.phuongPhapTinh || "Pythagorean",
      terminology: raw.metadata?.giaiThichThuatNgu
    },
    individuals: (raw.individuals || []).map(transformPerson),
    familyAnalysis: transformFamilyAnalysis(raw),
    familyRoadmap2026_2030: transformRoadmap(raw),
    supportMatrix: transformSupportMatrix(raw),
    recognitionGuide: transformRecognitionGuide(raw)
  };
}

export function getNumerologyPerson(id: string) {
  const data = loadNumerologyData();
  return data.individuals.find((p) => p.id === id);
}

export function getNumerologyProfiles() {
  const data = loadNumerologyData();
  return data.individuals.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
  }));
}

// Export raw data for advanced features
export function getRawNumerologyData() {
  return rawData;
}

// ========================================
// HƯỚNG DẪN THÊM GIA ĐÌNH MỚI
// ========================================
//
// 1. Tạo file JSON mới: src/data/numerology-{familyId}.json
//    (Copy cấu trúc từ numerology-analysis.json)
//
// 2. Import file mới ở đầu file này:
//    import familyXData from "./numerology-familyx.json";
//
// 3. Tạo map DATA_BY_FAMILY:
//    const DATA_BY_FAMILY: Record<string, any> = {
//      'lexuanxuyen': rawData,
//      'familyx': familyXData,
//    };
//
// 4. Cập nhật các function để nhận familyId:
//    export function loadNumerologyData(familyId = 'lexuanxuyen') {
//      const raw = DATA_BY_FAMILY[familyId] || rawData;
//      // ... rest of function
//    }
//
// 5. Cập nhật AuthContext.tsx:
//    - Thêm users mới với familyId tương ứng
//    - Thêm vào FAMILY_DATA_FILES
//
// ========================================
