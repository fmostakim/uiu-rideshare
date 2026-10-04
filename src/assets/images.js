import routeMap3D from './img/route-map-3d.png';
import uiuCampus from './img/uiu-campus.png';

// All icons are inline SVGs (never expire).
// Photos use Unsplash / UI-Avatars (free, no-auth CDNs).

const ico = (path, vb = '0 0 24 24', extra = '') =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${extra}>${path}</svg>`
  )}`;

// ── Logo ──────────────────────────────────────────────────────────────────────
export const logo = ico(
  `<defs>` +
    `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">` +
      `<stop offset="0%" stop-color="#e11d25"/>` +
      `<stop offset="100%" stop-color="#8f0c13"/>` +
    `</linearGradient>` +
  `</defs>` +
  `<rect width="100" height="100" rx="22" fill="url(#bg)"/>` +
  `<path d="M 38 30 A 12 12 0 0 1 62 30 C 62 42 50 54 50 54 C 50 54 38 42 38 30 Z" fill="white"/>` +
  `<circle cx="50" cy="28" r="4" fill="#c91820"/>` +
  `<text x="50" y="74" font-family="system-ui, sans-serif" font-weight="900" fill="white" font-size="24" text-anchor="middle" letter-spacing="1.5">UIU</text>` +
  `<text x="51" y="88" font-family="system-ui, sans-serif" font-weight="700" fill="#fca5a5" font-size="10" text-anchor="middle" letter-spacing="3">RIDESHARE</text>`,
  '0 0 100 100'
);

// ── Avatars (UI-Avatars API) ──────────────────────────────────────────────────
export const avatarSafety1 =
  'https://ui-avatars.com/api/?name=Rahat+S&background=b7131a&color=fff&size=200&rounded=true&bold=true';
export const avatarSafety2 =
  'https://ui-avatars.com/api/?name=Nadia+K&background=27313f&color=fff&size=200&rounded=true&bold=true';
export const avatarSafety3 =
  'https://ui-avatars.com/api/?name=Fahim+M&background=1d4ed8&color=fff&size=200&rounded=true&bold=true';

// ── Photos ────────────────────────────────────────────────────────────────────
export const heroBackground = uiuCampus;
export const mapPreview = routeMap3D;

// ── Icons ─────────────────────────────────────────────────────────────────────
const S = 'stroke="#b7131a" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const SW = 'stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';

export const iconArrow = ico(
  `<path ${SW} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>`
);
export const iconShield = ico(
  `<path ${S} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>`
);
export const iconWallet = ico(
  `<path ${S} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/>`
);
export const iconPin = ico(
  `<path ${S} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path ${S} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>`
);
export const iconChevron = ico(
  `<path ${S} d="M8.25 4.5l7.5 7.5-7.5 7.5"/>`
);
