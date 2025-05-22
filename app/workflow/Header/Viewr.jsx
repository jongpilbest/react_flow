import { useRef } from "react";
import Editor from "@monaco-editor/react";

export default function SQLViewer({ sqlText, onEditorMount,onChange }) {
  return (
    <Editor
    onChange={(value) => {
        if (onChange) {
          onChange(value); 
        }
      }}
      height="500px"
      defaultLanguage="sql"
      defaultValue={sqlText}
      theme="vs-light"
      onMount={onEditorMount}
      options={{
        minimap: { enabled: false }
        ,fontSize: 13   // ✨ 미니맵 끄기
      }}
    />
  );
}