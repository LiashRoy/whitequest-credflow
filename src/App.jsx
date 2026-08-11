import { HashRouter, Routes, Route } from 'react-router-dom';
import { LoanProvider } from './context/LoanContext';
import { ApplicationsProvider } from './context/ApplicationsContext';
import Home from './screens/Home';
import BorrowerFlow from './screens/BorrowerFlow';
import AdminDashboard from './admin/AdminDashboard';

export default function App() {
  return (
    <ApplicationsProvider>
      <LoanProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apply" element={<BorrowerFlow />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </HashRouter>
      </LoanProvider>
    </ApplicationsProvider>
  );
}
