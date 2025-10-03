<template>
  <div class="photo-grid">
    <div 
      v-for="photo in photos" 
      :key="photo.id"
      class="photo-item"
      :class="{ 'photo-loaded': photo.loaded }"
      @click="$emit('photo-click', photo)"
      data-aos="zoom-in"
      :data-aos-delay="photo.id * 100"
    >
      <div class="photo-wrapper">
        <img 
          :src="photo.src" 
          :alt="photo.caption"
          @load="photo.loaded = true"
          @error="handleImageError(photo)"
        />
        
        <!-- <div class="photo-overlay">
          <div class="photo-year" v-if="photo.year">{{ photo.year }}</div>
          <div class="photo-actions">
            <button class="action-btn zoom-btn" title="In voller Größe anzeigen">
              🔍
            </button>
            <button class="action-btn love-btn" @click.stop="toggleLove(photo)" title="Lieben!">
              {{ photo.loved ? '💖' : '🤍' }}
            </button>
          </div>
        </div> -->

      </div>      
      <div class="photo-caption">
        <p>{{ photo.caption }}</p>
      </div>
      
      <!-- Fun decorative elements -->
      <div class="photo-decorations">
        <div class="sparkle sparkle-1">✨</div>
        <div class="sparkle sparkle-2">⭐</div>
        <div class="sparkle sparkle-3">💫</div>
      </div>
    </div>
    
    <!-- Placeholder photos for demo -->
    <!-- <div 
      v-for="i in placeholderCount" 
      :key="'placeholder-' + i"
      class="photo-item placeholder-item"
      data-aos="fade-in"
      :data-aos-delay="(photos.length + i) * 100"
    >
      <div class="photo-wrapper">
        <div class="placeholder-content">
          <div class="placeholder-icon">📷</div>
          <div class="placeholder-text">Dein Foto hier!</div>
          <div class="placeholder-subtitle">Lade deine tollen Fotos in den /public/photos Ordner hoch</div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PhotoGrid',
  props: {
    photos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['photo-click'],
  setup(props) {
    // Add loaded state to photos
    const photosWithState = computed(() => {
      return props.photos.map(photo => ({
        ...photo,
        loaded: ref(false),
        loved: ref(false)
      }))
    })
    
    // Show some placeholder items to demonstrate the layout
    const placeholderCount = computed(() => {
      const currentCount = props.photos.length
      const targetCount = Math.max(6, Math.ceil(currentCount / 3) * 3)
      return Math.max(0, targetCount - currentCount)
    })
    
    const handleImageError = (photo) => {
      console.warn(`Failed to load image: ${photo.src}`)
      // You could set a fallback image here
      photo.src = '/placeholder-photo.jpg'
    }
    
    const toggleLove = (photo) => {
      photo.loved.value = !photo.loved.value
      
      // Add some fun effects
      if (photo.loved.value) {
        createLoveEffect()
      }
    }
    
    const createLoveEffect = () => {
      // Create floating hearts effect
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const heart = document.createElement('div')
          heart.textContent = '💖'
          heart.style.position = 'fixed'
          heart.style.left = Math.random() * window.innerWidth + 'px'
          heart.style.top = Math.random() * window.innerHeight + 'px'
          heart.style.fontSize = '2rem'
          heart.style.pointerEvents = 'none'
          heart.style.zIndex = '9999'
          heart.style.animation = 'loveFloat 2s ease-out forwards'
          
          document.body.appendChild(heart)
          
          setTimeout(() => {
            heart.remove()
          }, 2000)
        }, i * 200)
      }
    }
    
    return {
      photosWithState,
      placeholderCount,
      handleImageError,
      toggleLove
    }
  }
}
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 2rem 0;
  padding: 1rem;
}

.photo-item {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  cursor: pointer;
  background: white;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
}

.photo-item:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.photo-item:nth-child(odd):hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
}

.photo-wrapper {
  position: relative;
  width: 100%;
  min-height: 200px;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.photo-wrapper img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: all 0.4s ease;
  filter: brightness(1) saturate(1);
}

.photo-item:hover .photo-wrapper img {
  transform: scale(1.1);
  filter: brightness(1.1) saturate(1.2);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(255, 107, 107, 0.1) 0%, 
    rgba(78, 205, 196, 0.1) 100%
  );
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-year {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  align-self: flex-start;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.photo-actions {
  display: flex;
  gap: 0.5rem;
  align-self: flex-end;
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  transform: scale(1.2);
  background: white;
}

.love-btn:hover {
  animation: pulse 0.5s ease-in-out;
}

.photo-caption {
  padding: 1.5rem;
  background: white;
  text-align: center;
}

.photo-caption p {
  margin: 0;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  font-weight: 500;
}

.photo-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.photo-item:hover .sparkle {
  opacity: 1;
  animation: sparkleFloat 2s ease-in-out infinite;
}

.sparkle-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 25%;
  right: 15%;
  animation-delay: 0.5s;
}

.sparkle-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 1s;
}

/* Placeholder styles */
.placeholder-item {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 2px dashed #ccc;
  cursor: default;
}

.placeholder-item:hover {
  transform: translateY(-5px);
  border-color: #ff6b6b;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 0.5rem;
}

.placeholder-subtitle {
  font-size: 0.9rem;
  color: #888;
  line-height: 1.4;
}

/* Animations */
@keyframes sparkleFloat {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 1;
  }
  50% { 
    transform: translateY(-10px) rotate(180deg); 
    opacity: 0.7;
  }
}

@keyframes loveFloat {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 0.5rem;
  }
  
  .photo-wrapper {
    height: 200px;
  }
  
  .photo-caption {
    padding: 1rem;
  }
  
  .photo-caption p {
    font-size: 0.9rem;
  }
  
  .action-btn {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .photo-year {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .photo-item:hover {
    transform: translateY(-5px);
  }
  
  .sparkle {
    display: none;
  }
}
</style>
