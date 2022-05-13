import { Config } from 'payload/config';
import path from 'path';

// from src/admin/components/elements/FileDetails/index.tsx

const fileDetails = path.resolve(__dirname, '../../../node_modules/payload/dist/admin/components/elements/FileDetails/index.tsx');
const replaceFileDetails = path.resolve(__dirname, './file-details.tsx');

const fileDetailsPlugin = (incomingConfig: Config): Config => {
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
              [fileDetails]: replaceFileDetails,
            }
          }
        };
      }
    }
  }
}

export default fileDetailsPlugin;