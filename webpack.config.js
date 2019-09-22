const webpack = require('webpack')

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? '' : 'cheap-module-eval-source-map',
  entry: ['./app/app.js'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        enforce: 'pre',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        sideEffects: true,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader',
      },
      // these are for font awesome
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])+$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])+$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
    alias: {
      handlebars: 'handlebars/dist/handlebars.js',
    },
  },
  output: {
    path: __dirname + '/dist',
    filename: 'urbanexplorer-v0.0.1.js',
    publicPath: 'dist/'
  },
  node: {
    fs: 'empty',
  },
  devServer: {
    contentBase: './public'
  },
}
