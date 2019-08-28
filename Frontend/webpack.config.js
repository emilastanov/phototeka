const path = require('path');
const webpack = require('webpack');
const isDevelopment = process.env.NODE_ENV === 'development';


module.exports = {
    entry: {
        phototeka: './src/index.js',
    },
    module: {
        rules: [
        {
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        }
        ],
    },
    plugins: [
        new webpack.optimize.AggressiveMergingPlugin(),
    ],
    output: {
        filename: '[name].min.js',
        path: path.resolve('.', 'build/phototeka')
    },
    resolve: {
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat',
        },
        extensions: ['.js', '.jsx', '.scss']
    }
};