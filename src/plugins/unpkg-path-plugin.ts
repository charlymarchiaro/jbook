import * as esbuild from 'esbuild-wasm';
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({filter: /.*/}, async (args: any) => {
        if (args.path === 'index.js') {
          return {path: args.path, namespace: 'a'};

        }

        if (args.path.includes('./')) {
          return {
            path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
            namespace: 'a',
          };
        }

        return {path: `https://unpkg.com/${args.path}`, namespace: 'a'}
      });

      build.onLoad({filter: /.*/}, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import React, {useState} from 'react-select';
              console.log(React, useState);
            `,
          };
        }

        // Check if the file is already in cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        if (cachedResult) {
          return cachedResult;
        }

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
