export const requireControlAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user.controlAdmin) {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Error in requireControlAdmin middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};