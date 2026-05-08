# On-Site SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add structured data, sitemap, robots.txt, canonical tags, Open Graph / Twitter Card meta, and an LCP preload across the static HTML site to maximize local-Erode SEO and rich-result eligibility.

**Architecture:** Pure additions to existing HTML `<head>` blocks plus two new root files (`robots.txt`, `sitemap.xml`) and a tiny `vite.config.js` extension to ship them. No JS/CSS/build changes beyond the file copy plugin.

**Tech Stack:** Static HTML, Vite 8 build, JSON-LD schema.org markup. **No test framework exists** — verification is via grep-based content checks plus `npm run build` and post-deploy validators (Google Rich Results Test, Lighthouse).

**Spec:** `docs/superpowers/specs/2026-05-08-on-site-seo-design.md`

---

## File Inventory

**New files:**
- `robots.txt` (root)
- `sitemap.xml` (root)

**Modified files:**
- `vite.config.js` — extend `copyFoldersPlugin` to copy the two new root files
- 13 canonical HTML pages — full SEO meta block + (where applicable) JSON-LD schema
- 6 `services/*` HTML pages — canonical tag only (pointing to top-level)
- `snake.html` — `noindex` robots meta

**Reusable insertion pattern for HTML edits:**
Most edits insert content immediately after the closing `>` of `<meta name="description" content="...">` and before the first `<link rel="stylesheet">`. Use the Edit tool with the meta description's closing line plus the next line as `old_string`, and the same content with the new block injected as `new_string`.

---

## Task 1: index.html — Full SEO meta + LCP preload + MedicalClinic + WebSite schema

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the SEO meta block, LCP preload, and JSON-LD schema after the meta description**

Use the Edit tool. `old_string`:
```
    <meta name="description"
        content="Advanced dermatology, laser and skin surgery treatments in Erode specializing in acne scars, pigmentation, hair loss, laser hair removal and clinical dermatology.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description"
        content="Advanced dermatology, laser and skin surgery treatments in Erode specializing in acne scars, pigmentation, hair loss, laser hair removal and clinical dermatology.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Dr. Alam's Skin Clinic | Advanced Dermatology & Laser Surgery">
    <meta property="og:description" content="Advanced dermatology, laser and skin surgery treatments in Erode specializing in acne scars, pigmentation, hair loss, laser hair removal and clinical dermatology.">
    <meta property="og:url" content="https://dralamdermcentre.com/">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Dr. Alam's Skin Clinic | Advanced Dermatology & Laser Surgery">
    <meta name="twitter:description" content="Advanced dermatology, laser and skin surgery treatments in Erode specializing in acne scars, pigmentation, hair loss, laser hair removal and clinical dermatology.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">

    <!-- LCP preload -->
    <link rel="preload" as="image" href="images/hero-slide-1.jpg" fetchpriority="high">

    <!-- JSON-LD: MedicalClinic -->
    <script type="application/ld+json">
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
    </script>

    <!-- JSON-LD: WebSite -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://dralamdermcentre.com/",
      "name": "Dr. Alam's Skin Clinic",
      "publisher": { "@id": "https://dralamdermcentre.com/#clinic" }
    }
    </script>

    <link rel="stylesheet" href="styles/variables.css">
```

- [ ] **Step 2: Verify the additions are present**

Run: `Grep` for `og:url|application/ld\+json|MedicalClinic|preload` in `index.html` (use the Grep tool, output_mode=count).
Expected: at least 4 matches across those patterns; `MedicalClinic` should match exactly once.

