/* =====================================================
   FOODMATCHS V3 - PREMIUM APP
   ===================================================== */

const API_URL = 'https://foodmatchs-api-production.up.railway.app/api';

// Food images from Unsplash
const FOOD_IMAGES = {
    starter: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    main: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
    cheese: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=300&fit=crop',
    wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
    default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop'
};

const QUIZ_IMAGES = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop', // Pizza
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop', // Pancakes
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=250&fit=crop', // Salad
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=250&fit=crop', // Cake
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=250&fit=crop', // Pasta
    'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=400&h=250&fit=crop', // Sushi
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=250&fit=crop', // Burger
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=250&fit=crop', // Croissant
    'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=250&fit=crop', // Tacos
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=250&fit=crop', // Steak
];

// State
const state = {
    user: null,
    token: null,
    questionCount: 30,
    diet: 'omnivore',
    allergies: [],
    questions: [],
    answers: [],
    currentQuestion: 0,
    calculatedProfile: null,
    recipes: [],
    favorites: JSON.parse(localStorage.getItem('fm_favorites') || '[]'),
    fridgeItems: [],
    todayMenu: null,
    portions: 2
};

// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

async function api(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
    
    try {
        const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur');
        return data;
    } catch (err) {
        console.error('API:', err);
        throw err;
    }
}

function showScreen(id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${id}`).classList.add('active');
    window.scrollTo(0, 0);
}

function showTab(tab) {
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $$('.nav-item').forEach(b => b.classList.remove('active'));
    $(`#tab-${tab}`)?.classList.add('active');
    $(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
    
    if (tab === 'explore') loadRecipes();
    if (tab === 'favorites') loadFavorites();
    if (tab === 'fridge') loadFridge();
}

function showModal(id) { $(`#${id}`).classList.add('active'); }
function hideModal(id) { $(`#${id}`).classList.remove('active'); }

function toast(msg, type = '') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    $('#toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

function getRecipeImage(recipe) {
    if (recipe.image_url) return recipe.image_url;
    return FOOD_IMAGES[recipe.type] || FOOD_IMAGES.default;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    checkAuth();
});

function checkAuth() {
    const token = localStorage.getItem('fm_token');
    const user = localStorage.getItem('fm_user');
    
    if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        loadMainApp();
    } else {
        showScreen('welcome-screen');
    }
}

