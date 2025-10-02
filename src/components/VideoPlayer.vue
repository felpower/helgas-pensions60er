<template>
  <div class="video-section">
    <h3 class="video-title" data-aos="fade-up">
      🎤 Helga's Greatest Performances 🎵
    </h3>
    
    <div class="video-container" data-aos="zoom-in">
      <div class="video-wrapper">
        <!-- YouTube Video -->
        <div v-if="currentVideo.type === 'youtube'" class="youtube-container">
          <iframe
            :src="getYouTubeEmbedUrl(currentVideo.src)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            @load="onVideoLoaded"
          ></iframe>
          
          <!-- YouTube overlay effects -->
          <div class="video-effects youtube-effects">
            <div class="music-note" v-for="i in 8" :key="i">🎵</div>
            <div class="star-effect" v-for="i in 6" :key="i + 8">⭐</div>
          </div>
        </div>
        
        <!-- Regular Video File -->
        <div v-else class="regular-video-container">
          <video 
            ref="videoPlayer"
            :src="currentVideo.src"
            controls
            preload="metadata"
            @loadedmetadata="onVideoLoaded"
            @play="onVideoPlay"
            @pause="onVideoPause"
          >
            Your browser does not support the video tag.
          </video>
          
          <div class="video-overlay" v-if="!isPlaying && currentVideo.type !== 'youtube'">
            <div class="play-button" @click="playVideo">
              <div class="play-icon">▶️</div>
              <div class="play-text">Click to Play</div>
            </div>
          </div>
          
          <!-- Fun video effects -->
          <div class="video-effects" v-if="isPlaying">
            <div class="effect-particle" v-for="i in 10" :key="i"></div>
          </div>
        </div>
      </div>
      
      <div class="video-info">
        <h4 class="video-caption">{{ currentVideo.caption }}</h4>
        
        <!-- Video navigation -->
        <div class="video-nav" v-if="videos.length > 1">
          <button 
            class="nav-btn prev-btn" 
            @click="previousVideo"
            :disabled="currentVideoIndex === 0"
          >
            ⏮️ Previous
          </button>
          
          <div class="video-counter">
            {{ currentVideoIndex + 1 }} / {{ videos.length }}
          </div>
          
          <button 
            class="nav-btn next-btn" 
            @click="nextVideo"
            :disabled="currentVideoIndex === videos.length - 1"
          >
            Next ⏭️
          </button>
        </div>
        
        <!-- Video thumbnails -->
        <div class="video-thumbnails" v-if="videos.length > 1">
          <div 
            v-for="(video, index) in videos" 
            :key="video.id"
            class="thumbnail-item"
            :class="{ active: index === currentVideoIndex }"
            @click="selectVideo(index)"
          >
            <div class="thumbnail-placeholder">
              🎥
            </div>
            <div class="thumbnail-title">{{ video.caption }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'VideoPlayer',
  props: {
    videos: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const videoPlayer = ref(null)
    const currentVideoIndex = ref(0)
    const isPlaying = ref(false)
    const isLoaded = ref(false)
    
    const currentVideo = computed(() => {
      return props.videos[currentVideoIndex.value] || {
        src: '/videos/placeholder.mp4',
        caption: 'No video available',
        type: 'file'
      }
    })
    
    const getYouTubeEmbedUrl = (url) => {
      // Extract video ID from various YouTube URL formats
      let videoId = ''
      
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0]
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0]
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1].split('?')[0]
      } else {
        // Assume it's already a video ID
        videoId = url
      }
      
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&controls=1`
    }
    
    const playVideo = () => {
      if (videoPlayer.value) {
        videoPlayer.value.play()
      }
    }
    
    const onVideoLoaded = () => {
      isLoaded.value = true
    }
    
    const onVideoPlay = () => {
      isPlaying.value = true
    }
    
    const onVideoPause = () => {
      isPlaying.value = false
    }
    
    const nextVideo = () => {
      if (currentVideoIndex.value < props.videos.length - 1) {
        currentVideoIndex.value++
        isPlaying.value = false
      }
    }
    
    const previousVideo = () => {
      if (currentVideoIndex.value > 0) {
        currentVideoIndex.value--
        isPlaying.value = false
      }
    }
    
    const selectVideo = (index) => {
      currentVideoIndex.value = index
      isPlaying.value = false
    }
    
    return {
      videoPlayer,
      currentVideoIndex,
      isPlaying,
      isLoaded,
      currentVideo,
      getYouTubeEmbedUrl,
      playVideo,
      onVideoLoaded,
      onVideoPlay,
      onVideoPause,
      nextVideo,
      previousVideo,
      selectVideo
    }
  }
}
</script>

<style scoped>
.video-section {
  width: 100%;
  max-width: 900px;
  margin: 3rem 0;
}

.video-title {
  font-family: 'Fredoka One', cursive;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.video-container {
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.video-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.3);
}

.video-wrapper {
  position: relative;
  width: 100%;
  background: #000;
}

.video-wrapper video {
  width: 100%;
  height: auto;
  display: block;
  max-height: 500px;
}

/* YouTube iframe styles */
.youtube-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background: #000;
}

.youtube-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.regular-video-container {
  position: relative;
  width: 100%;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-overlay:hover {
  background: rgba(0, 0, 0, 0.3);
}

.play-button {
  text-align: center;
  color: white;
  transition: all 0.3s ease;
}

.play-button:hover {
  transform: scale(1.1);
}

.play-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.play-text {
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.video-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.effect-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ff6b6b;
  border-radius: 50%;
  animation: particleFloat 3s linear infinite;
}

.effect-particle:nth-child(odd) {
  background: #4ecdc4;
  animation-duration: 4s;
}

.effect-particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.effect-particle:nth-child(2) { left: 20%; animation-delay: 0.5s; }
.effect-particle:nth-child(3) { left: 30%; animation-delay: 1s; }
.effect-particle:nth-child(4) { left: 40%; animation-delay: 1.5s; }
.effect-particle:nth-child(5) { left: 50%; animation-delay: 2s; }
.effect-particle:nth-child(6) { left: 60%; animation-delay: 2.5s; }
.effect-particle:nth-child(7) { left: 70%; animation-delay: 3s; }
.effect-particle:nth-child(8) { left: 80%; animation-delay: 3.5s; }
.effect-particle:nth-child(9) { left: 90%; animation-delay: 4s; }
.effect-particle:nth-child(10) { left: 95%; animation-delay: 4.5s; }

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: scale(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
}

/* YouTube-specific effects */
.youtube-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.music-note {
  position: absolute;
  font-size: 1.5rem;
  color: #ff6b6b;
  animation: musicNoteFloat 4s linear infinite;
  opacity: 0.8;
}

.star-effect {
  position: absolute;
  font-size: 1.2rem;
  color: #feca57;
  animation: starTwinkle 3s ease-in-out infinite;
}

.music-note:nth-child(1) { left: 10%; animation-delay: 0s; }
.music-note:nth-child(2) { left: 25%; animation-delay: 0.5s; }
.music-note:nth-child(3) { left: 40%; animation-delay: 1s; }
.music-note:nth-child(4) { left: 55%; animation-delay: 1.5s; }
.music-note:nth-child(5) { left: 70%; animation-delay: 2s; }
.music-note:nth-child(6) { left: 85%; animation-delay: 2.5s; }
.music-note:nth-child(7) { left: 15%; animation-delay: 3s; }
.music-note:nth-child(8) { left: 90%; animation-delay: 3.5s; }

.star-effect:nth-child(9) { top: 20%; right: 20%; animation-delay: 0s; }
.star-effect:nth-child(10) { top: 40%; right: 10%; animation-delay: 1s; }
.star-effect:nth-child(11) { top: 60%; right: 30%; animation-delay: 2s; }
.star-effect:nth-child(12) { top: 80%; right: 15%; animation-delay: 0.5s; }
.star-effect:nth-child(13) { top: 30%; right: 40%; animation-delay: 1.5s; }
.star-effect:nth-child(14) { top: 70%; right: 25%; animation-delay: 2.5s; }

@keyframes musicNoteFloat {
  0% {
    transform: translateY(100%) rotate(0deg) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
    transform: scale(1);
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-20px) rotate(360deg) scale(0);
    opacity: 0;
  }
}

@keyframes starTwinkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 1;
  }
}

.video-info {
  padding: 2rem;
}

.video-caption {
  font-size: 1.3rem;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.video-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.nav-btn {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.nav-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.video-counter {
  background: rgba(255, 107, 107, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  color: #333;
}

.video-thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.thumbnail-item {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.thumbnail-item.active {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border-color: #fff;
}

.thumbnail-placeholder {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.thumbnail-title {
  font-size: 0.9rem;
  font-weight: bold;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .video-title {
    font-size: 2rem;
  }
  
  .video-info {
    padding: 1.5rem;
  }
  
  .video-nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .play-icon {
    font-size: 3rem;
  }
  
  .play-text {
    font-size: 1rem;
  }
  
  .video-thumbnails {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .video-container {
    border-radius: 15px;
  }
  
  .video-info {
    padding: 1rem;
  }
  
  .video-caption {
    font-size: 1.1rem;
  }
  
  .effect-particle {
    display: none;
  }
}
</style>
