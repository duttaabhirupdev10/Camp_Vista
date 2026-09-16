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

const sample = array => array[Math.floor(Math.random() * array.length)];
const imageUrls = [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532664189809-02133bacb59c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
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

