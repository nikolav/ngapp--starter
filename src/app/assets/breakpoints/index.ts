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

  XSmall: "(max-width: 480px)",
  Small: "(max-width: 768px)",
  Medium: "(max-width: 1024px)",
  Large: "(max-width: 1440px)",
  XLarge: "(max-width: 1920px)",

  /* ---------------------------------------------------- */
  /* semantic device ranges                               */
  /* ---------------------------------------------------- */

  Handset: "(max-width: 767.99px)",
  Tablet: "(min-width: 768px) and (max-width: 1023.99px)",
  Web: "(min-width: 1024px)",

  /* ---------------------------------------------------- */
  /* orientation-aware                                   */
  /* ---------------------------------------------------- */

  HandsetPortrait: "(max-width: 767.99px) and (orientation: portrait)",

  HandsetLandscape: "(max-width: 767.99px) and (orientation: landscape)",

  TabletPortrait:
    "(min-width: 768px) and (max-width: 1023.99px) and (orientation: portrait)",

  TabletLandscape:
    "(min-width: 768px) and (max-width: 1023.99px) and (orientation: landscape)",

  WebPortrait: "(min-width: 1024px) and (orientation: portrait)",

  WebLandscape: "(min-width: 1024px) and (orientation: landscape)",
} as const;

export type TBreakpointsCustom = typeof BreakpointsCustom;
export type TBreakpointKeyCustom = keyof TBreakpointsCustom;
export type TBreakpointCustom = TBreakpointsCustom[TBreakpointKeyCustom];
