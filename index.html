/* =====================================================
   YUMR - Swipe. Cook. Enjoy.
   Premium Culinary App
   ===================================================== */

const API_URL = 'https://foodmatchs-api-production.up.railway.app/api';

// =====================================================
// MOCK DATA
// =====================================================

const MOCK_FRIDGE = [
    { id: '1', name: 'Œufs', quantity: '6', category: 'laitiers', icon: '🥚', expirationDate: '2024-12-15' },
    { id: '2', name: 'Poulet', quantity: '500g', category: 'viandes', icon: '🍗', expirationDate: '2024-12-13' },
    { id: '3', name: 'Tomates', quantity: '4', category: 'legumes', icon: '🍅', expirationDate: '2024-12-14' },
    { id: '4', name: 'Parmesan', quantity: '150g', category: 'laitiers', icon: '🧀', expirationDate: '2024-12-20' },
    { id: '5', name: 'Pâtes', quantity: '500g', category: 'epicerie', icon: '🍝', expirationDate: '2025-06-01' },
    { id: '6', name: 'Crème fraîche', quantity: '20cl', category: 'laitiers', icon: '🥛', expirationDate: '2024-12-13' },
];

const MOCK_LEADERBOARD = [
    { rank: 1, name: 'ChefPro99', points: 2847, avatar: 'https://i.pravatar.cc/100?img=1' },
    { rank: 2, name: 'MarieFood', points: 2634, avatar: 'https://i.pravatar.cc/100?img=2' },
    { rank: 3, name: 'CuistoMax', points: 2521, avatar: 'https://i.pravatar.cc/100?img=3' },
    { rank: 4, name: 'GourmetLucie', points: 2398, avatar: 'https://i.pravatar.cc/100?img=4' },
    { rank: 5, name: 'ChefThomas', points: 2256, avatar: 'https://i.pravatar.cc/100?img=5' },
    { rank: 6, name: 'FoodieParis', points: 2134, avatar: 'https://i.pravatar.cc/100?img=6' },
    { rank: 7, name: 'CookMaster', points: 2089, avatar: 'https://i.pravatar.cc/100?img=7' },
    { rank: 8, name: 'ChefSophie', points: 1987, avatar: 'https://i.pravatar.cc/100?img=8' },
    { rank: 9, name: 'GastroNico', points: 1856, avatar: 'https://i.pravatar.cc/100?img=9' },
    { rank: 10, name: 'YumrFan', points: 1743, avatar: 'https://i.pravatar.cc/100?img=10' },
];

const MOCK_BADGES = [
    { id: 1, name: 'Premier Plat', icon: '🥇', desc: 'Cuisiner sa première recette', unlocked: true },
    { id: 2, name: 'Streak 7j', icon: '🔥', desc: '7 jours consécutifs', unlocked: true },
    { id: 3, name: 'Social Chef', icon: '👥', desc: '100 abonnés', unlocked: false },
    { id: 4, name: 'Globe-trotter', icon: '🌍', desc: '10 cuisines différentes', unlocked: true },
    { id: 5, name: 'Veggie Week', icon: '🌱', desc: '7 jours végétarien', unlocked: false },
    { id: 6, name: 'Sommelier', icon: '🍷', desc: '50 accords mets-vins', unlocked: false },
    { id: 7, name: 'Économe', icon: '💰', desc: '10 repas à moins de 5€', unlocked: true },
    { id: 8, name: 'Batch Master', icon: '📅', desc: '4 meal preps complétés', unlocked: false },
    { id: 9, name: 'Streak 30j', icon: '🔥🔥', desc: '30 jours consécutifs', unlocked: false },
];

const QUIZ_IMAGES = {
    'pizza': 'photo-1565299624946-b28f40a0ae38',
    'pasta': 'photo-1621996346565-e3dbc646d9a9',
    'sushi': 'photo-1579871494447-9811cf80d66c',
    'burger': 'photo-1568901346375-23c9450c58cd',
    'salade': 'photo-1512621776951-a57141f2eefd',
    'dessert': 'photo-1551024601-bec78aea704b',
    'viande': 'photo-1600891964092-4316c288032e',
    'poisson': 'photo-1534604973900-c43ab4c2e0ab',
    'asiatique': 'photo-1569718212165-3a8278d5f624',
    'mexicain': 'photo-1565299585323-38d6b0865b47',
    'default': 'photo-1504674900247-0877df9cc836'
};

