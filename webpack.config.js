'use strict'

var path = require('path')
const ngtools = require('@ngtools/webpack')

module.exports = {
  context: __dirname,
  entry: './app.ts',
  output: {
    path: path.join(__dirname, './bundle'),
    publicPath: '/',
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components|lib)/,
      loader: 'babel-loader?presets[]=es2015&presets[]=stage-1'
    }, {
      test: /\.ts$/,
      exclude: /(node_modules|bower_components|lib)/,
      //loader: '@ngtools/webpack'
loader: 'awesome-typescript-loader'
    }, {
      test: /(.*)\.(eot|svg|ttf|woff|woff2)$/,
      loader: '@ngtools/webpack'
    }]
  },
  resolve: {
    modules: ['bower_components', 'node_modules'],
    extensions: ['.ts', '.js'],
    alias: {
      '@angular/upgrade/static': '@angular/upgrade/bundles/upgrade-static.umd.js'
    }
  },
  plugins: [
    new ngtools.AotPlugin({
      tsConfigPath: './tsconfig.json',
      "entryModule": "./app.module#AppModule"
    })
  ]
}
