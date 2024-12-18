// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { Provider } from './Components/ui/provider';
import { ProjectFormPage } from './Pages/ProjectFormPage'
import ClientInput from './Pages/ClientInput';
import EmployeeFormPage from './Pages/EmployeeFormPage';
import ClientManagement from './Pages/ClientManagement';
import OrgDetails from './Pages/OrgDetails';
import { ProjectDetailsPage } from './Pages/ProjectDetailsPage';
import EmployeeDetailsPage from './Pages/EmployeeDetailsPage';
import { ProjectPage } from './Pages/ProjectPage';
import DashboardPage from './Pages/DashboardPage';
import ClientInfo from './Pages/clientDetails';
import UserInput from './Pages/UserInput';
import UserManagement from './Pages/userManagement';
import Profile from './Pages/profile';
import SaloginPage from './Pages/Salogin';
import OrganizationTable from './Pages/adminDashboard';
import FinanceForm from './Pages/FinanceForm';
import InvoiceDetailsPage from './Pages/InvoiceDetailsPage';
import TermsConditions from './Pages/terms';
import PrivacyPolicy from './Pages/policy';
import Contact from './Pages/Contact';
import AttendanceFormPage from './Pages/AttendanceFormPage';
import { EmployeesPage } from './Pages/EmployeesPage';

const App: React.FC = () => {
    return (
        <Provider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={<DashboardPage />} />
                    <Route path="/project" element={<ProjectDetailsPage />} />
                    <Route path="/clientInput" element={<ClientInput />} />
                    <Route path="/clientManagement" element={<ClientManagement />} />
                    <Route path="/orgdetails" element={<OrgDetails />} />
                    <Route path="/EmployeeFormPage" element={<EmployeeFormPage />} />
                    <Route path="/EmployeeDetailsPage" element={<EmployeeDetailsPage />} />
                    <Route path="/project/form" element={<ProjectFormPage />} />
                    <Route path="/project/:projectId" element={<ProjectPage />} />

                    <Route path="/AttendanceFormPage/:empId" element={<AttendanceFormPage />} />

                    <Route path="/projects/update/:projectId" element={<ProjectFormPage />} />
                    <Route path="/clientInfo" element={<ClientInfo />} /> {/* Corrected casing */}

                    <Route path="/projects/:projectId/employees" element={<EmployeesPage />} />

                    <Route path="/client/:clientId" element={<ClientInfo />} />
                    <Route path="/userInput" element={<UserInput />} />
                    <Route path="/userManagement" element={<UserManagement />} />
                    <Route path="/profile" element={<Profile />} />

                    <Route path="/saLogin" element={<SaloginPage />} />
                    <Route path="/saHome" element={<OrganizationTable />} />

                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/contact" element={<Contact />} />



                    <Route path="/InvoiceDetailsPage/:projectId" element={<InvoiceDetailsPage />} />
                    <Route path="/FinanceForm" element={<FinanceForm />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
