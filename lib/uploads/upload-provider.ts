export type UploadProviderKind = "local-preview" | "supabase" | "cloudflare-r2" | "wordpress-media";

export type UploadAssetScope =
  | "sop"
  | "task"
  | "inspection"
  | "incident"
  | "fefo"
  | "branch";

export type UploadAsset = {
  assetId: string;
  scope: UploadAssetScope;
  fileName: string;
  mimeType: string;
  size: number;
  previewUrl: string;
  storageProvider: UploadProviderKind;
  uploadedAt: string;
};

export type UploadProvider = {
  provider: UploadProviderKind;
  upload(file: File, scope: UploadAssetScope): Promise<UploadAsset>;
};

function createAssetId(scope: UploadAssetScope, fileName: string) {
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${scope}-${Date.now()}-${safeName || "asset"}`;
}

export const localPreviewUploadProvider: UploadProvider = {
  provider: "local-preview",
  async upload(file, scope) {
    return {
      assetId: createAssetId(scope, file.name),
      scope,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      storageProvider: "local-preview",
      uploadedAt: new Date().toISOString(),
    };
  },
};

export async function uploadLocalPreviewAsset(file: File | undefined, scope: UploadAssetScope) {
  if (!file) return null;
  return localPreviewUploadProvider.upload(file, scope);
}

export function serializeUploadAsset(asset: UploadAsset | null | undefined) {
  return asset ? JSON.stringify(asset) : "";
}

export function parseUploadAsset(value: string | undefined) {
  if (!value) return null;
  try {
    return JSON.parse(value) as UploadAsset;
  } catch {
    return null;
  }
}

export function uploadAssetLabel(value: string | undefined) {
  const asset = parseUploadAsset(value);
  return asset?.fileName || value || "";
}
