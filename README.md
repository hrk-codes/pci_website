# PCI Cables website

This project runs the public PCI Cables site and Payload CMS in one Next.js process. Published pages, products, posts, and media are served from local SQLite and local uploads. WordPress is used only by the optional import command.

## Website design and content

The public site follows the visual structure reviewed in the Dynamic Cables screen recording, using only PCI Cables text, product records, client logos, photos, and videos. The homepage layout is in `components/home.tsx`; shared page layouts are in `components/site-pages.tsx`; public styles are in `app/(frontend)/globals.css`. The CMS admin styling is separate.

The content source is `data/pci.db`, with uploaded files in `data/media/`. Both stay under `C:\htdocs\pci-web\data` and are excluded from Git. To change page text, product details, client media, or the PCI logo later, use `/admin/`. Selected homepage images and the homepage video are currently chosen from the imported PCI media by filename in `components/home.tsx`; update those selections when new media is supplied. Homepage facts use the imported achievements and product records, so replace them with verified PCI figures when new numbers are available.

## Start in a Windows terminal

```powershell
cd C:\htdocs\pci-web
npm.cmd install
npm.cmd run dev
```

Open [the website](http://localhost:3000/) or [the CMS admin](http://localhost:3000/admin/). Stop the server with **Ctrl+C**. There is no separate backend command. In VS Code, **Terminal → Run Task → PCI: Start website and API** starts the same process.

The existing local `.env.local`, SQLite database, and imported uploads are already set up on this machine. They are ignored by Git. For a fresh checkout, copy `.env.example` to `.env.local`, replace `PAYLOAD_SECRET` with a long random value, and run `npm.cmd run import:wordpress` once before starting the site. The import reads the public WordPress API, records source IDs, saves media locally, and can be rerun without duplicating records. Rerunning it updates imported page and product fields, so review CMS edits before reimporting.

## CMS

Visit `/admin/` and create the first admin account with your own email and password. There are no admin credentials in the repository. Editors can publish drafts for pages, products, and posts, upload media, update site settings, and review private form submissions.

The contact and vendor registration forms save submissions in Payload. Until SMTP is configured, the on-screen result says the submission was saved and email is pending. To enable notifications to `info@pcicablesindustries.com`, add these values to `.env.local` and restart the server:

```text
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

Use the SMTP host, port, username, password or app password, and sender address from your existing email service. The site marks each submission `sent` only after the mail server accepts it; failures remain saved with `failed` status.

## Checks

With the server running, these commands verify the imported content, routes, and local files:

```powershell
npm.cmd run verify:content
npm.cmd run lint
node node_modules/typescript/bin/tsc --noEmit
npm.cmd run build
```

The database and uploads live under `data/` and must be backed up separately. A new clone needs a fresh import or a secure transfer of that directory. Live deployment and domain changes are not part of this repository handoff.
