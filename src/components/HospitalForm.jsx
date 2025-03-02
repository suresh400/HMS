import { useState } from "react";
import axios from "axios";

const HospitalForm = () => {
  const [hospital, setHospital] = useState({
    name: "",
    city: "",
    imageUrl: "",
    specialities: [],
    rating: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/v1/hospitals/create", hospital);
      alert("Hospital added successfully!");
    } catch (error) {
      console.error("Error adding hospital:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" onChange={(e) => setHospital({ ...hospital, name: e.target.value })} required />
      <input type="text" placeholder="City" onChange={(e) => setHospital({ ...hospital, city: e.target.value })} required />
      <input type="text" placeholder="Image URL" onChange={(e) => setHospital({ ...hospital, imageUrl: e.target.value })} required />
      <input type="number" placeholder="Rating" onChange={(e) => setHospital({ ...hospital, rating: e.target.value })} required />
      <button type="submit">Add Hospital</button>
    </form>
  );
};

export default HospitalForm;
