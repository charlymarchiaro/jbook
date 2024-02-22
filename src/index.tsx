import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import {useEffect, useRef, useState} from "react";
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {fetchPlugin} from "./plugins/fetch-plugin";

const App = () => {
  const esbuildServiceRef = useRef<esbuild.Service>();
  const iframeRef = useRef<any>(HTMLIFrameElement);
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

    iframeRef.current.srcdoc = html;

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

    // setCode(result.outputFiles[0].text);
    iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  }

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', event=>{
            try{
              eval(event.data);
            } catch(err) {
              const root=document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
              throw err;
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
     <div>
       <textarea
          style={{marginLeft: '5px', width: '450px', height: '350px'}}
          value={input}
          onChange={e => setInput(e.target.value)}
       ></textarea>
       <div>
         <button onClick={onClick}>Submit</button>
       </div>
       <iframe ref={iframeRef} title="code preview" sandbox="allow-scripts" srcDoc={html}/>
       <pre>{code}</pre>
     </div>
  );
}

ReactDOM.render(
   <App/>,
   document.querySelector('#root')
);
