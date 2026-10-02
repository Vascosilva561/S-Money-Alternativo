import { useCallback } from "react"
import { $generateHtmlFromNodes } from "@lexical/html"
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListItemNode,
    ListNode,
} from "@lexical/list"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    type TextFormatType,
} from "lexical"
import { Bold, Italic, List, ListOrdered, Redo, Underline, Undo } from "lucide-react"

type FaqAnswerEditorProps = {
    id: string
    onChange: (html: string) => void
}

function AnswerToolbar() {
    const [editor] = useLexicalComposerContext()
    const format = useCallback((style: TextFormatType) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, style)
    }, [editor])

    const buttonClass = "inline-flex size-8 items-center justify-center rounded-md text-[#475467] transition hover:bg-[#F2F5FA] hover:text-[#143163] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#48B9FF]"

    return (
        <div
            aria-label="Formatação da resposta"
            className="flex items-center gap-1 border-b border-[#E5EBF4] px-2 py-1.5"
            role="toolbar"
        >
            <button aria-label="Desfazer" className={buttonClass} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} onMouseDown={(event) => event.preventDefault()} title="Desfazer" type="button">
                <Undo aria-hidden="true" size={16} />
            </button>
            <button aria-label="Refazer" className={buttonClass} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} onMouseDown={(event) => event.preventDefault()} title="Refazer" type="button">
                <Redo aria-hidden="true" size={16} />
            </button>
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-[#E5EBF4]" />
            <button aria-label="Negrito" className={buttonClass} onClick={() => format("bold")} onMouseDown={(event) => event.preventDefault()} title="Negrito" type="button">
                <Bold aria-hidden="true" size={16} />
            </button>
            <button aria-label="Itálico" className={buttonClass} onClick={() => format("italic")} onMouseDown={(event) => event.preventDefault()} title="Itálico" type="button">
                <Italic aria-hidden="true" size={16} />
            </button>
            <button aria-label="Sublinhado" className={buttonClass} onClick={() => format("underline")} onMouseDown={(event) => event.preventDefault()} title="Sublinhado" type="button">
                <Underline aria-hidden="true" size={16} />
            </button>
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-[#E5EBF4]" />
            <button aria-label="Lista com marcadores" className={buttonClass} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} onMouseDown={(event) => event.preventDefault()} title="Lista com marcadores" type="button">
                <List aria-hidden="true" size={16} />
            </button>
            <button aria-label="Lista numerada" className={buttonClass} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} onMouseDown={(event) => event.preventDefault()} title="Lista numerada" type="button">
                <ListOrdered aria-hidden="true" size={16} />
            </button>
        </div>
    )
}

export function FaqAnswerEditor({ id, onChange }: FaqAnswerEditorProps) {
    const initialConfig = {
        namespace: "FaqAnswerEditor",
        nodes: [ListNode, ListItemNode],
        theme: {
            list: {
                ol: "list-decimal pl-5",
                ul: "list-disc pl-5",
                listitem: "my-1",
            },
            text: {
                bold: "font-semibold",
                italic: "italic",
                underline: "underline",
            },
        },
        onError(error: Error) {
            console.error(error)
        },
    }

    return (
        <div className="overflow-hidden rounded-lg border border-[#C9D8E9] transition focus-within:ring-2 focus-within:ring-[#48B9FF]">
            <LexicalComposer initialConfig={initialConfig}>
                <AnswerToolbar />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                aria-label="Resposta"
                                aria-multiline="true"
                                aria-required="true"
                                className="min-h-[180px] max-h-[360px] overflow-y-auto px-3 py-3 text-sm text-[#143163] outline-none"
                                id={id}
                            />
                        }
                        placeholder={<div className="pointer-events-none absolute left-3 top-3 text-sm text-[#8293AE]">Digite a resposta...</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
                <HistoryPlugin />
                <ListPlugin />
                <OnChangePlugin
                    onChange={(editorState, editor) => {
                        editorState.read(() => onChange($generateHtmlFromNodes(editor, null)))
                    }}
                />
            </LexicalComposer>
        </div>
    )
}

export function hasFaqAnswerContent(html: string) {
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim().length > 0
}
