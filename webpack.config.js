var webpack = require('webpack');

module.exports = {
    // plugins: {commonsPlugin},

    entry: {
        background: './src/js/background.js',
        popup: './src/js/popup.js'
    },

    output: {
        path: './src/js',
        filename: '[name].bundle.js'
    },

    module: {
        loaders: [
            { test: /\.css$/,           loader: 'style-loader!css-loader' },
            { test: /\.js$/,            loader: 'jsx-loader?harmony' },
            { test: /\.scss$/,          loader: 'style!css!sass?sourceMap' },
            { test: /\.less$/,          loader: 'style!css!less' },
            { test: /\.(.png|.jpg)$/,   loader: 'url-loader?limit=8192' }
        ]
    },

    resolve: {
        extensions: ['','.js', '.json', '.scss', '.less']
    }
}