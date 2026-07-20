import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          {/* Add more routes here later */}
          <Route path="analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics Page</h1></div>} />
          <Route path="interviews" element={<div className="p-8"><h1 className="text-2xl font-bold">Interview Experiences</h1></div>} />
          <Route path="reports" element={<div className="p-8"><h1 className="text-2xl font-bold">Reports</h1></div>} />
          <Route path="activity" element={<div className="p-8"><h1 className="text-2xl font-bold">Activity</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
