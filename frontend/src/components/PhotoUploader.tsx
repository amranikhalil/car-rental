import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ImagePlus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type UploadItem =
  | { kind: 'existing'; url: string }
  | { kind: 'pending'; id: string; file: File; previewUrl: string; status: 'uploading' | 'error'; errorMsg?: string }
  | { kind: 'done'; id: string; file: File; previewUrl: string; cloudUrl: string }

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
  onUploadingChange: (v: boolean) => void
  maxFiles?: number
}

async function uploadToCloudinary(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: form },
  )
  if (!res.ok) throw new Error('Upload failed')
  return (await res.json()).secure_url as string
}

function resolvedUrls(items: UploadItem[]): string[] {
  return items.flatMap((i) => {
    if (i.kind === 'existing') return [i.url]
    if (i.kind === 'done') return [i.cloudUrl]
    return []
  })
}

export default function PhotoUploader({ value, onChange, onUploadingChange, maxFiles = 6 }: Props) {
  const [items, setItems] = useState<UploadItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Seed existing URLs from parent (edit-car case)
  useEffect(() => {
    setItems((prev) => {
      const knownUrls = new Set(resolvedUrls(prev))
      const incoming = value.filter((u) => !knownUrls.has(u))
      if (incoming.length === 0) return prev
      const newItems: UploadItem[] = incoming.map((url) => ({ kind: 'existing', url }))
      return [...newItems, ...prev.filter((i) => i.kind !== 'existing')]
    })
  }, [value])

  // Notify parent of resolved URLs
  useEffect(() => {
    onChange(resolvedUrls(items))
  }, [items])

  // Notify parent of uploading state
  useEffect(() => {
    onUploadingChange(items.some((i) => i.kind === 'pending' && i.status === 'uploading'))
  }, [items])

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((i) => {
        if (i.kind === 'pending' || i.kind === 'done') URL.revokeObjectURL(i.previewUrl)
      })
    }
  }, [])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const available = maxFiles - items.length
    const toUpload = Array.from(files).slice(0, available)

    toUpload.forEach((file) => {
      const id = crypto.randomUUID()
      const previewUrl = URL.createObjectURL(file)
      const pending: UploadItem = { kind: 'pending', id, file, previewUrl, status: 'uploading' }

      setItems((prev) => [...prev, pending])

      uploadToCloudinary(file)
        .then((cloudUrl) => {
          setItems((prev) =>
            prev.map((i) => (i.kind === 'pending' && i.id === id ? { kind: 'done', id, file, previewUrl, cloudUrl } : i)),
          )
        })
        .catch((err) => {
          setItems((prev) =>
            prev.map((i) =>
              i.kind === 'pending' && i.id === id
                ? { kind: 'pending', id, file, previewUrl, status: 'error', errorMsg: err.message }
                : i,
            ),
          )
        })
    })
  }

  function retry(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.kind === 'pending' && i.id === id ? { ...i, status: 'uploading', errorMsg: undefined } : i)),
    )
    const item = items.find((i) => i.kind === 'pending' && i.id === id) as Extract<UploadItem, { kind: 'pending' }> | undefined
    if (!item) return

    uploadToCloudinary(item.file)
      .then((cloudUrl) => {
        setItems((prev) =>
          prev.map((i) =>
            i.kind === 'pending' && i.id === id ? { kind: 'done', id, file: item.file, previewUrl: item.previewUrl, cloudUrl } : i,
          ),
        )
      })
      .catch((err) => {
        setItems((prev) =>
          prev.map((i) =>
            i.kind === 'pending' && i.id === id ? { ...i, status: 'error', errorMsg: err.message } : i,
          ),
        )
      })
  }

  function remove(index: number) {
    setItems((prev) => {
      const item = prev[index]
      if (item.kind === 'pending' || item.kind === 'done') URL.revokeObjectURL(item.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const canAdd = items.length < maxFiles

  return (
    <div className="space-y-3">
      {canAdd && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-input rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <ImagePlus className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cliquez pour ajouter des photos</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP · max {maxFiles} photos</p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {items.map((item, i) => (
            <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-muted">
              <img
                src={item.kind === 'existing' ? item.url : item.previewUrl}
                alt=""
                className="object-cover w-full h-full"
              />

              {item.kind === 'pending' && item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}

              {item.kind === 'pending' && item.status === 'error' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 p-1">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <button
                    type="button"
                    onClick={() => retry(item.id)}
                    className="text-xs text-white underline"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-5 w-5"
                onClick={() => remove(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