// Event Listeners
function initEventListeners() {
    // Welcome
    $('#start-quiz-btn').onclick = () => showScreen('quiz-setup-screen');
    $('#already-account-btn').onclick = () => showScreen('login-screen');
    
    // Login
    $('#login-back-btn').onclick = () => showScreen('welcome-screen');
    $('#login-form').onsubmit = handleLogin;
    
    // Quiz Setup
    $('#quiz-setup-back-btn').onclick = () => showScreen('welcome-screen');
    
    $$('input[name="question-count"]').forEach(input => {
        input.onchange = () => state.questionCount = parseInt(input.value);
    });
    
    $$('input[name="diet"]').forEach(input => {
        input.onchange = () => state.diet = input.value;
    });
    
    $$('.allergy-chips input').forEach(input => {
        input.onchange = () => {
            state.allergies = Array.from($$('.allergy-chips input:checked')).map(c => c.value);
        };
    });
    
    $('#start-quiz-questions-btn').onclick = startQuiz;
    
    // Quiz
    $('#quiz-back-btn').onclick = () => {
        if (confirm('Quitter le quiz ?')) showScreen('quiz-setup-screen');
    };
    $('#quiz-btn-no').onclick = () => answerQuestion(false);
    $('#quiz-btn-yes').onclick = () => answerQuestion(true);
    
    // Result
    $('#create-account-btn').onclick = () => {
        if (state.calculatedProfile) {
            $('#register-profile-name').textContent = state.calculatedProfile.name;
        }
        showScreen('register-screen');
    };
    $('#skip-account-btn').onclick = () => {
        toast('Mode invité activé');
        loadMainAppAsGuest();
    };
    
    // Register
    $('#register-back-btn').onclick = () => showScreen('result-screen');
    $('#register-form').onsubmit = handleRegister;
    
    // Navigation
    $$('.nav-item').forEach(btn => {
        btn.onclick = () => showTab(btn.dataset.tab);
    });
    
    // Home - Generate Menu
    $('#generate-menu-btn').onclick = () => showModal('menu-modal');
    
    // Menu Modal
    $$('.budget-btn').forEach(btn => {
        btn.onclick = () => {
            $$('.budget-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });
    
    $('#portions-minus').onclick = () => {
        state.portions = Math.max(1, state.portions - 1);
        $('#portions-value').textContent = state.portions;
    };
    $('#portions-plus').onclick = () => {
        state.portions = Math.min(12, state.portions + 1);
        $('#portions-value').textContent = state.portions;
    };
    
    $('#confirm-menu-btn').onclick = generateDailyMenu;
    
    // Modal closes
    $$('[data-close]').forEach(btn => {
        btn.onclick = () => hideModal(btn.dataset.close);
    });
    $$('.modal-backdrop').forEach(el => {
        el.onclick = () => el.closest('.modal').classList.remove('active');
    });
    
    // Search
    let searchTimeout;
    $('#search-input').oninput = e => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadRecipes(e.target.value), 300);
    };
    
    // Filters
    $$('.filter-chip').forEach(chip => {
        chip.onclick = () => {
            $$('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            loadRecipes('', chip.dataset.filter);
        };
    });
    
    // Fridge
    $('#add-ingredient-btn').onclick = () => showModal('ingredient-modal');
    $('#save-ingredient-btn').onclick = saveIngredient;
    
    // Profile
    $('#avatar-edit-btn').onclick = () => $('#avatar-input').click();
    $('#avatar-input').onchange = handleAvatarUpload;
    $('#menu-preferences').onclick = () => openPreferences();
    $('#menu-achievements').onclick = () => openAchievements();
    $('#view-achievements-btn').onclick = () => openAchievements();
    $('#menu-logout').onclick = logout;
    $('#save-preferences-btn').onclick = savePreferences;
}

// Auth
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
        localStorage.setItem('fm_token', data.token);
        localStorage.setItem('fm_user', JSON.stringify(data.user));
        loadMainApp();
    } catch (err) {
        const el = $('#login-error');
        el.textContent = err.message;
        el.classList.add('visible');
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
        localStorage.setItem('fm_token', data.token);
        localStorage.setItem('fm_user', JSON.stringify(data.user));
        
        // Save quiz answers
        if (state.answers.length > 0) {
            try {
                await api('/quiz/submit', {
                    method: 'POST',
                    body: JSON.stringify({ answers: state.answers })
                });
            } catch (err) { console.error(err); }
        }
        
        // Save preferences
        try {
            await api('/auth/preferences', {
                method: 'PUT',
                body: JSON.stringify({
                    diet: state.diet,
                    allergens: JSON.stringify(state.allergies)
                })
            });
        } catch (err) { console.error(err); }
        
        toast('Compte créé !', 'success');
        loadMainApp();
    } catch (err) {
        const el = $('#register-error');
        el.textContent = err.message;
        el.classList.add('visible');
    }
}

function logout() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('fm_token');
    localStorage.removeItem('fm_user');
    showScreen('welcome-screen');
}

