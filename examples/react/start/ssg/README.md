# react-start-ssg

A complete example demonstrating how to configure **Static Site Generation (SSG)** / **Static Prerendering** in a TanStack Start application integrating `@wadiou/tanstack-i18n` with `use-intl`.

## How it Works

Because internationalized routing involves dynamic parameters (e.g. `{-$locale}` which matches `/en`, `/ar`, etc.), standard automated route discovery in TanStack Start cannot identify all possible pages at build time. 

To solve this, we configure the prerenderer in `vite.config.ts` as follows:

1. **Prerender Seeding**: We explicitly specify the entry points for each language in the `pages` array: `[{ path: "/" }, { path: "/ar" }]`.
2. **Crawl Links**: With `crawlLinks: true` enabled, TanStack Start parses the HTML of these entry pages, extracts all local `<a>` links, and recursively adds them to the prerender queue. 
3. **Automatic Discovery**: Links like `/about` (English homepage link) and `/ar/about` (Arabic homepage link) are crawled automatically, resulting in a fully prerendered static site.

The final built assets are outputted as static HTML files to `.output/public/`.

## Running the Example

### 1. Dev Mode

Start the local development server:

```bash
pnpm --dir examples/react/start/ssg dev
```

Open [http://localhost:3000](http://localhost:3000).

### 2. Static Build (SSG)

Compile the application into static HTML assets:

```bash
pnpm --dir examples/react/start/ssg build
```

This runs the builder and prerenders all pages, producing the following structure in `.output/public`:

```text
.output/public/
├── index.html          # English Homepage
├── about/
│   └── index.html      # English About Page
└── ar/
    ├── index.html      # Arabic Homepage
    └── about/
        └── index.html  # Arabic About Page
```

### 3. Preview Static Output

Preview the statically generated site:

```bash
pnpm --dir examples/react/start/ssg preview
```

Open [http://localhost:3000](http://localhost:3000) to test the fully prerendered static site.
