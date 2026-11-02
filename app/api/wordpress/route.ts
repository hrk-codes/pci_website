import { getWordPressSnapshot } from "@/lib/wordpress";

export async function GET() {
  try {
    const wordpress = await getWordPressSnapshot();
    return Response.json({ connected: true, ...wordpress });
  } catch {
    return Response.json(
      {
        connected: false,
        error: "WordPress is unreachable. Check WORDPRESS_API_URL and the REST API.",
      },
      { status: 503 },
    );
  }
}
