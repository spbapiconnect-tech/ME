import type { ModuleRow } from "@/components/module/module-page-shell";
import { getMeApiConfig, type MeDataProviderMode } from "@/lib/me/api-config";

export type RuntimeActionPayload = {
  moduleKey: string;
  action: string;
  detail: string;
  row?: ModuleRow;
};

export interface MeDataProvider {
  mode: MeDataProviderMode;
  syncCreateRecord: (moduleKey: string, row: ModuleRow) => Promise<void>;
  syncUpdateRecord: (moduleKey: string, rowId: string, patch: Partial<ModuleRow>) => Promise<void>;
  syncActionLog: (payload: RuntimeActionPayload) => Promise<void>;
}

async function postJson(url: string, token: string | undefined, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Provider request failed: ${response.status}`);
  }
}

function createLocalProvider(): MeDataProvider {
  return {
    mode: "local",
    async syncCreateRecord() {},
    async syncUpdateRecord() {},
    async syncActionLog() {},
  };
}

function createSupabaseProvider(): MeDataProvider {
  const config = getMeApiConfig();
  const base = config.supabaseUrl;
  const token = config.supabaseKey;
  return {
    mode: "supabase",
    async syncCreateRecord(moduleKey, row) {
      if (!base) return;
      await postJson(`${base}/functions/v1/me-runtime-create`, token, { moduleKey, row });
    },
    async syncUpdateRecord(moduleKey, rowId, patch) {
      if (!base) return;
      await postJson(`${base}/functions/v1/me-runtime-update`, token, { moduleKey, rowId, patch });
    },
    async syncActionLog(payload) {
      if (!base) return;
      await postJson(`${base}/functions/v1/me-runtime-log`, token, payload);
    },
  };
}

function createWordpressProvider(): MeDataProvider {
  const config = getMeApiConfig();
  const base = config.wordpressUrl;
  const token = config.wordpressToken;
  return {
    mode: "wordpress",
    async syncCreateRecord(moduleKey, row) {
      if (!base) return;
      await postJson(`${base}/wp-json/me/v1/runtime/create`, token, { moduleKey, row });
    },
    async syncUpdateRecord(moduleKey, rowId, patch) {
      if (!base) return;
      await postJson(`${base}/wp-json/me/v1/runtime/update`, token, { moduleKey, rowId, patch });
    },
    async syncActionLog(payload) {
      if (!base) return;
      await postJson(`${base}/wp-json/me/v1/runtime/log`, token, payload);
    },
  };
}

function createCloudflareProvider(): MeDataProvider {
  const config = getMeApiConfig();
  const base = config.cloudflareWorkerUrl || config.baseUrl;
  const token = config.cloudflareToken;
  return {
    mode: "cloudflare",
    async syncCreateRecord(moduleKey, row) {
      if (!base) return;
      await postJson(`${base}/runtime/create`, token, { moduleKey, row });
    },
    async syncUpdateRecord(moduleKey, rowId, patch) {
      if (!base) return;
      await postJson(`${base}/runtime/update`, token, { moduleKey, rowId, patch });
    },
    async syncActionLog(payload) {
      if (!base) return;
      await postJson(`${base}/runtime/log`, token, payload);
    },
  };
}

let cached: MeDataProvider | null = null;

export function getMeDataProvider(): MeDataProvider {
  if (cached) return cached;
  const config = getMeApiConfig();
  if (config.provider === "supabase") {
    cached = createSupabaseProvider();
  } else if (config.provider === "wordpress") {
    cached = createWordpressProvider();
  } else if (config.provider === "cloudflare") {
    cached = createCloudflareProvider();
  } else {
    cached = createLocalProvider();
  }
  return cached;
}
