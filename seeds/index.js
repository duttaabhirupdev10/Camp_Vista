const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, imageUrls } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const imageUrls = [
    ...images.mountain,
    ...images.forest,
    ...images.fort,
    ...images.desert,
    ...images.river
];

const seedDB = async () => {

    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {

        const randomCity = cities[Math.floor(Math.random() * cities.length)];

        const campground = new Campground({

            title: `${sample(descriptors)} ${sample(places)}`,

            location: `${randomCity.city}, ${randomCity.state}`,

            image: imageUrls[i % imageUrls.length],

            description: 'A beautiful place to enjoy the outdoors.',

            price: Math.floor(Math.random() * 20) + 10
        });

        await campground.save();
    }
};

seedDB()
    .then(() => mongoose.connection.close())
    .catch(error => {
        console.error(error);
        mongoose.connection.close();
    });