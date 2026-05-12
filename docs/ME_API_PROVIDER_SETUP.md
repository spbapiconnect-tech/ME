# ME API Provider Setup

ME runtime now supports pluggable providers for command/data sync:

- `local` (default)
- `supabase`
- `wordpress`
- `cloudflare`

## Environment variables

Set these in your runtime environment:

- `NEXT_PUBLIC_ME_DATA_PROVIDER=local|supabase|wordpress|cloudflare`
- `NEXT_PUBLIC_ME_API_BASE_URL=` optional generic base URL

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL=`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=`

Expected endpoints (Edge Functions):
- `POST /functions/v1/me-runtime-create`
- `POST /functions/v1/me-runtime-update`
- `POST /functions/v1/me-runtime-log`

### WordPress
- `NEXT_PUBLIC_WORDPRESS_API_URL=`
- `NEXT_PUBLIC_WORDPRESS_TOKEN=` optional bearer token

Expected endpoints:
- `POST /wp-json/me/v1/runtime/create`
- `POST /wp-json/me/v1/runtime/update`
- `POST /wp-json/me/v1/runtime/log`

### Cloudflare Worker
- `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=`
- `NEXT_PUBLIC_CLOUDFLARE_API_TOKEN=` optional bearer token

Expected endpoints:
- `POST /runtime/create`
- `POST /runtime/update`
- `POST /runtime/log`

## Runtime behavior

- UI updates optimistically first.
- Commands then sync to provider.
- Sync state appears in module pages as: `Sync: idle|syncing|ok|error`.
- Failed sync keeps local state and surfaces error message.
