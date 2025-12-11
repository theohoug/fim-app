// ===== HAPTIC FEEDBACK =====
function haptic(type = 'light') {
    if ('vibrate' in navigator) {
        const patterns = {
            light: [8],
            medium: [15],
            heavy: [25],
            success: [8, 40, 15],
            error: [15, 30, 15, 30, 15]
        };
        navigator.vibrate(patterns[type] || patterns.light);
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, duration = 2500) {
    haptic('light');
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('visible');
    
    setTimeout(() => {
        toast.classList.remove('visible');
    }, duration);
}

// ===== CONFETTI =====
function triggerConfetti(count = 50) {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    const colors = ['#C9A962', '#E8B866', '#D4A574', '#34C759', '#FF453A', '#FFFFFF'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.width = (Math.random() * 8 + 5) + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s ease-out forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

// ===== LOCAL STORAGE =====
const Storage = {
    prefix: 'fim_',
    
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    },
    
    clear() {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .forEach(key => localStorage.removeItem(key));
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
};

// ===== USER DATA =====
const UserData = {
    default: {
        allergens: [],
        diet: {
            vegetarian: false,
            eatsFish: true,
            eatsPork: true,
            drinksAlcohol: true
        },
        preferences: {
            menuType: 'full', // full, starter_main, main_dessert, main_only
            wantsCheesePlate: false,
            wantsWinePairing: false,
            wantsShoppingList: false,
            servings: 2
        },
        answers: [],
        profile: null,
        streak: 0,
        completedQuizzes: 0
    },
    
    load() {
        return Storage.get('user_data', this.default);
    },
    
    save(data) {
        return Storage.set('user_data', { ...this.default, ...data });
    },
    
    update(partial) {
        const current = this.load();
        return this.save({ ...current, ...partial });
    },
    
    reset() {
        return Storage.set('user_data', this.default);
    }
};

// ===== QUESTION FILTERING =====
function filterQuestions(questions, userData) {
    const { allergens, diet } = userData;
    
    return questions.filter(q => {
        // Skip questions about allergens user has
        if (q.tags) {
            for (const tag of q.tags) {
                if (allergens.includes(tag)) return false;
            }
        }
        
        // Skip meat questions if vegetarian
        if (diet.vegetarian && q.tags?.includes('meat')) return false;
        
        // Skip fish questions if doesn't eat fish
        if (!diet.eatsFish && q.tags?.includes('fish')) return false;
        
        // Skip pork questions if doesn't eat pork
        if (!diet.eatsPork && q.tags?.includes('pork')) return false;
        
        // Skip alcohol questions if doesn't drink
        if (!diet.drinksAlcohol && q.tags?.includes('alcohol')) return false;
        
        return true;
    });
}

// ===== BUILD QUESTIONS LIST =====
function buildQuestionsList(userData, questionCount = 30) {
    const { preferences } = userData;
    let questions = [];
    
    // Always add taste questions
    questions.push(...filterQuestions(QUESTIONS.tastes, userData));
    questions.push(...filterQuestions(QUESTIONS.textures, userData));
    questions.push(...filterQuestions(QUESTIONS.cuisines, userData));
    questions.push(...filterQuestions(QUESTIONS.vegetables, userData));
    questions.push(...filterQuestions(QUESTIONS.styles, userData));
    
    // Add protein questions based on diet
    questions.push(...filterQuestions(QUESTIONS.proteins, userData));
    
    // Add dessert questions
    questions.push(...filterQuestions(QUESTIONS.desserts, userData));
    
    // Add cheese questions if wants cheese plate
    if (preferences.wantsCheesePlate) {
        questions.push(...filterQuestions(QUESTIONS.cheese, userData));
    }
    
    // Add wine questions if wants wine pairing and drinks alcohol
    if (preferences.wantsWinePairing && userData.diet.drinksAlcohol) {
        questions.push(...filterQuestions(QUESTIONS.wine, userData));
    }
    
    // Shuffle and limit to desired count
    questions = shuffleArray(questions);
    return questions.slice(0, questionCount);
}

// ===== PROFILE CALCULATION =====
function calculateProfile(answers) {
    const positiveAnswers = answers.filter(a => a.answer).map(a => a.id);
    
    // Score each profile type
    const scores = PROFILE_TYPES.map(profile => {
        const matchCount = profile.traits.filter(trait => 
            positiveAnswers.includes(trait)
        ).length;
        return { profile, score: matchCount };
    });
    
    // Sort by score and return best match
    scores.sort((a, b) => b.score - a.score);
    return scores[0].profile;
}

// ===== ARRAY HELPERS =====
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===== DOM HELPERS =====
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function createElement(tag, className = '', innerHTML = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
}

// ===== SHARE =====
async function shareContent(title, text, url = window.location.href) {
    haptic('medium');
    
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
            return true;
        } catch (e) {
            if (e.name !== 'AbortError') {
                console.error('Share error:', e);
            }
            return false;
        }
    } else {
        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(text + ' ' + url);
            showToast('Copié dans le presse-papier !');
            return true;
        } catch (e) {
            console.error('Clipboard error:', e);
            showToast('Erreur lors de la copie');
            return false;
        }
    }
}

// ===== DEBOUNCE =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== THROTTLE =====
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