// Quiz
async function startQuiz() {
    try {
        const questions = await api(`/quiz/questions?count=${state.questionCount}`);
        state.questions = questions;
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
    card.classList.remove('swipe-left', 'swipe-right');
    
    const imgUrl = QUIZ_IMAGES[state.currentQuestion % QUIZ_IMAGES.length];
    $('#quiz-card-image').style.backgroundImage = `url(${imgUrl})`;
    $('#quiz-emoji').textContent = q.emoji || '🍽️';
    $('#quiz-question').textContent = q.question;
    
    const progress = ((state.currentQuestion + 1) / state.questions.length) * 100;
    $('#quiz-progress-fill').style.width = `${progress}%`;
    $('#quiz-count').textContent = `${state.currentQuestion + 1}/${state.questions.length}`;
}

function answerQuestion(liked) {
    const q = state.questions[state.currentQuestion];
    state.answers.push({ question_id: q.id, liked });
    
    const card = $('#quiz-card');
    card.classList.add(liked ? 'swipe-right' : 'swipe-left');
    
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
    $('#result-tags').innerHTML = traits.map(t => `<span class="tag">${t.trim()}</span>`).join('');
}

// Main App
async function loadMainApp() {
    showScreen('main-app');
    showTab('home');
    
    try {
        const userData = await api('/auth/me');
        state.user = userData;
        updateUserUI();
    } catch (err) {
        logout();
        return;
    }
    
    checkDailyMenu();
    loadStats();
}

function loadMainAppAsGuest() {
    showScreen('main-app');
    showTab('home');
    state.user = { username: 'Invité' };
    updateUserUI();
}

function updateUserUI() {
    $('#home-username').textContent = state.user.username || 'Chef';
    $('#header-streak').textContent = state.user.current_streak || 0;
    $('#stat-level').textContent = state.user.level || 1;
    $('#stat-xp').textContent = state.user.total_xp || 0;
    $('#stat-streak').textContent = state.user.current_streak || 0;
    
    $('#profile-username').textContent = `@${state.user.username || 'user'}`;
    $('#profile-followers').textContent = state.user.followers_count || 0;
    $('#profile-following').textContent = state.user.following_count || 0;
    $('#profile-saved').textContent = state.favorites.length;
    
    if (state.user.avatar_url) {
        $('#avatar-img').src = state.user.avatar_url;
    }
    
    // Culinary profile
    const cp = state.user.culinary_profile || state.calculatedProfile;
    if (cp) {
        $('#profile-culinary').innerHTML = `
            <div class="profile-culinary-emoji">${cp.emoji || '🍳'}</div>
            <div class="profile-culinary-info">
                <h3>${cp.name || 'Gourmet'}</h3>
                <p>${cp.description || ''}</p>
            </div>
        `;
        $('#profile-culinary').classList.remove('hidden');
    }
}

async function loadStats() {
    if (!state.token) return;
    try {
        const stats = await api('/gamification/stats');
        $('#stat-level').textContent = stats.level || 1;
        $('#stat-xp').textContent = stats.total_xp || 0;
        $('#stat-streak').textContent = stats.current_streak || 0;
        $('#stat-achievements').textContent = stats.achievements_unlocked || 0;
        $('#header-streak').textContent = stats.current_streak || 0;
    } catch (err) { console.error(err); }
}

// Daily Menu
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
    
    const budget = $('.budget-btn.active')?.dataset.budget || 'medium';
    const includeCheese = $('#option-cheese').checked;
    const includeWine = $('#option-wine').checked;
    
    try {
        const data = await api('/quiz/daily', {
            method: 'POST',
            body: JSON.stringify({
                budget,
                servings: state.portions,
                include_cheese: includeCheese,
                include_wine: includeWine
            })
        });
        
        state.todayMenu = data.menu;
        hideModal('menu-modal');
        displayTodayMenu();
        
        toast(`+${data.xp_gained} XP ! Streak: ${data.streak} 🔥`, 'success');
        $('#header-streak').textContent = data.streak;
        $('#stat-streak').textContent = data.streak;
    } catch (err) {
        toast(err.message || 'Erreur', 'error');
    }
}

function displayTodayMenu() {
    $('#daily-banner').classList.add('hidden');
    $('#today-menu').classList.remove('hidden');
    
    const typeLabels = { starter: 'Entrée', main: 'Plat', dessert: 'Dessert', cheese: 'Fromage', wine: 'Vin' };
    const items = [];
    
    ['starter', 'main', 'dessert', 'cheese', 'wine'].forEach(type => {
        const meal = state.todayMenu[type];
        if (meal) items.push({ type, label: typeLabels[type], meal });
    });
    
    $('#menu-list').innerHTML = items.map(item => `
        <div class="menu-item" onclick="openRecipe('${item.meal.id}')">
            <div class="menu-item-image" style="background-image:url(${getRecipeImage(item.meal)})"></div>
            <div class="menu-item-info">
                <span class="menu-item-type">${item.label}</span>
                <span class="menu-item-name">${item.meal.name}</span>
            </div>
            <span class="menu-item-arrow">→</span>
        </div>
    `).join('');
}

// Recipes
async function loadRecipes(search = '', filter = 'all') {
    try {
        let endpoint = '/meals?limit=50';
        if (search) endpoint += `&search=${encodeURIComponent(search)}`;
        if (filter && filter !== 'all') endpoint += `&type=${filter}`;
        
        const data = await api(endpoint);
        state.recipes = data.meals || [];
        displayRecipes();
    } catch (err) { console.error(err); }
}

