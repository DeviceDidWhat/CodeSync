import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    if (!isSignedIn) return;

    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setIsAdmin(res.data.controlAdmin);
      } catch (err) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [isSignedIn]);

  // Prevent flicker
  if (!isLoaded || isAdmin === null) {
    return null;
  }

  // Not logged in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Logged in but NOT admin
  if (!isAdmin) {
    toast.error("You are not authorized. Only admins can do that.");
    return <Navigate to="/dashboard" replace />;
  }

  // Admin → allow access
  return children;
}

export default AdminRoute;