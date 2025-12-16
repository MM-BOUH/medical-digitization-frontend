import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DigitizePage from './pages/DigitizePage';
import ReportsListPage from './pages/ReportsListPage';
import ReportDetailPage from './pages/ReportDetailPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DigitizePage />} />
          <Route path="/digitize" element={<DigitizePage />} />
          <Route path="/reports" element={<ReportsListPage />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} /> {/* Add this */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;