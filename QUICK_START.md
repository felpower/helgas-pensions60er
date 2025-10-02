# 🚀 Quick Start - Get Helga's Website Running in 5 Minutes!

## 🎯 Super Fast Setup

### 1. Install & Run (2 minutes)
```bash
npm install
npm run dev
```
Open http://localhost:5173 in your browser - the website is already working!

### 2. Add Your Photos (2 minutes)
- Drop photos into these folders:
  - `public/photos/early/` (childhood)
  - `public/photos/young/` (young adult)
  - `public/photos/family/` (family life)
  - `public/photos/recent/` (recent years)

### 3. Update Photo Lists (1 minute)
Edit `src/App.vue` and find these sections around line 200:

```javascript
const earlyYearsPhotos = ref([
  { id: 1, src: '/photos/early/YOUR_PHOTO.jpg', caption: 'Cute baby Helga! 👶', year: '1963' },
  // Add your photos here
])
```

Replace with your actual photo filenames and captions!

## 🎵 Add Music (Optional)
1. Drop MP3 files into `public/audio/`
2. Update the songs list in `src/App.vue` around line 180

## 🌐 Deploy Online (5 minutes)
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Your site will be live at `https://yourusername.github.io/repository-name`

## 🎉 That's It!
You now have a fully functional, fun, interactive birthday website! 

**The website already includes:**
- ✅ Scroll-based storytelling
- ✅ Fun animations and effects
- ✅ Mobile responsive design
- ✅ Interactive photo galleries
- ✅ Music controls
- ✅ Confetti effects (click anywhere!)
- ✅ Floating birthday elements
- ✅ Photo modal with sharing
- ✅ Completely trashy and fun design 😄

**Next steps:**
1. Add your photos and update the captions
2. Personalize the story text
3. Add music if you want
4. Deploy online
5. Surprise Helga! 🎂

**Need help?** Check `README.md` for detailed instructions or `DEPLOYMENT_GUIDE.md` for deployment help.

---
*Made with 💖 for the most fabulous 60-year-old ever!* 🎊
