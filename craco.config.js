const cracoAlias = require('craco-alias');

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss')('./src/css/tailwind.config.js'),
        require('autoprefixer'),
      ],
    },
  },
  plugins: [
    {
      plugin: cracoAlias,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: './src',
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: './tsconfig.extend.json',
      },
    },
  ],
};
