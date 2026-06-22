import { useNavigate } from "react-router-dom";

import "./index.css";

const TripCard = (props) => {
  const { trip, onDeleteTrip } = props;

  const navigate = useNavigate();

  const { _id, destination, days, budgetType } = trip;

  const onViewTrip = () => {
    navigate(`/trip/${_id}`);
  };

  return (
    <li className="trip-card">
      <h2 className="distination-text">{destination}</h2>
      <p className="days-text">{days} Days</p>
      <p className="budget-type-text">Budget: {budgetType}</p>
      <div className="trip-btn-container">
        <button onClick={onViewTrip} className="view-trip-button">
          View
        </button>
        <button
          onClick={() => onDeleteTrip(_id)}
          className="delete-trip-button"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TripCard;
