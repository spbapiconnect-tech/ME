/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { parseUploadAsset, uploadAssetLabel } from "@/lib/uploads/upload-provider";

type UploadAssetPreviewProps = {
  value?: string;
  label?: string;
  className?: string;
  compact?: boolean;
};

export function UploadAssetPreview({ value, label, className, compact = false }: UploadAssetPreviewProps) {
  if (!value) return null;

  const asset = parseUploadAsset(value);
  const fileName = uploadAssetLabel(value);
  const mimeType = asset?.mimeType || "";
  const previewUrl = asset?.previewUrl || "";

  if (asset && previewUrl && mimeType.startsWith("image/")) {
    return (
      <div className={cn("overflow-hidden rounded-xl border bg-muted/20", className)}>
        {label ? <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">{label}</div> : null}
        <img src={previewUrl} alt={fileName} className={cn("w-full object-cover", compact ? "max-h-40" : "max-h-72")} />
        <div className="px-3 py-2 text-xs text-muted-foreground">{fileName}</div>
      </div>
    );
  }

  if (asset && previewUrl && mimeType.startsWith("video/")) {
    return (
      <div className={cn("overflow-hidden rounded-xl border bg-muted/20", className)}>
        {label ? <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">{label}</div> : null}
        <video src={previewUrl} controls className={cn("w-full bg-black", compact ? "max-h-44" : "max-h-80")} />
        <div className="px-3 py-2 text-xs text-muted-foreground">{fileName}</div>
      </div>
    );
  }

  if (asset && previewUrl && mimeType === "application/pdf") {
    return (
      <div className={cn("rounded-xl border bg-muted/20 p-3", className)}>
        <div className="text-xs font-medium text-muted-foreground">{label || "PDF Attachment"}</div>
        <div className="mt-1 font-medium">{fileName}</div>
        <div className="mt-2 rounded-lg border bg-background px-3 py-2 text-xs text-muted-foreground">
          PDF preview ready · {Math.ceil(asset.size / 1024)} KB
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border bg-muted/20 p-3 text-sm", className)}>
      <div className="text-xs font-medium text-muted-foreground">{label || "Attachment"}</div>
      <div className="mt-1 font-medium">{fileName || "Uploaded asset"}</div>
      {asset?.mimeType ? <div className="mt-1 text-xs text-muted-foreground">{asset.mimeType}</div> : null}
    </div>
  );
}
