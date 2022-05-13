import path from 'path';

export const aliases = {};

const mockModulePath = path.resolve(__dirname, 'mocks/emptyObject.ts');

const filesToAlias = [
  'custom/s3/hooks/delete-from-s3.ts',
  'custom/s3/hooks/upload-to-s3.ts',
];

filesToAlias.forEach(file => {
  const filePath = path.resolve(__dirname, file);
  aliases[filePath] = mockModulePath;
})
