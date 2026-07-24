const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://victoriamitsu.com";

export const siteUrl = (
  configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`
).replace(/\/$/, "");