const RECIPE_IMAGES = {
    'starter': 'photo-1512621776951-a57141f2eefd',
    'main': 'photo-1546069901-ba9599a7e63c',
    'dessert': 'photo-1551024601-bec78aea704b',
    'cheese': 'photo-1452195100486-9cc805987862',
    'wine': 'photo-1510812431401-41d2bd2722f3'
};

// =====================================================
// STATE
// =====================================================

const state = {
    user: null,
    token: null,
    questionCount: 30,
    diet: 'omnivore',
    allergies: [],
    goal: 'none',
    questions: [],
    answers: [],
    currentQuestion: 0,
    calculatedProfile: null,
    recipes: [],
    favorites: JSON.parse(localStorage.getItem('yumr_favorites') || '[]'),
    fridge: [...MOCK_FRIDGE],
    todayMenu: null,
    menuOptions: {
        budget: 'medium',
        persons: 2,
        maxTime: 30,
        useFridge: false,
        cheese: false,
        wine: false
    },
    currentSlide: 1
};

// =====================================================
// HELPERS
// =====================================================

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

async function api(endpoint, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...opts.headers };
    if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
    const res = await fetch(`${API_URL}${endpoint}`, { ...opts, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur');
    return data;
}

function showScreen(id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${id}`).classList.add('active');
    window.scrollTo(0, 0);
}

function showTab(tab) {
    $$('.tab-page').forEach(t => t.classList.remove('active'));
    $$('.nav-item').forEach(b => b.classList.remove('active'));
    $(`#tab-${tab}`)?.classList.add('active');
    $(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
    
    if (tab === 'explore') loadRecipes();
    if (tab === 'leagues') loadLeaderboard();
    if (tab === 'profile') updateProfileUI();
}

function showModal(id) { $(`#${id}`).classList.add('active'); }
function hideModal(id) { $(`#${id}`).classList.remove('active'); }

function toast(msg, type = '') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    $('#toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function showXP(amount) {
    const popup = $('#xp-popup');
    $('.xp-popup-text').textContent = `+${amount} XP`;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 2000);
}

function getQuizImage(question) {
    const text = (question.question || '').toLowerCase();
    for (const [key, val] of Object.entries(QUIZ_IMAGES)) {
        if (text.includes(key)) return `https://images.unsplash.com/${val}?w=400&h=250&fit=crop`;
    }
    return `https://images.unsplash.com/${QUIZ_IMAGES.default}?w=400&h=250&fit=crop`;
}

function getRecipeImage(recipe) {
    const type = recipe?.type || 'main';
    const photoId = RECIPE_IMAGES[type] || RECIPE_IMAGES.main;
    return `https://images.unsplash.com/${photoId}?w=400&h=300&fit=crop`;
}

function getDaysUntilExpiry(date) {
    const today = new Date();
    const expiry = new Date(date);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff;
}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    initSwipe();
    
    // Splash screen
    setTimeout(() => {
        checkAuth();
    }, 2000);
});

