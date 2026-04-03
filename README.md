# 🏡 Our Little Corner of the World

A cozy personal website for two worlds — hers and his — that come together every evening.

## ✨ Features

- **Live Edmonton weather** — sky, rain, snow, day/night cycle powered by [Open-Meteo](https://open-meteo.com/) (free, no API key needed)
- **Time-of-day backdrop** — dawn, day, golden hour, evening, and night modes
- **Her World** — WFH setup, Goodreads bookshelf (CSV import), matcha/pink drink/latte vibes
- **His World** — government office day, Kindle & Audible, venti dark roast
- **Together** — The Pit, The Good Fight, evening ritual timeline, George & Jerry
- **Interactive cats** — click George or Jerry for a random sassy message
- **Animated fairy lights**, cozy book trailer café, flowers, fence, trees

## 📁 Project Structure

```
our-little-corner/
├── index.html          # Main HTML — all three worlds
├── assets/
│   ├── style.css       # All styles and animations
│   ├── app.js          # Weather, navigation, CSV import, interactions
│   ├── avatar-her.png  # ← ADD YOUR AVATAR HERE (60×110px transparent PNG)
│   └── avatar-him.png  # ← ADD YOUR AVATAR HERE (60×120px transparent PNG)
└── README.md
```

## 🧑‍🎨 Adding Your Avatars

The avatar placeholders in `index.html` load images from `assets/`:

```html
<img class="her-svg" src="assets/avatar-her.png" ... />
<img class="his-svg" src="assets/avatar-him.png" ... />
```

**Recommended specs:**
- Format: PNG with transparent background
- Her: ~60px wide × 110px tall
- Him: ~60px wide × 120px tall (he's taller!)
- Tools: [Picrew](https://picrew.me), [Ready Player Me](https://readyplayer.me), Canva, or Illustrator

You can also replace George and Jerry with real photos — just swap the `<svg>` blocks with `<img>` tags pointing to `assets/george.png` and `assets/jerry.png`.

## 📚 Importing Your Goodreads Books

1. Go to **Goodreads → My Books → Import and Export → Export Library**
2. Download the CSV file
3. Open the site → **Her World** → click the upload zone → select your CSV
4. Books appear on the shelf automatically!

## 🚀 Deploy to GitHub Pages

```bash
# 1. Create a new repo on GitHub (e.g. "our-little-corner")
git init
git add .
git commit -m "our cozy little corner ✨"
git remote add origin https://github.com/YOUR_USERNAME/our-little-corner.git
git push -u origin main

# 2. Enable GitHub Pages:
#    Repo → Settings → Pages → Source: main branch / root
#    Your site will be live at: https://YOUR_USERNAME.github.io/our-little-corner
```

## 🛠 Customisation Tips

All content is in `index.html` — search for these sections to update:

| Section | What to change |
|---|---|
| `<!-- Her World -->` | Cards, book shelf default titles |
| `<!-- His World -->` | Office details, coffee card |
| `<!-- Together -->` | Shows, evening timeline |
| `.av-bubble` text | The hover speech bubbles |
| `catQuips` in app.js | George & Jerry's sassy lines |

Weather and time auto-update on page load — Edmonton coordinates are hardcoded in `app.js` (`53.5461, -113.4938`).

---

*Made with 🍵 and ☕ — two worlds, one cozy evening.*
