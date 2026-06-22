import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import Loader from "../../components/Loader";

import "./index.css";

const TripDetails = () => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW: action loading state
  const [actionLoading, setActionLoading] = useState({
    type: "",
    day: null,
  });

  const [modal, setModal] = useState({
    open: false,
    type: "",
    day: null,
    activity: "",
  });

  const getTrip = useCallback(async () => {
    try {
      const response = await api.get(`/api/trips/${id}`);
      setTrip(response.data.trip);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getTrip();
  }, [getTrip]);

  const openModal = (type, day, activity = "") => {
    setModal({ open: true, type, day, activity });
  };

  const closeModal = () => {
    setModal({ open: false, type: "", day: null, activity: "" });
  };

  const handleSubmit = async () => {
    try {
      setActionLoading({ type: modal.type, day: modal.day });

      if (modal.type === "add") {
        await api.put(`/api/trips/${id}/add-activity`, {
          day: modal.day,
          activity: modal.activity,
        });
      }

      if (modal.type === "regenerate") {
        await api.put(`/api/trips/${id}/regenerate-day`, {
          day: modal.day,
          instruction: modal.activity,
        });
      }

      if (modal.type === "remove") {
        await api.put(`/api/trips/${id}/remove-activity`, {
          day: modal.day,
          activity: modal.activity,
        });
      }

      closeModal();
      await getTrip();
    } catch (error) {
      console.log(error);
    }

    setActionLoading({ type: "", day: null });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  }

  if (!trip) {
    return <h1 className="trip-not-found-text">Trip Not Found</h1>;
  }

  const isLoading = (type, day) =>
    actionLoading.type === type && actionLoading.day === day;

  return (
    <>
      <Navbar />

      <div className="trip-details">
        <h1 className="trip-destination-heading">{trip.destination}</h1>

        {/* BUDGET */}
        <div className="budget-card">
          <h2 className="card-title">Budget Estimate</h2>

          <div className="budget-grid">
            <div>
              Flights <span>₹{trip.budgetEstimate?.flights}</span>
            </div>
            <div>
              Stay <span>₹{trip.budgetEstimate?.accommodation}</span>
            </div>
            <div>
              Food <span>₹{trip.budgetEstimate?.food}</span>
            </div>
            <div>
              Activities <span>₹{trip.budgetEstimate?.activities}</span>
            </div>
          </div>

          <h3 className="total">Total ₹{trip.budgetEstimate?.total}</h3>
        </div>

        {/* HOTELS */}
        <div className="hotel-card">
          <h2 className="card-title">Hotels</h2>
          <div className="hotel-list">
            {trip.hotels.map((hotel, i) => (
              <div key={i} className="hotel-item">
                {hotel}
              </div>
            ))}
          </div>
        </div>

        {/* ITINERARY */}
        <h2 className="section-title">Itinerary</h2>

        {trip.itinerary.map((dayPlan) => (
          <div key={dayPlan.day} className="day-card">
            <div className="day-header">
              <h3>Day {dayPlan.day}</h3>

              <button
                className="btn-secondary"
                disabled={isLoading("regenerate", dayPlan.day)}
                onClick={() => openModal("regenerate", dayPlan.day)}
              >
                {isLoading("regenerate", dayPlan.day)
                  ? "Generating..."
                  : "Regenerate"}
              </button>
            </div>

            <div className="activity-list">
              {dayPlan.activities.map((activity, i) => (
                <div key={i} className="activity-item">
                  {activity}

                  <button
                    className="btn-danger"
                    disabled={isLoading("remove", dayPlan.day)}
                    onClick={() => openModal("remove", dayPlan.day, activity)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              disabled={isLoading("add", dayPlan.day)}
              onClick={() => openModal("add", dayPlan.day)}
            >
              {isLoading("add", dayPlan.day) ? "Adding..." : "Add Activity"}
            </button>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {modal.open && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>
              {modal.type === "add" && "Add Activity"}
              {modal.type === "regenerate" && "Regenerate Day"}
              {modal.type === "remove" && "Confirm Remove"}
            </h2>

            {(modal.type === "add" || modal.type === "regenerate") && (
              <input
                className="modal-input"
                value={modal.activity}
                placeholder={
                  modal.type === "add" ? "Enter activity" : "Enter instruction"
                }
                onChange={(e) =>
                  setModal({ ...modal, activity: e.target.value })
                }
              />
            )}

            {modal.type === "remove" && (
              <p className="modal-text">
                Are you sure you want to remove <b>{modal.activity}</b>?
              </p>
            )}

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>

              <button className="btn-confirm" onClick={handleSubmit}>
                {actionLoading.day === modal.day ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripDetails;
