import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './views/Welcome';
import BasicInfo from './views/BasicInfo';
import Home from './views/Home';
import Analysis from './views/Analysis';
import Results from './views/Results';
import Booking from './views/Booking';
import Emergency from './views/Emergency';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/details" element={<BasicInfo />} />
          <Route path="/home" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/results" element={<Results />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
