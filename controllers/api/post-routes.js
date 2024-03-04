const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connections');
const withAuth = require('../../utils/auth');

// gets all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id',
            'title',
            'content',
            'created_at'
        ],
        order: [
            ['created_at', 'DESC']
        ],
        include: [{
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id'],
            include: {
                model: User,
                attributes: ['username'],
            }
        },
        ]
    })
        .then(dbPostData => res.json(dbPostData.reverse()))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// gets post by id
router.get('/:id', (req, res) => {
    User.findOne({
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
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
                model: User,
                attributes: ['username'],
            }
        },
        {
            model: Post,
            attributes: ['title'],
        }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'Could not find post with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// creates post
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// updates post
router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        content: req.body.content,
    }, {
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'Could not find post with this id' });
            return;
        }
        res.json(dbPostData);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// deletes
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'Could not find post with this id' });
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;