function displayRecipes() {
    if (!state.recipes.length) {
        $('#recipes-grid').innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🔍</div><h3>Aucun résultat</h3></div>';
        return;
    }
    
    $('#recipes-grid').innerHTML = state.recipes.map(r => {
        const isFav = state.favorites.includes(r.id);
        return `
            <div class="recipe-card">
                <div class="recipe-card-image" style="background-image:url(${getRecipeImage(r)})" onclick="openRecipe('${r.id}')">
                    <button class="recipe-card-fav ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${r.id}')">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="recipe-card-body" onclick="openRecipe('${r.id}')">
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

// Favorites
function toggleFavorite(id) {
    const idx = state.favorites.indexOf(id);
    if (idx > -1) {
        state.favorites.splice(idx, 1);
        toast('Retiré des favoris');
    } else {
        state.favorites.push(id);
        toast('Ajouté aux favoris !', 'success');
    }
    localStorage.setItem('fm_favorites', JSON.stringify(state.favorites));
    
    // Save to server if logged in
    if (state.token) {
        api(`/meals/${id}/${idx > -1 ? 'unsave' : 'save'}`, { method: idx > -1 ? 'DELETE' : 'POST' }).catch(() => {});
    }
    
    // Refresh current view
    if ($('#tab-explore').classList.contains('active')) displayRecipes();
    if ($('#tab-favorites').classList.contains('active')) loadFavorites();
    
    $('#profile-saved').textContent = state.favorites.length;
}

async function loadFavorites() {
    if (!state.favorites.length) {
        $('#favorites-grid').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <h3>Aucun favori</h3>
                <p>Explore les recettes et ajoute tes préférées</p>
            </div>
        `;
        return;
    }
    
    // Filter recipes that are in favorites
    const favRecipes = state.recipes.filter(r => state.favorites.includes(r.id));
    
    if (!favRecipes.length) {
        // Load from server
        try {
            const data = await api('/meals/user/saved');
            if (data.meals?.length) {
                displayFavorites(data.meals);
                return;
            }
        } catch (err) {}
        
        // Fallback: load all recipes first
        await loadRecipes();
        const loaded = state.recipes.filter(r => state.favorites.includes(r.id));
        displayFavorites(loaded);
    } else {
        displayFavorites(favRecipes);
    }
}

function displayFavorites(recipes) {
    if (!recipes.length) {
        $('#favorites-grid').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <h3>Aucun favori</h3>
                <p>Explore les recettes et ajoute tes préférées</p>
            </div>
        `;
        return;
    }
    
    $('#favorites-grid').innerHTML = recipes.map(r => `
        <div class="recipe-card">
            <div class="recipe-card-image" style="background-image:url(${getRecipeImage(r)})" onclick="openRecipe('${r.id}')">
                <button class="recipe-card-fav active" onclick="event.stopPropagation(); toggleFavorite('${r.id}')">❤️</button>
            </div>
            <div class="recipe-card-body" onclick="openRecipe('${r.id}')">
                <div class="recipe-card-name">${r.name}</div>
                <div class="recipe-card-meta">
                    <span>⏱️ ${(r.prep_time || 0) + (r.cook_time || 0)}min</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Recipe Detail
async function openRecipe(id) {
    try {
        const recipe = await api(`/meals/${id}`);
        const isFav = state.favorites.includes(id);
        
        const typeLabels = { starter: 'Entrée', main: 'Plat', dessert: 'Dessert', cheese: 'Fromage', wine: 'Vin' };
        const diffLabels = ['', 'Facile', 'Moyen', 'Difficile', 'Expert'];
        
        const ingredients = recipe.ingredients || [];
        const steps = recipe.recipe?.steps || [];
        
        $('#recipe-page').innerHTML = `
            <button class="recipe-back" onclick="hideModal('recipe-modal')">←</button>
            <button class="recipe-save ${isFav ? 'active' : ''}" onclick="toggleFavorite('${id}')">${isFav ? '❤️' : '🤍'}</button>
            <div class="recipe-hero" style="background-image:url(${getRecipeImage(recipe)})"></div>
            <div class="recipe-content">
                <span class="recipe-type-badge">${typeLabels[recipe.type] || recipe.type}</span>
                <h1 class="recipe-title">${recipe.name}</h1>
                <p class="recipe-description">${recipe.description || ''}</p>
                
                <div class="recipe-meta">
                    <div class="recipe-meta-item">⏱️ ${(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</div>
                    <div class="recipe-meta-item">👨‍🍳 ${diffLabels[recipe.difficulty] || 'Moyen'}</div>
                    <div class="recipe-meta-item">💰 ${'€'.repeat(recipe.budget === 'low' ? 1 : recipe.budget === 'high' ? 3 : 2)}</div>
                    ${recipe.calories ? `<div class="recipe-meta-item">🔥 ${recipe.calories} kcal</div>` : ''}
                </div>
                
                ${ingredients.length ? `
                <div class="recipe-section">
                    <h3>🥕 Ingrédients</h3>
                    <ul>${ingredients.map(i => `<li><strong>${i.name}</strong> - ${i.qty}</li>`).join('')}</ul>
                </div>
                ` : ''}
                
                ${steps.length ? `
                <div class="recipe-section">
                    <h3>👨‍🍳 Préparation</h3>
                    <ol>${steps.map(s => `<li>${s}</li>`).join('')}</ol>
                </div>
                ` : ''}
                
                ${recipe.wine_pairing ? `
                <div class="recipe-section">
                    <h3>🍷 Accord vin</h3>
                    <p>${recipe.wine_pairing}</p>
                </div>
                ` : ''}
            </div>
        `;
        
        showModal('recipe-modal');
    } catch (err) {
        toast('Erreur chargement', 'error');
    }
}

// Fridge
async function loadFridge() {
    if (!state.token) {
        $('#fridge-list').innerHTML = '<div class="empty-state"><div class="empty-icon">🔒</div><h3>Connecte-toi</h3><p>Cette fonctionnalité nécessite un compte</p></div>';
        return;
    }
    
    try {
        const items = await api('/fridge');
        state.fridgeItems = items;
        displayFridge();
    } catch (err) {
        console.error(err);
        $('#fridge-list').innerHTML = '<div class="empty-state"><div class="empty-icon">🧊</div><h3>Frigo vide</h3></div>';
    }
}

function displayFridge() {
    if (!state.fridgeItems.length) {
        $('#fridge-list').innerHTML = '<div class="empty-state"><div class="empty-icon">🧊</div><h3>Frigo vide</h3><p>Ajoute des ingrédients</p></div>';
        $('#fridge-suggestions').classList.add('hidden');
        return;
    }
    
    $('#fridge-list').innerHTML = state.fridgeItems.map(item => {
        let statusClass = 'ok';
        let statusText = '';
        if (item.days_until_expiry !== undefined) {
            if (item.days_until_expiry < 0) {
                statusClass = 'expired';
                statusText = 'Périmé';
            } else if (item.days_until_expiry <= 3) {
                statusClass = 'warning';
                statusText = `${item.days_until_expiry}j`;
            } else {
                statusText = `${item.days_until_expiry}j`;
            }
        }
        
        return `
            <div class="fridge-item">
                <span class="fridge-item-icon">🥕</span>
                <div class="fridge-item-info">
                    <div class="fridge-item-name">${item.name}</div>
                    <div class="fridge-item-qty">${item.quantity} ${item.unit}</div>
                </div>
                ${statusText ? `<span class="fridge-item-expiry ${statusClass}">${statusText}</span>` : ''}
                <button class="fridge-item-delete" onclick="deleteFridgeItem('${item.id}')">🗑️</button>
            </div>
        `;
    }).join('');
    
    loadFridgeSuggestions();
}

async function loadFridgeSuggestions() {
    try {
        const data = await api('/fridge/recipes/suggestions');
        if (data.recipes?.length) {
            $('#fridge-suggestions').classList.remove('hidden');
            $('#suggestions-list').innerHTML = data.recipes.slice(0, 5).map(r => `
                <div class="menu-item" onclick="openRecipe('${r.id}')">
                    <div class="menu-item-image" style="background-image:url(${getRecipeImage(r)})"></div>
                    <div class="menu-item-info">
                        <span class="menu-item-type">${r.match_percent}% match</span>
                        <span class="menu-item-name">${r.name}</span>
                    </div>
                    <span class="menu-item-arrow">→</span>
                </div>
            `).join('');
        }
    } catch (err) {}
}

async function saveIngredient() {
    const name = $('#ingredient-name').value.trim();
    if (!name) { toast('Nom requis', 'error'); return; }
    
    try {
        await api('/fridge', {
            method: 'POST',
            body: JSON.stringify({
                name,
                quantity: $('#ingredient-qty').value || 1,
                unit: $('#ingredient-unit').value,
                expiry_date: $('#ingredient-expiry').value || null
            })
        });
        
        hideModal('ingredient-modal');
        $('#ingredient-name').value = '';
        $('#ingredient-qty').value = '1';
        $('#ingredient-expiry').value = '';
        
        toast('Ajouté !', 'success');
        loadFridge();
    } catch (err) {
        toast(err.message, 'error');
    }
}

async function deleteFridgeItem(id) {
    try {
        await api(`/fridge/${id}`, { method: 'DELETE' });
        loadFridge();
    } catch (err) {
        toast('Erreur', 'error');
    }
}

// Achievements
async function openAchievements() {
    showModal('achievements-modal');
    
    try {
        const [all, mine] = await Promise.all([
            api('/gamification/achievements'),
            api('/gamification/achievements/me')
        ]);
        
        const unlockedIds = new Set(mine.map(a => a.achievement_id));
        
        $('#achievements-grid').innerHTML = all.map(a => `
            <div class="achievement-card ${unlockedIds.has(a.id) ? '' : 'locked'}">
                <div class="achievement-icon">${a.icon || '🏆'}</div>
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-desc">${a.description || ''}</div>
            </div>
        `).join('');
    } catch (err) {
        $('#achievements-grid').innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray-500);">Erreur chargement</p>';
    }
}

// Preferences
function openPreferences() {
    showModal('preferences-modal');
    
    $('#preferences-content').innerHTML = `
        <div class="pref-section">
            <h3>Régime alimentaire</h3>
            <div class="diet-cards">
                <label class="diet-card">
                    <input type="radio" name="pref-diet" value="omnivore" ${state.user.diet === 'omnivore' || !state.user.diet ? 'checked' : ''}>
                    <div class="diet-card-content"><span class="diet-icon">🥩</span><span>Omnivore</span></div>
                </label>
                <label class="diet-card">
                    <input type="radio" name="pref-diet" value="vegetarian" ${state.user.diet === 'vegetarian' ? 'checked' : ''}>
                    <div class="diet-card-content"><span class="diet-icon">🥬</span><span>Végétarien</span></div>
                </label>
                <label class="diet-card">
                    <input type="radio" name="pref-diet" value="vegan" ${state.user.diet === 'vegan' ? 'checked' : ''}>
                    <div class="diet-card-content"><span class="diet-icon">🌱</span><span>Vegan</span></div>
                </label>
            </div>
        </div>
        <div class="pref-section">
            <h3>Allergies</h3>
            <div class="allergy-chips">
                <label class="chip"><input type="checkbox" value="gluten" ${state.user.allergens?.includes('gluten') ? 'checked' : ''}><span>🌾 Sans gluten</span></label>
                <label class="chip"><input type="checkbox" value="lactose" ${state.user.allergens?.includes('lactose') ? 'checked' : ''}><span>🥛 Sans lactose</span></label>
                <label class="chip"><input type="checkbox" value="nuts" ${state.user.allergens?.includes('nuts') ? 'checked' : ''}><span>🥜 Sans arachides</span></label>
                <label class="chip"><input type="checkbox" value="seafood" ${state.user.allergens?.includes('seafood') ? 'checked' : ''}><span>🦐 Sans fruits de mer</span></label>
            </div>
        </div>
    `;
}

async function savePreferences() {
    const diet = $('input[name="pref-diet"]:checked')?.value || 'omnivore';
    const allergens = Array.from($$('#preferences-content .allergy-chips input:checked')).map(c => c.value);
    
    try {
        await api('/auth/preferences', {
            method: 'PUT',
            body: JSON.stringify({ diet, allergens: JSON.stringify(allergens) })
        });
        
        state.user.diet = diet;
        state.user.allergens = allergens;
        
        hideModal('preferences-modal');
        toast('Préférences sauvegardées !', 'success');
    } catch (err) {
        toast(err.message, 'error');
    }
}

// Avatar
async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = e => {
        $('#avatar-img').src = e.target.result;
        toast('Photo mise à jour', 'success');
    };
    reader.readAsDataURL(file);
}

// Global functions
window.openRecipe = openRecipe;
window.toggleFavorite = toggleFavorite;
window.deleteFridgeItem = deleteFridgeItem;
window.showTab = showTab;
