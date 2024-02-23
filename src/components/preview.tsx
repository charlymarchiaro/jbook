import './preview.css';
import React, {useEffect, useRef} from "react";

interface PreviewProps {
  code: string;
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

const Preview: React.FC<PreviewProps> = ({code}) => {
  const iframeRef = useRef<any>(HTMLIFrameElement);

  useEffect(() => {
    iframeRef.current.srcdoc = html;
    setTimeout(() =>
          iframeRef.current.contentWindow.postMessage(code, '*'),
       50);
  }, [code]);

  return <div className="preview-wrapper">
    <iframe
       ref={iframeRef}
       title="code preview"
       sandbox="allow-scripts"
       srcDoc={html}
    />
  </div>
};

export default Preview;
