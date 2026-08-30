const express=require("express");
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app=express();

const sample = array => array[Math.floor(Math.random() * array.length)];

app.get("/",(req,res)=>{
    res.send("Welcome to Yelp Camp!")
})

app.get("/campgrounds",async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("campgrounds/index",{campgrounds})
})



app.listen(3000,()=>{
    console.log("the app is runnig on 3000")
})

