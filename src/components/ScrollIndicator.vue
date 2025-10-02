<template>
  <div class="scroll-indicator">
    <div 
      v-for="(section, index) in sections" 
      :key="section.id"
      class="scroll-dot"
      :class="{ active: index === currentSection }"
      :title="section.name"
      @click="$emit('scroll-to', index)"
    >
      <div class="dot-emoji">{{ section.emoji }}</div>
      <div class="dot-label">{{ section.name }}</div>
    </div>
    
    <!-- Progress bar -->
    <div class="scroll-progress">
      <div 
        class="progress-fill" 
        :style="{ height: progressPercentage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ScrollIndicator',
  props: {
    sections: {
      type: Array,
      required: true
    },
    currentSection: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll-to'],
  setup(props) {
    const scrollY = ref(0)
    
    const progressPercentage = computed(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      return maxScroll > 0 ? (scrollY.value / maxScroll) * 100 : 0
    })
    
    const handleScroll = () => {
      scrollY.value = window.scrollY
    }
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      progressPercentage
    }
  }
}
</script>

<style scoped>
.scroll-indicator {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 20px 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.scroll-indicator:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-50%) scale(1.05);
}

.scroll-dot {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.scroll-dot:hover {
  background: rgba(255, 107, 107, 0.1);
  transform: scale(1.2);
  border-color: #ff6b6b;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
}

.scroll-dot.active {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  transform: scale(1.3);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  border-color: #fff;
}

.scroll-dot.active .dot-emoji {
  filter: brightness(1.2);
  transform: scale(1.1);
}

.dot-emoji {
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 2;
}

.dot-label {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

.scroll-dot:hover .dot-label {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(-5px);
}

.scroll-progress {
  width: 4px;
  height: 80px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  position: relative;
  margin-top: 10px;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, #ff6b6b, #4ecdc4);
  border-radius: 2px;
  transition: height 0.1s ease;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .scroll-indicator {
    right: 10px;
    padding: 15px 8px;
    gap: 10px;
  }
  
  .scroll-dot {
    width: 35px;
    height: 35px;
  }
  
  .dot-emoji {
    font-size: 1rem;
  }
  
  .dot-label {
    display: none;
  }
  
  .scroll-progress {
    height: 60px;
  }
}

@media (max-width: 480px) {
  .scroll-indicator {
    right: 5px;
    padding: 12px 6px;
    gap: 8px;
  }
  
  .scroll-dot {
    width: 30px;
    height: 30px;
  }
  
  .dot-emoji {
    font-size: 0.9rem;
  }
  
  .scroll-progress {
    height: 40px;
    width: 3px;
  }
}
</style>
