# 📝 Content Guide for Helga's Birthday Website

## 🎯 How to Add Your Content

### 📸 Photos

1. **Copy your photos** to the appropriate folders:
   ```
   public/photos/early/    - Childhood, school years (1963-1980)
   public/photos/young/    - Young adult years (1980-1995)  
   public/photos/family/   - Family life (1995-2010)
   public/photos/recent/   - Recent years (2010-2024)
   ```

2. **Name your files** descriptively:
   ```
   helga_baby_1963.jpg
   helga_school_1975.jpg
   helga_wedding_1985.jpg
   helga_kids_2000.jpg
   ```

3. **Update the photo arrays** in `src/App.vue`:

```javascript
const earlyYearsPhotos = ref([
  { 
    id: 1, 
    src: '/photos/early/helga_baby_1963.jpg', 
    caption: 'Baby Helga being absolutely adorable! 👶', 
    year: '1963' 
  },
  { 
    id: 2, 
    src: '/photos/early/helga_school_1975.jpg', 
    caption: 'First day of school - ready to conquer the world! 📚', 
    year: '1975' 
  },
  // Add more photos...
])

const youngAdultPhotos = ref([
  { 
    id: 3, 
    src: '/photos/young/helga_graduation_1982.jpg', 
    caption: 'Graduation day - the world better watch out! 🎓', 
    year: '1982' 
  },
  // Add more photos...
])

const familyPhotos = ref([
  { 
    id: 7, 
    src: '/photos/family/helga_wedding_1985.jpg', 
    caption: 'The most beautiful bride ever! 👰', 
    year: '1985' 
  },
  // Add more photos...
])

const recentPhotos = ref([
  { 
    id: 10, 
    src: '/photos/recent/helga_vacation_2023.jpg', 
    caption: 'Living her best life at 59! 🌴', 
    year: '2023' 
  },
  // Add more photos...
])
```

### 🎵 Music

1. **Add music files** to `public/audio/`:
   ```
   happy-birthday.mp3
   celebration.mp3
   dancing-queen.mp3
   sweet-caroline.mp3
   her-favorite-song.mp3
   ```

2. **Update the songs array** in `src/App.vue`:

```javascript
const songs = ref([
  { name: "Happy Birthday", src: "/audio/happy-birthday.mp3" },
  { name: "Celebration - Kool & The Gang", src: "/audio/celebration.mp3" },
  { name: "Dancing Queen - ABBA", src: "/audio/dancing-queen.mp3" },
  { name: "Sweet Caroline", src: "/audio/sweet-caroline.mp3" },
  { name: "Her Favorite Song", src: "/audio/her-favorite-song.mp3" }
])
```

### 🎬 Videos

You can use both **local video files** and **YouTube videos**!

#### Option 1: Local Video Files
1. **Add video files** to `public/videos/`:
   ```
   family-moments.mp4
   birthday-compilation.mp4
   vacation-highlights.mp4
   ```

2. **Update the videos array** in `src/App.vue`:

```javascript
const familyVideos = ref([
  { 
    id: 1, 
    src: '/videos/family-moments.mp4', 
    caption: 'Best family moments compilation! 👨‍👩‍👧‍👦',
    type: 'file'
  }
])
```

#### Option 2: YouTube Videos (Recommended for singing performances!)
Perfect for your mom's singing career - no need to download large files!

```javascript
const familyVideos = ref([
  { 
    id: 1, 
    src: 'https://www.youtube.com/watch?v=VIDEO_ID_HERE', 
    caption: 'Helga\'s amazing singing performance! 🎤✨',
    type: 'youtube'
  },
  { 
    id: 2, 
    src: 'https://youtu.be/VIDEO_ID_HERE', 
    caption: 'Another beautiful song by our star! 🌟🎵',
    type: 'youtube'
  }
])
```

#### YouTube URL Formats Supported:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Just the video ID: `VIDEO_ID`

