import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'pg-native', 'pino', 'pino-pretty'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

webpackConfig.resolve.alias = {
  ...webpackConfig.resolve.alias,
  'graphql/execution/values.js': false,
  'graphql/language/index.js': false,
  'graphql': false,
}

if (isServer) {
  webpackConfig.externals = [
    ...(Array.isArray(webpackConfig.externals) ? webpackConfig.externals : []),
    ({ request, context }: any, callback: any) => {
      if (request === 'pg' || request === 'pg-native') {
        return callback(null, `commonjs ${request}`)
      }
      callback()
    },
    'graphql',
    'pino',
    'pino-pretty',
  ]
}

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })