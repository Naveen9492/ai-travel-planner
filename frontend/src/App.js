import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard"

import ProtectedRoute from "./components/ProtectedRoute";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
              <Login />
          }
        />

        <Route
          path="/register"
          element={
              <Register />
          }
        />

         <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-trip"
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          }
        />

         <Route
          path="/trip/:id"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/not-found"
          element={
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>}
        />
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/not-found"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;