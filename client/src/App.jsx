import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Resources from "./pages/Resources";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Navbar />

        {/* MAIN CONTENT */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:semesterId" element={<Resources />} />
            <Route path="/resources/:semesterId/:courseCode" element={<Resources />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;