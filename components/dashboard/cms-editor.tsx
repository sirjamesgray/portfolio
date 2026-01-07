"use client"

import { useEditor, EditorContent, Extension, Node as TiptapNode, mergeAttributes, ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"

// Context for passing click handler to node view
type BeforeAfterClickHandler = (attrs: {
  before: string
  after: string
  beforeLabel: string
  afterLabel: string
  mode: "fill" | "fit"
  backgroundColor: string
  nodePos: number
}) => void

let beforeAfterClickHandler: BeforeAfterClickHandler | null = null

export function setBeforeAfterClickHandler(handler: BeforeAfterClickHandler | null) {
  beforeAfterClickHandler = handler
}

// Node view component for Before/After
function BeforeAfterNodeView({ node, getPos }: { node: { attrs: Record<string, string> }, getPos: () => number | undefined }) {
  const { before, after, beforeLabel, afterLabel, mode, backgroundColor } = node.attrs

  const handleClick = () => {
    const pos = getPos()
    if (beforeAfterClickHandler && pos !== undefined) {
      beforeAfterClickHandler({
        before,
        after,
        beforeLabel: beforeLabel || "Before",
        afterLabel: afterLabel || "After",
        mode: (mode as "fill" | "fit") || "fill",
        backgroundColor: backgroundColor || "#1a1a1a",
        nodePos: pos,
      })
    }
  }

  const isFitMode = mode === "fit"

  return (
    <NodeViewWrapper>
      <div
        className="my-6 p-4 border border-dashed border-primary/30 rounded-lg bg-primary/5 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/10 transition-colors"
        onClick={handleClick}
        title="Click to edit"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <img src={before} alt={beforeLabel || "Before"} className="w-20 h-14 object-cover rounded border" />
            <p className="text-xs text-muted-foreground mt-1">{beforeLabel || "Before"}</p>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="text-center">
            <img src={after} alt={afterLabel || "After"} className="w-20 h-14 object-cover rounded border" />
            <p className="text-xs text-muted-foreground mt-1">{afterLabel || "After"}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isFitMode ? "Fit mode" : "Fill mode"} • Click to edit
        </p>
      </div>
    </NodeViewWrapper>
  )
}

// Custom extension for Before/After comparison blocks
const BeforeAfterNode = TiptapNode.create({
  name: "beforeAfter",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      before: { default: "" },
      after: { default: "" },
      beforeLabel: { default: "Before" },
      afterLabel: { default: "After" },
      mode: { default: "fill" },
      backgroundColor: { default: "#1a1a1a" },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-before-after]",
        getAttrs: (node) => {
          if (typeof node === "string") return false
          const element = node as HTMLElement
          return {
            before: element.getAttribute("data-before") || "",
            after: element.getAttribute("data-after") || "",
            beforeLabel: element.getAttribute("data-before-label") || "Before",
            afterLabel: element.getAttribute("data-after-label") || "After",
            mode: element.getAttribute("data-mode") || "fill",
            backgroundColor: element.getAttribute("data-background-color") || "#1a1a1a",
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-before-after": "",
        "data-before": node.attrs.before,
        "data-after": node.attrs.after,
        "data-before-label": node.attrs.beforeLabel,
        "data-after-label": node.attrs.afterLabel,
        "data-mode": node.attrs.mode,
        "data-background-color": node.attrs.backgroundColor,
        class: "my-6 p-4 border border-dashed border-primary/30 rounded-lg bg-primary/5 text-center",
      }),
      [
        "div",
        { class: "flex items-center justify-center gap-4" },
        [
          "div",
          { class: "text-center" },
          ["img", { src: node.attrs.before, class: "w-20 h-14 object-cover rounded border", alt: node.attrs.beforeLabel }],
          ["p", { class: "text-xs text-muted-foreground mt-1" }, node.attrs.beforeLabel],
        ],
        ["span", { class: "text-muted-foreground" }, "→"],
        [
          "div",
          { class: "text-center" },
          ["img", { src: node.attrs.after, class: "w-20 h-14 object-cover rounded border", alt: node.attrs.afterLabel }],
          ["p", { class: "text-xs text-muted-foreground mt-1" }, node.attrs.afterLabel],
        ],
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(BeforeAfterNodeView)
  },
})
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
  ImageIcon,
  Type,
  AlignLeft,
  Loader2,
  SplitSquareHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BeforeAfterSlider } from "@/components/before-after-slider"

interface SlashMenuItem {
  title: string
  description: string
  icon: React.ReactNode
  command: (editor: ReturnType<typeof useEditor>) => void
}

