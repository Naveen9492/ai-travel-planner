import { useNavigate } from "react-router-dom";

import "./index.css";

const TripCard = props => {
  const { trip, onDeleteTrip } = props;

  const navigate = useNavigate();

  const {
    _id,
    destination,
    days,
    budgetType,
  } = trip;

  const onViewTrip = () => {
    navigate(`/trip/${_id}`);
  };

  return (
    <li className="trip-card">
      <h2>{destination}</h2>

      <p>{days} Days</p>

      <p>{budgetType}</p>

      <div className="trip-btn-container">
        <button
          onClick={onViewTrip}
        >
          View
        </button>

        <button
          onClick={() =>
            onDeleteTrip(_id)
          }
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TripCard;