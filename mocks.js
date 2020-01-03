const faker = require('faker');
const tr = require('transliter');

const { Post } = require('./models');

const owner = '5e0ae9fcaa8638191b425693';

module.exports = async() => {
    try {
        await Post.remove();
        Array.from({ length: 20 }).forEach(async() => {
            const title = faker.lorem.words(5);
            const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;

            const post = await Post.create({
                title,
                url,
                body: faker.lorem.words(100),
                owner
            });
            console.log('post mocks', post);
        });
    } catch (err) {
        console.error(err);
    }
};