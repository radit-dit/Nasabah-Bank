import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardPanel from "./components/cardPanel";
import BankAccountDashboard from "./components/BankAccountDashboard";

const API_BASE_URL = 'http://localhost:3000/api';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardPanel />} />
        <Route path="/dashboard" element={<BankAccountDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
  
