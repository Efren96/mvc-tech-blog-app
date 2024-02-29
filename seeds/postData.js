const { Post } = require("../models");

const postData = [
    {
        title: "Test Title 1",
        content: "This is the my first post!",
        user_id: "1"
    },
    {
        title: "Test Title 2",
        content: "This is the my second post!",
        user_id: "2"
    },
    {
        title: "Test Title 3",
        content: "This is the my third post!",
        user_id: "3"
    },
];

const seedPost = () => Post.bulkCreate(postData);

module.exports = seedPost