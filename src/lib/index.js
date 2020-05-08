const glob = require("fast-glob");
const webpack = require("webpack");
const MemFS = require("memory-fs");
const fs = require("fs");
const ReactDOMServer = require("react-dom/server");
const path = require("path");

const createWebpackConfig = require("./webpack-config");

const DOCTYPE = "<!DOCTYPE html>";

const outputPath = (page) => {
  // Get the slug of the file for pretty URLs
  const slugName = path.basename(page).slice(0, -4);

  return `./dist/${slugName}.html`;
};

const createPageEntry = (pages) => {
  const entry = {};

  pages.forEach((page) => {
    const basename = page
      .slice(0, -4)
      .replace(/\.\/src\/site\//g, "")
      .replace(/\//, "_");

    entry[basename] = page;
  });

  return entry;
};

const watch = () => {
  const mfs = new MemFS();

  // Get the config
  const pages = glob.sync("./src/site/pages/**/*.jsx");

  const pageEntry = createPageEntry(pages);

  const webpackConfig = createWebpackConfig(pageEntry);
  const packer = webpack(webpackConfig);
  packer.outputFileSystem = mfs;

  packer.run((err, stats) => {
    for (const [pageKey, pagePath] of Object.entries(pageEntry)) {
      const compiled = eval(packer.outputFileSystem.data[pageKey].toString());
      const pageAsString =
        DOCTYPE + ReactDOMServer.renderToStaticMarkup(compiled.default());

      const outputFilePath = outputPath(pagePath);

      fs.writeFileSync(outputFilePath, pageAsString, "utf-8");
    }
  });
};

module.exports = {
  watch,
};
