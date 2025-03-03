import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EditHospital = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ Get user role
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Only Admins Can Edit
  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("Access Denied. Admins only.");
      navigate("/");
      return;
    }

    const fetchHospital = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/hospitals/${id}`);
        setHospital(res.data);
      } catch (err) {
        setError("Failed to load hospital.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id, user, navigate]);

  // ✅ Handle Updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/v1/hospitals/update?id=${id}`, hospital, {
        headers: { Authorization: localStorage.getItem("token") }, // ✅ Send token
      });
      alert("Updated successfully!");
      navigate("/hospital-list");
    } catch (err) {
      setError("Update failed.");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="edit-hospital-container">
      <h2>Edit Hospital</h2>
      <form onSubmit={handleSubmit} className="edit-hospital-form">
        <label>Hospital Name:</label>
        <input
          type="text"
          value={hospital.name}
          onChange={(e) => setHospital({ ...hospital, name: e.target.value })}
          required
        />

        <label>Rating:</label>
        <input
          type="number"
          value={hospital.rating}
          onChange={(e) => setHospital({ ...hospital, rating: e.target.value })}
          min="1" max="5"
          required
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditHospital;
