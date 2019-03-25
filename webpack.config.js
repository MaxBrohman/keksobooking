var path = require('path')

module.exports = {
    entry: './js/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            }
                ]
            }
        ]
    },
    stats: {
        colors: true
    },
    devServer: {
        contentBase: path.join(__dirname, '/build'),
        watchOptions: {
            ignored: /node_modules/
        }
    },
    devtool: 'inline-cheap-source-map'
};