function checkAuth() {
    const token = localStorage.getItem('yumr_token');
    const user = localStorage.getItem('yumr_user');
    
    if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        loadMainApp();
    } else {
        showScreen('welcome-screen');
    }
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function initEventListeners() {
    // Welcome screen
    $('#welcome-start-btn').onclick = () => showScreen('quiz-setup-screen');
    $('#welcome-login-btn').onclick = () => showScreen('login-screen');
    
    // Welcome slides
    $$('.dot').forEach(dot => {
        dot.onclick = () => goToSlide(parseInt(dot.dataset.slide));
    });
    
    // Login
    $('#login-back-btn').onclick = () => showScreen('welcome-screen');
    $('#login-form').onsubmit = handleLogin;
    
    // Quiz setup
    $('#quiz-setup-back-btn').onclick = () => showScreen('welcome-screen');
    $$('input[name="quiz-count"]').forEach(i => i.onchange = () => state.questionCount = +i.value);
    $$('input[name="diet"]').forEach(i => i.onchange = () => state.diet = i.value);
    $$('.allergy-chip input').forEach(i => i.onchange = () => {
        state.allergies = [...$$('.allergy-chip input:checked')].map(c => c.value);
    });
    $$('input[name="goal"]').forEach(i => i.onchange = () => state.goal = i.value);
    $('#start-quiz-btn').onclick = startQuiz;
    
    // Quiz
    $('#quiz-close-btn').onclick = () => { if (confirm('Quitter le quiz ?')) showScreen('quiz-setup-screen'); };
    $('#quiz-nope-btn').onclick = () => answerQuestion(false);
    $('#quiz-love-btn').onclick = () => answerQuestion(true);
    
    // Result
    $('#create-account-btn').onclick = () => {
        if (state.calculatedProfile) $('#register-profile').textContent = state.calculatedProfile.name;
        showScreen('register-screen');
    };
    $('#skip-account-btn').onclick = () => { toast('Mode invité'); loadMainAppAsGuest(); };
    
    // Register
    $('#register-back-btn').onclick = () => showScreen('result-screen');
    $('#register-form').onsubmit = handleRegister;
    
    // Navigation
    $$('.nav-item').forEach(b => b.onclick = () => showTab(b.dataset.tab));
    
    // Home - Menu generation
    $('#generate-menu-btn').onclick = () => showModal('menu-options-modal');
    
    // Menu options
    $$('.budget-btn').forEach(b => b.onclick = () => {
        $$('.budget-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        state.menuOptions.budget = b.dataset.budget;
    });
    
    $$('.time-btn').forEach(b => b.onclick = () => {
        $$('.time-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        state.menuOptions.maxTime = parseInt(b.dataset.time);
    });
    
    $('#persons-minus').onclick = () => {
        state.menuOptions.persons = Math.max(1, state.menuOptions.persons - 1);
        $('#persons-value').textContent = state.menuOptions.persons;
    };
    $('#persons-plus').onclick = () => {
        state.menuOptions.persons = Math.min(12, state.menuOptions.persons + 1);
        $('#persons-value').textContent = state.menuOptions.persons;
    };
    
    $('#use-fridge-toggle').onchange = e => state.menuOptions.useFridge = e.target.checked;
    $('#cheese-toggle').onchange = e => state.menuOptions.cheese = e.target.checked;
    $('#wine-toggle').onchange = e => state.menuOptions.wine = e.target.checked;
    
    $('#confirm-menu-btn').onclick = generateDailyMenu;
    
    // Quick actions
    $('#quick-fridge').onclick = () => { openFridge(); };
    $('#menu-fridge').onclick = () => { openFridge(); };
    $('#quick-shopping').onclick = () => showModal('shopping-modal');
    $('#quick-mealprep').onclick = () => toast('Meal Prep - Bientôt disponible !');
    $('#quick-coach').onclick = () => toast('Coach IA - Bientôt disponible !');
    
    // Modal closes
    $$('[data-close]').forEach(b => b.onclick = () => hideModal(b.dataset.close));
    $$('.modal-overlay').forEach(el => el.onclick = () => el.closest('.modal').classList.remove('active'));
    
    // Fridge
    $('#add-ingredient-btn').onclick = () => showModal('add-ingredient-modal');
    $('#save-ingredient-btn').onclick = saveIngredient;
    $('#scan-fridge-btn').onclick = () => toast('Snap Frigo IA - Bientôt disponible !');
    $('#scan-receipt-btn').onclick = () => toast('Scan ticket - Bientôt disponible !');
    $('#tgtg-btn').onclick = () => toast('Too Good To Go - Bientôt disponible !');
    
    $$('.fridge-cat').forEach(c => c.onclick = () => {
        $$('.fridge-cat').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        displayFridge(c.dataset.cat);
    });
    
    // Explore
    let searchTimeout;
    $('#search-recipes').oninput = e => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadRecipes(e.target.value), 300);
    };
    
    $$('.filter-chip').forEach(c => c.onclick = () => {
        $$('.filter-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        loadRecipes('', c.dataset.filter);
    });
    
    // Post
    $('#upload-zone').onclick = () => $('#post-image-input').click();
    $('#post-image-input').onchange = handlePostImage;
    $('#publish-post-btn').onclick = publishPost;
    
    // Leagues
    $('#view-league-btn').onclick = () => showTab('leagues');
    
    // Profile
    $('#avatar-edit-btn').onclick = () => $('#avatar-input').click();
    $('#avatar-input').onchange = handleAvatarUpload;
    $('#menu-preferences').onclick = () => toast('Préférences - Ouvrir les paramètres');
    $('#menu-premium').onclick = () => showModal('premium-modal');
    $('#menu-referral').onclick = () => toast('Code parrainage copié !', 'success');
    $('#menu-settings').onclick = () => toast('Paramètres - Bientôt disponible');
    $('#menu-logout').onclick = logout;
    $('#view-all-badges').onclick = () => showModal('badges-modal');
    
    // Premium
    $('#subscribe-btn').onclick = () => toast('Essai gratuit activé !', 'success');
}

// Welcome slides
function goToSlide(num) {
    state.currentSlide = num;
    $$('.welcome-slide').forEach(s => s.classList.remove('active'));
    $$('.dot').forEach(d => d.classList.remove('active'));
    $(`.welcome-slide[data-slide="${num}"]`).classList.add('active');
    $(`.dot[data-slide="${num}"]`).classList.add('active');
}

// =====================================================
// SWIPE
// =====================================================

function initSwipe() {
    const card = $('#quiz-card');
    if (!card) return;
    
    let startX = 0, currentX = 0, isDragging = false;
    
    const onStart = (x) => {
        startX = x;
        currentX = x;
        isDragging = true;
        card.classList.add('dragging');
    };
    
    const onMove = (x) => {
        if (!isDragging) return;
        currentX = x;
        const diff = currentX - startX;
        card.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
        
        card.classList.remove('hint-left', 'hint-right');
        if (diff < -50) card.classList.add('hint-left');
        if (diff > 50) card.classList.add('hint-right');
    };
    
    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');
        
        const diff = currentX - startX;
        if (diff < -100) {
            answerQuestion(false);
        } else if (diff > 100) {
            answerQuestion(true);
        } else {
            card.style.transform = '';
            card.classList.remove('hint-left', 'hint-right');
        }
    };
    
    card.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
    card.addEventListener('touchmove', e => onMove(e.touches[0].clientX), { passive: true });
    card.addEventListener('touchend', onEnd);
    
    card.addEventListener('mousedown', e => onStart(e.clientX));
    document.addEventListener('mousemove', e => onMove(e.clientX));
    document.addEventListener('mouseup', onEnd);
}

