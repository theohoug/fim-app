/* ============================================
   YUMR - JavaScript App Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

// ============================================
// STATE
// ============================================
const state = {
    user: null,
    token: localStorage.getItem('yumr_token'),
    isRegister: false,
    setupStep: 1,
    quizTotal: 20,
    currentQ: 0,
    answers: [],
    quizStreak: 0,
    streak: parseInt(localStorage.getItem('yumr_streak') || '1'),
    xp: parseInt(localStorage.getItem('yumr_xp') || '0'),
    level: 1,
    fridge: [],
    favorites: JSON.parse(localStorage.getItem('yumr_fav') || '[]'),
    shopping: JSON.parse(localStorage.getItem('yumr_shop') || '[]'),
    cooked: JSON.parse(localStorage.getItem('yumr_cooked') || '[]'),
    posts: [],
    badges: [],
    featuredBadges: [0, 1, 2],
    todayMenu: null,
    cookingRecipe: null,
    cookingStep: 0,
    timerInterval: null,
    timerSeconds: 0,
    timerRunning: false
};

state.level = Math.floor(state.xp / 100) + 1;

// ============================================
// DATA
// ============================================
const FOODS = {
    veggies: ['Artichaut', 'Asperge', 'Aubergine', 'Betterave', 'Brocoli', 'Carotte', 'Céleri', 'Champignon', 'Chou', 'Chou-fleur', 'Concombre', 'Courgette', 'Épinard', 'Fenouil', 'Haricot vert', 'Navet', 'Oignon', 'Poireau', 'Poivron', 'Radis', 'Salade', 'Tomate'],
    fruits: ['Abricot', 'Ananas', 'Avocat', 'Banane', 'Cerise', 'Citron', 'Fraise', 'Framboise', 'Kiwi', 'Mangue', 'Melon', 'Orange', 'Pêche', 'Poire', 'Pomme', 'Raisin'],
    proteins: ['Agneau', 'Bœuf', 'Canard', 'Porc', 'Poulet', 'Veau', 'Cabillaud', 'Crevette', 'Saumon', 'Thon'],
    dairy: ['Beurre', 'Brie', 'Camembert', 'Comté', 'Crème', 'Emmental', 'Feta', 'Lait', 'Mozzarella', 'Yaourt'],
    other: ['Ail', 'Câpres', 'Coriandre', 'Curry', 'Gingembre', 'Moutarde', 'Olive', 'Piment']
};

const QUIZ_ITEMS = [
    { name: "Pizza Margherita", emoji: "🍕", desc: "Tomate, mozzarella", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", tags: ["italien"] },
    { name: "Sushi", emoji: "🍣", desc: "Poisson cru, riz", img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", tags: ["japonais"] },
    { name: "Burger", emoji: "🍔", desc: "Bœuf, cheddar", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", tags: ["americain"] },
    { name: "Pad Thaï", emoji: "🍜", desc: "Nouilles, crevettes", img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400", tags: ["thai"] },
    { name: "Salade César", emoji: "🥗", desc: "Romaine, parmesan", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400", tags: ["healthy"] },
    { name: "Tacos", emoji: "🌮", desc: "Porc, coriandre", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", tags: ["mexicain"] },
    { name: "Ramen", emoji: "🍜", desc: "Bouillon, œuf", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", tags: ["japonais"] },
    { name: "Croissant", emoji: "🥐", desc: "Pur beurre", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", tags: ["français"] },
    { name: "Poke bowl", emoji: "🥗", desc: "Saumon, avocat", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", tags: ["healthy"] },
    { name: "Tiramisu", emoji: "🍰", desc: "Mascarpone, café", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", tags: ["dessert"] },
    { name: "Curry", emoji: "🍛", desc: "Poulet, épices", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", tags: ["indien"] },
    { name: "Carbonara", emoji: "🍝", desc: "Guanciale, œuf", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", tags: ["italien"] },
    { name: "Bibimbap", emoji: "🍚", desc: "Riz, légumes, bœuf", img: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400", tags: ["coréen"] },
    { name: "Crêpe", emoji: "🥞", desc: "Nutella, banane", img: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400", tags: ["sucré"] },
    { name: "Falafel", emoji: "🧆", desc: "Pois chiches, houmous", img: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400", tags: ["végé"] },
    { name: "Fish & Chips", emoji: "🐟", desc: "Cabillaud, frites", img: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400", tags: ["anglais"] },
    { name: "Paella", emoji: "🥘", desc: "Fruits de mer, riz", img: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400", tags: ["espagnol"] },
    { name: "Cheesecake", emoji: "🍰", desc: "Fromage, biscuit", img: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400", tags: ["dessert"] },
    { name: "Pho", emoji: "🍲", desc: "Bouillon, nouilles", img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", tags: ["vietnamien"] },
    { name: "Avocado toast", emoji: "🥑", desc: "Pain, avocat, œuf", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400", tags: ["brunch"] }
];

const RECIPES = [
    { id: 1, name: "Poulet rôti aux herbes", type: "main", time: 45, cost: "€€", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400", ingredients: ["1 poulet entier", "Thym, romarin", "50g beurre", "4 gousses d'ail"], steps: ["Préchauffer le four à 200°C", "Badigeonner le poulet de beurre et d'herbes", "Placer l'ail autour du poulet", "Enfourner 45 minutes en arrosant régulièrement", "Laisser reposer 10 min avant de servir"], stepTimers: [0, 5, 0, 45, 10], calories: 450, ratings: [4, 5, 4, 5, 5] },
    { id: 2, name: "Salade César", type: "starter", time: 15, cost: "€", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400", ingredients: ["1 laitue romaine", "50g parmesan", "Croûtons", "Sauce César"], steps: ["Laver et couper la salade", "Préparer la sauce César", "Faire griller les croûtons", "Assembler et parsemer de parmesan"], stepTimers: [0, 0, 3, 0], calories: 280, ratings: [5, 4, 5] },
    { id: 3, name: "Tiramisu classique", type: "dessert", time: 30, cost: "€€", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", ingredients: ["250g mascarpone", "3 œufs", "Café fort", "Biscuits", "Cacao"], steps: ["Préparer un café fort et laisser refroidir", "Séparer les blancs des jaunes", "Monter les blancs en neige", "Mélanger jaunes + sucre + mascarpone", "Incorporer les blancs délicatement", "Tremper les biscuits dans le café", "Alterner couches de crème et biscuits", "Saupoudrer de cacao et réfrigérer 4h"], stepTimers: [0, 0, 5, 0, 0, 0, 0, 240], calories: 420, ratings: [5, 5, 5, 4, 5] },
    { id: 4, name: "Pâtes carbonara", type: "main", time: 20, cost: "€", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", ingredients: ["400g spaghetti", "150g guanciale", "3 jaunes d'œufs", "80g pecorino"], steps: ["Cuire les pâtes al dente", "Faire revenir le guanciale", "Mélanger jaunes + pecorino", "Égoutter les pâtes et mélanger hors du feu", "Ajouter le guanciale et servir immédiatement"], stepTimers: [10, 8, 0, 0, 0], calories: 520, ratings: [5, 4, 5, 5] },
    { id: 5, name: "Buddha bowl", type: "main", time: 25, cost: "€", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", ingredients: ["150g quinoa", "Pois chiches", "1 avocat", "Légumes variés", "Sauce tahini"], steps: ["Cuire le quinoa", "Rôtir les pois chiches avec épices", "Préparer les légumes", "Faire la sauce tahini", "Assembler le bowl"], stepTimers: [15, 15, 0, 0, 0], calories: 380, ratings: [4, 5, 4] },
    { id: 6, name: "Tarte aux pommes", type: "dessert", time: 50, cost: "€", img: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400", ingredients: ["1 pâte brisée", "4 pommes", "50g sucre", "Cannelle", "Beurre"], steps: ["Préchauffer à 180°C", "Étaler la pâte dans un moule", "Éplucher et couper les pommes", "Disposer les pommes en rosace", "Saupoudrer de sucre et cannelle", "Enfourner 35-40 minutes"], stepTimers: [0, 0, 0, 0, 0, 40], calories: 320, ratings: [5, 5, 4, 5] }
];

const FRIDGE_INIT = [
    { id: 1, name: "Tomates", icon: "🍅", qty: "500g", cat: "veggies", exp: new Date(Date.now() + 5 * 86400000) },
    { id: 2, name: "Poulet", icon: "🍗", qty: "400g", cat: "meat", exp: new Date(Date.now() + 2 * 86400000) },
    { id: 3, name: "Lait", icon: "🥛", qty: "1L", cat: "dairy", exp: new Date(Date.now() + 7 * 86400000) },
    { id: 4, name: "Œufs", icon: "🥚", qty: "6", cat: "other", exp: new Date(Date.now() + 14 * 86400000) },
    { id: 5, name: "Pommes", icon: "🍎", qty: "4", cat: "fruits", exp: new Date(Date.now() + 10 * 86400000) }
];

const LEADERBOARD = [
    { rank: 1, name: "MasterChef_", pts: 2450, img: 1 },
    { rank: 2, name: "CookingQueen", pts: 2280, img: 2 },
    { rank: 3, name: "FoodieKing", pts: 2150, img: 3 },
    { rank: 4, name: "ChefAlex", pts: 1980, img: 4 },
    { rank: 5, name: "TastyBites", pts: 1850, img: 5 },
    { rank: 6, name: "Moi", pts: 1420, img: 33, me: true }
];

const BADGES = [
    { id: 0, name: "Premier plat", emoji: "🍳", desc: "Cuisine ta première recette", cat: "cooking", unlocked: false },
    { id: 1, name: "Chef débutant", emoji: "👨‍🍳", desc: "Cuisine 5 recettes", cat: "cooking", unlocked: false },
    { id: 2, name: "Cordon bleu", emoji: "🎖️", desc: "Cuisine 25 recettes", cat: "cooking", unlocked: false },
    { id: 3, name: "Influenceur", emoji: "📸", desc: "Publie 10 posts", cat: "social", unlocked: false },
    { id: 4, name: "Populaire", emoji: "❤️", desc: "50 likes", cat: "social", unlocked: false },
    { id: 5, name: "Niveau 5", emoji: "5️⃣", desc: "Atteins niveau 5", cat: "progress", unlocked: false },
    { id: 6, name: "Streak 7", emoji: "🔥", desc: "7 jours de streak", cat: "progress", unlocked: false },
    { id: 7, name: "Noctambule", emoji: "🌙", desc: "Cuisine après minuit", cat: "secret", unlocked: false },
    { id: 8, name: "Photographe", emoji: "📷", desc: "Prends 10 photos", cat: "secret", unlocked: false }
];

state.badges = BADGES;

const POSTS = [
    { id: 1, user: "ChefAlex", avatar: "https://i.pravatar.cc/36?img=4", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", caption: "Mon poke bowl 🥗 #healthy", likes: 42, time: "2h" },
    { id: 2, user: "FoodieKing", avatar: "https://i.pravatar.cc/36?img=3", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", caption: "Pizza maison 🍕", likes: 87, time: "5h" },
    { id: 3, user: "CookingQueen", avatar: "https://i.pravatar.cc/36?img=2", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", caption: "Dessert du dimanche 🍰", likes: 156, time: "1j" }
];

state.posts = POSTS;

const PROFILES = [
    { name: "L'Italien", emoji: "🍝", desc: "Saveurs méditerranéennes", tags: ["Pasta", "Fromage"] },
    { name: "L'Aventurier", emoji: "🌶️", desc: "Nouvelles saveurs", tags: ["Épicé", "Exotique"] },
    { name: "Le Healthy", emoji: "🥗", desc: "Alimentation saine", tags: ["Healthy", "Léger"] },
    { name: "Le Gourmand", emoji: "🍰", desc: "Fan de desserts", tags: ["Sucré", "Gourmand"] }
];

// ============================================
// HELPERS
// ============================================
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const show = el => { if (el) el.classList.add('active'); };
const hide = el => { if (el) el.classList.remove('active'); };
const showScreen = id => { $$('.screen').forEach(s => hide(s)); show($(id)); };

function openModal(id) {
    show($(id));
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    hide($(id));
    document.body.style.overflow = '';
}

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
    if ($('h-xp')) $('h-xp').textContent = state.xp;
    if ($('h-streak')) $('h-streak').textContent = state.streak;
    if ($('s-level')) $('s-level').textContent = state.level;
    if ($('s-streak')) $('s-streak').textContent = state.streak;
    if ($('s-recipes')) $('s-recipes').textContent = state.cooked.length;
    if ($('s-badges')) $('s-badges').textContent = state.badges.filter(b => b.unlocked).length;
    if ($('p-lv')) $('p-lv').textContent = state.level;
    if ($('xp-lv')) $('xp-lv').textContent = state.level;
    if ($('ps-xp')) $('ps-xp').textContent = state.xp;
    const xpMod = state.xp % 100;
    if ($('xp-fill')) $('xp-fill').style.width = `${xpMod}%`;
    if ($('xp-cur')) $('xp-cur').textContent = xpMod;
    if ($('cooked-count')) $('cooked-count').textContent = state.cooked.length;
}

function getAvgRating(r) {
    if (!r.ratings || !r.ratings.length) return 0;
    return (r.ratings.reduce((a, b) => a + b, 0) / r.ratings.length).toFixed(1);
}

// ============================================
// INIT
// ============================================
if (state.token) {
    state.user = JSON.parse(localStorage.getItem('yumr_user') || '{}');
    setTimeout(() => initMainApp(), 2000);
} else {
    setTimeout(() => showScreen('onboarding'), 2000);
}

// ============================================
// ONBOARDING
// ============================================
let obSlide = 0;

$('ob-next').onclick = () => {
    obSlide++;
    if (obSlide >= 3) {
        showScreen('quiz-choice');
    } else {
        $$('.ob-slide').forEach((s, i) => s.classList.toggle('active', i === obSlide));
        $$('.ob-dots .dot').forEach((d, i) => d.classList.toggle('active', i === obSlide));
    }
};

$('ob-login').onclick = () => {
    state.isRegister = false;
    showScreen('auth');
    updateAuthUI();
};

// ============================================
// QUIZ CHOICE
// ============================================
$$('.qc-opt').forEach(o => {
    o.onclick = () => {
        $$('.qc-opt').forEach(x => x.classList.remove('selected'));
        o.classList.add('selected');
        state.quizTotal = parseInt(o.dataset.count);
    };
});

$('qc-start').onclick = () => startQuiz();
$('qc-back').onclick = () => showScreen('onboarding');

// ============================================
// AUTH
// ============================================
function updateAuthUI() {
    $('auth-title').textContent = state.isRegister ? 'Créer un compte' : 'Connexion';
    $('field-username').classList.toggle('hidden', !state.isRegister);
    $('auth-switch-text').textContent = state.isRegister ? 'Déjà un compte ?' : 'Pas de compte ?';
    $('auth-toggle').textContent = state.isRegister ? 'Se connecter' : "S'inscrire";
}

$('auth-toggle').onclick = () => {
    state.isRegister = !state.isRegister;
    updateAuthUI();
};

$('auth-back').onclick = () => showScreen(state.profile ? 'result' : 'onboarding');

$('auth-form').onsubmit = e => {
    e.preventDefault();
    const email = $('in-email').value;
    const pass = $('in-pass').value;
    const username = $('in-username').value;
    
    if (!email || !pass) {
        $('auth-error').textContent = 'Remplis tous les champs';
        return;
    }
    
    state.user = { username: username || email.split('@')[0], email };
    localStorage.setItem('yumr_user', JSON.stringify(state.user));
    
    if (state.isRegister) {
        showScreen('setup');
    } else {
        state.token = 'ok';
        localStorage.setItem('yumr_token', state.token);
        initMainApp();
    }
};

// ============================================
// SETUP
// ============================================
function updateSetupSteps() {
    $$('.step').forEach((s, i) => s.classList.toggle('active', i < state.setupStep));
    $$('.setup-page').forEach((p, i) => p.classList.toggle('active', i === state.setupStep - 1));
}

function renderDislikeSection() {
    let html = '';
    Object.entries(FOODS).forEach(([key, items]) => {
        const icons = { veggies: '🥬', fruits: '🍎', proteins: '🥩', dairy: '🧀', other: '🌶️' };
        const names = { veggies: 'Légumes', fruits: 'Fruits', proteins: 'Viandes/Poissons', dairy: 'Produits laitiers', other: 'Autres' };
        html += `<div class="dislike-section">
            <div class="dislike-header">
                <h4>${icons[key]} ${names[key]}</h4>
                <button class="select-all" data-group="${key}">Tout</button>
            </div>
            <div class="chip-wrap">${items.map(i => `<label class="chip-opt"><input type="checkbox" value="${i}"><span>${i}</span></label>`).join('')}</div>
        </div>`;
    });
    $('dislike-container').innerHTML = html;
    
    $$('.select-all').forEach(btn => {
        btn.onclick = () => {
            const checks = btn.closest('.dislike-section').querySelectorAll('input');
            const all = [...checks].every(c => c.checked);
            checks.forEach(c => c.checked = !all);
        };
    });
}

renderDislikeSection();

$('dislike-search').oninput = e => {
    const v = e.target.value.toLowerCase();
    $$('.chip-wrap label').forEach(l => {
        l.style.display = l.textContent.toLowerCase().includes(v) ? '' : 'none';
    });
};

$('setup-next-1').onclick = () => { state.setupStep = 2; updateSetupSteps(); };
$('setup-back-2').onclick = () => { state.setupStep = 1; updateSetupSteps(); };
$('setup-next-2').onclick = () => { state.setupStep = 3; updateSetupSteps(); };
$('setup-back-3').onclick = () => { state.setupStep = 2; updateSetupSteps(); };
$('setup-finish').onclick = () => {
    state.token = 'ok';
    localStorage.setItem('yumr_token', state.token);
    initMainApp();
};

// ============================================
// QUIZ
// ============================================
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
    card.style.transform = '';
    
    $('card-img').style.backgroundImage = `url(${item.img})`;
    $('card-emoji').textContent = item.emoji;
    $('card-q').textContent = item.name;
    $('card-desc').textContent = item.desc;
    $('quiz-count').textContent = `${state.currentQ + 1}/${state.quizTotal}`;
    $('quiz-prog-fill').style.width = `${(state.currentQ / state.quizTotal) * 100}%`;
    $('q-streak').textContent = state.quizStreak;
}

function answerQuiz(liked) {
    const card = $('quiz-card');
    card.classList.add(liked ? 'right' : 'left');
    state.answers.push({ item: QUIZ_ITEMS[state.currentQ % QUIZ_ITEMS.length], liked });
    if (liked) state.quizStreak++;
    setTimeout(() => {
        state.currentQ++;
        loadQuestion();
    }, 300);
}

// Touch handling for quiz card
let startX = 0, currentX = 0, isDragging = false;
const quizCard = $('quiz-card');

quizCard.ontouchstart = e => {
    startX = e.touches[0].clientX;
    isDragging = true;
};

quizCard.ontouchmove = e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    quizCard.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
    quizCard.classList.toggle('hint-left', diff < -50);
    quizCard.classList.toggle('hint-right', diff > 50);
};

quizCard.ontouchend = () => {
    if (!isDragging) return;
    isDragging = false;
    const diff = currentX - startX;
    if (Math.abs(diff) > 80) {
        answerQuiz(diff > 0);
    } else {
        quizCard.style.transform = '';
        quizCard.classList.remove('hint-left', 'hint-right');
    }
};

$('btn-nope').onclick = () => answerQuiz(false);
$('btn-love').onclick = () => answerQuiz(true);
$('quiz-close').onclick = () => { if (confirm('Quitter ?')) showScreen('onboarding'); };

function finishQuiz() {
    state.profile = PROFILES[Math.floor(Math.random() * PROFILES.length)];
    showScreen('result');
    $('res-emoji').textContent = state.profile.emoji;
    $('res-title').textContent = state.profile.name;
    $('res-desc').textContent = state.profile.desc;
    $('res-tags').innerHTML = state.profile.tags.map(t => `<span>${t}</span>`).join('');
    setTimeout(() => showXP(100), 500);
}

$('res-continue').onclick = () => {
    state.isRegister = true;
    showScreen('auth');
    updateAuthUI();
};

$('res-skip').onclick = () => {
    state.user = { username: 'Invité' };
    state.token = 'guest';
    localStorage.setItem('yumr_token', state.token);
    localStorage.setItem('yumr_user', JSON.stringify(state.user));
    initMainApp();
};

// ============================================
// MAIN APP
// ============================================
function initMainApp() {
    showScreen('main');
    state.fridge = JSON.parse(localStorage.getItem('yumr_fridge')) || [...FRIDGE_INIT];
    if ($('u-name')) $('u-name').textContent = state.user?.username || 'Chef';
    if ($('p-name')) $('p-name').textContent = '@' + (state.user?.username || 'chef').toLowerCase();
    updateStats();
    renderRecipes();
    renderFeed();
    renderLeagues();
    renderBadges();
    updateFridgeCount();
}

// NAV
$$('.nav-btn[data-tab]').forEach(btn => {
    btn.onclick = () => {
        $$('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.tab').forEach(t => t.classList.remove('active'));
        $(`tab-${btn.dataset.tab}`).classList.add('active');
    };
});

// MODALS
$$('[data-modal]').forEach(btn => {
    btn.onclick = () => {
        openModal(btn.dataset.modal);
        initModal(btn.dataset.modal);
    };
});

$$('[data-close]').forEach(btn => {
    btn.onclick = () => closeModal(btn.dataset.close);
});

$$('.modal-bg').forEach(bg => {
    bg.onclick = () => {
        const modal = bg.closest('.modal');
        if (modal) closeModal(modal.id);
    };
});

$('close-lv').onclick = () => $('levelup').classList.remove('show');
$('h-streak-btn').onclick = () => toast(`🔥 ${state.streak} jour(s) de streak !`);
$('h-xp-btn').onclick = () => toast(`⭐ ${state.xp} XP - Niveau ${state.level}`);

function initModal(id) {
    if (id === 'm-fridge') renderFridge();
    if (id === 'm-shopping') renderShopping();
    if (id === 'm-badges') renderBadgesModal();
    if (id === 'm-menu') renderMenuOptions();
    if (id === 'm-cooked') renderCooked();
    if (id === 'm-premium') renderPremium();
    if (id === 'm-referral') renderReferral();
    if (id === 'm-challenges') renderChallenges();
}

// ============================================
// FRIDGE
// ============================================
function updateFridgeCount() {
    $('fridge-count').textContent = state.fridge.length;
}

function renderFridge() {
    const cats = [
        { id: 'all', n: 'Tout' },
        { id: 'fruits', n: '🍎' },
        { id: 'veggies', n: '🥬' },
        { id: 'meat', n: '🥩' },
        { id: 'dairy', n: '🧀' },
        { id: 'other', n: '📦' }
    ];
    
    $('fridge-content').innerHTML = `
        <div class="fridge-acts">
            <button class="fridge-act"><span>📸</span><span>Snap Frigo</span><span class="ai-tag">IA</span></button>
            <button class="fridge-act"><span>🧾</span><span>Scanner ticket</span><span class="ai-tag">IA</span></button>
        </div>
        <div class="fridge-cats">${cats.map((c, i) => `<button class="fcat ${i === 0 ? 'active' : ''}" data-cat="${c.id}">${c.n}</button>`).join('')}</div>
        <div class="fridge-list" id="fridge-items"></div>
    `;
    
    renderFridgeItems('all');
    
    $$('.fcat').forEach(c => {
        c.onclick = () => {
            $$('.fcat').forEach(x => x.classList.remove('active'));
            c.classList.add('active');
            renderFridgeItems(c.dataset.cat);
        };
    });
}

function renderFridgeItems(cat) {
    const items = cat === 'all' ? state.fridge : state.fridge.filter(i => i.cat === cat);
    $('fridge-items').innerHTML = items.length ? items.map(i => {
        const days = Math.ceil((new Date(i.exp) - Date.now()) / 86400000);
        const cls = days <= 2 ? 'bad' : days <= 5 ? 'warn' : 'ok';
        return `<div class="fridge-item">
            <span class="fridge-item-icon">${i.icon}</span>
            <div class="fridge-item-info">
                <div class="fridge-item-name">${i.name}</div>
                <div class="fridge-item-qty">${i.qty}</div>
            </div>
            <span class="fridge-item-exp ${cls}">${days}j</span>
            <button class="fridge-item-del" onclick="removeFridgeItem(${i.id})">🗑️</button>
        </div>`;
    }).join('') : '<p style="text-align:center;color:var(--text3);padding:20px">Aucun aliment</p>';
}

window.removeFridgeItem = id => {
    state.fridge = state.fridge.filter(i => i.id !== id);
    localStorage.setItem('yumr_fridge', JSON.stringify(state.fridge));
    renderFridgeItems('all');
    updateFridgeCount();
};

$('btn-add-item').onclick = () => {
    openModal('m-add-item');
    $('add-item-form').innerHTML = `
        <input type="text" id="new-name" class="input-field" placeholder="Nom" style="margin-bottom:10px">
        <input type="text" id="new-qty" class="input-field" placeholder="Quantité" style="margin-bottom:10px">
        <select id="new-cat" class="input-field" style="margin-bottom:10px">
            <option value="fruits">🍎 Fruits</option>
            <option value="veggies">🥬 Légumes</option>
            <option value="meat">🥩 Viandes</option>
            <option value="dairy">🧀 Laitiers</option>
            <option value="other">📦 Autres</option>
        </select>
        <button class="btn btn-primary btn-full" onclick="addFridgeItem()">Ajouter</button>
    `;
};

window.addFridgeItem = () => {
    const name = $('new-name').value;
    if (!name) return;
    const icons = { fruits: '🍎', veggies: '🥬', meat: '🥩', dairy: '🧀', other: '📦' };
    const cat = $('new-cat').value;
    state.fridge.push({
        id: Date.now(),
        name,
        icon: icons[cat],
        qty: $('new-qty').value || '1',
        cat,
        exp: new Date(Date.now() + 7 * 86400000)
    });
    localStorage.setItem('yumr_fridge', JSON.stringify(state.fridge));
    closeModal('m-add-item');
    renderFridge();
    updateFridgeCount();
    toast('Ajouté !', 'success');
};

// ============================================
// SHOPPING
// ============================================
function renderShopping() {
    $('shop-content').innerHTML = `
        <div style="display:flex;gap:8px;margin-bottom:12px">
            <input type="text" id="new-shop" class="input-field" placeholder="Ajouter...">
            <button class="btn btn-primary" onclick="addShopItem()">+</button>
        </div>
        <div id="shop-list">${state.shopping.map((s, i) => `
            <div class="fridge-item">
                <input type="checkbox" ${s.done ? 'checked' : ''} onchange="toggleShop(${i})" style="width:18px;height:18px">
                <span style="flex:1;${s.done ? 'text-decoration:line-through;opacity:.5' : ''}">${s.name}</span>
                <button class="fridge-item-del" onclick="removeShop(${i})">🗑️</button>
            </div>
        `).join('') || '<p style="text-align:center;color:var(--text3)">Liste vide</p>'}</div>
    `;
}

window.addShopItem = () => {
    const v = $('new-shop').value;
    if (!v) return;
    state.shopping.push({ name: v, done: false });
    localStorage.setItem('yumr_shop', JSON.stringify(state.shopping));
    renderShopping();
};

window.toggleShop = i => {
    state.shopping[i].done = !state.shopping[i].done;
    localStorage.setItem('yumr_shop', JSON.stringify(state.shopping));
    renderShopping();
};

window.removeShop = i => {
    state.shopping.splice(i, 1);
    localStorage.setItem('yumr_shop', JSON.stringify(state.shopping));
    renderShopping();
};

// ============================================
// COOKED
// ============================================
function renderCooked() {
    $('cooked-content').innerHTML = state.cooked.length ? state.cooked.map(c => `
        <div class="cooked-item">
            <div class="cooked-img" style="background-image:url(${c.img})"></div>
            <div class="cooked-info">
                <h4>${c.name}</h4>
                <p>${c.date}</p>
                <div class="cooked-stars">${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)}</div>
            </div>
        </div>
    `).join('') : '<p style="text-align:center;color:var(--text3);padding:20px">Aucune recette cuisinée</p>';
}

// ============================================
// RECIPES
// ============================================
function renderRecipes(filter = 'all', search = '') {
    let list = RECIPES;
    if (filter !== 'all') list = list.filter(r => r.type === filter);
    if (search) list = list.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    
    $('recipes').innerHTML = list.map(r => {
        const avg = getAvgRating(r);
        return `<div class="recipe-card" onclick="openRecipe(${r.id})">
            <div class="recipe-img" style="background-image:url(${r.img})">
                <button class="recipe-save" onclick="event.stopPropagation();toggleFav(${r.id})">${state.favorites.includes(r.id) ? '❤️' : '🤍'}</button>
            </div>
            <div class="recipe-body">
                <p class="recipe-name">${r.name}</p>
                <p class="recipe-meta">
                    <span>⏱️ ${r.time}min</span>
                    ${avg > 0 ? `<span class="recipe-rating">★ ${avg}</span>` : ''}
                </p>
            </div>
        </div>`;
    }).join('');
}

window.toggleFav = id => {
    if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(f => f !== id);
    } else {
        state.favorites.push(id);
    }
    localStorage.setItem('yumr_fav', JSON.stringify(state.favorites));
    renderRecipes();
};

$$('.filter').forEach(f => {
    f.onclick = () => {
        $$('.filter').forEach(x => x.classList.remove('active'));
        f.classList.add('active');
        renderRecipes(f.dataset.cat, $('search-in').value);
    };
});

$('search-in').oninput = e => renderRecipes(document.querySelector('.filter.active')?.dataset.cat || 'all', e.target.value);

window.openRecipe = id => {
    const r = RECIPES.find(x => x.id === id);
    if (!r) return;
    
    const avg = getAvgRating(r);
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'm-recipe-view';
    modal.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-sheet" style="max-height:90vh">
            <div class="modal-handle"></div>
            <div style="height:150px;background-size:cover;background-position:center;border-radius:var(--r);margin-bottom:12px;background-image:url(${r.img})"></div>
            <h2>${r.name}</h2>
            <div style="display:flex;gap:12px;margin:10px 0;font-size:12px;color:var(--text2)">
                <span>⏱️ ${r.time} min</span>
                <span>💰 ${r.cost}</span>
                <span>🔥 ${r.calories} kcal</span>
                ${avg > 0 ? `<span style="color:var(--gold)">★ ${avg}</span>` : ''}
            </div>
            <h4 style="margin:12px 0 8px">Ingrédients</h4>
            <ul style="font-size:13px;padding-left:16px;color:var(--text2)">${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            <button class="btn btn-primary btn-full" style="margin-top:16px" onclick="startCooking(${r.id})">🍳 Cuisiner (+50 XP)</button>
        </div>
    `;
    modal.querySelector('.modal-bg').onclick = () => modal.remove();
    document.body.appendChild(modal);
};

// ============================================
// COOKING MODE
// ============================================
window.startCooking = id => {
    const r = RECIPES.find(x => x.id === id);
    if (!r) return;
    
    document.querySelector('#m-recipe-view')?.remove();
    state.cookingRecipe = r;
    state.cookingStep = 0;
    state.timerSeconds = 0;
    state.timerRunning = false;
    
    $('cook-mode').classList.add('active');
    $('cook-title').textContent = r.name;
    renderCookStep();
};

function renderCookStep() {
    const r = state.cookingRecipe;
    const step = state.cookingStep;
    
    $('cook-progress').innerHTML = r.steps.map((_, i) => `<div class="cook-step-dot ${i < step ? 'done' : i === step ? 'active' : ''}"></div>`).join('');
    
    const timer = r.stepTimers[step] || 0;
    state.timerSeconds = timer * 60;
    
    $('cook-content').innerHTML = `
        <div class="cook-step-num">Étape ${step + 1}/${r.steps.length}</div>
        <div class="cook-step-text">${r.steps[step]}</div>
        ${timer > 0 ? `
            <div class="cook-timer">
                <div class="cook-timer-display" id="timer-display">${formatTime(state.timerSeconds)}</div>
                <div class="cook-timer-label">Timer: ${timer} min</div>
                <div class="cook-timer-btns">
                    <button class="cook-timer-btn play" id="timer-play">▶</button>
                    <button class="cook-timer-btn reset" id="timer-reset">↺</button>
                </div>
            </div>
        ` : ''}
    `;
    
    if (timer > 0) {
        $('timer-play').onclick = toggleTimer;
        $('timer-reset').onclick = () => {
            clearInterval(state.timerInterval);
            state.timerRunning = false;
            state.timerSeconds = timer * 60;
            $('timer-display').textContent = formatTime(state.timerSeconds);
            $('timer-play').textContent = '▶';
            $('timer-play').classList.remove('pause');
            $('timer-play').classList.add('play');
        };
    }
    
    $('cook-prev').style.visibility = step === 0 ? 'hidden' : 'visible';
    $('cook-next').textContent = step === r.steps.length - 1 ? 'Terminer ✓' : 'Suivant →';
}

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function toggleTimer() {
    if (state.timerRunning) {
        clearInterval(state.timerInterval);
        state.timerRunning = false;
        $('timer-play').textContent = '▶';
        $('timer-play').classList.remove('pause');
        $('timer-play').classList.add('play');
    } else {
        state.timerRunning = true;
        $('timer-play').textContent = '⏸';
        $('timer-play').classList.remove('play');
        $('timer-play').classList.add('pause');
        state.timerInterval = setInterval(() => {
            state.timerSeconds--;
            $('timer-display').textContent = formatTime(state.timerSeconds);
            if (state.timerSeconds <= 0) {
                clearInterval(state.timerInterval);
                state.timerRunning = false;
                toast('⏰ Timer terminé !');
                $('timer-play').textContent = '▶';
            }
        }, 1000);
    }
}

$('cook-prev').onclick = () => {
    if (state.cookingStep > 0) {
        state.cookingStep--;
        renderCookStep();
    }
};

$('cook-next').onclick = () => {
    if (state.cookingStep < state.cookingRecipe.steps.length - 1) {
        state.cookingStep++;
        if (Math.random() > 0.5) {
            showPhotoPopup();
        } else {
            renderCookStep();
        }
    } else {
        finishCooking();
    }
};

function showPhotoPopup() {
    $('photo-popup').classList.add('active');
}

$('photo-yes').onclick = () => {
    $('photo-popup').classList.remove('active');
    showXP(10);
    toast('📸 Photo simulée !', 'success');
    renderCookStep();
};

$('photo-no').onclick = () => {
    $('photo-popup').classList.remove('active');
    renderCookStep();
};

function finishCooking() {
    $('cook-mode').classList.remove('active');
    clearInterval(state.timerInterval);
    
    openModal('m-rating');
    $('rating-content').innerHTML = `
        <div class="rating-modal">
            <h3>🎉 Bravo !</h3>
            <p>Comment était "${state.cookingRecipe.name}" ?</p>
            <div class="rating-stars" id="rating-stars">
                ${[1, 2, 3, 4, 5].map(i => `<span class="rating-star" data-val="${i}">★</span>`).join('')}
            </div>
            <button class="btn btn-primary btn-full" id="submit-rating">Valider</button>
        </div>
    `;
    
    let selectedRating = 5;
    $$('#rating-stars .rating-star').forEach(s => {
        s.onclick = () => {
            selectedRating = parseInt(s.dataset.val);
            $$('#rating-stars .rating-star').forEach((x, i) => x.classList.toggle('active', i < selectedRating));
        };
    });
    $$('#rating-stars .rating-star').forEach((x, i) => x.classList.toggle('active', i < 5));
    
    $('submit-rating').onclick = () => {
        state.cooked.push({
            id: state.cookingRecipe.id,
            name: state.cookingRecipe.name,
            img: state.cookingRecipe.img,
            rating: selectedRating,
            date: new Date().toLocaleDateString('fr-FR')
        });
        localStorage.setItem('yumr_cooked', JSON.stringify(state.cooked));
        state.cookingRecipe.ratings.push(selectedRating);
        state.badges[0].unlocked = true;
        closeModal('m-rating');
        showXP(50);
        toast('Recette ajoutée !', 'success');
        updateStats();
        renderRecipes();
    };
}

$('cook-exit').onclick = $('cook-home').onclick = () => {
    if (confirm('Quitter la recette ?')) {
        $('cook-mode').classList.remove('active');
        clearInterval(state.timerInterval);
    }
};

// ============================================
// MENU
// ============================================
$('btn-gen-menu').onclick = () => {
    openModal('m-menu');
    renderMenuOptions();
};

function renderMenuOptions() {
    $('menu-content').innerHTML = `
        <div class="menu-opt">
            <div class="menu-opt-label"><span>🍽️</span><strong>Repas</strong></div>
            <div class="menu-chips">
                <button class="menu-chip active" data-v="dejeuner">Déjeuner</button>
                <button class="menu-chip" data-v="diner">Dîner</button>
            </div>
        </div>
        <div class="menu-opt">
            <div class="menu-opt-label"><span>🥗</span><strong>Entrée</strong></div>
            <div class="menu-chips">
                <button class="menu-chip active">Oui</button>
                <button class="menu-chip">Non</button>
            </div>
        </div>
        <div class="menu-opt">
            <div class="menu-opt-label"><span>🍝</span><strong>Plat</strong></div>
            <div class="menu-chips">
                <button class="menu-chip active">Oui</button>
                <button class="menu-chip">Non</button>
            </div>
        </div>
        <div class="menu-opt">
            <div class="menu-opt-label"><span>🍰</span><strong>Dessert</strong></div>
            <div class="menu-chips">
                <button class="menu-chip">Oui</button>
                <button class="menu-chip active">Non</button>
            </div>
        </div>
        <div class="menu-opt">
            <div class="menu-opt-label"><span>💰</span><strong>Budget</strong></div>
            <div class="menu-chips">
                <button class="menu-chip">€</button>
                <button class="menu-chip active">€€</button>
                <button class="menu-chip">€€€</button>
            </div>
        </div>
        <div class="menu-opt">
            <div class="menu-opt-label"><span>⏱️</span><strong>Temps</strong></div>
            <div class="menu-chips">
                <button class="menu-chip">15min</button>
                <button class="menu-chip active">30min</button>
                <button class="menu-chip">1h+</button>
            </div>
        </div>
        <button class="btn btn-primary btn-full" style="margin-top:16px" id="btn-menu-go">Générer le menu 🚀</button>
    `;
    
    $$('.menu-chip').forEach(c => {
        c.onclick = () => {
            c.parentElement.querySelectorAll('.menu-chip').forEach(x => x.classList.remove('active'));
            c.classList.add('active');
        };
    });
    
    $('btn-menu-go').onclick = generateMenu;
}

function generateMenu() {
    const starter = RECIPES.find(r => r.type === 'starter');
    const main = RECIPES.filter(r => r.type === 'main')[Math.floor(Math.random() * RECIPES.filter(r => r.type === 'main').length)];
    const dessert = RECIPES.find(r => r.type === 'dessert');
    
    state.todayMenu = { starter, main, dessert };
    state.menuAlternatives = { main: RECIPES.filter(r => r.type === 'main').slice(0, 4) };
    
    $('menu-content').innerHTML = `
        <div style="text-align:center;margin-bottom:16px">
            <span style="font-size:40px">🎉</span>
            <h3>Menu prêt !</h3>
        </div>
        ${[{ l: 'Entrée', r: starter }, { l: 'Plat', r: main }, { l: 'Dessert', r: dessert }].map(({ l, r }) => `
            <div class="daily-item" onclick="openRecipe(${r.id})">
                <div class="daily-item-img" style="background-image:url(${r.img})"></div>
                <div class="daily-item-info">
                    <span class="daily-item-type">${l}</span>
                    <span class="daily-item-name">${r.name}</span>
                </div>
            </div>
        `).join('')}
        <button class="btn btn-glass btn-full" style="margin-top:12px" id="btn-alts">🔄 Voir 4 alternatives</button>
        <button class="btn btn-primary btn-full" style="margin-top:8px" id="btn-use-menu">Utiliser ce menu</button>
    `;
    
    $('btn-alts').onclick = showAlternatives;
    $('btn-use-menu').onclick = () => {
        closeModal('m-menu');
        renderDailyPreview();
        toast('Menu défini !', 'success');
    };
}

function showAlternatives() {
    const alts = state.menuAlternatives.main;
    $('menu-content').innerHTML = `
        <h3 style="margin-bottom:12px">Choisis ton plat</h3>
        <div class="alt-grid">
            ${alts.map(r => `
                <div class="alt-card ${state.todayMenu.main.id === r.id ? 'selected' : ''}" onclick="selectAlt(${r.id})">
                    <div class="alt-img" style="background-image:url(${r.img})"></div>
                    <div class="alt-info">
                        <h4>${r.name}</h4>
                        <p>⏱️ ${r.time}min</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="btn btn-primary btn-full" style="margin-top:16px" onclick="confirmAlt()">Valider</button>
    `;
}

window.selectAlt = id => {
    state.todayMenu.main = RECIPES.find(r => r.id === id);
    $$('.alt-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.alt-card[onclick="selectAlt(${id})"]`)?.classList.add('selected');
};

window.confirmAlt = () => {
    closeModal('m-menu');
    renderDailyPreview();
    toast('Menu mis à jour !', 'success');
};

function renderDailyPreview() {
    if (!state.todayMenu) return;
    $('daily-preview').innerHTML = [
        { l: 'Entrée', r: state.todayMenu.starter },
        { l: 'Plat', r: state.todayMenu.main },
        { l: 'Dessert', r: state.todayMenu.dessert }
    ].map(({ l, r }) => `
        <div class="daily-item">
            <div class="daily-item-img" style="background-image:url(${r.img})"></div>
            <div class="daily-item-info">
                <span class="daily-item-type">${l}</span>
                <span class="daily-item-name">${r.name}</span>
            </div>
            <button class="btn btn-sm btn-primary" onclick="startCooking(${r.id})">Cuisiner</button>
        </div>
    `).join('');
}

// ============================================
// LEAGUES
// ============================================
function renderLeagues() {
    $('league-content').innerHTML = LEADERBOARD.map((p, i) => `
        <div class="lb-item ${p.me ? 'me' : ''}">
            <span class="lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i < 3 ? ['🥇', '🥈', '🥉'][i] : p.rank}</span>
            <div class="lb-av" style="background-image:url(https://i.pravatar.cc/36?img=${p.img})"></div>
            <span class="lb-name">${p.name}</span>
            <span class="lb-pts">${p.pts} pts</span>
        </div>
    `).join('');
}

$$('.ltab').forEach(t => {
    t.onclick = () => {
        $$('.ltab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        if (t.dataset.lb === 'all') {
            $('league-content').innerHTML = [
                { e: '💎', n: 'Master', s: 'Top 1%' },
                { e: '💠', n: 'Diamant', s: 'Top 5%' },
                { e: '🏅', n: 'Platine', s: 'Top 15%' },
                { e: '🥇', n: 'Or', s: 'Top 30%' },
                { e: '🥈', n: 'Argent', s: 'Top 50%' },
                { e: '🥉', n: 'Bronze', s: 'Actuel', cur: true }
            ].map(t => `
                <div class="tier ${t.cur ? 'current' : ''}">
                    <span>${t.e}</span>
                    <span>${t.n}</span>
                    <small>${t.s}</small>
                </div>
            `).join('');
        } else {
            renderLeagues();
        }
    };
});

// ============================================
// FEED
// ============================================
function renderFeed() {
    $('feed').innerHTML = state.posts.map(p => `
        <div class="feed-post">
            <div class="feed-header">
                <div class="feed-av" style="background-image:url(${p.avatar})"></div>
                <div class="feed-user">
                    <strong>${p.user}</strong>
                    <span>${p.time}</span>
                </div>
            </div>
            <div class="feed-img" style="background-image:url(${p.img})"></div>
            <div class="feed-content">
                <div class="feed-actions">
                    <button class="${p.liked ? 'liked' : ''}" onclick="likePost(${p.id})">❤️ ${p.likes}</button>
                    <button>💬 0</button>
                </div>
                <p><strong>${p.user}</strong> ${p.caption}</p>
            </div>
        </div>
    `).join('');
}

window.likePost = id => {
    const p = state.posts.find(x => x.id === id);
    if (p) {
        p.liked = !p.liked;
        p.likes += (p.liked ? 1 : -1);
        renderFeed();
        if (p.liked) showXP(2);
    }
};

// ============================================
// BADGES
// ============================================
function renderBadges() {
    const unlocked = state.badges.filter(b => b.unlocked);
    $('badges-scroll').innerHTML = unlocked.length ? unlocked.slice(0, 5).map(b => `
        <div class="badge-item">
            <div class="badge-icon">${b.emoji}</div>
            <span>${b.name}</span>
        </div>
    `).join('') : '<p style="color:var(--text3);font-size:11px">Aucun badge</p>';
    
    $('badge-count').textContent = unlocked.length;
    $('featured-badges').innerHTML = [0, 1, 2].map(i => {
        const b = state.badges[state.featuredBadges[i]];
        return `<div class="featured-badge">${b?.unlocked ? b.emoji : '🔒'}</div>`;
    }).join('');
}

function renderBadgesModal() {
    $('badges-content').innerHTML = `
        <p class="badges-hint">Appuie sur un badge pour le mettre en avant</p>
        <div class="badges-tabs">
            <button class="btab active" data-cat="all">Tous</button>
            <button class="btab" data-cat="cooking">🍳</button>
            <button class="btab" data-cat="social">🌍</button>
            <button class="btab" data-cat="progress">📈</button>
            <button class="btab" data-cat="secret">🔮</button>
        </div>
        <div class="badges-grid" id="badges-grid-modal"></div>
    `;
    
    renderBadgeGrid('all');
    
    $$('.btab').forEach(t => {
        t.onclick = () => {
            $$('.btab').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            renderBadgeGrid(t.dataset.cat);
        };
    });
}

function renderBadgeGrid(cat) {
    const list = cat === 'all' ? state.badges : state.badges.filter(b => b.cat === cat);
    $('badges-grid-modal').innerHTML = list.map(b => `
        <div class="badge-card ${b.unlocked ? '' : 'locked'} ${state.featuredBadges.includes(b.id) ? 'selected' : ''}" onclick="selectBadge(${b.id})">
            <div class="badge-card-icon">${b.unlocked ? b.emoji : '🔒'}</div>
            <p class="badge-card-name">${b.unlocked ? b.name : '???'}</p>
            <p class="badge-card-desc">${b.desc}</p>
        </div>
    `).join('');
}

window.selectBadge = id => {
    if (!state.badges.find(b => b.id === id)?.unlocked) {
        toast('Badge non débloqué');
        return;
    }
    if (state.featuredBadges.includes(id)) {
        state.featuredBadges = state.featuredBadges.filter(x => x !== id);
    } else if (state.featuredBadges.length < 3) {
        state.featuredBadges.push(id);
    } else {
        state.featuredBadges.shift();
        state.featuredBadges.push(id);
    }
    renderBadgeGrid(document.querySelector('.btab.active')?.dataset.cat || 'all');
    renderBadges();
};

// ============================================
// PREMIUM
// ============================================
function renderPremium() {
    $('premium-content').innerHTML = `
        <div style="text-align:center;margin-bottom:20px">
            <span style="font-size:48px">👑</span>
            <h3 style="margin:12px 0;color:var(--gold)">Yumr PRO</h3>
        </div>
        ${[
            { e: '🤖', t: 'Coach IA' },
            { e: '📆', t: 'Meal Prep' },
            { e: '📊', t: 'Stats avancées' },
            { e: '🚫', t: 'Sans pub' }
        ].map(f => `
            <div style="display:flex;gap:12px;padding:12px;background:var(--glass);border-radius:var(--r);margin-bottom:8px">
                <span style="font-size:24px">${f.e}</span>
                <span style="font-size:14px">${f.t}</span>
            </div>
        `).join('')}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0">
            <div style="padding:16px;text-align:center;background:var(--glass);border:2px solid var(--border);border-radius:var(--r)">
                <small style="color:var(--text2)">Mensuel</small>
                <strong style="display:block;font-size:22px;margin:4px 0">4,99€</strong>
            </div>
            <div style="padding:16px;text-align:center;background:rgba(255,209,102,0.1);border:2px solid var(--gold);border-radius:var(--r)">
                <small style="color:var(--gold)">Annuel -40%</small>
                <strong style="display:block;font-size:22px;margin:4px 0">2,99€</strong>
            </div>
        </div>
        <button class="btn btn-primary btn-full">Essayer 7 jours gratuits</button>
    `;
}

// ============================================
// REFERRAL
// ============================================
function renderReferral() {
    const code = 'YUMR' + Math.random().toString(36).substring(2, 6).toUpperCase();
    $('referral-content').innerHTML = `
        <div style="text-align:center">
            <span style="font-size:48px">🎁</span>
            <h3 style="margin:12px 0">Parraine un ami</h3>
            <p style="color:var(--text2);margin-bottom:20px">Gagne 100 XP par ami !</p>
            <div style="background:var(--glass);padding:16px;border-radius:var(--r);margin-bottom:16px">
                <p style="font-size:11px;color:var(--text3)">Ton code</p>
                <p style="font-size:24px;font-weight:800;color:var(--accent);letter-spacing:2px">${code}</p>
            </div>
            <button class="btn btn-primary btn-full" onclick="navigator.clipboard.writeText('${code}');toast('Copié !','success')">📋 Copier</button>
        </div>
    `;
}

// ============================================
// CHALLENGES
// ============================================
function renderChallenges() {
    $('challenges-content').innerHTML = `
        <div class="challenge glass-card" style="margin-bottom:12px">
            <div class="ch-head">
                <span class="ch-tag">🔥 Aujourd'hui</span>
                <span class="ch-timer">23h</span>
            </div>
            <h3>Plat végétarien</h3>
            <p>+75 XP</p>
        </div>
        ${[
            { t: '5 recettes/semaine', p: 2, xp: 150 },
            { t: 'Publie 3 posts', p: 1, xp: 100 }
        ].map(c => `
            <div class="glass-card" style="padding:12px;margin-bottom:8px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                    <span style="font-size:13px">${c.t}</span>
                    <span style="font-size:11px;color:var(--accent)">${c.p}/5</span>
                </div>
                <div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px">
                    <div style="height:100%;width:${c.p * 20}%;background:var(--accent);border-radius:2px"></div>
                </div>
            </div>
        `).join('')}
    `;
}

// ============================================
// LOGOUT
// ============================================
$('btn-logout').onclick = () => {
    if (confirm('Déconnexion ?')) {
        localStorage.removeItem('yumr_token');
        location.reload();
    }
};

// ============================================
// GLOBAL EXPORTS
// ============================================
window.openModal = openModal;
window.closeModal = closeModal;
window.toast = toast;

});
