// controllers/dashboardController.js
export const getDashboardData = (req, res) => {
  res.json({
    message: 'Welcome to the protected dashboard!',
    user: req.user, // contains decoded token data
  });
};
