/**
 * BreakpointsCustom
 * --------------------------------------------------------
 * Must stay in sync with tailwind.config.ts `theme.screens`
 * --------------------------------------------------------
 */

// declare const Breakpoints: {
//   XSmall: string;
//   Small: string;
//   Medium: string;
//   Large: string;
//   XLarge: string;
//   Handset: string;
//   Tablet: string;
//   Web: string;
//   HandsetPortrait: string;
//   HandsetLandscape: string;
//   TabletPortrait: string;
//   TabletLandscape: string;
//   WebPortrait: string;
//   WebLandscape: string;
// };

export const BreakpointsCustom = {
  /* ---------------------------------------------------- */
  /* size tiers (Tailwind-like)                            */
  /* ---------------------------------------------------- */

  XSmall: "(max-width: 599.98px)",
  Small: "(max-width: 959.98px)",
  Medium: "(max-width: 1279.98px)",
  Large: "(max-width: 1919.98px)",
  XLarge: "(min-width: 1920px)",
  // XLarge: "(max-width: 1920px)",

  /* ---------------------------------------------------- */
  /* semantic device ranges                               */
  /* ---------------------------------------------------- */

  Handset:
    "(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)",
  Tablet:
    "(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",
  Web: "(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)",

  /* ---------------------------------------------------- */
  /* orientation-aware                                   */
  /* ---------------------------------------------------- */

  HandsetPortrait: "(max-width: 599.98px) and (orientation: portrait)",

  HandsetLandscape: "(max-width: 959.98px) and (orientation: landscape)",

  TabletPortrait:
    "(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)",

  TabletLandscape:
    "(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",

  WebPortrait: "(min-width: 840px) and (orientation: portrait)",

  WebLandscape: "(min-width: 1280px) and (orientation: landscape)",
} as const;

export type TBreakpointsCustom = typeof BreakpointsCustom;
export type TBreakpointKeyCustom = keyof TBreakpointsCustom;
export type TBreakpointCustom = TBreakpointsCustom[TBreakpointKeyCustom];
