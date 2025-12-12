/* YUMR V2 - Complete App */
document.addEventListener('DOMContentLoaded', () => {

// STATE
const state = {
    user: null,
    token: localStorage.getItem('yumr_token'),
    isRegister: false,
    setupStep: 1,
    quizTotal: 20,
    diet: 'omnivore',
    allergies: [],
    disliked: [],
    goal: 'maintain',
    currentQ: 0,
    answers: [],
    quizStreak: 0,
    streak: parseInt(localStorage.getItem('yumr_streak') || '1'),
    lastActive: localStorage.getItem('yumr_last_active'),
    xp: parseInt(localStorage.getItem('yumr_xp') || '0'),
    level: 1,
    profile: null,
    fridge: [],
    favorites: JSON.parse(localStorage.getItem('yumr_fav') || '[]'),
    shopping: JSON.parse(localStorage.getItem('yumr_shop') || '[]'),
    posts: JSON.parse(localStorage.getItem('yumr_posts') || '[]'),
    notifications: [],
    badges: [],
    featuredBadges: [0, 1, 2],
    todayMenu: null,
    prefs: {
        budget: 'low',
        maxTime: 45
    }
};

// Calculate level from XP
state.level = Math.floor(state.xp / 100) + 1;

// QUIZ QUESTIONS with images
const QUIZ_ITEMS = [
    { name: "Pizza Margherita", emoji: "🍕", desc: "Tomate, mozzarella, basilic", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", tags: ["italien", "fromage"] },
    { name: "Sushi varié", emoji: "🍣", desc: "Assortiment de poissons crus", img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", tags: ["japonais", "poisson"] },
    { name: "Burger gourmet", emoji: "🍔", desc: "Boeuf, cheddar, bacon", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", tags: ["americain", "viande"] },
    { name: "Pad Thaï", emoji: "🍜", desc: "Nouilles sautées aux crevettes", img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400", tags: ["thai", "épicé"] },
    { name: "Salade César", emoji: "🥗", desc: "Romaine, parmesan, croûtons", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400", tags: ["healthy", "léger"] },
    { name: "Tacos al pastor", emoji: "🌮", desc: "Porc mariné, ananas, coriandre", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", tags: ["mexicain", "épicé"] },
    { name: "Ramen tonkotsu", emoji: "🍜", desc: "Bouillon de porc, oeuf mollet", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", tags: ["japonais", "réconfortant"] },
    { name: "Croissant beurre", emoji: "🥐", desc: "Feuilleté pur beurre", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", tags: ["français", "sucré"] },
    { name: "Poke bowl", emoji: "🥗", desc: "Saumon, avocat, riz", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", tags: ["hawaien", "healthy"] },
    { name: "Tiramisu", emoji: "🍰", desc: "Mascarpone, café, cacao", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", tags: ["italien", "dessert"] },
    { name: "Curry indien", emoji: "🍛", desc: "Poulet tikka masala", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", tags: ["indien", "épicé"] },
    { name: "Pâtes carbonara", emoji: "🍝", desc: "Guanciale, oeuf, pecorino", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", tags: ["italien", "crémeux"] },
    { name: "Bibimbap", emoji: "🍚", desc: "Riz, légumes, oeuf, boeuf", img: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400", tags: ["coréen", "healthy"] },
    { name: "Crêpe Nutella", emoji: "🥞", desc: "Nutella, banane, chantilly", img: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400", tags: ["français", "sucré"] },
    { name: "Falafel", emoji: "🧆", desc: "Pois chiches, houmous, pita", img: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400", tags: ["libanais", "végé"] },
    { name: "Fish & Chips", emoji: "🐟", desc: "Cabillaud pané, frites", img: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400", tags: ["anglais", "frit"] },
    { name: "Paella", emoji: "🥘", desc: "Riz, fruits de mer, safran", img: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400", tags: ["espagnol", "festif"] },
    { name: "Cheesecake", emoji: "🍰", desc: "New York style, coulis fruits", img: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400", tags: ["americain", "dessert"] },
    { name: "Pho vietnamien", emoji: "🍲", desc: "Bouillon boeuf, nouilles, herbes", img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", tags: ["vietnamien", "réconfortant"] },
    { name: "Avocado toast", emoji: "🥑", desc: "Pain complet, avocat, oeuf", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400", tags: ["brunch", "healthy"] }
];

// RECIPES DATABASE
const RECIPES = [
    { id: 1, name: "Poulet rôti aux herbes", type: "main", time: 45, cost: "€€", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400", ingredients: ["1 poulet", "Herbes de Provence", "Beurre", "Ail"], steps: ["Préchauffer le four à 200°C", "Badigeonner le poulet de beurre", "Ajouter les herbes et l'ail", "Enfourner 45 min"], calories: 450 },
    { id: 2, name: "Salade César", type: "starter", time: 15, cost: "€", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400", ingredients: ["Laitue romaine", "Parmesan", "Croûtons", "Sauce César"], steps: ["Laver la salade", "Préparer la sauce", "Mélanger le tout"], calories: 280 },
    { id: 3, name: "Tiramisu", type: "dessert", time: 30, cost: "€€", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", ingredients: ["Mascarpone", "Café", "Biscuits", "Cacao"], steps: ["Préparer le café", "Monter les œufs et le mascarpone", "Alterner les couches"], calories: 420 },
    { id: 4, name: "Pasta carbonara", type: "main", time: 20, cost: "€", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", ingredients: ["Spaghetti", "Guanciale", "Œufs", "Pecorino"], steps: ["Cuire les pâtes", "Faire revenir le guanciale", "Mélanger œufs et fromage", "Assembler hors du feu"], calories: 520 },
    { id: 5, name: "Buddha bowl", type: "main", time: 25, cost: "€", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", ingredients: ["Quinoa", "Pois chiches", "Avocat", "Légumes"], steps: ["Cuire le quinoa", "Rôtir les pois chiches", "Assembler le bowl"], calories: 380 },
    { id: 6, name: "Tarte aux pommes", type: "dessert", time: 50, cost: "€", img: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400", ingredients: ["Pâte brisée", "Pommes", "Sucre", "Cannelle"], steps: ["Étaler la pâte", "Disposer les pommes", "Saupoudrer de sucre", "Enfourner 40 min"], calories: 320 },
    { id: 7, name: "Risotto champignons", type: "main", time: 35, cost: "€€", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400", ingredients: ["Riz arborio", "Champignons", "Parmesan", "Bouillon"], steps: ["Faire revenir les champignons", "Ajouter le riz", "Mouiller progressivement"], calories: 450 },
    { id: 8, name: "Soupe miso", type: "starter", time: 15, cost: "€", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400", ingredients: ["Pâte miso", "Tofu", "Algues wakame", "Ciboule"], steps: ["Chauffer l'eau", "Diluer le miso", "Ajouter tofu et algues"], calories: 85 }
];

// FRIDGE INIT
const FRIDGE_INIT = [
    { id: 1, name: "Tomates", icon: "🍅", qty: "500g", cat: "veggies", exp: new Date(Date.now() + 5*24*60*60*1000) },
    { id: 2, name: "Poulet", icon: "🍗", qty: "400g", cat: "meat", exp: new Date(Date.now() + 2*24*60*60*1000) },
    { id: 3, name: "Lait", icon: "🥛", qty: "1L", cat: "dairy", exp: new Date(Date.now() + 7*24*60*60*1000) },
    { id: 4, name: "Œufs", icon: "🥚", qty: "6", cat: "other", exp: new Date(Date.now() + 14*24*60*60*1000) },
    { id: 5, name: "Pommes", icon: "🍎", qty: "4", cat: "fruits", exp: new Date(Date.now() + 10*24*60*60*1000) },
    { id: 6, name: "Salade", icon: "🥬", qty: "1", cat: "veggies", exp: new Date(Date.now() + 3*24*60*60*1000) }
];

// LEADERBOARD
const LEADERBOARD = [
    { rank: 1, name: "MasterChef_", pts: 2450, img: 1 },
    { rank: 2, name: "CookingQueen", pts: 2280, img: 2 },
    { rank: 3, name: "FoodieKing", pts: 2150, img: 3 },
    { rank: 4, name: "ChefAlex", pts: 1980, img: 4 },
    { rank: 5, name: "TastyBites", pts: 1850, img: 5 },
    { rank: 6, name: "GourmetGal", pts: 1720, img: 6 },
    { rank: 7, name: "SpiceMaster", pts: 1650, img: 7 },
    { rank: 8, name: "YumYumChef", pts: 1580, img: 8 },
    { rank: 9, name: "FoodLover99", pts: 1490, img: 9 },
    { rank: 10, name: "ChefNoob", pts: 1420, img: 10 }
];

// BADGES - Lots of them including secrets
const ALL_BADGES = [
    // Cooking badges
    { id: 0, name: "Premier plat", emoji: "🍳", desc: "Cuisine ta première recette", cat: "cooking", unlocked: false },
    { id: 1, name: "Chef débutant", emoji: "👨‍🍳", desc: "Cuisine 5 recettes", cat: "cooking", unlocked: false },
    { id: 2, name: "Cordon bleu", emoji: "🎖️", desc: "Cuisine 25 recettes", cat: "cooking", unlocked: false },
    { id: 3, name: "Master Chef", emoji: "⭐", desc: "Cuisine 100 recettes", cat: "cooking", unlocked: false },
    { id: 4, name: "Pâtissier", emoji: "🧁", desc: "Cuisine 10 desserts", cat: "cooking", unlocked: false },
    { id: 5, name: "Healthy", emoji: "🥗", desc: "Cuisine 10 plats healthy", cat: "cooking", unlocked: false },
    { id: 6, name: "World Food", emoji: "🌍", desc: "Cuisine de 5 pays différents", cat: "cooking", unlocked: false },
    { id: 7, name: "Speed Cook", emoji: "⚡", desc: "Cuisine 10 plats en -15min", cat: "cooking", unlocked: false },
    // Social badges
    { id: 10, name: "Influenceur", emoji: "📸", desc: "Publie 10 posts", cat: "social", unlocked: false },
    { id: 11, name: "Populaire", emoji: "❤️", desc: "Reçois 50 likes", cat: "social", unlocked: false },
    { id: 12, name: "Viral", emoji: "🔥", desc: "Un post avec 100+ likes", cat: "social", unlocked: false },
    { id: 13, name: "Communauté", emoji: "🤝", desc: "10 abonnés", cat: "social", unlocked: false },
    { id: 14, name: "Star", emoji: "⭐", desc: "100 abonnés", cat: "social", unlocked: false },
    { id: 15, name: "Parrain", emoji: "🎁", desc: "Parraine un ami", cat: "social", unlocked: false },
    // Progress badges
    { id: 20, name: "Niveau 5", emoji: "5️⃣", desc: "Atteins le niveau 5", cat: "progress", unlocked: false },
    { id: 21, name: "Niveau 10", emoji: "🔟", desc: "Atteins le niveau 10", cat: "progress", unlocked: false },
    { id: 22, name: "Streak 7", emoji: "🔥", desc: "7 jours de streak", cat: "progress", unlocked: false },
    { id: 23, name: "Streak 30", emoji: "💪", desc: "30 jours de streak", cat: "progress", unlocked: false },
    { id: 24, name: "XP Master", emoji: "✨", desc: "Gagne 1000 XP", cat: "progress", unlocked: false },
    { id: 25, name: "Ligue Or", emoji: "🥇", desc: "Atteins la ligue Or", cat: "progress", unlocked: false },
    { id: 26, name: "Champion", emoji: "🏆", desc: "1ère place en ligue", cat: "progress", unlocked: false },
    // Secret badges (Easter eggs)
    { id: 30, name: "Noctambule", emoji: "🌙", desc: "Cuisine après minuit", cat: "secret", unlocked: false, secret: true },
    { id: 31, name: "Early Bird", emoji: "🐤", desc: "Cuisine avant 6h", cat: "secret", unlocked: false, secret: true },
    { id: 32, name: "Pizza Time", emoji: "🍕", desc: "Swipe 10 pizzas", cat: "secret", unlocked: false, secret: true },
    { id: 33, name: "Sushi Master", emoji: "🍣", desc: "Swipe 10 sushis", cat: "secret", unlocked: false, secret: true },
    { id: 34, name: "Frigo vide", emoji: "🧊", desc: "Vide complètement ton frigo", cat: "secret", unlocked: false, secret: true },
    { id: 35, name: "Explorer", emoji: "🗺️", desc: "Visite tous les onglets", cat: "secret", unlocked: false, secret: true },
    { id: 36, name: "Perfectionniste", emoji: "💯", desc: "Complete ton profil à 100%", cat: "secret", unlocked: false, secret: true },
    { id: 37, name: "Fidèle", emoji: "💝", desc: "Utilise l'app 100 jours", cat: "secret", unlocked: false, secret: true }
];
state.badges = ALL_BADGES;

// CHALLENGES
const CHALLENGES = [
    { id: 1, name: "Cuisine végétarienne", emoji: "🥬", desc: "Cuisine un plat végétarien aujourd'hui", xp: 75, progress: 0, goal: 1, active: true },
    { id: 2, name: "Streak de 3 jours", emoji: "🔥", desc: "Maintiens ta streak pendant 3 jours", xp: 100, progress: 1, goal: 3, active: true },
    { id: 3, name: "Partage ta création", emoji: "📸", desc: "Publie une photo de ton plat", xp: 50, progress: 0, goal: 1, active: false },
    { id: 4, name: "Explorateur", emoji: "🌍", desc: "Essaie une cuisine d'un nouveau pays", xp: 100, progress: 0, goal: 1, active: false },
    { id: 5, name: "Semaine healthy", emoji: "💪", desc: "Cuisine 5 plats healthy cette semaine", xp: 200, progress: 0, goal: 5, active: false }
];

// NOTIFICATIONS
const SAMPLE_NOTIFS = [
    { id: 1, icon: "🔥", text: "Ta streak de 3 jours continue !", time: "Il y a 2h", unread: true },
    { id: 2, icon: "❤️", text: "ChefAlex a aimé ton post", time: "Il y a 5h", unread: true },
    { id: 3, icon: "🏆", text: "Tu es passé en ligue Argent !", time: "Hier", unread: false },
    { id: 4, icon: "🎯", text: "Nouveau défi disponible", time: "Hier", unread: false },
    { id: 5, icon: "👨‍🍳", text: "Bienvenue sur Yumr !", time: "Il y a 3j", unread: false }
];
state.notifications = SAMPLE_NOTIFS;

// TASTE PROFILES
const PROFILES = [
    { name: "L'Italien", emoji: "🍝", desc: "Tu adores les saveurs méditerranéennes, les pâtes et le fromage.", tags: ["Pasta lover", "Fromage", "Méditerranéen"] },
    { name: "L'Aventurier", emoji: "🌶️", desc: "Tu aimes découvrir de nouvelles saveurs et cuisines du monde.", tags: ["Épicé", "Exotique", "Curieux"] },
    { name: "Le Healthy", emoji: "🥗", desc: "Tu privilégies une alimentation saine et équilibrée.", tags: ["Healthy", "Léger", "Équilibré"] },
    { name: "Le Gourmand", emoji: "🍰", desc: "Tu ne résistes pas aux plaisirs sucrés et aux desserts.", tags: ["Sucré", "Desserts", "Gourmand"] },
    { name: "Le Classique", emoji: "🍖", desc: "Tu apprécies la cuisine traditionnelle et réconfortante.", tags: ["Traditionnel", "Viande", "Réconfortant"] }
];

// HELPERS
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const show = el => { if(el) el.classList.add('active'); };
const hide = el => { if(el) el.classList.remove('active'); };
const showScreen = id => { $$('.screen').forEach(s => hide(s)); show($(id)); };

function toast(msg, type = '') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    $('toasts').appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function showXP(amount) {
    $('xp-amount').textContent = `+${amount} XP`;
    $('xp-popup').classList.add('show');
    setTimeout(() => $('xp-popup').classList.remove('show'), 1500);
    state.xp += amount;
    localStorage.setItem('yumr_xp', state.xp);
    updateStats();
    checkLevelUp();
}

function checkLevelUp() {
    const newLevel = Math.floor(state.xp / 100) + 1;
    if (newLevel > state.level) {
        state.level = newLevel;
        $('new-lv').textContent = state.level;
        $('levelup').classList.add('show');
    }
}

function updateStats() {
    // Header
    if ($('h-xp')) $('h-xp').textContent = state.xp;
    if ($('h-streak')) $('h-streak').textContent = state.streak;
    
    // Home stats
    if ($('s-level')) $('s-level').textContent = state.level;
    if ($('s-streak')) $('s-streak').textContent = state.streak;
    if ($('s-recipes')) $('s-recipes').textContent = state.posts.filter(p => p.type === 'recipe').length;
    if ($('s-badges')) $('s-badges').textContent = state.badges.filter(b => b.unlocked).length;
    
    // Profile
    if ($('p-lv')) $('p-lv').textContent = state.level;
    if ($('xp-lv')) $('xp-lv').textContent = state.level;
    if ($('ps-xp')) $('ps-xp').textContent = state.xp;
    if ($('ps-streak')) $('ps-streak').textContent = state.streak;
    if ($('ps-posts')) $('ps-posts').textContent = state.posts.length;
    
    // XP bar
    const xpForLevel = 100;
    const currentLevelXP = state.xp % xpForLevel;
    const progress = (currentLevelXP / xpForLevel) * 100;
    if ($('xp-fill')) $('xp-fill').style.width = `${progress}%`;
    if ($('xp-cur')) $('xp-cur').textContent = currentLevelXP;
    if ($('xp-max')) $('xp-max').textContent = xpForLevel;
}

function openModal(id) { show($(id)); }
function closeModal(id) { hide($(id)); }

function updateStreakDaily() {
    const today = new Date().toDateString();
    if (state.lastActive && state.lastActive !== today) {
        const lastDate = new Date(state.lastActive);
        const diff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
        if (diff > 1) {
            state.streak = 1; // Reset streak
        } else {
            state.streak++;
        }
    }
    state.lastActive = today;
    localStorage.setItem('yumr_last_active', today);
    localStorage.setItem('yumr_streak', state.streak);
}

// INIT LOGIC
if (state.token) {
    // User already logged in - skip to main app
    state.user = JSON.parse(localStorage.getItem('yumr_user') || '{"username":"Chef"}');
    updateStreakDaily();
    setTimeout(() => initMainApp(), 2500);
} else {
    // New user - show onboarding
    setTimeout(() => showScreen('onboarding'), 2500);
}

// ONBOARDING
let obSlide = 0;
$('ob-next').addEventListener('click', () => {
    obSlide++;
    if (obSlide >= 3) {
        // Go to QUIZ first, not auth
        startQuiz();
    } else {
        $$('.ob-slide').forEach((s, i) => s.classList.toggle('active', i === obSlide));
        $$('.ob-dots .dot').forEach((d, i) => d.classList.toggle('active', i === obSlide));
    }
});

$('ob-login').addEventListener('click', () => {
    state.isRegister = false;
    showScreen('auth');
    updateAuthUI();
});

// AUTH
function updateAuthUI() {
    $('auth-title').textContent = state.isRegister ? 'Créer un compte' : 'Connexion';
    $('auth-submit').textContent = state.isRegister ? "S'inscrire" : 'Se connecter';
    $('auth-switch-text').textContent = state.isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?';
    $('auth-toggle').textContent = state.isRegister ? 'Se connecter' : "S'inscrire";
    $('field-username').classList.toggle('hidden', !state.isRegister);
}

$('auth-toggle').addEventListener('click', () => {
    state.isRegister = !state.isRegister;
    updateAuthUI();
});

$('auth-back').addEventListener('click', () => {
    if (state.profile) {
        showScreen('result');
    } else {
        showScreen('onboarding');
    }
});

$('auth-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('in-email').value;
    const pass = $('in-pass').value;
    const username = $('in-username').value;
    
    if (!email || !pass) {
        $('auth-error').textContent = 'Remplis tous les champs';
        return;
    }
    
    if (state.isRegister) {
        // Register flow - go to setup
        state.user = { username: username || 'Chef', email };
        localStorage.setItem('yumr_user', JSON.stringify(state.user));
        showScreen('setup');
    } else {
        // Login flow - direct to main
        state.user = { username: email.split('@')[0], email };
        state.token = 'demo_token';
        localStorage.setItem('yumr_token', state.token);
        localStorage.setItem('yumr_user', JSON.stringify(state.user));
        initMainApp();
    }
});

// SETUP
function updateSetupSteps() {
    $$('.step').forEach((s, i) => s.classList.toggle('active', i < state.setupStep));
    $$('.setup-page').forEach((p, i) => p.classList.toggle('active', i === state.setupStep - 1));
}

$('setup-next-1').addEventListener('click', () => {
    state.diet = document.querySelector('input[name="diet"]:checked').value;
    state.allergies = [...document.querySelectorAll('input[name="allergy"]:checked')].map(c => c.value);
    state.setupStep = 2;
    updateSetupSteps();
});

$('setup-back-2').addEventListener('click', () => { state.setupStep = 1; updateSetupSteps(); });
$('setup-next-2').addEventListener('click', () => {
    state.goal = document.querySelector('input[name="goal"]:checked').value;
    state.setupStep = 3;
    updateSetupSteps();
});

$('setup-back-3').addEventListener('click', () => { state.setupStep = 2; updateSetupSteps(); });
$('setup-finish').addEventListener('click', () => {
    state.disliked = [...document.querySelectorAll('.dislike input:checked')].map(c => c.value);
    
    // Save preferences
    localStorage.setItem('yumr_prefs', JSON.stringify({
        diet: state.diet,
        allergies: state.allergies,
        goal: state.goal,
        disliked: state.disliked
    }));
    
    // Complete registration
    state.token = 'demo_token';
    localStorage.setItem('yumr_token', state.token);
    
    initMainApp();
});

// QUIZ
function startQuiz() {
    showScreen('quiz');
    state.currentQ = 0;
    state.answers = [];
    state.quizStreak = 0;
    loadQuestion();
}

function loadQuestion() {
    if (state.currentQ >= state.quizTotal) {
        finishQuiz();
        return;
    }
    
    const item = QUIZ_ITEMS[state.currentQ % QUIZ_ITEMS.length];
    const card = $('quiz-card');
    
    card.classList.remove('left', 'right', 'hint-left', 'hint-right');
    
    $('card-img').style.backgroundImage = `url(${item.img})`;
    $('card-emoji').textContent = item.emoji;
    $('card-q').textContent = item.name;
    $('card-desc').textContent = item.desc;
    
    $('quiz-count').textContent = `${state.currentQ + 1}/${state.quizTotal}`;
    $('quiz-prog-fill').style.width = `${((state.currentQ) / state.quizTotal) * 100}%`;
    $('quiz-streak').querySelector('span').textContent = state.quizStreak;
}

function answerQuiz(liked) {
    const card = $('quiz-card');
    card.classList.add(liked ? 'right' : 'left');
    
    state.answers.push({ item: QUIZ_ITEMS[state.currentQ % QUIZ_ITEMS.length], liked });
    
    if (liked) {
        state.quizStreak++;
    }
    
    setTimeout(() => {
        state.currentQ++;
        loadQuestion();
    }, 400);
}

// Quiz swipe handling
let startX = 0, currentX = 0, isDragging = false;
const card = $('quiz-card');

card.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
    card.classList.add('dragging');
});

card.addEventListener('touchmove', e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    card.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
    card.classList.toggle('hint-left', diff < -50);
    card.classList.toggle('hint-right', diff > 50);
});

card.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('dragging');
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 100) {
        answerQuiz(diff > 0);
    } else {
        card.style.transform = '';
        card.classList.remove('hint-left', 'hint-right');
    }
});

$('btn-nope').addEventListener('click', () => answerQuiz(false));
$('btn-love').addEventListener('click', () => answerQuiz(true));
$('quiz-close').addEventListener('click', () => {
    if (confirm('Quitter le quiz ? Tes réponses seront perdues.')) {
        showScreen('onboarding');
    }
});

function finishQuiz() {
    // Determine profile based on answers
    const likedTags = state.answers.filter(a => a.liked).flatMap(a => a.item.tags);
    const tagCounts = {};
    likedTags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
    
    // Simple profile selection
    let profileIndex = 0;
    if (tagCounts['italien'] > 3) profileIndex = 0;
    else if (tagCounts['épicé'] > 2 || tagCounts['exotique']) profileIndex = 1;
    else if (tagCounts['healthy'] > 2) profileIndex = 2;
    else if (tagCounts['sucré'] > 2 || tagCounts['dessert'] > 2) profileIndex = 3;
    else profileIndex = 4;
    
    state.profile = PROFILES[profileIndex];
    
    // Show result
    showScreen('result');
    $('res-emoji').textContent = state.profile.emoji;
    $('res-title').textContent = state.profile.name;
    $('res-desc').textContent = state.profile.desc;
    $('res-tags').innerHTML = state.profile.tags.map(t => `<span>${t}</span>`).join('');
    
    // Confetti effect
    createConfetti();
    
    // Give XP
    setTimeout(() => showXP(100), 1000);
}

function createConfetti() {
    const confetti = $('confetti');
    confetti.innerHTML = '';
    const colors = ['#FF6B35', '#FFD166', '#4ECB71', '#FF4757', '#FFBA08'];
    for (let i = 0; i < 50; i++) {
        const c = document.createElement('div');
        c.style.cssText = `
            position: absolute;
            width: 10px; height: 10px;
            background: ${colors[i % colors.length]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
        `;
        confetti.appendChild(c);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

$('res-continue').addEventListener('click', () => {
    state.isRegister = true;
    showScreen('auth');
    updateAuthUI();
});

$('res-skip').addEventListener('click', () => {
    state.user = { username: 'Invité', email: '' };
    state.token = 'guest_token';
    localStorage.setItem('yumr_token', state.token);
    localStorage.setItem('yumr_user', JSON.stringify(state.user));
    initMainApp();
});

// MAIN APP INIT
function initMainApp() {
    showScreen('main');
    state.fridge = [...FRIDGE_INIT];
    
    if (state.user) {
        $('u-name').textContent = state.user.username || 'Chef';
        $('p-name').textContent = '@' + (state.user.username || 'chef').toLowerCase().replace(/\s/g, '');
    }
    
    if (state.profile) {
        $('p-emoji').textContent = state.profile.emoji;
        $('p-type').textContent = state.profile.name;
    }
    
    updateStats();
    updateFridgeCount();
    renderRecipes();
    renderLeaderboard();
    renderBadges();
    renderFeed();
    renderChallenges();
    renderNotifications();
    renderFeaturedBadges();
    
    // Update notification dot
    const unreadCount = state.notifications.filter(n => n.unread).length;
    $('notif-dot').classList.toggle('hidden', unreadCount === 0);
}

// NAVIGATION
$$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        $$('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.tab').forEach(t => t.classList.toggle('active', t.id === `tab-${tab}`));
    });
});

// HEADER BUTTONS
$('h-streak-btn').addEventListener('click', () => {
    $('streak-val').textContent = state.streak;
    renderStreakCalendar();
    openModal('m-streak');
});

$('h-xp-btn').addEventListener('click', () => {
    $('xp-total').textContent = state.xp;
    $('xp-modal-lv').textContent = state.level;
    const progress = (state.xp % 100) / 100 * 100;
    $('xp-modal-fill').style.width = `${progress}%`;
    openModal('m-xp');
});

$('h-notif-btn').addEventListener('click', () => {
    openModal('m-notifs');
    // Mark all as read
    state.notifications.forEach(n => n.unread = false);
    $('notif-dot').classList.add('hidden');
});

function renderStreakCalendar() {
    const cal = $('streak-calendar');
    cal.innerHTML = '';
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const today = new Date().getDay();
    
    for (let i = 0; i < 7; i++) {
        const div = document.createElement('div');
        div.className = 'streak-day';
        if (i < state.streak % 7) {
            div.classList.add('done');
            div.textContent = '✓';
        } else {
            div.textContent = days[i];
        }
        cal.appendChild(div);
    }
}

function renderNotifications() {
    $('notifs-list').innerHTML = state.notifications.map(n => `
        <div class="notif-item ${n.unread ? 'unread' : ''}">
            <span class="notif-icon">${n.icon}</span>
            <div class="notif-content">
                <p>${n.text}</p>
                <span>${n.time}</span>
            </div>
        </div>
    `).join('');
}

// MODAL CLOSE HANDLERS
$$('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

$$('.modal-bg').forEach(bg => {
    bg.addEventListener('click', () => closeModal(bg.dataset.close));
});

// QUICK ACTIONS
$$('.quick').forEach(q => {
    q.addEventListener('click', () => {
        const modal = q.dataset.modal;
        if (modal) openModal(modal);
    });
});

$$('.stat.clickable').forEach(s => {
    s.addEventListener('click', () => {
        const modal = s.dataset.modal;
        if (modal) openModal(modal);
    });
});

// FRIDGE
function updateFridgeCount() {
    $('fridge-count').textContent = state.fridge.length;
}

function renderFridge(filter = 'all') {
    const list = $('fridge-list');
    const items = filter === 'all' ? state.fridge : state.fridge.filter(i => i.cat === filter);
    
    list.innerHTML = items.map(item => {
        const days = Math.ceil((new Date(item.exp) - new Date()) / (1000 * 60 * 60 * 24));
        const expClass = days <= 2 ? 'bad' : days <= 5 ? 'warn' : 'ok';
        return `
            <div class="fridge-item" data-id="${item.id}">
                <span class="fridge-item-icon">${item.icon}</span>
                <div class="fridge-item-info">
                    <span class="fridge-item-name">${item.name}</span>
                    <span class="fridge-item-qty">${item.qty}</span>
                </div>
                <span class="fridge-item-exp ${expClass}">${days}j</span>
                <button class="fridge-item-del" data-id="${item.id}">🗑️</button>
            </div>
        `;
    }).join('');
    
    // Expiring soon
    const expiring = state.fridge.filter(i => {
        const days = Math.ceil((new Date(i.exp) - new Date()) / (1000 * 60 * 60 * 24));
        return days <= 3;
    });
    
    if (expiring.length > 0) {
        $('fridge-exp').style.display = 'block';
        $('exp-list').innerHTML = expiring.map(i => `
            <div class="fridge-item">
                <span class="fridge-item-icon">${i.icon}</span>
                <span class="fridge-item-name">${i.name}</span>
            </div>
        `).join('');
    } else {
        $('fridge-exp').style.display = 'none';
    }
    
    // Delete handlers
    list.querySelectorAll('.fridge-item-del').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            state.fridge = state.fridge.filter(i => i.id !== id);
            renderFridge(filter);
            updateFridgeCount();
            toast('Aliment supprimé');
        });
    });
}

// Fridge category filters
$$('.fcat').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.fcat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFridge(btn.dataset.cat);
    });
});

// Open fridge modal
$('m-fridge').addEventListener('transitionend', () => {
    if ($('m-fridge').classList.contains('active')) {
        renderFridge();
    }
});

// Trigger render when modal opens
const fridgeObserver = new MutationObserver(() => {
    if ($('m-fridge').classList.contains('active')) {
        renderFridge();
    }
});
fridgeObserver.observe($('m-fridge'), { attributes: true, attributeFilter: ['class'] });

// Add item
$('btn-add-item').addEventListener('click', () => openModal('m-add-item'));

$('btn-confirm-item').addEventListener('click', () => {
    const name = $('item-name').value;
    const qty = $('item-qty').value;
    const cat = $('item-cat').value;
    const exp = $('item-exp').value;
    
    if (!name) {
        toast('Entre un nom', 'error');
        return;
    }
    
    const icons = { fruits: '🍎', veggies: '🥬', meat: '🥩', dairy: '🧀', other: '📦' };
    
    state.fridge.push({
        id: Date.now(),
        name,
        icon: icons[cat] || '📦',
        qty: qty || '1',
        cat,
        exp: exp ? new Date(exp) : new Date(Date.now() + 7*24*60*60*1000)
    });
    
    closeModal('m-add-item');
    renderFridge();
    updateFridgeCount();
    toast('Aliment ajouté !', 'success');
    
    // Reset form
    $('item-name').value = '';
    $('item-qty').value = '';
    $('item-exp').value = '';
});

// Snap fridge & scan ticket (demo)
$('btn-snap-fridge').addEventListener('click', () => {
    toast('📸 Fonctionnalité IA bientôt disponible !');
});

$('btn-scan-ticket').addEventListener('click', () => {
    toast('🧾 Fonctionnalité IA bientôt disponible !');
});

// SHOPPING LIST
function renderShopping() {
    $('shop-items').textContent = state.shopping.length;
    $('shop-cost').textContent = `~${state.shopping.length * 3}€`;
    
    $('shop-list').innerHTML = state.shopping.map((item, i) => `
        <div class="shop-item ${item.done ? 'done' : ''}" data-i="${i}">
            <input type="checkbox" ${item.done ? 'checked' : ''}>
            <span class="shop-item-name">${item.name}</span>
        </div>
    `).join('');
    
    // Toggle handlers
    $('shop-list').querySelectorAll('.shop-item').forEach(item => {
        item.addEventListener('click', () => {
            const i = parseInt(item.dataset.i);
            state.shopping[i].done = !state.shopping[i].done;
            localStorage.setItem('yumr_shop', JSON.stringify(state.shopping));
            renderShopping();
        });
    });
}

$('btn-add-shop').addEventListener('click', () => {
    const name = prompt('Ajouter un article :');
    if (name) {
        state.shopping.push({ name, done: false });
        localStorage.setItem('yumr_shop', JSON.stringify(state.shopping));
        renderShopping();
    }
});

$('btn-clear-shop').addEventListener('click', () => {
    if (confirm('Vider la liste ?')) {
        state.shopping = [];
        localStorage.setItem('yumr_shop', JSON.stringify(state.shopping));
        renderShopping();
    }
});

// Render shopping when modal opens
const shopObserver = new MutationObserver(() => {
    if ($('m-shopping').classList.contains('active')) {
        renderShopping();
    }
});
shopObserver.observe($('m-shopping'), { attributes: true, attributeFilter: ['class'] });

// RECIPES
let searchTimeout;
function renderRecipes(filter = 'all', search = '') {
    let recipes = [...RECIPES];
    
    if (filter !== 'all') {
        recipes = recipes.filter(r => r.type === filter);
    }
    
    if (search) {
        recipes = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    $('recipes').innerHTML = recipes.map(r => `
        <div class="recipe-card" data-id="${r.id}">
            <div class="recipe-img" style="background-image: url(${r.img})">
                <button class="recipe-save ${state.favorites.includes(r.id) ? 'saved' : ''}" data-id="${r.id}">
                    ${state.favorites.includes(r.id) ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="recipe-body">
                <div class="recipe-name">${r.name}</div>
                <div class="recipe-meta">⏱️ ${r.time}min • ${r.cost}</div>
            </div>
        </div>
    `).join('');
    
    // Card click handlers
    $('recipes').querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', e => {
            if (!e.target.closest('.recipe-save')) {
                openRecipe(parseInt(card.dataset.id));
            }
        });
    });
    
    // Save handlers
    $('recipes').querySelectorAll('.recipe-save').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleFavorite(id);
            btn.classList.toggle('saved');
            btn.textContent = state.favorites.includes(id) ? '❤️' : '🤍';
        });
    });
}

function toggleFavorite(id) {
    if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(f => f !== id);
    } else {
        state.favorites.push(id);
    }
    localStorage.setItem('yumr_fav', JSON.stringify(state.favorites));
}

// Explore tabs
$$('.etab').forEach(tab => {
    tab.addEventListener('click', () => {
        $$('.etab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const filter = tab.dataset.filter;
        if (filter === 'saved') {
            const saved = RECIPES.filter(r => state.favorites.includes(r.id));
            $('recipes').innerHTML = saved.length ? saved.map(r => `
                <div class="recipe-card" data-id="${r.id}">
                    <div class="recipe-img" style="background-image: url(${r.img})">
                        <button class="recipe-save saved" data-id="${r.id}">❤️</button>
                    </div>
                    <div class="recipe-body">
                        <div class="recipe-name">${r.name}</div>
                        <div class="recipe-meta">⏱️ ${r.time}min • ${r.cost}</div>
                    </div>
                </div>
            `).join('') : '<p style="text-align:center;color:var(--text2);padding:40px;grid-column:1/-1">Aucune recette sauvegardée</p>';
        } else {
            renderRecipes();
        }
    });
});

// Category filters
$$('.filter').forEach(f => {
    f.addEventListener('click', () => {
        $$('.filter').forEach(x => x.classList.remove('active'));
        f.classList.add('active');
        renderRecipes(f.dataset.cat);
    });
});

// Search
$('search-in').addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => renderRecipes('all', e.target.value), 300);
});

// Recipe page
function openRecipe(id) {
    const recipe = RECIPES.find(r => r.id === id);
    if (!recipe) return;
    
    const types = { starter: 'Entrée', main: 'Plat', dessert: 'Dessert' };
    
    $('recipe-page').innerHTML = `
        <div class="recipe-hero" style="background-image: url(${recipe.img})">
            <button class="back-btn recipe-back" data-close="m-recipe">←</button>
            <button class="recipe-save-btn ${state.favorites.includes(id) ? 'saved' : ''}" data-id="${id}">
                ${state.favorites.includes(id) ? '❤️' : '🤍'}
            </button>
        </div>
        <div class="recipe-content">
            <span class="recipe-type">${types[recipe.type]}</span>
            <h1 class="recipe-title">${recipe.name}</h1>
            <p class="recipe-desc">Une recette délicieuse et facile à préparer.</p>
            <div class="recipe-metas">
                <span>⏱️ ${recipe.time} min</span>
                <span>💰 ${recipe.cost}</span>
                <span>🔥 ${recipe.calories} kcal</span>
            </div>
            <div class="recipe-section">
                <h3>🥗 Ingrédients</h3>
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
            <div class="recipe-section">
                <h3>👨‍🍳 Étapes</h3>
                <ol>${recipe.steps.map(s => `<li>${s}</li>`).join('')}</ol>
            </div>
            <button class="btn btn-primary btn-full" id="btn-cook">J'ai cuisiné ! +50 XP</button>
        </div>
    `;
    
    openModal('m-recipe');
    
    // Event listeners
    $('recipe-page').querySelector('.recipe-back').addEventListener('click', () => closeModal('m-recipe'));
    
    $('recipe-page').querySelector('.recipe-save-btn').addEventListener('click', function() {
        toggleFavorite(id);
        this.classList.toggle('saved');
        this.textContent = state.favorites.includes(id) ? '❤️' : '🤍';
    });
    
    $('btn-cook').addEventListener('click', () => {
        showXP(50);
        toast('Bravo ! 🎉', 'success');
        closeModal('m-recipe');
    });
}

// DAILY MENU
$('btn-gen-menu').addEventListener('click', () => {
    openModal('m-menu-quiz');
    startMenuQuiz();
});

function startMenuQuiz() {
    const questions = [
        { q: "Comment te sens-tu aujourd'hui ?", opts: [
            { emoji: "😴", text: "Fatigué", val: "comfort" },
            { emoji: "⚡", text: "Énergique", val: "fresh" },
            { emoji: "😊", text: "Content", val: "balanced" }
        ]},
        { q: "Plutôt sucré ou salé ?", opts: [
            { emoji: "🍰", text: "Sucré", val: "sweet" },
            { emoji: "🧂", text: "Salé", val: "salty" },
            { emoji: "⚖️", text: "Les deux", val: "both" }
        ]},
        { q: "Ton budget pour ce repas ?", opts: [
            { emoji: "💰", text: "Économique", val: "low" },
            { emoji: "💵", text: "Modéré", val: "medium" },
            { emoji: "💎", text: "Gourmand", val: "high" }
        ]},
        { q: "Temps de préparation ?", opts: [
            { emoji: "⚡", text: "-15 min", val: 15 },
            { emoji: "⏱️", text: "15-30 min", val: 30 },
            { emoji: "👨‍🍳", text: "+30 min", val: 60 }
        ]},
        { q: "Utiliser uniquement ton frigo ?", opts: [
            { emoji: "🧊", text: "Oui, frigo only", val: "fridge" },
            { emoji: "🛒", text: "Frigo + courses", val: "mixed" },
            { emoji: "🌍", text: "Peu importe", val: "any" }
        ]}
    ];
    
    let step = 0;
    const answers = {};
    
    function renderMenuStep() {
        const q = questions[step];
        $('mq-step').textContent = `${step + 1}/${questions.length}`;
        
        $('menu-quiz').innerHTML = `
            <h2>${q.q}</h2>
            <div class="menu-opts">
                ${q.opts.map((o, i) => `
                    <button class="menu-opt" data-val="${o.val}">
                        <span>${o.emoji}</span>
                        <span>${o.text}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        $('menu-quiz').querySelectorAll('.menu-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                answers[step] = btn.dataset.val;
                step++;
                
                if (step >= questions.length) {
                    generateMenu(answers);
                } else {
                    renderMenuStep();
                }
            });
        });
    }
    
    renderMenuStep();
}

function generateMenu(answers) {
    closeModal('m-menu-quiz');
    
    // Simple menu generation based on answers
    const starter = RECIPES.find(r => r.type === 'starter');
    const main = RECIPES.find(r => r.type === 'main');
    const dessert = RECIPES.find(r => r.type === 'dessert');
    
    state.todayMenu = { starter, main, dessert };
    
    $('daily-preview').innerHTML = `
        <div class="daily-item" data-id="${starter.id}">
            <div class="daily-item-img" style="background-image: url(${starter.img})"></div>
            <div class="daily-item-info">
                <span class="daily-item-type">Entrée</span>
                <span class="daily-item-name">${starter.name}</span>
            </div>
        </div>
        <div class="daily-item" data-id="${main.id}">
            <div class="daily-item-img" style="background-image: url(${main.img})"></div>
            <div class="daily-item-info">
                <span class="daily-item-type">Plat</span>
                <span class="daily-item-name">${main.name}</span>
            </div>
        </div>
        <div class="daily-item" data-id="${dessert.id}">
            <div class="daily-item-img" style="background-image: url(${dessert.img})"></div>
            <div class="daily-item-info">
                <span class="daily-item-type">Dessert</span>
                <span class="daily-item-name">${dessert.name}</span>
            </div>
        </div>
    `;
    
    // Click handlers
    $('daily-preview').querySelectorAll('.daily-item').forEach(item => {
        item.addEventListener('click', () => openRecipe(parseInt(item.dataset.id)));
    });
    
    toast('Menu généré ! 🍽️', 'success');
    showXP(10);
}

// FEED & POSTS
function renderFeed(filter = 'all') {
    let posts = [...state.posts];
    
    // Add sample posts if empty
    if (posts.length === 0) {
        posts = [
            { id: 1, user: 'ChefAlex', avatar: 'https://i.pravatar.cc/44?img=4', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', caption: 'Mon poke bowl du midi 🥗 #healthy #homemade', likes: 42, time: 'Il y a 2h', liked: false },
            { id: 2, user: 'FoodieKing', avatar: 'https://i.pravatar.cc/44?img=3', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', caption: 'Pizza maison, meilleure qu\'en Italie ! 🍕', likes: 87, time: 'Il y a 5h', liked: false },
            { id: 3, user: 'CookingQueen', avatar: 'https://i.pravatar.cc/44?img=2', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', caption: 'Dessert du dimanche 🍰 #patisserie', likes: 156, time: 'Hier', liked: false }
        ];
    }
    
    if (filter === 'mine') {
        posts = state.posts.filter(p => p.mine);
    }
    
    $('feed').innerHTML = posts.length ? posts.map(p => `
        <div class="feed-post" data-id="${p.id}">
            <div class="feed-header">
                <div class="feed-av" style="background-image: url(${p.avatar || 'https://i.pravatar.cc/44'})"></div>
                <div class="feed-user">
                    <strong>${p.user || state.user?.username || 'Moi'}</strong>
                    <span>${p.time}</span>
                </div>
            </div>
            ${p.img ? `<div class="feed-img" style="background-image: url(${p.img})"></div>` : ''}
            <div class="feed-content">
                <p>${p.caption}</p>
                <div class="feed-actions">
                    <button class="feed-like ${p.liked ? 'liked' : ''}" data-id="${p.id}">❤️ ${p.likes || 0}</button>
                    <button>💬 ${p.comments || 0}</button>
                    <button>📤</button>
                </div>
            </div>
        </div>
    `).join('') : '<p style="text-align:center;color:var(--text2);padding:40px">Aucun post encore. Sois le premier !</p>';
    
    // Like handlers
    $('feed').querySelectorAll('.feed-like').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            btn.classList.toggle('liked');
            toast('❤️ Post liké !');
        });
    });
}

