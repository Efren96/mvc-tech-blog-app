const { User } = require("../models");

const userData = [
    {
        username: "Efren",
        password: "efren",
    },
    {
        username: "Max",
        password: "max",
    },
    {
        username: "Allen",
        password: "allen",
    },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers