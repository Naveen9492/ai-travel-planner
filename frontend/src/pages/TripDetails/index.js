import {
  useEffect,
  useState,useCallback,
} from "react";

import {
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar";

import api from "../../api/axios";

import "./index.css";

const TripDetails = () => {
  const {id} = useParams();

  const [trip, setTrip] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const getTrip = useCallback(async () => {
  try {
    const response = await api.get(
      `/api/trips/${id}`
    );

    setTrip(response.data.trip);
  } catch (error) {
    console.log(error);
  }

  setLoading(false);
}, [id]);

 useEffect(() => {
  getTrip();
}, [getTrip]);

  const addActivity =
    async day => {
      const activity =
        prompt(
          "Enter Activity"
        );

      if (!activity) {
        return;
      }

      await api.put(
        `/api/trips/${id}/add-activity`,
        {
          day,
          activity,
        }
      );

      getTrip();
    };

  const removeActivity =
    async (
      day,
      activity
    ) => {
      await api.put(
        `/api/trips/${id}/remove-activity`,
        {
          day,
          activity,
        }
      );

      getTrip();
    };

  const regenerateDay =
    async day => {
      const instruction =
        prompt(
          "Regeneration Instruction"
        );

      if (!instruction) {
        return;
      }

      await api.put(
        `/api/trips/${id}/regenerate-day`,
        {
          day,
          instruction,
        }
      );

      getTrip();
    };

  if (loading) {
    return (
      <h1>Loading...</h1>
    );
  }

  if (!trip) {
    return (
      <h1>
        Trip Not Found
      </h1>
    );
  }

  return (
    <>
      <Navbar />

      <div className="trip-details">

        <h1>
          {
            trip.destination
          }
        </h1>

        <div className="budget-card">
          <h2>
            Budget Estimate
          </h2>

          <p>
            Flights :
            ₹
            {
              trip
                .budgetEstimate
                ?.flights
            }
          </p>

          <p>
            Accommodation :
            ₹
            {
              trip
                .budgetEstimate
                ?.accommodation
            }
          </p>

          <p>
            Food :
            ₹
            {
              trip
                .budgetEstimate
                ?.food
            }
          </p>

          <p>
            Activities :
            ₹
            {
              trip
                .budgetEstimate
                ?.activities
            }
          </p>

          <h3>
            Total :
            ₹
            {
              trip
                .budgetEstimate
                ?.total
            }
          </h3>
        </div>

        <div className="hotel-card">
          <h2>
            Hotels
          </h2>

          <ul>
            {trip.hotels.map(
              (
                hotel,
                index
              ) => (
                <li
                  key={index}
                >
                  {hotel}
                </li>
              )
            )}
          </ul>
        </div>

        <h2>
          Itinerary
        </h2>

        {trip.itinerary.map(
          dayPlan => (
            <div
              key={
                dayPlan.day
              }
              className="day-card"
            >
              <div className="day-header">
                <h3>
                  Day{" "}
                  {
                    dayPlan.day
                  }
                </h3>

                <button
                  onClick={() =>
                    regenerateDay(
                      dayPlan.day
                    )
                  }
                >
                  Regenerate
                </button>
              </div>

              <ul>
                {dayPlan.activities.map(
                  (
                    activity,
                    index
                  ) => (
                    <li
                      key={
                        index
                      }
                    >
                      {activity}

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeActivity(
                            dayPlan.day,
                            activity
                          )
                        }
                      >
                        Remove
                      </button>
                    </li>
                  )
                )}
              </ul>

              <button
                onClick={() =>
                  addActivity(
                    dayPlan.day
                  )
                }
              >
                Add Activity
              </button>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default TripDetails;