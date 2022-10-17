module.exports = () => {
    if (['release', 'production'].includes(process.env.APP_ENV)) {
        return require('./app.release.json');
    }
    return require('./app.beta.json');
};
