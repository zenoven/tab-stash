var webpack    = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var glob = require('glob');
var path = require('path');
var root = path.join(__dirname, '../');
var srcPath = path.join(root, 'src');
var entryPath = path.join(srcPath, 'js');
var entries = [];
glob.sync('*.js', {
    cwd: entryPath
}).forEach(function (filePath) {
    var chunk = filePath.slice(0, -3);
    entries[chunk]
})

module.exports = {
    entry: {
        background: './src/js/background.js',
        options: './src/js/options.js',
        popup: './src/js/popup.js'
    },

    output: {
        path: './src/js',
        filename: '[name].bundle.js'
    },

    module: {
        loaders: [
            { test: /\.vue$/,           loader: 'vue' },
            { test: /\.js$/,            loader: 'jsx?harmony!babel', exclude: [/node_modules/] },
            { test: /\.(png|jpg)$/,     loader: 'url-loader?limit=8192' }
        ]
    },

    resolve: {
        extensions: ['','.js', '.json', '.scss', '.less'],
        modulesDirectories: ["node_modules"]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue: 'vue'
        }),
        new CommonsChunkPlugin('common.bundle.js')
    ]

};
