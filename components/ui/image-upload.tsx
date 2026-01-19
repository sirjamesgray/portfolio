"use client"

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react"
import Image from "next/image"
import { Upload, X, Loader2, Link2, ImageIcon, Check, AlertCircle } from "lucide-react"
import { DashboardButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { deleteFromStorage, extractStoragePath } from "@/lib/storage"

export interface ImageUploadProps {
  /** Current image URL */
  value?: string | null
  /** Called when image changes (URL or null if removed) */
  onChange: (url: string | null) => void
  /** Called when upload starts/ends for parent loading state */
  onUploadStateChange?: (uploading: boolean) => void
  /** API endpoint for uploading files */
  uploadEndpoint?: string
  /** Folder path in storage bucket */
  storagePath?: string
  /** Accepted file types */
  accept?: string
  /** Max file size in bytes (default 5MB) */
  maxSize?: number
  /** Aspect ratio for preview (e.g. "16/10", "1/1") */
  aspectRatio?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Additional class name */
  className?: string
  /** Show URL input option */
  allowUrl?: boolean
  /** Label above the upload area */
  label?: string
  /** Helper text below */
  helperText?: string
  /** Storage bucket name for deletion (default: project-assets) */
  bucketName?: string
}

type UploadMode = "drop" | "url"

export function ImageUpload({
  value,
  onChange,
  onUploadStateChange,
  uploadEndpoint = "/api/upload",
  storagePath = "images",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  aspectRatio = "16/10",
  placeholder = "Drop an image here, or click to browse",
  disabled = false,
  className,
  allowUrl = true,
  label,
  helperText,
  bucketName = "project-assets",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<UploadMode>("drop")
  const [urlInput, setUrlInput] = useState("")
  const [urlSaved, setUrlSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const setUploading = useCallback((uploading: boolean) => {
    setIsUploading(uploading)
    onUploadStateChange?.(uploading)
  }, [onUploadStateChange])

  // Delete image from storage using shared utility
  const handleDeleteFromStorage = useCallback(async (imageUrl: string): Promise<boolean> => {
    return deleteFromStorage(imageUrl, uploadEndpoint, bucketName)
  }, [bucketName, uploadEndpoint])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }, [disabled, isUploading])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const validateFile = useCallback((file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please upload an image file"
    }
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(0)
      return `File size must be less than ${sizeMB}MB`
    }
    return null
  }, [maxSize])

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Delete old image if exists (replacement upload - cleanup storage)
      if (value) {
        await handleDeleteFromStorage(value)
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("path", storagePath)

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }, [validateFile, setUploading, storagePath, uploadEndpoint, onChange, value, handleDeleteFromStorage])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || isUploading) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      uploadFile(files[0])
    }
  }, [disabled, isUploading, uploadFile])

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [uploadFile])

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled, isUploading])

  const handleRemove = useCallback(async () => {
    if (!value) return

    setIsDeleting(true)
    setError(null)

    try {
      // Try to delete from storage if it's from our bucket
      await handleDeleteFromStorage(value)
      onChange(null)
      setUrlInput("")
    } catch (err) {
      setError("Failed to delete image")
      console.error("Delete error:", err)
    } finally {
      setIsDeleting(false)
    }
  }, [value, handleDeleteFromStorage, onChange])

  const handleUrlSave = useCallback(() => {
    if (!urlInput.trim()) return

    // Basic URL validation
    try {
      new URL(urlInput)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    setError(null)
    onChange(urlInput.trim())
    setUrlSaved(true)
    setTimeout(() => setUrlSaved(false), 2000)
  }, [urlInput, onChange])

  const handleUrlKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleUrlSave()
    }
  }, [handleUrlSave])

  // If we have a value, show the preview
  if (value) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <div className="relative group">
          <div
            className="relative w-full rounded-lg overflow-hidden border border-border bg-muted/50"
            style={{ aspectRatio }}
          >
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Hover overlay with remove button */}
            <div className={cn(
              "absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center",
              isDeleting ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              <DashboardButton
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || isDeleting}
                className="gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Remove
                  </>
                )}
              </DashboardButton>
            </div>
          </div>
        </div>
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      {/* Mode switcher */}
      {allowUrl && (
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setMode("drop")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              mode === "drop"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Upload className="h-3.5 w-3.5 inline mr-1.5" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              mode === "url"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Link2 className="h-3.5 w-3.5 inline mr-1.5" />
            URL
          </button>
        </div>
      )}

      {mode === "drop" ? (
        /* Drop zone */
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative w-full rounded-lg border-2 border-dashed transition-all cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "pointer-events-none"
          )}
          style={{ aspectRatio }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  isDragging ? "bg-primary/10" : "bg-muted"
                )}>
                  <ImageIcon className={cn(
                    "h-6 w-6 transition-colors",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isDragging ? "Drop to upload" : placeholder}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to {(maxSize / (1024 * 1024)).toFixed(0)}MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* URL input */
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleUrlKeyDown}
            disabled={disabled}
            className="flex-1"
          />
          <DashboardButton
            variant="outline"
            size="sm"
            onClick={handleUrlSave}
            disabled={disabled || !urlInput.trim()}
            className="shrink-0"
          >
            {urlSaved ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              "Save"
            )}
          </DashboardButton>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}
