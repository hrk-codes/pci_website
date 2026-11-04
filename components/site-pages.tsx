import Link from "next/link";
import { ClientShowcase } from "@/components/client-showcase";
import { MediaImage } from "@/components/media";
import { MilestoneTimeline } from "@/components/milestone-timeline";
import { SubmissionForm } from "@/components/submission-form";
import {
  clientGroups,
  findMedia,
  milestonesFromContent,
} from "@/lib/presentation";
import {
  mediaUrl,
  mediaValue,
  richTextHtml,
  type MediaAsset,
  type PageRecord,
  type PostRecord,
  type ProductRecord,
} from "@/lib/site-data";

export function PageHero({
  title,
  eyebrow,
  summary,
  media,
}: {
  title: string;
  eyebrow?: string | null;
  summary?: string | null;
  media?: MediaAsset | null;
}) {
  return (
    <section className="page-hero">
      <MediaImage media={media} alt="" eager size="hero" />
      <div className="page-hero-overlay" />
      <div className="shell page-hero-content">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </div>
        <p className="kicker light">{eyebrow || "PCI Cables Industries"}</p>
        <h1>{title}</h1>
        {summary && <p className="page-hero-summary">{summary}</p>}
      </div>
    </section>
  );
}

export function RichContent({
  value,
  summary,
}: {
  value?: PageRecord["body"];
  summary?: string | null;
}) {
  const html = richTextHtml(value, summary);
  return html ? (
    <div className="rich-content" dangerouslySetInnerHTML={{ __html: html }} />
  ) : null;
}

