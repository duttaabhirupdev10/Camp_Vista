require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Campground = require("./models/campground");
const supabase = require("./utils/supabase");
const session = require("express-session");
const isLoggedIn = require("./middleware/auth");


// ===============================
// SUPABASE CHECK
// ===============================

console.log("Supabase client created:", !!supabase);
console.log("URL:", process.env.SUPABASE_URL);
console.log(
    "KEY exists:",
    !!process.env.SUPABASE_PUBLISHABLE_KEY
);


// ===============================
// MIDDLEWARE
// ===============================

app.use(methodOverride("_method"));

app.use(express.urlencoded({
    extended: true
}));


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on(
    "error",
    console.error.bind(console, "connection error:")
);

db.once("open", () => {
    console.log("Database connected");
});


// ===============================
// EJS CONFIGURATION
// ===============================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


app.use(session({
    secret: "campvista-secret",
    resave: false,
    saveUninitialized: false
}));

// ===============================
// HOME
// ===============================

app.get("/", isLoggedIn,(req, res) => {
    res.render("home");
});


// ===============================
// CAMPGROUNDS
// ===============================

// Show all campgrounds
app.get("/campgrounds",isLoggedIn, async (req, res) => {

    const campgrounds = (
        await Campground.find({})
    ).filter(campground =>
        campground.title &&
        campground.title.trim() !== ""
    );

    res.render(
        "campgrounds/index",
        { campgrounds }
    );
});


// Show new campground form
app.get("/campgrounds/new",isLoggedIn, (req, res) => {

    res.render("campgrounds/new");

});


// Create campground
app.post("/campgrounds",isLoggedIn, async (req, res) => {

    const campground =
        new Campground(req.body.campground);

    await campground.save();

    res.redirect(
        `/campgrounds/${campground._id}`
    );

});


// Show particular campground
app.get("/campgrounds/:id",isLoggedIn, async (req, res) => {

    const campground =
        await Campground.findById(req.params.id);

    res.render(
        "campgrounds/show",
        { campground }
    );

});


// Edit campground form
app.get("/campgrounds/:id/edit",isLoggedIn, async (req, res) => {

    const campground =
        await Campground.findById(req.params.id);

    res.render(
        "campgrounds/edit",
        { campground }
    );

});


// Update campground
app.put("/campgrounds/:id",isLoggedIn, async (req, res) => {

    const { id } = req.params;

    const campground =
        await Campground.findByIdAndUpdate(
            id,
            {
                ...req.body.campground
            }
        );

    res.redirect(
        `/campgrounds/${campground._id}`
    );

});


// Delete campground
app.delete("/campgrounds/:id",isLoggedIn, async (req, res) => {

    const { id } = req.params;

    await Campground.findByIdAndDelete(id);

    res.redirect("/campgrounds");

});


// ===============================
// REGISTER
// ===============================

// Show register page
app.get("/register", (req, res) => {

    res.render("users/register");

});


// Handle registration
app.post("/register", async (req, res) => {

    const { email, password } = req.body;

    const { data, error } =
        await supabase.auth.signUp({
            email,
            password
        });

    if (error) {

        console.log(error);

        return res.send(
            error.message
        );

    }

    console.log(data);

    res.send(
        "Registration successful! Check your email."
    );

});


// ===============================
// LOGIN
// ===============================

// Show login page
app.get("/login", (req, res) => {

    res.render("users/login");

});


// Handle login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        console.log(error);
        return res.send(error.message);
    }

    // Store the logged-in user in Express session
    req.session.user = data.user;

    console.log("Logged in user:", data.user.email);

    res.redirect("/campgrounds");
});

//============================
//logout
//============================
app.post("/logout", async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log(error);
        return res.send(error.message);
    }

    res.redirect("/");
});


// ===============================
// START SERVER
// ===============================

app.listen(3000, () => {

    console.log(
        "Server is running on port 3000"
    );

});