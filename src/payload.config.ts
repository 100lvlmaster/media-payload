import { buildConfig } from 'payload/config';
import dotenv from 'dotenv';
import path from 'path';
// import Examples from './collections/Examples';

import Users from './collections/Users';
dotenv.config();
import { aliases } from './payload.admin.config';
import thumbnailPlugin from './plugins/thumbnail';
import fileDetailsPlugin from './plugins/file-details';
import uploadCardPlugin from './plugins/upload-card';
import Media from './collections/Media';
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    css: path.resolve(__dirname, './custom/stylesheet.scss'), // this one for override actual styles
    scss: path.resolve(__dirname, './custom/variables.scss'),
    meta: {
      titleSuffix: '- PLAYY®',
      favicon: '/public/icon/favicon.png',
      ogImage: '/public/icon/og-image.png',
    }, // this one for override variables
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          ...aliases,
        },
      },
    }),
  },
  collections: [
    Users,
    Media,
    // Add Collections here
    // Examples,
  ],
  plugins: [thumbnailPlugin, fileDetailsPlugin, uploadCardPlugin],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
