import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Cookies from 'js-cookie';

import ProtectedRoute from './components/routes/protectedRoute';
import ProtectedAdminRoute from './components/routes/protectedAdminRoute';
import NotFound from './components/NotFound/NotFound';

// import MainNavbar from './components/navBar/navBar';

import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import UserPanel from './components/AccountSettings/AccountSettings';

import AddProject from './components/addProject/AddProject';
import AddProjectNav from './components/addProject/navBar/APNavbar';
import ProjectInform from './components/addProject/details/inform/inform';
import ProjectBasics from './components/addProject/details/basicInfo/basicInfo';
import ProjectReward from './components/addProject/details/reward/Reward';
import ProjectSubmitForApproval from './components/addProject/details/submit/submitForApproval';

import AdminLogin from './components/Admin/Login/adminLogin';
import AdminHome from './components/Admin/Panel/home/home';
import AdminNavBar from './components/Admin/Panel/adminNavBar';
import AdminCategories from './components/Admin/Panel/categories/categoriesCrud';
import AdminChangePsw from './components/Admin/Panel/changePassword/changePsw';
import AdminPendingProjects from './components/Admin/Panel/pendingProjects/pendingProjects';
// import MainNavbar from './components/navBar/navBar';

// import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const authTokenFromCookie = Cookies.get('authToken');
      if (authTokenFromCookie) {
        setAuthToken(authTokenFromCookie);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const logout = () => {
    Cookies.remove('authToken');
    setAuthToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route
          path='*'
          element={
            <>
              <Navbar isAuthenticated={authToken} onLogout={logout} />
              <Routes>
                <Route path='*' element={<NotFound />} />
                <Route path='/' element={<Home />} />
                <Route
                  path='/user/*'
                  element={
                    <ProtectedRoute>
                      <Routes>
                        <Route path='*' element={<NotFound />} />
                        <Route path='panel' element={<UserPanel />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/add-project/*'
                  element={
                    <ProtectedRoute>
                      <AddProjectNav />
                      <Routes>
                        <Route path='*' element={<NotFound />} />
                        <Route path='inform' element={<ProjectInform />} />
                        <Route path='basics' element={<ProjectBasics />} />
                        <Route path='reward' element={<ProjectReward />} />
                        <Route path='submit' element={<ProjectSubmitForApproval />} />
                      </Routes>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/admin/*'
                  element={
                    <ProtectedAdminRoute>
                      <AdminNavBar />
                      <Routes>
                        <Route path='*' element={<NotFound />} />
                        <Route path='home' element={<AdminHome />} />
                        <Route path='change-password' element={<AdminChangePsw />} />
                        <Route path='categories' element={<AdminCategories />} />
                        <Route
                          path='pending-projects'
                          element={<AdminPendingProjects />}
                        />
                      </Routes>
                    </ProtectedAdminRoute>
                  }
                />
                <Route path='/logout' element={<Navigate to='/' replace />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
