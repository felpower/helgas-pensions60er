<template>
  <div class="quiz-gate" v-if="!isUnlocked">
    <div class="quiz-container">
      <!-- Intro Slides -->
      <div v-if="showIntro" class="intro-wrapper" data-aos="fade-up">
        <div class="intro-slide">
          <h1 class="intro-title">{{ introSlides[currentSlide].title }}</h1>
          <ul class="intro-lines">
            <li v-for="(line, idx) in introSlides[currentSlide].lines" :key="idx" data-aos="fade-left" :data-aos-delay="idx * 150">
              {{ line }}
            </li>
          </ul>
          <div class="intro-footer" data-aos="fade-in" data-aos-delay="500">{{ introSlides[currentSlide].footer }}</div>
          <!-- Developer Mode Toggle (versteckt) -->
          <div class="dev-toggle" @click="toggleDevMode" title="Developer Mode">
            🔧
          </div>
          <div v-if="devMode" class="dev-controls" data-aos="fade-in">
            <div class="jump-controls">
              <label>Quiz überspringen?</label>
              <button @click="secretSkipQuiz" class="jump-btn">Skip</button>
            </div>
          </div>
          <div class="intro-navigation">
            <button class="nav-btn prev" @click="prevIntroSlide" :disabled="currentSlide === 0">← Zurück</button>
            <div class="dots">
              <span 
                v-for="(s, i) in introSlides" 
                :key="i" 
                class="dot" 
                :class="{ active: i === currentSlide }"
                @click="currentSlide = i"
              ></span>
            </div>
            <button 
              v-if="currentSlide < introSlides.length - 1" 
              class="nav-btn next" 
              @click="nextIntroSlide"
            >Weiter →</button>
            <button 
              v-else 
              class="start-btn" 
              @click="startQuiz"
            >🎯 Quiz starten</button>
          </div>
          <div class="intro-hint">Tipp: Pfeiltasten oder Enter benutzen</div>
        </div>
      </div>

      <!-- Original Quiz Content -->
      <div v-else>
        <!-- Header -->
        <div class="quiz-header" data-aos="fade-down">
          <h1 class="quiz-title">🎂 Willkommen zur Geburtstagsfeier! 🎉</h1>
          <p class="quiz-subtitle">
            Bevor wir mit der Geschenksübergabe beginnen können, müsst ihr beweisen, dass ihr unsere Helga wirklich kennt! Minimum 50% der Fragen müssen richtig beantwortet werden, sonst bekommt unsere Helga kein Geschenk. 😄
          </p>
          <div class="quiz-progress" @click="secretSkipQuiz" :title="'Klicke mich für einen geheimen Shortcut... 🤫'">
            Frage {{ currentQuestion + 1 }} von {{ questions.length }}
          </div>
          
          <!-- Developer Mode Toggle (versteckt) -->
          <div class="dev-toggle" @click="toggleDevMode" title="Developer Mode">
            🔧
          </div>
          
          <!-- Developer Jump Controls -->
          <div v-if="devMode" class="dev-controls" data-aos="fade-in">
            <div class="jump-controls">
              <label>Springe zu Frage:</label>
              <input 
                type="number" 
                v-model.number="jumpToQuestion" 
                :min="1" 
                :max="questions.length"
                class="jump-input"
              />
              <button @click="jumpToQuestionFunc" class="jump-btn">Go</button>
            </div>
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
          <div v-else-if="questions[currentQuestion].type === 'text'" class="answer-input">
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

          <!-- Photo Questions -->
          <div v-else-if="questions[currentQuestion].type === 'photo'" class="photo-question">
            <div class="photo-container">
              <img 
                :src="questions[currentQuestion].photoSrc" 
                :alt="questions[currentQuestion].question"
                class="question-photo"
              />
            </div>
            
            <div class="photo-options">
              <button 
                v-for="(option, index) in questions[currentQuestion].options" 
                :key="index"
                class="photo-option-btn"
                :class="{ 
                  'correct': showResult && option === questions[currentQuestion].correct,
                  'wrong': showResult && selectedAnswer === option && option !== questions[currentQuestion].correct,
                  'selected': selectedAnswer === option
                }"
                @click="selectAnswer(option)"
                :disabled="showResult"
              >
                <span class="option-number">{{ index + 1 }}.</span>
                <span class="option-text">{{ option }}</span>
              </button>
            </div>
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
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
    
    // Developer Mode
    const devMode = ref(false)
    const jumpToQuestion = ref(1)
    const minCorrectAnswers = 1

    // Intro Slides state
    const showIntro = ref(true)
    const currentSlide = ref(0)
    const introSlides = ref([
      {
        title: '🎉 Willkommen zu einem ganz besonderen Abend! 🎉',
        lines: [
          'Heute feiern wir nicht nur irgendeinen Geburtstag...',
          '...wir feiern HELGAS fantastischen 60. Geburtstag! 🎂',
          'UND – sie geht in die Pension! 👏'
        ],
        footer: 'Doppelt Grund zum Feiern! 🥂'
      },
      {
        title: 'Warum wir heute hier sind:',
        lines: [
          'Um Helga zu feiern – 60 Jahre voller Leben, Musik und Liebe ❤️',
          'Um ihre unglaubliche Reise zu würdigen – Familie, Freunde, Erinnerungen',
          'Und um den Start in ihren neuen Lebensabschnitt zu zelebrieren 🕊️'
        ],
        footer: 'Sie hat es sich verdient! ✨'
      },
      {
        title: 'ABER... 🎁',
        lines: [
          'Die Geschenke werden NICHT einfach so hergegeben!',
          'Ihr müsst zuerst beweisen, dass ihr Helga wirklich kennt! 😎',
          'Mindestens 50% der Fragen richtig – sonst KEINE Geschenke! 😱'
        ],
        footer: 'Challenge accepted? 💪'
      },
      {
        title: 'Wie es funktioniert:',
        lines: [
          'Ihr bekommt Fragen über Helga – aus allen Lebensphasen',
          'Manchmal Multiple Choice, manchmal zum Raten... vielleicht sogar mit Bildern 😉',
          'Antworten auswählen – Ergebnis sehen – weiter zur nächsten'
        ],
        footer: 'Klingt einfach? Wir werden sehen... 😏'
      },
      {
        title: 'Seid ihr bereit? 🎤',
        lines: [
          'Dann lasst uns herausfinden: Wer kennt Helga WIRKLICH?',
          'Teamwork ausdrücklich erwünscht – aber kein Google! 😂',
          'Los geht‘s!'
        ],
        footer: '👉 Drücke „Quiz starten“'
      }
    ])

    const nextIntroSlide = () => {
      if (currentSlide.value < introSlides.value.length - 1) {
        currentSlide.value++
      }
    }

    const prevIntroSlide = () => {
      if (currentSlide.value > 0) {
        currentSlide.value--
      }
    }

    const startQuiz = () => {
      showIntro.value = false
      setTimeout(() => AOS.refresh(), 50)
    }

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
        question: "Wie hieß Helgas erster Freund? 👑",
        type: "multiple",
        options: ["Parkbank Herbert", "Jukebox Hansi","Burberger Sepp", "Telefonzellen Ferdl", "Würstelstand Karl", "Kaugummiautomat Rudi"],
        correct: "Burberger Sepp",
        explanation: "Helgas erster Freund war da Burberger Sepp, danach kam erst der Telefonzellen Ferdl - ein echter Klassiker! ✨"
      },
      {
        question: "Nun zu einer Schätzfrage. Welche Schuhgröße hat Helgas Sohn Patrick? 👟",
        type: "multiple",
        options: ["46", "48", "50", "52", "Ruderbootgröße", "Clownschuh XXL"],
        correct: "50",
        explanation: "Patrick trägt tatsächlich Schuhgröße 50 – keine kleinen Füße! 🦶"
      },
      {
        question: "Was für ein Instrument hat Helga in ihrer Jugend gelernt? 🎼",
        type: "multiple",
        options: ["Mexikanische Rassel", "Steirische Quetschen", "Burgenländer Triangel", "Französisches Waschbrett", "Tiroler Kuhglocke", "Voralberger Alphorn"],
        correct: "Steirische Quetschen",
        explanation: "Helga lernte in ihrer Jugend die Steirische Quetschen – eine echte Gaudi bei jeder Feier! 🎶"
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
        question: "Auf diesem Bild sind drei Personen zu sehen. Wer davon ist unsere Geburtstagskönigin? 📸",
        type: "photo",
        photoSrc: "/photos/vroni/Klein.jpg",
        options: ["Links", "Mitte", "Rechts"],
        correct: "Links",
        explanation: "Helga ist die Person links im Bild – schon damals ein Hingucker! ✨"
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
      
      if (currentQ.type === 'multiple' || currentQ.type === 'photo') {
        isCorrect.value = answer === currentQ.correct
      } else if (currentQ.type === 'text') {
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
    
    const toggleDevMode = () => {
      devMode.value = !devMode.value
      console.log('🔧 Developer Mode:', devMode.value ? 'AN' : 'AUS')
    }
    
    const jumpToQuestionFunc = () => {
      if (jumpToQuestion.value >= 1 && jumpToQuestion.value <= questions.value.length) {
        currentQuestion.value = jumpToQuestion.value - 1
        selectedAnswer.value = ''
        textAnswer.value = ''
        showResult.value = false
        isCorrect.value = false
        
        console.log(`🎯 Springe zu Frage ${jumpToQuestion.value}`)
        
        // Reinitialize AOS for new question
        setTimeout(() => {
          AOS.refresh()
        }, 100)
      }
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

      // Keyboard navigation for intro slides & quiz (Presenter support)
      const keyHandler = (e) => {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : ''
        if (tag === 'input' || tag === 'textarea') return
        
        // Normalize keys
        const key = e.key
        const isForward = ['ArrowRight', 'PageDown'].includes(key) || (key === ' ' && !showIntro.value && showResult.value) || key === 'Enter'
        const isBackward = ['ArrowLeft', 'PageUp'].includes(key)
        
        if (showIntro.value) {
          if (['ArrowRight', 'PageDown'].includes(key)) {
            e.preventDefault()
            nextIntroSlide()
          } else if (['ArrowLeft', 'PageUp'].includes(key)) {
            e.preventDefault()
            prevIntroSlide()
          } else if (key === 'Enter' || key === ' ') {
            e.preventDefault()
            if (currentSlide.value === introSlides.value.length - 1) {
              startQuiz()
            } else {
              nextIntroSlide()
            }
          }
          return
        }

        // Quiz navigation (after intro)
        if (!showIntro.value) {
          // Answer selection via number keys 1-9
          if (!showResult.value && /[1-9]/.test(key)) {
            const idx = parseInt(key, 10) - 1
            const q = questions.value[currentQuestion.value]
            if (q.type === 'multiple' || q.type === 'photo') {
              if (q.options[idx]) {
                selectAnswer(q.options[idx])
              }
            }
          }

            // Advance after result
          if (showResult.value && isForward) {
            e.preventDefault()
            if (currentQuestion.value < questions.value.length - 1) {
              nextQuestion()
            } else if (correctAnswers.value >= minCorrectAnswers.value) {
              unlockWebsite()
            }
          }
        }
      }
      window.addEventListener('keydown', keyHandler)

      // Store for cleanup
      _keyCleanup.value = () => window.removeEventListener('keydown', keyHandler)
    })

    const _keyCleanup = ref(null)

    onUnmounted(() => {
      if (_keyCleanup.value) _keyCleanup.value()
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
      devMode,
      jumpToQuestion,
      showIntro,
      currentSlide,
      introSlides,
      selectAnswer,
      checkTextAnswer,
      nextQuestion,
      unlockWebsite,
      restartQuiz,
      secretSkipQuiz,
      toggleDevMode,
      jumpToQuestionFunc,
      nextIntroSlide,
      prevIntroSlide,
      startQuiz
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
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  padding-top: 2rem;
  overflow-y: auto;
  min-height: 100vh;
}

.quiz-container {
  max-width: 600px;
  width: 100%;
  position: relative;
  padding: 0 1rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 4rem);
  justify-content: flex-start;
}

.quiz-header {
  text-align: center;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  flex-shrink: 0;
  padding-top: 1rem;
}

.quiz-title {
  font-family: 'Fredoka One', cursive;
  font-size: clamp(1.2rem, 4vw, 2.8rem);
  margin-bottom: 0.8rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
  padding: 0 0.5rem;
}

.quiz-subtitle {
  font-size: clamp(0.9rem, 2.8vw, 1.1rem);
  margin-bottom: 1.2rem;
  opacity: 0.9;
  line-height: 1.5;
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

.intro-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 1rem;
  min-height: 100%;
}

.intro-slide {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  padding: 2.5rem 2rem 2rem;
  max-width: 680px;
  width: 100%;
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(6px);
  border: 3px solid rgba(255,255,255,0.7);
  animation: fadeIn 0.6s ease;
}

.intro-slide::before {
  content: '';
  position: absolute;
  top: -40%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 30%, rgba(255,107,107,0.15), transparent),
              radial-gradient(circle at 70% 70%, rgba(78,205,196,0.15), transparent);
  z-index: 0;
  animation: pulseBg 6s linear infinite;
}

