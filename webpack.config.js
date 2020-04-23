const path = require('path')
let webpack = require('webpack')
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './js/[name].js'
    },

    module: {
        rules: [
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader"
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                    }
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,

                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'img/[hash]-[name].[ext]'
                    }
                }],

            }
        ]

    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./index.html"
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }




}

