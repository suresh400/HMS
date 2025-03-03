import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/hospitalList.css";
import { AuthContext } from "../context/AuthContext";

const HospitalList = () => {
  const { user } = useContext(AuthContext); // Get user details
  const isAdmin = user?.role === "admin"; // Check if user is an admin
  const [hospitals, setHospitals] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch hospitals whenever `selectedCity` changes
  useEffect(() => {
    fetchHospitals();
  }, [selectedCity]); // ✅ Runs every time city filter changes

  // ✅ Fetch hospitals from API
  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Ensure user is authenticated
      if (!token) {
        setError("Authentication error. Please log in.");
        return;
      }

      let url = "http://localhost:5000/api/v1/hospitals";
      if (selectedCity) url += `?city=${selectedCity}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Send Authorization header
      });

      // ✅ Check if response contains hospitals
      if (response.data.length > 0) {
        setHospitals(response.data);

        // ✅ Extract unique cities from hospitals
        const uniqueCities = [...new Set(response.data.map((hospital) => hospital.city))];
        setCities(uniqueCities);
        setError(""); // ✅ Clear error if hospitals found
      } else {
        setHospitals([]); // ✅ Clear hospital list if none found
        setError(`No hospitals found${selectedCity ? ` in ${selectedCity}` : ""}.`);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError("Failed to load hospitals. Please try again.");
    }
  };

  // ✅ Handle hospital deletion (Admin only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;

    try {
      const token = localStorage.getItem("token");

      // ✅ Ensure user is authenticated
      if (!token) {
        setError("Authentication error. Please log in.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/v1/hospitals/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Send Authorization header
      });

      setHospitals(hospitals.filter((hospital) => hospital._id !== id)); // ✅ Remove from UI
      alert("Hospital deleted successfully!");
    } catch (error) {
      console.error("Error deleting hospital:", error);
      setError("Failed to delete hospital.");
    }
  };

  return (
    <div className="hospital-list">
      <h2>Hospitals</h2>

      {/* ✅ Dropdown to filter by city */}
      <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
        <option value="">All Cities</option>
        {cities.map((city, index) => (
          <option key={index} value={city}>{city}</option>
        ))}
      </select>

      {/* ✅ Display Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* ✅ Display list of hospitals */}
      <ul>
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <li key={hospital._id}>
              <Link to={`/hospital/${hospital._id}`}>
                <h3>{hospital.name} ({hospital.city})</h3>
              </Link>
              <p><strong>Specialities:</strong> {hospital.specialities.join(", ")}</p>
              <p><strong>Rating:</strong> ⭐ {hospital.rating}</p>

              {/* ✅ Role-based Access Control */}
              {isAdmin ? (
                <>
                  <button onClick={() => handleDelete(hospital._id)} className="delete-btn">🗑️ Delete</button>
                  <Link to={`/hospital/${hospital._id}`} className="view-btn">👁️ View</Link>
                </>
              ) : (
                <Link to={`/hospital/${hospital._id}`} className="view-btn">👁️ View</Link>
              )}
            </li>
          ))
        ) : (
          <p>No hospitals available.</p>
        )}
      </ul>
    </div>
  );
};

export default HospitalList;
