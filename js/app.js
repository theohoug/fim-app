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
    selectedMenu: { starter: null, main: null, dessert: null, cheeses: [] }
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

// ===== SERVINGS STEPPER =====
function changeServings(delta) {
    haptic('light');
    userData.servings = Math.max(1, Math.min(12, userData.servings + delta));
    document.getElementById('servingsValue').textContent = userData.servings;
}

// ===== QUIZ =====
function startQuiz() {
    // Filter questions based on user preferences
    currentQuestions = QUESTIONS.filter(q => {
        // Check alcohol requirement
        if (q.requires?.alcohol && !userData.alcohol) return false;
        // Check extras requirements
        if (q.requires?.extras) {
            for (const extra of q.requires.extras) {
                if (!userData.extras.includes(extra)) return false;
            }
        }
        // Check diet exclusions
        if (q.excludeDiet && q.excludeDiet.includes(userData.diet)) return false;
        return true;
    });
    
    // Shuffle and take questionCount
    currentQuestions = currentQuestions.sort(() => Math.random() - 0.5).slice(0, userData.questionCount);
    currentIndex = 0;
    streak = 0;
    userData.answers = [];
    
    navigateTo('swipe');
}

function initSwipe() {
    renderCards();
    updateProgress();
}

function renderCards() {
    const stack = document.getElementById('cardStack');
    if (!stack) return;
    stack.innerHTML = '';
    
    for (let i = Math.min(2, currentQuestions.length - currentIndex - 1); i >= 0; i--) {
        const q = currentQuestions[currentIndex + i];
        if (!q) continue;
        
        const card = document.createElement('div');
        card.className = 'swipe-card' + (i > 0 ? ` behind-${i}` : '');
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${q.image}" class="card-image" alt="">
                <div class="card-image-overlay"></div>
            </div>
            <div class="card-content">
                <div class="badge"><span class="badge-dot"></span>${q.tags[0]}</div>
                <div class="card-question">${q.emoji} ${q.question}</div>
            </div>
            <div class="swipe-indicator like">J'AIME</div>
            <div class="swipe-indicator nope">BEURK</div>
        `;
        
        if (i === 0) setupSwipe(card);
        stack.appendChild(card);
    }
}

function setupSwipe(card) {
    let startX = 0, startY = 0, currentX = 0, isDragging = false;
    
    const onStart = (e) => {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        card.style.transition = 'none';
    };
    
    const onMove = (e) => {
        if (!isDragging) return;
        const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        currentX = x - startX;
        const rotate = currentX * 0.1;
        card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
        
        const like = card.querySelector('.swipe-indicator.like');
        const nope = card.querySelector('.swipe-indicator.nope');
        const threshold = 50;
        
        if (currentX > threshold) {
            like.classList.add('visible');
            nope.classList.remove('visible');
        } else if (currentX < -threshold) {
            nope.classList.add('visible');
            like.classList.remove('visible');
        } else {
            like.classList.remove('visible');
            nope.classList.remove('visible');
        }
    };
    
    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        card.style.transition = 'transform 0.3s ease';
        
        if (Math.abs(currentX) > 100) {
            completeSwipe(currentX > 0 ? 'right' : 'left');
        } else {
            card.style.transform = '';
            card.querySelector('.swipe-indicator.like').classList.remove('visible');
            card.querySelector('.swipe-indicator.nope').classList.remove('visible');
        }
    };
    
    card.addEventListener('mousedown', onStart);
    card.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
}

function swipeCard(dir) {
    const card = document.querySelector('.swipe-card:not(.behind-1):not(.behind-2)');
    if (!card) return;
    
    haptic('light');
    card.style.transition = 'transform 0.4s ease';
    card.style.transform = `translateX(${dir === 'right' ? 400 : -400}px) rotate(${dir === 'right' ? 30 : -30}deg)`;
    
    const indicator = card.querySelector(`.swipe-indicator.${dir === 'right' ? 'like' : 'nope'}`);
    if (indicator) indicator.classList.add('visible');
    
    setTimeout(() => completeSwipe(dir), 200);
}

function completeSwipe(dir) {
    const q = currentQuestions[currentIndex];
    if (q) {
        userData.answers.push({ id: q.id, answer: dir === 'right' });
        if (dir === 'right') {
            streak++;
            if (streak >= 3) {
                document.querySelector('.streak-count')?.classList.add('animate-fire');
            }
        } else {
            streak = 0;
            document.querySelector('.streak-count')?.classList.remove('animate-fire');
        }
    }
    
    currentIndex++;
    updateProgress();
    
    if (currentIndex >= currentQuestions.length) {
        triggerConfetti();
        setTimeout(() => navigateTo('results'), 500);
    } else {
        renderCards();
    }
}

function updateProgress() {
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const streakEl = document.getElementById('streakCount');
    
    if (fill) fill.style.width = `${(currentIndex / currentQuestions.length) * 100}%`;
    if (text) text.textContent = `${currentIndex}/${currentQuestions.length}`;
    if (streakEl) streakEl.textContent = streak;
}

// ===== RESULTS =====
function showResults() {
    // Calculate profile based on answers
    const likes = userData.answers.filter(a => a.answer).map(a => {
        const q = QUESTIONS.find(q => q.id === a.id);
        return q ? q.tags : [];
    }).flat();
    
    // Score each profile
    let bestProfile = PROFILES[0];
    let bestScore = 0;
    
    PROFILES.forEach(profile => {
        const score = profile.tags.filter(tag => likes.includes(tag)).length;
        if (score > bestScore) {
            bestScore = score;
            bestProfile = profile;
        }
    });
    
    userData.profile = bestProfile;
    
    // Update UI
    document.getElementById('profileEmoji').textContent = bestProfile.emoji;
    document.getElementById('profileName').textContent = bestProfile.name;
    document.getElementById('profileDesc').textContent = bestProfile.desc;
    
    const tagsContainer = document.getElementById('profileTags');
    if (tagsContainer) {
        tagsContainer.innerHTML = bestProfile.traits.map(t => `<span class="tag">${t}</span>`).join('');
    }
    
    // Generate menu
    generateMenu(likes);
}

function generateMenu(likes) {
    const filterMeals = (meals) => {
        return meals.filter(m => {
            if (userData.diet === 'vegan' && !m.vegan) return false;
            if (userData.diet === 'vegetarian' && !m.vegetarian && !m.vegan) return false;
            return true;
        }).map(m => ({
            ...m,
            score: m.tags.filter(t => likes.includes(t)).length
        })).sort((a, b) => b.score - a.score);
    };
    
    const starters = filterMeals(MEALS.starters);
    const mains = filterMeals(MEALS.mains);
    const desserts = filterMeals(MEALS.desserts);
    
    userData.selectedMenu.starter = starters[0] || null;
    userData.selectedMenu.main = mains[0] || null;
    userData.selectedMenu.dessert = desserts[0] || null;
    
    // Update menu display
    const menuList = document.getElementById('menuList');
    if (menuList) {
        let html = '';
        if (userData.menuType === 'full' || userData.menuType === 'starter_main') {
            if (userData.selectedMenu.starter) {
                html += `<div class="menu-item"><span class="menu-item-emoji">${userData.selectedMenu.starter.emoji}</span><div><div class="menu-item-name">${userData.selectedMenu.starter.name}</div><div class="menu-item-desc">${userData.selectedMenu.starter.desc}</div></div></div>`;
            }
        }
        if (userData.selectedMenu.main) {
            html += `<div class="menu-item"><span class="menu-item-emoji">${userData.selectedMenu.main.emoji}</span><div><div class="menu-item-name">${userData.selectedMenu.main.name}</div><div class="menu-item-desc">${userData.selectedMenu.main.desc}</div></div></div>`;
        }
        if (userData.menuType === 'full' || userData.menuType === 'main_dessert') {
            if (userData.selectedMenu.dessert) {
                html += `<div class="menu-item"><span class="menu-item-emoji">${userData.selectedMenu.dessert.emoji}</span><div><div class="menu-item-name">${userData.selectedMenu.dessert.name}</div><div class="menu-item-desc">${userData.selectedMenu.dessert.desc}</div></div></div>`;
            }
        }
        menuList.innerHTML = html;
    }
}

// ===== MENU SELECTION =====
function initMenuSelection() {
    const container = document.getElementById('menuSelectContent');
    if (!container) return;
    
    const likes = userData.answers.filter(a => a.answer).map(a => {
        const q = QUESTIONS.find(q => q.id === a.id);
        return q ? q.tags : [];
    }).flat();
    
    const filterMeals = (meals) => {
        return meals.filter(m => {
            if (userData.diet === 'vegan' && !m.vegan) return false;
            if (userData.diet === 'vegetarian' && !m.vegetarian && !m.vegan) return false;
            return true;
        }).sort((a, b) => {
            const scoreA = a.tags.filter(t => likes.includes(t)).length;
            const scoreB = b.tags.filter(t => likes.includes(t)).length;
            return scoreB - scoreA;
        });
    };
    
    let html = '';
    
    // Starters
    if (userData.menuType === 'full' || userData.menuType === 'starter_main') {
        html += `<div class="menu-section"><div class="menu-section-title">🥗 Entrée</div><div class="menu-options" id="starterOptions">`;
        filterMeals(MEALS.starters).forEach(m => {
            const selected = userData.selectedMenu.starter?.id === m.id ? 'selected' : '';
            html += `<div class="menu-option ${selected}" data-type="starter" data-id="${m.id}"><div class="menu-option-left"><span class="menu-option-emoji">${m.emoji}</span><div><div class="menu-option-name">${m.name}</div><div class="menu-option-desc">${m.desc}</div></div></div><div class="menu-option-check"></div></div>`;
        });
        html += `</div></div>`;
    }
    
    // Mains
    html += `<div class="menu-section"><div class="menu-section-title">🍽️ Plat</div><div class="menu-options" id="mainOptions">`;
    filterMeals(MEALS.mains).forEach(m => {
        const selected = userData.selectedMenu.main?.id === m.id ? 'selected' : '';
        html += `<div class="menu-option ${selected}" data-type="main" data-id="${m.id}"><div class="menu-option-left"><span class="menu-option-emoji">${m.emoji}</span><div><div class="menu-option-name">${m.name}</div><div class="menu-option-desc">${m.desc}</div></div></div><div class="menu-option-check"></div></div>`;
    });
    html += `</div></div>`;
    
    // Desserts
    if (userData.menuType === 'full' || userData.menuType === 'main_dessert') {
        html += `<div class="menu-section"><div class="menu-section-title">🍰 Dessert</div><div class="menu-options" id="dessertOptions">`;
        filterMeals(MEALS.desserts).forEach(m => {
            const selected = userData.selectedMenu.dessert?.id === m.id ? 'selected' : '';
            html += `<div class="menu-option ${selected}" data-type="dessert" data-id="${m.id}"><div class="menu-option-left"><span class="menu-option-emoji">${m.emoji}</span><div><div class="menu-option-name">${m.name}</div><div class="menu-option-desc">${m.desc}</div></div></div><div class="menu-option-check"></div></div>`;
        });
        html += `</div></div>`;
    }
    
    // Cheeses
    if (userData.extras.includes('cheese')) {
        html += `<div class="menu-section"><div class="menu-section-title">🧀 Fromages</div><div class="menu-options" id="cheeseOptions">`;
        MEALS.cheeses.forEach(m => {
            const selected = userData.selectedMenu.cheeses.find(c => c.id === m.id) ? 'selected' : '';
            html += `<div class="menu-option ${selected}" data-type="cheese" data-id="${m.id}"><div class="menu-option-left"><span class="menu-option-emoji">${m.emoji}</span><div><div class="menu-option-name">${m.name}</div><div class="menu-option-desc">${m.desc}</div></div></div><div class="menu-option-check"></div></div>`;
        });
        html += `</div></div>`;
    }
    
    container.innerHTML = html;
    
    // Attach event listeners for menu options
    container.querySelectorAll('.menu-option').forEach(option => {
        option.addEventListener('click', () => {
            haptic('light');
            const type = option.dataset.type;
            const id = option.dataset.id;
            const allMeals = [...MEALS.starters, ...MEALS.mains, ...MEALS.desserts, ...MEALS.cheeses];
            const meal = allMeals.find(m => m.id === id);
            
            if (type === 'cheese') {
                option.classList.toggle('selected');
                if (option.classList.contains('selected')) {
                    userData.selectedMenu.cheeses.push(meal);
                } else {
                    userData.selectedMenu.cheeses = userData.selectedMenu.cheeses.filter(c => c.id !== id);
                }
            } else {
                option.parentElement.querySelectorAll('.menu-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                userData.selectedMenu[type] = meal;
            }
        });
    });
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
        'épicerie': { icon: '🏪', name: 'Épicerie' }
    };
    
    const addIngredients = (meal) => {
        if (!meal?.ingredients) return;
        meal.ingredients.forEach(ing => {
            const cat = ing.cat || 'épicerie';
            if (!ingredients[cat]) ingredients[cat] = [];
            if (!ingredients[cat].find(i => i.name === ing.name)) {
                ingredients[cat].push({ ...ing });
            }
        });
    };
    
    addIngredients(userData.selectedMenu.starter);
    addIngredients(userData.selectedMenu.main);
    addIngredients(userData.selectedMenu.dessert);
    
    if (userData.selectedMenu.cheeses.length > 0) {
        if (!ingredients['fromage']) ingredients['fromage'] = [];
        userData.selectedMenu.cheeses.forEach(c => {
            ingredients['fromage'].push({ name: c.name, qty: '150g' });
        });
    }
    
    let html = '';
    Object.keys(categories).forEach(catKey => {
        if (ingredients[catKey]?.length > 0) {
            const cat = categories[catKey];
            html += `<div class="shopping-section"><div class="shopping-section-header"><span class="shopping-section-icon">${cat.icon}</span><span class="shopping-section-title">${cat.name}</span></div>`;
            ingredients[catKey].forEach(ing => {
                html += `<div class="shopping-item"><div class="shopping-checkbox"></div><span class="shopping-item-name">${ing.name}</span><span class="shopping-item-qty">${ing.qty}</span></div>`;
            });
            html += `</div>`;
        }
    });
    
    container.innerHTML = html || '<p style="text-align:center;color:var(--text-secondary)">Sélectionne d\'abord ton menu</p>';
    
    // Attach event listeners for shopping items
    container.querySelectorAll('.shopping-item').forEach(item => {
        item.addEventListener('click', () => {
            haptic('light');
            item.classList.toggle('checked');
            item.querySelector('.shopping-checkbox').classList.toggle('checked');
        });
    });
}

// ===== AUTH =====
function handleSignup() {
    const email = document.getElementById('authEmail').value;
    const pwd = document.getElementById('authPassword').value;
    
    if (!email || !pwd) { showToast('Remplis tous les champs !'); return; }
    if (!email.includes('@')) { showToast('Email invalide !'); return; }
    if (pwd.length < 6) { showToast('Mot de passe trop court !'); return; }
    
    const users = JSON.parse(localStorage.getItem('foodmatchs_users') || '[]');
    if (users.find(u => u.email === email)) { showToast('Email déjà utilisé !'); return; }
    
    users.push({ email, password: pwd, ...userData, createdAt: new Date().toISOString() });
    localStorage.setItem('foodmatchs_users', JSON.stringify(users));
    
    showToast('Compte créé ! 🎉');
    haptic('success');
    setTimeout(() => navigateTo('shopping'), 1500);
}

// ===== SHARE =====
function shareProfile() {
    haptic('medium');
    const text = `Je suis "${userData.profile?.name}" sur FoodMatchs ! 🍽️ Découvre ton profil culinaire !`;
    if (navigator.share) {
        navigator.share({ title: 'Mon profil FoodMatchs', text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(text + ' ' + window.location.href);
        showToast('Copié !');
    }
}

// =====================================================
// FIX: Event listeners attachés après chargement du DOM
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // ----- ALLERGENS PAGE (multi-select) -----
    document.querySelectorAll('#allergensGrid .option-card').forEach(card => {
        card.addEventListener('click', () => {
            haptic('light');
            card.classList.toggle('selected');
            const val = card.dataset.value;
            const idx = userData.allergens.indexOf(val);
            if (idx > -1) userData.allergens.splice(idx, 1);
            else userData.allergens.push(val);
        });
    });
    
    // ----- DIET PAGE (single-select) -----
    document.querySelectorAll('#dietOptions .option-card').forEach(card => {
        card.addEventListener('click', () => {
            haptic('light');
            document.querySelectorAll('#dietOptions .option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            userData.diet = card.dataset.value;
        });
    });
    
    // ----- ALCOHOL TOGGLE -----
    const alcoholOption = document.getElementById('alcoholOption');
    if (alcoholOption) {
        alcoholOption.addEventListener('click', function() {
            haptic('light');
            this.classList.toggle('selected');
            userData.alcohol = this.classList.contains('selected');
        });
    }
    
    // ----- MENU TYPE PAGE (single-select) -----
    document.querySelectorAll('#menuTypeOptions .option-card').forEach(card => {
        card.addEventListener('click', () => {
            haptic('light');
            document.querySelectorAll('#menuTypeOptions .option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            userData.menuType = card.dataset.value;
        });
    });
    
    // ----- EXTRAS PAGE (multi-select) -----
    document.querySelectorAll('#extrasOptions .option-card').forEach(card => {
        card.addEventListener('click', () => {
            haptic('light');
            card.classList.toggle('selected');
            const val = card.dataset.value;
            const idx = userData.extras.indexOf(val);
            if (idx > -1) userData.extras.splice(idx, 1);
            else userData.extras.push(val);
        });
    });
    
    // ----- QUESTION COUNT PAGE (single-select) -----
    document.querySelectorAll('#questionCountOptions .option-card').forEach(card => {
        card.addEventListener('click', () => {
            haptic('light');
            document.querySelectorAll('#questionCountOptions .option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            userData.questionCount = parseInt(card.dataset.value);
        });
    });
    
});
