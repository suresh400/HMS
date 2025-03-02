import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/hospitalList.css";
import axios from "axios";

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch hospitals and cities when the page loads
  useEffect(() => {
    fetchHospitals();
  }, [selectedCity]);

  // Get all hospitals (filtered by city if selected)
  const fetchHospitals = async () => {
    try {
      let url = "http://localhost:5000/api/v1/hospitals";
      if (selectedCity) url += `?city=${selectedCity}`;

      const response = await axios.get(url);
      setHospitals(response.data);

      // Extract unique city names from hospitals list
      const uniqueCities = [...new Set(response.data.map((hospital) => hospital.city))];
      setCities(uniqueCities);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  // Handle hospital deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this hospital?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/v1/hospitals/delete?id=${id}`);
      setHospitals(hospitals.filter((hospital) => hospital._id !== id)); // Remove from UI
      alert("Hospital deleted successfully!");
      fetchHospitals(); // Refresh hospitals list
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  return (
    <div className="hospital-list">
      <h2>Hospitals</h2>

      {/* Dropdown to filter by city */}
      <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
        <option value="">All Cities</option>
        {cities.map((city, index) => (
          <option key={index} value={city}>{city}</option>
        ))}
      </select>

      {/* Display list of hospitals */}
      <ul>
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <li key={hospital._id}>
              <Link to={`/hospital/${hospital._id}`}>
                <h3>{hospital.name} ({hospital.city})</h3>
              </Link>
              <p><strong>Specialities:</strong> {hospital.specialities.join(", ")}</p>
              <p><strong>Rating:</strong> ⭐ {hospital.rating}</p>
              <button onClick={() => handleDelete(hospital._id)}>🗑️ Delete</button>
            </li>
          ))
        ) : (
          <p>No hospitals found.</p>
        )}
      </ul>
    </div>
  );
};

export default HospitalList;
