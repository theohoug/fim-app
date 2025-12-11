// ===== USER DATA =====
const userData = {
    allergens: [],
    diet: 'omnivore',
    alcohol: true,
    menuType: 'full',
    extras: [],
    servings: 2,
    questionCount: 30,
    answers: [],
    profile: null,
    selectedMenu: {
        starter: null,
        main: null,
        dessert: null,
        cheeses: [],
        wines: []
    }
};

// ===== STATE =====
let currentQuestions = [];
let currentIndex = 0;
let streak = 0;

// ===== HELPERS =====
function haptic(type = 'light') {
    if ('vibrate' in navigator) {
        navigator.vibrate(type === 'light' ? 10 : type === 'success' ? [10, 50, 20] : 20);
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('visible');
    setTimeout(() => t.classList.remove('visible'), 2500);
}

function triggerConfetti() {
    const c = document.getElementById('confettiContainer');
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A855F7', '#fff'];
    for (let i = 0; i < 50; i++) {
        const el = document.createElement('div');
        el.style.cssText = `position:absolute;left:${Math.random()*100}%;width:${5+Math.random()*8}px;height:${5+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?'50%':'2px'};animation:confettiFall ${2+Math.random()*2}s ease-out forwards;animation-delay:${Math.random()*0.5}s;opacity:0;`;
        c.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }
}

// ===== NAVIGATION =====
function navigateTo(page) {
    haptic('light');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        const target = document.getElementById(page + 'Page');
        if (target) target.classList.add('active');
        if (page === 'swipe') initSwipe();
        if (page === 'results') showResults();
        if (page === 'menuSelect') initMenuSelection();
        if (page === 'shopping') initShoppingList();
    }, 50);
}

// ===== OPTIONS HANDLING =====
function toggleOption(el, type, value) {
    haptic('light');
    el.classList.toggle('selected');
    
    if (type === 'allergen') {
        const idx = userData.allergens.indexOf(value);
        if (idx > -1) userData.allergens.splice(idx, 1);
        else userData.allergens.push(value);
    } else if (type === 'extra') {
        const idx = userData.extras.indexOf(value);
        if (idx > -1) userData.extras.splice(idx, 1);
        else userData.extras.push(value);
    } else if (type === 'alcohol') {
        userData.alcohol = el.classList.contains('selected');
    }
    saveToLocal();
}

function selectSingle(el, type, value) {
    haptic('light');
    const parent = el.parentElement;
    parent.querySelectorAll('.option-card:not(.multi)').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    userData[type] = value;
    saveToLocal();
}

function changeServings(delta) {
    haptic('light');
    userData.servings = Math.max(1, Math.min(12, userData.servings + delta));
    document.getElementById('servingsValue').textContent = userData.servings;
    saveToLocal();
}

// ===== QUIZ LOGIC =====
function startQuiz() {
    haptic('medium');
    
    currentQuestions = QUESTIONS.filter(q => {
        for (const tag of q.tags) {
            if (userData.allergens.includes(tag)) return false;
            if (tag === 'meat' && (userData.diet === 'vegetarian' || userData.diet === 'vegan')) return false;
            if (tag === 'fish' && userData.diet === 'vegan') return false;
            if (tag === 'seafood' && userData.diet === 'vegan') return false;
            if (tag === 'lactose' && userData.diet === 'vegan') return false;
            if (tag === 'eggs' && userData.diet === 'vegan') return false;
            if (tag === 'alcohol' && !userData.alcohol) return false;
        }
        if (q.cat === 'Fromage' && !userData.extras.includes('cheese')) return false;
        if (q.cat === 'Vin' && !userData.extras.includes('wine')) return false;
        return true;
    });
    
    currentQuestions = currentQuestions.sort(() => Math.random() - 0.5).slice(0, parseInt(userData.questionCount));
    currentIndex = 0;
    streak = 0;
    userData.answers = [];
    
    navigateTo('swipe');
}

function initSwipe() {
    renderCards();
    updateProgress();
    document.getElementById('streakCount').textContent = '0';
}

