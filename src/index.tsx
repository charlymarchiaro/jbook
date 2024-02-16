import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import {useEffect, useRef, useState} from "react";
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";

const App = () => {
  const esbuildServiceRef = useRef<esbuild.Service>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    esbuildServiceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
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
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    // console.log(result)
    setCode(result.outputFiles[0].text);
  }

  return (
     <div>
       <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
       ></textarea>
       <div>
         <button onClick={onClick}>Submit</button>
       </div>
       <pre>{code}</pre>
     </div>
  );
}

ReactDOM.render(
   <App/>,
   document.querySelector('#root')
);
