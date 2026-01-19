const BUCKET_NAME = "project-assets"

/**
 * Extract storage path from a Supabase storage URL
 * Returns null if URL is not from our storage bucket
 */
export function extractStoragePath(url: string, bucketName = BUCKET_NAME): string | null {
  if (!url) return null

  try {
    const urlObj = new URL(url)
    // Supabase storage URLs look like:
    // https://xxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file.jpg
    const pathMatch = urlObj.pathname.match(
      new RegExp(`/storage/v1/object/public/${bucketName}/(.+)$`)
    )
    if (pathMatch) {
      return pathMatch[1]
    }
  } catch {
    // Not a valid URL
  }
  return null
}

/**
 * Delete a file from storage by URL
 * Returns true if deleted or not from our storage, false on error
 */
export async function deleteFromStorage(
  url: string,
  endpoint = "/api/upload",
  bucketName = BUCKET_NAME
): Promise<boolean> {
  const storagePath = extractStoragePath(url, bucketName)
  if (!storagePath) {
    // Not from our storage, nothing to delete - this is fine
    return true
  }

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: storagePath }),
    })
    return response.ok
  } catch (error) {
    console.error("Failed to delete from storage:", storagePath, error)
    return false
  }
}
