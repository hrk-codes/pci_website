import { Suspense } from "react";
import { getWordPressSnapshot } from "@/lib/wordpress";

async function WordPressConnection() {
  const wordpress = await getWordPressSnapshot().catch(() => null);

  if (!wordpress) {
    return (
      <section className="mt-8 rounded-xl border border-red-300 bg-red-50 p-6 text-red-950">
        <p className="font-semibold">WordPress connection unavailable</p>
        <p className="mt-2 text-sm">
          Check WORDPRESS_API_URL and confirm that its /wp-json/ endpoint responds.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-xl border border-green-300 bg-green-50 p-6 text-green-950">
      <p className="font-semibold">Connected to {wordpress.siteName}</p>
      <p className="mt-2 text-sm">Published pages received from WordPress:</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {wordpress.pages.map((page) => (
          <li key={page.id}>{page.title}</li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 text-zinc-950">
      <h1 className="text-3xl font-bold">PCI Cables website</h1>
      <p className="mt-3 text-zinc-700">
        The frontend is running. WordPress supplies the site content through its REST API.
      </p>
      <Suspense fallback={<p className="mt-8">Checking WordPress connection…</p>}>
        <WordPressConnection />
      </Suspense>
      <p className="mt-6 text-sm text-zinc-600">
        Connection details: <a className="underline" href="/api/wordpress">/api/wordpress</a>
      </p>
    </main>
  );
}
