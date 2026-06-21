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

  const [destination, setDestination] =
    useState("");

  const [days, setDays] =
    useState("");

  const [budgetType, setBudgetType] =
    useState("Medium");

  const [interests, setInterests] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const onChangeInterest = value => {
    if (interests.includes(value)) {
      setInterests(
        interests.filter(
          item => item !== value
        )
      );
    } else {
      setInterests([
        ...interests,
        value,
      ]);
    }
  };

  const onSubmitForm = async e => {
    e.preventDefault();

    if (
      !destination ||
      !days ||
      interests.length === 0
    ) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/api/trips/generate",
          {
            destination,
            days: Number(days),
            budgetType,
            interests,
          }
        );

      navigate(
        `/trip/${response.data.trip._id}`
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Trip generation failed"
      );
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="create-trip-container">
        <form
          className="trip-form"
          onSubmit={onSubmitForm}
        >
          <h1>Create New Trip</h1>

          <label>
            Destination
          </label>

          <input
            type="text"
            value={destination}
            onChange={e =>
              setDestination(
                e.target.value
              )
            }
            placeholder="Enter destination"
          />

          <label>
            Number of Days
          </label>

          <input
            type="number"
            value={days}
            onChange={e =>
              setDays(
                e.target.value
              )
            }
          />

          <label>
            Budget Type
          </label>

          <select
            value={budgetType}
            onChange={e =>
              setBudgetType(
                e.target.value
              )
            }
          >
            <option>
              Low
            </option>
            <option>
              Medium
            </option>
            <option>
              High
            </option>
          </select>

          <label>
            Interests
          </label>

          <div className="interest-grid">
            {interestsList.map(
              interest => (
                <label
                  key={interest}
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(
                      interest
                    )}
                    onChange={() =>
                      onChangeInterest(
                        interest
                      )
                    }
                  />

                  {interest}
                </label>
              )
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : "Generate Trip"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateTrip;