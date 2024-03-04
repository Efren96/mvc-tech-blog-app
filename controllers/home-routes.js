const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connections');

// gets all post and comments 
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id',
            'title',
            'content',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes: ['id',
                'comment_text',
                'post_id',
                'user_id',
                'created_at'],
            include: {
                model: User,
                attributes: ['username']
            },
        },
        {
            model: User,
            attributes: ['username'],
        },
        ]
    })
        .then(dbPostData => {
            const posts = dbPostData.map((post) => post.get({ plain: true }));
            res.render("homepage", { posts, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// login page
router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// sign up page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// gets post by id
router.get("/post/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'contetnt',
            'title',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes: ['id',
                'comment_text',
                'post_id',
                'user_id',
                'created_at'],
            include: {
                model: User,
                attributes: ['username'],
            },
        },
        {
            model: User,
            attributes: ['username'],

        },
        ],
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'Could not find post with this id' });
                return;
            }
            const post = dbPostData.get({ plain: true });
            console.log(post);
            res.render("single-post", { post, loggedIn: req.session.loggedIn});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// gets posts comments by id
router.get("/post-comments", (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'contetnt',
            'title',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes: ['id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at'],
            include: {
                model: User,
                attributes: ["username"],
            },
        },
        {
            model: User,
            attributes: ['username'],
        },
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'Could not find post with this id' });
                return;
            }
            const post = dbPostData.get({ plain: true });
            res.render('posts-comments', { post, loggedIn: req.session.loggedIn });
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;