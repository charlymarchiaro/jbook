import './text-editor.css';
import React, {useEffect, useRef, useState} from "react";
import MdEditor from "@uiw/react-md-editor";

const TextEditor: React.FC<any> = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('# Header');

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && event.target && ref.current?.contains(event.target as Node)) {
        return;
      }
      setEditing(false);
    }

    document.addEventListener('click', listener, {capture: true});

    return () => {
      document.removeEventListener('click', listener, {capture: true});
    }
  }, []);

  if (editing) {
    return <div ref={ref} className="text-editor">
      <MdEditor value={value} onChange={v => setValue(v ?? '')}/>
    </div>
  }

  return <div className="text-editor card" onClick={() => setEditing(true)}>
    <div className="card-content">
      <MdEditor.Markdown source={value}/>
    </div>
  </div>
};

export default TextEditor;
