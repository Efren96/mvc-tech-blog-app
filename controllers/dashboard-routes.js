const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connections');
const withAuth = require('../utils/auth');

router.get("/", withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
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
            const post = dbPostData.map((post) => post.get({ plain: true }));
            res.render("dashboard", { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

    router.get("/edit/:id", withAuth, (req, res) => {
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
            ],
        })
            .then(dbPostData => {
                if (!dbPostData) {
                    res.status(404).json({ message: 'Could not find post with this id' });
                    return;
                }
                const post = dbPostData.get({ plain: true });
                console.log(post);
                res.render("edit-post", { post, loggedIn: true });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    });

    router.get("/new", (req, res) => {
        res.render("new-post");
    })
});

module.exports = router;