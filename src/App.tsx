import { useState, useMemo, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { Layout } from "./components/Layout";
import { DailyView } from "./components/DailyView";
import { CalendarView } from "./components/CalendarView";
import { NumerologyPersonal } from "./components/NumerologyPersonal";
import { NumerologyFamily } from "./components/NumerologyFamily";
import { NumerologyRoadmap } from "./components/NumerologyRoadmap";
import { NumerologyPersonalRoadmap } from "./components/NumerologyPersonalRoadmap";
import { loadAndProcessProfiles } from "./data/processData";
import { loadNumerologyData, getNumerologyProfiles } from "./data/numerologyData";
import { getTodayStr } from "./utils/dates";
import "./index.css";

export type ViewType = "daily" | "calendar" | "numerology-personal" | "numerology-family" | "numerology-roadmap" | "numerology-personal-roadmap";

function AppContent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [view, setView] = useState<ViewType>("daily");
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [calendarViewDate, setCalendarViewDate] = useState(getTodayStr());

  const processedProfiles = useMemo(() => loadAndProcessProfiles(), []);
  const numerologyData = useMemo(() => loadNumerologyData(), []);
  const numerologyProfiles = useMemo(() => getNumerologyProfiles(), []);

  const defaultPersonId = user?.personId || numerologyProfiles[0]?.id || "";
  const [numProfileId, setNumProfileId] = useState(defaultPersonId);

  useEffect(() => {
    if (user?.personId && !isAdmin) {
      setNumProfileId(user.personId);
    }
  }, [user, isAdmin]);

  const effectiveProfileId = isAdmin ? numProfileId : (user?.personId || numProfileId);

  const profileId = processedProfiles.find((p) => p.id === effectiveProfileId)?.id
    ?? processedProfiles[0]?.id
    ?? "";

  const currentProfile = processedProfiles.find((p) => p.id === profileId) ?? processedProfiles[0];

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    if (newView === "daily") {
      setSelectedDate(getTodayStr());
    } else if (newView === "calendar") {
      setCalendarViewDate(getTodayStr());
    }
  };

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setView("daily");
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!currentProfile) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Không có dữ liệu
      </div>
    );
  }

  const currentNumPerson = numerologyData.individuals.find((p) => p.id === effectiveProfileId);

  const visibleProfiles = isAdmin
    ? numerologyProfiles
    : numerologyProfiles.filter(p => p.id === user?.personId);

  const renderContent = () => {
    switch (view) {
      case "daily":
        return <DailyView profile={currentProfile} date={selectedDate} onDateChange={setSelectedDate} />;
      case "calendar":
        return (
          <CalendarView
            profile={currentProfile}
            selectedDate={selectedDate}
            viewDate={calendarViewDate}
            onViewDateChange={setCalendarViewDate}
            onDayClick={handleDayClick}
          />
        );
      case "numerology-personal":
        return currentNumPerson ? (
          <NumerologyPersonal person={currentNumPerson} />
        ) : null;
      case "numerology-family":
        return (
          <NumerologyFamily
            data={numerologyData}
          />
        );
      case "numerology-roadmap":
        return (
          <NumerologyRoadmap
            roadmap={numerologyData.familyRoadmap2026_2030}
            individuals={numerologyData.individuals}
          />
        );
      case "numerology-personal-roadmap":
        return currentNumPerson ? (
          <NumerologyPersonalRoadmap person={currentNumPerson} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Layout
      view={view}
      onViewChange={handleViewChange}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      numProfileId={effectiveProfileId}
      onNumProfileChange={setNumProfileId}
      numProfiles={visibleProfiles}
    >
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
