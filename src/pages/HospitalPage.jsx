import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../css/hospitalPage.css";
import { AuthContext } from "../context/AuthContext";
import Chatbot from "../components/ChatBot";

const HospitalPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext); // ✅ Get user from AuthContext
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        setLoading(true);
        setError(null); // ✅ Reset error state before fetching

        const response = await axios.get(`http://localhost:5000/api/v1/hospitals/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ Authorization added
        });

        if (!response.data || response.data.error) {
          setError("Hospital not found.");
          return;
        }

        setHospital(response.data);
      } catch (error) {
        console.error("Error fetching hospital details:", error);
        setError("Failed to load hospital details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [id]);

  if (loading) return <p>Loading hospital details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="hospital-details">
      <h2>{hospital.name}</h2>
      <p><strong>City:</strong> {hospital.city}</p>
      <img src={hospital.imageUrl} alt={hospital.name} className="hospital-main-image" />
      <p><strong>Specialities:</strong> {hospital.specialities ? hospital.specialities.join(", ") : "N/A"}</p>
      <p><strong>Rating:</strong> ⭐ {hospital.rating}</p>
      <p><strong>Description:</strong> {hospital.description || "No description available"}</p>
      <p><strong>Number of Doctors:</strong> {hospital.numberOfDoctors || "N/A"}</p>
      <p><strong>Number of Departments:</strong> {hospital.numberOfDepartments || "N/A"}</p>

      <h3>Additional Images</h3>
      <div className="hospital-images">
        {hospital.images && hospital.images.length > 0 ? (
          hospital.images.map((img, index) => (
            <img key={index} src={img} alt={`Hospital ${index}`} className="hospital-thumbnail" />
          ))
        ) : (
          <p>No additional images available.</p>
        )}
      </div>

      {/* ✅ Show Buttons ONLY if user is Admin */}
      {user?.role === "admin" && (
        <div className="button-group">
          <Link to={`/edit-hospital/${hospital._id}`} className="edit-btn">✏️ Edit Hospital</Link>
          <Link to={`/hospital/${hospital._id}/details`} className="add-details-btn">➕ Add Hospital Details</Link>
        </div>
      )}
      <Chatbot hospitalId={hospital._id} />
    </div>
  );
};

export default HospitalPage;
