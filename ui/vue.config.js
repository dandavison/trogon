module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },
  devServer: {
    disableHostCheck: true,
    headers: {
      "Feature-Policy": "autoplay *"
    }
  }
};
