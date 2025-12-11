/* =====================================================
   FOODMATCHS - APP.JS
   ===================================================== */

const API_URL = 'https://foodmatchs-api-production.up.railway.app/api';

// =====================================================
// STATE
// =====================================================
const state = {
    user: null,
    token: null,
    quizQuestions: [],
    quizAnswers: [],
    currentQuestionIndex: 0,
    todayMenu: null,
    recipes: [],
    fridgeItems: [],
    currentFilter: 'all'
};

// =====================================================
// HELPERS
// =====================================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

async function api(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erreur serveur');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

function showScreen(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${screenId}`).classList.add('active');
}

function showTab(tabId) {
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    $(`#tab-${tabId}`).classList.add('active');
    $(`.nav-item[data-tab="${tabId}"]`).classList.add('active');
}

function showModal(modalId) {
    $(`#${modalId}`).classList.add('active');
}

function hideModal(modalId) {
    $(`#${modalId}`).classList.remove('active');
}

function toast(message, type = 'default') {
    const container = $('#toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString('fr-FR');
}

// =====================================================
// AUTH
// =====================================================
function initAuth() {
    // Check for stored token
    const storedToken = localStorage.getItem('fm_token');
    const storedUser = localStorage.getItem('fm_user');
    
    if (storedToken && storedUser) {
        state.token = storedToken;
        state.user = JSON.parse(storedUser);
        loadMainApp();
    } else {
        setTimeout(() => showScreen('auth-screen'), 1500);
    }
}

$('#login-form').addEventListener('submit', async (e) => {
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
        
        // Check if user has profile
        checkUserProfile();
        
    } catch (error) {
        showAuthError(error.message);
    }
});

$('#register-form').addEventListener('submit', async (e) => {
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
        
        // New user, start quiz
        startQuiz();
        
    } catch (error) {
        showAuthError(error.message);
    }
});

$('#show-register').addEventListener('click', (e) => {
    e.preventDefault();
    $('#login-form').classList.remove('active');
    $('#register-form').classList.add('active');
});

$('#show-login').addEventListener('click', (e) => {
    e.preventDefault();
    $('#register-form').classList.remove('active');
    $('#login-form').classList.add('active');
});

function showAuthError(message) {
    const errorEl = $('#auth-error');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
    setTimeout(() => errorEl.classList.remove('visible'), 5000);
}

async function checkUserProfile() {
    try {
        const profile = await api('/quiz/profile');
        if (profile) {
            loadMainApp();
        } else {
            startQuiz();
        }
    } catch {
        startQuiz();
    }
}

// =====================================================
// QUIZ
// =====================================================
async function startQuiz() {
    try {
        const questions = await api('/quiz/questions?count=15');
        state.quizQuestions = questions;
        state.quizAnswers = [];
        state.currentQuestionIndex = 0;
        
        showScreen('quiz-screen');
        showQuestion();
    } catch (error) {
        toast('Erreur chargement quiz', 'error');
    }
}

function showQuestion() {
    const question = state.quizQuestions[state.currentQuestionIndex];
    if (!question) return;
    
    const card = $('#quiz-card');
    card.classList.remove('swipe-left', 'swipe-right');
    
    $('#quiz-emoji').textContent = question.emoji;
    $('#quiz-question').textContent = question.question;
    
    if (question.image) {
        $('#quiz-card-image').style.backgroundImage = `url(${question.image})`;
    } else {
        $('#quiz-card-image').style.backgroundImage = '';
    }
    
    const progress = ((state.currentQuestionIndex + 1) / state.quizQuestions.length) * 100;
    $('#quiz-progress-bar').style.width = `${progress}%`;
    $('#quiz-counter').textContent = `${state.currentQuestionIndex + 1}/${state.quizQuestions.length}`;
}

function answerQuestion(liked) {
    const question = state.quizQuestions[state.currentQuestionIndex];
    state.quizAnswers.push({
        question_id: question.id,
        liked
    });
    
    const card = $('#quiz-card');
    card.classList.add(liked ? 'swipe-right' : 'swipe-left');
    
    setTimeout(() => {
        state.currentQuestionIndex++;
        
        if (state.currentQuestionIndex >= state.quizQuestions.length) {
            submitQuiz();
        } else {
            showQuestion();
        }
    }, 300);
}

