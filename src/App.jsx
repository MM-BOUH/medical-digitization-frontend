import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DigitizePage from './pages/DigitizePage';
import ReportsListPage from './pages/ReportsListPage';

/**
 * Main App Component
 * Sets up routing and global application structure
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DigitizePage />} />
          <Route path="/digitize" element={<DigitizePage />} />
          <Route path="/reports" element={<ReportsListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;