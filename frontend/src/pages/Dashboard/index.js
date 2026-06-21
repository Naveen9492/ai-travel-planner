import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import TripCard from "../../components/TripCard";

import api from "../../api/axios";

import "./index.css";

const Dashboard = () => {
  const [trips, setTrips] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const getTrips = async () => {
    try {
      const response =
        await api.get(
          "/api/trips"
        );

      setTrips(
        response.data.trips
      );
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    getTrips();
  }, []);

  const onDeleteTrip =
    async id => {
      const confirmDelete =
        window.confirm(
          "Delete Trip?"
        );

      if (!confirmDelete) {
        return;
      }

      try {
        await api.delete(
          `/api/trips/${id}`
        );

        getTrips();
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) {
    return (
      <h1>Loading...</h1>
    );
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <Link to="/create-trip">
  <button>
    Create Trip
  </button>
</Link>
        <h1>My Trips</h1>
        

        {trips.length === 0 ? (
          <p>
            No trips found.
          </p>
        ) : (
          <ul className="trip-list">
            {trips.map(trip => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDeleteTrip={
                  onDeleteTrip
                }
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Dashboard;