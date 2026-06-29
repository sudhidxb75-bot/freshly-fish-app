# Freshly Mobile App Install Button Fix V2.1

This revision makes the Install App option easier to see.

## What changed

- Shows a visible **Install App** floating button.
- If browser install prompt is available, it opens the real install prompt.
- If browser install prompt is not available, it shows Android/iPhone install instructions.
- Service worker registration scope improved.
- Manifest updated with app ID.

## Important

The real browser install option appears only when the site is live through HTTPS.

It will not properly show if you open:

```txt
file:///...
GitHub file preview
non-HTTPS URL
inside some in-app browsers
```

## Android

Use Chrome:
1. Open the live Freshly website.
2. Wait 2 seconds.
3. Tap **Install App** button or browser menu ⋮ > Add to Home screen.

## iPhone

Use Safari:
1. Open the live Freshly website in Safari.
2. Tap Share.
3. Tap Add to Home Screen.

iPhone Safari does not always show a direct install popup button like Android Chrome.
