// webpack.config.js
module.exports = {
  // other webpack configurations
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-export-namespace-from"]
          }
        }
      }
    ]
  }
};
