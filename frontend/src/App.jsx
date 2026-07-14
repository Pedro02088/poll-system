import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import PollList from './pages/PollList'
import PollCreate from './pages/PollCreate'
import PollDetail from './pages/PollDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><PollList /></ProtectedRoute>} />
          <Route path="/polls/new" element={<ProtectedRoute><PollCreate /></ProtectedRoute>} />
          <Route path="/polls/:id" element={<ProtectedRoute><PollDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