// =====================================================
// AUTH
// =====================================================

async function handleLogin(e) {
    e.preventDefault();
    try {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: $('#login-email').value,
                password: $('#login-password').value
            })
        });
        
        state.token = data.token;
        state.user = data.user;
        localStorage.setItem('yumr_token', data.token);
        localStorage.setItem('yumr_user', JSON.stringify(data.user));
        loadMainApp();
    } catch (err) {
        $('#login-error').textContent = err.message;
        $('#login-error').classList.add('show');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    try {
        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: $('#register-username').value,
                email: $('#register-email').value,
                password: $('#register-password').value
            })
        });
        
        state.token = data.token;
        state.user = data.user;
        localStorage.setItem('yumr_token', data.token);
        localStorage.setItem('yumr_user', JSON.stringify(data.user));
        
        // Save quiz + preferences
        if (state.answers.length > 0) {
            try {
                await api('/quiz/submit', {
                    method: 'POST',
                    body: JSON.stringify({
                        answers: state.answers,
                        diet: state.diet,
                        allergens: JSON.stringify(state.allergies)
                    })
                });
            } catch (err) { console.error(err); }
        }
        
        toast('Bienvenue sur Yumr! 🎉', 'success');
        showXP(50);
        loadMainApp();
    } catch (err) {
        $('#register-error').textContent = err.message;
        $('#register-error').classList.add('show');
    }
}

function logout() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('yumr_token');
    localStorage.removeItem('yumr_user');
    showScreen('welcome-screen');
}

// =====================================================
// QUIZ
// =====================================================

async function startQuiz() {
    try {
        state.questions = await api(`/quiz/questions?count=${state.questionCount}`);
        state.answers = [];
        state.currentQuestion = 0;
        showScreen('quiz-screen');
        displayQuestion();
    } catch (err) {
        toast('Erreur chargement quiz', 'error');
    }
}

