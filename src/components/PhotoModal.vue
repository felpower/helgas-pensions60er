<template>
  <div class="photo-modal-overlay" @click="$emit('close')" v-if="photo">
    <div class="photo-modal" @click.stop>
      <button class="close-btn" @click="$emit('close')">✕</button>
      
      <div class="modal-content">
        <div class="photo-container">
          <img :src="photo.src" :alt="photo.caption" />
          
          <!-- Fun overlay effects -->
          <div class="modal-effects">
            <div class="sparkle-effect" v-for="i in 15" :key="i"></div>
          </div>
        </div>
        
        <div class="photo-details">
          <h3 class="photo-title">{{ photo.caption }}</h3>
          <div class="photo-year" v-if="photo.year">{{ photo.year }}</div>
          
          <div class="photo-actions">
            <button class="action-button love-btn" @click="toggleLove">
              {{ isLoved ? '💖 Geliebt!' : '🤍 Lieben!' }}
            </button>
            <button class="action-button share-btn" @click="sharePhoto">
              📤 Teilen
            </button>
            <button class="action-button download-btn" @click="downloadPhoto">
              💾 Speichern
            </button>
          </div>
          
          <!-- Fun stats -->
          <div class="photo-stats">
            <div class="stat-item">
              <div class="stat-icon">👀</div>
              <div class="stat-text">{{ viewCount }} Aufrufe</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">💖</div>
              <div class="stat-text">{{ loveCount }} Likes</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">⭐</div>
              <div class="stat-text">Fabelhaft!</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation arrows -->
      <button class="nav-arrow prev-arrow" @click="$emit('prev-photo')" v-if="hasPrevious">
        ⬅️
      </button>
      <button class="nav-arrow next-arrow" @click="$emit('next-photo')" v-if="hasNext">
        ➡️
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'PhotoModal',
  props: {
    photo: {
      type: Object,
      default: null
    },
    hasPrevious: {
      type: Boolean,
      default: false
    },
    hasNext: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'prev-photo', 'next-photo'],
  setup(props) {
    const isLoved = ref(false)
    const viewCount = ref(Math.floor(Math.random() * 100) + 50)
    const loveCount = ref(Math.floor(Math.random() * 50) + 10)
    
    const toggleLove = () => {
      isLoved.value = !isLoved.value
      
      if (isLoved.value) {
        loveCount.value++
        createLoveExplosion()
      } else {
        loveCount.value--
      }
    }
    
    const sharePhoto = () => {
      if (navigator.share) {
        navigator.share({
          title: 'Tolles Foto von Helga!',
          text: props.photo.caption,
          url: window.location.href
        })
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href)
        showNotification('Link in Zwischenablage kopiert! 📋')
      }
    }
    
    const downloadPhoto = () => {
      const link = document.createElement('a')
      link.href = props.photo.src
      link.download = `helga-photo-${props.photo.id}.jpg`
      link.click()
      showNotification('Foto gespeichert! 💾')
    }
    
    const createLoveExplosion = () => {
      const hearts = ['💖', '💕', '💗', '💓', '💝']
      
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const heart = document.createElement('div')
          heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]
          heart.style.position = 'fixed'
          heart.style.left = '50%'
          heart.style.top = '50%'
          heart.style.fontSize = '2rem'
          heart.style.pointerEvents = 'none'
          heart.style.zIndex = '10000'
          heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`
          heart.style.animation = `loveExplosion ${1 + Math.random()}s ease-out forwards`
          
          document.body.appendChild(heart)
          
          setTimeout(() => {
            heart.remove()
          }, 2000)
        }, i * 50)
      }
    }
    
    const showNotification = (message) => {
      const notification = document.createElement('div')
      notification.textContent = message
      notification.style.position = 'fixed'
      notification.style.top = '20px'
      notification.style.right = '20px'
      notification.style.background = 'rgba(0, 0, 0, 0.8)'
      notification.style.color = 'white'
      notification.style.padding = '1rem 2rem'
      notification.style.borderRadius = '25px'
      notification.style.zIndex = '10001'
      notification.style.animation = 'slideInRight 0.3s ease-out'
      
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out'
        setTimeout(() => {
          notification.remove()
        }, 300)
      }, 3000)
    }
    
    // Keyboard navigation
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        props.emit('close')
      } else if (event.key === 'ArrowLeft' && props.hasPrevious) {
        props.emit('prev-photo')
      } else if (event.key === 'ArrowRight' && props.hasNext) {
        props.emit('next-photo')
      }
    }
    
    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
      viewCount.value++ // Increment view count when opened
      
      return () => {
        document.removeEventListener('keydown', handleKeydown)
      }
    })
    
    return {
      isLoved,
      viewCount,
      loveCount,
      toggleLove,
      sharePhoto,
      downloadPhoto
    }
  }
}
</script>

<style scoped>
.photo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

.photo-modal {
  position: relative;
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  max-height: 800px;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  animation: modalSlideIn 0.4s ease-out;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #ff6b6b;
  color: white;
  transform: scale(1.1);
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.photo-container {
  position: relative;
  flex: 1;
  height: 500px;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
}

.photo-container img {
  max-width: 460px;
  max-height: 460px;
  width: auto;
  height: auto;
  display: block;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle-effect {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #feca57;
  border-radius: 50%;
  animation: sparkleModal 3s linear infinite;
}

.sparkle-effect:nth-child(odd) {
  background: #ff6b6b;
  animation-duration: 4s;
}

.sparkle-effect:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.sparkle-effect:nth-child(2) { top: 20%; left: 80%; animation-delay: 0.5s; }
.sparkle-effect:nth-child(3) { top: 70%; left: 15%; animation-delay: 1s; }
.sparkle-effect:nth-child(4) { top: 30%; left: 70%; animation-delay: 1.5s; }
.sparkle-effect:nth-child(5) { top: 80%; left: 85%; animation-delay: 2s; }
.sparkle-effect:nth-child(6) { top: 15%; left: 50%; animation-delay: 2.5s; }
.sparkle-effect:nth-child(7) { top: 60%; left: 30%; animation-delay: 3s; }
.sparkle-effect:nth-child(8) { top: 40%; left: 90%; animation-delay: 3.5s; }
.sparkle-effect:nth-child(9) { top: 90%; left: 60%; animation-delay: 4s; }
.sparkle-effect:nth-child(10) { top: 25%; left: 25%; animation-delay: 4.5s; }
.sparkle-effect:nth-child(11) { top: 75%; left: 75%; animation-delay: 5s; }
.sparkle-effect:nth-child(12) { top: 50%; left: 10%; animation-delay: 5.5s; }
.sparkle-effect:nth-child(13) { top: 35%; left: 40%; animation-delay: 6s; }
.sparkle-effect:nth-child(14) { top: 85%; left: 20%; animation-delay: 6.5s; }
.sparkle-effect:nth-child(15) { top: 55%; left: 95%; animation-delay: 7s; }

@keyframes sparkleModal {
  0%, 100% { 
    transform: scale(0) rotate(0deg); 
    opacity: 0;
  }
  50% { 
    transform: scale(1) rotate(180deg); 
    opacity: 1;
  }
}

.photo-details {
  padding: 1.5rem;
  flex-shrink: 0;
  height: 250px;
  max-height: 250px;
  overflow-y: auto;
}

.photo-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.photo-year {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.photo-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
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

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.love-btn {
  background: linear-gradient(45deg, #ff6b6b, #ff8a80);
}

.share-btn {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
}

.download-btn {
  background: linear-gradient(45deg, #45b7d1, #96c93d);
}

.photo-stats {
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.stat-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: bold;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.prev-arrow {
  left: -25px;
}

.next-arrow {
  right: -25px;
}

.nav-arrow:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { 
    opacity: 0;
    transform: scale(0.8) translateY(50px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes loveExplosion {
  0% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0) rotate(360deg) translateX(200px) translateY(-200px);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideOutRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

/* Tablet responsive */
@media (max-width: 1024px) {
  .photo-modal {
    width: 95vw;
    height: 85vh;
    max-width: 900px;
    max-height: 700px;
  }
  
  .photo-container {
    height: 400px;
    max-height: 400px;
  }
  
  .photo-container img {
    max-width: 360px;
    max-height: 360px;
  }
  
  .photo-details {
    height: 200px;
    max-height: 200px;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .photo-modal-overlay {
    padding: 0.5rem;
  }
  
  .photo-modal {
    width: 98vw;
    height: 95vh;
    max-width: none;
    max-height: none;
  }
  
  .modal-content {
    flex-direction: column;
  }
  
  .photo-container {
    height: 300px;
    max-height: 300px;
    padding: 10px;
  }
  
  .photo-container img {
    max-width: 280px;
    max-height: 280px;
  }
  
  .photo-details {
    padding: 1rem;
    height: auto;
    max-height: 250px;
  }
  
  .photo-title {
    font-size: 1.2rem;
  }
  
  .photo-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 200px;
  }
  
  .nav-arrow {
    display: none;
  }
  
  .sparkle-effect {
    display: none;
  }
}

@media (max-width: 480px) {
  .photo-container {
    height: 250px;
    max-height: 250px;
    padding: 5px;
  }
  
  .photo-container img {
    max-width: 240px;
    max-height: 240px;
  }
  
  .photo-details {
    padding: 0.8rem;
    height: auto;
    max-height: 200px;
  }
  
  .photo-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
