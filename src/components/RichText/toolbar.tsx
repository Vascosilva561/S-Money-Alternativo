"use client";

import { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
  X
} from "lucide-react";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const format = useCallback(
    (style: import("lexical").TextFormatType) => {
      return editor.dispatchCommand(FORMAT_TEXT_COMMAND, style);
    },
    [editor]
  );

  const btnStyle =
    "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition";

  return (
    <div className="flex items-center gap-1 border-b border-gray-300 dark:border-gray-600 mb-2 pb-2">
      <button className={btnStyle} title="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <Undo size={18} />
      </button>
      <button className={btnStyle} title="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <Redo size={18} />
      </button>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

      <button className={btnStyle} title="Bold" onClick={() => format("bold")}>
        <Bold size={18} />
      </button>
      <button className={btnStyle} title="Italic" onClick={() => format("italic")}>
        <Italic size={18} />
      </button>
      <button className={btnStyle} title="Underline" onClick={() => format("underline")}>
        <Underline size={18} />
      </button>

      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

      <button
        className={btnStyle}
        title="Lista não ordenada"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        <List size={18} />
      </button>
      <button
        className={btnStyle}
        title="Lista ordenada"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        <ListOrdered size={18} />
      </button>
      <button
        className={btnStyle}
        title="Remover lista"
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}
      >
        <X size={18} />
      </button>
    </div>
  );
}
