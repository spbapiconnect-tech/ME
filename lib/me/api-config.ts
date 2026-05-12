export type MeDataProviderMode = "local" | "supabase" | "wordpress" | "cloudflare";

export type MeApiConfig = {
  provider: MeDataProviderMode;
  baseUrl?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  wordpressUrl?: string;
  wordpressToken?: string;
  cloudflareWorkerUrl?: string;
  cloudflareToken?: string;
};

export function getMeApiConfig(): MeApiConfig {
  const provider = (process.env.NEXT_PUBLIC_ME_DATA_PROVIDER || "local") as MeDataProviderMode;
  return {
    provider,
    baseUrl: process.env.NEXT_PUBLIC_ME_API_BASE_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    wordpressToken: process.env.NEXT_PUBLIC_WORDPRESS_TOKEN,
    cloudflareWorkerUrl: process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL,
    cloudflareToken: process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN,
  };
}
