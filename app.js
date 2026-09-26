require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const session = require("express-session");
const campgroundRoutes = require("./routes/campgroundRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));


// ===============================
// EJS CONFIGURATION
// ===============================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));


app.use(session({
    secret: process.env.SESSION_SECRET || "campvista-secret",
    resave: false,
    saveUninitialized: false
}));

app.use(async (req, res, next) => {
    res.locals.currentUser = req.session ? req.session.user : null;
    res.locals.pendingBookingsCount = 0;

    if (req.session && req.session.user && (req.session.user.role === 'owner' || req.session.user.role === 'admin')) {
        try {
            const bookingModel = require('./models/bookingModel');
            const { data } = await bookingModel.findBookingsByOwnerId(req.session.user.id);
            if (data) {
                res.locals.pendingBookingsCount = data.filter(b => b.status === 'pending').length;
            }
        } catch (err) {
            console.error('Error fetching pending counts', err);
        }
    }
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/", authRoutes);
app.use("/", bookingRoutes);
app.use("/", ownerRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});