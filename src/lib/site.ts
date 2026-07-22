const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL;

export const siteUrl = configuredUrl
  ? configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`
  : "http://localhost:3000";