function displayQuestion() {
    const q = state.questions[state.currentQuestion];
    if (!q) return;
    
    const card = $('#quiz-card');
    card.classList.remove('swipe-left', 'swipe-right', 'hint-left', 'hint-right');
    card.style.transform = '';
    
    $('#quiz-card-image').style.backgroundImage = `url(${getQuizImage(q)})`;
    $('#quiz-card-emoji').textContent = q.emoji || '🍽️';
    $('#quiz-card-question').textContent = q.question;
    
    const pct = ((state.currentQuestion + 1) / state.questions.length) * 100;
    $('#quiz-progress-fill').style.width = `${pct}%`;
    $('#quiz-counter').textContent = `${state.currentQuestion + 1}/${state.questions.length}`;
}

function answerQuestion(liked) {
    const q = state.questions[state.currentQuestion];
    state.answers.push({ question_id: q.id, liked });
    
    const card = $('#quiz-card');
    card.classList.add(liked ? 'swipe-right' : 'swipe-left');
    
    // Update streak display
    const streak = state.answers.filter(a => a.liked).length;
    $('#quiz-streak').textContent = streak;
    
    setTimeout(() => {
        state.currentQuestion++;
        if (state.currentQuestion >= state.questions.length) {
            finishQuiz();
        } else {
            displayQuestion();
        }
    }, 300);
}

async function finishQuiz() {
    try {
        const result = await api('/quiz/calculate-profile', {
            method: 'POST',
            body: JSON.stringify({ answers: state.answers })
        });
        state.calculatedProfile = result.profile;
        displayResult(result.profile);
    } catch (err) {
        state.calculatedProfile = { name: 'Gourmet', emoji: '🍳', description: 'Tu apprécies la bonne cuisine.', traits: 'Curieux,Gourmand' };
        displayResult(state.calculatedProfile);
    }
}

function displayResult(profile) {
    showScreen('result-screen');
    $('#result-emoji').textContent = profile.emoji || '🍳';
    $('#result-name').textContent = profile.name || 'Gourmet';
    $('#result-description').textContent = profile.description || '';
    
    const traits = (profile.traits || '').split(',').filter(t => t.trim());
    $('#result-traits').innerHTML = traits.map(t => `<span>${t.trim()}</span>`).join('');
    
    // Add confetti effect
    createConfetti();
}

