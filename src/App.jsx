import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DigitizePage from './pages/DigitizePage';
import ReportsListPage from './pages/ReportsListPage';
import ReportDetailPage from './pages/ReportDetailPage';
import { BASE_URL } from './actions/medicalReports';

const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

function App() {
  const lastPingRef = useRef(0);

  const ping = () => {
    const now = Date.now();
    if (now - lastPingRef.current < COOLDOWN_MS) return;
    lastPingRef.current = now;
    fetch(`${BASE_URL}/health/`, { method: 'GET' }).catch(() => {});
  };

  useEffect(() => {
    // Wake up backend on first load
    ping();

    // Wake up again if user returns to the tab after inactivity
    const handleFocus = () => ping();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DigitizePage />} />
          <Route path="/digitize" element={<DigitizePage />} />
          <Route path="/reports" element={<ReportsListPage />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;