/* =====================================================
   FOODMATCHS V2 - APP.JS
   ===================================================== */

const API_URL = 'https://foodmatchs-api-production.up.railway.app/api';

// =====================================================
// STATE
// =====================================================
const state = {
    user: null,
    token: null,
    // Quiz setup
    questionCount: 30,
    diet: 'omnivore',
    allergies: [],
    // Quiz
    questions: [],
    answers: [],
    currentQuestion: 0,
    // Result
    calculatedProfile: null,
    // App data
    recipes: [],
    fridgeItems: [],
    todayMenu: null
};

// =====================================================
// HELPERS
// =====================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

async function api(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
    
    try {
        const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur serveur');
        return data;
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}

function showScreen(id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${id}`).classList.add('active');
    lucide.createIcons();
}

function showTab(tab) {
    $$('.tab-panel').forEach(t => t.classList.remove('active'));
    $$('.nav-btn').forEach(b => b.classList.remove('active'));
    $(`#tab-${tab}`).classList.add('active');
    $(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
}

function showModal(id) {
    $(`#${id}`).classList.add('active');
}

function hideModal(id) {
    $(`#${id}`).classList.remove('active');
}

function toast(message, type = 'default') {
    const container = $('#toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
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

// =====================================================
// EVENT LISTENERS
// =====================================================
function initEventListeners() {
    // Welcome screen
    $('#start-quiz-btn').addEventListener('click', () => showScreen('quiz-setup-screen'));
    $('#already-account-btn').addEventListener('click', () => showScreen('login-screen'));
    
    // Login screen
    $('#login-back-btn').addEventListener('click', () => showScreen('welcome-screen'));
    $('#login-form').addEventListener('submit', handleLogin);
    
    // Quiz setup screen
    $('#quiz-setup-back-btn').addEventListener('click', () => showScreen('welcome-screen'));
    
    // Question count options
    $$('.count-option').forEach(opt => {
        opt.addEventListener('click', () => {
            $$('.count-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            state.questionCount = parseInt(opt.dataset.count);
        });
    });
    
    // Diet options
    $$('.diet-option').forEach(opt => {
        opt.addEventListener('click', () => {
            $$('.diet-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            state.diet = opt.dataset.diet;
        });
    });
    
    // Allergy checkboxes
    $$('.allergy-checkbox input').forEach(cb => {
        cb.addEventListener('change', () => {
            state.allergies = Array.from($$('.allergy-checkbox input:checked')).map(c => c.value);
        });
    });
    
    // Start quiz button
    $('#start-quiz-questions-btn').addEventListener('click', startQuiz);
    
    // Quiz screen
    $('#quiz-back-btn').addEventListener('click', () => {
        if (confirm('Quitter le quiz ?')) showScreen('quiz-setup-screen');
    });
    $('#quiz-btn-no').addEventListener('click', () => answerQuestion(false));
    $('#quiz-btn-yes').addEventListener('click', () => answerQuestion(true));
    
    // Result screen
    $('#create-account-btn').addEventListener('click', () => {
        if (state.calculatedProfile) {
            $('#register-profile-name').textContent = state.calculatedProfile.name;
        }
        showScreen('register-screen');
    });
    $('#skip-account-btn').addEventListener('click', () => {
        // Continue without account - limited features
        toast('Mode invité - certaines fonctionnalités limitées');
        loadMainAppAsGuest();
    });
    
    // Register screen
    $('#register-back-btn').addEventListener('click', () => showScreen('result-screen'));
    $('#register-form').addEventListener('submit', handleRegister);
    
    // Main app - Navigation
    $$('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            showTab(tab);
            if (tab === 'explore') loadRecipes();
            if (tab === 'fridge') loadFridge();
        });
    });
    
    // Generate menu
    $('#generate-menu-btn').addEventListener('click', () => showModal('menu-options-modal'));
    
    // Menu options modal
    $$('.budget-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.budget-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Portions picker
    let portions = 2;
    $('.portion-btn.minus').addEventListener('click', () => {
        portions = Math.max(1, portions - 1);
        $('#portions-value').textContent = portions;
    });
    $('.portion-btn.plus').addEventListener('click', () => {
        portions = Math.min(12, portions + 1);
        $('#portions-value').textContent = portions;
    });
    
    $('#confirm-generate-btn').addEventListener('click', generateDailyMenu);
    
    // Modal close buttons
    $$('.modal-close-btn, .modal-overlay').forEach(el => {
        el.addEventListener('click', () => {
            el.closest('.modal').classList.remove('active');
        });
    });
    
    // Search recipes
    let searchTimeout;
    $('#search-recipes').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadRecipes(e.target.value), 300);
    });
    
    // Filter tabs
    $$('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadRecipes('', tab.dataset.filter);
        });
    });
    
    // Add fridge item
    $('#add-fridge-btn').addEventListener('click', () => showModal('ingredient-modal'));
    $('#save-ingredient-btn').addEventListener('click', saveIngredient);
    
    // Profile actions
    $('#avatar-edit-btn').addEventListener('click', () => $('#avatar-input').click());
    $('#avatar-input').addEventListener('change', handleAvatarUpload);
    $('#menu-logout').addEventListener('click', logout);
    
    // Recipe modal back
    $('#recipe-back-btn').addEventListener('click', () => hideModal('recipe-modal'));
}

