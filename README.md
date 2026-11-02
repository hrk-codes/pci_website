# PCI Cables Website

This folder contains the new Next.js website workspace. The existing WordPress site remains the content and admin backend.

## Start the local website

In VS Code, choose **Terminal → Run Task → PCI: Start website and API**. This starts the Next.js development server, including its server-side API routes, at <http://localhost:3000>.

You can also use a PowerShell terminal:

```powershell
cd C:\htdocs\pci-web
npm.cmd run dev
```

PowerShell may block `npm.ps1` under its script execution policy. `npm.cmd` starts the same npm command without changing that policy. Open <http://localhost:3000> and visit <http://localhost:3000/api/wordpress> to check the connection. Press Ctrl+C to stop the server.

## WordPress connection

The frontend reads published content from the public PCI Cables WordPress REST API at <https://www.pcicablesindustries.com/wp-json/>. Requests run on the Next.js server, so no WordPress credentials are needed for published content.

To use another WordPress installation, set `WORDPRESS_API_URL` to its `/wp-json/` URL before starting Next.js. For example, after a local WordPress database has been restored and Apache serves the site:

```powershell
$env:WORDPRESS_API_URL = "http://localhost/pcicables/wp-json/"
npm.cmd run dev
```

The local WordPress files are currently at `C:\htdocs\pcicables`, outside XAMPP's configured `C:\xampp\htdocs` document root, and the PCI database is absent. A current database backup and Apache configuration are needed for a working local WordPress copy. Keep form submissions on private staging.

## Review commands

- **Terminal → Run Task → PCI: Check code** runs ESLint.
- **Terminal → Run Task → PCI: Build check** checks the production build.
- Code Runner is configured to send one-off file runs to the integrated terminal. Use the website task to keep the development server running and show its logs.

