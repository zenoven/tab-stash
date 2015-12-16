var webpack    = require('webpack');
var vendersDir = __dirname + '/src/js/venders';
var alias      = [];

function addPlugin(name, venderPath){
    alias[name] = vendersDir + venderPath;
}

addPlugin('art-template', '/art-template/dist/template-debug.js');

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
            { test: /\.css$/,           loader: 'style!css' },
            { test: /\.js$/,            loader: 'jsx?harmony' },
            { test: /\.scss$/,          loader: 'style!css!sass?sourceMap' },
            { test: /\.less$/,          loader: 'style!css!less' },
            { test: /\.png$/,   loader: 'url?limit=8192&minetype=image/png' },
            { test: /\.jpg$/,   loader: 'url?limit=8192&minetype=image/jpg' }
        ]
    },

    resolve: {
        extensions: ['','.js', '.json', '.scss', '.less'],
        alias: alias
    }
}