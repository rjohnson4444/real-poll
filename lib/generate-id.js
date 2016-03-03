const random_url = require('shortid');

module.exports = () => {
    return random_url.generate();
};
