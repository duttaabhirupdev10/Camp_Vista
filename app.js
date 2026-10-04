require('dotenv').config();
const logger = require("./utils/logger");
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");

const session = require("express-session");
const campgroundRoutes = require("./routes/campgroundRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

// Setup HTTP request logging
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));


// ===============================
// EJS CONFIGURATION
// ===============================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));


const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

// Initialize Clerk (will bypass if you haven't added keys to .env yet)
if (process.env.CLERK_SECRET_KEY) {
    app.use(ClerkExpressWithAuth());
}

app.use(async (req, res, next) => {
    // 1. Authenticate with Clerk
    if (req.auth && req.auth.userId) {
        const userModel = require('./models/userModel');
        let { data: user } = await userModel.findRoleById(req.auth.userId);
        
        // If user doesn't exist in our DB yet, create them automatically
        if (!user) {
            const { data: newUser, error: createError } = await userModel.create({
                id: req.auth.userId,
                email: 'clerk-user-' + req.auth.userId + '@example.com',
                role: 'customer'
            });
            if (createError) {
                logger.error("Failed to sync Clerk user to local DB:", createError);
            }
            user = newUser;
        }

        res.locals.currentUser = { id: req.auth.userId, role: user?.role || 'customer' };
    } else {
        res.locals.currentUser = null;
    }

    res.locals.clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;
    res.locals.pendingBookingsCount = 0;

    if (res.locals.currentUser && (res.locals.currentUser.role === 'owner' || res.locals.currentUser.role === 'admin')) {
        try {
            const bookingModel = require('./models/bookingModel');
            const { data } = await bookingModel.findBookingsByOwnerId(res.locals.currentUser.id);
            if (data) {
                res.locals.pendingBookingsCount = data.filter(b => b.status === 'pending').length;
            }
        } catch (err) {
            logger.error(`Error fetching pending counts: ${err}`);
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
    logger.info("Server is running on port 3000");
});