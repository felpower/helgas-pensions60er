<template>
  <div class="quiz-gate" v-if="!isUnlocked">
    <div class="quiz-container">
      <!-- Header -->
      <div class="quiz-header" data-aos="fade-down">
        <h1 class="quiz-title">🎂 Willkommen zur Geburtstagsfeier! 🎉</h1>
        <p class="quiz-subtitle">
          Bevor wir mit der Feier beginnen können, müsst ihr beweisen, dass ihr unsere Helga wirklich kennt! 😄
        </p>
        <div class="quiz-progress" @click="secretSkipQuiz" :title="'Klicke mich für einen geheimen Shortcut... 🤫'">
          Frage {{ currentQuestion + 1 }} von {{ questions.length }}
        </div>
      </div>

      <!-- Question Card -->
      <div class="question-card" data-aos="zoom-in" :key="currentQuestion">
        <div class="question-number">{{ currentQuestion + 1 }}</div>
        <h2 class="question-text">{{ questions[currentQuestion].question }}</h2>
        
        <!-- Multiple Choice Questions -->
        <div v-if="questions[currentQuestion].type === 'multiple'" class="answer-options">
          <button 
            v-for="(option, index) in questions[currentQuestion].options" 
            :key="index"
            class="answer-btn"
            :class="{ 
              'correct': showResult && option === questions[currentQuestion].correct,
              'wrong': showResult && selectedAnswer === option && option !== questions[currentQuestion].correct,
              'selected': selectedAnswer === option
            }"
            @click="selectAnswer(option)"
            :disabled="showResult"
          >
            <span class="answer-number">{{ index + 1 }}.</span> {{ option }}
          </button>
        </div>

        <!-- Text Input Questions -->
        <div v-else class="answer-input">
          <input 
            v-model="textAnswer"
            type="text" 
            class="text-input"
            :placeholder="questions[currentQuestion].placeholder"
            @keyup.enter="checkTextAnswer"
            :disabled="showResult"
          />
          <button 
            class="submit-btn" 
            @click="checkTextAnswer"
            :disabled="showResult || !textAnswer.trim()"
          >
            Antworten
          </button>
        </div>

        <!-- Result Display -->
        <div v-if="showResult" class="result-display">
          <div v-if="isCorrect" class="correct-result">
            <div class="result-icon">🎉</div>
            <div class="result-text">Richtig! {{ questions[currentQuestion].explanation }}</div>
          </div>
          <div v-else class="wrong-result">
            <div class="result-icon">😅</div>
            <div class="result-text">
              Nicht ganz! {{ questions[currentQuestion].explanation }}
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="quiz-navigation" v-if="showResult">
          <button 
            v-if="currentQuestion < questions.length - 1" 
            class="next-btn"
            @click="nextQuestion"
          >
            Nächste Frage →
          </button>
          <button 
            v-else-if="correctAnswers >= minCorrectAnswers" 
            class="unlock-btn"
            @click="unlockWebsite"
          >
            🎊 Zur Geburtstagsfeier! 🎊
          </button>
          <button 
            v-else 
            class="retry-btn"
            @click="restartQuiz"
          >
            Nochmal versuchen 🔄
          </button>
        </div>
      </div>

      <!-- Score Display -->
      <div class="score-display" data-aos="fade-up">
        <div class="score-item">
          <span class="score-label">Richtige Antworten:</span>
          <span class="score-value">{{ correctAnswers }} / {{ answeredQuestions }}</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: (answeredQuestions / questions.length) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Fun decorations -->
      <div class="quiz-decorations">
        <div class="floating-emoji" v-for="i in 8" :key="i">
          {{ ['🎂', '🎉', '🎊', '🎈', '🎁', '🌟', '💖', '🎭'][i-1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AOS from 'aos'

export default {
  name: 'QuizGate',
  emits: ['unlock'],
  setup(props, { emit }) {
    const isUnlocked = ref(false)
    const currentQuestion = ref(0)
    const selectedAnswer = ref('')
    const textAnswer = ref('')
    const showResult = ref(false)
    const isCorrect = ref(false)
    const correctAnswers = ref(0)
    const minCorrectAnswers = 4 // Muss mindestens 4 von 6 richtig haben

    const questions = ref([
      {
        question: "Wer ist heute zum Feiern da?",
        type: "multiple",
        options: ["Helga", "Nur Freunde", "Nur Family","Niemand", "Wir alle!"],
        correct: "Wir alle!",
        explanation: "Wir sind alle heute zum feiern da, Helga, ihre Familie und Freunde! 🎉"
      },
      {
        question: "Wann hat unsere Geburtstagskönigin und seit dieser Woche Pensionistin das Licht der Welt erblickt? 👶",
        type: "multiple",
        options: ["2.10.1965","30.9.1965",  "1.10.1964", "30.9.1964", "30.9.1966", "30.10.1965"],
        correct: "30.9.1965",
        explanation: "Am 30. September 1965 wurde unsere wunderbare Helga geboren! 🎂"
      },
      {
        question: "Wie hieß Helgas erster Freund mit Spitznamen? 👑",
        type: "multiple",
        options: ["Parkbank Sepp", "Jukebox Hansi", "Telefonzellen Ferdl", "Würstelstand Karl", "Kaugummiautomat Rudi"],
        correct: "Telefonzellen Ferdl",
        explanation: "Helgas erster Freund war Telefonzellen Ferdl - ein echter Klassiker! ✨"
      },
      {
        question: "Wie hieß Helgas Band, als sie ein Kind war? 🎶",
        type: "multiple",
        options: ["Ennstal Spatzen", "Behamberger Madln", "Reitzenberger Dirndl", "Steyrer Sturköpfe", "Kürnberger Buam & Madln"],
        correct: "Reitzenberger Dirndl",
        explanation: "Helgas Kinderband trug den Namen Reitzenberger Dirndl – fast schon Kult! 🎤"
      },
      {
        question: "Wo ist Helga zur Berufsschule gegangen? 📚",
        type: "multiple",
        options: ["Berufsschule Steyr-Garsten", "Berufsschule Münichholz", "Berufsschule Ennsdorf", "Berufsschule Weyer", "Berufsschule Linz-Urfahr"],
        correct: "Berufsschule Münichholz",
        explanation: "Helga drückte die Schulbank in der Berufsschule Münichholz – unvergessliche Zeiten! 🏫"
      },
      {
        question: "Was macht Helga so besonders bei BMW? 🌟",
        type: "multiple",
        options: ["Sie war die jüngste Mitarbeiterin", "Sie war die längstdienende Angestellte", "Sie war die Chefin", "Sie hat dort geheiratet"],
        correct: "Sie war die längstdienende Angestellte",
        explanation: "Über 40 Jahre Treue - das ist wirklich beeindruckend! 👏"
      },
      {
        question: "Welches besondere Alter feiert Helga heute? 🎊",
        type: "multiple",
        options: ["59 Jahre", "60 Jahre", "61 Jahre", "58 Jahre"],
        correct: "60 Jahre",
        explanation: "60 wunderbare Jahre voller Leben, Lachen und Musik! 🎉"
      }
    ])

    const answeredQuestions = computed(() => {
      return currentQuestion.value + (showResult.value ? 1 : 0)
    })

    const selectAnswer = (answer) => {
      if (showResult.value) return
      selectedAnswer.value = answer
      checkAnswer(answer)
    }

    const checkTextAnswer = () => {
      if (!textAnswer.value.trim() || showResult.value) return
      
      const currentQ = questions.value[currentQuestion.value]
      const userAnswer = textAnswer.value.trim()
      const isMatch = currentQ.correct.some(correctAnswer => 
        correctAnswer.toLowerCase() === userAnswer.toLowerCase()
      )
      
      checkAnswer(userAnswer, isMatch)
    }

    const checkAnswer = (answer, forceResult = null) => {
      const currentQ = questions.value[currentQuestion.value]
      
      if (currentQ.type === 'multiple') {
        isCorrect.value = answer === currentQ.correct
      } else {
        isCorrect.value = forceResult !== null ? forceResult : false
      }
      
      if (isCorrect.value) {
        correctAnswers.value++
      }
      
      showResult.value = true
      
      // Add some celebration effects
      if (isCorrect.value) {
        createCelebrationEffect()
      }
    }

    const nextQuestion = () => {
      currentQuestion.value++
      selectedAnswer.value = ''
      textAnswer.value = ''
      showResult.value = false
      isCorrect.value = false
      
      // Reinitialize AOS for new question
      setTimeout(() => {
        AOS.refresh()
      }, 100)
    }

    const unlockWebsite = () => {
      isUnlocked.value = true
      emit('unlock')
      
      // Big celebration!
      createUnlockCelebration()
    }

    const restartQuiz = () => {
      currentQuestion.value = 0
      selectedAnswer.value = ''
      textAnswer.value = ''
      showResult.value = false
      isCorrect.value = false
      correctAnswers.value = 0
    }

    const secretSkipQuiz = () => {
      // Secret skip functionality - immediately unlock the website
      isUnlocked.value = true
      emit('unlock')
      
      // Create a special celebration for the secret skip
      createUnlockCelebration()
      
      // Optional: Show a fun message
      setTimeout(() => {
        console.log('🤫 Du hast den geheimen Skip-Button gefunden! Clever! 🎉')
      }, 500)
    }

    const createCelebrationEffect = () => {
      // Create floating hearts and stars
      const emojis = ['💖', '⭐', '🎉', '✨']
      
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const element = document.createElement('div')
          element.textContent = emojis[Math.floor(Math.random() * emojis.length)]
          element.style.position = 'fixed'
          element.style.left = Math.random() * window.innerWidth + 'px'
          element.style.top = Math.random() * window.innerHeight + 'px'
          element.style.fontSize = '2rem'
          element.style.pointerEvents = 'none'
          element.style.zIndex = '10000'
          element.style.animation = 'celebrationFloat 2s ease-out forwards'
          
          document.body.appendChild(element)
          
          setTimeout(() => {
            element.remove()
          }, 2000)
        }, i * 100)
      }
    }

    const createUnlockCelebration = () => {
      // Massive celebration effect
      const emojis = ['🎊', '🎉', '🎂', '🎈', '🌟', '💖', '🎁', '🎭']
      
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const element = document.createElement('div')
          element.textContent = emojis[Math.floor(Math.random() * emojis.length)]
          element.style.position = 'fixed'
          element.style.left = Math.random() * window.innerWidth + 'px'
          element.style.top = '-50px'
          element.style.fontSize = (Math.random() * 2 + 1) + 'rem'
          element.style.pointerEvents = 'none'
          element.style.zIndex = '10000'
          element.style.animation = `unlockCelebration ${Math.random() * 2 + 2}s ease-out forwards`
          
          document.body.appendChild(element)
          
          setTimeout(() => {
            element.remove()
          }, 4000)
        }, i * 50)
      }
    }

    onMounted(() => {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out'
      })
    })

    return {
      isUnlocked,
      currentQuestion,
      selectedAnswer,
      textAnswer,
      showResult,
      isCorrect,
      correctAnswers,
      minCorrectAnswers,
      questions,
      answeredQuestions,
      selectAnswer,
      checkTextAnswer,
      nextQuestion,
      unlockWebsite,
      restartQuiz,
      secretSkipQuiz
    }
  }
}
</script>