$('#quiz-yes').addEventListener('click', () => answerQuestion(true));
$('#quiz-no').addEventListener('click', () => answerQuestion(false));

async function submitQuiz() {
    try {
        const result = await api('/quiz/submit', {
            method: 'POST',
            body: JSON.stringify({ answers: state.quizAnswers })
        });
        
        showProfileResult(result);
    } catch (error) {
        toast('Erreur soumission quiz', 'error');
        loadMainApp();
    }
}

function showProfileResult(result) {
    showScreen('profile-result-screen');
    
    const profile = result.profile;
    $('#profile-emoji').textContent = profile.emoji;
    $('#profile-name').textContent = profile.name;
    $('#profile-description').textContent = profile.description;
    
    const traits = profile.traits.split(',');
    $('#profile-traits').innerHTML = traits
        .map(t => `<span class="trait">${t.trim()}</span>`)
        .join('');
}

$('#start-app').addEventListener('click', () => {
    loadMainApp();
});

// =====================================================
// MAIN APP
// =====================================================
async function loadMainApp() {
    showScreen('main-app');
    
    // Load user data
    try {
        const userData = await api('/auth/me');
        state.user = userData;
        updateUserUI();
    } catch {
        // Token might be invalid
        logout();
        return;
    }
    
    // Load initial data
    loadHomeData();
    loadRecipes();
}

function updateUserUI() {
    $('#user-name').textContent = state.user.username;
    $('#user-level').textContent = state.user.level || 1;
    $('#user-xp').textContent = state.user.total_xp || 0;
    $('#user-achievements').textContent = state.user.achievements_count || 0;
    $('#streak-count').textContent = state.user.current_streak || 0;
    
    // Profile tab
    $('#profile-username').textContent = `@${state.user.username}`;
    $('#profile-bio').textContent = state.user.bio || 'Passionné de cuisine';
    $('#profile-followers').textContent = state.user.followers_count || 0;
    $('#profile-following').textContent = state.user.following_count || 0;
}

async function loadHomeData() {
    // Check daily quiz status
    try {
        const daily = await api('/quiz/daily');
        if (daily.already_answered) {
            state.todayMenu = daily.menu;
            displayTodayMenu();
        }
    } catch (error) {
        console.error('Error loading daily:', error);
    }
}

// =====================================================
// DAILY MENU
// =====================================================
$('#start-daily-btn').addEventListener('click', () => {
    showModal('daily-modal');
});

// Budget buttons
$$('[data-budget]').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('[data-budget]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Servings picker
let servings = 2;
$$('.servings-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const delta = parseInt(btn.dataset.delta);
        servings = Math.max(1, Math.min(10, servings + delta));
        $('#servings-value').textContent = servings;
    });
});

$('#generate-menu-btn').addEventListener('click', async () => {
    const budget = $('.option-btn.active')?.dataset.budget || 'medium';
    const includeCheese = $('#include-cheese').checked;
    const includeWine = $('#include-wine').checked;
    
    try {
        const result = await api('/quiz/daily', {
            method: 'POST',
            body: JSON.stringify({
                budget,
                servings,
                include_cheese: includeCheese,
                include_wine: includeWine
            })
        });
        
        state.todayMenu = result.menu;
        hideModal('daily-modal');
        displayTodayMenu();
        
        toast(`+${result.xp_gained} XP ! Streak: ${result.streak} jours 🔥`, 'success');
        
        // Update streak display
        $('#streak-count').textContent = result.streak;
        
    } catch (error) {
        toast(error.message, 'error');
    }
});

