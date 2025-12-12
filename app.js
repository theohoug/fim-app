/* ============================================
   YUMR v2025 - CORE LOGIC
   ============================================ */

const app = {
    state: {
        user: {
            xp: 2450,
            level: 4,
            streak: 3,
            league: 2, // 0=Bronze, 1=Silver, 2=Gold...
            username: "ChefYumr"
        },
        currentScreen: 'splash'
    },

    init() {
        this.fx.init();
        this.leagues.init();
        this.feed.init();
        
        // Simuler chargement initial
        setTimeout(() => {
            this.router.go('onboarding');
        }, 2000);
        
        // Check local storage
        const saved = localStorage.getItem('yumr_user');
        if(saved) this.state.user = JSON.parse(saved);
        
        this.updateUI();
    },

    updateUI() {
        document.getElementById('xp-count').innerText = this.state.user.xp;
        document.getElementById('streak-count').innerText = this.state.user.streak;
    },

    save() {
        localStorage.setItem('yumr_user', JSON.stringify(this.state.user));
        this.updateUI();
    },

    /* --- ROUTER (Transitions Fluides) --- */
    router: {
        go(screenId) {
            const current = document.querySelector('.screen.active');
            const next = document.getElementById(screenId);
            
            if(current) {
                current.style.transform = 'scale(0.95)';
                current.style.opacity = '0';
                setTimeout(() => {
                    current.classList.remove('active');
                    current.style.transform = ''; // Reset
                }, 300);
            }
            
            if(next) {
                next.classList.add('active');
                // Force reflow
                void next.offsetWidth; 
                next.style.transform = 'scale(1)';
                next.style.opacity = '1';
                
                // Hide Nav on splash/onboarding/cooking
                const nav = document.querySelector('.nav-bar');
                if(['splash', 'onboarding', 'cooking', 'levelup'].includes(screenId)) {
                    nav.style.transform = 'translateY(200%)';
                } else {
                    nav.style.transform = 'translateY(0)';
                }
            }
            
            app.state.currentScreen = screenId;
        },
        back() {
            // Simple back logic to home for demo
            this.go('home');
        }
    },

    /* --- FX ENGINE (Particles & Haptics) --- */
    fx: {
        init() {
            this.container = document.getElementById('particles');
        },
        
        spawnHeart(x, y) {
            const heart = document.createElement('div');
            heart.innerText = '❤️';
            heart.style.position = 'absolute';
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            heart.style.fontSize = '40px';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'heart-burst 0.8s ease-out forwards';
            this.container.appendChild(heart);
            setTimeout(() => heart.remove(), 800);
        },

        confetti() {
            const colors = ['#FF6B35', '#FFD700', '#4ECB71', '#5B9FFF'];
            for(let i=0; i<50; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                p.style.left = '50%';
                p.style.top = '50%';
                p.style.width = Math.random() * 10 + 5 + 'px';
                p.style.height = Math.random() * 10 + 5 + 'px';
                
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 100 + 50;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                p.animate([
                    { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
                    { transform: `translate(${tx}vw, ${ty}vh) rotate(${Math.random()*720}deg)`, opacity: 0 }
                ], {
                    duration: 1000 + Math.random() * 1000,
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                }).onfinish = () => p.remove();
                
                this.container.appendChild(p);
            }
        },

        levelUp() {
            app.router.go('levelup');
            const content = document.getElementById('levelup-content');
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'scale(1)';
                this.confetti();
            }, 100);
        }
    },

    /* --- LEAGUES SYSTEM --- */
    leagues: {
        data: [
            { name: "Bronze", color: "#CD7F32", icon: "🥉" },
            { name: "Argent", color: "#E0E0E0", icon: "🥈" },
            { name: "Or", color: "#FFD700", icon: "🥇" },
            { name: "Saphir", color: "#0F52BA", icon: "💎" },
            { name: "Rubis", color: "#E0115F", icon: "❤️‍🔥" }
        ],
        
        init() {
            this.render();
        },
        
        render() {
            const userLeague = app.state.user.league;
            const league = this.data[userLeague];
            
            // Header
            document.getElementById('league-name').innerText = `Ligue ${league.name}`;
            document.getElementById('league-name').style.color = league.color;
            const badge = document.getElementById('league-icon-container');
            badge.innerText = league.icon;
            badge.style.color = league.color;
            badge.style.boxShadow = `0 0 30px ${league.color}40`; // 40 = hex alpha
            
            // Generate Fake Leaderboard
            const generateUser = (rank) => ({
                rank,
                name: rank === 15 ? "Moi (Toi)" : `Chef_${Math.random().toString(36).substr(2,5)}`,
                xp: rank === 15 ? app.state.user.xp : Math.floor(3000 - (rank * 80) + Math.random()*50),
                me: rank === 15
            });
            
            const renderRow = (u) => `
                <div class="leaderboard-row ${u.me ? 'me' : ''} ${u.rank <= 3 ? 'promotion' : u.rank > 25 ? 'demotion' : ''}">
                    <div style="font-weight: 800; width: 24px; color: var(--text-tertiary)">${u.rank}</div>
                    <img src="https://i.pravatar.cc/40?u=${u.name}" style="width: 32px; height: 32px; border-radius: 50%;">
                    <div style="flex: 1; font-weight: 600;">${u.name}</div>
                    <div style="font-weight: 700; color: var(--accent);">${u.xp} XP</div>
                </div>
            `;
            
            // Top 3
            document.getElementById('leaderboard-top').innerHTML = 
                [1,2,3].map(generateUser).map(renderRow).join('');
                
            // Middle (around user)
            document.getElementById('leaderboard-rest').innerHTML = 
                [14,15,16].map(generateUser).map(renderRow).join('');
                
            // Bottom
            document.getElementById('leaderboard-bottom').innerHTML = 
                [28,29,30].map(generateUser).map(renderRow).join('');
        }
    },

    /* --- FEED SYSTEM (Double Tap) --- */
    feed: {
        posts: [
            { user: "SarahC", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", desc: "Pizza night! 🍕", likes: 45 },
            { user: "TomFood", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", desc: "Le dessert parfait 🍰", likes: 120 }
        ],
        
        init() {
            const container = document.getElementById('feed-container');
            container.innerHTML = this.posts.map((post, i) => `
                <div class="feed-card">
                    <div style="padding: 12px; display: flex; align-items: center; gap: 10px;">
                        <img src="https://i.pravatar.cc/40?u=${post.user}" style="width: 32px; height: 32px; border-radius: 50%;">
                        <span style="font-weight: 600; font-size: 13px;">${post.user}</span>
                    </div>
                    <div class="feed-img" style="background-image: url('${post.img}')">
                        <div class="like-trigger" onclick="app.feed.handleTap(event, ${i})"></div>
                    </div>
                    <div style="padding: 12px;">
                        <div style="display: flex; gap: 16px; margin-bottom: 8px;">
                            <span id="like-icon-${i}" style="font-size: 20px; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);">🤍</span>
                            <span style="font-size: 20px;">💬</span>
                        </div>
                        <p style="font-size: 13px;"><strong>${post.likes} j'aime</strong> • ${post.desc}</p>
                    </div>
                </div>
            `).join('');
        },
        
        handleTap(e, index) {
            // Simulate Double Tap logic could be added here
            // For now single tap likes
            this.like(e.clientX, e.clientY, index);
        },
        
        like(x, y, index) {
            // Visual Heart Burst
            app.fx.spawnHeart(x - 20, y - 20);
            
            // Icon animation
            const icon = document.getElementById(`like-icon-${index}`);
            icon.innerText = "❤️";
            icon.style.transform = "scale(1.5)";
            setTimeout(() => icon.style.transform = "scale(1)", 200);
            
            // Haptic/Sound simulation logic would go here
        }
    },
    
    /* --- COOKING MODE --- */
    cooking: {
        interval: null,
        
        startToday() {
            app.router.go('cooking');
            this.setupTimer(15); // 15 seconds demo
        },
        
        setupTimer(seconds) {
            const circle = document.getElementById('timer-progress');
            const display = document.getElementById('timer-display');
            const btn = document.getElementById('btn-timer-action');
            const radius = 90;
            const circumference = radius * 2 * Math.PI;
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = 0;
            
            let timeLeft = seconds;
            let isRunning = false;
            
            btn.onclick = () => {
                if(isRunning) return;
                isRunning = true;
                btn.innerText = "Cuisson en cours...";
                btn.classList.add('btn-glass'); // visual change
                
                this.interval = setInterval(() => {
                    timeLeft--;
                    const offset = circumference - (timeLeft / seconds) * circumference;
                    circle.style.strokeDashoffset = offset;
                    
                    // Update text
                    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                    const s = (timeLeft % 60).toString().padStart(2, '0');
                    display.innerText = `${m}:${s}`;
                    
                    if(timeLeft <= 0) {
                        clearInterval(this.interval);
                        this.finish();
                    }
                }, 1000);
            };
        },
        
        finish() {
            app.state.user.xp += 250;
            app.state.user.level += 1;
            app.save();
            app.fx.levelUp();
        }
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