// Feed tabs
$$('.ftab').forEach(tab => {
    tab.addEventListener('click', () => {
        $$('.ftab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderFeed(tab.dataset.feed);
    });
});

// POST CREATION
let postType = 'photo';
$$('.ptype').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.ptype').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        postType = btn.dataset.type;
        
        $('upload-zone').classList.toggle('hidden', postType === 'text');
        $('post-recipe-name').classList.toggle('hidden', postType !== 'recipe');
    });
});

$('upload-zone').addEventListener('click', () => $('post-file').click());

$('post-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
            $('post-img').src = ev.target.result;
            $('post-img').classList.add('show');
            $('upload-zone').querySelector('.upload-inner').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Tag selection
$$('.post-tags button').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('active'));
});

$('btn-post').addEventListener('click', () => {
    const caption = $('post-caption').value;
    const img = $('post-img').src;
    
    if (!caption && !img) {
        toast('Ajoute du contenu !', 'error');
        return;
    }
    
    const post = {
        id: Date.now(),
        mine: true,
        user: state.user?.username || 'Moi',
        avatar: 'https://i.pravatar.cc/44?img=33',
        img: img || null,
        caption,
        type: postType,
        likes: 0,
        comments: 0,
        time: 'À l\'instant'
    };
    
    state.posts.unshift(post);
    localStorage.setItem('yumr_posts', JSON.stringify(state.posts));
    
    // Reset form
    $('post-caption').value = '';
    $('post-img').src = '';
    $('post-img').classList.remove('show');
    $('upload-zone').querySelector('.upload-inner').style.display = 'block';
    
    showXP(25);
    toast('Post publié ! 🎉', 'success');
    
    // Switch to feed
    $$('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-tab="feed"]').classList.add('active');
    $$('.tab').forEach(t => t.classList.remove('active'));
    $('tab-feed').classList.add('active');
    
    renderFeed();
    updateStats();
});

