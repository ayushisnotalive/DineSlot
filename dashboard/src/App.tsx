import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/protectedRoutes';
import Restaunrant from './pages/restaurants.mine';
import RestaurantTables from './pages/RestaurantTables';
import OwnerBookings from './pages/OwnerBookings';
import BrowseRestaurants from './pages/BrowseRestaurants';
import BrowseRestaurantTables from './pages/BrowseRestaurantTables';
import BookTable from './pages/BookTables';
import AdminPromote from './pages/AdminPromote';
import AdminPanel from './pages/AdminPanel';
import LandingChoice from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingChoice />} />
        <Route path="/browse" element={<BrowseRestaurants />} />
        <Route path="/browse/:restaurantId" element={<BrowseRestaurantTables />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <Restaunrant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/:restaurantId/tables"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <RestaurantTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:resourceId"
          element={
            <ProtectedRoute>
              <BookTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/promote"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPromote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;