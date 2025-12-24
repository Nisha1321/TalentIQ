import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import Jobs from "./jobs";
import JobOverview from "./jobOverview";
import Analytics from "./analytics";
import CandidateCompare from "./candidateCompare";
import Settings from "./settings";
import Login from "./login";
import Signup from "./signup";

import { AuthProvider } from "./auth/AuthContext";   // ✅ add this
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>{/* ✅ wrap everything */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<App />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job-overview" element={<JobOverview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/compare" element={<CandidateCompare />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
