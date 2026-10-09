# MAHOP Portfolio Asset Integration

**Status:** Mapped artwork integrated for local review
**Creative direction:** Nocturnal Textile Theatre — a stage, not a catalogue.

## Integration scope

Mapped artwork from the supplied portfolio asset set is now used on the Home, Work, L'Etoile MaHo, MAH★P, Aurora, About, and Material routes. The asset paths, intrinsic dimensions, descriptive alt text, placement slots, and publication-review flags are centralized in `portfolioAssets.ts`; `PortfolioImage.tsx` renders the images with intrinsic dimensions, lazy loading by default, and asynchronous decoding.

The extracted source files are copied into `public/portfolio-assets/`, retaining their supplied relative directories. Placement IDs and mappings follow the supplied `mahop-asset-placement-map.csv`. `PORTFOLIO_ASSETS` is the implementation mapping; this document is a status note, not a second source of path truth.

## Material library reconciliation

The source data retains all 27 provisional material records. The placement map identifies 24 image-backed entries; those 24 are displayed. Two duplicate candidates (MT-25 and MT-26) remain held, and one provisional record has no mapped image. The UI must continue to disclose that reconciliation instead of implying all 27 entries are verified or illustrated.

Material labels remain provisional. Image appearance and source filenames are not evidence of fibre content, construction method, provenance, or product availability. Do not add those claims without source verification.

## Review and publication constraints

- Rights and model-consent status remain unverified for assets marked `publicationReview` in `portfolioAssets.ts`. Integration is for local review; it is not rights clearance or authorization to publish.
- The unidentified portrait AB-01 is excluded. Approved illustration alternatives AB-02/AB-03 are used instead.
- The duplicate swatches MT-25/MT-26 are not copied or displayed.
- H-05/H-06 replace visually similar cover candidates with higher-resolution source files; confirm those choices against the supplied placement map before final publication.
- The map's G-01 social image and G-02 favicon deliverables remain outstanding.

## Verification status

The production build passes. A local browser smoke check directly opened all seven intended routes at a 499px viewport; all rendered images decoded successfully, and the Material inspection dialog opened and closed with focus returned to its trigger. The Home horizontal sample rail remains independently scrollable without widening the document. This is not a full desktop/responsive or accessibility audit. Review the placement map and source files for visual accuracy, and confirm rights/consent and credits with the appropriate owners before deployment.
