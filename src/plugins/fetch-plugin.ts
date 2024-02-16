import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {

      // index.js
      build.onLoad({filter: /^index\.js$/}, () => {
        return {loader: 'jsx', contents: inputCode};
      });

      // Check if the file is already in cache
      build.onLoad({filter: /\.*/}, async (args: esbuild.OnLoadArgs) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        if (cachedResult) {
          return cachedResult;
        }
      });

      // css files
      build.onLoad({filter: /\.css$/}, async (args: esbuild.OnLoadArgs) => {
        // Fetch the file
        const {data, request} = await axios.get(args.path);
        const escaped = data
           .replace(/\n/g, '')
           .replace(/"/g, '\\"')
           .replace(/'/g, "\\'");

        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store in cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      // Other files
      build.onLoad({filter: /.*/}, async (args: esbuild.OnLoadArgs) => {
        // Fetch the file
        const {data, request} = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store in cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
