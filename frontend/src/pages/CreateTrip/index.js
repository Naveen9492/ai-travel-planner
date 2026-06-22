import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../api/axios";

import "./index.css";

const interestsList = [
  "Food",
  "Culture",
  "Adventure",
  "Shopping",
  "Nature",
  "Photography",
  "Nightlife",
];

const CreateTrip = () => {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");

  const [days, setDays] = useState("");

  const [budgetType, setBudgetType] = useState("Medium");

  const [interests, setInterests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeInterest = (value) => {
    if (interests.includes(value)) {
      setInterests(interests.filter((item) => item !== value));
    } else {
      setInterests([...interests, value]);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!destination || !days || interests.length === 0) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/trips/generate", {
        destination,
        days: Number(days),
        budgetType,
        interests,
      });

      navigate(`/trip/${response.data.trip._id}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Trip generation failed");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="create-trip-container">
        <form className="trip-form" onSubmit={onSubmitForm}>
          <h1 className="create-trip-heading">Create New Trip</h1>
          <label className="create-trip-label" htmlFor="destination">
            Destination
          </label>
          <input
            type="text"
            className="create-input-filed"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
          />
          <label htmlFor="days" className="create-trip-label">
            Number of Days
          </label>
          <input
            type="number"
            className="create-input-filed"
            id="days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />

          <label htmlFor="budget" className="create-trip-label">
            Budget Type
          </label>

          <select
            id="budget"
            className="create-input-filed"
            value={budgetType}
            onChange={(e) => setBudgetType(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <label className="create-trip-label">Interests</label>

          <div className="interest-grid">
            {interestsList.map((interest) => (
              <label key={interest}>
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => onChangeInterest(interest)}
                />
                {interest}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="generate-trip-button"
          >
            {loading ? "Generating..." : "Generate Trip"}
          </button>
          {message && <p className="error-message">{message}</p>}
        </form>
      </div>
    </>
  );
};

export default CreateTrip;
