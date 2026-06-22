import { useState, useMemo } from "react";
import { Layout } from "./components/Layout";
import { DailyView } from "./components/DailyView";
import { CalendarView } from "./components/CalendarView";
import { loadAndProcessProfiles } from "./data/processData";
import { getTodayStr } from "./utils/dates";
import "./index.css";

export type ViewType = "daily" | "calendar";

function App() {
  const [view, setView] = useState<ViewType>("daily");
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [calendarViewDate, setCalendarViewDate] = useState(getTodayStr());

  const processedProfiles = useMemo(() => loadAndProcessProfiles(), []);

  const [profileId, setProfileId] = useState(processedProfiles[0]?.id ?? "");

  const currentProfile =
    processedProfiles.find((p) => p.id === profileId) ?? processedProfiles[0];

  // Handle view change from sidebar/menu - reset to today
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    if (newView === "daily") {
      setSelectedDate(getTodayStr());
    } else {
      setCalendarViewDate(getTodayStr());
    }
  };

  // Handle day click from calendar - keep the clicked date
  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setView("daily");
  };

  if (!currentProfile) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <Layout
      view={view}
      onViewChange={handleViewChange}
      profileId={profileId}
      onProfileChange={setProfileId}
      profiles={processedProfiles}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
    >
      {view === "daily" ? (
        <DailyView profile={currentProfile} date={selectedDate} />
      ) : (
        <CalendarView
          profile={currentProfile}
          selectedDate={selectedDate}
          viewDate={calendarViewDate}
          onViewDateChange={setCalendarViewDate}
          onDayClick={handleDayClick}
        />
      )}
    </Layout>
  );
}

export default App;
