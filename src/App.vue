<template>
  <div id="app" @click="addConfetti">
    <!-- Quiz Gate - appears first -->
    <QuizGate @unlock="unlockWebsite" />
    
    <!-- Main Website Content - only shown after quiz -->
    <div v-if="websiteUnlocked" class="main-website">
      <!-- Floating Fun Elements -->
      <FloatingElements />
      
      <!-- Music Controls -->
      <MusicControls 
        :isPlaying="musicPlaying" 
        :volume="musicVolume"
        :currentSong="currentSong"
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
             🎉 HELGAS FANTASTISCHER 60. GEBURTSTAG! 🎂
           </h1>
           <div class="hero-subtitle" data-aos="zoom-in" data-aos-delay="500">
             <p>Mach dich bereit für die tollste Geburtstagsreise aller Zeiten!</p>
             <div class="scroll-hint" data-aos="bounce" data-aos-delay="1000">
               👇 Scroll nach unten für das Abenteuer! 👇
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
        <h2 class="section-title">👶 Die frühen Jahre 👶</h2>
        <div class="story-text" data-aos="flip-left">
          <p>Es war einmal, in einem Land weit, weit weg... nur ein Scherz! 😄</p>
          <p>Aber im Ernst, lass uns eine Reise in die Vergangenheit machen und sehen, wie unsere wunderbare Helga zu der Legende wurde, die sie heute ist!</p>
        </div>
        <PhotoGrid 
          :photos="earlyYearsPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
      </section>

      <!-- Young Adult Adventures -->
      <section id="young-adult" class="section" data-aos="fade-left">
        <h2 class="section-title">🌟Der Anfang von etwas ganz großem🌟</h2>
        <div class="story-text" data-aos="flip-right">
          <p>Die Jahre, in denen Helga die Welt eroberte, ein Musikalisches Abenteuer nach dem anderen!</p>
          <p>Die Reitzenberger Dirndln überall auf Tour! ✨</p>
        </div>
        <PhotoGrid 
          :photos="youngAdultPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
      </section>

      <!-- Family Life Section -->
      <section id="family-life" class="section" data-aos="zoom-in">
        <h2 class="section-title">👨‍👩‍👧‍👦 Familienabenteuer 👨‍👩‍👧‍👦</h2>
        <div class="story-text" data-aos="slide-up">
          <p>Das Kapitel, in dem Helga zur weltbesten Mama wurde!</p>
          <p>Kinder großziehen, Erinnerungen schaffen und dabei immer noch fabelhaft aussehen! 💅</p>
        </div>
        <PhotoGrid 
          :photos="familyPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
      </section>

      <!-- Pazi Section -->
      <section id="pazi" class="section" data-aos="fade-up">
        <h2 class="section-title">👩‍👦 Sohn Pazi und Mama Helga 👩‍👦</h2>
        <div class="story-text" data-aos="slide-right">
          <p>Mama Helga und ihr kleiner Pazi - ein unschlagbares Team!</p>
          <p>Gemeinsam erleben sie die schönsten Abenteuer und schaffen unvergessliche Erinnerungen.</p>
        </div>
        <PhotoGrid 
          :photos="paziPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
      </section>

      <!-- Recent Years Section -->
      <section id="recent-years" class="section" data-aos="fade-up">
        <h2 class="section-title">🎉 Die goldenen Party Jahre 🥳</h2>
        <div class="story-text" data-aos="slide-right">
          <p>Neue Abenteuer, neue Hobbys und der Beweis, dass 60 das neue 30 ist!</p>
          <p>Immer noch fabelhaft, immer noch erstaunlich, immer noch unser Lieblingsmensch! 🌟</p>
        </div>
        <PhotoGrid 
          :photos="recentPhotos" 
          @photo-click="openPhotoModal"
          data-aos="fade-up"
        />
      </section>

      <!-- Performances Section -->
      <section id="performances" class="section performances-section" data-aos="fade-up">
        <h2 class="section-title">🎤 Helgas größte Auftritte 🎵</h2>
        <div class="story-text" data-aos="slide-up">
          <p>Die Bühne war schon immer ihr zweites Zuhause! 🎭</p>
          <p>Vom örtlichen Wirtshaus bis zum Musikanten und Silvesterstadl - Helgas Stimme hat unzählige Herzen erfreut! ✨🎶</p>
        </div>
        
        <VideoPlayer 
          v-if="familyVideos.length > 0"
          :videos="familyVideos"
          data-aos="zoom-in"
          data-aos-delay="300"
        />
      </section>



      <!-- Birthday Wishes Section -->
      <section id="birthday-wishes" class="section birthday-section" data-aos="zoom-in">
        <h2 class="section-title party-mode">🎊 ALLES GUTE ZUM 60. GEBURTSTAG! 🎊</h2>
        <div class="birthday-content">
          <div class="birthday-message" data-aos="bounce">
            <p>🎉 Sechzig Jahre voller Großartigkeit! 🎉</p>
            <p>🌟 Auf viele weitere Abenteuer! 🌟</p>
            <p>💖 Du wirst nicht älter, du wirst besser! 💖</p>
            <p>🎂 Möge dein Tag voller Lachen, Liebe und Kuchen sein! 🎂</p>
            <p>💖 Mama ich hab dich unendlich lieb, danke dass es dich gibt! 🥰</p>
            <p>🎉 Auf viele weitere Jahre voller Abenteuer 🎉</p>
            <p>🎁 Hiermit möchten wir dir das Hauptgeschenk überreichen! 🎁</p>
          </div>
          
          <div class="birthday-stats" data-aos="fade-up" data-aos-delay="500">
            <div class="stat-item">
              <div class="stat-number">60</div>
              <div class="stat-label">Jahre voller Großartigkeit</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">∞</div>
              <div class="stat-label">Erinnerungen geschaffen</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">💯</div>
              <div class="stat-label">Fabelhafte Stufe</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Photo Modal -->
    <PhotoModal 
      v-if="selectedPhoto"
      :photo="selectedPhoto"
      :hasPrevious="hasPreviousPhoto"
      :hasNext="hasNextPhoto"
      @close="closePhotoModal"
      @prev-photo="goToPreviousPhoto"
      @next-photo="goToNextPhoto"
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
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useScroll } from '@vueuse/core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import components
import QuizGate from './components/QuizGate.vue'
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
    QuizGate,
    FloatingElements,
    MusicControls,
    ScrollIndicator,
    PhotoGrid,
    VideoPlayer,
    PhotoModal
  },
  setup() {
    // Reactive data
    const websiteUnlocked = ref(false)
    const musicPlaying = ref(false)
    const musicVolume = ref(0.5)
    const currentSongIndex = ref(0)
    const selectedPhoto = ref(null)
    const currentPhotoIndex = ref(0)
    const currentPhotoSection = ref('')
    const currentSection = ref(0)
    const backgroundMusic = ref(null)

    // Sample data - you'll replace these with your actual content
    const songs = ref([
      { name: "Alles gute zum Geburtstag", src: "/audio/alles_gute_zum_geburtstag.mp3" },
      { name: "Der Frohe Wanderer", src: "/audio/der_frohe_wanderer.mp3" },
      { name: "Heimaterinnerung", src: "/audio/heimaterinnerung.mp3" },
      { name: "Hoch von den Bergen", src: "/audio/hoch_von_den_bergen.mp3" },
      { name: "Tritsch Tratsch", src: "/audio/Tritsch_Tratsch.mp3" },
    ])

    const sections = ref([
      { id: 'hero', name: 'Start', emoji: '🎉' },
      { id: 'early-years', name: 'Frühe Jahre', emoji: '👶' },
      { id: 'young-adult', name: 'Jung & Wild', emoji: '🌟' },
      { id: 'family-life', name: 'Familie', emoji: '👨‍👩‍👧‍👦' },
      { id: 'pazi', name: 'Pazi', emoji: '👩‍👦' },
      { id: 'recent-years', name: 'Goldene Jahre', emoji: '🎭' },
      { id: 'performances', name: 'Auftritte', emoji: '🎤' },
      { id: 'birthday-wishes', name: 'Geburtstag!', emoji: '🎂' }
    ])

    const earlyYearsPhotos = ref([
      { id: 1, src: '/photos/early/Babies.jpg', caption: 'Baby Helga und Vroni - einfach zum Verlieben! 👶' },
      { id: 2, src: '/photos/early/MitBlume.jpg', caption: 'Erste Schritte ins Großartige! 👣' },
      { id: 3, src: '/photos/early/HelgaUndArny1.jpg', caption: 'Helga und ihr Idol, der Arny 📚' }
    ])

    const youngAdultPhotos = ref([
      { id: 1, src: '/photos/vroni/Klein.jpg', caption: 'Von kleinauf schon ein Hingucker! 👶' },
      { id: 2, src: '/photos/vroni/Blumen.jpg', caption: 'Auch oben auf den Tischen wurde gesungen! ✨' },
      { id: 3, src: '/photos/vroni/CD.jpg', caption: 'Die erste CD! 🌍' },
      { id: 4, src: '/photos/vroni/AlbumCoverDeisenbach.png', caption: 'Ein weiteres Album Cover dieses mal beim Deisenbach oben! 📸' },
      { id: 5, src: '/photos/vroni/Dirndl.jpg', caption: 'Jede Gaststube wurde zur Bühne! 🌍' },
      { id: 6, src: '/photos/vroni/Auszeichnung.jpg', caption: 'Auch diverse Auszeichnungen dürfen nicht fehlen! 🏆' },
      { id: 7, src: '/photos/vroni/DirndlBaWArni.png', caption: 'Auch mit Prominenten dürfen ein paar Fotos nicht fehlen! 💃' },
      { id: 8, src: '/photos/vroni/VormKamin.jpg', caption: 'Ein unvergesslicher Live-Auftritt mit den Reitzenden Reitzenberger Dirndln! 🎤' }
    ])

    const familyPhotos = ref([
      { id: 1, src: '/photos/family/baden.jpg', caption: 'Der eigene Pool zuhause, einfach eine Oase der Ruhe! 👩‍👧‍👦' },
      { id: 3, src: '/photos/family/SkiWMAlm.jpg', caption: 'Magische Momente bei der Musikanten Ski WM am Berg auf der Alm! ⛷️' },
      { id: 4, src: '/photos/family/WienerAdvent.jpg', caption: 'Auch beim Punsch trinken is die Helga immer dabei! 🍷' },
      { id: 5, src: '/photos/family/AnkunftPaziGrp.jpg', caption: 'Überraschende Mitternachtsankunft vom Pazi nach 1/2 Jahr in der USA! ✈️' },
      { id: 2, src: '/photos/family/BadenStrandArni.jpg', caption: 'Urlaub am Strand mit der Family, jedes Jahr wieder gerne! 🏖️' },
      { id: 6, src: '/photos/family/MusikantenSkiWMEssen.jpg', caption: 'Essen bei der Musikanten Ski WM, ein Fest für die Sinne! 🎶' },
      { id: 7, src: '/photos/family/Pizza.jpg', caption: 'Gemeinsames Pizzaessen - ein Familienfest! 🍕' },
      { id: 8, src: '/photos/family/KathiPeruecke.jpg', caption: 'Vorbereitung für den großen Auftritt! 👗' }
    ])

    const paziPhotos = ref([
      { id: 2, src: '/photos/pazi/SkifoahnStahu.jpg', caption: 'Abschluss beim Reitzi Ski Ausflug in der Alm Arena' },
      { id: 3, src: '/photos/pazi/BergArni.jpg', caption: 'Auch am Berg wird fleißig Party gemacht! 🎶' },
      {id : 4, src: '/photos/pazi/LaungaLulatsch.jpg', caption: 'Auch gemeinsam aufs Festival fahren die beiden! 🎉'},
      { id: 1, src: '/photos/pazi/AnkunftPazi.jpg', caption: 'Helga und Pazi - nach einem halben Jahr endlich wieder vereint! 👩‍👦' },
      { id: 5, src: '/photos/pazi/PaziBaby.jpg', caption: 'Mama Helga und ihr kleiner Pazi beim Baden! 🏊'       },
      { id: 6, src: '/photos/pazi/PaziKuchenBaby.jpg', caption: 'Gemeinsam am Kuchen essen, immer wieder eine Sauerei gewesen! 🎂' }
    ]) 

    const recentPhotos = ref([ 
      { id: 1, src: '/photos/party/WoodstockDahoam1Arni.jpg', caption: 'Woodstock der Blasmusik dahoam! 💅'},
      { id: 2, src: '/photos/party/ImBumsBus.jpg', caption: 'Am Ende noch den Bums Bus ausgeräumt! 🌟'},
      { id: 3, src: '/photos/party/Zeltfest.jpg', caption: 'Jedes Zeltfest ist immer a Hit' },
      { id: 5, src: '/photos/party/Seidlbar.jpg', caption: 'Die Seidlbar - ein Ort für gute Laune! 🍹' },
      { id: 6, src: '/photos/party/HelgaUntermTisch.jpg', caption: 'Wen sie da wohl gesucht hat? 🤔' },
      { id: 7, src: '/photos/party/SignaArni.jpg', caption: 'Auch die Behörden wurden eingeschalten beim Signa Skandal! 🚨' },
      { id: 8, src: '/photos/party/ThumbsUp.jpg', caption: 'Die besten Momente mit den besten Schwestern! 👯‍♀️' },
      { id: 4, src: '/photos/party/HelgaVollsuff.jpg', caption: 'Helga in Partylaune! 🥳' },

    ])

     const familyVideos = ref([
       { 
         id: 1, 
         src: 'https://www.youtube.com/watch?v=jdzK4uROk8I', 
         caption: 'Die reitzenden Reitzenberger Dirndln!', 
         type: 'youtube' 
       },
       { 
         id: 2, 
         src: 'https://www.youtube.com/watch?v=apjYwq3_XiU', 
         caption: 'Wie die Alten sungen… Helgas fantastische Gesangsperformance! 🎤✨', 
         type: 'youtube' 
       },
       { 
         id: 3, 
         src: 'https://www.youtube.com/watch?v=u5DEt9ruir0', 
         caption: 'Auch in Graz warens beim Musikantenstadl 1985! 🌟🎵', 
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
      
      // Warte kurz und spiele dann den neuen Song ab wenn Musik läuft
      setTimeout(() => {
        if (backgroundMusic.value && musicPlaying.value) {
          backgroundMusic.value.load() // Lade die neue Quelle
          backgroundMusic.value.play().catch(e => console.log('Fehler beim Abspielen:', e))
        }
      }, 100)
    }

    const openPhotoModal = (photo) => {
      selectedPhoto.value = photo
      
      // Finde heraus, in welchem Abschnitt das Foto ist
      let sectionPhotos = []
      let sectionName = ''
      
      if (earlyYearsPhotos.value.includes(photo)) {
        sectionPhotos = earlyYearsPhotos.value
        sectionName = 'early-years'
      } else if (youngAdultPhotos.value.includes(photo)) {
        sectionPhotos = youngAdultPhotos.value
        sectionName = 'young-adult'
      } else if (familyPhotos.value.includes(photo)) {
        sectionPhotos = familyPhotos.value
        sectionName = 'family'
      } else if (recentPhotos.value.includes(photo)) {
        sectionPhotos = recentPhotos.value
        sectionName = 'recent'
      }
      
      currentPhotoIndex.value = sectionPhotos.findIndex(p => p.id === photo.id)
      currentPhotoSection.value = sectionName
    }

    const closePhotoModal = () => {
      selectedPhoto.value = null
      currentPhotoIndex.value = 0
      currentPhotoSection.value = ''
    }

    const goToPreviousPhoto = () => {
      const sectionPhotos = getCurrentSectionPhotos()
      if (currentPhotoIndex.value > 0) {
        currentPhotoIndex.value--
        selectedPhoto.value = sectionPhotos[currentPhotoIndex.value]
      }
    }

    const goToNextPhoto = () => {
      const sectionPhotos = getCurrentSectionPhotos()
      if (currentPhotoIndex.value < sectionPhotos.length - 1) {
        currentPhotoIndex.value++
        selectedPhoto.value = sectionPhotos[currentPhotoIndex.value]
      }
    }

    const getCurrentSectionPhotos = () => {
      switch (currentPhotoSection.value) {
        case 'early-years':
          return earlyYearsPhotos.value
        case 'young-adult':
          return youngAdultPhotos.value
        case 'family':
          return familyPhotos.value
        case 'recent':
          return recentPhotos.value
        default:
          return []
      }
    }

    const hasPreviousPhoto = computed(() => {
      return currentPhotoIndex.value > 0
    })

    const hasNextPhoto = computed(() => {
      const sectionPhotos = getCurrentSectionPhotos()
      return currentPhotoIndex.value < sectionPhotos.length - 1
    })

    const scrollToSection = (sectionIndex) => {
      const sectionId = sections.value[sectionIndex].id
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const unlockWebsite = () => {
      websiteUnlocked.value = true
      
      // Start celebration music after a short delay
      setTimeout(() => {
        if (backgroundMusic.value) {
          backgroundMusic.value.volume = musicVolume.value
          backgroundMusic.value.play()
          musicPlaying.value = true
        }
      }, 1000)
    }

    const addConfetti = (event) => {
      if (!websiteUnlocked.value) return // Only allow confetti after unlock
      
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
      websiteUnlocked,
      musicPlaying,
      musicVolume,
      selectedPhoto,
      currentSection,
      backgroundMusic,
      sections,
      earlyYearsPhotos,
      youngAdultPhotos,
      familyPhotos,
      paziPhotos,
      recentPhotos,
      familyVideos,
      
      // Computed
      currentSong,
      hasPreviousPhoto,
      hasNextPhoto,
      
      // Methods
      unlockWebsite,
      toggleMusic,
      changeVolume,
      nextSong,
      openPhotoModal,
      closePhotoModal,
      goToPreviousPhoto,
      goToNextPhoto,
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

.performances-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: black;
  position: relative;
  overflow: hidden;
}

.performances-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="20" opacity="0.1">🎵</text></svg>') repeat;
  pointer-events: none;
  z-index: 0;
}

.performances-section .section-title,
.performances-section .story-text {
  position: relative;
  z-index: 1;
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