export function ProductListing({ products }: { products: ProductRecord[] }) {
  return (
    <div className="listing-grid">
      {products.map((product) => (
        <Link
          href={`/products/${product.slug}/`}
          className="listing-card"
          key={product.id}
        >
          <div className="listing-card-image">
            <MediaImage
              media={mediaValue(product.image)}
              alt={product.title}
              size="card"
            />
          </div>
          <div className="listing-card-body">
            <p className="kicker">{product.category.replace("-", " ")}</p>
            <h3>{product.title}</h3>
            {product.summary && <p>{product.summary}</p>}
            <span className="card-link">View product ↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PostListing({ posts }: { posts: PostRecord[] }) {
  return (
    <div className="listing-grid">
      {posts.map((post) => (
        <Link
          href={`/news/${post.slug}/`}
          className="listing-card"
          key={post.id}
        >
          <div className="listing-card-image">
            <MediaImage
              media={mediaValue(post.heroMedia)}
              alt={post.title}
              size="card"
            />
          </div>
          <div className="listing-card-body">
            <p className="kicker">
              {post.publishedAt
                ? new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                  }).format(new Date(post.publishedAt))
                : "PCI update"}
            </p>
            <h3>{post.title}</h3>
            {post.summary && <p>{post.summary}</p>}
            <span className="card-link">Read story ↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PageGallery({
  media,
  title,
}: {
  media: MediaAsset[];
  title?: string;
}) {
  if (!media.length) return null;
  return (
    <div className="media-grid">
      {media.map((item) => (
        <figure className="media-card" key={item.id}>
          {item.mimeType?.startsWith("video/") ? (
            <video
              controls
              preload="none"
              playsInline
              src={mediaUrl(item)}
              aria-label={item.title || "PCI video"}
            />
          ) : item.mimeType === "application/pdf" ? (
            <a
              className="download-link"
              href={mediaUrl(item) || "#"}
              target="_blank"
              rel="noreferrer"
            >
              Open {item.title || item.filename || "PDF"}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <MediaImage
              media={item}
              alt={item.alt || item.title || title || ""}
              size="card"
            />
          )}
          {item.mimeType !== "application/pdf" && (
            <figcaption>{item.title || item.filename}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

function ContactDetails({ vendor }: { vendor: boolean }) {
  return (
    <div className="contact-details">
      <div>
        <span>01 / Email</span>
        <h3>Write to us</h3>
        <a href="mailto:info@pcicablesindustries.com">
          info@pcicablesindustries.com ↗
        </a>
      </div>
      <div>
        <span>02 / Phone</span>
        <h3>{vendor ? "Purchase team" : "Sales & marketing"}</h3>
        <a href={vendor ? "tel:+919062207005" : "tel:+919062207003"}>
          {vendor ? "+91 90622 07005" : "+91 90622 07003"} ↗
        </a>
      </div>
      <div>
        <span>03 / Visit</span>
        <h3>Office & works</h3>
        <p>
          Om Complex, Monber Sastitala, Beneras Road, PO-Mrigola, Dankuni,
          Hooghly 712311, West Bengal, India.
        </p>
      </div>
    </div>
  );
}

export function PageBody({
  page,
  products,
  posts,
  archiveMedia = [],
}: {
  page: PageRecord;
  products?: ProductRecord[];
  posts?: PostRecord[];
  archiveMedia?: MediaAsset[];
}) {
  let gallery = (page.gallery || [])
    .map((item) => mediaValue(item))
    .filter((item): item is MediaAsset => Boolean(item));
  if (page.slug === "gallery")
    gallery = archiveMedia.filter(
      (item) =>
        /^(image-\d+|media-[1-3]|elecrama-\d+)\.(jpe?g|mp4)$/i.test(
          item.filename || "",
        ) || item.mimeType === "video/mp4",
    );
  if (page.slug === "certificates")
    gallery = archiveMedia.filter((item) => /^ISO-/i.test(item.filename || ""));
  if (page.slug === "press-releases")
    gallery = archiveMedia.filter((item) =>
      /^EP-Info/i.test(item.filename || ""),
    );
  const isContact = page.slug === "contact-us";
  const isVendor = page.slug === "vendor-registration";
  const isProductPage = [
    "products",
    "cables",
    "conductors",
    "earth-wire",
  ].includes(page.slug);
  const isNews = ["news", "blog", "press-releases"].includes(page.slug);

  return (
    <>
      <PageHero
        title={page.title}
        eyebrow={page.eyebrow}
        summary={page.summary}
        media={mediaValue(page.heroMedia)}
      />
      {isContact || isVendor ? (
        <section className="page-section section-pad ambient-surface">
          <div className="shell contact-page-grid">
            <div className="contact-page-copy">
              <p className="kicker">Connect with PCI</p>
              <h2>Let&apos;s get your project moving.</h2>
              <p>{page.summary}</p>
              <ContactDetails vendor={isVendor} />
            </div>
            <SubmissionForm
              type={isVendor ? "vendor-registration" : "contact"}
            />
          </div>
        </section>
      ) : null}

      {page.slug === "about-us" && (
        <section className="page-section section-pad ambient-surface">
          <div className="shell about-page-grid">
            <div className="about-page-image">
              <MediaImage
                media={
                  findMedia(archiveMedia, "image-03.jpg") ||
                  mediaValue(page.heroMedia)
                }
                alt="PCI Cables manufacturing facility"
                size="hero"
              />
            </div>
            <div>
              <p className="kicker">Our company</p>
              <h2>Manufacturing with purpose.</h2>
              <RichContent value={page.body} summary={page.summary} />
            </div>
          </div>
        </section>
      )}

      {page.slug === "achievements" && (
        <section className="page-section section-pad ambient-surface">
          <div className="shell">
            <div className="center-heading">
              <p className="kicker">Our journey</p>
              <h2>Milestones that matter.</h2>
              <p>{page.summary}</p>
            </div>
            <MilestoneTimeline milestones={milestonesFromContent(page.body)} />
          </div>
        </section>
      )}

      {page.slug === "clients" && (
        <section className="page-section section-pad ambient-surface">
          <div className="shell">
            <div className="center-heading">
              <p className="kicker">Our connections</p>
              <h2>Organizations we have worked with.</h2>
              <p>{page.summary}</p>
            </div>
            <ClientShowcase groups={clientGroups(archiveMedia)} />
          </div>
        </section>
      )}

      {isProductPage && products && (
        <section className="page-section section-pad ambient-surface">
          <div className="shell">
            <div className="page-intro">
              <p className="kicker">PCI product range</p>
              <h2>Find the right connection.</h2>
              <p>{page.summary}</p>
            </div>
            {page.slug === "products" ? (
              <>
                {(["cables", "conductors", "earth-wire"] as const).map(
                  (category) => {
                    const subset = products.filter(
                      (product) => product.category === category,
                    );
                    return subset.length ? (
                      <div className="product-category" key={category}>
                        <div className="category-heading">
                          <span>{category.replace("-", " ")}</span>
                          <span>
                            {String(subset.length).padStart(2, "0")} products
                          </span>
                        </div>
                        <ProductListing products={subset} />
                      </div>
                    ) : null;
                  },
                )}
              </>
            ) : (
              <ProductListing products={products} />
            )}
          </div>
        </section>
      )}

      {isNews && posts && (
        <section className="page-section section-pad ambient-surface">
          <div className="shell">
            <div className="page-intro">
              <p className="kicker">Stories from PCI</p>
              <h2>Updates from our world.</h2>
            </div>
            <PostListing posts={posts} />
            {gallery.length > 0 && (
              <div className="page-extra">
                <PageGallery media={gallery} title={page.title} />
              </div>
            )}
          </div>
        </section>
      )}

      {page.slug === "gallery" && (
        <section className="page-section section-pad ambient-surface">
          <div className="shell">
            <div className="page-intro">
              <p className="kicker">PCI archive</p>
              <h2>Inside our world.</h2>
              <p>{page.summary}</p>
            </div>
            <PageGallery media={gallery} title={page.title} />
          </div>
        </section>
      )}

      {!isContact &&
        !isVendor &&
        page.slug !== "about-us" &&
        page.slug !== "achievements" &&
        page.slug !== "clients" &&
        !isProductPage &&
        !isNews &&
        page.slug !== "gallery" && (
          <section className="page-section section-pad ambient-surface">
            <div className="shell content-layout">
              <div>
                <p className="kicker">PCI Cables Industries</p>
                <RichContent value={page.body} summary={page.summary} />
                {gallery.length > 0 && (
                  <div className="page-extra">
                    <h2>Explore further</h2>
                    <PageGallery media={gallery} title={page.title} />
                  </div>
                )}
              </div>
              <aside className="content-aside">
                <h3>Explore more</h3>
                <Link href="/products/">Products ↗</Link>
                <Link href="/testing/">Testing facilities ↗</Link>
                <Link href="/contact-us/">Contact us ↗</Link>
              </aside>
            </div>
          </section>
        )}
    </>
  );
}
