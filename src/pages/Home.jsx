import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick"; // Import Slider for slideshow
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../css/home.css";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext); // Get user authentication status
  const [username, setUsername] = useState("");
  const [hospitalImages, setHospitalImages] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserDetails();
      fetchHospitalImages();
    }
  }, [user]);

  // Fetch logged-in user details from the backend
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/auth/user", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setUsername(response.data.name);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch hospital images
  const fetchHospitalImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/hospitals");
      const images = response.data.map((hospital) => hospital.imageUrl);
      setHospitalImages(images);
    } catch (error) {
      console.error("Error fetching hospital images:", error);
    }
  };

  // Fetch hospitals by city
  const fetchHospitalsByCity = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/hospitals?city=${city}`);
      setHospitals(response.data);
      setSearchedCity(city); // Set the searched city name
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (!user) {
    return (
      <div className="welcome-container">
        <img src="../src/assets/hos.jpg" alt="home" />
        <h1>Welcome to Hospital Management System</h1><br />
        <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h2>Welcome, {username || "User"}!</h2>

      {/* Search Bar */}
      <div className="search-container">
  <input
    type="text"
    placeholder="Search by city..."
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />
  <button onClick={fetchHospitalsByCity}>Search</button>
</div>
      {/* Hospital Image Slideshow */}
      <div className="hospital-slider">
        {hospitalImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {hospitalImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Hospital ${index}`} className="hospital-slide-image" />
              </div>
            ))}
          </Slider>
        ) : (
          <p>No hospitals added yet.</p>
        )}
      </div>

      {/* Hospital List (If city is searched) */}
      {searchedCity && (
        <div className="hospital-list">
          <h3>Hospitals in {searchedCity}</h3>
          {hospitals.length > 0 ? (
            <ul>
              {hospitals.map((hospital) => (
                <li key={hospital._id}>
                  <img src={hospital.imageUrl} alt={hospital.name} className="hospital-image" />
                  <div className="hospital-info">
                    <Link to={`/hospital/${hospital._id}`}>{hospital.name}</Link>
                    <p><strong>Specialities:</strong> {hospital.specialities.join(", ")}</p>
                    <p><strong>Rating:</strong> ⭐ {hospital.rating}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hospitals found in {searchedCity}.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
