# On-Site SEO Optimization — Design Spec

**Date:** 2026-05-08
**Site:** https://dralamdermcentre.com/
**Stack:** Static multi-page HTML, Vite build pipeline
**Target market:** Local — Erode, Tamil Nadu, India

---

## 1. Goals & Scope

Optimize the existing static site for on-site SEO with a focus on **local search rankings in Erode** and **rich-result eligibility** for medical/clinic queries. Out of scope: off-site SEO (link building, GBP optimization, citations), content rewriting, page redesigns.

The site currently has reasonable title tags, meta descriptions, H1s, and image alt text. Major gaps are: no structured data, no sitemap, no robots.txt, no canonical tags, no Open Graph or Twitter Card markup, no LCP preload.

This spec covers all six gaps in a single coordinated pass.

## 2. Confirmed Business Data

These values are reused across schema markup, sitemap, and meta tags. **Single source of truth — change here, propagate everywhere.**

| Field | Value |
|---|---|
| Legal name | Dr. Alam's Skin Hair Laser Clinic - Advanced Laser & Aesthetic Dermatology Centre |
| Short name | Dr. Alam's Skin Clinic |
| Domain | https://dralamdermcentre.com/ |
| Street address | 306, Nasiyanur Road, Narayanavalasu |
| City | Erode |
| State | Tamil Nadu |
| Postal code | 638011 |
| Country | IN |
| Phone | +91-93454-10038 |
| Latitude | 11.343498 |
| Longitude | 77.7035454 |
| Hours | All days (Mon–Sun), 10:00–21:00 |
| Physician | Dr. Howthul Alam Raja |
| Specialty | Dermatology |
| sameAs | https://maps.app.goo.gl/ABuVMbpvPjcpSbBt6, https://www.facebook.com/p/Dr-Alams-Skin-Clinic-61574087517804, https://youtube.com/@drhowthulalam, https://www.instagram.com/dr_alam_dermatologist |

## 3. Page Inventory & Canonicalization

The site has duplicate service pages (top-level + `services/`). **Top-level is canonical**; the `services/*` versions get canonical tags pointing to the top-level URL and are excluded from the sitemap.

### Canonical pages (in sitemap)

| File | Canonical URL | Priority | Changefreq |
|---|---|---|---|
| `index.html` | `https://dralamdermcentre.com/` | 1.0 | weekly |
| `services.html` | `https://dralamdermcentre.com/services.html` | 0.9 | monthly |
| `contact.html` | `https://dralamdermcentre.com/contact.html` | 0.9 | monthly |
| `acne-scars.html` | `https://dralamdermcentre.com/acne-scars.html` | 0.8 | monthly |
| `pigmentation.html` | `https://dralamdermcentre.com/pigmentation.html` | 0.8 | monthly |
| `hair-loss.html` | `https://dralamdermcentre.com/hair-loss.html` | 0.8 | monthly |
| `laser-hair-removal.html` | `https://dralamdermcentre.com/laser-hair-removal.html` | 0.8 | monthly |
| `dermatosurgery.html` | `https://dralamdermcentre.com/dermatosurgery.html` | 0.8 | monthly |
| `clinical-dermatology.html` | `https://dralamdermcentre.com/clinical-dermatology.html` | 0.8 | monthly |
| `about.html` | `https://dralamdermcentre.com/about.html` | 0.7 | monthly |
| `results.html` | `https://dralamdermcentre.com/results.html` | 0.7 | monthly |
| `blog.html` | `https://dralamdermcentre.com/blog.html` | 0.6 | monthly |
| `technology.html` | `https://dralamdermcentre.com/technology.html` | 0.6 | monthly |

### Non-canonical pages (excluded from sitemap)

| File | Canonical points to |
|---|---|
| `services/acne.html` | `https://dralamdermcentre.com/acne-scars.html` |
| `services/pigmentation.html` | `https://dralamdermcentre.com/pigmentation.html` |
| `services/hair-loss.html` | `https://dralamdermcentre.com/hair-loss.html` |
| `services/laser-hair-removal.html` | `https://dralamdermcentre.com/laser-hair-removal.html` |
| `services/dermatosurgery.html` | `https://dralamdermcentre.com/dermatosurgery.html` |
| `services/clinical-dermatology.html` | `https://dralamdermcentre.com/clinical-dermatology.html` |
| `snake.html` | excluded entirely; gets `<meta name="robots" content="noindex, nofollow">` |

## 4. Per-Page `<head>` Additions

Each canonical HTML page receives this block, inserted directly below the existing `<meta name="description">`. Values vary per page; structure is identical.

```html
<!-- Canonical -->
<link rel="canonical" href="{{canonical_url}}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dr. Alam's Skin Clinic">
<meta property="og:locale" content="en_IN">
<meta property="og:title" content="{{page_title}}">
<meta property="og:description" content="{{page_description}}">
<meta property="og:url" content="{{canonical_url}}">
<meta property="og:image" content="https://dralamdermcentre.com/images/og-default.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{page_title}}">
<meta name="twitter:description" content="{{page_description}}">
<meta name="twitter:image" content="https://dralamdermcentre.com/images/og-default.jpg">
```

Non-canonical `services/*` pages get only the `<link rel="canonical">` (pointing to the top-level URL). `snake.html` gets only `<meta name="robots" content="noindex, nofollow">`.

### Open Graph image

Create `images/og-default.jpg` (1200×630 px, branded composite). Until that asset exists, the OG/Twitter `image` URLs reference `images/hero-slide-1.jpg` directly so the tag is valid; swap in `og-default.jpg` when designed.

## 5. JSON-LD Structured Data

