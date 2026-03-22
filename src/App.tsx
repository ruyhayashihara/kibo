/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import Screen1Homepage from "./pages/Screen1Homepage"
import { Jobs } from "./pages/Jobs"
import { JobDetail } from "./pages/JobDetail"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { CompanyDashboard } from "./pages/CompanyDashboard"
import { CompanyNewJob } from "./pages/CompanyNewJob"
import { AdminDashboard } from "./pages/AdminDashboard"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Screen1Homepage />} />
        <Route element={<Layout />}>
          <Route path="vagas" element={<Jobs />} />
          <Route path="vagas/:id" element={<JobDetail />} />
          <Route path="cadastro" element={<Register />} />
          <Route path="login" element={<Register />} /> {/* For now, point login to register */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="empresa/dashboard" element={<CompanyDashboard />} />
          <Route path="empresa/vagas/nova" element={<CompanyNewJob />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}
