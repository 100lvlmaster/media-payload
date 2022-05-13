import { Config } from 'payload/config';
import path from 'path';

// from payload/dist/admin/components/elements/UploadCard/index.tsx

const uploadCard = path.resolve(
  __dirname,
  '../../../node_modules/payload/dist/admin/components/elements/UploadCard/index.tsx'
);
const replaceUploadCard = path.resolve(__dirname, './upload-card.tsx');

const uploadCardPlugin = (incomingConfig: Config): Config => {
  return {
    ...incomingConfig,
    admin: {
      ...incomingConfig.admin,
      webpack: (incomingWebpackConfig) => {
        const webpackFn = incomingConfig.admin.webpack;
        const webpackConfig = webpackFn
          ? webpackFn(incomingWebpackConfig)
          : incomingWebpackConfig;
        return {
          ...webpackConfig,
          resolve: {
            ...webpackConfig.resolve,
            alias: {
              ...webpackConfig.resolve.alias,
              [uploadCard]: replaceUploadCard,
            },
          },
        };
      },
    },
  };
};

export default uploadCardPlugin;