// =====================================================
// AUTH
// =====================================================
async function handleLogin(e) {
    e.preventDefault();
    const email = $('#login-email').value;
    const password = $('#login-password').value;
    
    try {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        state.token = data.token;
        state.user = data.user;
        localStorage.setItem('fm_token', data.token);
        localStorage.setItem('fm_user', JSON.stringify(data.user));
        
        loadMainApp();
    } catch (err) {
        $('#login-error').textContent = err.message;
        $('#login-error').classList.add('visible');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = $('#register-username').value;
    const email = $('#register-email').value;
    const password = $('#register-password').value;
    
    try {
        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        state.token = data.token;
        state.user = data.user;
        localStorage.setItem('fm_token', data.token);
        localStorage.setItem('fm_user', JSON.stringify(data.user));
        
        // Save quiz answers if we have them
        if (state.answers.length > 0) {
            try {
                await api('/quiz/submit', {
                    method: 'POST',
                    body: JSON.stringify({ answers: state.answers })
                });
            } catch (err) {
                console.error('Failed to save quiz answers:', err);
            }
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
        } catch (err) {
            console.error('Failed to save preferences:', err);
        }
        
        toast('Compte créé avec succès !', 'success');
        loadMainApp();
    } catch (err) {
        $('#register-error').textContent = err.message;
        $('#register-error').classList.add('visible');
    }
}

function logout() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('fm_token');
    localStorage.removeItem('fm_user');
    showScreen('welcome-screen');
}

// =====================================================
// QUIZ
// =====================================================
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
    
    $('#quiz-card-emoji').textContent = q.emoji || '🍽️';
    $('#quiz-card-question').textContent = q.question;
    
    const progress = ((state.currentQuestion + 1) / state.questions.length) * 100;
    $('#quiz-progress-fill').style.width = `${progress}%`;
    $('#quiz-progress-text').textContent = `${state.currentQuestion + 1}/${state.questions.length}`;
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
        // Calculate profile without needing auth
        const result = await api('/quiz/calculate-profile', {
            method: 'POST',
            body: JSON.stringify({ answers: state.answers })
        });
        
        state.calculatedProfile = result.profile;
        displayResult(result.profile);
    } catch (err) {
        // Fallback to default profile
        state.calculatedProfile = {
            name: 'Gourmet',
            emoji: '🍳',
            description: 'Tu apprécies la bonne cuisine et les saveurs authentiques.',
            traits: 'Curieux, Gourmand, Aventurier'
        };
        displayResult(state.calculatedProfile);
    }
}

