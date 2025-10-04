<template>
  <div class="music-controls" :class="{ 'collapsed': collapsed }">
    <button 
      class="music-btn play-pause-btn" 
      @click="$emit('toggle-music')"
      :title="isPlaying ? 'Musik pausieren' : 'Musik abspielen'"
    >
      {{ isPlaying ? '⏸️' : '▶️' }}
    </button>
    
    <button 
      class="music-btn next-btn" 
      @click="$emit('next-song')"
      title="Nächstes Lied"
    >
      ⏭️
    </button>
    
    <div class="volume-control">
      <span class="volume-icon">🔊</span>
      <input 
        type="range" 
        class="volume-slider" 
        min="0" 
        max="1" 
        step="0.1"
        :value="volume"
        @input="$emit('volume-change', $event.target.value)"
      />
    </div>
    
    <div class="now-playing">
      <div class="song-info">
        <div class="song-title">{{ currentSong ? currentSong.name : 'Kein Song ausgewählt' }}</div>
        <div class="music-visualizer" v-if="isPlaying && currentSong">
          <div class="bar" v-for="i in 5" :key="i"></div>
        </div>
      </div>
    </div>
    <button 
      class="music-btn fold-btn" 
      @click="toggleFold"
      :title="collapsed ? 'Musiksteuerung ausklappen' : 'Musiksteuerung einklappen'"
    >
      {{ collapsed ? '»' : '«' }}
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'MusicControls',
  props: {
    isPlaying: {
      type: Boolean,
      default: false
    }, 
    volume: {
      type: Number,
      default: 0.5
    },
    currentSong: {
      type: Object,
      default: null
    }
  },
  emits: ['toggle-music', 'volume-change', 'next-song'],
  setup(props, { emit }) {
    const collapsed = ref(false)
    const toggleFold = () => {
      collapsed.value = !collapsed.value
    }
    return {
      collapsed,
      toggleFold
    }
  }
}
</script>

<style scoped>
.music-controls {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
  animation: gradientShift 1s ease infinite;
  transform: scale(1.05);
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 15px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.music-controls.collapsed {
  width: 60px;
  min-width: 60px;
  max-width: 60px;
  padding: 10px 8px;
  gap: 0;
  overflow: hidden;
  left: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.music-controls.collapsed > .music-btn:not(.fold-btn),
.music-controls.collapsed > .volume-control,
.music-controls.collapsed > .now-playing {
  display: none !important;
}

.music-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
}

.fold-btn {
  font-size: 1.2rem;
  background: #f8f9fa;
  border: 1px solid #eee;
  color: #666;
  margin-left: 0;
  margin-right: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.fold-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.music-btn:hover {
  background: rgba(255, 107, 107, 0.2);
  transform: scale(1.1);
}

.music-btn:active {
  transform: scale(0.95);
}

.play-pause-btn:hover {
  background: rgba(76, 175, 80, 0.2);
}

.next-btn:hover {
  background: rgba(33, 150, 243, 0.2);
}


.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-icon {
  font-size: 1.2rem;
}

.volume-slider {
  width: 80px;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  background: #ff5252;
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ff6b6b;
  cursor: pointer;
  border: none;
}

.now-playing {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.song-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.song-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.music-visualizer {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 20px;
}

.bar {
  width: 3px;
  background: linear-gradient(to top, #ff6b6b, #4ecdc4);
  border-radius: 2px;
  animation: musicBar 0.8s ease-in-out infinite;
}

.bar:nth-child(1) { animation-delay: 0s; }
.bar:nth-child(2) { animation-delay: 0.1s; }
.bar:nth-child(3) { animation-delay: 0.2s; }
.bar:nth-child(4) { animation-delay: 0.3s; }
.bar:nth-child(5) { animation-delay: 0.4s; }

@keyframes musicBar {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}


/* Mobile responsive */
@media (max-width: 768px) {
  .music-controls {
    bottom: 10px;
    left: 10px;
    padding: 12px 15px;
    gap: 10px;
    flex-wrap: wrap;
    max-width: calc(100vw - 20px);
  }
  .music-controls.collapsed {
    left: 0;
    padding: 8px 4px;
    min-width: 50px;
    max-width: 50px;
  }
  
  .music-btn {
    font-size: 1.3rem;
    min-width: 35px;
    min-height: 35px;
  }
  
  .volume-slider {
    width: 60px;
  }
  
  .song-title {
    font-size: 0.8rem;
    max-width: 100px;
  }
  
  .now-playing {
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .music-controls {
    position: relative;
    bottom: auto;
    left: auto;
    margin: 10px;
    justify-content: center;
  }
  .music-controls.collapsed {
    left: 0;
    margin: 0;
    min-width: 40px;
    max-width: 40px;
    padding: 4px 2px;
  }
  
  .now-playing {
    display: none;
  }
}
</style>
