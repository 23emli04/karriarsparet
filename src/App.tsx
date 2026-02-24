import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar, Footer } from "./components/layout";
import HomePage from "./components/pages/HomePage";
import EducationDetailPage from "./components/pages/EducationDetailPage";
import ProviderPage from "./components/pages/ProviderPage";
import ProvidersListPage from "./components/pages/ProvidersListPage";
import AboutPage from "./components/pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/education/:id" element={<EducationDetailPage />} />
            <Route path="/providers" element={<ProvidersListPage />} />
            <Route path="/provider/:name" element={<ProviderPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App
