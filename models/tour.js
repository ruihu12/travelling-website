const mongoose= require('mongoose');
const Review= require('./review')

const Schema= mongoose.Schema;

const TourSchema= new Schema({
    title:String,
    image:String,
    description:String,
    location:String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});
TourSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports= mongoose.model(('Tour'),TourSchema);