function displayTodayMenu() {
    $('#daily-quiz-card').classList.add('hidden');
    $('#today-menu').classList.remove('hidden');
    
    const courses = [];
    
    if (state.todayMenu.starter) {
        courses.push({ type: 'Entrée', meal: state.todayMenu.starter });
    }
    if (state.todayMenu.main) {
        courses.push({ type: 'Plat', meal: state.todayMenu.main });
    }
    if (state.todayMenu.dessert) {
        courses.push({ type: 'Dessert', meal: state.todayMenu.dessert });
    }
    if (state.todayMenu.cheese) {
        courses.push({ type: 'Fromage', meal: state.todayMenu.cheese });
    }
    if (state.todayMenu.wine) {
        courses.push({ type: 'Vin', meal: state.todayMenu.wine });
    }
    
    $('#menu-courses').innerHTML = courses.map(c => `
        <div class="menu-course" data-meal-id="${c.meal.id}">
            <span class="menu-course-emoji">${c.meal.emoji}</span>
            <div class="menu-course-info">
                <span class="menu-course-type">${c.type}</span>
                <span class="menu-course-name">${c.meal.name}</span>
            </div>
            <span>→</span>
        </div>
    `).join('');
    
    // Add click handlers
    $$('.menu-course').forEach(el => {
        el.addEventListener('click', () => {
            showRecipeDetail(el.dataset.mealId);
        });
    });
}

