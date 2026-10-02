"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import ToolbarPlugin from "@/components/RichText/toolbar";
import type { SerializedEditorState } from "lexical";


interface EditorProps {
  editorSerializedState: SerializedEditorState;
  onSerializedChange: (json: any) => void;
}

export function Editor({ editorSerializedState, onSerializedChange }: EditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    theme: {},
    onError(error: any) {
      console.error(error);
    },
    editorState: (editor: any) => {
      if (editorSerializedState) {
        editor.setEditorState(editor.parseEditorState(editorSerializedState));
      }
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      {/* <RichTextPlugin
              contentEditable={<ContentEditable className="border p-2 rounded min-h-[150px] outline-none" />}
              placeholder={<div className="text-gray-400">Digite algo...</div>} />
      <HistoryPlugin /> */}
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const json = editorState.toJSON();
            onSerializedChange(json);
          });
        }}
      />
    </LexicalComposer>
  );
}
