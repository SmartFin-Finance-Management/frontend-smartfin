// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { Provider } from './Components/ui/provider';
import { ProjectFormPage } from './Pages/ProjectFormPage'
import ClientInput from './Pages/ClientInput';

import ClientManagement from './Pages/ClientManagement';


const App: React.FC = () => {
    return (
        <Provider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/project" element={<ProjectFormPage />} />
                    <Route path="/clientInput" element={<ClientInput />} />
                    <Route path="/clientManagement" element={<ClientManagement/>} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
