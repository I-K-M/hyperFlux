exports.dashboardController = (req, res) => {
    return res.status(200).json({ message: "Dashboard accessible", userId: req.user });
}