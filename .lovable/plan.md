

## Revised Plan: Build Ebbi

The plan from the previous message remains the same, with one clarification on color usage:

### Color Application (revised)

| Role | Color | Applied to |
|------|-------|------------|
| Foreground/body text | #1c2b31 (dark muted blue) | All body text only |
| H1 headings | #406573 (muted blue) | H1 text only |
| H2/H3 headings | #548276 (sage green) | H2/H3 text only |
| Primary (interactive) | #406573 (muted blue) | Text links, focused input rings, selected states — text/border uses only |
| Accent | #D7ECE9 (teal) / #DFEBDE (sage) | Buttons, card shadows, background highlights, toggle fills, chip backgrounds |
| Background | #FAF9F6 (warm off-white) | Page background |
| Cards | #FFFFFF | Card surfaces |

Key distinction: `--primary` in the CSS will map to the muted blue but is used for **text and border accents**, not button fills. Buttons and interactive surface fills use the teal/sage accent colors instead. Shadows use a tinted warm tone rather than pure gray.

Everything else from the approved plan stays as-is.

