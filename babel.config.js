// babel.config.js
// Required by Expo. Do not delete or edit unless you know what you're doing.
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
    };
};