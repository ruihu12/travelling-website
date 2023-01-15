const mongoose= require('mongoose');
const Tour=require('../models/tour');
const {places,descriptors}= require('./seedHelpers');
const cities= require('./cities');
mongoose.connect('mongodb://localhost:27017/tour-fifty');

const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});


const seedDB= async()=>{
    await Tour.deleteMany({});
    for( let i=0; i<27; i++){ 
        const tour= new Tour({
            author:'63725875f3ae25db81c6bb37',
            location:`${cities[i].city},${cities[i].state}`,
            title:`${cities[i].city} `,
            image:`/imgs/${cities[i].city}.jpg`,
            description:'Beautiful place'  
        })
        await tour.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})