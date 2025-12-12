/**
 * YUMR V3.1 - ULTIMATE
 * Logic: SPA Router, Physics Swipe, Gamification Engine
 */

// =======================
// 1. DATA REPOSITORY
// =======================
const DATA = {
    recipes: [
        { id: 1, name: "Poke Bowl Saumon", time: 15, cal: 450, tags: ["healthy", "quick"], img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500" },
        { id: 2, name: "Pizza Margherita", time: 30, cal: 800, tags: ["comfort"], img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500" },
        { id: 3, name: "Avocado Toast", time: 10, cal: 320, tags: ["healthy", "quick"], img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500" },
        { id: 4, name: "Burger Maison", time: 25, cal: 950, tags: ["comfort"], img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
        { id: 5, name: "Tiramisu", time: 45, cal: 500, tags: ["dessert"], img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500" },
        { id: 6, name: "Pad Thaï", time: 20, cal: 600, tags: ["quick"], img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500" }
    ],
    quiz: [
        { id: 1, name: "Sushi", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", type: "healthy" },
        { id: 2, name: "Tacos", img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500", type: "comfort" },
        { id: 3, name: "Salade César", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500", type: "healthy" },
        { id: 4, name: "Brownie", img: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500", type: "dessert" },
        { id: 5, name: "Ramen", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500", type: "comfort" }
    ],
    posts: [
        { user: "Sarah_C", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", likes: 124, caption: "Pizza night! 🍕" },
        { user: "Tom_Food", img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500", likes: 89, caption: "Brunch du dimanche 🥑" },
        { user: "LéaCooks", img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500", likes: 256, caption: "Pancakes moelleux 🥞" }
    ],
    leagues: [
        { name: "Bronze", color: "#CD7F32", min: 0 },
        { name: "Argent", color: "#E0E0E0", min: 100 },
        { name: "Or", color: "#FFD700", min: 300 },
        { name: "Diamant", color: "#B9F2FF", min: 600 }
    ],
    onboarding: [
        { icon: "🔥", title: "Cuisine & Progresse", text: "Gagne de l'XP à chaque plat cuisiné et monte dans le classement." },
        { icon: "🥙", title: "Découvre tes Goûts", text: "Swipe des plats pour créer ton profil culinaire unique." },
        { icon: "🏆", title: "Défie tes Amis", text: "Rejoins des ligues et deviens le meilleur chef de la semaine." }
    ]
};

// =======================
// 2. STATE MANAGEMENT
// =======================
const State = {
    user: { username: null, xp: 0, level: 1, streak: 1, cooked: 0, badges: [] },
    quizIndex: 0,
    likes: [],
    
    load() {
        try {
            const saved = localStorage.getItem('yumr_v3_user');
            if (saved) this.user = JSON.parse(saved);
        } catch(e) { console.error("Storage error", e); }
    },
    
    save() {
        try {
            localStorage.setItem('yumr_v3_user', JSON.stringify(this.user));
            UI.updateStats();
        } catch(e) {}
    },
    
    addXP(amount) {
        const oldLevel = Math.floor(this.user.xp / 100) + 1;
        this.user.xp += amount;
        const newLevel = Math.floor(this.user.xp / 100) + 1;
        this.user.level = newLevel;
        this.save();
        FX.xpBurst(amount);
        if (newLevel > oldLevel) UI.showLevelUp(newLevel);
    }
};

// =======================
// 3. ROUTER (SPA ENGINE)
// =======================
const Router = {
    go(screenId) {
        const active = document.querySelector('.screen.active');
        const next = document.getElementById(screenId);
        
        if (active) {
            active.style.opacity = '0';
            active.style.transform = 'scale(0.9)';
            setTimeout(() => active.classList.remove('active'), 300);
        }
        
        if (next) {
            next.classList.add('active');
            void next.offsetWidth; // Force Reflow
            next.style.opacity = '1';
            next.style.transform = 'scale(1)';
        }

        const nav = document.getElementById('main-nav');
        if(nav) {
            const hideNavScreens = ['splash', 'onboarding', 'quiz', 'auth', 'cooking'];
            nav.style.transform = hideNavScreens.includes(screenId) ? 'translateY(150%)' : 'translateY(0)';
        }
    }
};

// =======================
// 4. MODULES
// =======================

// ONBOARDING MODULE (Fixed)
const Onboarding = {
    index: 0,
    init() {
        this.slider = document.getElementById('ob-slider');
        this.dots = document.getElementById('ob-dots');
        if(!this.slider) return;

        this.render();
        
        const btnNext = document.getElementById('ob-next');
        if(btnNext) {
            btnNext.onclick = () => {
                if(this.index < DATA.onboarding.length - 1) {
                    this.index++;
                    this.update();
                } else {
                    Router.go('quiz');
                }
            };
        }
        
        const btnSkip = document.getElementById('ob-skip');
        if(btnSkip) btnSkip.onclick = () => Router.go('auth');
    },
    
    render() {
        this.slider.innerHTML = DATA.onboarding.map((slide, i) => `
            <div class="ob-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                <div class="ob-icon">${slide.icon}</div>
                <h2 class="ob-title">${slide.title}</h2>
                <p class="ob-text">${slide.text}</p>
            </div>
        `).join('');
        
        this.dots.innerHTML = DATA.onboarding.map((_, i) => `
            <div class="ob-dot ${i === 0 ? 'active' : ''}"></div>
        `).join('');
    },
    
    update() {
        document.querySelectorAll('.ob-slide').forEach((el, i) => {
            el.classList.toggle('active', i === this.index);
        });
        document.querySelectorAll('.ob-dot').forEach((el, i) => {
            el.classList.toggle('active', i === this.index);
        });
        document.getElementById('ob-next').textContent = 
            this.index === DATA.onboarding.length - 1 ? "Commencer" : "Continuer";
    }
};

// UI CONTROLLER
const UI = {
    init() {
        State.load();
        this.renderFeed();
        this.renderRecipes();
        this.renderLeaderboard();
        this.updateStats();
        
        // SPLASH LOGIC
        setTimeout(() => {
            const loader = document.querySelector('.loader-fill');
            if(loader) loader.style.width = '100%';
            
            setTimeout(() => {
                // Decide where to go
                if(State.user.username) {
                    Router.go('home');
                } else {
                    Router.go('onboarding');
                }
            }, 1000);
        }, 500);
    },

    updateStats() {
        const xpEl = document.getElementById('xp-val');
        if(xpEl) xpEl.textContent = State.user.xp;
        
        const streakEl = document.getElementById('streak-val');
        if(streakEl) streakEl.textContent = State.user.streak;
        
        const nameEl = document.getElementById('profile-name');
        if(nameEl) nameEl.textContent = "@" + (State.user.username || "Guest");
        
        const lvlEl = document.getElementById('profile-lvl');
        if(lvlEl) lvlEl.textContent = State.user.level;
        
        ['cooked', 'streak', 'badges'].forEach(k => {
            const el = document.getElementById('stat-' + k);
            if(el) el.textContent = State.user[k] || 0;
        });

        const league = DATA.leagues.slice().reverse().find(l => State.user.xp >= l.min) || DATA.leagues[0];
        const leagueName = document.getElementById('league-name');
        if(leagueName) leagueName.textContent = "Ligue " + league.name;
    },

    renderFeed() {
        const container = document.getElementById('feed-list');
        if(!container) return;
        container.innerHTML = DATA.posts.map((post) => `
            <div class="feed-card bounce-click" onclick="UI.likePost(this)">
                <div class="feed-header">
                    <img src="https://i.pravatar.cc/150?u=${post.user}" class="feed-avatar">
                    <span style="font-weight:600">${post.user}</span>
                </div>
                <div class="feed-img-container">
                    <img src="${post.img}" class="feed-img">
                    <div class="heart-overlay" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:80px; opacity:0; transform:scale(0); transition:all 0.3s var(--spring);">❤️</div>
                </div>
                <div class="feed-actions">
                    <span class="action-heart">🤍</span>
                    <span>💬</span>
                </div>
                <div style="padding: 0 12px 12px;">
                    <p><strong>${post.likes} j'aime</strong> ${post.caption}</p>
                </div>
            </div>
        `).join('');
    },

    likePost(el) {
        const heart = el.querySelector('.action-heart');
        const overlay = el.querySelector('.heart-overlay');
        heart.textContent = '❤️';
        heart.classList.add('heart-anim');
        
        overlay.style.opacity = '1';
        overlay.style.transform = 'scale(1)';
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0)';
        }, 500);
        
        State.addXP(5);
    },

    renderRecipes() {
        const hero = DATA.recipes[0];
        const heroImg = document.getElementById('hero-img');
        if(heroImg) {
            heroImg.style.backgroundImage = `url(${hero.img})`;
            document.getElementById('hero-title').textContent = hero.name;
            document.getElementById('hero-time').textContent = `⏱️ ${hero.time}min`;
            document.getElementById('hero-cal').textContent = `🔥 ${hero.cal}kcal`;
        }
        
        const grid = document.getElementById('recipes-grid');
        if(grid) {
            grid.innerHTML = DATA.recipes.slice(1).map(r => `
                <div class="glass-card bounce-click" style="padding:10px; margin-bottom:10px;" onclick="Cooking.start(${r.id})">
                    <div style="height:120px; border-radius:12px; background:url(${r.img}) center/cover; margin-bottom:8px;"></div>
                    <h4 style="margin-bottom:4px;">${r.name}</h4>
                    <span style="font-size:12px; opacity:0.7">⏱️ ${r.time}min • 🔥 ${r.cal}</span>
                </div>
            `).join('');
        }
    },
    
    renderLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        if(!list) return;
        let html = '';
        for(let i=1; i<=5; i++) {
            const isMe = i === 4; 
            html += `
                <div style="display:flex; align-items:center; padding:12px; border-bottom:1px solid rgba(255,255,255,0.05); ${isMe ? 'background:rgba(255,107,53,0.1)' : ''}">
                    <strong style="width:20px">${i}</strong>
                    <img src="https://i.pravatar.cc/150?img=${20+i}" style="width:32px; height:32px; border-radius:50%; margin:0 10px;">
                    <span style="flex:1">${isMe ? (State.user.username || 'Moi') : 'User_'+Math.floor(Math.random()*999)}</span>
                    <strong style="color:var(--primary)">${isMe ? State.user.xp : Math.floor(2000 - i*200)} XP</strong>
                </div>
            `;
        }
        list.innerHTML = html;
    },

    showLevelUp(level) {
        document.getElementById('new-level').textContent = level;
        const overlay = document.getElementById('levelup-overlay');
        overlay.style.display = 'flex';
        FX.confetti();
    }
};

// QUIZ ENGINE
const Quiz = {
    init() {
        this.stack = document.getElementById('quiz-stack');
        if(!this.stack) return;
        this.renderCards();
        this.bindEvents();
    },

    renderCards() {
        this.stack.innerHTML = DATA.quiz.slice(State.quizIndex).map((item, i) => `
            <div class="quiz-card" style="background-image: url(${item.img}); z-index: ${100-i}; transform: scale(${1 - i*0.05}) translateY(${i*10}px)">
                <div class="card-content">
                    <h2>${item.name}</h2>
                    <p>${item.type.toUpperCase()}</p>
                </div>
            </div>
        `).join('');
    },

    bindEvents() {
        let startX, currentX, card;
        
        this.stack.addEventListener('touchstart', (e) => {
            card = this.stack.querySelector('.quiz-card');
            if(!card) return;
            startX = e.touches[0].clientX;
            card.style.transition = 'none';
        });

        this.stack.addEventListener('touchmove', (e) => {
            if(!card) return;
            currentX = e.touches[0].clientX;
            let diff = currentX - startX;
            let deg = diff * 0.1;
            card.style.transform = `translateX(${diff}px) rotate(${deg}deg)`;
            
            if(diff > 50) card.style.boxShadow = `0 0 30px var(--success)`;
            else if(diff < -50) card.style.boxShadow = `0 0 30px var(--danger)`;
            else card.style.boxShadow = '';
        });

        this.stack.addEventListener('touchend', (e) => {
            if(!card) return;
            let diff = currentX - startX;
            card.style.transition = 'transform 0.3s var(--spring)';
            
            if (diff > 100) this.swipe(true);
            else if (diff < -100) this.swipe(false);
            else {
                card.style.transform = `scale(1) translateY(0)`;
                card.style.boxShadow = '';
            }
            card = null;
        });
        
        const btnLove = document.getElementById('quiz-love');
        if(btnLove) btnLove.onclick = () => this.swipe(true);
        const btnNope = document.getElementById('quiz-nope');
        if(btnNope) btnNope.onclick = () => this.swipe(false);
    },
    
    swipe(liked) {
        const card = this.stack.querySelector('.quiz-card');
        if(!card) return;
        
        const dir = liked ? 200 : -200;
        card.style.transform = `translateX(${dir}vw) rotate(${liked ? 45 : -45}deg)`;
        
        State.quizIndex++;
        if(liked) State.likes.push(DATA.quiz[State.quizIndex-1]);
        
        setTimeout(() => {
            card.remove();
            if(State.quizIndex >= DATA.quiz.length) {
                Router.go('auth');
            } else {
                Array.from(this.stack.children).forEach((c, i) => {
                    c.style.transform = `scale(${1 - i*0.05}) translateY(${i*10}px)`;
                });
            }
        }, 300);
    }
};

// COOKING ENGINE
const Cooking = {
    interval: null,
    start(recipeId) {
        Router.go('cooking');
        const recipe = DATA.recipes.find(r => r.id === recipeId);
        if(recipe) {
            document.getElementById('step-text').innerHTML = `Recette : <strong style="color:var(--primary)">${recipe.name}</strong><br><br>Préparez vos ingrédients et ustensiles.`;
            this.resetTimer(10);
        }
    },
    resetTimer(seconds) {
        clearInterval(this.interval);
        const ring = document.getElementById('timer-ring');
        const display = document.getElementById('timer-display');
        const max = 283; 
        let current = seconds;
        
        ring.style.strokeDashoffset = 0;
        display.textContent = this.fmt(current);
        
        const btn = document.getElementById('timer-toggle');
        btn.textContent = "▶";
        btn.onclick = () => {
            btn.textContent = "⏸";
            this.interval = setInterval(() => {
                current--;
                display.textContent = this.fmt(current);
                const offset = max - (current / seconds) * max;
                ring.style.strokeDashoffset = offset;
                
                if(current <= 0) {
                    clearInterval(this.interval);
                    State.addXP(50);
                    State.user.cooked++;
                    State.save();
                    alert("Terminé ! +50 XP");
                    Router.go('home');
                }
            }, 1000);
        };
    },
    fmt(s) { return `00:${s < 10 ? '0'+s : s}`; }
};

// FX ENGINE
const FX = {
    confetti() {
        const colors = ['#FF6B35', '#FFD700', '#4ECB71', '#6C5DD3'];
        const container = document.getElementById('particles-container');
        if(!container) return;
        
        for(let i=0; i<30; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = '-10px';
            p.style.width = Math.random() * 10 + 5 + 'px';
            p.style.height = p.style.width;
            p.style.animationDuration = Math.random() * 2 + 1 + 's';
            container.appendChild(p);
            setTimeout(() => p.remove(), 3000);
        }
    },
    xpBurst(amount) { console.log(`✨ +${amount} XP`); }
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Navigation Binding
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.target;
            if(target) {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                Router.go(target);
            }
        };
    });
    
    // Auth Binding
    const authSubmit = document.getElementById('auth-submit');
    if(authSubmit) {
        authSubmit.onclick = (e) => {
            e.preventDefault();
            const username = document.getElementById('input-username').value;
            if(username) {
                State.user.username = username;
                State.save();
                State.addXP(100);
                Router.go('home');
            }
        };
    }
    
    // Generic Binding (Safety Checks)
    const heroCard = document.getElementById('hero-card');
    if(heroCard) heroCard.onclick = () => Cooking.start(1);
    
    const cookClose = document.getElementById('cooking-close');
    if(cookClose) cookClose.onclick = () => Router.go('home');
    
    const lvlClose = document.getElementById('levelup-close');
    if(lvlClose) lvlClose.onclick = () => document.getElementById('levelup-overlay').style.display = 'none';

    const cookNav = document.getElementById('nav-cook');
    if(cookNav) cookNav.onclick = () => Cooking.start(1);
    
    const logoutBtn = document.getElementById('btn-logout');
    if(logoutBtn) logoutBtn.onclick = () => {
        if(confirm('Déconnexion ?')) {
            localStorage.removeItem('yumr_v3_user');
            location.reload();
        }
    };

    // Init Modules
    UI.init();
    Onboarding.init();
    Quiz.init();
});