function renderCards() {
    const stack = document.getElementById('cardStack');
    stack.innerHTML = '';
    
    for (let i = Math.min(currentIndex + 2, currentQuestions.length - 1); i >= currentIndex; i--) {
        if (i >= currentQuestions.length) continue;
        const q = currentQuestions[i];
        const card = document.createElement('div');
        card.className = 'swipe-card' + (i === currentIndex ? ' active-card' : i === currentIndex + 1 ? ' behind-1' : ' behind-2');
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${q.img}" class="card-image" draggable="false">
                <div class="card-image-overlay"></div>
            </div>
            <div class="card-content">
                <div class="badge"><span class="badge-dot"></span>${q.cat}</div>
                <h2 class="card-question">${q.q}</h2>
            </div>
            <div class="swipe-indicator like">OUI</div>
            <div class="swipe-indicator nope">NON</div>
        `;
        if (i === currentIndex) setupSwipe(card);
        stack.appendChild(card);
    }
}

function setupSwipe(card) {
    let startX = 0, currentX = 0, isDragging = false;
    
    const onStart = e => {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        card.style.transition = 'none';
    };
    
    const onMove = e => {
        if (!isDragging) return;
        currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;
        card.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
        
        const like = card.querySelector('.like'), nope = card.querySelector('.nope');
        if (diff > 50) { like.classList.add('visible'); nope.classList.remove('visible'); }
        else if (diff < -50) { nope.classList.add('visible'); like.classList.remove('visible'); }
        else { like.classList.remove('visible'); nope.classList.remove('visible'); }
    };
    
    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentX - startX;
        card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s';
        
        if (diff > 100) completeSwipe('right');
        else if (diff < -100) completeSwipe('left');
        else {
            card.style.transform = '';
            card.querySelector('.like').classList.remove('visible');
            card.querySelector('.nope').classList.remove('visible');
        }
    };
    
    card.addEventListener('touchstart', onStart, { passive: true });
    card.addEventListener('mousedown', onStart);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchend', onEnd);
    document.addEventListener('mouseup', onEnd);
}

function swipeCard(dir) {
    haptic('medium');
    const card = document.querySelector('.active-card');
    if (!card) return;
    const indicator = card.querySelector(dir === 'right' ? '.like' : '.nope');
    indicator.classList.add('visible');
    setTimeout(() => completeSwipe(dir), 150);
}

function completeSwipe(dir) {
    haptic(dir === 'right' ? 'success' : 'light');
    const card = document.querySelector('.active-card');
    const q = currentQuestions[currentIndex];
    
    userData.answers.push({ id: q.id, answer: dir === 'right' });
    
    if (dir === 'right') {
        streak++;
        document.getElementById('streakCount').textContent = streak;
    }
    
    card.style.transform = `translateX(${dir === 'right' ? 150 : -150}%) rotate(${dir === 'right' ? 30 : -30}deg)`;
    card.style.opacity = '0';
    
    currentIndex++;
    saveToLocal();
    
    setTimeout(() => {
        if (currentIndex >= currentQuestions.length) {
            navigateTo('results');
            triggerConfetti();
        } else {
            renderCards();
            updateProgress();
        }
    }, 300);
}

function updateProgress() {
    const pct = ((currentIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = `${currentIndex + 1} / ${currentQuestions.length}`;
}

// ===== RESULTS =====
function showResults() {
    const likes = userData.answers.filter(a => a.answer).map(a => a.id);
    
    let bestProfile = PROFILES[0], bestScore = 0;
    PROFILES.forEach(p => {
        const score = p.traits.filter(t => likes.includes(t)).length;
        if (score > bestScore) { bestScore = score; bestProfile = p; }
    });
    userData.profile = bestProfile;
    
    document.getElementById('profileName').textContent = bestProfile.name;
    document.getElementById('profileDesc').textContent = bestProfile.desc;
    document.getElementById('profileTags').innerHTML = bestProfile.tags.map(t => `<span class="tag">${t}</span>`).join('');
    
    generateRecommendedMenu(likes);
    saveToLocal();
}

function generateRecommendedMenu(likes) {
    const menuList = document.getElementById('menuList');
    const menu = [];
    
    const filterMeal = (meal) => {
        for (const allergen of meal.allergens || []) {
            if (userData.allergens.includes(allergen)) return false;
        }
        if (meal.tags.includes('meat') && (userData.diet === 'vegetarian' || userData.diet === 'vegan')) return false;
        if (meal.tags.includes('fish') && userData.diet === 'vegan') return false;
        return true;
    };
    
    const scoreMeal = (meal) => meal.tags.filter(t => likes.includes(t)).length;
    
    if (userData.menuType === 'full' || userData.menuType === 'starter_main') {
        const starters = MEALS.starters.filter(filterMeal).sort((a, b) => scoreMeal(b) - scoreMeal(a));
        if (starters.length > 0) { userData.selectedMenu.starter = starters[0]; menu.push({ ...starters[0], type: 'Entrée' }); }
    }
    
    const mains = MEALS.mains.filter(filterMeal).sort((a, b) => scoreMeal(b) - scoreMeal(a));
    if (mains.length > 0) { userData.selectedMenu.main = mains[0]; menu.push({ ...mains[0], type: 'Plat' }); }
    
    if (userData.menuType === 'full' || userData.menuType === 'main_dessert') {
        const desserts = MEALS.desserts.filter(filterMeal).sort((a, b) => scoreMeal(b) - scoreMeal(a));
        if (desserts.length > 0) { userData.selectedMenu.dessert = desserts[0]; menu.push({ ...desserts[0], type: 'Dessert' }); }
    }
    
    menuList.innerHTML = menu.map(m => `
        <div class="menu-item">
            <span class="menu-item-emoji">${m.emoji}</span>
            <div>
                <div class="menu-item-name">${m.name}</div>
                <div class="menu-item-desc">${m.desc}</div>
                ${userData.extras.includes('wine') && m.wine ? `<div class="menu-item-wine">🍷 ${m.wine}</div>` : ''}
            </div>
        </div>
    `).join('');
}

// ===== MENU SELECTION =====
function initMenuSelection() {
    const likes = userData.answers.filter(a => a.answer).map(a => a.id);
    
    const filterMeal = (meal) => {
        for (const allergen of meal.allergens || []) {
            if (userData.allergens.includes(allergen)) return false;
        }
        if (meal.tags.includes('meat') && (userData.diet === 'vegetarian' || userData.diet === 'vegan')) return false;
        return true;
    };
    
    const scoreMeal = (meal) => meal.tags.filter(t => likes.includes(t)).length;
    
    // Starters
    const startersContainer = document.getElementById('startersOptions');
    const startersSection = document.getElementById('startersSection');
    if (startersContainer && (userData.menuType === 'full' || userData.menuType === 'starter_main')) {
        if (startersSection) startersSection.style.display = 'block';
        const starters = MEALS.starters.filter(filterMeal).sort((a, b) => scoreMeal(b) - scoreMeal(a)).slice(0, 4);
        startersContainer.innerHTML = starters.map((s, i) => `
            <div class="menu-option ${i === 0 ? 'selected' : ''}" onclick="selectMenuItem(this, 'starter', '${s.id}')">
                <div class="menu-option-left"><span class="menu-option-emoji">${s.emoji}</span><div><div class="menu-option-name">${s.name}</div><div class="menu-option-desc">${s.desc}</div></div></div>
                <div class="menu-option-check"></div>
            </div>
        `).join('');
        if (starters.length > 0) userData.selectedMenu.starter = starters[0];
    } else if (startersSection) {
        startersSection.style.display = 'none';
    }
    
    // Mains
    const mainsContainer = document.getElementById('mainsOptions');
    if (mainsContainer) {
        const mains = MEALS.mains.filter(filterMeal).sort((a, b) => scoreMeal(b) - scoreMeal(a)).slice(0, 4);
        mainsContainer.innerHTML = mains.map((m, i) => `
            <div class="menu-option ${i === 0 ? 'selected' : ''}" onclick="selectMenuItem(this, 'main', '${m.id}')">
                <div class="menu-option-left"><span class="menu-option-emoji">${m.emoji}</span><div><div class="menu-option-name">${m.name}</div><div class="menu-option-desc">${m.desc}</div></div></div>
                <div class="menu-option-check"></div>
            </div>
        `).join('');
        if (mains.length > 0) userData.selectedMenu.main = mains[0];
    }
    
    // Desserts
    const dessertsContainer = document.getElementById('dessertsOptions');
    const dessertsSection = document.getElementById('dessertsSection');
    if (dessertsContainer && (userData.menuType === 'full' || userData.menuType === 'main_dessert')) {
        if (dessertsSection) dessertsSection.style.display = 'block';
        const desserts = MEALS.desserts.filter(filterMeal).sort((a, b) => scoreMeal(b) - scoreMeal(a)).slice(0, 4);
        dessertsContainer.innerHTML = desserts.map((d, i) => `
            <div class="menu-option ${i === 0 ? 'selected' : ''}" onclick="selectMenuItem(this, 'dessert', '${d.id}')">
                <div class="menu-option-left"><span class="menu-option-emoji">${d.emoji}</span><div><div class="menu-option-name">${d.name}</div><div class="menu-option-desc">${d.desc}</div></div></div>
                <div class="menu-option-check"></div>
            </div>
        `).join('');
        if (desserts.length > 0) userData.selectedMenu.dessert = desserts[0];
    } else if (dessertsSection) {
        dessertsSection.style.display = 'none';
    }
    
    // Cheeses
    const cheesesSection = document.getElementById('cheesesSection');
    if (cheesesSection) {
        if (userData.extras.includes('cheese') && !userData.allergens.includes('lactose')) {
            cheesesSection.style.display = 'block';
            const cheesesContainer = document.getElementById('cheesesOptions');
            cheesesContainer.innerHTML = MEALS.cheeses.map(c => `
                <div class="menu-option multi" onclick="toggleCheeseSelection(this, '${c.id}')">
                    <div class="menu-option-left"><span class="menu-option-emoji">${c.emoji}</span><div><div class="menu-option-name">${c.name}</div><div class="menu-option-desc">${c.type}</div></div></div>
                    <div class="menu-option-check"></div>
                </div>
            `).join('');
        } else {
            cheesesSection.style.display = 'none';
        }
    }
}

function selectMenuItem(el, type, id) {
    haptic('light');
    el.parentElement.querySelectorAll('.menu-option:not(.multi)').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    
    const allMeals = [...MEALS.starters, ...MEALS.mains, ...MEALS.desserts];
    const meal = allMeals.find(m => m.id === id);
    if (meal) userData.selectedMenu[type] = meal;
    saveToLocal();
}

function toggleCheeseSelection(el, id) {
    haptic('light');
    el.classList.toggle('selected');
    const cheese = MEALS.cheeses.find(c => c.id === id);
    if (!cheese) return;
    
    const idx = userData.selectedMenu.cheeses.findIndex(c => c.id === id);
    if (idx > -1) userData.selectedMenu.cheeses.splice(idx, 1);
    else userData.selectedMenu.cheeses.push(cheese);
    saveToLocal();
}

// ===== SHOPPING LIST =====
function initShoppingList() {
    const container = document.getElementById('shoppingListContent');
    if (!container) return;
    
    const ingredients = {};
    const categories = {
        'viande': { icon: '🥩', name: 'Viandes' },
        'poisson': { icon: '🐟', name: 'Poissonnerie' },
        'légumes': { icon: '🥬', name: 'Fruits & Légumes' },
        'fruits': { icon: '🍎', name: 'Fruits' },
        'fromage': { icon: '🧀', name: 'Fromagerie' },
        'crémerie': { icon: '🥛', name: 'Crémerie' },
        'boulangerie': { icon: '🥖', name: 'Boulangerie' },
        'épicerie': { icon: '🏪', name: 'Épicerie' },
        'surgelés': { icon: '❄️', name: 'Surgelés' }
    };
    
    const addIngredients = (meal) => {
        if (!meal || !meal.ingredients) return;
        meal.ingredients.forEach(ing => {
            const cat = ing.cat || 'épicerie';
            if (!ingredients[cat]) ingredients[cat] = [];
            const existing = ingredients[cat].find(i => i.name === ing.name);
            if (!existing) ingredients[cat].push({ ...ing, checked: false });
        });
    };
    
    addIngredients(userData.selectedMenu.starter);
    addIngredients(userData.selectedMenu.main);
    addIngredients(userData.selectedMenu.dessert);
    
    if (userData.selectedMenu.cheeses.length > 0) {
        if (!ingredients['fromage']) ingredients['fromage'] = [];
        userData.selectedMenu.cheeses.forEach(c => {
            ingredients['fromage'].push({ name: c.name, qty: '150g', checked: false });
        });
    }
    
    let html = `<p style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;">Pour <strong style="color:var(--accent-primary)">${userData.servings} personnes</strong></p>`;
    
    Object.keys(categories).forEach(catKey => {
        if (ingredients[catKey] && ingredients[catKey].length > 0) {
            const cat = categories[catKey];
            html += `
                <div class="shopping-section">
                    <div class="shopping-section-header">
                        <span class="shopping-section-icon">${cat.icon}</span>
                        <span class="shopping-section-title">${cat.name}</span>
                    </div>
                    ${ingredients[catKey].map(ing => `
                        <div class="shopping-item" onclick="toggleShoppingItem(this)">
                            <div class="shopping-checkbox"></div>
                            <span class="shopping-item-name">${ing.name}</span>
                            <span class="shopping-item-qty">${ing.qty}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    });
    
    container.innerHTML = html || '<p style="text-align:center;color:var(--text-secondary)">Sélectionne d\'abord ton menu</p>';
}

function toggleShoppingItem(el) {
    haptic('light');
    el.classList.toggle('checked');
    el.querySelector('.shopping-checkbox').classList.toggle('checked');
}

// ===== AUTH =====
function handleSignup() {
    const email = document.getElementById('authEmail').value;
    const pwd = document.getElementById('authPassword').value;
    
    if (!email || !pwd) { showToast('Remplis tous les champs !'); return; }
    if (!email.includes('@')) { showToast('Email invalide !'); return; }
    if (pwd.length < 6) { showToast('Min 6 caractères'); return; }
    
    const users = JSON.parse(localStorage.getItem('foodmatchs_users') || '[]');
    if (users.find(u => u.email === email)) { showToast('Email déjà utilisé !'); return; }
    
    users.push({
        email, password: pwd,
        profile: userData.profile,
        answers: userData.answers,
        allergens: userData.allergens,
        diet: userData.diet,
        extras: userData.extras,
        selectedMenu: userData.selectedMenu,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('foodmatchs_users', JSON.stringify(users));
    showToast('Compte créé ! 🎉');
    haptic('success');
    setTimeout(() => navigateTo('shopping'), 1000);
}

// ===== SHARE =====
function shareProfile() {
    haptic('medium');
    const text = `Je suis "${userData.profile?.name || 'un gourmet'}" sur FoodMatchs ! 🍽️`;
    if (navigator.share) navigator.share({ title: 'Mon profil FoodMatchs', text, url: location.href });
    else { navigator.clipboard.writeText(text + ' ' + location.href); showToast('Copié !'); }
}

// ===== STORAGE =====
function saveToLocal() { localStorage.setItem('foodmatchs_session', JSON.stringify(userData)); }
function loadFromLocal() {
    const saved = localStorage.getItem('foodmatchs_session');
    if (saved) Object.assign(userData, JSON.parse(saved));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => loadFromLocal());
