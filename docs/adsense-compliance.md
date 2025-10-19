# AdSense Compliance Audit

## Why Google Flagged the Site

1. **Pages with little or no publisher content** – The public routes for the home page and game list render almost exclusively data pulled from the `featuredGames` and `games` arrays. When those API calls return a short list (or nothing at all), the template only shows loading spinners or empty grids, leaving the page without meaningful copy that would justify an ad slot.【F:src/views/HomeView.vue†L6-L25】【F:src/components/GameList.vue†L6-L37】
2. **Single-action game detail pages** – The detail page renders one screenshot, a sentence-long description, and a button that opens the game in a new tab. If ads are injected there, the page itself contains almost no original experience beyond the outbound click, which is a classic "low value" pattern Google calls out.【F:src/components/GameDetail.vue†L1-L59】
3. **Risky ad placement targets** – Routes for login and register are part of the main layout, so an ad component wired into the layout would also render on those minimal forms. AdSense disallows showing ads on utility pages such as authentication forms.【F:src/router/index.ts†L37-L78】

## Remediation Plan

1. **Increase original, text-rich content**
   - Expand each featured game page with unique copy: gameplay guides, developer notes, changelogs, FAQs, and embedded media hosted on your domain rather than a single external link.【F:src/components/GameDetail.vue†L13-L43】
   - Add editorial sections to the home page (e.g., news updates, tips, tournament results) so that the layout still provides value even if a game feed is empty.【F:src/views/HomeView.vue†L6-L53】

2. **Ensure ad slots only appear beside substantive experiences**
   - Mount ad components only on content-heavy routes and suppress them on login, register, bare loading states, and other utility screens by checking the current route’s meta before rendering the ad wrapper.【F:src/router/index.ts†L17-L68】
   - Delay loading ads until the related game data has finished loading; if the store reports an error or zero games, hide the ad container altogether.【F:src/components/GameList.vue†L6-L37】

3. **Demonstrate site completeness and polish**
   - Publish a small number of evergreen pages (privacy, about, how to play) with at least a few hundred words each; keep them updated and interlink them from the header/footer so AdSense reviewers can find them easily.【F:src/components/MainLayout.vue†L4-L82】
   - Verify that every navigation link resolves (no “under construction” placeholders) and that external destinations, such as the “Play” button, land on content you control or have rights to distribute.【F:src/components/GameDetail.vue†L16-L42】

4. **Content quality checklist before requesting review**
   - At least five substantial articles/posts that are unique to your site and readable without running the game.
   - Rich metadata for each game (screenshots, long-form description, system requirements, community highlights).
   - A consistent moderation policy for feedback/comments so empty comment blocks are not the primary feature of a page.

Once these updates are live, browse the site as if you were a new user: every page that will show an ad should contain original text, imagery, or interactive features that justify an ad impression. Take screenshots documenting the improvements and submit the AdSense review only after the site meets the above checklist.
