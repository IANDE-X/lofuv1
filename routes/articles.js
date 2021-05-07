const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
const multer = require('multer')


// define storage for the images
const storage = multer.diskStorage({
    // destination for uploaded files
    destination:function (req, file, callback){
        callback(null, './public/img/uploads')
    },
    // adding the extention
    filename:function(req, file, callback){
        callback(null, Date.now() + file.originalname)
    },
})

// upload params for multer
const upload = multer({
    storage:storage,
    limits:{
        filesize:1024*1024*3
    },
})

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article()})
})



// abour router
router.get('/about',(req,res)=>{
    res.render('articles/about')
})
//product
router.get('/product',(req,res)=>{
    res.render('articles/product')
})
//product
router.get('/home_two',(req,res)=>{
    res.render('articles/home_two')
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article})
})



router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug } )
    if( article == null ) res.redirect('/')
    res.render('articles/show', { article: article })
})

router.post('/', upload.single('image'), async (req, res, next) => {
       req.article = new Article()
       next()    
}, saveArticleAndRedirect('new'))

// PUT router
router.put('/:id', upload.single('image'), async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()    
}, saveArticleAndRedirect('edit'))

// route tp delete article
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
            article.img = req.file.filename
        
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }catch (e){
            res.render(`articles/${path}`, {article: article})
        }
    }
}
module.exports = router