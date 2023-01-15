const { tourSchema,reviewSchema } = require('./schema.js');
const ExpressError = require('./helper/ExpressError');
const Tour = require('./models/tour');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must sign in!');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateTour = (req, res, next) => {
    const { error } = tourSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.isAuthor = async (req,res,next) => {
    const { id } = req.params;
    const tour=  await Tour.findById(id);
    if(!tour.author.equals(req.user._id) && req.user.username!='admin'){
        return res.redirect(`/tours/${id}`);
    }
    next();

}
module.exports.isReviewAuthor = async (req,res,next) => {
    const { id, reviewId } = req.params;
    const review=  await Review.findById(reviewId);
    if(!review.author.equals(req.user._id) && req.user.username!='admin'){
        return res.redirect(`/tours/${id}`);
    }
    next();

}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}