- [ ] **Step 3: Validate JSON-LD syntactically by running build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "seo: add canonical, OG/Twitter, JSON-LD MedicalClinic+WebSite, LCP preload to homepage"
```

---

## Task 2: contact.html — SEO meta + MedicalClinic schema

**Files:**
- Modify: `contact.html`

- [ ] **Step 1: Insert SEO meta block + JSON-LD MedicalClinic after the meta description**

`old_string`:
```
    <meta name="description"
        content="Book your appointment at Dr. Alam's Skin Clinic for specialized acne, hair loss, laser, and skin surgery treatments. Contact us via Phone, WhatsApp, or our online form.">

    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description"
        content="Book your appointment at Dr. Alam's Skin Clinic for specialized acne, hair loss, laser, and skin surgery treatments. Contact us via Phone, WhatsApp, or our online form.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/contact.html">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Book Consultation | Contact Dr. Alam's Skin Clinic Erode">
    <meta property="og:description" content="Book your appointment at Dr. Alam's Skin Clinic for specialized acne, hair loss, laser, and skin surgery treatments. Contact us via Phone, WhatsApp, or our online form.">
    <meta property="og:url" content="https://dralamdermcentre.com/contact.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Book Consultation | Contact Dr. Alam's Skin Clinic Erode">
    <meta name="twitter:description" content="Book your appointment at Dr. Alam's Skin Clinic for specialized acne, hair loss, laser, and skin surgery treatments. Contact us via Phone, WhatsApp, or our online form.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">

    <!-- JSON-LD: MedicalClinic -->
    <script type="application/ld+json">
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
    </script>

    <link rel="stylesheet" href="styles/variables.css">
```

- [ ] **Step 2: Verify**

Grep `contact.html` for `MedicalClinic` (count=1) and `og:url` (count=1).

- [ ] **Step 3: Build**

Run: `npm run build`. Expected: success.

- [ ] **Step 4: Commit**

```bash
git add contact.html
git commit -m "seo: add canonical, OG/Twitter, JSON-LD MedicalClinic to contact page"
```

---

## Task 3: about.html — SEO meta + Physician schema

**Files:**
- Modify: `about.html`

- [ ] **Step 1: Insert SEO meta block + JSON-LD Physician after the meta description**

`old_string`:
```
    <meta name="description"
        content="Meet Dr. Howthul Alam Raja, a leading consultant dermatologist and dermatosurgeon in Erode. Specialist in medical dermatology, laser treatments, and skin surgery.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description"
        content="Meet Dr. Howthul Alam Raja, a leading consultant dermatologist and dermatosurgeon in Erode. Specialist in medical dermatology, laser treatments, and skin surgery.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/about.html">

    <!-- Open Graph -->
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="About Dr. Alam | Dr. Alam's Skin Clinic Erode">
    <meta property="og:description" content="Meet Dr. Howthul Alam Raja, a leading consultant dermatologist and dermatosurgeon in Erode. Specialist in medical dermatology, laser treatments, and skin surgery.">
    <meta property="og:url" content="https://dralamdermcentre.com/about.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/dr-alam.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="About Dr. Alam | Dr. Alam's Skin Clinic Erode">
    <meta name="twitter:description" content="Meet Dr. Howthul Alam Raja, a leading consultant dermatologist and dermatosurgeon in Erode. Specialist in medical dermatology, laser treatments, and skin surgery.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/dr-alam.png">

    <!-- JSON-LD: Physician -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Physician",
      "name": "Dr. Howthul Alam Raja",
      "image": "https://dralamdermcentre.com/images/dr-alam.png",
      "url": "https://dralamdermcentre.com/about.html",
      "medicalSpecialty": "Dermatologic",
      "worksFor": { "@id": "https://dralamdermcentre.com/#clinic" }
    }
    </script>

    <link rel="stylesheet" href="styles/variables.css">
```

- [ ] **Step 2: Verify**

Grep `about.html` for `"@type": "Physician"` (count=1).

- [ ] **Step 3: Build**

Run: `npm run build`. Expected: success.

- [ ] **Step 4: Commit**

```bash
git add about.html
git commit -m "seo: add canonical, OG/Twitter, JSON-LD Physician to about page"
```

---

## Task 4: services.html — SEO meta + ItemList schema

**Files:**
- Modify: `services.html`

- [ ] **Step 1: Insert SEO meta block + JSON-LD ItemList after the meta description**

`old_string`:
```
    <meta name="description" content="Discover professional dermatology treatments in Erode. Advanced solutions for Acne, Pigmentation, Hair Loss, and Precision Skin Surgery.">
    
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description" content="Discover professional dermatology treatments in Erode. Advanced solutions for Acne, Pigmentation, Hair Loss, and Precision Skin Surgery.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/services.html">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Comprehensive Dermatology & Skin Surgery | Dr. Alam's Skin Clinic">
    <meta property="og:description" content="Discover professional dermatology treatments in Erode. Advanced solutions for Acne, Pigmentation, Hair Loss, and Precision Skin Surgery.">
    <meta property="og:url" content="https://dralamdermcentre.com/services.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Comprehensive Dermatology & Skin Surgery | Dr. Alam's Skin Clinic">
    <meta name="twitter:description" content="Discover professional dermatology treatments in Erode. Advanced solutions for Acne, Pigmentation, Hair Loss, and Precision Skin Surgery.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">

    <!-- JSON-LD: ItemList of services -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "url": "https://dralamdermcentre.com/acne-scars.html", "name": "Acne and Acne Scar Treatment" },
        { "@type": "ListItem", "position": 2, "url": "https://dralamdermcentre.com/pigmentation.html", "name": "Pigmentation Treatment" },
        { "@type": "ListItem", "position": 3, "url": "https://dralamdermcentre.com/hair-loss.html", "name": "Hair Loss Treatment" },
        { "@type": "ListItem", "position": 4, "url": "https://dralamdermcentre.com/laser-hair-removal.html", "name": "Laser Hair Removal" },
        { "@type": "ListItem", "position": 5, "url": "https://dralamdermcentre.com/dermatosurgery.html", "name": "Dermatosurgery" },
        { "@type": "ListItem", "position": 6, "url": "https://dralamdermcentre.com/clinical-dermatology.html", "name": "Clinical Dermatology" }
      ]
    }
    </script>
    
    <link rel="stylesheet" href="styles/variables.css">
