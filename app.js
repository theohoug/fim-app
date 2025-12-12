/**
 * YUMR V3 - ULTIMATE EDITION
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
    ]
};

// =======================
// 2. STATE MANAGEMENT
// =======================
const State = {
    user: {
        username: null,
        xp: 0,
        level: 1,
        streak: 1,
        cooked: 0,
        badges: []
    },
    quizIndex: 0,
    likes: [],
    
    load() {
        const saved = localStorage.getItem('yumr_v3_user');
        if (saved) this.user = JSON.parse(saved);
    },
    
    save() {
        localStorage.setItem('yumr_v3_user', JSON.stringify(this.user));
        UI.updateStats();
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
            // Force reflow
            void next.offsetWidth;
            next.style.opacity = '1';
            next.style.transform = 'scale(1)';
        }

        // Toggle Nav Bar visibility
        const nav = document.getElementById('main-nav');
        const hideNavScreens = ['splash', 'onboarding', 'quiz', 'auth', 'cooking'];
        nav.style.transform = hideNavScreens.includes(screenId) ? 'translateY(150%)' : 'translateY(0)';
    }
};

// =======================
// 4. UI CONTROLLER
// =======================
const UI = {
    init() {
        State.load();
        this.renderFeed();
        this.renderRecipes();
        this.renderLeaderboard();
        this.updateStats();
        
        // Splash logic
        setTimeout(() => {
            document.querySelector('.loader-fill').style.width = '100%';
            setTimeout(() => {
                Router.go(State.user.username ? 'home' : 'onboarding');
            }, 1000);
        }, 500);
    },

    updateStats() {
        document.getElementById('xp-val').textContent = State.user.xp;
        document.getElementById('streak-val').textContent = State.user.streak;
        document.getElementById('profile-name').textContent = "@" + (State.user.username || "Guest");
        document.getElementById('profile-lvl').textContent = State.user.level;
        document.getElementById('stat-cooked').textContent = State.user.cooked;
        document.getElementById('stat-streak').textContent = State.user.streak;
        
        // Update League
        const league = DATA.leagues.slice().reverse().find(l => State.user.xp >= l.min) || DATA.leagues[0];
        document.getElementById('league-name').textContent = "Ligue " + league.name;
        document.getElementById('league-icon').style.textShadow = `0 0 20px ${league.color}`;
    },

    renderFeed() {
        const container = document.getElementById('feed-list');
        container.innerHTML = DATA.posts.map((post, i) => `
            <div class="feed-card bounce-click" ondblclick="UI.likePost(this)">
                <div class="feed-header">
                    <img src="https://i.pravatar.cc/150?u=${post.user}" class="feed-avatar">
                    <span style="font-weight:600">${post.user}</span>
                </div>
                <div class="feed-img-container">
                    <img src="${post.img}" class="feed-img">
                    <div class="heart-overlay">❤️</div>
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
        heart.textContent = '❤️';
        heart.classList.add('heart-anim');
        State.addXP(5);
    },

    renderRecipes() {
        const hero = DATA.recipes[0];
        document.getElementById('hero-img').style.backgroundImage = `url(${hero.img})`;
        document.getElementById('hero-title').textContent = hero.name;
        document.getElementById('hero-time').textContent = `⏱️ ${hero.time}min`;
        document.getElementById('hero-cal').textContent = `🔥 ${hero.cal}kcal`;
        
        const grid = document.getElementById('recipes-grid');
        grid.innerHTML = DATA.recipes.slice(1).map(r => `
            <div class="glass-card bounce-click" style="padding:10px; margin-bottom:10px;" onclick="Cooking.start(${r.id})">
                <div style="height:120px; border-radius:12px; background:url(${r.img}) center/cover; margin-bottom:8px;"></div>
                <h4 style="margin-bottom:4px;">${r.name}</h4>
                <span style="font-size:12px; opacity:0.7">⏱️ ${r.time}min • 🔥 ${r.cal}</span>
            </div>
        `).join('');
    },
    
    renderLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        let html = '';
        for(let i=1; i<=5; i++) {
            const isMe = i === 4; // Fake position
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

// =======================
// 5. QUIZ ENGINE (PHYSICS)
// =======================
const Quiz = {
    init() {
        this.stack = document.getElementById('quiz-stack');
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
        // Touch logic for Swipe
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
            
            // Visual Feedback
            if(diff > 50) card.style.boxShadow = `0 0 30px var(--success)`;
            else if(diff < -50) card.style.boxShadow = `0 0 30px var(--danger)`;
            else card.style.boxShadow = '';
        });

        this.stack.addEventListener('touchend', (e) => {
            if(!card) return;
            let diff = currentX - startX;
            card.style.transition = 'transform 0.3s ease';
            
            if (diff > 100) this.swipe(true); // Right (Love)
            else if (diff < -100) this.swipe(false); // Left (Nope)
            else {
                // Reset
                card.style.transform = `scale(1) translateY(0)`;
                card.style.boxShadow = '';
            }
            card = null;
        });
        
        // Buttons
        document.getElementById('quiz-love').onclick = () => this.swipe(true);
        document.getElementById('quiz-nope').onclick = () => this.swipe(false);
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
            // End of Quiz?
            if(State.quizIndex >= DATA.quiz.length) {
                Router.go('auth');
            } else {
                // Re-adjust stack visual
                Array.from(this.stack.children).forEach((c, i) => {
                    c.style.transform = `scale(${1 - i*0.05}) translateY(${i*10}px)`;
                });
            }
        }, 300);
    }
};

// =======================
// 6. COOKING ENGINE
// =======================
const Cooking = {
    interval: null,
    
    start(recipeId) {
        Router.go('cooking');
        const recipe = DATA.recipes.find(r => r.id === recipeId);
        document.getElementById('step-text').innerHTML = `Recette : <strong style="color:var(--primary)">${recipe.name}</strong><br><br>Préparez vos ingrédients et ustensiles.`;
        this.resetTimer(10); // Demo: 10s timer
    },
    
    resetTimer(seconds) {
        clearInterval(this.interval);
        const ring = document.getElementById('timer-ring');
        const display = document.getElementById('timer-display');
        const max = 283; // 2 * PI * 45
        let current = seconds;
        
        ring.style.strokeDashoffset = 0;
        display.textContent = this.fmt(current);
        
        document.getElementById('timer-toggle').onclick = () => {
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

// =======================
// 7. EFFECTS (PARTICLES)
// =======================
const FX = {
    confetti() {
        const colors = ['#FF6B35', '#FFD700', '#4ECB71', '#6C5DD3'];
        const container = document.getElementById('particles-container');
        
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
    
    xpBurst(amount) {
        // Simple visual feedback in log or toast could be added here
        console.log(`✨ +${amount} XP`);
    }
};

// =======================
// 8. INITIALIZATION
// =======================
document.addEventListener('DOMContentLoaded', () => {
    // Nav Binding
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
    
    // Auth Logic
    document.getElementById('auth-submit').onclick = (e) => {
        e.preventDefault();
        State.user.username = document.getElementById('input-username').value || "Chef";
        State.save();
        State.addXP(100); // Welcome bonus
        Router.go('home');
    };
    
    document.getElementById('ob-next').onclick = () => Router.go('quiz');
    document.getElementById('ob-skip').onclick = () => Router.go('auth');
    document.getElementById('hero-card').onclick = () => Cooking.start(1);
    document.getElementById('cooking-close').onclick = () => Router.go('home');
    document.getElementById('levelup-close').onclick = () => document.getElementById('levelup-overlay').style.display = 'none';

    // Start App
    UI.init();
    Quiz.init();
});
