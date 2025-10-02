<template>
  <div id="app" @click="addConfetti">
    <!-- Floating Fun Elements -->
    <FloatingElements />
    
    <!-- Music Controls -->
    <MusicControls 
      :isPlaying="musicPlaying" 
      :volume="musicVolume"
      @toggle-music="toggleMusic"
      @volume-change="changeVolume"
      @next-song="nextSong"
    />
    
    <!-- Scroll Indicator -->
    <ScrollIndicator 
      :sections="sections" 
      :currentSection="currentSection"
      @scroll-to="scrollToSection"
    />
    
    <!-- Main Content Sections -->
    <div class="main-content">
      <!-- Hero Section -->
      <section id="hero" class="section hero-section" data-aos="fade-up">
        <div class="hero-content">
          <h1 class="section-title rainbow-text">
            🎉 HELGA'S FABULOUS 60TH UND PENSION! 🎂
          </h1>
          <div class="hero-subtitle" data-aos="zoom-in" data-aos-delay="500">
            <p>Get ready for the most epic birthday journey ever!</p>
            <div class="scroll-hint" data-aos="bounce" data-aos-delay="1000">
              👇 Scroll down for the adventure! 👇
            </div>
          </div>
        </div>
        <div class="hero-decorations">
          <div class="birthday-cake">🎂</div>
          <div class="party-hat">🎩</div>
          <div class="balloons">🎈🎈🎈</div>
        </div>
      </section>

      <!-- Early Years Section -->
      <section id="early-years" class="section" data-aos="fade-right">
        <h2 class="section-title">👶 The Early Years 👶</h2>
        <div class="story-text" data-aos="flip-left">
          <p>Once upon a time, in a land far, far away... just kidding! 😄</p>
          <p>But seriously, let's take a trip down memory lane and see how our amazing Helga became the legend she is today!</p>
        </div>
        <PhotoGrid 
          :photos="earlyYearsPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
      </section>

      <!-- Young Adult Adventures -->
      <section id="young-adult" class="section" data-aos="fade-left">
        <h2 class="section-title">🌟 Young & Wild 🌟</h2>
        <div class="story-text" data-aos="flip-right">
          <p>The years when Helga was conquering the world, one adventure at a time!</p>
          <p>Fashion icon, trendsetter, and all-around awesome human being! ✨</p>
        </div>
        <PhotoGrid 
          :photos="youngAdultPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
      </section>

      <!-- Family Life Section -->
      <section id="family-life" class="section" data-aos="zoom-in">
        <h2 class="section-title">👨‍👩‍👧‍👦 Family Adventures 👨‍👩‍👧‍👦</h2>
        <div class="story-text" data-aos="slide-up">
          <p>The chapter where Helga became the world's most amazing mom!</p>
          <p>Raising kids, creating memories, and still managing to look fabulous! 💅</p>
        </div>
        <PhotoGrid 
          :photos="familyPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
        
        <!-- Video Section -->
        <VideoPlayer 
          v-if="familyVideos.length > 0"
          :videos="familyVideos"
          data-aos="zoom-in"
          data-aos-delay="300"
        />
      </section>

      <!-- Recent Years Section -->
      <section id="recent-years" class="section" data-aos="fade-up">
        <h2 class="section-title">🎭 The Golden Years 🎭</h2>
        <div class="story-text" data-aos="slide-right">
          <p>Recent adventures, new hobbies, and proving that 60 is the new 30!</p>
          <p>Still fabulous, still amazing, still our favorite person! 🌟</p>
        </div>
        <PhotoGrid 
          :photos="recentPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
      </section>

      <!-- Birthday Wishes Section -->
      <section id="birthday-wishes" class="section birthday-section" data-aos="zoom-in">
        <h2 class="section-title party-mode">🎊 HAPPY 60TH BIRTHDAY! 🎊</h2>
        <div class="birthday-content">
          <div class="birthday-message" data-aos="bounce">
            <p>🎉 Sixty years of awesome! 🎉</p>
            <p>🌟 Here's to many more adventures! 🌟</p>
            <p>💖 You're not getting older, you're getting better! 💖</p>
            <p>🎂 May your day be filled with laughter, love, and cake! 🎂</p>
          </div>
          
          <div class="birthday-stats" data-aos="fade-up" data-aos-delay="500">
            <div class="stat-item">
              <div class="stat-number">60</div>
              <div class="stat-label">Years of Awesome</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">∞</div>
              <div class="stat-label">Memories Made</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">💯</div>
              <div class="stat-label">Fabulous Level</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Photo Modal -->
    <PhotoModal 
      v-if="selectedPhoto"
      :photo="selectedPhoto"
      @close="closePhotoModal"
    />

    <!-- Background Audio -->
    <audio 
      ref="backgroundMusic" 
      loop 
      preload="auto"
      @ended="nextSong"
    >
      <source :src="currentSong.src" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useScroll } from '@vueuse/core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import components