```

- [ ] **Step 2: Verify**

Grep `services.html` for `"@type": "ItemList"` (count=1).

- [ ] **Step 3: Build**

Run: `npm run build`. Expected: success.

- [ ] **Step 4: Commit**

```bash
git add services.html
git commit -m "seo: add canonical, OG/Twitter, JSON-LD ItemList to services hub page"
```

---

## Task 5: 6 canonical service pages — SEO meta + MedicalProcedure schema

Each canonical service page receives the same shape: full meta block + a `MedicalProcedure` schema linked back to the clinic via `@id` reference. Below are 6 sub-steps, one per file, each with its specific values.

**Files:**
- Modify: `acne-scars.html`, `pigmentation.html`, `hair-loss.html`, `laser-hair-removal.html`, `dermatosurgery.html`, `clinical-dermatology.html`

### 5.1 — acne-scars.html

- [ ] **Step 1: Insert SEO block + MedicalProcedure schema**

`old_string`:
```
    <meta name="description"
        content="Struggling with acne or acne scars? Get clearer, smoother skin with dermatologist-led treatments in Erode at Dr. Alam's Skin Clinic.">

    <!-- Core Design System -->
```

`new_string`:
```
    <meta name="description"
        content="Struggling with acne or acne scars? Get clearer, smoother skin with dermatologist-led treatments in Erode at Dr. Alam's Skin Clinic.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/acne-scars.html">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Acne & Acne Scar Treatment | Dr. Alam's Skin Clinic Erode">
    <meta property="og:description" content="Struggling with acne or acne scars? Get clearer, smoother skin with dermatologist-led treatments in Erode at Dr. Alam's Skin Clinic.">
    <meta property="og:url" content="https://dralamdermcentre.com/acne-scars.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/acne-treatment.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Acne & Acne Scar Treatment | Dr. Alam's Skin Clinic Erode">
    <meta name="twitter:description" content="Struggling with acne or acne scars? Get clearer, smoother skin with dermatologist-led treatments in Erode at Dr. Alam's Skin Clinic.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/acne-treatment.jpg">

    <!-- JSON-LD: MedicalProcedure -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Acne and Acne Scar Treatment",
      "description": "Dermatologist-led treatment for active acne and acne scars using medical, topical, and procedural therapies including chemical peels, microneedling, and laser resurfacing.",
      "procedureType": "https://schema.org/TherapeuticProcedure",
      "bodyLocation": "Skin",
      "url": "https://dralamdermcentre.com/acne-scars.html",
      "provider": { "@id": "https://dralamdermcentre.com/#clinic" }
    }
    </script>

    <!-- Core Design System -->
