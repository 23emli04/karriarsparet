
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage.tsx";

function App() {


  return (
      <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-slate-50">

              <main className="flex-grow">
                  <Routes>
                      <Route path="/" element={<HomePage />} />
                  </Routes>
              </main>

          </div>
      </BrowserRouter>
  )
}

export default App