// LEADERBOARD
function renderLeaderboard() {
    // Top 10
    let html = '<div class="lb-section"><div class="lb-section-title">🏆 TOP 10</div>';
    
    LEADERBOARD.slice(0, 10).forEach(u => {
        html += `
            <div class="lb-item ${u.rank <= 3 ? 'top3' : ''}">
                <span class="lb-rank ${u.rank === 1 ? 'gold' : u.rank === 2 ? 'silver' : u.rank === 3 ? 'bronze' : ''}">#${u.rank}</span>
                <div class="lb-av" style="background-image: url(https://i.pravatar.cc/44?img=${u.img})"></div>
                <span class="lb-name">${u.name}</span>
                <span class="lb-pts">${u.pts}</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Your position
    const myRank = 45;
    const myPts = state.xp;
    
    html += `
        <div class="lb-section">
            <div class="lb-section-title">📍 TA POSITION</div>
            <div class="lb-item">
                <span class="lb-rank">#44</span>
                <div class="lb-av" style="background-image: url(https://i.pravatar.cc/44?img=15)"></div>
                <span class="lb-name">UserAbove</span>
                <span class="lb-pts">${myPts + 50}</span>
            </div>
            <div class="lb-item me">
                <span class="lb-rank">#${myRank}</span>
                <div class="lb-av" style="background-image: url(https://i.pravatar.cc/44?img=33)"></div>
                <span class="lb-name">${state.user?.username || 'Toi'}</span>
                <span class="lb-pts">${myPts}</span>
            </div>
            <div class="lb-item">
                <span class="lb-rank">#46</span>
                <div class="lb-av" style="background-image: url(https://i.pravatar.cc/44?img=16)"></div>
                <span class="lb-name">UserBelow</span>
                <span class="lb-pts">${Math.max(0, myPts - 30)}</span>
            </div>
        </div>
    `;
    
    $('leaderboard').innerHTML = html;
    
    // Update marker position
    const position = Math.max(10, Math.min(90, 100 - (myRank / 100 * 100)));
    $('lp-marker').style.left = `${position}%`;
}

// League tabs
$$('.ltab').forEach(tab => {
    tab.addEventListener('click', () => {
        $$('.ltab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const lb = tab.dataset.lb;
        $('leaderboard').classList.toggle('hidden', lb !== 'week');
        $('league-all').classList.toggle('hidden', lb !== 'all');
    });
});

// BADGES
function renderBadges() {
    const unlocked = state.badges.filter(b => b.unlocked).length;
    $('badge-count').textContent = unlocked;
    $('badges-unlocked').textContent = `${unlocked}/${state.badges.length}`;
    
    // Preview in profile
    $('badges-scroll').innerHTML = state.badges.slice(0, 6).map(b => `
        <div class="badge-item ${b.unlocked ? '' : 'locked'}">
            <div class="badge-icon">${b.secret && !b.unlocked ? '❓' : b.emoji}</div>
            <span>${b.secret && !b.unlocked ? '???' : b.name}</span>
        </div>
    `).join('');
}

function renderBadgesGrid(filter = 'all') {
    let badges = state.badges;
    
    if (filter !== 'all') {
        badges = badges.filter(b => b.cat === filter);
    }
    
    $('badges-grid').innerHTML = badges.map(b => `
        <div class="badge-card ${b.unlocked ? '' : 'locked'} ${b.secret ? 'secret' : ''}">
            <div class="badge-card-icon">${b.secret && !b.unlocked ? '❓' : b.emoji}</div>
            <div class="badge-card-name">${b.secret && !b.unlocked ? '???' : b.name}</div>
            <div class="badge-card-desc">${b.secret && !b.unlocked ? 'Badge secret à découvrir' : b.desc}</div>
        </div>
    `).join('');
}

// Badge tabs
$$('.btab').forEach(tab => {
    tab.addEventListener('click', () => {
        $$('.btab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderBadgesGrid(tab.dataset.cat);
    });
});

// Render badges when modal opens
const badgesObserver = new MutationObserver(() => {
    if ($('m-badges').classList.contains('active')) {
        renderBadgesGrid();
    }
});
badgesObserver.observe($('m-badges'), { attributes: true, attributeFilter: ['class'] });

// Featured badges on profile
function renderFeaturedBadges() {
    const featured = state.featuredBadges.map(i => state.badges[i]).filter(Boolean);
    $('featured-badges').innerHTML = featured.map(b => `
        <div class="featured-badge" title="${b.name}">${b.emoji}</div>
    `).join('');
}

// CHALLENGES
function renderChallenges() {
    $('challenges-list').innerHTML = CHALLENGES.map(c => `
        <div class="challenge-card ${c.active ? 'active' : ''}">
            <div class="challenge-header">
                <span>${c.emoji}</span>
                <span class="challenge-xp">+${c.xp} XP</span>
            </div>
            <h3>${c.name}</h3>
            <p>${c.desc}</p>
            <div class="challenge-progress">
                <div class="challenge-progress-fill" style="width: ${(c.progress / c.goal) * 100}%"></div>
            </div>
        </div>
    `).join('');
}

// SETTINGS
$('pref-time').addEventListener('input', e => {
    $('pref-time-val').textContent = `${e.target.value} min`;
});

$$('.bopt').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.bopt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.prefs.budget = btn.dataset.val;
    });
});

$('btn-save-prefs').addEventListener('click', () => {
    toast('Préférences sauvegardées !', 'success');
    closeModal('m-prefs');
});

// Settings handlers
$('btn-clear-cache').addEventListener('click', () => {
    toast('Cache vidé !', 'success');
});

$('btn-export-data').addEventListener('click', () => {
    const data = JSON.stringify({ state }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yumr-data.json';
    a.click();
    toast('Données exportées !', 'success');
});

$('btn-delete-account').addEventListener('click', () => {
    if (confirm('Vraiment supprimer ton compte ? Cette action est irréversible.')) {
        localStorage.clear();
        location.reload();
    }
});

$('btn-logout').addEventListener('click', () => {
    if (confirm('Te déconnecter ?')) {
        localStorage.removeItem('yumr_token');
        location.reload();
    }
});

// REFERRAL
$('btn-copy-ref').addEventListener('click', () => {
    navigator.clipboard.writeText('YUMR2024');
    toast('Code copié !', 'success');
});

$('btn-share-ref').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'Rejoins Yumr !',
            text: 'Utilise mon code YUMR2024 pour rejoindre Yumr et gagner des XP bonus !',
            url: 'https://yumr.app'
        });
    } else {
        toast('Lien copié !', 'success');
    }
});

// PROFILE EDIT
$('edit-banner').addEventListener('click', () => {
    toast('Fonctionnalité bientôt disponible !');
});

$('edit-avatar').addEventListener('click', () => {
    toast('Fonctionnalité bientôt disponible !');
});

// LEVEL UP CLOSE
$('close-lv').addEventListener('click', () => $('levelup').classList.remove('show'));

// Add menu quiz styles
const menuStyle = document.createElement('style');
menuStyle.textContent = `
    .menu-quiz { padding: 20px 0; }
    .menu-quiz h2 { font-size: 22px; text-align: center; margin-bottom: 32px; }
    .menu-opts { display: flex; flex-direction: column; gap: 14px; }
    .menu-opt {
        display: flex; align-items: center; gap: 16px;
        padding: 20px; background: rgba(255,255,255,0.06);
        border: 2px solid var(--border); border-radius: var(--r);
        cursor: pointer; transition: all 0.3s;
    }
    .menu-opt:active { transform: scale(0.98); }
    .menu-opt span:first-child { font-size: 32px; }
    .menu-opt span:last-child { font-size: 16px; font-weight: 500; }
    .menu-opt:hover { border-color: var(--accent); background: rgba(255,107,53,0.1); }
`;
document.head.appendChild(menuStyle);

console.log('🍽️ Yumr V2 loaded!');

}); // END DOMContentLoaded