function displayResult(profile) {
    showScreen('result-screen');
    
    $('#result-emoji').textContent = profile.emoji || '🍳';
    $('#result-name').textContent = profile.name || 'Gourmet';
    $('#result-description').textContent = profile.description || 'Tu apprécies les bonnes choses de la vie.';
    
    const traits = (profile.traits || '').split(',').filter(t => t.trim());
    $('#result-tags').innerHTML = traits.map(t => `<span class="tag">${t.trim()}</span>`).join('');
}

// =====================================================
// MAIN APP
// =====================================================
async function loadMainApp() {
    showScreen('main-app');
    lucide.createIcons();
    
    try {
        const userData = await api('/auth/me');
        state.user = userData;
        updateUserUI();
    } catch (err) {
        logout();
        return;
    }
    
    checkDailyMenu();
    loadRecipes();
}

function loadMainAppAsGuest() {
    showScreen('main-app');
    lucide.createIcons();
    
    state.user = { username: 'Invité', level: 1, total_xp: 0 };
    updateUserUI();
    loadRecipes();
}

function updateUserUI() {
    $('#user-display-name').textContent = state.user.username || 'Chef';
    $('#streak-count').textContent = state.user.current_streak || 0;
    $('#stat-level').textContent = state.user.level || 1;
    $('#stat-xp').textContent = state.user.total_xp || 0;
    $('#stat-achievements').textContent = state.user.achievements_count || 0;
    
    // Profile tab
    $('#profile-display-name').textContent = `@${state.user.username || 'user'}`;
    $('#profile-followers').textContent = state.user.followers_count || 0;
    $('#profile-following').textContent = state.user.following_count || 0;
    
    // Avatar
    if (state.user.avatar) {
        $('#profile-avatar').innerHTML = `<img src="${state.user.avatar}" alt="Avatar">`;
    }
    
    // Culinary profile
    if (state.user.culinary_profile) {
        $('#profile-culinary').innerHTML = `
            <div style="display:flex;align-items:center;gap:14px;">
                <span style="font-size:40px;">${state.user.culinary_profile.emoji || '🍳'}</span>
                <div>
                    <div style="font-weight:700;font-size:16px;">${state.user.culinary_profile.name}</div>
                    <div style="color:var(--text-secondary);font-size:13px;">${state.user.culinary_profile.description || ''}</div>
                </div>
            </div>
        `;
    }
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
    } catch (err) {
        console.error('Error checking daily menu:', err);
    }
}

async function generateDailyMenu() {
    if (!state.token) {
        toast('Connecte-toi pour générer ton menu', 'error');
        return;
    }
    
    const budget = $('.budget-btn.active')?.dataset.budget || 'medium';
    const servings = parseInt($('#portions-value').textContent) || 2;
    const includeCheese = $('#include-cheese').checked;
    const includeWine = $('#include-wine').checked;
    
    try {
        const data = await api('/quiz/daily', {
            method: 'POST',
            body: JSON.stringify({
                budget,
                servings,
                include_cheese: includeCheese,
                include_wine: includeWine
            })
        });
        
        state.todayMenu = data.menu;
        hideModal('menu-options-modal');
        displayTodayMenu();
        
        toast(`+${data.xp_gained} XP ! Streak: ${data.streak} jours 🔥`, 'success');
        $('#streak-count').textContent = data.streak;
        
    } catch (err) {
        toast(err.message, 'error');
    }
}