```

### 5.2 — pigmentation.html

- [ ] **Step 1: Insert SEO block + MedicalProcedure schema**

`old_string`:
```
    <meta name="description" content="Struggling with melasma, dark spots, or uneven skin tone? Get professional dermatologist-led pigmentation treatment in Erode at Dr. Alam's Skin Clinic.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description" content="Struggling with melasma, dark spots, or uneven skin tone? Get professional dermatologist-led pigmentation treatment in Erode at Dr. Alam's Skin Clinic.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/pigmentation.html">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Pigmentation & Melasma Treatment | Dr. Alam's Skin Clinic Erode">
    <meta property="og:description" content="Struggling with melasma, dark spots, or uneven skin tone? Get professional dermatologist-led pigmentation treatment in Erode at Dr. Alam's Skin Clinic.">
    <meta property="og:url" content="https://dralamdermcentre.com/pigmentation.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-4.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Pigmentation & Melasma Treatment | Dr. Alam's Skin Clinic Erode">
    <meta name="twitter:description" content="Struggling with melasma, dark spots, or uneven skin tone? Get professional dermatologist-led pigmentation treatment in Erode at Dr. Alam's Skin Clinic.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-4.jpg">

    <!-- JSON-LD: MedicalProcedure -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Pigmentation Treatment (Melasma, Dark Spots)",
      "description": "Dermatologist-led treatment for melasma, post-inflammatory hyperpigmentation, and dark spots using topical agents, chemical peels, and laser pigmentation therapy.",
      "procedureType": "https://schema.org/TherapeuticProcedure",
      "bodyLocation": "Skin",
      "url": "https://dralamdermcentre.com/pigmentation.html",
      "provider": { "@id": "https://dralamdermcentre.com/#clinic" }
    }
    </script>

    <link rel="stylesheet" href="styles/variables.css">
```

### 5.3 — hair-loss.html

- [ ] **Step 1: Insert SEO block + MedicalProcedure schema**

`old_string`:
```
    <meta name="description" content="Worried about hair fall or thinning? We can help you control hair loss and improve hair density at Dr. Alam's Skin Clinic in Erode.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description" content="Worried about hair fall or thinning? We can help you control hair loss and improve hair density at Dr. Alam's Skin Clinic in Erode.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/hair-loss.html">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Hair Loss & Hair Restoration | Dr. Alam's Skin Clinic Erode">
    <meta property="og:description" content="Worried about hair fall or thinning? We can help you control hair loss and improve hair density at Dr. Alam's Skin Clinic in Erode.">
    <meta property="og:url" content="https://dralamdermcentre.com/hair-loss.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-5.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Hair Loss & Hair Restoration | Dr. Alam's Skin Clinic Erode">
    <meta name="twitter:description" content="Worried about hair fall or thinning? We can help you control hair loss and improve hair density at Dr. Alam's Skin Clinic in Erode.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-5.jpg">

    <!-- JSON-LD: MedicalProcedure -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Hair Loss Treatment",
      "description": "Dermatologist-led evaluation and treatment for hair fall and pattern hair loss including topical and oral therapies, PRP, and other procedural options.",
      "procedureType": "https://schema.org/TherapeuticProcedure",
      "bodyLocation": "Scalp",
      "url": "https://dralamdermcentre.com/hair-loss.html",
      "provider": { "@id": "https://dralamdermcentre.com/#clinic" }
    }
    </script>

    <link rel="stylesheet" href="styles/variables.css">
```

### 5.4 — laser-hair-removal.html

- [ ] **Step 1: Insert SEO block + MedicalProcedure schema**

`old_string`:
```
    <meta name="description" content="Tired of shaving and waxing? Get professional, dermatologist-supervised laser hair removal in Erode for smooth, hair-free skin.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description" content="Tired of shaving and waxing? Get professional, dermatologist-supervised laser hair removal in Erode for smooth, hair-free skin.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/laser-hair-removal.html">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Laser Hair Removal | Dr. Alam's Skin Clinic Erode">
    <meta property="og:description" content="Tired of shaving and waxing? Get professional, dermatologist-supervised laser hair removal in Erode for smooth, hair-free skin.">
    <meta property="og:url" content="https://dralamdermcentre.com/laser-hair-removal.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-6.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Laser Hair Removal | Dr. Alam's Skin Clinic Erode">
    <meta name="twitter:description" content="Tired of shaving and waxing? Get professional, dermatologist-supervised laser hair removal in Erode for smooth, hair-free skin.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-6.jpg">

    <!-- JSON-LD: MedicalProcedure -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Laser Hair Removal",
      "description": "Dermatologist-supervised laser hair removal for permanent reduction of unwanted facial and body hair using medical-grade laser systems.",
      "procedureType": "https://schema.org/TherapeuticProcedure",
      "bodyLocation": "Skin",
      "url": "https://dralamdermcentre.com/laser-hair-removal.html",
      "provider": { "@id": "https://dralamdermcentre.com/#clinic" }
    }
    </script>

    <link rel="stylesheet" href="styles/variables.css">
