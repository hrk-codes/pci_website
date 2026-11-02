const DEFAULT_API_URL = "https://www.pcicablesindustries.com/wp-json/";

type WordPressSite = {
  name?: string;
};

type WordPressPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  link: string;
};

export type WordPressSnapshot = {
  siteName: string;
  pages: Array<{
    id: number;
    slug: string;
    title: string;
    link: string;
  }>;
};

function apiBaseUrl() {
  const configured = process.env.WORDPRESS_API_URL || DEFAULT_API_URL;
  const url = new URL(configured.endsWith("/") ? configured : `${configured}/`);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("WORDPRESS_API_URL must be an HTTP or HTTPS URL");
  }

  return url;
}

export async function getWordPressSnapshot(): Promise<WordPressSnapshot> {
  const base = apiBaseUrl();
  const pagesUrl = new URL("wp/v2/pages", base);
  pagesUrl.searchParams.set("per_page", "5");
  pagesUrl.searchParams.set("_fields", "id,slug,title,link");

  const [siteResponse, pagesResponse] = await Promise.all([
    fetch(base, { cache: "no-store", signal: AbortSignal.timeout(10000) }),
    fetch(pagesUrl, { cache: "no-store", signal: AbortSignal.timeout(10000) }),
  ]);

  if (!siteResponse.ok || !pagesResponse.ok) {
    throw new Error("WordPress REST API request failed");
  }

  const site = (await siteResponse.json()) as WordPressSite;
  const pages = (await pagesResponse.json()) as WordPressPage[];

  if (typeof site.name !== "string" || !Array.isArray(pages)) {
    throw new Error("WordPress REST API returned an unexpected response");
  }

  return {
    siteName: site.name,
    pages: pages.map((page) => ({
      id: page.id,
      slug: page.slug,
      title: page.title.rendered,
      link: page.link,
    })),
  };
}
