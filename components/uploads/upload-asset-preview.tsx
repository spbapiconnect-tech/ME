/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { parseUploadAsset, uploadAssetLabel } from "@/lib/uploads/upload-provider";

type UploadAssetPreviewProps = {
  value?: string;
  label?: string;
  className?: string;
  compact?: boolean;
};

function formatBytes(size?: number) {
  if (!size || Number.isNaN(size)) return "Unknown size";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function formatUploadedAt(value?: string) {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function AssetMeta({ value, compact = false }: { value?: string; compact?: boolean }) {
  const asset = parseUploadAsset(value);
  if (!asset) return null;

  const meta = [
    formatBytes(asset.size),
    asset.mimeType || "unknown type",
    asset.storageProvider || "local",
  ];

  return (
    <div className={cn("space-y-2 border-t px-3 py-2 text-xs text-muted-foreground", compact && "py-1.5")}>
      <div className="flex flex-wrap gap-1.5">
        {meta.map((item) => (
          <span key={item} className="rounded-full border bg-background px-2 py-0.5">
            {item}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>Uploaded: {formatUploadedAt(asset.uploadedAt)}</span>
        {asset.previewUrl ? (
          <a
            href={asset.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Open preview
          </a>
        ) : null}
      </div>
    </div>
  );
}

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
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">{fileName}</div>
        <AssetMeta value={value} compact={compact} />
      </div>
    );
  }

  if (asset && previewUrl && mimeType.startsWith("video/")) {
    return (
      <div className={cn("overflow-hidden rounded-xl border bg-muted/20", className)}>
        {label ? <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">{label}</div> : null}
        <video src={previewUrl} controls className={cn("w-full bg-black", compact ? "max-h-44" : "max-h-80")} />
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">{fileName}</div>
        <AssetMeta value={value} compact={compact} />
      </div>
    );
  }

  if (asset && previewUrl && mimeType === "application/pdf") {
    return (
      <div className={cn("rounded-xl border bg-muted/20", className)}>
        <div className="p-3">
          <div className="text-xs font-medium text-muted-foreground">{label || "PDF Attachment"}</div>
          <div className="mt-1 font-medium">{fileName}</div>
          <div className="mt-2 rounded-lg border bg-background px-3 py-2 text-xs text-muted-foreground">
            PDF attachment ready
          </div>
        </div>
        <AssetMeta value={value} compact={compact} />
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border bg-muted/20 text-sm", className)}>
      <div className="p-3">
        <div className="text-xs font-medium text-muted-foreground">{label || "Attachment"}</div>
        <div className="mt-1 font-medium">{fileName || "Uploaded asset"}</div>
        {asset?.mimeType ? <div className="mt-1 text-xs text-muted-foreground">{asset.mimeType}</div> : null}
      </div>
      <AssetMeta value={value} compact={compact} />
    </div>
  );
}
