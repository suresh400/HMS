import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HospitalPage from "./pages/HospitalPage";
import AddHospital from "./pages/AddHospital";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HospitalList from "./components/HospitalList";
import HospitalDetails from "./components/HospitalDetails";
import EditHospitalPage from "./pages/EditHospitalPage";
import AddHospitalDetails from "./pages/AddHospitalDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";  // Import Footer
import {AuthProvider} from "./context/AuthContext";
import Contact from "./pages/Contact";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="main-content">  {/* Wrapper to avoid footer overlay */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hospital/:id" element={<HospitalPage />} />
            <Route path="/add-hospital" element={<AddHospital />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hospital-details/:id" element={<HospitalDetails />} />
            <Route path="/hospital-list" element={<HospitalList />} />
            <Route path="/edit-hospital/:id" element={<EditHospitalPage />} />
            <Route path="/hospital/:id/details" element={<AddHospitalDetails />} />
          </Routes>
        </div>
        <Footer />  {/* Add Footer */}
      </Router>
    </AuthProvider>
  );
};

export default App;
