import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import TripCard from "../../components/TripCard";
import Loader from "../../components/Loader";

import api from "../../api/axios";

import "./index.css";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const getTrips = async () => {
    try {
      const response = await api.get("/api/trips");
      setTrips(response.data.trips);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTrips();
  }, []);

  // open modal
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // delete after confirm
  const onDeleteTrip = async () => {
    try {
      await api.delete(`/api/trips/${selectedId}`);
      setShowModal(false);
      setSelectedId(null);
      getTrips();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <Link to="/create-trip" className="create-trip-link">
          Create Trip
        </Link>

        <h1 className="my-trips-heading">My Trips</h1>

        {trips.length === 0 ? (
          <p className="no-trips-text">No trips found.</p>
        ) : (
          <ul className="trip-list">
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDeleteTrip={confirmDelete}
              />
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Delete Trip?</h2>
            <p>This action cannot be undone.</p>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="delete-btn" onClick={onDeleteTrip}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