import FloatingElements from './components/FloatingElements.vue'
import MusicControls from './components/MusicControls.vue'
import ScrollIndicator from './components/ScrollIndicator.vue'
import PhotoGrid from './components/PhotoGrid.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import PhotoModal from './components/PhotoModal.vue'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'App',
  components: {
    FloatingElements,
    MusicControls,
    ScrollIndicator,
    PhotoGrid,
    VideoPlayer,
    PhotoModal
  },
  setup() {
    // Reactive data
    const musicPlaying = ref(false)
    const musicVolume = ref(0.5)
    const currentSongIndex = ref(0)
    const selectedPhoto = ref(null)
    const currentSection = ref(0)
    const backgroundMusic = ref(null)

    // Sample data - you'll replace these with your actual content
    const songs = ref([
      { name: "Happy Birthday Song", src: "/audio/happy-birthday.mp3" },
      { name: "Celebration", src: "/audio/celebration.mp3" },
      { name: "Good Times", src: "/audio/good-times.mp3" },
      { name: "Dancing Queen", src: "/audio/dancing-queen.mp3" },
      { name: "Sweet Caroline", src: "/audio/sweet-caroline.mp3" }
    ])

    const sections = ref([
      { id: 'hero', name: 'Start' },
      { id: 'early-years', name: 'Early Years' },
      { id: 'young-adult', name: 'Young & Wild' },
      { id: 'family-life', name: 'Family' },
      { id: 'recent-years', name: 'Golden Years' },
      { id: 'birthday-wishes', name: 'Birthday!' }
    ])

    // Sample photo data - replace with your actual photos
    const earlyYearsPhotos = ref([
      { id: 1, src: '/photos/early/photo1.jpg', caption: 'Baby Helga being adorable! 👶', year: '1963' },
      { id: 2, src: '/photos/early/photo2.jpg', caption: 'First steps into awesomeness! 👣', year: '1965' },
      { id: 3, src: '/photos/early/photo3.jpg', caption: 'School days and big dreams! 📚', year: '1970' }
    ])

    const youngAdultPhotos = ref([
      { id: 4, src: '/photos/young/photo1.jpg', caption: 'Fashion icon in the making! 💃', year: '1980' },
      { id: 5, src: '/photos/young/photo2.jpg', caption: 'Living her best life! ✨', year: '1985' },
      { id: 6, src: '/photos/young/photo3.jpg', caption: 'Adventure time! 🌍', year: '1988' }
    ])

    const familyPhotos = ref([
      { id: 7, src: '/photos/family/photo1.jpg', caption: 'The best mom ever! 👩‍👧‍👦', year: '1995' },
      { id: 8, src: '/photos/family/photo2.jpg', caption: 'Family vacation memories! 🏖️', year: '2000' },
      { id: 9, src: '/photos/family/photo3.jpg', caption: 'Creating magical moments! ✨', year: '2005' }
    ])

    const recentPhotos = ref([
      { id: 10, src: '/photos/recent/photo1.jpg', caption: 'Still fabulous at 59! 💅', year: '2023' },
      { id: 11, src: '/photos/recent/photo2.jpg', caption: 'New adventures await! 🌟', year: '2024' },
      { id: 12, src: '/photos/recent/photo3.jpg', caption: 'Ready for 60! 🎉', year: '2024' }
    ])

     const familyVideos = ref([
       { 
         id: 1, 
         src: '/videos/family-moments.mp4', 
         caption: 'Best family moments compilation!', 
         type: 'file' 
       },
       { 
         id: 2, 
         src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
         caption: 'Helga\'s amazing singing performance! 🎤✨', 
         type: 'youtube' 
       },
       { 
         id: 3, 
         src: 'https://youtu.be/dQw4w9WgXcQ', 
         caption: 'Another beautiful song by our star! 🌟🎵', 
         type: 'youtube' 
       }
     ])

    // Computed properties
    const currentSong = computed(() => songs.value[currentSongIndex.value])

    // Methods
    const toggleMusic = () => {
      if (musicPlaying.value) {
        backgroundMusic.value.pause()
      } else {
        backgroundMusic.value.play()
      }
      musicPlaying.value = !musicPlaying.value
    }

    const changeVolume = (volume) => {
      musicVolume.value = volume
      backgroundMusic.value.volume = volume
    }

    const nextSong = () => {
      currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length
      if (musicPlaying.value) {
        setTimeout(() => {
          backgroundMusic.value.play()
        }, 100)
      }
    }

    const openPhotoModal = (photo) => {
      selectedPhoto.value = photo
    }

    const closePhotoModal = () => {
      selectedPhoto.value = null
    }

    const scrollToSection = (sectionIndex) => {
      const sectionId = sections.value[sectionIndex].id
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const addConfetti = (event) => {
      // Create confetti at click position
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
      
      for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div')
        confetti.className = 'confetti'
        confetti.style.left = event.clientX + 'px'
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.width = Math.random() * 10 + 5 + 'px'
        confetti.style.height = confetti.style.width
        confetti.style.animationDelay = Math.random() * 2 + 's'
        
        document.body.appendChild(confetti)
        
        setTimeout(() => {
          confetti.remove()
        }, 3000)
      }
    }

    const setupScrollAnimations = () => {
      // Parallax effects
      gsap.utils.toArray('.section').forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            currentSection.value = i
          },
          onEnterBack: () => {
            currentSection.value = i
          }
        })
      })

      // Hero decorations animation
      gsap.to('.birthday-cake', {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: 'none'
      })

      gsap.to('.balloons', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })

      gsap.to('.party-hat', {
        rotation: -10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      })
    }

    // Lifecycle hooks
    onMounted(() => {
      setupScrollAnimations()
      
      // Set initial volume
      if (backgroundMusic.value) {
        backgroundMusic.value.volume = musicVolume.value
      }
    })

    onUnmounted(() => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    })

    return {
      // Reactive data
      musicPlaying,
      musicVolume,
      selectedPhoto,
      currentSection,
      backgroundMusic,
      sections,
      earlyYearsPhotos,
      youngAdultPhotos,
      familyPhotos,
      recentPhotos,
      familyVideos,
      
      // Computed
      currentSong,
      
      // Methods
      toggleMusic,
      changeVolume,
      nextSong,
      openPhotoModal,
      closePhotoModal,
      scrollToSection,
      addConfetti
    }
  }
}
</script>

<style scoped>
.main-content {
  position: relative;
  z-index: 1;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  z-index: 2;
  position: relative;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-top: 2rem;
}

.scroll-hint {
  font-size: 1.2rem;
  margin-top: 3rem;
  animation: bounce 2s infinite;
}

.hero-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.birthday-cake {
  position: absolute;
  top: 20%;
  left: 10%;
  font-size: 4rem;
}

.party-hat {
  position: absolute;
  top: 30%;
  right: 15%;
  font-size: 3rem;
}

.balloons {
  position: absolute;
  bottom: 20%;
  left: 20%;
  font-size: 2rem;
}

.birthday-section {
  background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  color: #333;
}

.birthday-content {
  text-align: center;
  max-width: 800px;
}

.birthday-message {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  line-height: 1.8;
}

.birthday-stats {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #ff6b6b;
  font-family: 'Fredoka One', cursive;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .hero-decorations {
    display: none;
  }
  
  .birthday-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-item {
    min-width: 200px;
  }
}
</style>
