# Freshly Backend Banner Control Guide

Freshly banners can be controlled from the Google Sheet backend using the **Banners** tab.

## Banners sheet columns

| Column | Use |
|---|---|
| BannerID | Unique ID such as BAN001, BAN002 |
| Label | Small tag text for overlay banners |
| Title | Main banner title |
| Subtitle | Short description |
| ImageURL | Banner image URL or local path |
| ButtonText | Button label |
| ButtonLink | Button target link |
| SortOrder | Display order, for example 1, 2, 3 |
| Status | Active or Inactive |
| DisplayMode | ImageOnly or OverlayText |
| CreatedAt | Created date/time |
| UpdatedAt | Updated date/time |

## Recommended banner modes

### Image-only banner
Use this when the banner image already contains all text and design.

Required values:
- `ImageURL`: full image URL or local image path
- `DisplayMode`: `ImageOnly`
- `Status`: `Active`

### Overlay-text banner
Use this when you want the website to place text and button over the banner.

Required values:
- `Title`
- `Subtitle`
- `ButtonText`
- `ButtonLink`
- `DisplayMode`: `OverlayText`
- `Status`: `Active`

## Recommended banner image size

For best desktop and mobile display, use:

```txt
1920 x 600 px
```

Safe alternative:

```txt
1600 x 500 px
```

Keep important text and logo near the center because the banner uses full-width cover display.

## Hide a banner

Change:

```txt
Status = Inactive
```

## Change banner order

Change `SortOrder`.

Example:

```txt
1
2
3
```

## Important after backend changes

After editing the Banners sheet:
1. Save the Google Sheet
2. Refresh the website
3. Use incognito/private window if old banners are still showing


## If banner is not visible

Check these points in the **Banners** sheet:

1. At least one row must have `Status = Active`.
2. For image banners, `ImageURL` must not be blank.
3. For full designed image banners, use `DisplayMode = ImageOnly`.
4. If all backend banners are inactive or blank, the website now shows the default Freshly fallback banner.

## Best setup for your current design

Use designed image banners like the Hub Partner image:

```txt
DisplayMode = ImageOnly
Status = Active
Image size = 1920 x 600 px
```

This avoids text overlapping and keeps alignment clean.
