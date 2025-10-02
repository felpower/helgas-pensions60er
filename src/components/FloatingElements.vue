<template>
  <div class="floating-container">
    <!-- Floating Hearts -->
    <div 
      v-for="heart in hearts" 
      :key="'heart-' + heart.id"
      class="floating-element floating-heart"
      :style="heart.style"
    >
      💖
    </div>
    
    <!-- Floating Stars -->
    <div 
      v-for="star in stars" 
      :key="'star-' + star.id"
      class="floating-element floating-star"
      :style="star.style"
    >
      ⭐
    </div>
    
    <!-- Floating Balloons -->
    <div 
      v-for="balloon in balloons" 
      :key="'balloon-' + balloon.id"
      class="floating-element floating-balloon"
      :style="balloon.style"
    >
      {{ balloon.emoji }}
    </div>
    
    <!-- Floating Birthday Elements -->
    <div 
      v-for="element in birthdayElements" 
      :key="'birthday-' + element.id"
      class="floating-element"
      :style="element.style"
    >
      {{ element.emoji }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'FloatingElements',
  setup() {
    const hearts = ref([])
    const stars = ref([])
    const balloons = ref([])
    const birthdayElements = ref([])
    
    let animationInterval = null

    const createRandomElement = (type, emojis) => {
      const id = Date.now() + Math.random()
      const element = {
        id,
        style: {
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: (Math.random() * 3 + 4) + 's'
        }
      }
      
      if (emojis) {
        element.emoji = emojis[Math.floor(Math.random() * emojis.length)]
      }
      
      return element
    }

    const addElements = () => {
      // Add hearts
      if (hearts.value.length < 8) {
        hearts.value.push(createRandomElement('heart'))
      }
      
      // Add stars
      if (stars.value.length < 12) {
        stars.value.push(createRandomElement('star'))
      }
      
      // Add balloons
      if (balloons.value.length < 6) {
        const balloonEmojis = ['🎈', '🎀', '🎊', '🎉']
        balloons.value.push(createRandomElement('balloon', balloonEmojis))
      }
      
      // Add birthday elements
      if (birthdayElements.value.length < 10) {
        const birthdayEmojis = ['🎂', '🍰', '🧁', '🎁', '🎪', '🎭', '🎨', '🎵', '🎶', '🌟']
        birthdayElements.value.push(createRandomElement('birthday', birthdayEmojis))
      }
    }

    const removeOldElements = () => {
      // Keep arrays from getting too large
      if (hearts.value.length > 15) {
        hearts.value = hearts.value.slice(-8)
      }
      if (stars.value.length > 20) {
        stars.value = stars.value.slice(-12)
      }
      if (balloons.value.length > 12) {
        balloons.value = balloons.value.slice(-6)
      }
      if (birthdayElements.value.length > 20) {
        birthdayElements.value = birthdayElements.value.slice(-10)
      }
    }

    onMounted(() => {
      // Initial elements
      addElements()
      
      // Add new elements periodically
      animationInterval = setInterval(() => {
        addElements()
        removeOldElements()
      }, 3000)
    })

    onUnmounted(() => {
      if (animationInterval) {
        clearInterval(animationInterval)
      }
    })

    return {
      hearts,
      stars,
      balloons,
      birthdayElements
    }
  }
}
</script>

<style scoped>
.floating-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.floating-element {
  position: absolute;
  font-size: 1.5rem;
  user-select: none;
}

/* Additional floating animations */
.floating-heart {
  animation: floatHeart 6s ease-in-out infinite, pulse 2s ease-in-out infinite;
}

.floating-star {
  animation: floatStar 8s ease-in-out infinite, twinkle 1.5s ease-in-out infinite;
}

.floating-balloon {
  animation: floatBalloon 10s ease-in-out infinite, sway 4s ease-in-out infinite;
}

@keyframes floatHeart {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
  }
  25% { 
    transform: translateY(-30px) translateX(10px) rotate(5deg) scale(1.1); 
  }
  50% { 
    transform: translateY(-20px) translateX(-15px) rotate(-3deg) scale(0.9); 
  }
  75% { 
    transform: translateY(-40px) translateX(5px) rotate(2deg) scale(1.05); 
  }
}

@keyframes floatStar {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
  }
  33% { 
    transform: translateY(-25px) translateX(20px) rotate(120deg); 
  }
  66% { 
    transform: translateY(-15px) translateX(-10px) rotate(240deg); 
  }
}

@keyframes floatBalloon {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg); 
  }
  20% { 
    transform: translateY(-50px) translateX(15px) rotate(2deg); 
  }
  40% { 
    transform: translateY(-30px) translateX(-20px) rotate(-1deg); 
  }
  60% { 
    transform: translateY(-60px) translateX(10px) rotate(1deg); 
  }
  80% { 
    transform: translateY(-25px) translateX(-5px) rotate(-2deg); 
  }
}

@media (max-width: 768px) {
  .floating-element {
    font-size: 1rem;
  }
}
</style>
