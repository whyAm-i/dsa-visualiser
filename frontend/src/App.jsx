import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ds/:type" element={<Visualizer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
