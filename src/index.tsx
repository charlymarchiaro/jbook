import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import {useEffect, useRef, useState} from "react"
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {fetchPlugin} from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";

const App = () => {
  const esbuildServiceRef = useRef<esbuild.Service>();
  const [input, setInput] = useState('import \'bulma/css/bulma.css\';');
  const [code, setCode] = useState('');

  const startService = async () => {
    esbuildServiceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }
  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!esbuildServiceRef.current) {
      return;
    }

    const result = await esbuildServiceRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input),
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  }

  return (
     <div>
       <CodeEditor
          initialValue=""
          onChange={value => setInput(value)}
       />
       <div>
         <button onClick={onClick}>Submit</button>
       </div>
       <Preview code={code}/>
     </div>
  );
}

ReactDOM.render(
   <App/>,
   document.querySelector('#root')
);
