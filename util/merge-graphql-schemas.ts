import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
const { print } = require('graphql');
import * as fs from 'fs';
import * as path from 'path';

const rootDir = path.join(__dirname, '../packages/');

const typeDefsArray = loadFilesSync(rootDir, {
  extensions: ['graphql', 'gql'],
  recursive: true,
});

const mergedTypeDefs = mergeTypeDefs(typeDefsArray);

const outputPath = path.join(__dirname, '/../mergedSchema.graphql');

fs.writeFileSync(outputPath, print(mergedTypeDefs), 'utf8');

console.log(`#Merged schema saved to ${outputPath}`);
