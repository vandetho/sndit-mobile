const path = require('path');

module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
            '@babel/transform-react-jsx-source',
            [
                'module-resolver',
                {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx', '.ios.js', '.ios.tsx'],
                    root: ['./'],
                    alias: {
                        '@assets': path.resolve(__dirname, './assets'),
                        '@components': path.resolve(__dirname, './components'),
                        '@config': path.resolve(__dirname, './config'),
                        '@constants': path.resolve(__dirname, './constants'),
                        '@contexts': path.resolve(__dirname, './contexts'),
                        '@fetchers': path.resolve(__dirname, './fetchers'),
                        '@hoc': path.resolve(__dirname, './hoc'),
                        '@hooks': path.resolve(__dirname, './hooks'),
                        '@interfaces': path.resolve(__dirname, './interfaces'),
                        '@locales': path.resolve(__dirname, './locales'),
                        '@navigations': path.resolve(__dirname, './navigations'),
                        '@screens': path.resolve(__dirname, './screens'),
                        '@stores': path.resolve(__dirname, './stores'),
                        '@theme': path.resolve(__dirname, './theme'),
                        '@utils': path.resolve(__dirname, './utils'),
                        '@workflows': path.resolve(__dirname, './workflows'),
                    },
                },
            ],
        ],
    };
};