@keyframes pulseBg {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.intro-title {
  font-family: 'Fredoka One', cursive;
  font-size: clamp(1.6rem, 4.5vw, 3.2rem);
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.15;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  position: relative;
  z-index: 1;
}

.intro-lines {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.intro-lines li {
  background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
  padding: 0.9rem 1.2rem;
  border-radius: 15px;
  font-size: clamp(1rem, 2.2vw, 1.3rem);
  font-weight: 500;
  line-height: 1.4;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  backdrop-filter: blur(4px);
  position: relative;
}

.intro-lines li::before {
  content: '🎈';
  position: absolute;
  left: -12px;
  top: 8px;
  font-size: 1.2rem;
  animation: float 4s ease-in-out infinite;
}

@keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }

.intro-footer {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 1.8rem;
  position: relative;
  z-index: 1;
}

.intro-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}

.nav-btn, .start-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.9rem 1.4rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.nav-btn:hover:not(:disabled), .start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.start-btn {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  font-size: 1.1rem;
  padding: 1rem 1.6rem;
  animation: pulse 2.2s ease-in-out infinite;
}

.dots {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(0,0,0,0.15);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.dot.active {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  transform: scale(1.2);
  box-shadow: 0 0 0 6px rgba(255,255,255,0.6);
}

.dot:hover:not(.active) { background: rgba(0,0,0,0.3); }

.intro-hint {
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 1.2rem;
  font-style: italic;
  position: relative;
  z-index: 1;
}

/* Existing styles below remain unchanged */

.question-card {
  background: white;
  border-radius: 25px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  flex-grow: 1;
  min-height: auto;
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

/* Photo Question Styling */
.photo-question {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.photo-container {
  margin-bottom: 25px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  background: white;
  padding: 10px;
}

.question-photo {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.photo-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.photo-option-btn {
  background: linear-gradient(135deg, #e8f5ff, #b3e0ff);
  color: #2c3e50;
  border: 2px solid #74b9ff;
  border-radius: 20px;
  padding: 12px 25px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(116, 185, 255, 0.2);
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.photo-option-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(116, 185, 255, 0.3);
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.photo-option-btn.selected {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  border-color: #e17055;
  color: #2d3436;
}

.photo-option-btn.correct {
  background: linear-gradient(135deg, #55a3ff, #74b9ff) !important;
  border-color: #0984e3 !important;
  color: white !important;
  animation: correctPulse 0.8s ease-in-out;
}

.photo-option-btn.wrong {
  background: linear-gradient(135deg, #ff7675, #e84393) !important;
  border-color: #d63031 !important;
  color: white !important;
  animation: wrongShake 0.6s ease-in-out;
}

.option-number {
  font-weight: 700;
  font-size: 20px;
}

.option-text {
  font-weight: 600;
}

/* Mobile responsiveness for photo questions */
@media (max-width: 768px) {
  .photo-container {
    margin-bottom: 20px;
    padding: 8px;
  }
  
  .question-photo {
    max-height: 300px;
  }
  
  .photo-option-btn {
    font-size: 16px;
    padding: 10px 20px;
    min-width: 180px;
  }
  
  .option-number {
    font-size: 18px;
  }
}

/* Developer Mode Styling */
.dev-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.3s ease;
  user-select: none;
}

.dev-toggle:hover {
  opacity: 1;
}

.dev-controls {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;
  backdrop-filter: blur(10px);
}

.jump-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.jump-controls label {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.jump-input {
  width: 60px;
  padding: 5px 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  text-align: center;
}

.jump-btn {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.jump-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(116, 185, 255, 0.3);
}

@media (max-width: 480px) {
  .question-photo {
    max-height: 250px;
  }
  
  .photo-option-btn {
    font-size: 14px;
    padding: 8px 15px;
    min-width: 150px;
  }
  
  .option-number {
    font-size: 16px;
  }
}
</style>
