import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import ConfigException from '../exceptions/ConfigException';
export class ConfigurationLoader {
  private yamlToLoad: Array<{ key: string; filepath: string }> = [];
  private configObjects = {};
  private configSafeLoaded = true;
  private static instance: ConfigurationLoader;
  public static getInstance(): ConfigurationLoader {
    if (!ConfigurationLoader.instance) {
      ConfigurationLoader.instance = new ConfigurationLoader();
    }

    return ConfigurationLoader.instance;
  }

  constructor() {
    this.loadConfigurations();
  }

  private loadConfigurations() {
    const currentPath = path.dirname(require.main.filename);
    const configPath = path.join(
      currentPath,
      `..${path.sep}`,
      `..${path.sep}config`,
    );
    fs.readdir(configPath, (err, files) => {
      files.forEach(file => {
        const ext = path.extname(file);
        const filename = path.basename(file);
        if (ext.toLowerCase() === 'yaml' || ext.toLowerCase() === 'yml') {
          this.yamlToLoad.push({
            key: filename,
            filepath: path.join(configPath, path.sep, file),
          });
        }
      });
      this.yamlToLoad.forEach(yamlObj => {
        try {
          const doc = yaml.safeLoad(fs.readFileSync(yamlObj.filepath, 'utf8'));
          this.configObjects[yamlObj.key] = doc;
        } catch (e) {
          throw new ConfigException(yamlObj.filepath);
        }
        console.log(`please override the config via .env file`);
        console.log(
          `this will look like filename.prop=value or something with those lines`,
        );
        console.log(`All config files loaded`, this.configObjects);
      });
    });
  }

  getConfigurations() {
    return this.configObjects;
  }
}
