# Notion Bible Study Hub — Handoff File
**Date:** June 10, 2026  
**Goal:** Finish populating the AuDHD Bible Study Hub in Notion with all Romans and Ephesians study content.

---

## What's Been Accomplished

### Markdown Source Files (all in `/Users/jonmartin/Documents/Claude/Projects/Logos/`)
| File | Status |
|------|--------|
| `ephesians-1-2.md` | ✅ Created this session |
| `ephesians-3.md` | ✅ Already existed |
| `ephesians-4.md` | ✅ Already existed |
| `ephesians-5.md` | ✅ Already existed |
| `ephesians-6.md` | ✅ Already existed |
| `romans-6-8.md` | ✅ Already existed |

### Notion Pages Created
| Page | Notion ID | Status |
|------|-----------|--------|
| 📖 AuDHD Bible Study Hub (top-level) | `37a58ead-9915-811a-8238-c00eb6ac2f60` (this is the **Ephesians parent**) | ✅ Exists |
| Ephesians 1–2 — AuDHD Bible Study | `37b58ead-9915-8174-ae6a-fc3c258c9e84` | ✅ Created this session |
| Ephesians 3 | Unknown — created in prior session | ✅ Exists |
| Ephesians 4 | Unknown — created in prior session | ✅ Exists |
| Ephesians 5 | Unknown — created in prior session | ✅ Exists |
| Ephesians 6 | Unknown — created in prior session | ✅ Exists |
| Romans 6–8 | **NOT YET CREATED** | ❌ Pending |

---

## What Still Needs to Be Done

### 1. Verify the full Notion hierarchy
Use `notion-fetch` or `notion-search` to confirm:
- Is there a top-level "📖 AuDHD Bible Study Hub" page?
- Is there a "Romans" parent page (like the Ephesians parent)?
- Are Ephesians 3–6 properly nested under the Ephesians parent?

The **Ephesians parent page ID** is: `37a58ead-9915-811a-8238-c00eb6ac2f60`

### 2. Create the Romans 6–8 Notion page
- Source file: `/Users/jonmartin/Documents/Claude/Projects/Logos/romans-6-8.md`
- Read the file, then call `notion-create-pages` with:
  - Parent: the Romans parent page ID (search Notion for it, or create it if missing)
  - Title: `Romans 6–8 — AuDHD Bible Study`
  - Icon: 📖
  - Content: full markdown from `romans-6-8.md`

### 3. Confirm Ephesians 3–6 pages are correct
- If any are missing or malformed, re-create from the corresponding `.md` files
- All should be children of `37a58ead-9915-811a-8238-c00eb6ac2f60`

---

## Notion MCP Tool
The Notion MCP tool name is: `mcp__6c695062-c837-4f88-9ab7-955bdf3bf935__notion-create-pages`

Load it with:
```
ToolSearch: select:mcp__6c695062-c837-4f88-9ab7-955bdf3bf935__notion-create-pages
```

To search existing pages:
```
mcp__6c695062-c837-4f88-9ab7-955bdf3bf935__notion-search
```

---

## Study Content Format Reference
All `.md` files follow this structure:
```
> 📜 **Study Theme: ...**
> [overview paragraph]

## [Book] [Ch:Verse] — [Title]
*"[verse text]" — ESV*

### 🔍 Greek Exegesis
### 📖 Commentary (JFB)
### 🧠 AuDHD Reframe
### 📝 Word Study
### 📚 Additional Commentators
### 💭 Pastoral Reflection
```

---

## Prompt for New Chat

> I'm continuing work on an AuDHD Bible Study Hub in Notion. Here's the state:
>
> **Done:** Ephesians 1–2, 3, 4, 5, 6 pages are in Notion under parent page `37a58ead-9915-811a-8238-c00eb6ac2f60`.
>
> **To do:**
> 1. Search Notion to confirm the full hierarchy (Hub → Romans + Ephesians sub-pages → chapter study pages)
> 2. Find or create a "Romans" parent page under the Hub
> 3. Read `/Users/jonmartin/Documents/Claude/Projects/Logos/romans-6-8.md` and create a Notion page titled "Romans 6–8 — AuDHD Bible Study" (icon 📖) under the Romans parent
> 4. Verify all Ephesians chapter pages are correctly nested
>
> The Notion MCP tool is `mcp__6c695062-c837-4f88-9ab7-955bdf3bf935__notion-create-pages`. Load it via ToolSearch before use.
>
> The project folder is `/Users/jonmartin/Documents/Claude/Projects/Logos/` and contains all the `.md` source files.
