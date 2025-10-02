# 🎉 Helga's Fabulous 60th Birthday Website! 🎂

A fun, interactive, scroll-based storytelling website to celebrate Helga's amazing 60th birthday!

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your media files:**
   - Photos: Drop your photos into the appropriate folders in `public/photos/`
   - Videos: Add videos to `public/videos/`
   - Music: Add songs to `public/audio/`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 File Structure

```
public/
├── photos/
│   ├── early/          # Baby and childhood photos
│   ├── young/          # Young adult photos
│   ├── family/         # Family photos
│   └── recent/         # Recent photos
├── videos/             # Video files (.mp4, .webm)
└── audio/              # Music files (.mp3, .wav)
```

## 🎨 Features

- **Scroll-based storytelling** with smooth animations
- **Interactive photo galleries** with hover effects
- **Video player** with YouTube integration and custom controls
- **Background music** with volume controls
- **Emoji navigation** - fun scroll indicator with section emojis
- **Mobile responsive** design
- **Fun animations** and effects throughout
- **Confetti** and floating elements
- **Photo modal** with sharing capabilities

## 📸 Adding Your Photos

1. **Organize by life stages:**
   - `public/photos/early/` - Baby, childhood, school years
   - `public/photos/young/` - Young adult, college, early career
   - `public/photos/family/` - Family moments, kids, holidays
   - `public/photos/recent/` - Recent years, hobbies, adventures

2. **Update the photo data in `src/App.vue`:**
   ```javascript
   const earlyYearsPhotos = ref([
     { id: 1, src: '/photos/early/photo1.jpg', caption: 'Your caption here!', year: '1963' },
     // Add more photos...
   ])
   ```

3. **Recommended photo formats:** JPG, PNG, WebP
4. **Recommended size:** Max 2MB per photo for fast loading

## 🎵 Adding Music

1. **Add music files** to `public/audio/`
2. **Update the songs list in `src/App.vue`:**
   ```javascript
   const songs = ref([
     { name: "Song Title", src: "/audio/song1.mp3" },
     // Add more songs...
   ])
   ```

3. **Supported formats:** MP3, WAV, OGG

## 🎬 Adding Videos

### YouTube Videos (Recommended!)
Perfect for your mom's singing performances - no file size limits!

```javascript
const familyVideos = ref([
  { 
    id: 1, 
    src: 'https://www.youtube.com/watch?v=VIDEO_ID', 
    caption: 'Helga\'s amazing performance! 🎤✨',
    type: 'youtube'
  }
])
```

### Local Video Files
1. **Add video files** to `public/videos/`
2. **Update the videos list in `src/App.vue`:**
   ```javascript
   const familyVideos = ref([
     { id: 1, src: '/videos/video1.mp4', caption: 'Amazing family moments!', type: 'file' }
   ])
   ```

3. **Supported formats:** MP4, WebM
4. **Recommended size:** Max 50MB per video

See `YOUTUBE_EXAMPLES.md` for detailed YouTube integration guide!

## 🎨 Customization

### Colors
Edit the CSS variables in `src/style.css` to change the color scheme:
```css
:root {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --accent-color: #45b7d1;
}
```

### Text Content
Update the story text and captions in `src/App.vue` to personalize the content.

### Animations
Modify animation settings in the component files or add new ones using GSAP and AOS libraries.

## 🌐 Deployment

### GitHub Pages (Free)
1. **Push to GitHub repository**
2. **Enable GitHub Pages** in repository settings
3. **Set source to GitHub Actions**
4. **The site will be available at:** `https://yourusername.github.io/repository-name`

### Netlify (Free)
1. **Connect your GitHub repository** to Netlify
2. **Set build command:** `npm run build`
3. **Set publish directory:** `dist`
4. **Deploy automatically** on every push

### Manual Deployment
1. **Build the project:** `npm run build`
2. **Upload the `dist` folder** to any web hosting service

## 🎉 Tips for Maximum Fun

1. **Use high-quality photos** with good lighting
2. **Write funny, personal captions** for each photo
3. **Choose upbeat, meaningful music**
4. **Test on mobile devices** before the big day
5. **Have fun with it!** The more personal and silly, the better!

## 🛠️ Technical Details

- **Framework:** Vue.js 3 with Composition API
- **Build Tool:** Vite for fast development
- **Animations:** GSAP + AOS (Animate On Scroll)
- **Styling:** CSS3 with custom animations
- **Responsive:** Mobile-first design
- **Performance:** Optimized images and lazy loading

## 🎂 Happy 60th Birthday, Helga!

This website is made with love to celebrate an amazing person. Enjoy browsing through the memories and here's to many more wonderful years ahead! 🥳

---

*Made with 💖 for the most fabulous 60-year-old we know!*
