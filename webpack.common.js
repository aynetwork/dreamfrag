const path = require("path");
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProvidePlugin = require("webpack-provide-global-plugin");
console.log(__dirname)
// Main const


module.exports = {
    entry: path.join(__dirname, 'app', 'mainpage.jsx'),

    output: {
        filename: `[name].min.js`,
        path : path.join(__dirname, 'src', 'main', 'resources', 'js',  'src', 'dist')
    },
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 8000,
        allowedHosts: [
            'localhost:8080'
        ]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },

        ]
    },
    performance: {
        hints: false
    },
    resolve: {
        modules: [
            path.join(__dirname, 'src', 'main', 'resources', 'static', 'js'),
            path.join(__dirname, 'node_modules'),
        ],
    }
};