```

### 5.5 — dermatosurgery.html

- [ ] **Step 1: Insert SEO block + MedicalProcedure schema**

`old_string`:
```
    <meta name="description" content="Safe, dermatologist-performed skin surgery for moles, warts, cysts, earlobe repair, and more in Erode. Professional dermatosurgery procedures.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description" content="Safe, dermatologist-performed skin surgery for moles, warts, cysts, earlobe repair, and more in Erode. Professional dermatosurgery procedures.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/dermatosurgery.html">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Dermatosurgery & Skin Surgery | Dr. Alam's Skin Clinic Erode">
    <meta property="og:description" content="Safe, dermatologist-performed skin surgery for moles, warts, cysts, earlobe repair, and more in Erode. Professional dermatosurgery procedures.">
    <meta property="og:url" content="https://dralamdermcentre.com/dermatosurgery.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Dermatosurgery & Skin Surgery | Dr. Alam's Skin Clinic Erode">
    <meta name="twitter:description" content="Safe, dermatologist-performed skin surgery for moles, warts, cysts, earlobe repair, and more in Erode. Professional dermatosurgery procedures.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">

    <!-- JSON-LD: MedicalProcedure -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Dermatosurgery (Mole, Wart, Cyst Removal)",
      "description": "In-clinic dermatologic surgery for moles, warts, cysts, skin tags, and earlobe repair, performed under sterile conditions by a consultant dermatosurgeon.",
      "procedureType": "https://schema.org/SurgicalProcedure",
      "bodyLocation": "Skin",
      "url": "https://dralamdermcentre.com/dermatosurgery.html",
      "provider": { "@id": "https://dralamdermcentre.com/#clinic" }
    }
    </script>

    <link rel="stylesheet" href="styles/variables.css">
```

### 5.6 — clinical-dermatology.html

- [ ] **Step 1: Insert SEO block + MedicalProcedure schema**

`old_string`:
```
    <meta name="description" content="Expert treatment for psoriasis, vitiligo, eczema, fungal infections, and other skin diseases in Erode. Get a proper diagnosis from a consultant dermatologist.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description" content="Expert treatment for psoriasis, vitiligo, eczema, fungal infections, and other skin diseases in Erode. Get a proper diagnosis from a consultant dermatologist.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/clinical-dermatology.html">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Clinical Dermatology | General Skin Disease Treatment Erode">
    <meta property="og:description" content="Expert treatment for psoriasis, vitiligo, eczema, fungal infections, and other skin diseases in Erode. Get a proper diagnosis from a consultant dermatologist.">
    <meta property="og:url" content="https://dralamdermcentre.com/clinical-dermatology.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-2.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Clinical Dermatology | General Skin Disease Treatment Erode">
    <meta name="twitter:description" content="Expert treatment for psoriasis, vitiligo, eczema, fungal infections, and other skin diseases in Erode. Get a proper diagnosis from a consultant dermatologist.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-2.jpg">

    <!-- JSON-LD: MedicalProcedure -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Clinical Dermatology Consultation",
      "description": "Consultant dermatologist evaluation and treatment for psoriasis, vitiligo, eczema, fungal infections, and other skin diseases.",
      "procedureType": "https://schema.org/DiagnosticProcedure",
      "bodyLocation": "Skin",
      "url": "https://dralamdermcentre.com/clinical-dermatology.html",
      "provider": { "@id": "https://dralamdermcentre.com/#clinic" }
    }
    </script>

    <link rel="stylesheet" href="styles/variables.css">
