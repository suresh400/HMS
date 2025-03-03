import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/home.css";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [hospitalImages, setHospitalImages] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.name);
      fetchAllHospitals();
    }
  }, [user]);

  const fetchAllHospitals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirecting to login.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/v1/hospitals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.length > 0) {
        setHospitals(response.data);
        setHospitalImages(response.data.map((hospital) => hospital.imageUrl).filter(Boolean));
      } else {
        setError("No hospitals found.");
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError("Failed to load hospitals. Please try again.");
    }
  };

  const fetchHospitalsByCity = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in again.");
        setError("Authentication error. Please log in again.");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/v1/hospitals?city=${city}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.length > 0) {
        setHospitals(response.data);
        setSearchedCity(city);
        setError("");
      } else {
        setError(`No hospitals found in ${city}.`);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError("Failed to fetch hospitals for the given city.");
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    if (!e.target.value) {
      setSearchedCity("");
      fetchAllHospitals();
    }
  };

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
        <img src="../src/assets/home.jpg" alt="Hospital Background" className="welcome-image" />
        <div className="welcome-overlay">
          <h1>Welcome to Hospital HMS</h1>
          <p>Let's find the best hospitals in your nearest city.</p>
          <p>
            Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Welcome Username */}
      <h2 className="welcome-message">Welcome, {username}!</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input type="text" placeholder="Search by city..." value={city} onChange={handleCityChange} />
        <button onClick={fetchHospitalsByCity}>🔍</button>
      </div>
      {error && <p className="error-message">{error}</p>}

      {/* Hospital Image Slideshow */}
      {hospitalImages.length > 0 ? (
        <div className="hospital-slider">
          <Slider {...sliderSettings}>
            {hospitalImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Hospital ${index}`} className="hospital-slide-image" />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p>No hospital images available.</p>
      )}

      {/* About Us Section */}
      <div className="about-us">
        <h2>About Us</h2>
        <p>
          Welcome to the **Hospital Management System (HMS)** – a modern solution designed to streamline and enhance healthcare services. 
          Our system ensures efficient hospital administration, improving patient care, appointment scheduling, and hospital resource management.
        </p>

        <h3>Our Mission</h3>
        <ul>
          <li>✅ Efficient Hospital Management</li>
          <li>✅ Easy Appointment Booking</li>
          <li>✅ Enhanced Accessibility</li>
          <li>✅ Secure Data Handling</li>
        </ul>

        <h3>Why Choose HMS?</h3>
        <ul>
          <li>🔹 User-Friendly Interface</li>
          <li>🔹 Role-Based Access</li>
          <li>🔹 Improved Efficiency</li>
          <li>🔹 Scalable & Reliable</li>
        </ul>

        <p>🏥 Let's build a healthier future together! 🚀</p>
      </div>

      {/* Hospital List (Only After Search) */}
      {searchedCity && (
        <div className="hospital-list">
          <h3>Hospitals in {searchedCity}</h3>
          {hospitals.length > 0 ? (
            <ul className="hospital-cards">
              {hospitals.map((hospital) => (
                <li key={hospital._id} className="hospital-card">
                  <img src={hospital.imageUrl} alt={hospital.name} className="hospital-image" />
                  <div className="hospital-info">
                    <Link to={`/hospital/${hospital._id}`}>{hospital.name}</Link>
                    <p>
                      <strong>Specialities:</strong> {hospital.specialities.join(", ")}
                    </p>
                    <p>
                      <strong>Rating:</strong> ⭐ {hospital.rating}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hospitals found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