Inserted as `<script type="application/ld+json">` blocks at the end of `<head>` on the indicated pages.

### 5.1 MedicalClinic — `index.html` and `contact.html`

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": "https://dralamdermcentre.com/#clinic",
  "name": "Dr. Alam's Skin Hair Laser Clinic - Advanced Laser & Aesthetic Dermatology Centre",
  "alternateName": "Dr. Alam's Skin Clinic",
  "image": "https://dralamdermcentre.com/images/logo.png",
  "url": "https://dralamdermcentre.com/",
  "telephone": "+91-93454-10038",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "306, Nasiyanur Road, Narayanavalasu",
    "addressLocality": "Erode",
    "addressRegion": "Tamil Nadu",
    "postalCode": "638011",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 11.343498,
    "longitude": 77.7035454
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "10:00",
    "closes": "21:00"
  }],
  "medicalSpecialty": "Dermatologic",
  "sameAs": [
    "https://maps.app.goo.gl/ABuVMbpvPjcpSbBt6",
    "https://www.facebook.com/p/Dr-Alams-Skin-Clinic-61574087517804",
    "https://youtube.com/@drhowthulalam",
    "https://www.instagram.com/dr_alam_dermatologist"
  ],
  "physician": {
    "@type": "Physician",
    "name": "Dr. Howthul Alam Raja",
    "medicalSpecialty": "Dermatologic"
  }
}
```

`index.html` additionally includes a `WebSite` schema with `SearchAction` for site-search rich results (optional, low cost).

### 5.2 MedicalProcedure — service pages

Each service page gets a `MedicalProcedure` schema linked back to the clinic via `@id` reference:

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  "name": "{{service-specific name}}",
  "description": "{{2–3 sentence procedure description}}",
  "procedureType": "https://schema.org/TherapeuticProcedure",
  "bodyLocation": "{{e.g., Skin, Scalp, Face}}",
  "provider": { "@id": "https://dralamdermcentre.com/#clinic" }
}
```

Service-to-name mapping:
| Page | `name` |
|---|---|
| `acne-scars.html` | "Acne and Acne Scar Treatment" |
| `pigmentation.html` | "Pigmentation Treatment (Melasma, Dark Spots)" |
| `hair-loss.html` | "Hair Loss Treatment" |
| `laser-hair-removal.html` | "Laser Hair Removal" |
| `dermatosurgery.html` | "Dermatosurgery (Mole, Wart, Cyst Removal)" |
| `clinical-dermatology.html` | "Clinical Dermatology Consultation" |

### 5.3 Physician — `about.html`

```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. Howthul Alam Raja",
  "medicalSpecialty": "Dermatologic",
  "worksFor": { "@id": "https://dralamdermcentre.com/#clinic" }
}
```

### 5.4 ItemList — `services.html`

A `services.html` `ItemList` schema enumerating the six service pages. Improves discovery of service pages from a hub page.

## 6. New Root Files

### `/robots.txt`

```
User-agent: *
Allow: /
Disallow: /snake.html

Sitemap: https://dralamdermcentre.com/sitemap.xml
```

### `/sitemap.xml`

Standard XML sitemap listing the 13 canonical URLs from §3 with `<lastmod>` set to the deployment date and `<changefreq>` / `<priority>` per the table above.

## 7. Performance — LCP Preload

Single addition to `index.html`, in `<head>` immediately after the stylesheet preconnects:

```html
<link rel="preload" as="image" href="images/hero-slide-1.jpg" fetchpriority="high">
```

This is the homepage's Largest Contentful Paint candidate. Preloading it improves LCP, which is a Core Web Vitals ranking signal.

## 8. Build Integration

`vite.config.js` currently has a `copyFoldersPlugin` that copies named folders into `dist/`. Extend it to also copy two root files:

```js
const filesToCopy = ['robots.txt', 'sitemap.xml'];
for (const file of filesToCopy) {
  const src = resolve(__dirname, file);
  const dest = resolve(__dirname, 'dist', file);
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
}
```

This keeps both files reachable at the correct origin paths after build.

## 9. Validation Plan

After deploy, run each of these checks. None of them should produce errors before we consider the work complete.

1. **Google Rich Results Test** (search.google.com/test/rich-results) — paste each canonical URL; confirm MedicalClinic, MedicalProcedure, Physician schemas all validate with no errors or warnings.
2. **Schema.org validator** (validator.schema.org) — backup syntactic check for all JSON-LD blocks.
3. **Facebook Sharing Debugger** (developers.facebook.com/tools/debug/) — paste homepage + one service page; confirm OG preview renders with image, title, description.
4. **Twitter Card Validator** — confirm `summary_large_image` card renders correctly.
5. **Google Search Console** — submit `https://dralamdermcentre.com/sitemap.xml`; confirm "Success" status and 13 URLs discovered.
6. **Lighthouse SEO audit** — on `index.html` and one service page; SEO score must be ≥95.

## 10. Out of Scope

The following are deliberately not part of this spec:

- Title tag and meta description rewriting (current ones are reasonable)
- Image alt-text audit (current alts are descriptive)
- Heading hierarchy refactoring
- Content/copy improvements
- Internal linking strategy
- Backlink building, citations, GBP optimization
- Tamil-language hreflang variants (target market is local Erode; English is sufficient)
- Twitter Card profile (`twitter:site` handle) — clinic does not currently have an X/Twitter account

## 11. Follow-Ups (Post-Implementation)

- **Open Graph image asset** — implementation references `images/hero-slide-1.jpg` as the `og:image`. Design a dedicated 1200×630 branded social card (`images/og-default.jpg`) and swap in the URL when ready.