```

- [ ] **Step 2: Verify all 6 service pages**

For each of `acne-scars.html`, `pigmentation.html`, `hair-loss.html`, `laser-hair-removal.html`, `dermatosurgery.html`, `clinical-dermatology.html`, run a Grep for `MedicalProcedure`. Each should match exactly once.

- [ ] **Step 3: Build**

Run: `npm run build`. Expected: success.

- [ ] **Step 4: Commit**

```bash
git add acne-scars.html pigmentation.html hair-loss.html laser-hair-removal.html dermatosurgery.html clinical-dermatology.html
git commit -m "seo: add canonical, OG/Twitter, JSON-LD MedicalProcedure to 6 service pages"
```

---

## Task 6: results.html, blog.html, technology.html — SEO meta only

These three pages get the standard meta block but no JSON-LD. `technology.html` is also missing a meta description and gets one added.

**Files:**
- Modify: `results.html`, `blog.html`, `technology.html`

### 6.1 — results.html

- [ ] **Step 1: Insert SEO block**

`old_string`:
```
    <meta name="description" content="View real patient results for acne scars, pigmentation, hair loss, and dermatosurgery treatments at Dr. Alam's Skin Clinic in Erode.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description" content="View real patient results for acne scars, pigmentation, hair loss, and dermatosurgery treatments at Dr. Alam's Skin Clinic in Erode.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/results.html">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Patient Results | Clinical Before & After | Dr. Alam's Skin Clinic">
    <meta property="og:description" content="View real patient results for acne scars, pigmentation, hair loss, and dermatosurgery treatments at Dr. Alam's Skin Clinic in Erode.">
    <meta property="og:url" content="https://dralamdermcentre.com/results.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Patient Results | Clinical Before & After | Dr. Alam's Skin Clinic">
    <meta name="twitter:description" content="View real patient results for acne scars, pigmentation, hair loss, and dermatosurgery treatments at Dr. Alam's Skin Clinic in Erode.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">

    <link rel="stylesheet" href="styles/variables.css">
```

### 6.2 — blog.html

- [ ] **Step 1: Insert SEO block**

`old_string`:
```
    <meta name="description" content="Access thousands of years of combined medical knowledge. Learn about acne, hair loss, pigmentation, and skin diseases from our dermatologist-led education hub.">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <meta name="description" content="Access thousands of years of combined medical knowledge. Learn about acne, hair loss, pigmentation, and skin diseases from our dermatologist-led education hub.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/blog.html">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Patient Education Hub | Skin & Hair Resources | Dr. Alam's Skin Clinic">
    <meta property="og:description" content="Access thousands of years of combined medical knowledge. Learn about acne, hair loss, pigmentation, and skin diseases from our dermatologist-led education hub.">
    <meta property="og:url" content="https://dralamdermcentre.com/blog.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Patient Education Hub | Skin & Hair Resources | Dr. Alam's Skin Clinic">
    <meta name="twitter:description" content="Access thousands of years of combined medical knowledge. Learn about acne, hair loss, pigmentation, and skin diseases from our dermatologist-led education hub.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">

    <link rel="stylesheet" href="styles/variables.css">
```

### 6.3 — technology.html

This page is missing a `<meta name="description">` entirely. Add one as part of the SEO block.

- [ ] **Step 1: Insert meta description and SEO block**

`old_string`:
```
    <title>Technology & Clinic | Dr. Alam's Skin Clinic</title>
    <link rel="icon" type="image/png" href="images/logo.png">
    <link rel="stylesheet" href="styles/variables.css">
```

`new_string`:
```
    <title>Technology & Clinic | Dr. Alam's Skin Clinic</title>
    <link rel="icon" type="image/png" href="images/logo.png">
    <meta name="description" content="Explore the advanced laser systems and clinical technology at Dr. Alam's Skin Clinic in Erode — equipment used for laser hair removal, pigmentation, and dermatosurgery.">

    <!-- Canonical -->
    <link rel="canonical" href="https://dralamdermcentre.com/technology.html">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Dr. Alam's Skin Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:title" content="Technology & Clinic | Dr. Alam's Skin Clinic">
    <meta property="og:description" content="Explore the advanced laser systems and clinical technology at Dr. Alam's Skin Clinic in Erode — equipment used for laser hair removal, pigmentation, and dermatosurgery.">
    <meta property="og:url" content="https://dralamdermcentre.com/technology.html">
    <meta property="og:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Technology & Clinic | Dr. Alam's Skin Clinic">
    <meta name="twitter:description" content="Explore the advanced laser systems and clinical technology at Dr. Alam's Skin Clinic in Erode — equipment used for laser hair removal, pigmentation, and dermatosurgery.">
    <meta name="twitter:image" content="https://dralamdermcentre.com/images/hero-slide-1.jpg">

    <link rel="stylesheet" href="styles/variables.css">