#### Mix Both Types:
```javascript
const familyVideos = ref([
  { 
    id: 1, 
    src: '/videos/family-moments.mp4', 
    caption: 'Family home videos! 👨‍👩‍👧‍👦',
    type: 'file'
  },
  { 
    id: 2, 
    src: 'https://www.youtube.com/watch?v=abc123', 
    caption: 'Helga singing at the local theater! 🎭🎤',
    type: 'youtube'
  }
])
```

### ✍️ Story Text

Update the story sections in `src/App.vue` to personalize them:

```javascript
// In the template section, find and update these:

<!-- Early Years Section -->
<div class="story-text" data-aos="flip-left">
  <p>Here's where you tell the story of baby Helga! 👶</p>
  <p>Maybe mention her first words, favorite toys, or funny childhood stories!</p>
</div>

<!-- Young Adult Section -->
<div class="story-text" data-aos="flip-right">
  <p>The years when Helga was [add her achievements/adventures]!</p>
  <p>Talk about her education, first job, travels, or hobbies! ✨</p>
</div>

<!-- Family Section -->
<div class="story-text" data-aos="slide-up">
  <p>The chapter where Helga became [mom/wife/etc.]!</p>
  <p>Share stories about family life, kids, pets, or special moments! 💕</p>
</div>

<!-- Recent Years -->
<div class="story-text" data-aos="slide-right">
  <p>Recent adventures and new chapters in Helga's amazing life!</p>
  <p>Mention hobbies, travels, grandkids, or new interests! 🌟</p>
</div>
```

## 💡 Content Ideas

### 📸 Photo Categories
- **Baby/Childhood:** First photos, family portraits, school pictures
- **Young Adult:** Graduation, first job, travels, friends
- **Family Life:** Wedding, kids, holidays, family vacations
- **Recent Years:** Hobbies, grandchildren, recent adventures

### 🎵 Music Suggestions
- Her favorite songs from different decades
- Songs from her wedding
- Music she danced to
- Songs that remind the family of her
- Classic birthday songs

### 🎬 Video Ideas

#### YouTube Videos (Perfect for singers!):
- Her singing performances from YouTube
- Concert recordings
- Karaoke nights
- Music videos she appeared in
- Choir or band performances
- Local theater productions

#### Local Video Files:
- Compilation of family moments
- Birthday messages from family/friends
- Old home movies digitized
- Recent vacation highlights
- Funny moments compilation
- Private family recordings

### ✍️ Story Themes
- Funny childhood stories
- Her greatest achievements
- Family traditions she started
- Her impact on others
- Dreams she's fulfilled
- Adventures she's had

## 🎨 Caption Writing Tips

### Make them personal and funny:
- ✅ "Helga at 5, already planning world domination! 👑"
- ✅ "The day she discovered chocolate - life was never the same! 🍫"
- ✅ "Proof that she's always been fabulous! 💅"

### Include specific details:
- ✅ "Summer vacation 1987 - the infamous sunburn incident! ☀️"
- ✅ "First day at her dream job, ready to change the world! 💼"

### Use emojis for fun:
- 👶 Baby/childhood
- 🎓 School/graduation
- 💕 Love/family
- 🌟 Achievements
- 🎉 Celebrations
- 🌍 Travel
- 💪 Strength/determination

## 🚀 Quick Setup Checklist

- [ ] Copy photos to appropriate folders
- [ ] Update photo arrays in App.vue
- [ ] Add music files to public/audio/
- [ ] Update songs array in App.vue
- [ ] Add videos to public/videos/
- [ ] Update videos array in App.vue
- [ ] Personalize story text sections
- [ ] Write funny, personal captions
- [ ] Test the website locally
- [ ] Deploy to GitHub Pages or Netlify

## 🎂 Remember

This is a celebration of an amazing person! The more personal, funny, and heartfelt you make it, the more special it will be. Don't worry about being perfect - focus on capturing the joy and love that Helga brings to everyone's life! 💖
