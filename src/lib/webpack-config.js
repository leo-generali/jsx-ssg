const webpack = require("webpack");

module.exports = (entry) => {
  return {
    // Defaults to development mode
    mode: "development",

    output: {
      filename: "[name]",
      path: "/",
    },

    // Entry file
    entry: entry,

    // Resolve Stuff
    resolve: {
      modules: ["node_modules"],
      extensions: [".js", ".jsx"],
    },

    // Module manipulations
    module: {
      rules: [
        // JSX file manipulation
        {
          test: /\.jsx$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-transform-react-jsx"],
            },
          },
        },
      ],
    },

    // Plugins
    plugins: [
      // This is added to avoid having to write
      // import React from 'react' at the top of
      // every .jsx file
      new webpack.ProvidePlugin({
        React: "react",
      }),
    ],
  };
};
