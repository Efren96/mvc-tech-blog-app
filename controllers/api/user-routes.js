const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// gets all user post
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['[password']}
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// gets user by id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['[password']},
    where: {
      id: req.params.id
    },
    include: [{
      model: Post,
      attributes: [
        'id',
        'title',
        'content',
        'created_at'
      ]
    },
    {
      model: Comment,
      attributes: ['id', 'comment_text', 'created_at'],
      include: {
        model: Post,
        attributes: ['title'],
      }
    },
    {
      model: Post,
      attributes: ['title'],
    }
  ]
  })
  .then(dbUserData => {
    if(!dbUserData) {
      res.status(404).json({ message: 'Could not find user with this id'});
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// creates user
router.post('/', async (req, res) => {
    try {
      const dbUserData = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
  
      req.session.save(() => {
        req.session.loggedIn = true;
  
        res.status(200).json(dbUserData);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// logs user in
  router.post('/login', async (req, res) => {
  User.findOne({ where: { email: req.body.email } 
  }).then(dbUserData => {
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    const validPassword = dbUserData.checkPassword(req.body.password);

      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      req.session.save(() => {

        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.id;
        req.session.loggedIn = true;
        
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    })
    .catch (err => {
      console.log(err);
      res.status(400).json(err);
  });
});
  
  // logs user out
  router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
  
  module.exports = router;