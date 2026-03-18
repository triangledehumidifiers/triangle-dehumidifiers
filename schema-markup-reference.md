# Triangle Dehumidifiers Schema Markup Reference

**Website:** https://www.triangledehumidifiers.com
**Last Updated:** 2026-03-16
**Status:** Deployed on all 12 pages via shared utility (`src/schemas/business.ts`)

---

## Overview

All pages use JSON-LD structured data in `<script type="application/ld+json">` tags. The business schema is centralized in `src/schemas/business.ts` and imported by each page. BreadcrumbList schema is generated automatically by `BaseLayout.astro`.

**Validation tools:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

---

## Business Information (Reference)

- **Business Name:** Triangle Dehumidifiers, LLC
- **Owner:** Nathan Rider
- **Address:** PO Box 1241, Holly Springs, NC 27540
- **Phone:** (919) 867-0580
- **Email:** info@triangledehumidifiers.com
- **Website:** https://www.triangledehumidifiers.com
- **Core Service Area:** Raleigh, Cary, Apex, Holly Springs, Fuquay-Varina, Morrisville, Garner, Wake Forest, Knightdale, Durham, Chapel Hill
- **Extended Service Area:** + Pittsboro, Clayton (service-areas page only)
- **Hours:** Monday-Friday 8:00 AM-5:00 PM (ET)
- **Google Reviews:** 19 reviews, 5.0 stars
- **Schema Type:** HomeAndConstructionBusiness

---

## Architecture

### Shared Business Schema (`src/schemas/business.ts`)

All 12 pages import from this single file. It exports:

- `buildBusinessSchema(overrides)` — returns a complete HomeAndConstructionBusiness object with optional per-page overrides for `areaServed`, `description`, and `email`.
- `ALL_AREAS_SERVED` — 11-city array used on homepage, service pages, and contact page.
- `EXTENDED_AREAS_SERVED` — 13-city array used on service-areas page (adds Pittsboro, Clayton).
- `cityArea(name)` — helper that returns a structured City object with `containedInPlace` for single-city pages.

### BreadcrumbList Schema (`src/layouts/BaseLayout.astro`)

Generated automatically from the `breadcrumbs` prop passed by each page. No manual JSON-LD needed.

### FAQPage Schema (per-page)

Each service page and city page defines its own `faqSchema` object inline with page-specific Q&As. These remain per-page since the questions are unique to each page.

---

## Schema Types Deployed

### 1. HomeAndConstructionBusiness (all 12 pages)

Base properties (from `business.ts`):

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://www.triangledehumidifiers.com/#business",
  "name": "Triangle Dehumidifiers, LLC",
  "telephone": "(919) 867-0580",
  "url": "https://www.triangledehumidifiers.com",
  "image": "https://www.triangledehumidifiers.com/images/hero-livingroom.webp",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.triangledehumidifiers.com/logo.webp"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Holly Springs",
    "addressRegion": "NC",
    "postalCode": "27540",
    "addressCountry": "US"
  },
  "hasMap": "https://maps.app.goo.gl/5ZNkdiqdTqKvNqTH9",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "19"
  },
  "sameAs": [
    "https://www.google.com/maps/place/Triangle+Dehumidifiers,+LLC/",
    "https://maps.app.goo.gl/5ZNkdiqdTqKvNqTH9"
  ],
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ]
}
```

**Per-page overrides:**

| Page | `areaServed` | `email` | `description` |
|------|-------------|---------|---------------|
| Homepage (`index.astro`) | ALL_AREAS_SERVED | yes | yes |
| Contact (`contact.astro`) | ALL_AREAS_SERVED | yes | — |
| Service Areas (`service-areas.astro`) | EXTENDED_AREAS_SERVED | yes | — |
| Raleigh city page | `cityArea('Raleigh')` | — | — |
| Holly Springs city page | `cityArea('Holly Springs')` | — | — |
| Cary city page | `cityArea('Cary')` | — | — |
| Apex city page | `cityArea('Apex')` | — | — |
| Fuquay-Varina city page | `cityArea('Fuquay-Varina')` | — | yes |
| Encapsulated crawl space | ALL_AREAS_SERVED | — | — |
| Whole-house dehumidifier | ALL_AREAS_SERVED | — | — |
| ERV installation | ALL_AREAS_SERVED | — | — |
| Mold treatment | ALL_AREAS_SERVED | — | — |

### 2. BreadcrumbList (all pages via BaseLayout)

Auto-generated from each page's `breadcrumbs` prop. Example output for Raleigh city page:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.triangledehumidifiers.com/" },
    { "@type": "ListItem", "position": 2, "name": "Service Areas", "item": "https://www.triangledehumidifiers.com/service-areas" },
    { "@type": "ListItem", "position": 3, "name": "Raleigh NC", "item": "https://www.triangledehumidifiers.com/crawl-space-dehumidifier-raleigh-nc" }
  ]
}
```

### 3. FAQPage (10 pages — all except contact and service-areas)

Each page defines its own FAQ questions inline. Structure:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here."
      }
    }
  ]
}
```

---

## Schema Validation Notes (March 2026)

**Issues fixed:**
- Removed `serviceType` — not a valid property on `HomeAndConstructionBusiness` per schema.org spec
- Replaced `openingHours` string format with proper `openingHoursSpecification` objects
- Standardized `areaServed` to always use structured `City` objects instead of plain strings
- Centralized all business identity fields into a single shared module to prevent drift

**Known non-issue:**
- Ahrefs reports a 404 at `/cdn-cgi/l/email-protection` linked from the contact page. This is Cloudflare's email obfuscation rewriting the `mailto:` link at the edge — not a real broken page. Can be resolved by disabling Cloudflare Scrape Shield > Email Address Obfuscation, or simply ignored.

---

## Maintenance Checklist

When updating schema, only edit `src/schemas/business.ts`. Changes propagate to all 12 pages automatically.

- **Review count changes:** Update `reviewCount` in `BASE_BUSINESS_SCHEMA.aggregateRating`
- **Hours change:** Update `openingHoursSpecification` in `BASE_BUSINESS_SCHEMA`
- **New service area:** Add to `ALL_AREAS_SERVED` array
- **New page added:** Import `buildBusinessSchema` and call with appropriate overrides
- **FAQ changes:** Edit the `faqSchema` object directly in the relevant `.astro` page file

---

**Document Version:** 2.0
**Last Updated:** March 16, 2026
