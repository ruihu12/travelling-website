const express = require('express');
const router = express.Router();
const catchAsync = require('../helper/catchAsync');

const {isLoggedIn,isAuthor,validateTour} = require('../middleware');

const Tour = require('../models/tour');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get('/', catchAsync(async (req, res) => {
    
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Tour.find({"title":regex},function(error,alltours){
            if(error){
                console.log(error);
            }else{
                res.render('tours/index',{tours:alltours});
            }
        });
    
    }
    else{
        const tours = await Tour.find({});
        res.render('tours/index', { tours })
    }
    
}));

router.get('/new', isLoggedIn, (req, res) => {
    
    res.render('tours/new');
})


router.post('/', isLoggedIn,validateTour, catchAsync(async (req, res, next) => {

    const tour = new Tour(req.body.tour);
    tour.author = req.user._id;
    await tour.save();
    res.redirect(`/tours/${tour._id}`)
}))

router.get('/:id',isLoggedIn, catchAsync(async (req, res,) => {
    const tour = await Tour.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if (!tour) {
        return res.redirect('/tours');
    }
    res.render('tours/show', { tour });
}));

router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(async (req, res) => {
    
    const { id } = req.params;
    const tour=  await Tour.findById(id);
    if (!tour) {
        return res.redirect('/tours');
    }
    res.render('tours/edit', { tour });
}))

router.put('/:id', isLoggedIn, isAuthor, validateTour, catchAsync(async (req, res) => {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, { ...req.body.tour });
    res.redirect(`/tours/${tour._id}`)
}));

router.delete('/:id', isLoggedIn,isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.redirect('/tours');
}));

module.exports = router;