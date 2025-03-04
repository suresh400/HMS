import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/addHospitalDetails.css";
import { API_BASE_URL } from "../config";
const AddHospitalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    description: "",
    images: [],
    numberOfDoctors: "",
    numberOfDepartments: "",
  });

  useEffect(() => {
    fetchHospitalDetails();
  }, []);

  // ✅ Fetch hospital details
  const fetchHospitalDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/hospitals/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ Token added
        }
      );
      setDetails({
        description: response.data.description || "",
        images: response.data.images || [],
        numberOfDoctors: response.data.numberOfDoctors || "",
        numberOfDepartments: response.data.numberOfDepartments || "",
      });
    } catch (error) {
      console.error("Error fetching hospital details:", error);
      alert("Failed to fetch hospital details.");
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setDetails((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Handle multiple image URLs
  const handleImageChange = (e) => {
    const imagesArray = e.target.value.split(",").map((img) => img.trim()).filter(Boolean);
    setDetails((prevState) => ({
      ...prevState,
      images: imagesArray,
    }));
  };

  // ✅ Submit updated hospital details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/hospitals/details?id=${id}`,
        details,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ Token added
        }
      );
      alert("Hospital details updated successfully!");
      navigate(-1); // ✅ Go back to the previous page dynamically
    } catch (error) {
      console.error("Error updating hospital details:", error);
      alert("Failed to update hospital details.");
    }
  };

  return (
    <div className="add-hospital-details">
      <h2>Add Hospital Details</h2>
      <form onSubmit={handleSubmit}>
        <label>Description:</label>
        <textarea
          name="description"
          value={details.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Image URLs (comma-separated):</label>
        <input
          type="text"
          name="images"
          value={details.images.join(", ")}
          onChange={handleImageChange}
        />

        <label>Number of Doctors:</label>
        <input
          type="number"
          name="numberOfDoctors"
          value={details.numberOfDoctors}
          onChange={handleChange}
        />

        <label>Number of Departments:</label>
        <input
          type="number"
          name="numberOfDepartments"
          value={details.numberOfDepartments}
          onChange={handleChange}
        />

        <button type="submit">Update Details</button>
      </form>
    </div>
  );
};

export default AddHospitalDetails;
