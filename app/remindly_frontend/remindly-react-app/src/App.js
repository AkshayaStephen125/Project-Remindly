import logo from './logo.svg';
import './App.css';
import Signup from './Components/SingUp';
import Home from './Components/Home';
import SignIn from './Components/SignIn';
import Reminders from './Components/Reminders';
// import ProtectedRoute from './Components/ProtectedRoute'
import ReminderListener from './Components/ReminderListener';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
  Notification.requestPermission();
}, []);

  return (
      <Router>
         <ReminderListener />    
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/reminder" element={<Reminders/>} />
        
        </Routes>
  </Router>
  );
}

export default App;
