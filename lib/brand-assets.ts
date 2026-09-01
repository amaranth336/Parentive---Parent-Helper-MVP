/**
 * Canonical Parentive brand-asset registry.
 *
 * Linear 003 locked the logo, wordmark, and lockup. Those production files live
 * in the Drive folder below — not in the brand-package PDF, the design board,
 * or a CSS reconstruction of Option 14.
 *
 * Local copies under `public/brand/` are what the app serves. Keep them in sync
 * with the Drive folder via `npm run sync:brand-assets`.
 */

export const BRAND_ASSET_SOURCE = {
  /** Locked 003 logo / mark / wordmark / lockup folder */
  driveFolderId: "1r6GTJERQDf3pFb57RwftqhqY2StSo0yU",
  driveFolderUrl:
    "https://drive.google.com/drive/folders/1r6GTJERQDf3pFb57RwftqhqY2StSo0yU?usp=drive_link",
  linearIssue: "PAR-3",
} as const;

export type BrandLockupKind = "mark" | "wordmark" | "lockup";

export interface BrandAssetFile {
  kind: BrandLockupKind;
  /** Public path without extension; `.svg` is preferred, `.png` is the fallback. */
  basename: string;
  svg: string;
  png: string;
  label: string;
  description: string;
}

export const brandAssets: Record<BrandLockupKind, BrandAssetFile> = {
  mark: {
    kind: "mark",
    basename: "logo-mark",
    svg: "/brand/logo-mark.svg",
    png: "/brand/logo-mark.png",
    label: "Parentive",
    description: "Standalone Option 14 logo mark",
  },
  wordmark: {
    kind: "wordmark",
    basename: "wordmark",
    svg: "/brand/wordmark.svg",
    png: "/brand/wordmark.png",
    label: "Parentive",
    description: "Parentive wordmark",
  },
  lockup: {
    kind: "lockup",
    basename: "logo-lockup-horizontal",
    svg: "/brand/logo-lockup-horizontal.svg",
    png: "/brand/logo-lockup-horizontal.png",
    label: "Parentive",
    description: "Primary horizontal logo lockup (mark + wordmark)",
  },
};

export const BRAND_ASSET_FILES = [
  brandAssets.mark,
  brandAssets.wordmark,
  brandAssets.lockup,
] as const;
