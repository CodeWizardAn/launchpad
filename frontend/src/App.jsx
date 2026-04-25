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
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
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
  )
}