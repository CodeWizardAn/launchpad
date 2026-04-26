import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Notes from './pages/Notes'
import Vault from './pages/Vault'
import Profile from './pages/Profile'
import Resume from './pages/Resume'
import CGPA from './pages/CGPA'
import Salary from './pages/Salary'
import Jobs from './pages/Jobs'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar />
        <main style={{
          flex: 1,
          padding: '2.5rem',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginLeft: '240px',
          minHeight: '100vh'
        }}>
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/tasks"   element={<Tasks />}     />
            <Route path="/notes"   element={<Notes />}     />
            <Route path="/vault"   element={<Vault />}     />
            <Route path="/profile" element={<Profile />}   />
            <Route path="/resume"  element={<Resume />}    />
            <Route path="/cgpa"    element={<CGPA />}      />
            <Route path="/salary"  element={<Salary />}    />
            <Route path="/jobs"    element={<Jobs />}      />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )}