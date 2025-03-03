import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../css/editHospital.css';
import axios from "axios";

const EditHospitalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState({
    name: "",
    city: "",
    imageUrl: "",
    specialities: [],
    rating: "",
    description: "",
    numberOfDoctors: "",
    numberOfDepartments: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSpeciality, setNewSpeciality] = useState("");

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/v1/hospitals/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ Added token
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

  const handleChange = (e) => {
    setHospital((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Handle adding specialities (Avoid Duplicates)
  const handleAddSpeciality = () => {
    const formattedSpeciality = newSpeciality.trim().toLowerCase();
    if (formattedSpeciality && !hospital.specialities.includes(formattedSpeciality)) {
      setHospital((prevState) => ({
        ...prevState,
        specialities: [...prevState.specialities, formattedSpeciality],
      }));
      setNewSpeciality("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/v1/hospitals/update?id=${id}`,
        hospital,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ Token added
        }
      );
      alert("Hospital updated successfully!");
      navigate(-1); // ✅ Go back dynamically
    } catch (error) {
      console.error("Error updating hospital:", error);
      alert("Failed to update hospital.");
    }
  };

  if (loading) return <p>Loading hospital details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="edit-hospital">
      <h2>Edit Hospital Details</h2>
      <form onSubmit={handleSubmit}>
        <label>Hospital Name:</label>
        <input type="text" name="name" value={hospital.name} onChange={handleChange} required />

        <label>City:</label>
        <input type="text" name="city" value={hospital.city} onChange={handleChange} required />

        <label>Main Image URL:</label>
        <input type="text" name="imageUrl" value={hospital.imageUrl} onChange={handleChange} />

        <label>Specialities:</label>
        <div className="specialities-input">
          <input
            type="text"
            value={newSpeciality}
            onChange={(e) => setNewSpeciality(e.target.value)}
            placeholder="Enter a speciality"
          />
          <button type="button" onClick={handleAddSpeciality}>Add</button>
        </div>
        <div className="specialities-list">
          {hospital.specialities.map((spec, index) => (
            <span key={index} className="speciality">{spec}</span>
          ))}
        </div>

        <label>Rating (1-5):</label>
        <input type="number" name="rating" value={hospital.rating} onChange={handleChange} min="1" max="5" required />

        <label>Description:</label>
        <textarea name="description" value={hospital.description} onChange={handleChange}></textarea>

        <label>Number of Doctors:</label>
        <input type="number" name="numberOfDoctors" value={hospital.numberOfDoctors} onChange={handleChange} />

        <label>Number of Departments:</label>
        <input type="number" name="numberOfDepartments" value={hospital.numberOfDepartments} onChange={handleChange} />

        <button type="submit">Update Hospital</button>
      </form>
    </div>
  );
};

export default EditHospitalPage;
