# Branch Switch: anchor-testing

## Project Structure
- **Root**: `/Users/genieworksm4/01 Coding/28_SaasReaper/`
- **Current Branch**: `anchor-testing`

## Changes Implemented
### Navbar & Light Mode Features
1.  **Created `ModeToggle` component**:
    -   Uses `next-themes` to toggle Light/Dark mode.
    -   Implemented as a simple icon button in `components/mode-toggle.tsx`.
2.  **Created `Navbar` component**:
    -   Implemented in `components/navbar.tsx`.
    -   Includes Logo, "Catalog" link, `ModeToggle`, User info/Sign Out button, or Sign In/Up buttons.
    -   Sticky header design.
3.  **Updated `app/page.tsx`**:
    -   Replaced inline header with `<Navbar />`.
4.  **Updated `app/catalog/page.tsx`**:
    -   Replaced inline header with `<Navbar />`.
    -   Preserved "Search" functionality by moving it to the page content area.
    -   Now fetches `user` to pass to `Navbar`.
5.  **Light Mode Configuration**:
    -   Verified `tailwind.config.js` and `styles/globals.css` configuration.
    -   Added `--complementary` color variable (`hsl(325, 100%, 45%)`) to `globals.css` and `tailwind.config.js` as a complementary color to the primary green.

## Key Points & Insights
-   Consolidated header logic into a reusable `Navbar` component.
-   Ensured consistent navigation and branding across main pages.
-   Added Light/Dark mode toggle accessible from the navbar.