<style scoped>
.quiz-gate {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

.quiz-container {
  max-width: 600px;
  width: 100%;
  position: relative;
  padding: 0 1rem;
}

.quiz-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.quiz-title {
  font-family: 'Fredoka One', cursive;
  font-size: clamp(1.2rem, 4vw, 3.5rem);
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
  padding: 0 0.5rem;
}

.quiz-subtitle {
  font-size: clamp(1rem, 3vw, 1.2rem);
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.6;
  word-wrap: break-word;
}

.quiz-progress {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.quiz-progress:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-card {
  background: white;
  border-radius: 25px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.question-number {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'Fredoka One', cursive;
}

.question-text {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 2rem;
  line-height: 1.5;
  text-align: center;
}

.answer-options {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.answer-btn {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.answer-number {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.3rem 0.6rem;
  border-radius: 50%;
  min-width: 1.8rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.answer-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #ff6b6b;
  transform: translateY(-2px);
}

.answer-btn.selected {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.answer-btn.selected .answer-number {
  background: rgba(255, 255, 255, 0.9);
  color: #ff6b6b;
}

.answer-btn.correct {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.answer-btn.correct .answer-number {
  background: rgba(255, 255, 255, 0.9);
  color: #28a745;
}

.answer-btn.wrong {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.answer-btn.wrong .answer-number {
  background: rgba(255, 255, 255, 0.9);
  color: #dc3545;
}

.answer-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.text-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  font-size: 1.1rem;
  min-width: 200px;
}

.text-input:focus {
  outline: none;
  border-color: #ff6b6b;
}

.submit-btn {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-display {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
}

.correct-result {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
}

.wrong-result {
  background: linear-gradient(45deg, #dc3545, #fd7e14);
  color: white;
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.result-text {
  font-size: 1.1rem;
  line-height: 1.5;
}

.quiz-navigation {
  text-align: center;
}

.next-btn, .unlock-btn, .retry-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.unlock-btn {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  font-size: 1.4rem;
  padding: 1.2rem 2.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.retry-btn {
  background: linear-gradient(45deg, #6c757d, #495057);
}

.next-btn:hover, .unlock-btn:hover, .retry-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.score-display {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.score-label {
  font-weight: bold;
  color: #333;
}

.score-value {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-weight: bold;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.quiz-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-emoji {
  position: absolute;
  font-size: 2rem;
  opacity: 0.1;
  animation: floatAround 10s linear infinite;
}

.floating-emoji:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.floating-emoji:nth-child(2) { top: 20%; right: 10%; animation-delay: 1s; }
.floating-emoji:nth-child(3) { top: 60%; left: 5%; animation-delay: 2s; }
.floating-emoji:nth-child(4) { bottom: 20%; right: 15%; animation-delay: 3s; }
.floating-emoji:nth-child(5) { top: 40%; left: 80%; animation-delay: 4s; }
.floating-emoji:nth-child(6) { bottom: 40%; left: 20%; animation-delay: 5s; }
.floating-emoji:nth-child(7) { top: 80%; right: 30%; animation-delay: 6s; }
.floating-emoji:nth-child(8) { top: 30%; left: 50%; animation-delay: 7s; }

@keyframes floatAround {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(0px) rotate(180deg); }
  75% { transform: translateY(-10px) rotate(270deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes celebrationFloat {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) scale(0) rotate(360deg);
    opacity: 0;
  }
}

@keyframes unlockCelebration {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .quiz-gate {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
  
  .quiz-container {
    max-width: 100%;
  }
  
  .quiz-header {
    margin-bottom: 1.5rem;
  }
  
  .quiz-title {
    font-size: clamp(1rem, 3.5vw, 1.8rem);
    line-height: 1.1;
    margin-bottom: 0.8rem;
    padding: 0;
  }
  
  .quiz-subtitle {
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    margin-bottom: 1rem;
  }
  
  .question-card {
    padding: 2rem 1.5rem;
  }
  
  .answer-input {
    flex-direction: column;
  }
  
  .text-input {
    min-width: auto;
  }
  
  .floating-emoji {
    display: none;
  }
}

@media (max-width: 480px) {
  .quiz-gate {
    padding: 0.3rem;
    padding-top: 0.5rem;
  }
  
  .quiz-container {
    padding: 0 0.5rem;
  }
  
  .quiz-title {
    font-size: clamp(0.9rem, 3vw, 1.3rem);
    line-height: 1.05;
    padding: 0;
    margin-bottom: 0.5rem;
  }
  
  .quiz-subtitle {
    font-size: clamp(0.7rem, 2vw, 0.85rem);
  }
  
  .question-card {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 360px) {
  .quiz-gate {
    padding: 0.2rem;
    padding-top: 0.3rem;
  }
  
  .quiz-container {
    padding: 0 0.3rem;
  }
  
  .quiz-title {
    font-size: clamp(0.8rem, 2.5vw, 1.1rem);
    line-height: 1.0;
    margin-bottom: 0.3rem;
  }
  
  .quiz-subtitle {
    font-size: clamp(0.6rem, 1.8vw, 0.75rem);
    margin-bottom: 0.8rem;
  }
}
</style>