```

- [ ] **Step 2: Verify**

For `results.html`, `blog.html`, `technology.html`: each should grep `og:url` exactly once.

- [ ] **Step 3: Build**

Run: `npm run build`. Expected: success.

- [ ] **Step 4: Commit**

```bash
git add results.html blog.html technology.html
git commit -m "seo: add canonical and OG/Twitter to results, blog, technology pages"
```

---

## Task 7: services/* duplicate pages — canonical-only

The 6 pages under `services/` are duplicates of top-level pages. Each gets ONLY a canonical tag pointing to the top-level URL. No OG, no schema (the top-level canonical handles those).

**Files:**
- Modify: `services/acne.html`, `services/pigmentation.html`, `services/hair-loss.html`, `services/laser-hair-removal.html`, `services/dermatosurgery.html`, `services/clinical-dermatology.html`

- [ ] **Step 1: Add canonical tag in each services/* page**

For each file, use Edit tool. The shared insertion point is the line right after `<title>`. The canonical URLs:

| File | Canonical URL |
|---|---|
| `services/acne.html` | `https://dralamdermcentre.com/acne-scars.html` |
| `services/pigmentation.html` | `https://dralamdermcentre.com/pigmentation.html` |
| `services/hair-loss.html` | `https://dralamdermcentre.com/hair-loss.html` |
| `services/laser-hair-removal.html` | `https://dralamdermcentre.com/laser-hair-removal.html` |
| `services/dermatosurgery.html` | `https://dralamdermcentre.com/dermatosurgery.html` |
| `services/clinical-dermatology.html` | `https://dralamdermcentre.com/clinical-dermatology.html` |

For example, in `services/acne.html`:

`old_string`:
```
    <title>Acne & Acne Scar Treatment | Dr. Alam's Skin Clinic</title>
```

`new_string`:
```
    <title>Acne & Acne Scar Treatment | Dr. Alam's Skin Clinic</title>
    <link rel="canonical" href="https://dralamdermcentre.com/acne-scars.html">
```

Repeat the same shape for the other 5 files using the canonical URLs from the table above. The `old_string` for each is its current `<title>...</title>` line — read it from the file first if unsure.

- [ ] **Step 2: Verify**

Grep each `services/*.html` for `rel="canonical"`. Each should match exactly once.

- [ ] **Step 3: Build**

Run: `npm run build`. Expected: success.

- [ ] **Step 4: Commit**

```bash
git add services/
git commit -m "seo: add canonical tags pointing to top-level pages on services/* duplicates"
```

---

## Task 8: snake.html — noindex

**Files:**
- Modify: `snake.html`

- [ ] **Step 1: Add robots noindex meta**

`old_string`:
```
    <meta name="description" content="A simple classic Snake game built into the Dr. Alam's Skin Clinic site.">
```

`new_string`:
```
    <meta name="description" content="A simple classic Snake game built into the Dr. Alam's Skin Clinic site.">
    <meta name="robots" content="noindex, nofollow">
```

- [ ] **Step 2: Verify**

Grep `snake.html` for `noindex`. Expected: 1 match.

- [ ] **Step 3: Commit**

```bash
git add snake.html
git commit -m "seo: noindex snake.html (game page, not for SEO)"
```

---

## Task 9: Create robots.txt

**Files:**
- Create: `robots.txt`

- [ ] **Step 1: Create robots.txt at project root**

Use Write tool with this exact content:

```
User-agent: *
Allow: /
Disallow: /snake.html

Sitemap: https://dralamdermcentre.com/sitemap.xml
```

- [ ] **Step 2: Verify**

Read `robots.txt`. Expected: 4 non-empty lines as above.

- [ ] **Step 3: Commit**

```bash
git add robots.txt
git commit -m "seo: add robots.txt with sitemap reference"
```

---

## Task 10: Create sitemap.xml

**Files:**
- Create: `sitemap.xml`

- [ ] **Step 1: Create sitemap.xml at project root**

