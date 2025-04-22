import type { NextConfig } from 'next/dist/server/config-shared'

import { withPayload } from '@payloadcms/next/withPayload'
// const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (conf) => {
    conf.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return conf
  },

  // transpilePackages: ['../src'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
