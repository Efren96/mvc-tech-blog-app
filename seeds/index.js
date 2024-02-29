const seedUsers = require('./userData');
const seedPost = require('./postData');
const seedComments = require('./commentData');

const seqelize = require('../config/connections');

const seedAll = async () => {
    await seqelize.sync({ force: true });
    await seedUsers();
    await seedPost();
    await seedComments();
    process.exit(0);
};

seedAll();