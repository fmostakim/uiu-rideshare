import routeMap3D from './img/route-map-3d.png';

// All icons are inline SVGs (never expire).
// Photos use Unsplash / UI-Avatars (free, no-auth CDNs).

const ico = (path, vb = '0 0 24 24', extra = '') =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${extra}>${path}</svg>`
  )}`;

// ── Logo ──────────────────────────────────────────────────────────────────────
export const logo = ico(
  `<rect width="68" height="68" rx="10" fill="#b7131a"/>` +
  `<text x="34" y="46" font-family="Arial,sans-serif" font-weight="bold" ` +
  `fill="white" font-size="22" text-anchor="middle">UIU</text>`,
  '0 0 68 68'
);

// ── Avatars (UI-Avatars API) ──────────────────────────────────────────────────
export const avatarSafety1 =
  'https://ui-avatars.com/api/?name=Rahat+S&background=b7131a&color=fff&size=200&rounded=true&bold=true';
export const avatarSafety2 =
  'https://ui-avatars.com/api/?name=Nadia+K&background=27313f&color=fff&size=200&rounded=true&bold=true';
export const avatarSafety3 =
  'https://ui-avatars.com/api/?name=Fahim+M&background=1d4ed8&color=fff&size=200&rounded=true&bold=true';

// ── Photos ────────────────────────────────────────────────────────────────────
export const heroBackground =
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&q=80';
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
