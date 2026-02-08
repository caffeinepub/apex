# Specification

## Summary
**Goal:** Make the Photo Gallery image viewer a constant 85% of the viewport on all devices, while fitting images proportionally within it without overflow or cropping.

**Planned changes:**
- Update the existing PhotoGallery dialog layout so the viewer container is fixed at 85vw × 85vh on both mobile and desktop, independent of the current image dimensions.
- Adjust the displayed image styling to always scale proportionally using a contain-style fit so it stays fully visible within the fixed viewer bounds and never overflows.
- Ensure header/footer remain within the fixed viewer area and manage any overflow/scrolling inside the viewer as needed to prevent content being pushed off-screen.

**User-visible outcome:** Opening the Photo Gallery shows a consistently sized viewer (85% of the viewport) that doesn’t resize between images, and all images (wide or tall) are fully visible and contained within the viewer without stretching, cropping, or horizontal overflow.
