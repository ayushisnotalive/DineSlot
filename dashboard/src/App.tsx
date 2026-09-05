import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/protectedRoutes';
import Restaunrant from './pages/restaurants.mine';
import RestaurantTables from './pages/RestaurantTables';
import OwnerBookings from './pages/OwnerBookings';
import BrowseRestaurants from './pages/BrowseRestaurants';
// import { ProtectedRoute } from './components/protectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrowseRestaurants />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
          } />
          <Route path="/restaurants" element={
            <ProtectedRoute>
              <Restaunrant/>
            </ProtectedRoute>
          }/>
          <Route
            path="/restaurants/:restaurantId/tables"
            element={
            <ProtectedRoute>
              <RestaurantTables />
          </ProtectedRoute>
          }/>
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <OwnerBookings />
          </ProtectedRoute>
            }
          />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
