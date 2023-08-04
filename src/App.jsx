import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Dashboard from './Pages/dashboard';
import Store from './Pages/Store';
import UserContextProvider, { UserState } from '../context/userContext';
import BillPage from './Pages/BillPage';

axios.defaults.baseURL = 'https://store-server-jy86.onrender.com';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Toaster position='bottom-right' toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route
          path='/'
          element={
            <DashboardWrapper />
          }
        />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/store'
          element={
            <StoreWrapper />
          }
        />
        <Route
          path='/bills'
          element={
            <BillWrapper />
          }
        />
      </Routes>
    </UserContextProvider>
  );
}

function DashboardWrapper() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo ? <Dashboard /> : <Navigate to='/login' />;
}

function StoreWrapper() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo ? <Store /> : <Navigate to='/login' />;
}

function BillWrapper() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo ? <BillPage /> : <Navigate to='/login' />;
}

export default App;