function createConfetti() {
    const container = $('#result-confetti');
    container.innerHTML = '';
    const colors = ['#FF6B35', '#FFD166', '#4ECB71', '#FF4757'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: 2px;
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        container.appendChild(confetti);
    }
    
    // Add CSS animation
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// =====================================================
// MAIN APP
// =====================================================

async function loadMainApp() {
    showScreen('main-app');
    showTab('home');
    
    try {
        const userData = await api('/auth/me');
        state.user = userData;
        updateUserUI();
    } catch (err) {
        loadMainAppAsGuest();
        return;
    }
    
    checkDailyMenu();
    loadStats();
    loadBadges();
}

function loadMainAppAsGuest() {
    showScreen('main-app');
    showTab('home');
    state.user = { username: 'Invité', level: 1, total_xp: 0 };
    updateUserUI();
}

function updateUserUI() {
    const u = state.user;
    
    // Header
    $('#header-streak').textContent = u.current_streak || 0;
    $('#header-xp').textContent = u.total_xp || 0;
    
    // Home
    $('#home-username').textContent = u.username || 'Chef';
    $('#stat-streak').textContent = u.current_streak || 0;
    $('#stat-xp-week').textContent = u.total_xp || 0;
    $('#stat-recipes').textContent = u.recipes_count || 0;
    
    // Fridge count
    $('#fridge-count').textContent = state.fridge.length;
    
    // Profile
    $('#profile-username').textContent = `@${u.username || 'user'}`;
    $('#profile-level').textContent = u.level || 1;
    $('#profile-xp').textContent = u.total_xp || 0;
    $('#profile-recipes').textContent = u.recipes_count || 0;
    $('#profile-streak-max').textContent = u.longest_streak || 0;
    
    // Culinary profile
    const cp = u.culinary_profile || state.calculatedProfile;
    if (cp) {
        $('.culinary-emoji').textContent = cp.emoji || '🍳';
        $('.culinary-name').textContent = cp.name || 'Gourmet';
    }
    
    // XP bar
    const level = u.level || 1;
    const xp = u.total_xp || 0;
    const currentLevelXP = Math.floor(100 * Math.pow(1.5, level - 1));
    const nextLevelXP = Math.floor(100 * Math.pow(1.5, level));
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    
    $('#current-level').textContent = level;
    $('#current-xp').textContent = xp;
    $('#next-level-xp').textContent = nextLevelXP;
    $('#xp-bar-fill').style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function updateProfileUI() {
    updateUserUI();
    loadBadges();
}

async function loadStats() {
    if (!state.token) return;
    try {
        const stats = await api('/gamification/stats');
        state.user.level = stats.level;
        state.user.total_xp = stats.total_xp;
        state.user.current_streak = stats.current_streak;
        state.user.longest_streak = stats.longest_streak;
        updateUserUI();
    } catch (err) { console.error(err); }
}

// =====================================================
// DAILY MENU
// =====================================================

async function checkDailyMenu() {
    if (!state.token) return;
    try {
        const data = await api('/quiz/daily');
        if (data.already_answered && data.menu) {
            state.todayMenu = data.menu;
            displayTodayMenu();
        }
    } catch (err) { console.error(err); }
}

async function generateDailyMenu() {
    if (!state.token) {
        toast('Connecte-toi d\'abord', 'error');
        return;
    }
    
    const opts = state.menuOptions;
    
    try {
        const data = await api('/quiz/daily', {
            method: 'POST',
            body: JSON.stringify({
                budget: opts.budget,
                servings: opts.persons,
                include_cheese: opts.cheese,
                include_wine: opts.wine
            })
        });
        
        state.todayMenu = data.menu;
        hideModal('menu-options-modal');
        displayTodayMenu();
        
        showXP(data.xp_gained || 20);
        toast(`Streak: ${data.streak} 🔥`, 'success');
        
        $('#header-streak').textContent = data.streak;
        $('#stat-streak').textContent = data.streak;
    } catch (err) {
        toast(err.message || 'Erreur', 'error');
    }
}

function displayTodayMenu() {
    $('#daily-menu-status').textContent = 'Ton menu est prêt !';
    $('#generate-menu-btn').textContent = 'Voir';
    
    const preview = $('#daily-menu-preview');
    preview.classList.remove('hidden');
    
    const types = { starter: 'Entrée', main: 'Plat', dessert: 'Dessert', cheese: 'Fromage', wine: 'Vin' };
    const items = [];
    
    ['starter', 'main', 'dessert', 'cheese', 'wine'].forEach(t => {
        const meal = state.todayMenu[t];
        if (meal) items.push({ type: t, label: types[t], meal });
    });
    
    preview.innerHTML = items.map(i => `
        <div class="menu-item-row" onclick="openRecipe('${i.meal.id}')">
            <div class="menu-item-img" style="background-image:url(${getRecipeImage(i.meal)})"></div>
            <div class="menu-item-info">
                <span class="menu-item-type">${i.label}</span>
                <span class="menu-item-name">${i.meal.name}</span>
            </div>
            <span style="color:var(--text-muted)">→</span>
        </div>
    `).join('');
}

// =====================================================
// FRIDGE
// =====================================================

function openFridge() {
    showModal('fridge-modal');
    displayFridge('all');
    displayExpiringItems();
}

function displayFridge(category = 'all') {
    const items = category === 'all' 
        ? state.fridge 
        : state.fridge.filter(i => i.category === category);
    
    if (!items.length) {
        $('#fridge-list').innerHTML = `
            <div style="text-align:center;padding:40px;color:var(--text-secondary)">
                <p style="font-size:48px;margin-bottom:16px">🧊</p>
                <p>Aucun ingrédient dans cette catégorie</p>
            </div>
        `;
        return;
    }
    
    $('#fridge-list').innerHTML = items.map(item => {
        const days = getDaysUntilExpiry(item.expirationDate);
        let expClass = 'ok';
        let expText = `${days}j`;
        
        if (days < 0) { expClass = 'danger'; expText = 'Périmé'; }
        else if (days <= 2) { expClass = 'danger'; }
        else if (days <= 5) { expClass = 'warning'; }
        
        return `
            <div class="fridge-item">
                <span class="fridge-item-icon">${item.icon || '🥕'}</span>
                <div class="fridge-item-info">
                    <div class="fridge-item-name">${item.name}</div>
                    <div class="fridge-item-qty">${item.quantity}</div>
                </div>
                <span class="fridge-item-exp ${expClass}">${expText}</span>
                <button class="fridge-item-del" onclick="deleteFridgeItem('${item.id}')">🗑️</button>
            </div>
        `;
    }).join('');
}

function displayExpiringItems() {
    const expiring = state.fridge.filter(i => getDaysUntilExpiry(i.expirationDate) <= 3);
    
    if (!expiring.length) {
        $('#fridge-expiring').classList.add('hidden');
        return;
    }
    
    $('#fridge-expiring').classList.remove('hidden');
    $('#expiring-list').innerHTML = expiring.map(i => `
        <div class="fridge-item" style="margin-bottom:8px">
            <span class="fridge-item-icon">${i.icon}</span>
            <div class="fridge-item-info">
                <div class="fridge-item-name">${i.name}</div>
            </div>
            <span class="fridge-item-exp danger">${getDaysUntilExpiry(i.expirationDate)}j</span>
        </div>
    `).join('');
}

function saveIngredient() {
    const name = $('#ingredient-name').value.trim();
    if (!name) { toast('Nom requis', 'error'); return; }
    
    const newItem = {
        id: Date.now().toString(),
        name,
        quantity: $('#ingredient-qty').value || '1',
        category: $('#ingredient-category').value,
        icon: getCategoryIcon($('#ingredient-category').value),
        expirationDate: $('#ingredient-expiry').value || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    state.fridge.push(newItem);
    hideModal('add-ingredient-modal');
    
    // Reset form
    $('#ingredient-name').value = '';
    $('#ingredient-qty').value = '';
    $('#ingredient-expiry').value = '';
    
    toast('Ingrédient ajouté !', 'success');
    displayFridge('all');
    displayExpiringItems();
    $('#fridge-count').textContent = state.fridge.length;
}

function deleteFridgeItem(id) {
    state.fridge = state.fridge.filter(i => i.id !== id);
    displayFridge($('.fridge-cat.active')?.dataset.cat || 'all');
    displayExpiringItems();
    $('#fridge-count').textContent = state.fridge.length;
}

function getCategoryIcon(cat) {
    const icons = { fruits: '🍎', legumes: '🥬', viandes: '🥩', laitiers: '🧀', epicerie: '🥫', surgeles: '🧊' };
    return icons[cat] || '🥕';
}

// =====================================================
// RECIPES
// =====================================================

async function loadRecipes(search = '', filter = 'all') {
    try {
        let endpoint = '/meals?limit=50';
        if (search) endpoint += `&search=${encodeURIComponent(search)}`;
        if (filter && filter !== 'all') endpoint += `&type=${filter}`;
        
        const data = await api(endpoint);
        state.recipes = data.meals || [];
        displayRecipes();
    } catch (err) {
        console.error(err);
        // Use mock data
        state.recipes = [];
        displayRecipes();
    }
}

function displayRecipes() {
    const grid = $('#recipes-grid');
    
    if (!state.recipes.length) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-secondary)">
                <p style="font-size:48px;margin-bottom:16px">🔍</p>
                <h3 style="margin-bottom:8px">Aucun résultat</h3>
                <p>Essaie une autre recherche</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = state.recipes.map(r => {
        const isSaved = state.favorites.includes(r.id);
        return `
            <div class="recipe-card" onclick="openRecipe('${r.id}')">
                <div class="recipe-card-img" style="background-image:url(${getRecipeImage(r)})">
                    <button class="recipe-card-save ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleFavorite('${r.id}')">
                        ${isSaved ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="recipe-card-body">
                    <div class="recipe-card-name">${r.name}</div>
                    <div class="recipe-card-meta">
                        <span>⏱️ ${(r.prep_time || 0) + (r.cook_time || 0)}min</span>
                        <span>💰 ${'€'.repeat(r.budget === 'low' ? 1 : r.budget === 'high' ? 3 : 2)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleFavorite(id) {
    const idx = state.favorites.indexOf(id);
    if (idx > -1) {
        state.favorites.splice(idx, 1);
        toast('Retiré des favoris');
    } else {
        state.favorites.push(id);
        toast('Ajouté aux favoris !', 'success');
    }
    localStorage.setItem('yumr_favorites', JSON.stringify(state.favorites));
    displayRecipes();
}

async function openRecipe(id) {
    try {
        const r = await api(`/meals/${id}`);
        const isSaved = state.favorites.includes(id);
        const types = { starter: 'Entrée', main: 'Plat', dessert: 'Dessert', cheese: 'Fromage', wine: 'Vin' };
        
        $('#recipe-detail-page').innerHTML = `
            <div class="recipe-detail-hero" style="background-image:url(${getRecipeImage(r)})">
                <button class="btn-back recipe-detail-back" onclick="hideModal('recipe-modal')">←</button>
                <button class="recipe-detail-save ${isSaved ? 'saved' : ''}" onclick="toggleFavorite('${id}')">${isSaved ? '❤️' : '🤍'}</button>
            </div>
            <div class="recipe-detail-content">
                <span class="recipe-detail-type">${types[r.type] || r.type}</span>
                <h1 class="recipe-detail-title">${r.name}</h1>
                <p class="recipe-detail-desc">${r.description || ''}</p>
                
                <div class="recipe-detail-meta">
                    <span class="recipe-meta-item">⏱️ ${(r.prep_time || 0) + (r.cook_time || 0)} min</span>
                    <span class="recipe-meta-item">💰 ${'€'.repeat(r.budget === 'low' ? 1 : r.budget === 'high' ? 3 : 2)}</span>
                    ${r.calories ? `<span class="recipe-meta-item">🔥 ${r.calories} kcal</span>` : ''}
                </div>
                
                ${r.ingredients?.length ? `
                    <div class="recipe-detail-section">
                        <h3>🥕 Ingrédients</h3>
                        <ul>${r.ingredients.map(i => `<li><strong>${i.name}</strong> - ${i.qty}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                
                ${r.recipe?.steps?.length ? `
                    <div class="recipe-detail-section">
                        <h3>👨‍🍳 Préparation</h3>
                        <ol>${r.recipe.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                    </div>
                ` : ''}
            </div>
        `;
        
        showModal('recipe-modal');
    } catch (err) {
        toast('Erreur chargement recette', 'error');
    }
}

// =====================================================
// LEADERBOARD
// =====================================================

function loadLeaderboard() {
    const list = $('#leaderboard');
    const myRank = 12; // Mock
    
    list.innerHTML = MOCK_LEADERBOARD.map((p, idx) => `
        <div class="leaderboard-item ${idx + 1 === myRank ? 'me' : ''}">
            <span class="lb-rank ${p.rank === 1 ? 'gold' : p.rank === 2 ? 'silver' : p.rank === 3 ? 'bronze' : ''}">#${p.rank}</span>
            <div class="lb-avatar" style="background-image:url(${p.avatar})"></div>
            <span class="lb-name">${p.name}</span>
            <span class="lb-points">${p.points} pts</span>
        </div>
    `).join('');
    
    $('#league-position').textContent = `#${myRank}`;
}

// =====================================================
// BADGES
// =====================================================

function loadBadges() {
    // Preview (first 5)
    $('#badges-preview').innerHTML = MOCK_BADGES.slice(0, 5).map(b => `
        <div class="badge-item ${b.unlocked ? '' : 'locked'}">
            <div class="badge-icon">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
        </div>
    `).join('');
    
    $('#profile-badges').textContent = MOCK_BADGES.filter(b => b.unlocked).length;
    
    // Full grid
    $('#badges-grid').innerHTML = MOCK_BADGES.map(b => `
        <div class="badge-card ${b.unlocked ? '' : 'locked'}">
            <div class="badge-card-icon">${b.icon}</div>
            <div class="badge-card-name">${b.name}</div>
            <div class="badge-card-desc">${b.desc}</div>
        </div>
    `).join('');
}

// =====================================================
// POST
// =====================================================

function handlePostImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = ev => {
        $('#post-preview').src = ev.target.result;
        $('#post-preview').classList.remove('hidden');
        $('#upload-zone').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function publishPost() {
    if (!$('#post-preview').src) {
        toast('Ajoute une photo', 'error');
        return;
    }
    
    showXP(30);
    toast('Post publié ! 🎉', 'success');
    
    // Reset
    $('#post-preview').src = '';
    $('#post-preview').classList.add('hidden');
    $('#upload-zone').classList.remove('hidden');
    $('#post-caption').value = '';
    
    showTab('home');
}

// Avatar
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = ev => {
        $('#avatar-img').src = ev.target.result;
        toast('Photo mise à jour !', 'success');
    };
    reader.readAsDataURL(file);
}

// =====================================================
// GLOBAL FUNCTIONS
// =====================================================

window.openRecipe = openRecipe;
window.toggleFavorite = toggleFavorite;
window.deleteFridgeItem = deleteFridgeItem;
