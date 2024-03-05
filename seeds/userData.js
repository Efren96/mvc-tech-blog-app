const { User } = require("../models");

const userData = [
    {
        username: "Efren",
        email: "efren@gmail.com",
        password: "efren",
    },
    {
        username: "Max",
        email: "max@gmail.com",
        password: "max",
    },
    {
        username: "Allen",
        email: "allen@gmail.com",
        password: "allen",
    },
];

const seedUsers = () => User.bulkCreate(userData, {individualHooks: true, returning: true});

module.exports = seedUsers