// =====================================================
// RECIPES / EXPLORE
// =====================================================
async function loadRecipes(filter = 'all') {
    try {
        let endpoint = '/meals?limit=50';
        
        if (filter === 'vegetarian') {
            endpoint += '&vegetarian=true';
        } else if (filter !== 'all') {
            endpoint += `&type=${filter}`;
        }
        
        const data = await api(endpoint);
        state.recipes = data.meals;
        displayRecipes();
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

function displayRecipes() {
    const grid = $('#recipes-grid');
    
    if (state.recipes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <span>🍽️</span>
                <p>Aucune recette trouvée</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = state.recipes.map(recipe => `
        <div class="recipe-card" data-id="${recipe.id}">
            <div class="recipe-card-image">${recipe.emoji}</div>
            <div class="recipe-card-content">
                <div class="recipe-card-name">${recipe.name}</div>
                <div class="recipe-card-meta">
                    <span>⏱️ ${recipe.prep_time + recipe.cook_time}min</span>
                    <span>💰 ${'€'.repeat(recipe.budget === 'low' ? 1 : recipe.budget === 'high' ? 3 : 2)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    $$('.recipe-card').forEach(card => {
        card.addEventListener('click', () => {
            showRecipeDetail(card.dataset.id);
        });
    });
}

// Filter chips
$$('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        $$('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        loadRecipes(filter);
    });
});

// Search
let searchTimeout;
$('#search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            loadRecipes(state.currentFilter);
            return;
        }
        
        try {
            const data = await api(`/meals?search=${encodeURIComponent(query)}`);
            state.recipes = data.meals;
            displayRecipes();
        } catch (error) {
            console.error('Search error:', error);
        }
    }, 300);
});

// =====================================================
// RECIPE DETAIL
// =====================================================
async function showRecipeDetail(mealId) {
    try {
        const recipe = await api(`/meals/${mealId}`);
        
        $('#recipe-hero').innerHTML = `
            <button class="modal-back" data-close="recipe-modal">←</button>
            <span style="font-size: 80px;">${recipe.emoji}</span>
            <button class="recipe-save" id="recipe-save-btn">🤍</button>
        `;
        
        const typeLabels = {
            starter: 'Entrée',
            main: 'Plat',
            dessert: 'Dessert',
            cheese: 'Fromage',
            wine: 'Vin'
        };
        
        const difficultyLabels = ['', 'Facile', 'Moyen', 'Difficile', 'Expert'];
        
        $('#recipe-type-badge').textContent = typeLabels[recipe.type] || recipe.type;
        $('#recipe-title').textContent = recipe.name;
        $('#recipe-description').textContent = recipe.description;
        $('#recipe-time').textContent = `${recipe.prep_time + recipe.cook_time} min`;
        $('#recipe-difficulty').textContent = difficultyLabels[recipe.difficulty] || 'Moyen';
        $('#recipe-budget').textContent = '€'.repeat(recipe.budget === 'low' ? 1 : recipe.budget === 'high' ? 3 : 2);
        $('#recipe-calories').textContent = `${recipe.calories} kcal`;
        
        // Ingredients
        const ingredients = recipe.ingredients || [];
        $('#ingredients-list').innerHTML = ingredients.map(ing => `
            <li>
                <span>${ing.name}</span>
                <span>${ing.qty}</span>
            </li>
        `).join('');
        
        // Steps
        const steps = recipe.recipe?.steps || [];
        $('#steps-list').innerHTML = steps.map(step => `
            <li>${step}</li>
        `).join('');
        
        // Wine pairing
        if (recipe.wine_pairing) {
            $('#wine-pairing-section').classList.remove('hidden');
            $('#wine-pairing').textContent = recipe.wine_pairing;
        } else {
            $('#wine-pairing-section').classList.add('hidden');
        }
        
        showModal('recipe-modal');
        
        // Close button
        $('#recipe-modal .modal-back').addEventListener('click', () => {
            hideModal('recipe-modal');
        });
        
    } catch (error) {
        toast('Erreur chargement recette', 'error');
    }
}

// =====================================================
// SOCIAL / FEED
// =====================================================
async function loadFeed(type = 'feed') {
    try {
        const endpoint = type === 'feed' ? '/social/feed' : '/social/explore';
        const posts = await api(endpoint);
        displayPosts(posts);
    } catch (error) {
        console.error('Error loading feed:', error);
    }
}

function displayPosts(posts) {
    const feed = $('#posts-feed');
    
    if (!posts || posts.length === 0) {
        feed.innerHTML = `
            <div class="empty-state" id="feed-empty">
                <span>📭</span>
                <p>Aucun post pour le moment</p>
                <small>Suivez des utilisateurs pour voir leurs recettes</small>
            </div>
        `;
        return;
    }
    
    feed.innerHTML = posts.map(post => `
        <div class="post-card" data-id="${post.id}">
            <div class="post-header">
                <div class="post-avatar">${post.avatar || '👤'}</div>
                <div class="post-user-info">
                    <div class="post-username">@${post.username}</div>
                    <div class="post-time">${formatDate(post.created_at)}</div>
                </div>
            </div>
            ${post.image_url ? `<img class="post-image" src="${post.image_url}" alt="">` : 
              `<div class="post-image">🍽️</div>`}
            <div class="post-content">
                <p class="post-caption">${post.caption || ''}</p>
                <div class="post-actions">
                    <button class="post-action ${post.is_liked ? 'liked' : ''}" data-action="like">
                        <span>${post.is_liked ? '❤️' : '🤍'}</span>
                        <span>${post.likes_count || 0}</span>
                    </button>
                    <button class="post-action" data-action="comment">
                        <span>💬</span>
                        <span>${post.comments_count || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Social tabs
$$('.social-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        $$('.social-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadFeed(tab.dataset.social);
    });
});

// =====================================================
// FRIDGE
// =====================================================
async function loadFridge() {
    try {
        const items = await api('/fridge');
        state.fridgeItems = items;
        displayFridge();
        
        if (items.length > 0) {
            loadFridgeSuggestions();
        }
    } catch (error) {
        console.error('Error loading fridge:', error);
    }
}

function displayFridge() {
    const container = $('#fridge-items');
    
    if (state.fridgeItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state" id="fridge-empty">
                <span>🧊</span>
                <p>Ton frigo est vide</p>
                <small>Ajoute des ingrédients pour des suggestions</small>
            </div>
        `;
        $('#fridge-suggestions').classList.add('hidden');
        return;
    }
    
    container.innerHTML = state.fridgeItems.map(item => {
        let expiryClass = 'ok';
        let expiryText = '';
        
        if (item.days_until_expiry !== undefined) {
            if (item.days_until_expiry < 0) {
                expiryClass = 'danger';
                expiryText = 'Périmé';
            } else if (item.days_until_expiry <= 3) {
                expiryClass = 'warning';
                expiryText = `${item.days_until_expiry}j`;
            } else {
                expiryText = `${item.days_until_expiry}j`;
            }
        }
        
        return `
            <div class="fridge-item" data-id="${item.id}">
                <span class="fridge-item-icon">🥕</span>
                <div class="fridge-item-info">
                    <div class="fridge-item-name">${item.name}</div>
                    <div class="fridge-item-qty">${item.quantity} ${item.unit}</div>
                </div>
                ${expiryText ? `<span class="fridge-item-expiry ${expiryClass}">${expiryText}</span>` : ''}
                <button class="fridge-item-delete" data-id="${item.id}">🗑️</button>
            </div>
        `;
    }).join('');
    
    // Delete handlers
    $$('.fridge-item-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            try {
                await api(`/fridge/${id}`, { method: 'DELETE' });
                loadFridge();
                toast('Ingrédient supprimé', 'success');
            } catch (error) {
                toast('Erreur suppression', 'error');
            }
        });
    });
}

async function loadFridgeSuggestions() {
    try {
        const data = await api('/fridge/recipes/suggestions');
        if (data.recipes && data.recipes.length > 0) {
            $('#fridge-suggestions').classList.remove('hidden');
            $('#suggestions-list').innerHTML = data.recipes.slice(0, 5).map(recipe => `
                <div class="recipe-card" data-id="${recipe.id}" style="margin-bottom: 12px;">
                    <div class="recipe-card-content">
                        <div class="recipe-card-name">${recipe.emoji} ${recipe.name}</div>
                        <div class="recipe-card-meta">
                            <span>✅ ${recipe.match_percent}% ingrédients</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            $$('#suggestions-list .recipe-card').forEach(card => {
                card.addEventListener('click', () => {
                    showRecipeDetail(card.dataset.id);
                });
            });
        }
    } catch (error) {
        console.error('Error loading suggestions:', error);
    }
}

// Add ingredient
$('#add-ingredient-btn').addEventListener('click', () => {
    showModal('ingredient-modal');
});

$('#save-ingredient-btn').addEventListener('click', async () => {
    const name = $('#ingredient-name').value.trim();
    const quantity = $('#ingredient-qty').value || 1;
    const unit = $('#ingredient-unit').value;
    const expiry = $('#ingredient-expiry').value;
    
    if (!name) {
        toast('Nom requis', 'error');
        return;
    }
    
    try {
        await api('/fridge', {
            method: 'POST',
            body: JSON.stringify({
                name,
                quantity,
                unit,
                expiry_date: expiry || null
            })
        });
        
        hideModal('ingredient-modal');
        $('#ingredient-name').value = '';
        $('#ingredient-qty').value = '1';
        $('#ingredient-expiry').value = '';
        
        loadFridge();
        toast('Ingrédient ajouté !', 'success');
    } catch (error) {
        toast(error.message, 'error');
    }
});

// =====================================================
// ACHIEVEMENTS
// =====================================================
$('#achievements-btn').addEventListener('click', async () => {
    try {
        const data = await api('/gamification/achievements/me');
        
        const allAchievements = [...data.unlocked, ...data.locked.map(a => ({...a, locked: true}))];
        
        $('#achievements-grid').innerHTML = allAchievements.map(a => `
            <div class="achievement-item ${a.locked ? 'locked' : ''}">
                <span class="achievement-emoji">${a.emoji}</span>
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-xp">+${a.xp_reward} XP</div>
            </div>
        `).join('');
        
        showModal('achievements-modal');
    } catch (error) {
        toast('Erreur chargement succès', 'error');
    }
});

// =====================================================
// NAVIGATION
// =====================================================
$$('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        showTab(tab);
        
        // Load tab-specific data
        if (tab === 'social') loadFeed();
        if (tab === 'fridge') loadFridge();
        if (tab === 'explore') loadRecipes();
    });
});

// =====================================================
// MODAL CLOSE HANDLERS
// =====================================================
$$('.modal-close, .modal-back').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        if (modalId) hideModal(modalId);
    });
});

// Close modal on backdrop click
$$('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// =====================================================
// LOGOUT
// =====================================================
$('#logout-btn').addEventListener('click', () => {
    logout();
});

function logout() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('fm_token');
    localStorage.removeItem('fm_user');
    showScreen('auth-screen');
}

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});
