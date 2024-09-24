const mongoose=require('mongoose')
const cities=require('./cities')
const {places,descriptors}=require('./seedHelper');
const Campground=require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:'66b8e2d76e50c263dfd6cf0d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
              type: "Point",
              coordinates: [
                  cities[random1000].longitude,
                  cities[random1000].latitude,
              ]
          },
            images: [
              {
                url: 'https://res.cloudinary.com/du66m0o84/image/upload/v1727203488/YelpCamp/e8pwqsy8hbwlswqbspim.jpg',
                filename: 'YelpCamp/e8pwqsy8hbwlswqbspim',
              },
              {
                url: 'https://res.cloudinary.com/du66m0o84/image/upload/v1727203489/YelpCamp/oivzxzr8mvud1hkajuar.jpg',
                filename: 'YelpCamp/oivzxzr8mvud1hkajuar',
              },
              {
                url: 'https://res.cloudinary.com/du66m0o84/image/upload/v1727203492/YelpCamp/t7wqezpvxvyecp9rfybq.jpg',
                filename: 'YelpCamp/t7wqezpvxvyecp9rfybq'
              }
              ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})