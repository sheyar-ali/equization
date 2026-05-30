module.exports = {
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
    },
    // Keep existing config for Nuxt/browser builds
    development: {
      presets: ['@vue/cli-plugin-babel/preset'],
    },
    production: {
      presets: ['@vue/cli-plugin-babel/preset'],
    },
  },
};
