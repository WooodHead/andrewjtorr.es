'use strict'

const { join, resolve } = require('path')
const mdxCompiler = require('@storybook/addon-docs/mdx-compiler-plugin')

const rootDir = resolve(__dirname, '..')
const srcDir = join(rootDir, 'src')

module.exports = {
  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs/register',
    '@storybook/addon-knobs/register',
  ],
  stories: ['../src/**/stories.mdx'],
  webpack: (config, { babelOptions, configType }) => {
    const isProd = /prod(uction)?/i.test(configType)

    config.module.rules.push({
      test: /\.mdx$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            cacheCompression: isProd,
            cacheDirectory: babelOptions.cacheDirectory,
            caller: { target: 'web' },
            compact: isProd,
          },
        },
        {
          loader: require.resolve('@mdx-js/loader'),
          options: { compilers: [mdxCompiler()] },
        },
      ],
    })

    config.module.rules.push({
      test: /\.ts(x)?$/,
      include: [join(rootDir, '.storybook'), srcDir],
      loader: require.resolve('babel-loader'),
      options: {
        cacheCompression: isProd,
        cacheDirectory: babelOptions.cacheDirectory,
        caller: { target: 'web' },
        compact: isProd,
      },
    })

    config.resolve.extensions.push('.ts', '.tsx')
    config.resolve.modules.push(srcDir)

    return config
  },
}
