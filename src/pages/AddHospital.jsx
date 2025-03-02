import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/addHospital.css';
import axios from "axios";

const AddHospital = () => {
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
  const [speciality, setSpeciality] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value });
  };

  // Add a speciality to the list
  const handleAddSpeciality = () => {
    if (speciality.trim() && !hospital.specialities.includes(speciality)) {
      setHospital({ ...hospital, specialities: [...hospital.specialities, speciality] });
      setSpeciality(""); // Reset input
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!hospital.name || !hospital.city || !hospital.imageUrl || !hospital.rating) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/v1/hospitals/create", hospital);
      alert("Hospital added successfully!");
      navigate("/"); // Redirect to home page after success
    } catch (error) {
      console.error("Error adding hospital:", error);
      alert("Failed to add hospital.");
    }
  };

  return (
    <div className="add-hospital">
      <h2>Add a New Hospital</h2>
      <form onSubmit={handleSubmit}>
        <label>Hospital Name:</label>
        <input type="text" name="name" value={hospital.name} onChange={handleChange} required />

        <label>City:</label>
        <input type="text" name="city" value={hospital.city} onChange={handleChange} required />

        <label>Image URL:</label>
        <input type="text" name="imageUrl" value={hospital.imageUrl} onChange={handleChange} required />

        <label>Specialities:</label>
        <div className="specialities-input">
          <input type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} placeholder="Enter a speciality" />
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

        <button type="submit">Add Hospital</button>
      </form>
    </div>
  );
};

export default AddHospital;
