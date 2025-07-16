import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from './components/ui/tooltip'
import { HashRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import RedirectIfAuth from './components/RedirectIfAuth';

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path='/' element={<Index/>}/>
              <Route path='/login' element={<RedirectIfAuth><Login/></RedirectIfAuth>}/>
              <Route path='/register' element={<RedirectIfAuth><Register/></RedirectIfAuth>}/>
              <Route path='/forgot-password' element={<RedirectIfAuth><ForgotPassword/></RedirectIfAuth>}/>
              <Route path='/reset-password/:token' element={<RedirectIfAuth><ResetPassword/></RedirectIfAuth>}/>
              <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
              <Route path='/admin' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
              <Route path='*' element={<NotFound/>}/>
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
