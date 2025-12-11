// ===== APP STATE =====
const App = {
    // Current state
    currentPage: 'home',
    userData: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    streak: 0,
    selectedQuestionCount: 30,
    
    // Initialize app
    init() {
        // Load user data
        this.userData = UserData.load();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show home page
        this.navigateTo('home');
        
        console.log('FIM App initialized');
    },
    
    // Setup global event listeners
    setupEventListeners() {
        // Prevent pull-to-refresh
        document.body.addEventListener('touchmove', (e) => {
            if (e.target.closest('.page-content')) return;
            e.preventDefault();
        }, { passive: false });
    },
    
    // ===== NAVIGATION =====
    navigateTo(page, data = {}) {
        haptic('light');
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show target page
        setTimeout(() => {
            const targetPage = document.getElementById(`${page}Page`);
            if (targetPage) {
                targetPage.classList.add('active');
                this.currentPage = page;
                
                // Page-specific init
                this.onPageEnter(page, data);
            }
        }, 50);
    },
    
    // Handle page enter
    onPageEnter(page, data) {
        switch(page) {
            case 'swipe':
                this.initSwipePage();
                break;
            case 'results':
                this.initResultsPage();
                break;
        }
    },
    
    // ===== ALLERGENS SETUP =====
    toggleAllergen(allergenId, element) {
        haptic('light');
        
        const allergens = this.userData.allergens || [];
        const index = allergens.indexOf(allergenId);
        
        if (index > -1) {
            allergens.splice(index, 1);
            element.classList.remove('selected');
        } else {
            allergens.push(allergenId);
            element.classList.add('selected');
        }
        
        this.userData.allergens = allergens;
        UserData.update({ allergens });
    },
    
    // Check if user has any allergens
    hasAllergens() {
        return this.userData.allergens && this.userData.allergens.length > 0;
    },
    
    // ===== DIET PREFERENCES =====
    setDietPreference(key, value) {
        haptic('light');
        
        this.userData.diet = this.userData.diet || {};
        this.userData.diet[key] = value;
        UserData.update({ diet: this.userData.diet });
    },
    
    // ===== MENU PREFERENCES =====
    setMenuType(type, element) {
        haptic('light');
        
        // Update UI
        document.querySelectorAll('.menu-type-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        
        // Update data
        this.userData.preferences = this.userData.preferences || {};
        this.userData.preferences.menuType = type;
        UserData.update({ preferences: this.userData.preferences });
    },
    
    toggleCheesePlate(element) {
        haptic('light');
        
        this.userData.preferences = this.userData.preferences || {};
        this.userData.preferences.wantsCheesePlate = !this.userData.preferences.wantsCheesePlate;
        
        element.classList.toggle('selected', this.userData.preferences.wantsCheesePlate);
        UserData.update({ preferences: this.userData.preferences });
    },
    
    toggleWinePairing(element) {
        haptic('light');
        
        // Only if user drinks alcohol
        if (!this.userData.diet?.drinksAlcohol) {
            showToast("Tu as indiqué ne pas boire d'alcool");
            return;
        }
        
        this.userData.preferences = this.userData.preferences || {};
        this.userData.preferences.wantsWinePairing = !this.userData.preferences.wantsWinePairing;
        
        element.classList.toggle('selected', this.userData.preferences.wantsWinePairing);
        UserData.update({ preferences: this.userData.preferences });
    },
    
    toggleShoppingList(element) {
        haptic('light');
        
        this.userData.preferences = this.userData.preferences || {};
        this.userData.preferences.wantsShoppingList = !this.userData.preferences.wantsShoppingList;
        
        element.classList.toggle('selected', this.userData.preferences.wantsShoppingList);
        UserData.update({ preferences: this.userData.preferences });
    },
    
    // ===== SERVINGS =====
    setServings(count) {
        haptic('light');
        
        this.userData.preferences = this.userData.preferences || {};
        this.userData.preferences.servings = Math.max(1, Math.min(12, count));
        
        const display = document.getElementById('servingsValue');
        if (display) display.textContent = this.userData.preferences.servings;
        
        UserData.update({ preferences: this.userData.preferences });
    },
    
    incrementServings() {
        const current = this.userData.preferences?.servings || 2;
        this.setServings(current + 1);
    },
    
    decrementServings() {
        const current = this.userData.preferences?.servings || 2;
        this.setServings(current - 1);
    },
    
    // ===== QUESTION COUNT =====
    selectQuestionCount(count, element) {
        haptic('light');
        
        this.selectedQuestionCount = count;
        
        document.querySelectorAll('.question-count-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
    },
    
    // ===== START QUIZ =====
    startQuiz() {
        haptic('medium');
        
        // Build questions based on user preferences
        this.questions = buildQuestionsList(this.userData, this.selectedQuestionCount);
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.streak = 0;
        
        // Navigate to swipe
        this.navigateTo('swipe');
    },
    
    // ===== SWIPE PAGE =====
    initSwipePage() {
        this.renderCards();
        this.updateProgress();
        document.getElementById('streakCount').textContent = this.streak;
    },
    
    renderCards() {
        const stack = document.getElementById('cardStack');
        if (!stack) return;
        
        stack.innerHTML = '';
        
        // Preload next images
        for (let i = this.currentQuestionIndex; i < Math.min(this.currentQuestionIndex + 3, this.questions.length); i++) {
            if (this.questions[i]?.image) {
                const img = new Image();
                img.src = this.questions[i].image;
            }
        }
        
        // Render cards (reverse order so first card is on top)
        for (let i = Math.min(this.currentQuestionIndex + 2, this.questions.length - 1); i >= this.currentQuestionIndex; i--) {
            if (i >= this.questions.length) continue;
            
            const q = this.questions[i];
            const card = this.createCard(q, i);
            
            if (i === this.currentQuestionIndex) {
                card.classList.add('active-card');
                this.setupSwipeForCard(card);
            } else if (i === this.currentQuestionIndex + 1) {
                card.classList.add('behind-1');
            } else if (i === this.currentQuestionIndex + 2) {
                card.classList.add('behind-2');
            }
            
            stack.appendChild(card);
        }
    },
    
    createCard(question, index) {
        const card = document.createElement('div');
        card.className = 'swipe-card';
        card.dataset.index = index;
        
        const imageUrl = question.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=700&fit=crop&q=80';
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${imageUrl}" alt="" class="card-image" draggable="false">
                <div class="card-image-overlay"></div>
            </div>
            <div class="card-content">
                <span class="badge badge-gold">
                    <span class="badge-dot"></span>
                    ${question.category || 'Goût'}
                </span>
                <h2 class="card-question">${question.question}</h2>
            </div>
            <div class="swipe-indicator like">OUI</div>
            <div class="swipe-indicator nope">NON</div>
        `;
        
        return card;
    },
    
    setupSwipeForCard(card) {
        Swipe.init(card, {
            onSwipeRight: () => {
                this.streak++;
                document.getElementById('streakCount').textContent = this.streak;
            },
            onSwipeComplete: (direction) => {
                this.handleSwipeComplete(direction);
            }
        });
    },
    
    handleSwipeComplete(direction) {
        // Record answer
        const question = this.questions[this.currentQuestionIndex];
        this.answers.push({
            id: question.id,
            question: question.question,
            answer: direction === 'right'
        });
        
        // Next question
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            // Quiz complete
            this.completeQuiz();
        } else {
            this.renderCards();
            this.updateProgress();
        }
    },
    
    swipeCard(direction) {
        Swipe.swipe(direction);
    },
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;
    },
    
    // ===== COMPLETE QUIZ =====
    completeQuiz() {
        // Calculate profile
        const profile = calculateProfile(this.answers);
        
        // Save results
        this.userData.profile = profile;
        this.userData.answers = this.answers;
        this.userData.completedQuizzes = (this.userData.completedQuizzes || 0) + 1;
        UserData.save(this.userData);
        
        // Navigate to results
        this.navigateTo('results');
        
        // Celebrate!
        setTimeout(() => {
            triggerConfetti();
            haptic('success');
        }, 300);
    },
    
    // ===== RESULTS PAGE =====
    initResultsPage() {
        const profile = this.userData.profile;
        if (!profile) return;
        
        // Update profile display
        const profileName = document.querySelector('.profile-name');
        const profileDesc = document.querySelector('.profile-desc');
        const tagsContainer = document.querySelector('.profile-tags');
        
        if (profileName) profileName.textContent = profile.name;
        if (profileDesc) profileDesc.textContent = profile.desc;
        if (tagsContainer) {
            tagsContainer.innerHTML = profile.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
        }
    },
    
    // ===== SHARE =====
    shareProfile() {
        const profile = this.userData.profile;
        if (!profile) return;
        
        shareContent(
            'Mon profil FIM',
            `Je suis "${profile.name}" ! 🍽️ Découvre ton profil culinaire sur FIM !`
        );
    },
    
    // ===== AUTH =====
    showAuth(mode = 'signup') {
        // Check if user wants premium features
        const wantsShoppingList = this.userData.preferences?.wantsShoppingList;
        
        this.navigateTo('auth', { mode });
    }
};

// ===== GLOBAL FUNCTIONS (for onclick handlers) =====
function navigateTo(page) {
    App.navigateTo(page);
}

function toggleAllergen(id, el) {
    App.toggleAllergen(id, el);
}

function setMenuType(type, el) {
    App.setMenuType(type, el);
}

function toggleCheesePlate(el) {
    App.toggleCheesePlate(el);
}

function toggleWinePairing(el) {
    App.toggleWinePairing(el);
}

function toggleShoppingList(el) {
    App.toggleShoppingList(el);
}

function incrementServings() {
    App.incrementServings();
}

function decrementServings() {
    App.decrementServings();
}

function selectQuestionCount(count, el) {
    App.selectQuestionCount(count, el);
}

function startQuiz() {
    App.startQuiz();
}

function swipeCard(direction) {
    App.swipeCard(direction);
}

function shareProfile() {
    App.shareProfile();
}

function showAuth(mode) {
    App.showAuth(mode);
}

// ===== INIT ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
