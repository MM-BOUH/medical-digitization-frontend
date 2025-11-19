import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DigitizePage from './pages/DigitizePage';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
