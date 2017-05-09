var express = require('express');
var webpack = require('webpack');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var webpackConfig = require('../config/webpack.config');
var WebpackDevServer = require('webpack-dev-server');
var yamlConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config/config.yml')));
var compiler = webpack(webpackConfig);


var server = new WebpackDevServer(compiler, {

});