function displayTodayMenu() {
    $('#daily-menu-card').classList.add('hidden');
    $('#today-menu').classList.remove('hidden');
    
    const items = [];
    const typeLabels = {
        starter: 'Entrée',
        main: 'Plat principal',
        dessert: 'Dessert',
        cheese: 'Fromage',
        wine: 'Vin'
    };
    
    ['starter', 'main', 'dessert', 'cheese', 'wine'].forEach(type => {
        const meal = state.todayMenu[type];
        if (meal) {
            items.push({ type, label: typeLabels[type], meal });
        }
    });
    
    $('#menu-items').innerHTML = items.map(item => `
        <div class="menu-item" data-id="${item.meal.id}">
            <span class="menu-item-emoji">${item.meal.emoji || '🍽️'}</span>
            <div class="menu-item-info">
                <span class="menu-item-type">${item.label}</span>
                <span class="menu-item-name">${item.meal.name}</span>
            </div>
            <i data-lucide="chevron-right"></i>
        </div>
    `).join('');
    
    lucide.createIcons();
    
    // Click handlers
    $$('.menu-item').forEach(el => {
        el.addEventListener('click', () => showRecipeDetail(el.dataset.id));
    });
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
        console.error('Error loading recipes:', err);
    }
}

function displayRecipes() {
    const grid = $('#recipes-grid');
    
    if (!state.recipes.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
            <i data-lucide="search"></i>
            <h3>Aucune recette trouvée</h3>
        </div>`;
        lucide.createIcons();
        return;
    }
    
    grid.innerHTML = state.recipes.map(r => `
        <div class="recipe-card" data-id="${r.id}">
            <div class="recipe-card-image">${r.emoji || '🍽️'}</div>
            <div class="recipe-card-content">
                <div class="recipe-card-name">${r.name}</div>
                <div class="recipe-card-meta">
                    <span>⏱️ ${(r.prep_time || 0) + (r.cook_time || 0)}min</span>
                    <span>💰 ${'€'.repeat(r.budget === 'low' ? 1 : r.budget === 'high' ? 3 : 2)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    $$('.recipe-card').forEach(card => {
        card.addEventListener('click', () => showRecipeDetail(card.dataset.id));
    });
}

async function showRecipeDetail(mealId) {
    try {
        const recipe = await api(`/meals/${mealId}`);
        
        const typeLabels = { starter: 'Entrée', main: 'Plat', dessert: 'Dessert', cheese: 'Fromage', wine: 'Vin' };
        const diffLabels = ['', 'Facile', 'Moyen', 'Difficile', 'Expert'];
        
        const ingredients = recipe.ingredients || [];
        const steps = recipe.recipe?.steps || [];
        
        $('#recipe-detail-body').innerHTML = `
            <div style="height:200px;background:linear-gradient(135deg,var(--secondary-light),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:80px;">
                ${recipe.emoji || '🍽️'}
            </div>
            <div style="padding:24px;">
                <span style="display:inline-block;background:var(--primary);color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;margin-bottom:12px;">
                    ${typeLabels[recipe.type] || recipe.type}
                </span>
                <h2 style="font-size:24px;font-weight:800;margin-bottom:8px;">${recipe.name}</h2>
                <p style="color:var(--text-secondary);margin-bottom:20px;">${recipe.description || ''}</p>
                
                <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
                    <div style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);font-size:14px;">
                        <i data-lucide="clock" style="width:18px;height:18px;"></i>
                        ${(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);font-size:14px;">
                        <i data-lucide="chef-hat" style="width:18px;height:18px;"></i>
                        ${diffLabels[recipe.difficulty] || 'Moyen'}
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);font-size:14px;">
                        <i data-lucide="euro" style="width:18px;height:18px;"></i>
                        ${'€'.repeat(recipe.budget === 'low' ? 1 : recipe.budget === 'high' ? 3 : 2)}
                    </div>
                </div>
                
                ${ingredients.length ? `
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:17px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                        <i data-lucide="carrot" style="width:20px;height:20px;color:var(--primary);"></i>
                        Ingrédients
                    </h3>
                    <ul style="list-style:none;">
                        ${ingredients.map(i => `
                            <li style="padding:10px 0;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;">
                                <span>${i.name}</span>
                                <span style="color:var(--text-secondary);">${i.qty}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${steps.length ? `
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:17px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                        <i data-lucide="list-ordered" style="width:20px;height:20px;color:var(--primary);"></i>
                        Préparation
                    </h3>
                    <ol style="padding-left:20px;">
                        ${steps.map(s => `<li style="padding:8px 0;padding-left:8px;">${s}</li>`).join('')}
                    </ol>
                </div>
                ` : ''}
            </div>
        `;
        
        showModal('recipe-modal');
        lucide.createIcons();
        
    } catch (err) {
        toast('Erreur chargement recette', 'error');
    }
}

// =====================================================
// FRIDGE
// =====================================================
async function loadFridge() {
    if (!state.token) {
        $('#fridge-content').innerHTML = `
            <div class="empty-state">
                <i data-lucide="lock"></i>
                <h3>Connecte-toi</h3>
                <p>Cette fonctionnalité nécessite un compte</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    try {
        const items = await api('/fridge');
        state.fridgeItems = items;
        displayFridge();
    } catch (err) {
        console.error('Error loading fridge:', err);
    }
}

function displayFridge() {
    if (!state.fridgeItems.length) {
        $('#fridge-content').innerHTML = `
            <div class="empty-state">
                <i data-lucide="refrigerator"></i>
                <h3>Ton frigo est vide</h3>
                <p>Ajoute des ingrédients pour recevoir des suggestions</p>
            </div>
        `;
        lucide.createIcons();
        $('#fridge-suggestions').classList.add('hidden');
        return;
    }
    
    $('#fridge-content').innerHTML = state.fridgeItems.map(item => {
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
            <div class="fridge-item" style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--white);border-radius:var(--radius-md);margin-bottom:8px;box-shadow:var(--shadow-sm);">
                <span style="font-size:28px;">🥕</span>
                <div style="flex:1;">
                    <div style="font-weight:600;">${item.name}</div>
                    <div style="font-size:13px;color:var(--text-secondary);">${item.quantity} ${item.unit}</div>
                </div>
                ${statusText ? `<span style="font-size:12px;padding:4px 10px;border-radius:var(--radius-sm);background:${statusClass === 'expired' ? '#FFEBEE' : statusClass === 'warning' ? '#FFF8E1' : '#E8F5E9'};color:${statusClass === 'expired' ? 'var(--danger)' : statusClass === 'warning' ? '#F57C00' : 'var(--success)'};">${statusText}</span>` : ''}
                <button onclick="deleteFridgeItem('${item.id}')" style="background:none;border:none;cursor:pointer;opacity:0.5;font-size:18px;">🗑️</button>
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
                <div class="recipe-card" style="margin-bottom:12px;cursor:pointer;" onclick="showRecipeDetail('${r.id}')">
                    <div class="recipe-card-content" style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:32px;">${r.emoji || '🍽️'}</span>
                        <div>
                            <div class="recipe-card-name">${r.name}</div>
                            <div class="recipe-card-meta">✅ ${r.match_percent}% d'ingrédients</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading suggestions:', err);
    }
}

async function saveIngredient() {
    const name = $('#ingredient-name').value.trim();
    if (!name) {
        toast('Nom requis', 'error');
        return;
    }
    
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
        
        toast('Ingrédient ajouté !', 'success');
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
        toast('Erreur suppression', 'error');
    }
}

// Make deleteFridgeItem available globally
window.deleteFridgeItem = deleteFridgeItem;
window.showRecipeDetail = showRecipeDetail;

// =====================================================
// AVATAR UPLOAD
// =====================================================
async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // For now, just preview locally (real upload would need backend support)
    const reader = new FileReader();
    reader.onload = (e) => {
        $('#profile-avatar').innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
        toast('Photo de profil mise à jour', 'success');
    };
    reader.readAsDataURL(file);
}
