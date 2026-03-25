---
mode: agent
description: Create a new blog post from finished content (draft markdown from Cowork)
---

# New Blog Post

You are adding a new blog post to the Triangle Dehumidifiers website. The finished content has already been written in Cowork and is being handed off for implementation.

## What you need from the user

Ask for:
1. **The draft content** — either a file path or pasted markdown
2. **The blog image** — file path to a .webp image, or confirmation to skip

## Steps

### 1. Create the blog post file

- Location: `src/content/blog/{slug}.md`
- The slug should match the draft's target URL (hyphens, lowercase, no trailing slash)
- Use `crawl-space` (hyphenated), never `crawlspace`

### 2. Frontmatter

Every blog post must have this exact frontmatter structure:

`yaml
---
title: 'Post Title Here'
description: 'Meta description (under 160 characters)'
date: 'YYYY-MM-DD'
dateModified: 'YYYY-MM-DD'
author: 'Nathan Rider'
image: '/images/blog/filename.webp'
imageAlt: 'Descriptive alt text for the image'
tags: ['tag1', 'tag2', 'raleigh']
---
`

Rules:
- `date` and `dateModified` are **strings**, not Date objects
- `author` is always `Nathan Rider`
- `tags` must always include `'raleigh'`
- `description` must be under 160 characters
- `title` often follows the pattern: `Topic | Triangle Dehumidifiers`

### 3. Hero image in the body

The first element after frontmatter should be the hero image:

`html
<img src="/images/blog/filename.webp" alt="Descriptive alt text" width="1200" height="675" loading="eager">
`

- Hero image uses `loading="eager"`
- All other images in the post use `loading="lazy"`
- Images go in `public/images/blog/` as `.webp` files

### 4. Content body

- Paste the draft content as-is — do not rewrite, rephrase, or "improve" the copy
- Strip out any competitor analysis tables, SEO metadata blocks, or schema JSON that appear above the actual article content (those are research notes from Cowork, not part of the published post)
- Keep all internal links as relative paths (e.g., `/crawl-space-dehumidifier-raleigh-nc/`)
- Keep FAQ sections if present — they match the site's FAQ schema pattern
- Use `---` horizontal rules between major sections (matches existing posts)

### 5. Handle the image file

If the user provides a blog image:
- Copy or move it to `public/images/blog/`
- Ensure it's `.webp` format
- Use a descriptive filename with hyphens (e.g., `crawl-space-mold-treatment-raleigh-nc.webp`)

### 6. Schema markup

- The `BlogPost.astro` layout **automatically generates** Article schema from frontmatter — do not add Article schema manually
- If the draft includes **FAQPage schema** (JSON-LD), add it as a `<script type="application/ld+json">` block at the end of the post body
- If the draft includes **LocalBusiness schema**, skip it — the layout handles this site-wide

### 7. Verify

- Run `npx astro build` to confirm no build errors
- Check that the new file appears in the build output

### 8. Commit

- Stage only the new/changed files (blog post, image if added)
- Commit message: `add {slug} blog post`