const slashMenuItems: SlashMenuItem[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 className="h-4 w-4" />,
    command: (editor) => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 className="h-4 w-4" />,
    command: (editor) => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Text",
    description: "Normal paragraph text",
    icon: <Type className="h-4 w-4" />,
    command: (editor) => editor?.chain().focus().setParagraph().run(),
  },
  {
    title: "Bullet List",
    description: "Unordered list",
    icon: <List className="h-4 w-4" />,
    command: (editor) => editor?.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Ordered list",
    icon: <ListOrdered className="h-4 w-4" />,
    command: (editor) => editor?.chain().focus().toggleOrderedList().run(),
  },
]

interface CMSEditorProps {
  content: string
  onChange: (content: string) => void
  onImageUpload?: (file: File) => Promise<string>
  placeholder?: string
  className?: string
}

export interface CMSEditorRef {
  getHTML: () => string
  setContent: (content: string) => void
}

export const CMSEditor = forwardRef<CMSEditorRef, CMSEditorProps>(function CMSEditor({
  content,
  onChange,
  onImageUpload,
  placeholder = "Start writing... Type / for commands",
  className,
}, ref) {
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 })
  const [slashQuery, setSlashQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [showBeforeAfterDialog, setShowBeforeAfterDialog] = useState(false)
  const [beforeImageUrl, setBeforeImageUrl] = useState("")
  const [afterImageUrl, setAfterImageUrl] = useState("")
  const [beforeLabel, setBeforeLabel] = useState("Before")
  const [afterLabel, setAfterLabel] = useState("After")
  const [uploadingBefore, setUploadingBefore] = useState(false)
  const [uploadingAfter, setUploadingAfter] = useState(false)
  const [editingNodePos, setEditingNodePos] = useState<number | null>(null)
  const [displayMode, setDisplayMode] = useState<"fill" | "fit">("fill")
  const [bgColor, setBgColor] = useState("#1a1a1a")
  const slashMenuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const beforeFileInputRef = useRef<HTMLInputElement>(null)
  const afterFileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      BeforeAfterNode,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-6 first:[&_h1]:mt-0",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-5 first:[&_h2]:mt-0",
          "[&_p]:mb-3 [&_p]:leading-relaxed",
          "[&_img]:rounded-lg [&_img]:my-4"
        ),
      },
      handleKeyDown: (view, event) => {
        // Handle slash menu
        if (event.key === "/" && !showSlashMenu) {
          const { from } = view.state.selection
          const coords = view.coordsAtPos(from)
          const editorRect = view.dom.getBoundingClientRect()

          setSlashMenuPosition({
            top: coords.bottom - editorRect.top + 8,
            left: coords.left - editorRect.left,
          })
          setShowSlashMenu(true)
          setSlashQuery("")
          setSelectedIndex(0)
          return false
        }

        if (showSlashMenu) {
          if (event.key === "Escape") {
            setShowSlashMenu(false)
            return true
          }
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
            return true
          }
          if (event.key === "ArrowUp") {
            event.preventDefault()
            setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
            return true
          }
          if (event.key === "Enter") {
            event.preventDefault()
            selectItem(selectedIndex)
            return true
          }
          if (event.key === "Backspace" && slashQuery === "") {
            setShowSlashMenu(false)
            return false
          }
        }

        return false
      },
    },
  })

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() || "",
    setContent: (newContent: string) => {
      editor?.commands.setContent(newContent)
    },
  }))

  // Register before/after click handler
  useEffect(() => {
    setBeforeAfterClickHandler((attrs) => {
      setBeforeImageUrl(attrs.before)
      setAfterImageUrl(attrs.after)
      setBeforeLabel(attrs.beforeLabel)
      setAfterLabel(attrs.afterLabel)
      setDisplayMode(attrs.mode)
      setBgColor(attrs.backgroundColor)
      setEditingNodePos(attrs.nodePos)
      setShowBeforeAfterDialog(true)
    })

    return () => {
      setBeforeAfterClickHandler(null)
    }
  }, [])

  // Handle typing in slash menu
  useEffect(() => {
    if (!editor || !showSlashMenu) return

    const handleInput = () => {
      const { from } = editor.state.selection
      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - 20),
        from,
        "\n"
      )
      const slashIndex = textBefore.lastIndexOf("/")
      if (slashIndex !== -1) {
        const query = textBefore.slice(slashIndex + 1)
        setSlashQuery(query)
        setSelectedIndex(0)
      } else {
        setShowSlashMenu(false)
      }
    }

    editor.on("update", handleInput)
    return () => {
      editor.off("update", handleInput)
    }
  }, [editor, showSlashMenu])

  // Close menu on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (slashMenuRef.current && !slashMenuRef.current.contains(e.target as Node)) {
        setShowSlashMenu(false)
      }
    }
    if (showSlashMenu) {
      document.addEventListener("mousedown", handleClick)
    }
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showSlashMenu])

  const filteredItems = slashMenuItems.filter((item) =>
    item.title.toLowerCase().includes(slashQuery.toLowerCase())
  )

  // Add image and before/after options to filtered items when applicable
  const allItems = [
    ...filteredItems,
    ...(slashQuery === "" || "image".includes(slashQuery.toLowerCase())
      ? [{
          title: "Image",
          description: "Upload or embed an image",
          icon: <ImageIcon className="h-4 w-4" />,
          command: () => setShowImageDialog(true),
        }]
      : []),
    ...(slashQuery === "" || "before".includes(slashQuery.toLowerCase()) || "after".includes(slashQuery.toLowerCase()) || "comparison".includes(slashQuery.toLowerCase())
      ? [{
          title: "Before/After",
          description: "Comparison slider with two images",
          icon: <SplitSquareHorizontal className="h-4 w-4" />,
          command: () => setShowBeforeAfterDialog(true),
        }]
      : []),
  ]

  const selectItem = useCallback((index: number) => {
    const item = allItems[index]
    if (!item || !editor) return

    // Delete the slash and query
    const { from } = editor.state.selection
    const textBefore = editor.state.doc.textBetween(
      Math.max(0, from - 20),
      from,
      "\n"
    )
    const slashIndex = textBefore.lastIndexOf("/")
    if (slashIndex !== -1) {
      const deleteFrom = from - (textBefore.length - slashIndex)
      editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run()
    }

    setShowSlashMenu(false)
    item.command(editor)
  }, [allItems, editor])

  const handleImageUpload = useCallback(async (file: File) => {
    if (!onImageUpload || !editor) return

    setUploading(true)
    try {
      const url = await onImageUpload(file)
      editor.chain().focus().setImage({ src: url }).run()
      setShowImageDialog(false)
      setImageUrl("")
    } catch (error) {
      console.error("Failed to upload image:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }, [editor, onImageUpload])

  const handleImageUrlSubmit = useCallback(() => {
    if (!imageUrl || !editor) return
    editor.chain().focus().setImage({ src: imageUrl }).run()
    setShowImageDialog(false)
    setImageUrl("")
  }, [editor, imageUrl])

  if (!editor) {
    return null
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-background relative", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 1 }) && "bg-muted")}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 2 }) && "bg-muted")}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-muted")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-muted")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-muted")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-muted")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageDialog(true)}
          className="h-8 w-8 p-0"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent editor={editor} />

        {/* Slash Command Menu */}
        {showSlashMenu && allItems.length > 0 && (
          <div
            ref={slashMenuRef}
            className="absolute z-50 w-64 bg-popover backdrop-blur-xl border rounded-lg shadow-lg overflow-hidden"
            style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
          >
            <div className="p-1">
              {allItems.map((item, index) => (
                <button
                  key={item.title}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 text-left rounded-md text-sm transition-colors",
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => selectItem(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
                e.target.value = ""
              }}
            />

            {onImageUpload && (
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  if (file && file.type.startsWith("image/")) {
                    handleImageUpload(file)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag & drop
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or paste URL
                </span>
              </div>
            </div>

            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImageUrlSubmit} disabled={!imageUrl}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Before/After Dialog */}
      <Dialog open={showBeforeAfterDialog} onOpenChange={(open) => {
        setShowBeforeAfterDialog(open)
        if (!open) {
          setBeforeImageUrl("")
          setAfterImageUrl("")
          setBeforeLabel("Before")
          setAfterLabel("After")
          setDisplayMode("fill")
          setBgColor("#1a1a1a")
          setEditingNodePos(null)
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNodePos !== null ? "Edit" : "Insert"} Before/After Comparison</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Images should be <strong>16:9 ratio</strong> (e.g., 1920×1080, 1280×720). Both images must have identical dimensions for proper alignment.
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Hidden file inputs */}
            <input
              ref={beforeFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file && onImageUpload) {
                  setUploadingBefore(true)
                  try {
                    const url = await onImageUpload(file)
                    setBeforeImageUrl(url)
                  } catch (error) {
                    console.error("Failed to upload:", error)
                  } finally {
                    setUploadingBefore(false)
                  }
                }
                e.target.value = ""
              }}
            />
            <input
              ref={afterFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file && onImageUpload) {
                  setUploadingAfter(true)
                  try {
                    const url = await onImageUpload(file)
                    setAfterImageUrl(url)
                  } catch (error) {
                    console.error("Failed to upload:", error)
                  } finally {
                    setUploadingAfter(false)
                  }
                }
                e.target.value = ""
              }}
            />

            {/* Before Image */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Before Image</label>
              {beforeImageUrl ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-24 h-16 rounded border overflow-hidden bg-muted">
                    <img src={beforeImageUrl} alt="Before" className="w-full h-full object-cover" />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => beforeFileInputRef.current?.click()}>
                    Replace
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setBeforeImageUrl("")}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => beforeFileInputRef.current?.click()}
                    disabled={uploadingBefore}
                  >
                    {uploadingBefore ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Upload
                  </Button>
                  <Input
                    placeholder="Or paste URL..."
                    value={beforeImageUrl}
                    onChange={(e) => setBeforeImageUrl(e.target.value)}
                    className="flex-1"
                  />
                </div>
              )}
            </div>

            {/* After Image */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">After Image</label>
              {afterImageUrl ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-24 h-16 rounded border overflow-hidden bg-muted">
                    <img src={afterImageUrl} alt="After" className="w-full h-full object-cover" />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => afterFileInputRef.current?.click()}>
                    Replace
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setAfterImageUrl("")}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => afterFileInputRef.current?.click()}
                    disabled={uploadingAfter}
                  >
                    {uploadingAfter ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Upload
                  </Button>
                  <Input
                    placeholder="Or paste URL..."
                    value={afterImageUrl}
                    onChange={(e) => setAfterImageUrl(e.target.value)}
                    className="flex-1"
                  />
                </div>
              )}
            </div>

            {/* Labels */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Before Label</label>
                <Input
                  value={beforeLabel}
                  onChange={(e) => setBeforeLabel(e.target.value)}
                  placeholder="Before"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">After Label</label>
                <Input
                  value={afterLabel}
                  onChange={(e) => setAfterLabel(e.target.value)}
                  placeholder="After"
                />
              </div>
            </div>

            {/* Display Mode Toggle */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Display Mode</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={displayMode === "fill" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDisplayMode("fill")}
                  className="flex-1"
                >
                  Fill
                </Button>
                <Button
                  type="button"
                  variant={displayMode === "fit" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDisplayMode("fit")}
                  className="flex-1"
                >
                  Fit with Padding
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {displayMode === "fill"
                  ? "Images will cover the entire container (may crop)"
                  : "Images will be inset with padding and rounded corners"}
              </p>
            </div>

            {/* Background Color (only for fit mode) */}
            {displayMode === "fit" && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Background Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                  </div>
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#1a1a1a"
                    className="flex-1 font-mono text-sm"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: bgColor }}
                    title="Preview"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pick from the color wheel or enter a hex value
                </p>
              </div>
            )}

            {/* Live Preview */}
            {beforeImageUrl && afterImageUrl && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Preview</label>
                <div className="border rounded-lg overflow-hidden">
                  <BeforeAfterSlider
                    beforeImage={beforeImageUrl}
                    afterImage={afterImageUrl}
                    beforeLabel={beforeLabel}
                    afterLabel={afterLabel}
                    mode={displayMode}
                    backgroundColor={bgColor}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hover or drag to test the slider
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBeforeAfterDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (beforeImageUrl && afterImageUrl && editor) {
                  const attrs = {
                    before: beforeImageUrl,
                    after: afterImageUrl,
                    beforeLabel: beforeLabel,
                    afterLabel: afterLabel,
                    mode: displayMode,
                    backgroundColor: bgColor,
                  }
                  if (editingNodePos !== null) {
                    // Update existing node by deleting and re-inserting at position
                    const { state } = editor
                    const node = state.doc.nodeAt(editingNodePos)
                    if (node) {
                      editor.chain()
                        .focus()
                        .deleteRange({ from: editingNodePos, to: editingNodePos + node.nodeSize })
                        .insertContentAt(editingNodePos, {
                          type: "beforeAfter",
                          attrs,
                        })
                        .run()
                    }
                  } else {
                    // Insert as a new node
                    editor.chain().focus().insertContent({
                      type: "beforeAfter",
                      attrs,
                    }).run()
                  }
                  setShowBeforeAfterDialog(false)
                  setBeforeImageUrl("")
                  setAfterImageUrl("")
                  setBeforeLabel("Before")
                  setAfterLabel("After")
                  setDisplayMode("fill")
                  setBgColor("#1a1a1a")
                  setEditingNodePos(null)
                }
              }}
              disabled={!beforeImageUrl || !afterImageUrl}
            >
              {editingNodePos !== null ? "Update" : "Insert"} Comparison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})