Use Write tool with this exact content (replace `2026-05-08` with today's date if different):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dralamdermcentre.com/</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/services.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/contact.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/acne-scars.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/pigmentation.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/hair-loss.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/laser-hair-removal.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/dermatosurgery.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/clinical-dermatology.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/about.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/results.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/blog.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://dralamdermcentre.com/technology.html</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Verify**

Grep `sitemap.xml` for `<loc>`. Expected: 13 matches.

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml
git commit -m "seo: add sitemap.xml listing 13 canonical URLs"
```

---

## Task 11: Extend vite.config.js to ship robots.txt and sitemap.xml

**Files:**
- Modify: `vite.config.js`

- [ ] **Step 1: Extend the copyFoldersPlugin to also copy root-level files**

`old_string`:
```
const copyFoldersPlugin = {
  name: 'copy-static-folders',
  closeBundle() {
    const folders = ['images', 'results', 'services', 'scripts'];
    for (const folder of folders) {
      const src = resolve(__dirname, folder);
      const dest = resolve(__dirname, 'dist', folder);
      if (fs.existsSync(src)) {
        copyDir(src, dest);
        console.log(`Copied ${folder}/ → dist/${folder}/`);
      }
    }
  }
};
```

`new_string`:
```
const copyFoldersPlugin = {
  name: 'copy-static-folders',
  closeBundle() {
    const folders = ['images', 'results', 'services', 'scripts'];
    for (const folder of folders) {
      const src = resolve(__dirname, folder);
      const dest = resolve(__dirname, 'dist', folder);
      if (fs.existsSync(src)) {
        copyDir(src, dest);
        console.log(`Copied ${folder}/ → dist/${folder}/`);
      }
    }

    const files = ['robots.txt', 'sitemap.xml'];
    for (const file of files) {
      const src = resolve(__dirname, file);
      const dest = resolve(__dirname, 'dist', file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${file} → dist/${file}`);
      }
    }
  }
};
```

- [ ] **Step 2: Build and verify both files land in dist/**

Run: `npm run build`
Expected: console output includes `Copied robots.txt → dist/robots.txt` and `Copied sitemap.xml → dist/sitemap.xml`. Both files exist in `dist/`.

- [ ] **Step 3: Commit**

```bash
git add vite.config.js
git commit -m "build: copy robots.txt and sitemap.xml into dist on build"
```

---

## Task 12: Final dist verification

This task verifies the full build output is correct before deployment. No code changes; runs and inspects.

- [ ] **Step 1: Clean build**

Run: `rm -rf dist && npm run build` (PowerShell: `Remove-Item -Recurse -Force dist; npm run build`).
Expected: build completes; both `dist/robots.txt` and `dist/sitemap.xml` exist; all canonical HTML pages present in `dist/`.

- [ ] **Step 2: Spot-check schema in built output**

Grep `dist/index.html` for `"@type": "MedicalClinic"`. Expected: 1 match.
Grep `dist/acne-scars.html` for `"@type": "MedicalProcedure"`. Expected: 1 match.
Grep `dist/about.html` for `"@type": "Physician"`. Expected: 1 match.

- [ ] **Step 3: Spot-check canonical tags in built output**

Grep `dist/contact.html` for `rel="canonical"`. Expected: 1 match.
Grep `dist/services/acne.html` for `rel="canonical".*acne-scars\.html`. Expected: 1 match (canonical points to top-level).

- [ ] **Step 4: Spot-check noindex on snake.html**

Grep `dist/snake.html` for `noindex`. Expected: 1 match.

- [ ] **Step 5: Confirm no build regressions**

Open `dist/index.html` in a browser (or `npm run dev` and open http://localhost:5173). Visually confirm the page renders identically to before — the SEO additions should be invisible to the user.

- [ ] **Step 6: Final summary commit (if any cleanup is needed)**

If steps 1–5 all pass with no changes required, no commit needed; the work is complete.

---

## Post-Deployment Validation (manual, off-plan)

Once the changes are deployed to `https://dralamdermcentre.com/`:

1. **Google Rich Results Test** (search.google.com/test/rich-results) — paste the homepage and one service page; confirm MedicalClinic and MedicalProcedure validate without errors.
2. **Schema.org validator** (validator.schema.org) — backup syntactic check.
3. **Facebook Sharing Debugger** (developers.facebook.com/tools/debug/) — confirm OG preview renders with image/title/description.
4. **Twitter Card Validator** — confirm `summary_large_image` card renders.
5. **Google Search Console** — submit `https://dralamdermcentre.com/sitemap.xml`; confirm "Success" status and 13 URLs discovered.
6. **Lighthouse SEO audit** — homepage and one service page; expect SEO score ≥95.

These cannot be run from local code — they require a live deployed site.
