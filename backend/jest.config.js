const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const fs = require('fs')
let jsonData = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'))
console.log(pathsToModuleNameMapper(jsonData.compilerOptions.paths /*, { prefix: '<rootDir>/' } */ ))
module.exports = {
  // [...]
  moduleNameMapper: pathsToModuleNameMapper(jsonData.compilerOptions.paths /*, { prefix: '<rootDir>/' } */ )
};