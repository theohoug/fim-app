/* ============================================
   YUMR v5 - Complete JavaScript
   User accounts, Tutorial, Improved UX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

// ============================================
// DOM HELPERS
// ============================================
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const show = el => el?.classList.add('active');
const hide = el => el?.classList.remove('active');

// ============================================
// DATA
// ============================================
const QUIZ_ITEMS = [
    { name: "Pizza Margherita", emoji: "🍕", desc: "Tomate, mozzarella, basilic", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", tags: ["italien", "fromage"] },
    { name: "Sushi", emoji: "🍣", desc: "Poisson cru, riz vinaigré", img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", tags: ["japonais", "poisson"] },
    { name: "Burger", emoji: "🍔", desc: "Bœuf, cheddar, salade", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", tags: ["americain", "viande"] },
    { name: "Pad Thaï", emoji: "🍜", desc: "Nouilles sautées, crevettes", img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400", tags: ["thai", "asiatique"] },
    { name: "Salade César", emoji: "🥗", desc: "Romaine, parmesan, croûtons", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400", tags: ["healthy", "léger"] },
    { name: "Tacos", emoji: "🌮", desc: "Viande, guacamole, salsa", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", tags: ["mexicain", "épicé"] },
    { name: "Ramen", emoji: "🍜", desc: "Bouillon, nouilles, œuf", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", tags: ["japonais", "soupe"] },
    { name: "Croissant", emoji: "🥐", desc: "Pur beurre, feuilleté", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", tags: ["français", "sucré"] },
    { name: "Poke Bowl", emoji: "🥗", desc: "Saumon, avocat, riz", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", tags: ["healthy", "poisson"] },
    { name: "Tiramisu", emoji: "🍰", desc: "Mascarpone, café, cacao", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", tags: ["italien", "dessert"] },
    { name: "Curry", emoji: "🍛", desc: "Poulet, lait de coco, épices", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", tags: ["indien", "épicé"] },
    { name: "Carbonara", emoji: "🍝", desc: "Guanciale, œuf, pecorino", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", tags: ["italien", "pâtes"] },
    { name: "Bibimbap", emoji: "🍚", desc: "Riz, légumes, bœuf, œuf", img: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400", tags: ["coréen", "asiatique"] },
    { name: "Crêpe", emoji: "🥞", desc: "Nutella, banane, chantilly", img: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400", tags: ["français", "sucré"] },
    { name: "Falafel", emoji: "🧆", desc: "Pois chiches, houmous", img: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400", tags: ["végétarien", "oriental"] },
    { name: "Fish & Chips", emoji: "🐟", desc: "Cabillaud pané, frites", img: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400", tags: ["anglais", "poisson"] },
    { name: "Paella", emoji: "🥘", desc: "Riz, fruits de mer, safran", img: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400", tags: ["espagnol", "riz"] },
    { name: "Cheesecake", emoji: "🍰", desc: "Fromage frais, biscuit", img: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400", tags: ["dessert", "sucré"] },
    { name: "Pho", emoji: "🍲", desc: "Bouillon, nouilles de riz", img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", tags: ["vietnamien", "soupe"] },
    { name: "Avocado Toast", emoji: "🥑", desc: "Pain, avocat, œuf poché", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400", tags: ["brunch", "healthy"] },
    { name: "Risotto", emoji: "🍚", desc: "Riz crémeux, parmesan", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400", tags: ["italien", "riz"] },
    { name: "Gyoza", emoji: "🥟", desc: "Raviolis japonais grillés", img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400", tags: ["japonais", "asiatique"] },
    { name: "Brownie", emoji: "🍫", desc: "Chocolat fondant, noix", img: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400", tags: ["dessert", "chocolat"] },
    { name: "Gazpacho", emoji: "🍅", desc: "Soupe froide de tomates", img: "https://images.unsplash.com/photo-1529566652340-2c41a1eb6d93?w=400", tags: ["espagnol", "healthy"] },
    { name: "Pancakes", emoji: "🥞", desc: "Sirop d'érable, fruits", img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400", tags: ["brunch", "sucré"] },
    { name: "Tartare", emoji: "🥩", desc: "Bœuf cru, câpres, échalotes", img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400", tags: ["français", "viande"] },
    { name: "Smoothie Bowl", emoji: "🥣", desc: "Fruits mixés, granola", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400", tags: ["healthy", "brunch"] },
    { name: "Lasagnes", emoji: "🍝", desc: "Pâtes, bœuf, béchamel", img: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400", tags: ["italien", "pâtes"] },
    { name: "Ceviche", emoji: "🐟", desc: "Poisson mariné, citron vert", img: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400", tags: ["péruvien", "poisson"] },
    { name: "Churros", emoji: "🥨", desc: "Beignets, chocolat chaud", img: "https://images.unsplash.com/photo-1624371414361-e670edf4698e?w=400", tags: ["espagnol", "dessert"] }
];

const RECIPES = [
    { id: 1, name: "Poulet rôti aux herbes", type: "main", time: 45, calories: 450, cost: "€€", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400", ingredients: ["1 poulet entier", "Thym, romarin", "50g beurre", "4 gousses d'ail", "Sel, poivre"], steps: ["Préchauffer le four à 200°C", "Badigeonner le poulet de beurre et d'herbes", "Placer l'ail autour", "Enfourner 45 min en arrosant", "Laisser reposer 10 min"], timers: [0, 5, 0, 45, 10], rating: 4.8 },
    { id: 2, name: "Salade César", type: "starter", time: 15, calories: 280, cost: "€", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400", ingredients: ["1 laitue romaine", "50g parmesan", "Croûtons", "Sauce César", "Poulet grillé"], steps: ["Laver et couper la salade", "Préparer la sauce", "Griller les croûtons", "Assembler et servir"], timers: [0, 0, 3, 0], rating: 4.5 },
    { id: 3, name: "Tiramisu", type: "dessert", time: 30, calories: 420, cost: "€€", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", ingredients: ["250g mascarpone", "3 œufs", "Café fort", "Biscuits cuillère", "Cacao"], steps: ["Préparer le café et refroidir", "Séparer blancs et jaunes", "Monter les blancs en neige", "Mélanger jaunes + sucre + mascarpone", "Incorporer les blancs", "Tremper les biscuits", "Alterner couches", "Saupoudrer et réfrigérer 4h"], timers: [0, 0, 5, 0, 0, 0, 0, 240], rating: 4.9 },
    { id: 4, name: "Pâtes Carbonara", type: "main", time: 20, calories: 520, cost: "€", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", ingredients: ["400g spaghetti", "150g guanciale", "3 jaunes d'œufs", "80g pecorino", "Poivre noir"], steps: ["Cuire les pâtes al dente", "Faire revenir le guanciale", "Mélanger jaunes + fromage", "Mélanger hors du feu", "Servir immédiatement"], timers: [10, 8, 0, 0, 0], rating: 4.7 },
    { id: 5, name: "Buddha Bowl", type: "main", time: 25, calories: 380, cost: "€", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", ingredients: ["150g quinoa", "Pois chiches", "1 avocat", "Légumes variés", "Sauce tahini"], steps: ["Cuire le quinoa", "Rôtir les pois chiches", "Couper les légumes", "Préparer la sauce", "Assembler le bowl"], timers: [15, 15, 0, 0, 0], rating: 4.6 },
    { id: 6, name: "Tarte aux pommes", type: "dessert", time: 50, calories: 320, cost: "€", img: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400", ingredients: ["1 pâte brisée", "4 pommes", "50g sucre", "Cannelle", "30g beurre"], steps: ["Préchauffer à 180°C", "Étaler la pâte", "Éplucher et couper les pommes", "Disposer en rosace", "Saupoudrer et enfourner 40 min"], timers: [0, 0, 0, 0, 40], rating: 4.4 },
    { id: 7, name: "Soupe à l'oignon", type: "starter", time: 40, calories: 250, cost: "€", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400", ingredients: ["500g oignons", "1L bouillon", "Pain", "Gruyère râpé", "Beurre"], steps: ["Émincer les oignons", "Faire caraméliser 20 min", "Ajouter le bouillon", "Mijoter 15 min", "Gratiner avec fromage"], timers: [0, 20, 0, 15, 5], rating: 4.3 },
    { id: 8, name: "Risotto champignons", type: "main", time: 35, calories: 450, cost: "€€", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400", ingredients: ["300g riz arborio", "200g champignons", "1L bouillon", "Parmesan", "Vin blanc"], steps: ["Faire revenir les champignons", "Nacrer le riz", "Ajouter le vin", "Incorporer le bouillon louche par louche", "Finaliser avec parmesan"], timers: [5, 2, 2, 25, 0], rating: 4.6 }
];

const PROFILES = [
    { name: "L'Italien", emoji: "🍝", desc: "Tu craques pour les saveurs méditerranéennes", tags: ["Pasta", "Fromage", "Tomate"] },
    { name: "L'Aventurier", emoji: "🌶️", desc: "Toujours prêt à découvrir de nouvelles saveurs", tags: ["Épicé", "Exotique", "Voyage"] },
    { name: "Le Healthy", emoji: "🥗", desc: "Tu privilégies l'équilibre et la fraîcheur", tags: ["Léger", "Frais", "Équilibré"] },
    { name: "Le Gourmand", emoji: "🍰", desc: "La vie est trop courte pour se priver", tags: ["Sucré", "Généreux", "Comfort food"] },
    { name: "L'Asiatique", emoji: "🍜", desc: "Les saveurs d'Asie n'ont pas de secret pour toi", tags: ["Umami", "Riz", "Nouilles"] }
];

const BADGES = [
    { id: 0, name: "Premier pas", emoji: "🍳", desc: "Cuisine ta première recette", unlocked: false },
    { id: 1, name: "Apprenti", emoji: "👨‍🍳", desc: "Cuisine 5 recettes", unlocked: false },
    { id: 2, name: "Cuisinier", emoji: "🎖️", desc: "Cuisine 15 recettes", unlocked: false },
    { id: 3, name: "Chef", emoji: "⭐", desc: "Cuisine 30 recettes", unlocked: false },
    { id: 4, name: "Streak 3", emoji: "🔥", desc: "3 jours consécutifs", unlocked: false },
    { id: 5, name: "Streak 7", emoji: "💪", desc: "7 jours consécutifs", unlocked: false },
    { id: 6, name: "Niveau 5", emoji: "5️⃣", desc: "Atteins le niveau 5", unlocked: false },
    { id: 7, name: "Niveau 10", emoji: "🔟", desc: "Atteins le niveau 10", unlocked: false },
    { id: 8, name: "Social", emoji: "📸", desc: "Publie ton premier post", unlocked: false },
    { id: 9, name: "Populaire", emoji: "❤️", desc: "Reçois 50 likes", unlocked: false }
];

const POSTS = [
    { id: 1, user: "ChefAlex", avatar: "https://i.pravatar.cc/40?img=4", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", caption: "Mon poke bowl du midi 🥗 #healthy", likes: 42, liked: false, time: "2h", comments: [] },
    { id: 2, user: "MarieFood", avatar: "https://i.pravatar.cc/40?img=5", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", caption: "Pizza maison, meilleure qu'au resto ! 🍕", likes: 87, liked: false, time: "5h", comments: [] },
    { id: 3, user: "TomCook", avatar: "https://i.pravatar.cc/40?img=8", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", caption: "Dessert du dimanche 🍰✨", likes: 156, liked: false, time: "1j", comments: [] }
];

const LEADERBOARD = [
    { rank: 1, name: "MasterChef_", score: 2450, avatar: "https://i.pravatar.cc/40?img=1" },
    { rank: 2, name: "CookingQueen", score: 2280, avatar: "https://i.pravatar.cc/40?img=2" },
    { rank: 3, name: "FoodieKing", score: 2150, avatar: "https://i.pravatar.cc/40?img=3" },
    { rank: 4, name: "ChefAlex", score: 1980, avatar: "https://i.pravatar.cc/40?img=4" },
    { rank: 5, name: "TastyBites", score: 1850, avatar: "https://i.pravatar.cc/40?img=5" }
];

const TUTORIAL_STEPS = [
    { target: 'hero-card', text: "Voici ton plat du jour ! Clique sur 'Cuisiner' pour commencer. 🍳", position: 'bottom' },
    { target: 'quick-actions', text: "Gère ton frigo, tes courses et relève des défis ici. 🧊", position: 'top' },
    { target: 'header-xp', text: "Gagne des XP en cuisinant pour monter de niveau ! ⭐", position: 'bottom' }
];

const GREETINGS = [
    "On cuisine quoi aujourd'hui ?",
    "Prêt à régaler ?",
    "Qu'est-ce qu'on se fait de bon ?",
    "Une petite faim ?",
    "C'est parti pour un délice !"
];

// ============================================
// STATE MANAGEMENT
// ============================================
let state = {
    currentUserId: null,
    users: {},
    quizPhase: 'choice',
    quizCount: 20,
    quizIndex: 0,
    quizAnswers: [],
    tutorialStep: 0,
    tutorialActive: false,
    todayMenu: null,
    cookingRecipe: null,
    cookingStep: 0,
    timerInterval: null,
    timerSeconds: 0,
    timerRunning: false,
    posts: [...POSTS],
    isRegister: false
};

// Load state from localStorage
function loadState() {
    const users = localStorage.getItem('yumr_users');
    const currentUserId = localStorage.getItem('yumr_current_user');
    
    if (users) {
        state.users = JSON.parse(users);
    }
    
    if (currentUserId && state.users[currentUserId]) {
        state.currentUserId = currentUserId;
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('yumr_users', JSON.stringify(state.users));
    if (state.currentUserId) {
        localStorage.setItem('yumr_current_user', state.currentUserId);
    }
}

// Get current user
function getCurrentUser() {
    if (!state.currentUserId) return null;
    return state.users[state.currentUserId] || null;
}

// Update current user
function updateCurrentUser(updates) {
    if (!state.currentUserId) return;
    state.users[state.currentUserId] = { ...state.users[state.currentUserId], ...updates };
    saveState();
}

// Create new user
function createUser(data) {
    const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    state.users[id] = {
        id,
        username: data.username || 'Chef',
        email: data.email || '',
        xp: 0,
        level: 1,
        streak: 1,
        lastActive: new Date().toDateString(),
        badges: [],
        profile: data.profile || null,
        preferences: data.preferences || { diet: 'omnivore', allergies: [] },
        fridge: [],
        shopping: [],
        cooked: [],
        favorites: [],
        tutorialDone: false,
        createdAt: new Date().toISOString()
    };
    state.currentUserId = id;
    saveState();
    return state.users[id];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showScreen(id) {
    $$('.screen').forEach(s => hide(s));
    show($(id));
}

function openModal(id) {
    show($(id));
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    hide($(id));
    document.body.style.overflow = '';
}

function toast(message, type = '') {
    const container = $('toasts');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function showXP(amount) {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update XP
    const newXp = user.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;
    const leveledUp = newLevel > user.level;
    
    updateCurrentUser({ xp: newXp, level: newLevel });
    
    // Show popup
    $('xp-popup-amount').textContent = `+${amount} XP`;
    $('xp-popup').classList.add('show');
    setTimeout(() => $('xp-popup').classList.remove('show'), 1500);
    
    // Level up?
    if (leveledUp) {
        setTimeout(() => {
            $('levelup-level').textContent = newLevel;
            $('levelup-popup').classList.add('show');
            checkBadges();
        }, 1600);
    }
    
    updateUI();
}

function updateUI() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Header
    if ($('header-streak-count')) $('header-streak-count').textContent = user.streak;
    if ($('header-xp-count')) $('header-xp-count').textContent = user.xp;
    
    // Home stats
    if ($('stat-level')) $('stat-level').textContent = user.level;
    if ($('stat-cooked')) $('stat-cooked').textContent = user.cooked.length;
    if ($('stat-streak')) $('stat-streak').textContent = user.streak;
    if ($('stat-badges')) $('stat-badges').textContent = user.badges.length;
    
    // Quick actions badges
    if ($('qa-fridge-count')) $('qa-fridge-count').textContent = user.fridge.length;
    if ($('qa-shopping-count')) $('qa-shopping-count').textContent = user.shopping.length;
    
    // Profile
    if ($('profile-username')) $('profile-username').textContent = '@' + user.username.toLowerCase();
    if ($('profile-level')) $('profile-level').textContent = user.level;
    if ($('profile-xp-level')) $('profile-xp-level').textContent = user.level;
    if ($('profile-xp-current')) $('profile-xp-current').textContent = user.xp % 100;
    if ($('profile-xp-fill')) $('profile-xp-fill').style.width = (user.xp % 100) + '%';
    if ($('profile-posts')) $('profile-posts').textContent = state.posts.filter(p => p.user === user.username).length;
    
    if (user.profile) {
        if ($('profile-type-emoji')) $('profile-type-emoji').textContent = user.profile.emoji;
        if ($('profile-type-name')) $('profile-type-name').textContent = user.profile.name;
    }
    
    // Badges
    renderProfileBadges();
}

function checkBadges() {
    const user = getCurrentUser();
    if (!user) return;
    
    const newBadges = [];
    
    // Check cooking badges
    if (user.cooked.length >= 1 && !user.badges.includes(0)) newBadges.push(0);
    if (user.cooked.length >= 5 && !user.badges.includes(1)) newBadges.push(1);
    if (user.cooked.length >= 15 && !user.badges.includes(2)) newBadges.push(2);
    if (user.cooked.length >= 30 && !user.badges.includes(3)) newBadges.push(3);
    
    // Streak badges
    if (user.streak >= 3 && !user.badges.includes(4)) newBadges.push(4);
    if (user.streak >= 7 && !user.badges.includes(5)) newBadges.push(5);
    
    // Level badges
    if (user.level >= 5 && !user.badges.includes(6)) newBadges.push(6);
    if (user.level >= 10 && !user.badges.includes(7)) newBadges.push(7);
    
    if (newBadges.length > 0) {
        updateCurrentUser({ badges: [...user.badges, ...newBadges] });
        newBadges.forEach(b => {
            toast(`🏅 Badge débloqué: ${BADGES[b].name}!`, 'success');
        });
    }
}

function checkStreak() {
    const user = getCurrentUser();
    if (!user) return;
    
    const today = new Date().toDateString();
    const lastActive = user.lastActive;
    
    if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive === yesterday.toDateString()) {
            // Continue streak
            updateCurrentUser({ streak: user.streak + 1, lastActive: today });
            toast(`🔥 Streak de ${user.streak + 1} jours!`);
        } else {
            // Reset streak
            updateCurrentUser({ streak: 1, lastActive: today });
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================
loadState();

// Check if user exists and is logged in
if (state.currentUserId && getCurrentUser()) {
    checkStreak();
    setTimeout(() => {
        initMainApp();
    }, 2000);
} else {
    setTimeout(() => {
        showScreen('onboarding');
    }, 2000);
}

// ============================================
// ONBOARDING
// ============================================
let obSlide = 0;

$('ob-next')?.addEventListener('click', () => {
    obSlide++;
    if (obSlide >= 3) {
        showScreen('quiz');
        showQuizPhase('quiz-choice');
    } else {
        $$('.ob-slide').forEach((s, i) => s.classList.toggle('active', i === obSlide));
        $$('.ob-dot').forEach((d, i) => d.classList.toggle('active', i === obSlide));
    }
});

$('ob-login')?.addEventListener('click', () => {
    state.isRegister = false;
    showScreen('auth');
    updateAuthUI();
});

// ============================================
// QUIZ
// ============================================
function showQuizPhase(phase) {
    $$('.quiz-phase').forEach(p => hide(p));
    show($(phase));
    state.quizPhase = phase;
}

// Quiz choice
$$('.quiz-choice-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        $$('.quiz-choice-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        state.quizCount = parseInt(opt.dataset.count);
    });
});

$('quiz-start')?.addEventListener('click', () => {
    state.quizIndex = 0;
    state.quizAnswers = [];
    showQuizPhase('quiz-swipe');
    loadQuizCard();
});

$('quiz-back-choice')?.addEventListener('click', () => {
    showScreen('onboarding');
    obSlide = 2;
});

// Quiz swipe
function loadQuizCard() {
    if (state.quizIndex >= state.quizCount) {
        showQuizPhase('quiz-prefs');
        return;
    }
    
    const item = QUIZ_ITEMS[state.quizIndex % QUIZ_ITEMS.length];
    const card = $('quiz-card');
    
    card.classList.remove('swiping-left', 'swiping-right');
    card.style.transform = '';
    
    $('quiz-card-img').style.backgroundImage = `url(${item.img})`;
    $('quiz-card-emoji').textContent = item.emoji;
    $('quiz-card-name').textContent = item.name;
    $('quiz-card-desc').textContent = item.desc;
    $('quiz-counter').textContent = `${state.quizIndex + 1}/${state.quizCount}`;
    $('quiz-progress-fill').style.width = `${(state.quizIndex / state.quizCount) * 100}%`;
}

function answerQuiz(liked) {
    const item = QUIZ_ITEMS[state.quizIndex % QUIZ_ITEMS.length];
    state.quizAnswers.push({ item, liked });
    
    const card = $('quiz-card');
    card.classList.add(liked ? 'swiping-right' : 'swiping-left');
    
    setTimeout(() => {
        state.quizIndex++;
        loadQuizCard();
    }, 300);
}

// Touch handling for quiz card
let touchStartX = 0;
let touchCurrentX = 0;
let isDragging = false;

const quizCard = $('quiz-card');

quizCard?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    isDragging = true;
});

quizCard?.addEventListener('touchmove', e => {
    if (!isDragging) return;
    touchCurrentX = e.touches[0].clientX;
    const diff = touchCurrentX - touchStartX;
    quizCard.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
    quizCard.classList.toggle('swiping-left', diff < -50);
    quizCard.classList.toggle('swiping-right', diff > 50);
});

quizCard?.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const diff = touchCurrentX - touchStartX;
    if (Math.abs(diff) > 80) {
        answerQuiz(diff > 0);
    } else {
        quizCard.style.transform = '';
        quizCard.classList.remove('swiping-left', 'swiping-right');
    }
    touchStartX = 0;
    touchCurrentX = 0;
});

$('quiz-nope')?.addEventListener('click', () => answerQuiz(false));
$('quiz-love')?.addEventListener('click', () => answerQuiz(true));
$('quiz-close')?.addEventListener('click', () => {
    if (confirm('Quitter le quiz ?')) {
        showScreen('onboarding');
    }
});

// Quiz prefs
$('quiz-finish')?.addEventListener('click', () => {
    // Calculate profile based on answers
    const likedTags = {};
    state.quizAnswers.filter(a => a.liked).forEach(a => {
        a.item.tags.forEach(tag => {
            likedTags[tag] = (likedTags[tag] || 0) + 1;
        });
    });
    
    // Pick profile based on top tags
    let profile = PROFILES[0];
    if (likedTags['italien'] > 2 || likedTags['pâtes'] > 1) profile = PROFILES[0];
    else if (likedTags['épicé'] > 2 || likedTags['exotique'] > 1) profile = PROFILES[1];
    else if (likedTags['healthy'] > 2 || likedTags['léger'] > 1) profile = PROFILES[2];
    else if (likedTags['dessert'] > 2 || likedTags['sucré'] > 2) profile = PROFILES[3];
    else if (likedTags['japonais'] > 1 || likedTags['asiatique'] > 2) profile = PROFILES[4];
    
    // Get preferences
    const diet = document.querySelector('input[name="diet"]:checked')?.value || 'omnivore';
    const allergies = [...document.querySelectorAll('input[name="allergy"]:checked')].map(c => c.value);
    
    // Store temporarily
    state.tempProfile = profile;
    state.tempPreferences = { diet, allergies };
    
    // Show result
    showQuizPhase('quiz-result');
    $('result-emoji').textContent = profile.emoji;
    $('result-title').textContent = profile.name;
    $('result-desc').textContent = profile.desc;
    $('result-tags').innerHTML = profile.tags.map(t => `<span>${t}</span>`).join('');
    
    // Confetti!
    createConfetti();
});

function createConfetti() {
    const container = $('result-confetti');
    const colors = ['#FF6B35', '#FFD166', '#4ECB71', '#5B9FFF', '#FF4757'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(piece);
    }
    
    setTimeout(() => container.innerHTML = '', 4000);
}

$('result-signup')?.addEventListener('click', () => {
    state.isRegister = true;
    showScreen('auth');
    updateAuthUI();
});

$('result-skip')?.addEventListener('click', () => {
    // Create guest user
    createUser({
        username: 'Chef',
        profile: state.tempProfile,
        preferences: state.tempPreferences
    });
    
    showXP(100);
    initMainApp();
});

// ============================================
// AUTH
// ============================================
function updateAuthUI() {
    if (state.isRegister) {
        $('auth-title').textContent = 'Crée ton compte';
        $('auth-subtitle').textContent = 'Sauvegarde ta progression';
        $('field-username').classList.remove('hidden');
        $('auth-submit').textContent = "S'inscrire";
        $('auth-switch-text').textContent = 'Déjà un compte ?';
        $('auth-toggle').textContent = 'Se connecter';
    } else {
        $('auth-title').textContent = 'Content de te revoir !';
        $('auth-subtitle').textContent = 'Connecte-toi pour retrouver ta progression';
        $('field-username').classList.add('hidden');
        $('auth-submit').textContent = 'Se connecter';
        $('auth-switch-text').textContent = 'Pas encore de compte ?';
        $('auth-toggle').textContent = "S'inscrire";
    }
    $('auth-error').textContent = '';
}

$('auth-toggle')?.addEventListener('click', () => {
    state.isRegister = !state.isRegister;
    updateAuthUI();
});

$('auth-back')?.addEventListener('click', () => {
    if (state.tempProfile) {
        showScreen('quiz');
        showQuizPhase('quiz-result');
    } else {
        showScreen('onboarding');
    }
});

$('auth-form')?.addEventListener('submit', e => {
    e.preventDefault();
    
    const email = $('input-email').value.trim();
    const password = $('input-password').value;
    const username = $('input-username')?.value.trim();
    
    if (!email || !password) {
        $('auth-error').textContent = 'Remplis tous les champs';
        return;
    }
    
    if (state.isRegister) {
        if (!username) {
            $('auth-error').textContent = 'Choisis un pseudo';
            return;
        }
        
        // Check if email exists
        const existingUser = Object.values(state.users).find(u => u.email === email);
        if (existingUser) {
            $('auth-error').textContent = 'Cet email est déjà utilisé';
            return;
        }
        
        // Create user
        createUser({
            username,
            email,
            profile: state.tempProfile,
            preferences: state.tempPreferences
        });
        
        showXP(100);
        initMainApp();
    } else {
        // Login - find user by email
        const user = Object.values(state.users).find(u => u.email === email);
        if (!user) {
            $('auth-error').textContent = 'Compte non trouvé';
            return;
        }
        
        state.currentUserId = user.id;
        saveState();
        checkStreak();
        initMainApp();
    }
});

// ============================================
// MAIN APP
// ============================================
function initMainApp() {
    showScreen('main');
    
    const user = getCurrentUser();
    if (!user) return;
    
    // Set greeting
    const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    $('home-greeting-text').textContent = greeting;
    
    // Generate today's menu if not exists
    if (!state.todayMenu) {
        generateTodayMenu();
    }
    
    // Update UI
    updateUI();
    renderHeroCard();
    renderRecipes();
    renderFeed();
    renderLeaderboard();
    
    // Show tutorial if first time
    if (!user.tutorialDone) {
        setTimeout(() => startTutorial(), 500);
    }
}

function generateTodayMenu() {
    const mains = RECIPES.filter(r => r.type === 'main');
    const starters = RECIPES.filter(r => r.type === 'starter');
    const desserts = RECIPES.filter(r => r.type === 'dessert');
    
    state.todayMenu = {
        main: mains[Math.floor(Math.random() * mains.length)],
        starter: starters[Math.floor(Math.random() * starters.length)],
        dessert: desserts[Math.floor(Math.random() * desserts.length)]
    };
}

function renderHeroCard() {
    if (!state.todayMenu) return;
    
    const recipe = state.todayMenu.main;
    $('hero-img').style.backgroundImage = `url(${recipe.img})`;
    $('hero-name').textContent = recipe.name;
    $('hero-time').textContent = `⏱️ ${recipe.time}min`;
    $('hero-calories').textContent = `🔥 ${recipe.calories}kcal`;
    $('hero-rating').textContent = `★ ${recipe.rating}`;
}

$('hero-cook')?.addEventListener('click', () => {
    if (state.todayMenu) startCooking(state.todayMenu.main.id);
});

$('hero-refresh')?.addEventListener('click', () => {
    generateTodayMenu();
    renderHeroCard();
    toast('✨ Nouvelle suggestion !');
});

$('hero-menu')?.addEventListener('click', () => {
    openModal('modal-menu');
    renderFullMenu();
});

function renderFullMenu() {
    if (!state.todayMenu) return;
    
    const { starter, main, dessert } = state.todayMenu;
    
    $('menu-content').innerHTML = `
        <div style="margin-bottom: 16px;">
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                Menu personnalisé basé sur tes goûts
            </p>
            
            ${[
                { label: 'Entrée', recipe: starter },
                { label: 'Plat principal', recipe: main },
                { label: 'Dessert', recipe: dessert }
            ].map(({ label, recipe }) => `
                <div class="menu-item-card" style="display: flex; gap: 12px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 8px; cursor: pointer;" onclick="openRecipeDetail(${recipe.id})">
                    <div style="width: 60px; height: 60px; border-radius: 8px; background-image: url(${recipe.img}); background-size: cover; flex-shrink: 0;"></div>
                    <div style="flex: 1;">
                        <span style="font-size: 10px; color: var(--accent); font-weight: 600; text-transform: uppercase;">${label}</span>
                        <h4 style="font-size: 14px; margin: 4px 0;">${recipe.name}</h4>
                        <span style="font-size: 12px; color: var(--text-tertiary);">⏱️ ${recipe.time}min • ★ ${recipe.rating}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <button class="btn btn-primary btn-full" onclick="closeModal('modal-menu'); startCooking(${main.id})">
            🍳 Cuisiner le plat principal
        </button>
    `;
}

// ============================================
// NAVIGATION
// ============================================
$$('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        if (!tab) return;
        
        $$('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        $$('.tab').forEach(t => t.classList.remove('active'));
        $(`tab-${tab}`)?.classList.add('active');
    });
});

// ============================================
// QUICK ACTIONS
// ============================================
$$('.quick-action').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'fridge') {
            openModal('modal-fridge');
            renderFridge();
        } else if (action === 'shopping') {
            openModal('modal-shopping');
            renderShopping();
        } else if (action === 'challenge') {
            openModal('modal-challenge');
            renderChallenge();
        }
    });
});

$$('.stat-item.clickable').forEach(item => {
    item.addEventListener('click', () => {
        const action = item.dataset.action;
        if (action === 'badges') {
            openModal('modal-badges');
            renderAllBadges();
        }
    });
});

// ============================================
// RECIPES
// ============================================
function renderRecipes(filter = 'all', search = '') {
    let recipes = [...RECIPES];
    
    if (filter !== 'all') {
        if (filter === 'quick') {
            recipes = recipes.filter(r => r.time <= 15);
        } else {
            recipes = recipes.filter(r => r.type === filter);
        }
    }
    
    if (search) {
        recipes = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    const user = getCurrentUser();
    const favorites = user?.favorites || [];
    
    if (recipes.length === 0) {
        $('recipes-grid').innerHTML = '';
        $('explore-empty')?.classList.remove('hidden');
    } else {
        $('explore-empty')?.classList.add('hidden');
        $('recipes-grid').innerHTML = recipes.map(r => `
            <div class="recipe-card" onclick="openRecipeDetail(${r.id})">
                <div class="recipe-card-img" style="background-image: url(${r.img})">
                    <button class="recipe-card-save" onclick="event.stopPropagation(); toggleFavorite(${r.id})">
                        ${favorites.includes(r.id) ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="recipe-card-body">
                    <p class="recipe-card-name">${r.name}</p>
                    <p class="recipe-card-meta">
                        <span>⏱️ ${r.time}min</span>
                        <span class="recipe-card-rating">★ ${r.rating}</span>
                    </p>
                </div>
            </div>
        `).join('');
    }
}

window.toggleFavorite = (id) => {
    const user = getCurrentUser();
    if (!user) return;
    
    let favorites = [...(user.favorites || [])];
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        toast('Retiré des favoris');
    } else {
        favorites.push(id);
        toast('❤️ Ajouté aux favoris !');
    }
    
    updateCurrentUser({ favorites });
    renderRecipes();
};

window.openRecipeDetail = (id) => {
    const recipe = RECIPES.find(r => r.id === id);
    if (!recipe) return;
    
    openModal('modal-recipe');
    
    $('recipe-detail-content').innerHTML = `
        <div style="height: 200px; background-image: url(${recipe.img}); background-size: cover; background-position: center; border-radius: var(--radius-lg); margin-bottom: 16px;"></div>
        <h2 style="margin-bottom: 8px;">${recipe.name}</h2>
        <div style="display: flex; gap: 16px; margin-bottom: 16px; font-size: 13px; color: var(--text-secondary);">
            <span>⏱️ ${recipe.time}min</span>
            <span>🔥 ${recipe.calories}kcal</span>
            <span>💰 ${recipe.cost}</span>
            <span style="color: var(--gold);">★ ${recipe.rating}</span>
        </div>
        
        <h3 style="margin-bottom: 8px;">Ingrédients</h3>
        <ul style="margin-bottom: 16px; padding-left: 20px; color: var(--text-secondary); font-size: 14px;">
            ${recipe.ingredients.map(i => `<li style="margin-bottom: 4px;">${i}</li>`).join('')}
        </ul>
        
        <button class="btn btn-primary btn-full" onclick="closeModal('modal-recipe'); startCooking(${recipe.id})">
            🍳 Cuisiner cette recette
        </button>
    `;
};

// Filter buttons
$$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderRecipes(btn.dataset.filter, $('explore-search')?.value || '');
    });
});

$('explore-search')?.addEventListener('input', e => {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderRecipes(activeFilter, e.target.value);
});

// ============================================
// COOKING MODE
// ============================================
window.startCooking = (id) => {
    const recipe = RECIPES.find(r => r.id === id);
    if (!recipe) return;
    
    closeModal('modal-recipe');
    closeModal('modal-menu');
    
    state.cookingRecipe = recipe;
    state.cookingStep = 0;
    state.timerSeconds = 0;
    state.timerRunning = false;
    
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
    
    $('cooking-title').textContent = recipe.name;
    $('cooking-mode').classList.add('active');
    
    renderCookingStep();
};

function renderCookingStep() {
    const recipe = state.cookingRecipe;
    const step = state.cookingStep;
    
    // Progress
    $('cooking-progress').innerHTML = recipe.steps.map((_, i) => `
        <div class="cooking-progress-step ${i < step ? 'done' : i === step ? 'current' : ''}"></div>
    `).join('');
    
    // Content
    const timerMinutes = recipe.timers[step] || 0;
    state.timerSeconds = timerMinutes * 60;
    
    $('cooking-body').innerHTML = `
        <span class="cooking-step-number">Étape ${step + 1}/${recipe.steps.length}</span>
        <p class="cooking-step-text">${recipe.steps[step]}</p>
        
        ${timerMinutes > 0 ? `
            <div class="cooking-timer">
                <div class="cooking-timer-display" id="timer-display">${formatTime(state.timerSeconds)}</div>
                <p class="cooking-timer-label">Timer: ${timerMinutes} min</p>
                <div class="cooking-timer-actions">
                    <button class="cooking-timer-btn play" id="timer-toggle">▶</button>
                    <button class="cooking-timer-btn reset" id="timer-reset">↺</button>
                </div>
            </div>
        ` : ''}
    `;
    
    // Timer controls
    $('timer-toggle')?.addEventListener('click', toggleTimer);
    $('timer-reset')?.addEventListener('click', resetTimer);
    
    // Navigation
    $('cooking-prev').style.visibility = step === 0 ? 'hidden' : 'visible';
    $('cooking-next').textContent = step === recipe.steps.length - 1 ? 'Terminer ✓' : 'Suivant →';
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function toggleTimer() {
    if (state.timerRunning) {
        clearInterval(state.timerInterval);
        state.timerRunning = false;
        $('timer-toggle').textContent = '▶';
        $('timer-toggle').classList.remove('pause');
        $('timer-toggle').classList.add('play');
    } else {
        state.timerRunning = true;
        $('timer-toggle').textContent = '⏸';
        $('timer-toggle').classList.remove('play');
        $('timer-toggle').classList.add('pause');
        
        state.timerInterval = setInterval(() => {
            state.timerSeconds--;
            $('timer-display').textContent = formatTime(state.timerSeconds);
            
            if (state.timerSeconds <= 0) {
                clearInterval(state.timerInterval);
                state.timerRunning = false;
                toast('⏰ Timer terminé !');
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.timerSeconds = (state.cookingRecipe.timers[state.cookingStep] || 0) * 60;
    $('timer-display').textContent = formatTime(state.timerSeconds);
    $('timer-toggle').textContent = '▶';
    $('timer-toggle').classList.remove('pause');
    $('timer-toggle').classList.add('play');
}

$('cooking-prev')?.addEventListener('click', () => {
    if (state.cookingStep > 0) {
        clearInterval(state.timerInterval);
        state.cookingStep--;
        renderCookingStep();
    }
});

$('cooking-next')?.addEventListener('click', () => {
    if (state.cookingStep < state.cookingRecipe.steps.length - 1) {
        clearInterval(state.timerInterval);
        state.cookingStep++;
        renderCookingStep();
    } else {
        finishCooking();
    }
});

function finishCooking() {
    clearInterval(state.timerInterval);
    $('cooking-mode').classList.remove('active');
    
    const user = getCurrentUser();
    if (user) {
        const cooked = [...user.cooked, {
            id: state.cookingRecipe.id,
            name: state.cookingRecipe.name,
            img: state.cookingRecipe.img,
            date: new Date().toLocaleDateString('fr-FR')
        }];
        updateCurrentUser({ cooked });
    }
    
    showXP(50);
    toast('🎉 Bravo, recette terminée !', 'success');
    checkBadges();
    updateUI();
}

$('cooking-exit')?.addEventListener('click', () => {
    if (confirm('Quitter la recette ?')) {
        clearInterval(state.timerInterval);
        $('cooking-mode').classList.remove('active');
    }
});

$('cooking-home')?.addEventListener('click', () => {
    if (confirm('Retourner à l\'accueil ?')) {
        clearInterval(state.timerInterval);
        $('cooking-mode').classList.remove('active');
    }
});

// ============================================
// FRIDGE
// ============================================
function renderFridge() {
    const user = getCurrentUser();
    const items = user?.fridge || [];
    
    $('fridge-content').innerHTML = items.length > 0 ? `
        <div style="display: flex; flex-direction: column; gap: 8px;">
            ${items.map((item, i) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md);">
                    <span style="font-size: 24px;">${item.icon}</span>
                    <div style="flex: 1;">
                        <strong style="font-size: 14px;">${item.name}</strong>
                        <span style="font-size: 12px; color: var(--text-tertiary); display: block;">${item.qty}</span>
                    </div>
                    <button onclick="removeFridgeItem(${i})" style="background: none; border: none; opacity: 0.5; font-size: 16px; cursor: pointer;">🗑️</button>
                </div>
            `).join('')}
        </div>
    ` : `
        <div class="empty-state">
            <span>🧊</span>
            <h3>Ton frigo est vide</h3>
            <p>Ajoute des ingrédients pour recevoir des suggestions personnalisées</p>
        </div>
    `;
}

$('btn-add-fridge')?.addEventListener('click', () => {
    const name = prompt('Nom de l\'aliment:');
    if (!name) return;
    
    const qty = prompt('Quantité (ex: 500g, 2):') || '1';
    
    const user = getCurrentUser();
    if (user) {
        const fridge = [...user.fridge, { name, qty, icon: '🥫' }];
        updateCurrentUser({ fridge });
        renderFridge();
        updateUI();
        toast('✅ Ajouté au frigo !');
    }
});

window.removeFridgeItem = (index) => {
    const user = getCurrentUser();
    if (user) {
        const fridge = user.fridge.filter((_, i) => i !== index);
        updateCurrentUser({ fridge });
        renderFridge();
        updateUI();
    }
};

// ============================================
// SHOPPING
// ============================================
function renderShopping() {
    const user = getCurrentUser();
    const items = user?.shopping || [];
    
    $('shopping-content').innerHTML = `
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <input type="text" id="shopping-input" class="form-field" placeholder="Ajouter un article..." style="flex: 1; margin: 0;">
            <button class="btn btn-primary" onclick="addShoppingItem()">+</button>
        </div>
        
        ${items.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${items.map((item, i) => `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md);">
                        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleShoppingItem(${i})" style="width: 20px; height: 20px;">
                        <span style="flex: 1; ${item.done ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${item.name}</span>
                        <button onclick="removeShoppingItem(${i})" style="background: none; border: none; opacity: 0.5; cursor: pointer;">🗑️</button>
                    </div>
                `).join('')}
            </div>
        ` : `
            <div class="empty-state small">
                <span>🛒</span>
                <p>Ta liste est vide</p>
            </div>
        `}
    `;
}

window.addShoppingItem = () => {
    const input = $('shopping-input');
    const name = input?.value.trim();
    if (!name) return;
    
    const user = getCurrentUser();
    if (user) {
        const shopping = [...user.shopping, { name, done: false }];
        updateCurrentUser({ shopping });
        renderShopping();
        updateUI();
    }
};

window.toggleShoppingItem = (index) => {
    const user = getCurrentUser();
    if (user) {
        const shopping = [...user.shopping];
        shopping[index].done = !shopping[index].done;
        updateCurrentUser({ shopping });
        renderShopping();
    }
};

window.removeShoppingItem = (index) => {
    const user = getCurrentUser();
    if (user) {
        const shopping = user.shopping.filter((_, i) => i !== index);
        updateCurrentUser({ shopping });
        renderShopping();
        updateUI();
    }
};

// ============================================
// CHALLENGE
// ============================================
function renderChallenge() {
    $('challenge-content').innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
            <span style="font-size: 64px; display: block; margin-bottom: 16px;">🎯</span>
            <h2 style="margin-bottom: 8px;">Défi du jour</h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">Cuisine un plat végétarien</p>
            
            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(255,209,102,0.15); border-radius: var(--radius-md); color: var(--gold); font-weight: 700; margin-bottom: 24px;">
                <span>🏆</span>
                <span>+75 XP</span>
            </div>
            
            <p style="font-size: 12px; color: var(--text-tertiary);">Temps restant: 23h 45min</p>
        </div>
        
        <button class="btn btn-primary btn-full" onclick="closeModal('modal-challenge')">
            Voir les recettes végétariennes
        </button>
    `;
}

// ============================================
// BADGES
// ============================================
function renderProfileBadges() {
    const user = getCurrentUser();
    if (!user) return;
    
    const unlockedBadges = BADGES.filter(b => user.badges.includes(b.id));
    
    if (unlockedBadges.length === 0) {
        $('badges-empty')?.classList.remove('hidden');
        $('profile-badges').innerHTML = '';
    } else {
        $('badges-empty')?.classList.add('hidden');
        $('profile-badges').innerHTML = unlockedBadges.slice(0, 5).map(b => `
            <div class="badge-item">
                <div class="badge-icon">${b.emoji}</div>
                <span>${b.name}</span>
            </div>
        `).join('');
    }
}

function renderAllBadges() {
    const user = getCurrentUser();
    if (!user) return;
    
    $('badges-content').innerHTML = `
        <p style="text-align: center; color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
            ${user.badges.length}/${BADGES.length} badges débloqués
        </p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
            ${BADGES.map(b => {
                const unlocked = user.badges.includes(b.id);
                return `
                    <div style="padding: 16px 8px; background: var(--bg-card); border: 1px solid ${unlocked ? 'var(--accent)' : 'var(--border)'}; border-radius: var(--radius-md); text-align: center; ${!unlocked ? 'opacity: 0.4;' : ''}">
                        <span style="font-size: 32px; display: block; margin-bottom: 8px;">${unlocked ? b.emoji : '🔒'}</span>
                        <strong style="font-size: 11px; display: block;">${unlocked ? b.name : '???'}</strong>
                        <span style="font-size: 10px; color: var(--text-tertiary);">${b.desc}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ============================================
// SOCIAL - FEED
// ============================================
function renderFeed() {
    if (state.posts.length === 0) {
        $('feed-empty')?.classList.remove('hidden');
        $('feed-list').innerHTML = '';
    } else {
        $('feed-empty')?.classList.add('hidden');
        $('feed-list').innerHTML = state.posts.map(post => `
            <div class="feed-post">
                <div class="feed-post-header" onclick="viewUserProfile('${post.user}')">
                    <img class="feed-post-avatar" src="${post.avatar}" alt="">
                    <div class="feed-post-user">
                        <strong>${post.user}</strong>
                        <span>${post.time}</span>
                    </div>
                </div>
                <div class="feed-post-img" style="background-image: url(${post.img})" onclick="viewPost(${post.id})"></div>
                <div class="feed-post-content">
                    <div class="feed-post-actions">
                        <button class="${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                            ${post.liked ? '❤️' : '🤍'} ${post.likes}
                        </button>
                        <button onclick="viewPost(${post.id})">💬 ${post.comments.length}</button>
                    </div>
                    <p class="feed-post-caption"><strong>${post.user}</strong> ${post.caption}</p>
                </div>
            </div>
        `).join('');
    }
}

window.toggleLike = (id) => {
    const post = state.posts.find(p => p.id === id);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        renderFeed();
        if (post.liked) showXP(2);
    }
};

window.viewPost = (id) => {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;
    
    openModal('modal-post');
    
    $('post-view-content').innerHTML = `
        <div class="feed-post-header" style="padding: 16px;" onclick="closeModal('modal-post'); viewUserProfile('${post.user}')">
            <img class="feed-post-avatar" src="${post.avatar}" alt="">
            <div class="feed-post-user">
                <strong>${post.user}</strong>
                <span>${post.time}</span>
            </div>
            <button class="btn btn-primary btn-sm">S'abonner</button>
        </div>
        <div style="width: 100%; aspect-ratio: 1; background-image: url(${post.img}); background-size: cover; background-position: center;"></div>
        <div style="padding: 16px;">
            <div class="feed-post-actions" style="margin-bottom: 12px;">
                <button class="${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id}); viewPost(${post.id})">
                    ${post.liked ? '❤️' : '🤍'} ${post.likes}
                </button>
                <button>💬 ${post.comments.length}</button>
                <button>📤 Partager</button>
            </div>
            <p style="font-size: 14px; line-height: 1.5;"><strong>${post.user}</strong> ${post.caption}</p>
            <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;">${post.time}</p>
        </div>
    `;
};

window.viewUserProfile = (username) => {
    openModal('modal-user');
    
    const userPosts = state.posts.filter(p => p.user === username);
    
    $('user-view-content').innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="height: 80px; background: linear-gradient(135deg, var(--accent), var(--gold)); border-radius: var(--radius-lg); margin-bottom: -30px;"></div>
            <img src="https://i.pravatar.cc/80?u=${username}" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid var(--bg-primary); margin-bottom: 12px;">
            <h2>@${username}</h2>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">Membre Yumr</p>
            
            <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 16px;">
                <div><strong>${userPosts.length}</strong><br><span style="font-size: 11px; color: var(--text-tertiary);">Posts</span></div>
                <div><strong>${Math.floor(Math.random() * 500)}</strong><br><span style="font-size: 11px; color: var(--text-tertiary);">Abonnés</span></div>
                <div><strong>${Math.floor(Math.random() * 200)}</strong><br><span style="font-size: 11px; color: var(--text-tertiary);">Suivis</span></div>
            </div>
            
            <button class="btn btn-primary">S'abonner</button>
        </div>
        
        <div style="padding: 16px; border-top: 1px solid var(--border);">
            <h4 style="margin-bottom: 12px;">Publications</h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                ${userPosts.map(p => `
                    <div style="aspect-ratio: 1; background-image: url(${p.img}); background-size: cover; border-radius: 4px; cursor: pointer;" onclick="closeModal('modal-user'); viewPost(${p.id})"></div>
                `).join('')}
            </div>
        </div>
    `;
};

// Social tabs
$$('.social-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        $$('.social-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        $$('.social-content').forEach(c => c.classList.remove('active'));
        $(`social-${tab.dataset.social}`)?.classList.add('active');
    });
});

// ============================================
// LEADERBOARD
// ============================================
function renderLeaderboard() {
    const user = getCurrentUser();
    
    $('leaderboard').innerHTML = `
        ${LEADERBOARD.map((p, i) => `
            <div class="leaderboard-item">
                <span class="lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i < 3 ? ['🥇', '🥈', '🥉'][i] : p.rank}</span>
                <img class="lb-avatar" src="${p.avatar}" alt="">
                <span class="lb-name">${p.name}</span>
                <span class="lb-score">${p.score}</span>
            </div>
        `).join('')}
        
        <div class="leaderboard-item me" style="margin-top: 16px;">
            <span class="lb-rank">45</span>
            <img class="lb-avatar" src="https://i.pravatar.cc/40?img=33" alt="">
            <span class="lb-name">${user?.username || 'Toi'}</span>
            <span class="lb-score">${user?.xp || 0}</span>
        </div>
    `;
}

// ============================================
// FAB & CREATE POST
// ============================================
$('fab')?.addEventListener('click', () => {
    openModal('modal-create');
    renderCreatePost();
});

function renderCreatePost() {
    $('create-content').innerHTML = `
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <button class="btn btn-glass btn-full post-type-btn active" data-type="photo">📷 Photo</button>
            <button class="btn btn-glass btn-full post-type-btn" data-type="recipe">🍳 Recette</button>
        </div>
        
        <div style="aspect-ratio: 1; background: var(--bg-card); border: 2px dashed var(--border); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; margin-bottom: 16px;" id="post-image-upload">
            <span style="font-size: 40px; margin-bottom: 8px;">📷</span>
            <span style="font-size: 13px; color: var(--text-secondary);">Ajouter une photo</span>
        </div>
        
        <textarea style="width: 100%; min-height: 80px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); color: var(--text-primary); font-size: 14px; resize: none; font-family: inherit;" placeholder="Écris une légende..." id="post-caption"></textarea>
    `;
    
    $('post-image-upload')?.addEventListener('click', () => {
        // Simulate image upload
        const imgs = [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
        ];
        const img = imgs[Math.floor(Math.random() * imgs.length)];
        $('post-image-upload').style.backgroundImage = `url(${img})`;
        $('post-image-upload').innerHTML = '';
        $('post-image-upload').dataset.img = img;
        toast('📷 Photo ajoutée !');
    });
}

$('btn-publish')?.addEventListener('click', () => {
    const caption = $('post-caption')?.value || '';
    const img = $('post-image-upload')?.dataset.img;
    
    if (!img) {
        toast('Ajoute une photo !', 'error');
        return;
    }
    
    const user = getCurrentUser();
    
    state.posts.unshift({
        id: Date.now(),
        user: user?.username || 'Chef',
        avatar: 'https://i.pravatar.cc/40?img=33',
        img,
        caption: caption || '🍳',
        likes: 0,
        liked: false,
        time: 'maintenant',
        comments: []
    });
    
    closeModal('modal-create');
    renderFeed();
    showXP(25);
    toast('🎉 Post publié !', 'success');
    
    // Badge check
    if (!user?.badges.includes(8)) {
        updateCurrentUser({ badges: [...(user?.badges || []), 8] });
        toast('🏅 Badge débloqué: Social !', 'success');
    }
});

// ============================================
// PROFILE MENU
// ============================================
$$('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const action = item.dataset.action;
        if (action === 'all-badges') {
            openModal('modal-badges');
            renderAllBadges();
        }
        // Add more menu actions as needed
    });
});

$('btn-logout')?.addEventListener('click', () => {
    if (confirm('Changer de compte ?')) {
        state.currentUserId = null;
        localStorage.removeItem('yumr_current_user');
        location.reload();
    }
});

// ============================================
// TUTORIAL
// ============================================
function startTutorial() {
    state.tutorialStep = 0;
    state.tutorialActive = true;
    $('tutorial').classList.add('active');
    showTutorialStep();
}

function showTutorialStep() {
    if (state.tutorialStep >= TUTORIAL_STEPS.length) {
        endTutorial();
        return;
    }
    
    const step = TUTORIAL_STEPS[state.tutorialStep];
    const target = $(step.target);
    
    if (!target) {
        state.tutorialStep++;
        showTutorialStep();
        return;
    }
    
    const rect = target.getBoundingClientRect();
    const spotlight = $('tutorial-spotlight');
    const tooltip = $('tutorial-tooltip');
    
    // Position spotlight
    spotlight.style.top = (rect.top - 8) + 'px';
    spotlight.style.left = (rect.left - 8) + 'px';
    spotlight.style.width = (rect.width + 16) + 'px';
    spotlight.style.height = (rect.height + 16) + 'px';
    
    // Position tooltip
    if (step.position === 'bottom') {
        tooltip.style.top = (rect.bottom + 16) + 'px';
    } else {
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 16) + 'px';
    }
    tooltip.style.left = Math.max(16, Math.min(window.innerWidth - 296, rect.left + rect.width / 2 - 140)) + 'px';
    
    // Set text
    $('tutorial-text').textContent = step.text;
    
    // Dots
    $('tutorial-dots').innerHTML = TUTORIAL_STEPS.map((_, i) => `
        <span class="tutorial-dot ${i === state.tutorialStep ? 'active' : ''}"></span>
    `).join('');
    
    // Button text
    $('tutorial-next').textContent = state.tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Terminer' : 'Suivant';
}

function endTutorial() {
    state.tutorialActive = false;
    $('tutorial').classList.remove('active');
    
    const user = getCurrentUser();
    if (user) {
        updateCurrentUser({ tutorialDone: true });
    }
    
    toast('🎉 Tu es prêt à cuisiner !', 'success');
}

$('tutorial-next')?.addEventListener('click', () => {
    state.tutorialStep++;
    showTutorialStep();
});

$('tutorial-skip')?.addEventListener('click', endTutorial);

// ============================================
// MODAL CLOSE HANDLERS
// ============================================
$$('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
        closeModal(el.dataset.close);
    });
});

// Close modal on backdrop click
$$('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', () => {
        const modal = backdrop.closest('.modal');
        if (modal) closeModal(modal.id);
    });
});

// Level up close
$('levelup-close')?.addEventListener('click', () => {
    $('levelup-popup').classList.remove('show');
});

// ============================================
// GLOBAL EXPORTS
// ============================================
window.openModal = openModal;
window.closeModal = closeModal;
window.startCooking = startCooking;
window.openRecipeDetail = openRecipeDetail;

});
