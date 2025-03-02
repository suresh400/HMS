import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditHospital = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/hospitals/${id}`).then((res) => setHospital(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/v1/hospitals/update?id=${id}`, hospital);
    alert("Updated successfully!");
    navigate("/");
  };

  if (!hospital) return <h2>Loading...</h2>;

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={hospital.name} onChange={(e) => setHospital({ ...hospital, name: e.target.value })} />
      <input type="number" value={hospital.rating} onChange={(e) => setHospital({ ...hospital, rating: e.target.value })} />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditHospital;
