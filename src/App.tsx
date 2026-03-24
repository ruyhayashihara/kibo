/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Jobs } from "./pages/Jobs"
import { JobDetail } from "./pages/JobDetail"
import { Register } from "./pages/Register"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { CompanyDashboard } from "./pages/CompanyDashboard"
import { CompanyNewJob } from "./pages/CompanyNewJob"
import { AdminDashboard } from "./pages/AdminDashboard"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="vagas" element={<Jobs />} />
            <Route path="vagas/:id" element={<JobDetail />} />
            <Route path="cadastro" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="empresa/dashboard" element={<CompanyDashboard />} />
            <Route path="empresa/vagas/nova" element={<CompanyNewJob />} />
            <Route 
              path="admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}
