import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HospitalPage from "./pages/HospitalPage";
import AddHospital from "./pages/AddHospital";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HospitalList from "./components/HospitalList";
import EditHospitalPage from "./pages/EditHospitalPage";
import AddHospitalDetails from "./pages/AddHospitalDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./context/AuthContext";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <Router>
      <AuthProvider> {/* ✅ AuthProvider is inside Router now */}
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hospital/:id" element={<HospitalPage />} />
            <Route path="/add-hospital" element={<AddHospital />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hospital-list" element={<HospitalList />} />
            <Route path="/edit-hospital/:id" element={<EditHospitalPage />} />
            <Route path="/hospital/:id/details" element={<AddHospitalDetails />} />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
