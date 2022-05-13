import { Config } from 'payload/config';
import path from 'path';

const thumbnail = path.resolve(__dirname, '../../../node_modules/payload/dist/admin/components/elements/Thumbnail/index.tsx');
const replaceThumbnail = path.resolve(__dirname, './thumbnail.tsx');

const thumbnailPlugin = (incomingConfig: Config): Config => {
  return {
    ...incomingConfig,
    admin: {
      ...incomingConfig.admin,
      webpack: (incomingWebpackConfig) => {
        const webpackFn = incomingConfig.admin.webpack;
        const webpackConfig = webpackFn ? webpackFn(incomingWebpackConfig) : incomingWebpackConfig;
        return {
          ...webpackConfig,
          resolve: {
            ...webpackConfig.resolve,
            alias: {
              ...webpackConfig.resolve.alias,
              [thumbnail]: replaceThumbnail,
            }
          }
        };
      }
    }
  }
}

export default thumbnailPlugin;