/**
 * YUMR V4 COMPLETE
 * Full-featured culinary gamification app
 */

// ============================================
// DATA REPOSITORY
// ============================================
const DATA = {
    // Onboarding slides
    onboarding: [
        { icon: "🔥", title: "Cuisine & Progresse", text: "Gagne de l'XP à chaque plat cuisiné et monte dans les ligues." },
        { icon: "🥙", title: "Découvre tes Goûts", text: "Swipe des plats pour créer ton profil culinaire unique." },
        { icon: "🍽️", title: "Menu Personnalisé", text: "Reçois chaque jour un menu adapté à tes goûts et ton budget." },
        { icon: "🏆", title: "Défie tes Amis", text: "Rejoins les ligues et deviens le meilleur chef de la semaine." }
    ],

    // Quiz items (30+ dishes)
    quiz: [
        { id: 1, name: "Pizza Margherita", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500", type: "comfort", tags: ["italien", "fromage"] },
        { id: 2, name: "Sushi", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", type: "healthy", tags: ["japonais", "poisson"] },
        { id: 3, name: "Burger Gourmet", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", type: "comfort", tags: ["américain", "viande"] },
        { id: 4, name: "Poke Bowl", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500", type: "healthy", tags: ["hawaïen", "poisson"] },
        { id: 5, name: "Tacos", img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500", type: "comfort", tags: ["mexicain", "épicé"] },
        { id: 6, name: "Salade César", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500", type: "healthy", tags: ["classique", "léger"] },
        { id: 7, name: "Pad Thaï", img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500", type: "comfort", tags: ["thaï", "nouilles"] },
        { id: 8, name: "Tiramisu", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500", type: "dessert", tags: ["italien", "café"] },
        { id: 9, name: "Ramen", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500", type: "comfort", tags: ["japonais", "soupe"] },
        { id: 10, name: "Avocado Toast", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500", type: "healthy", tags: ["brunch", "végétarien"] },
        { id: 11, name: "Croissant", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500", type: "dessert", tags: ["français", "beurre"] },
        { id: 12, name: "Curry Indien", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500", type: "comfort", tags: ["indien", "épicé"] },
        { id: 13, name: "Pâtes Carbonara", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500", type: "comfort", tags: ["italien", "crémeux"] },
        { id: 14, name: "Brownie", img: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500", type: "dessert", tags: ["chocolat", "américain"] },
        { id: 15, name: "Bibimbap", img: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=500", type: "healthy", tags: ["coréen", "riz"] },
        { id: 16, name: "Fish & Chips", img: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=500", type: "comfort", tags: ["anglais", "frit"] },
        { id: 17, name: "Smoothie Bowl", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500", type: "healthy", tags: ["brunch", "fruits"] },
        { id: 18, name: "Paella", img: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=500", type: "comfort", tags: ["espagnol", "fruits de mer"] },
        { id: 19, name: "Cheesecake", img: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500", type: "dessert", tags: ["américain", "fromage"] },
        { id: 20, name: "Pho", img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500", type: "healthy", tags: ["vietnamien", "soupe"] },
        { id: 21, name: "Crêpe Nutella", img: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500", type: "dessert", tags: ["français", "sucré"] },
        { id: 22, name: "Falafel", img: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=500", type: "healthy", tags: ["oriental", "végétarien"] },
        { id: 23, name: "Risotto", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500", type: "comfort", tags: ["italien", "crémeux"] },
        { id: 24, name: "Açai Bowl", img: "https://images.unsplash.com/photo-1590301157284-4e21d85df6e4?w=500", type: "healthy", tags: ["brésilien", "fruits"] },
        { id: 25, name: "Lasagnes", img: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500", type: "comfort", tags: ["italien", "fromage"] },
        { id: 26, name: "Pancakes", img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500", type: "dessert", tags: ["américain", "brunch"] },
        { id: 27, name: "Ceviche", img: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=500", type: "healthy", tags: ["péruvien", "poisson"] },
        { id: 28, name: "Couscous", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500", type: "comfort", tags: ["maghrébin", "épicé"] },
        { id: 29, name: "Mochi", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500", type: "dessert", tags: ["japonais", "sucré"] },
        { id: 30, name: "Buddha Bowl", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", type: "healthy", tags: ["végétarien", "équilibré"] }
    ],

    // Complete recipes
    recipes: [
        {
            id: 1,
            name: "Poke Bowl Saumon",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
            time: 15,
            cal: 450,
            cost: "€€",
            difficulty: "Facile",
            tags: ["healthy", "quick"],
            type: "main",
            servings: 2,
            ingredients: ["200g saumon frais", "150g riz à sushi", "1 avocat", "100g edamame", "2 c.s sauce soja", "1 c.s huile de sésame", "Graines de sésame", "Gingembre mariné"],
            steps: [
                { text: "Cuire le riz selon les instructions du paquet", timer: 15 },
                { text: "Couper le saumon en cubes de 2cm", timer: 0 },
                { text: "Éplucher et trancher l'avocat", timer: 0 },
                { text: "Préparer la sauce : soja + huile de sésame", timer: 0 },
                { text: "Dresser le bowl : riz, saumon, avocat, edamame", timer: 0 },
                { text: "Arroser de sauce et parsemer de sésame", timer: 0 }
            ],
            wine: "Un Riesling frais d'Alsace"
        },
        {
            id: 2,
            name: "Pizza Margherita",
            img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
            time: 30,
            cal: 800,
            cost: "€",
            difficulty: "Moyen",
            tags: ["comfort"],
            type: "main",
            servings: 2,
            ingredients: ["250g pâte à pizza", "200g sauce tomate", "200g mozzarella", "Basilic frais", "2 c.s huile d'olive", "Sel, poivre"],
            steps: [
                { text: "Préchauffer le four à 250°C", timer: 10 },
                { text: "Étaler la pâte sur une plaque farinée", timer: 0 },
                { text: "Étaler la sauce tomate uniformément", timer: 0 },
                { text: "Répartir la mozzarella en morceaux", timer: 0 },
                { text: "Enfourner 12-15 minutes jusqu'à dorée", timer: 15 },
                { text: "Ajouter le basilic frais et l'huile d'olive", timer: 0 }
            ],
            wine: "Un Chianti Classico"
        },
        {
            id: 3,
            name: "Poulet Rôti aux Herbes",
            img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500",
            time: 60,
            cal: 550,
            cost: "€€",
            difficulty: "Facile",
            tags: ["comfort"],
            type: "main",
            servings: 4,
            ingredients: ["1 poulet entier (1.5kg)", "50g beurre", "4 gousses d'ail", "Thym, romarin", "1 citron", "Sel, poivre"],
            steps: [
                { text: "Sortir le poulet 30min avant pour qu'il soit à température", timer: 30 },
                { text: "Préchauffer le four à 200°C", timer: 0 },
                { text: "Mélanger le beurre mou avec les herbes et l'ail", timer: 0 },
                { text: "Badigeonner le poulet et glisser du beurre sous la peau", timer: 0 },
                { text: "Mettre le citron coupé dans la cavité", timer: 0 },
                { text: "Enfourner 1h en arrosant régulièrement", timer: 60 },
                { text: "Laisser reposer 10min avant de découper", timer: 10 }
            ],
            wine: "Un Bourgogne blanc"
        },
        {
            id: 4,
            name: "Tiramisu",
            img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
            time: 30,
            cal: 420,
            cost: "€€",
            difficulty: "Moyen",
            tags: ["dessert"],
            type: "dessert",
            servings: 6,
            ingredients: ["250g mascarpone", "3 œufs", "100g sucre", "200ml café fort froid", "200g biscuits cuillère", "Cacao en poudre"],
            steps: [
                { text: "Préparer un café fort et le laisser refroidir", timer: 0 },
                { text: "Séparer les blancs des jaunes", timer: 0 },
                { text: "Battre les jaunes avec le sucre jusqu'à blanchiment", timer: 0 },
                { text: "Incorporer le mascarpone délicatement", timer: 0 },
                { text: "Monter les blancs en neige ferme", timer: 5 },
                { text: "Incorporer les blancs à la préparation", timer: 0 },
                { text: "Tremper rapidement les biscuits dans le café", timer: 0 },
                { text: "Alterner couches de biscuits et crème", timer: 0 },
                { text: "Réfrigérer minimum 4h", timer: 240 },
                { text: "Saupoudrer de cacao avant de servir", timer: 0 }
            ],
            wine: "Un Vin Santo"
        },
        {
            id: 5,
            name: "Pad Thaï",
            img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500",
            time: 25,
            cal: 550,
            cost: "€€",
            difficulty: "Moyen",
            tags: ["quick", "comfort"],
            type: "main",
            servings: 2,
            ingredients: ["200g nouilles de riz", "200g crevettes", "2 œufs", "100g pousses de soja", "3 c.s sauce poisson", "2 c.s sucre de palme", "Cacahuètes concassées", "Citron vert"],
            steps: [
                { text: "Tremper les nouilles dans l'eau tiède 30min", timer: 30 },
                { text: "Préparer la sauce : sauce poisson + sucre + tamarin", timer: 0 },
                { text: "Faire sauter les crevettes à feu vif", timer: 3 },
                { text: "Pousser sur le côté, brouiller les œufs", timer: 2 },
                { text: "Ajouter les nouilles égouttées et la sauce", timer: 0 },
                { text: "Mélanger vigoureusement 2-3 minutes", timer: 3 },
                { text: "Servir avec cacahuètes et citron vert", timer: 0 }
            ],
            wine: "Une bière thaï ou un Gewurztraminer"
        },
        {
            id: 6,
            name: "Salade César",
            img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500",
            time: 15,
            cal: 380,
            cost: "€",
            difficulty: "Facile",
            tags: ["healthy", "quick"],
            type: "starter",
            servings: 2,
            ingredients: ["1 laitue romaine", "100g poulet grillé", "50g parmesan", "Croûtons", "Sauce César", "1 jaune d'œuf", "Anchois (optionnel)"],
            steps: [
                { text: "Laver et essorer la salade, couper en morceaux", timer: 0 },
                { text: "Griller le poulet et le trancher", timer: 10 },
                { text: "Préparer la sauce César maison ou utiliser du commerce", timer: 0 },
                { text: "Mélanger la salade avec la sauce", timer: 0 },
                { text: "Ajouter le poulet, les croûtons et le parmesan", timer: 0 }
            ],
            wine: "Un Chablis"
        }
    ],

    // Profiles culinaires
    profiles: [
        { name: "L'Italien", emoji: "🍝", desc: "Tu craques pour les saveurs méditerranéennes", tags: ["Pasta", "Fromage", "Tomate"] },
        { name: "L'Aventurier", emoji: "🌶️", desc: "Toujours prêt à découvrir de nouvelles saveurs épicées", tags: ["Épicé", "Exotique", "Voyage"] },
        { name: "Le Healthy", emoji: "🥗", desc: "Tu privilégies l'équilibre et la fraîcheur", tags: ["Léger", "Frais", "Équilibré"] },
        { name: "Le Gourmand", emoji: "🍰", desc: "La vie est trop courte pour se priver !", tags: ["Sucré", "Généreux", "Comfort"] },
        { name: "L'Asiatique", emoji: "🍜", desc: "Les saveurs d'Asie n'ont pas de secret pour toi", tags: ["Umami", "Riz", "Nouilles"] }
    ],

    // Leagues
    leagues: [
        { name: "Bronze", icon: "🥉", color: "#CD7F32", min: 0 },
        { name: "Argent", icon: "🥈", color: "#C0C0C0", min: 100 },
        { name: "Or", icon: "🥇", color: "#FFD700", min: 300 },
        { name: "Saphir", icon: "💎", color: "#0F52BA", min: 600 },
        { name: "Rubis", icon: "❤️‍🔥", color: "#E0115F", min: 1000 },
        { name: "Émeraude", icon: "💚", color: "#50C878", min: 1500 },
        { name: "Améthyste", icon: "💜", color: "#9966CC", min: 2200 },
        { name: "Perle", icon: "🤍", color: "#F5F5F5", min: 3000 },
        { name: "Obsidienne", icon: "🖤", color: "#1A1A2E", min: 4000 },
        { name: "Diamant", icon: "💠", color: "#B9F2FF", min: 5000 }
    ],

    // Badges
    badges: [
        { id: 1, name: "Premier Plat", emoji: "🍳", desc: "Cuisine ta première recette", condition: (u) => u.cooked >= 1 },
        { id: 2, name: "Apprenti", emoji: "👨‍🍳", desc: "Cuisine 5 recettes", condition: (u) => u.cooked >= 5 },
        { id: 3, name: "Cuisinier", emoji: "🎖️", desc: "Cuisine 15 recettes", condition: (u) => u.cooked >= 15 },
        { id: 4, name: "Chef", emoji: "⭐", desc: "Cuisine 30 recettes", condition: (u) => u.cooked >= 30 },
        { id: 5, name: "Streak 3", emoji: "🔥", desc: "3 jours consécutifs", condition: (u) => u.streak >= 3 },
        { id: 6, name: "Streak 7", emoji: "💪", desc: "7 jours consécutifs", condition: (u) => u.streak >= 7 },
        { id: 7, name: "Streak 30", emoji: "🏆", desc: "30 jours consécutifs", condition: (u) => u.streak >= 30 },
        { id: 8, name: "Niveau 5", emoji: "5️⃣", desc: "Atteins le niveau 5", condition: (u) => u.level >= 5 },
        { id: 9, name: "Niveau 10", emoji: "🔟", desc: "Atteins le niveau 10", condition: (u) => u.level >= 10 },
        { id: 10, name: "Collectionneur", emoji: "❤️", desc: "10 recettes en favoris", condition: (u) => u.favorites?.length >= 10 },
        { id: 11, name: "Organisé", emoji: "📝", desc: "50 articles dans les courses", condition: (u) => u.totalShopping >= 50 },
        { id: 12, name: "Frigo Plein", emoji: "🧊", desc: "20 ingrédients dans le frigo", condition: (u) => u.fridge?.length >= 20 }
    ],

    // Challenges
    challenges: [
        { id: 1, title: "Cuisine un plat végétarien", xp: 50, type: "vegetarian" },
        { id: 2, title: "Prépare un dessert", xp: 40, type: "dessert" },
        { id: 3, title: "Recette en moins de 20min", xp: 35, type: "quick" },
        { id: 4, title: "Cuisine un plat healthy", xp: 45, type: "healthy" },
        { id: 5, title: "Essaie une cuisine asiatique", xp: 50, type: "asian" }
    ],

    // Feed posts
    posts: [
        { user: "ChefAlex", avatar: "https://i.pravatar.cc/40?img=4", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", caption: "Pizza night! 🍕", likes: 124 },
        { user: "MarieFood", avatar: "https://i.pravatar.cc/40?img=5", img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500", caption: "Brunch du dimanche 🥑", likes: 89 },
        { user: "TomCook", avatar: "https://i.pravatar.cc/40?img=8", img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500", caption: "Pancakes moelleux 🥞", likes: 256 }
    ],

    // Common fridge items
    commonIngredients: ["Œufs", "Lait", "Beurre", "Poulet", "Tomates", "Oignons", "Ail", "Carottes", "Pommes de terre", "Riz", "Pâtes", "Fromage", "Crème", "Citron", "Poivrons"]
};

// ============================================
// STATE MANAGEMENT
// ============================================
const State = {
    user: {
        id: null,
        username: null,
        email: null,
        xp: 0,
        level: 1,
        streak: 1,
        lastActive: null,
        cooked: 0,
        badges: [],
        profile: null,
        preferences: {
            diet: 'omnivore',
            allergies: [],
            level: 'beginner'
        },
        fridge: [],
        shopping: [],
        favorites: [],
        totalShopping: 0,
        settings: {
            notifications: { daily: true, streak: true, recipes: false },
            sounds: false
        }
    },
    
    // App state
    quizIndex: 0,
    quizCount: 20,
    quizLikes: [],
    currentMenu: null,
    currentRecipe: null,
    cookingStep: 0,
    timerInterval: null,
    timerSeconds: 0,
    servings: 2,

    load() {
        try {
            const saved = localStorage.getItem('yumr_v4_user');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.user = { ...this.user, ...parsed };
                this.checkStreak();
            }
        } catch (e) {
            console.error('Error loading state:', e);
        }
    },

    save() {
        try {
            this.user.lastActive = new Date().toDateString();
            localStorage.setItem('yumr_v4_user', JSON.stringify(this.user));
        } catch (e) {
            console.error('Error saving state:', e);
        }
    },

    checkStreak() {
        const today = new Date().toDateString();
        const lastActive = this.user.lastActive;
        
        if (!lastActive) return;
        
        const last = new Date(lastActive);
        const now = new Date(today);
        const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            this.user.streak++;
            toast(`🔥 Streak de ${this.user.streak} jours !`, 'success');
        } else if (diffDays > 1) {
            this.user.streak = 1;
        }
    },

    addXP(amount) {
        const oldLevel = this.user.level;
        this.user.xp += amount;
        this.user.level = Math.floor(this.user.xp / 100) + 1;
        this.save();
        
        showXPPopup(amount);
        
        if (this.user.level > oldLevel) {
            setTimeout(() => showLevelUp(this.user.level), 1500);
        }
        
        UI.updateStats();
        this.checkBadges();
    },

    checkBadges() {
        DATA.badges.forEach(badge => {
            if (!this.user.badges.includes(badge.id) && badge.condition(this.user)) {
                this.user.badges.push(badge.id);
                this.save();
                toast(`🎖️ Badge débloqué : ${badge.name}`, 'success');
            }
        });
    }
};

// ============================================
// ROUTER
// ============================================
const Router = {
    currentScreen: 'splash',
    
    go(screenId) {
        const active = document.querySelector('.screen.active');
        const next = document.getElementById(screenId);
        
        if (!next) return;
        
        if (active) {
            active.classList.remove('active');
        }
        
        next.classList.add('active');
        this.currentScreen = screenId;
        
        // Handle nav visibility
        const nav = document.getElementById('main-nav');
        const hideNavScreens = ['splash', 'onboarding', 'quiz-choice', 'quiz', 'quiz-prefs', 'quiz-result', 'auth', 'cooking'];
        
        if (hideNavScreens.includes(screenId)) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn[data-target]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === screenId);
        });
    }
};

// ============================================
// UI CONTROLLER
// ============================================
const UI = {
    init() {
        State.load();
        this.bindEvents();
        this.startSplash();
    },

    startSplash() {
        setTimeout(() => {
            document.querySelector('.loader-fill').style.width = '100%';
            
            setTimeout(() => {
                if (State.user.username) {
                    Router.go('home');
                    this.renderHome();
                } else {
                    Router.go('onboarding');
                    Onboarding.init();
                }
            }, 1500);
        }, 500);
    },

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn[data-target]').forEach(btn => {
            btn.addEventListener('click', () => {
                Router.go(btn.dataset.target);
                if (btn.dataset.target === 'home') this.renderHome();
                if (btn.dataset.target === 'explore') this.renderExplore();
                if (btn.dataset.target === 'social') this.renderSocial();
                if (btn.dataset.target === 'profile') this.renderProfile();
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'fridge') openModal('modal-fridge'), this.renderFridge();
                if (action === 'shopping') openModal('modal-shopping'), this.renderShopping();
                if (action === 'favorites') openModal('modal-favorites'), this.renderFavorites();
            });
        });

        // Menu item actions
        document.querySelectorAll('.menu-item[data-action]').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action === 'settings') openModal('modal-settings'), this.renderSettings();
                if (action === 'favorites') openModal('modal-favorites'), this.renderFavorites();
                if (action === 'mealprep') openModal('modal-mealprep');
            });
        });

        // Generate menu button
        document.getElementById('generate-menu-btn')?.addEventListener('click', () => {
            openModal('modal-menu-gen');
        });

        document.getElementById('regenerate-menu')?.addEventListener('click', () => {
            openModal('modal-menu-gen');
        });

        // Daily menu card click
        document.getElementById('daily-menu-card')?.addEventListener('click', (e) => {
            if (State.currentMenu && !e.target.closest('button')) {
                openModal('modal-menu-result');
                this.renderMenuResult();
            }
        });

        // FAB cook button
        document.getElementById('nav-cook')?.addEventListener('click', () => {
            if (State.currentMenu?.main) {
                Cooking.start(State.currentMenu.main.id);
            } else {
                openModal('modal-menu-gen');
            }
        });

        // Auth
        document.getElementById('auth-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            Auth.submit();
        });

        document.getElementById('auth-skip')?.addEventListener('click', () => {
            State.user.username = 'Invité';
            State.save();
            Router.go('home');
            this.renderHome();
        });

        document.getElementById('auth-toggle')?.addEventListener('click', Auth.toggle);

        // Logout
        document.getElementById('btn-logout')?.addEventListener('click', () => {
            if (confirm('Déconnexion ?')) {
                localStorage.removeItem('yumr_v4_user');
                location.reload();
            }
        });

        // Menu generation
        MenuGenerator.bindEvents();

        // Fridge
        document.getElementById('btn-add-fridge')?.addEventListener('click', Fridge.add);
        document.getElementById('fridge-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') Fridge.add();
        });

        // Shopping
        document.getElementById('btn-add-shopping')?.addEventListener('click', Shopping.add);
        document.getElementById('shopping-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') Shopping.add();
        });
        document.getElementById('btn-clear-shopping')?.addEventListener('click', Shopping.clear);

        // Settings
        document.getElementById('btn-save-settings')?.addEventListener('click', Settings.save);

        // Cooking
        document.getElementById('cooking-close')?.addEventListener('click', () => Router.go('home'));
        document.getElementById('step-prev')?.addEventListener('click', () => Cooking.prevStep());
        document.getElementById('step-next')?.addEventListener('click', () => Cooking.nextStep());
        document.getElementById('timer-toggle')?.addEventListener('click', Cooking.toggleTimer);

        // Level up close
        document.getElementById('levelup-close')?.addEventListener('click', () => {
            document.getElementById('levelup-overlay').classList.remove('active');
        });

        // Search
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            this.renderExplore(e.target.value);
        });

        // Filters
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.renderExplore(null, chip.dataset.filter);
            });
        });

        // Servings stepper
        document.getElementById('servings-minus')?.addEventListener('click', () => {
            if (State.servings > 1) {
                State.servings--;
                document.getElementById('servings-value').textContent = State.servings;
            }
        });

        document.getElementById('servings-plus')?.addEventListener('click', () => {
            if (State.servings < 12) {
                State.servings++;
                document.getElementById('servings-value').textContent = State.servings;
            }
        });
    },

    updateStats() {
        document.getElementById('xp-val').textContent = State.user.xp;
        document.getElementById('streak-val').textContent = State.user.streak;
        document.getElementById('fridge-count').textContent = State.user.fridge.length || '';
        document.getElementById('shopping-count').textContent = State.user.shopping.filter(s => !s.done).length || '';
        document.getElementById('favorites-count').textContent = State.user.favorites.length || '';
    },

    renderHome() {
        // Greeting
        const hour = new Date().getHours();
        let greeting = 'Salut';
        if (hour < 12) greeting = 'Bonjour';
        else if (hour < 18) greeting = 'Bon après-midi';
        else greeting = 'Bonsoir';
        
        document.getElementById('greeting').textContent = `${greeting}, ${State.user.username || 'Chef'} !`;

        // Daily menu preview
        this.renderDailyMenuPreview();

        // Challenge
        const challenge = DATA.challenges[Math.floor(Math.random() * DATA.challenges.length)];
        document.getElementById('challenge-title').textContent = challenge.title;

        // Feed
        this.renderFeed();
        
        // Stats
        this.updateStats();
    },

    renderDailyMenuPreview() {
        const container = document.getElementById('daily-menu-preview');
        
        if (!State.currentMenu) {
            container.innerHTML = `
                <div class="dmc-empty">
                    <span>🍽️</span>
                    <p>Génère ton menu personnalisé</p>
                    <button class="btn btn-primary bounce-click" onclick="openModal('modal-menu-gen')">Générer mon menu</button>
                </div>
            `;
            return;
        }

        let html = '<div class="dmc-meals">';
        
        if (State.currentMenu.starter) {
            html += this.renderMealPreview('Entrée', State.currentMenu.starter);
        }
        if (State.currentMenu.main) {
            html += this.renderMealPreview('Plat', State.currentMenu.main);
        }
        if (State.currentMenu.dessert) {
            html += this.renderMealPreview('Dessert', State.currentMenu.dessert);
        }
        
        html += '</div>';
        container.innerHTML = html;
    },

    renderMealPreview(type, recipe) {
        return `
            <div class="dmc-meal" onclick="openRecipeModal(${recipe.id})">
                <div class="dmc-meal-img" style="background-image: url(${recipe.img})"></div>
                <div class="dmc-meal-info">
                    <span class="dmc-meal-type">${type}</span>
                    <span class="dmc-meal-name">${recipe.name}</span>
                    <span class="dmc-meal-meta">⏱️ ${recipe.time}min • 🔥 ${recipe.cal}kcal</span>
                </div>
            </div>
        `;
    },

    renderMenuResult() {
        const container = document.getElementById('menu-result-content');
        if (!State.currentMenu) return;

        let html = '';
        
        if (State.currentMenu.starter) {
            html += `<h3 style="margin-bottom: 12px;">🥗 Entrée</h3>`;
            html += this.renderMenuRecipeCard(State.currentMenu.starter);
        }
        
        if (State.currentMenu.main) {
            html += `<h3 style="margin: 20px 0 12px;">🍽️ Plat principal</h3>`;
            html += this.renderMenuRecipeCard(State.currentMenu.main);
        }
        
        if (State.currentMenu.dessert) {
            html += `<h3 style="margin: 20px 0 12px;">🍰 Dessert</h3>`;
            html += this.renderMenuRecipeCard(State.currentMenu.dessert);
        }

        if (State.currentMenu.wine) {
            html += `
                <div class="glass-card" style="padding: 16px; margin-top: 20px;">
                    <h4>🍷 Accord vin suggéré</h4>
                    <p style="color: var(--text-muted); margin-top: 8px;">${State.currentMenu.wine}</p>
                </div>
            `;
        }

        container.innerHTML = html;

        // Bind start cooking button
        document.getElementById('btn-start-cooking-menu')?.addEventListener('click', () => {
            closeModal('modal-menu-result');
            if (State.currentMenu.main) {
                Cooking.start(State.currentMenu.main.id);
            }
        });
    },

    renderMenuRecipeCard(recipe) {
        return `
            <div class="dmc-meal" style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 16px;" onclick="openRecipeModal(${recipe.id})">
                <div class="dmc-meal-img" style="width: 80px; height: 80px; background-image: url(${recipe.img})"></div>
                <div class="dmc-meal-info">
                    <span class="dmc-meal-name" style="font-size: 16px;">${recipe.name}</span>
                    <span class="dmc-meal-meta">⏱️ ${recipe.time}min • 🔥 ${recipe.cal}kcal • ${recipe.cost}</span>
                    <span class="dmc-meal-meta">👨‍🍳 ${recipe.difficulty}</span>
                </div>
            </div>
        `;
    },

    renderFeed() {
        const container = document.getElementById('feed-list');
        container.innerHTML = DATA.posts.map((post, i) => `
            <div class="feed-card" data-index="${i}">
                <div class="feed-header">
                    <img src="${post.avatar}" class="feed-avatar">
                    <span class="feed-username">${post.user}</span>
                </div>
                <div class="feed-img-container" ondblclick="Feed.like(${i})">
                    <img src="${post.img}" class="feed-img">
                    <div class="heart-overlay">❤️</div>
                </div>
                <div class="feed-actions">
                    <span onclick="Feed.like(${i})" class="action-heart">🤍</span>
                    <span>💬</span>
                    <span>📤</span>
                </div>
                <div class="feed-caption">
                    <strong>${post.likes} j'aime</strong>
                    ${post.caption}
                </div>
            </div>
        `).join('');
    },

    renderExplore(search = null, filter = 'all') {
        const container = document.getElementById('recipes-grid');
        let recipes = [...DATA.recipes];

        if (search) {
            recipes = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (filter !== 'all') {
            recipes = recipes.filter(r => r.tags.includes(filter));
        }

        container.innerHTML = recipes.map(r => `
            <div class="recipe-card bounce-click" onclick="openRecipeModal(${r.id})">
                <div class="recipe-card-img" style="background-image: url(${r.img})"></div>
                <div class="recipe-card-info">
                    <div class="recipe-card-name">${r.name}</div>
                    <div class="recipe-card-meta">⏱️ ${r.time}min • ${r.cost}</div>
                </div>
            </div>
        `).join('');
    },

    renderSocial() {
        // League
        const league = DATA.leagues.slice().reverse().find(l => State.user.xp >= l.min) || DATA.leagues[0];
        const nextLeague = DATA.leagues[DATA.leagues.indexOf(league) + 1];
        
        document.getElementById('league-icon-big').textContent = league.icon;
        document.getElementById('league-name').textContent = `Ligue ${league.name}`;
        
        const leagueHero = document.getElementById('league-hero');
        leagueHero.style.background = `linear-gradient(135deg, ${league.color}22, transparent)`;
        document.querySelector('.league-glow').style.background = league.color;

        if (nextLeague) {
            const progress = ((State.user.xp - league.min) / (nextLeague.min - league.min)) * 100;
            document.getElementById('league-progress-fill').style.width = `${progress}%`;
            document.getElementById('league-next').textContent = `Encore ${nextLeague.min - State.user.xp} XP pour ${nextLeague.name}`;
        } else {
            document.getElementById('league-progress-fill').style.width = '100%';
            document.getElementById('league-next').textContent = 'Tu es au sommet ! 🏆';
        }

        // Leaderboard
        this.renderLeaderboard();
    },

    renderLeaderboard() {
        const container = document.getElementById('leaderboard-list');
        const fakeUsers = [];
        
        for (let i = 0; i < 10; i++) {
            fakeUsers.push({
                name: ['ChefMaster', 'CookingQueen', 'FoodieKing', 'TastyBites', 'YumYum', 'SpiceGirl', 'PastaLover', 'SushiFan', 'BurgerBoss', 'SaladKing'][i],
                xp: Math.floor(2500 - i * 200 + Math.random() * 100),
                avatar: `https://i.pravatar.cc/40?img=${i + 10}`
            });
        }

        // Insert user at position 5-8
        const userPos = Math.floor(Math.random() * 3) + 5;

        container.innerHTML = fakeUsers.slice(0, 10).map((user, i) => `
            <div class="lb-item ${i < 3 ? 'promo' : ''} ${i >= 8 ? 'danger' : ''}">
                <span class="lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</span>
                <img src="${user.avatar}" class="lb-avatar">
                <span class="lb-name">${user.name}</span>
                <span class="lb-xp">${user.xp} XP</span>
            </div>
        `).join('');

        // Update your position
        document.querySelector('.yp-rank').textContent = `#${userPos}`;
        document.querySelector('.yp-name').textContent = State.user.username || 'Toi';
        document.querySelector('.yp-xp').textContent = `${State.user.xp} XP`;
    },

    renderProfile() {
        document.getElementById('profile-name').textContent = `@${State.user.username || 'Guest'}`;
        document.getElementById('profile-lvl').textContent = State.user.level;
        document.getElementById('profile-title').textContent = State.user.profile?.name || 'Apprenti Cuisinier';
        
        const xpInLevel = State.user.xp % 100;
        document.getElementById('profile-xp-bar').style.width = `${xpInLevel}%`;
        document.getElementById('profile-xp-text').textContent = `${xpInLevel}/100 XP`;

        document.getElementById('stat-cooked').textContent = State.user.cooked;
        document.getElementById('stat-streak').textContent = State.user.streak;
        document.getElementById('stat-badges').textContent = State.user.badges.length;

        // Badges
        const badgesContainer = document.getElementById('badges-grid');
        badgesContainer.innerHTML = DATA.badges.map(badge => `
            <div class="badge-item ${State.user.badges.includes(badge.id) ? 'unlocked' : ''}" title="${badge.name}: ${badge.desc}">
                ${badge.emoji}
            </div>
        `).join('');
    },

    renderFridge() {
        const container = document.getElementById('fridge-list');
        const suggestions = document.getElementById('fridge-suggestions');

        // Suggestions
        const notInFridge = DATA.commonIngredients.filter(i => 
            !State.user.fridge.some(f => f.name.toLowerCase() === i.toLowerCase())
        );
        suggestions.innerHTML = notInFridge.slice(0, 8).map(item => `
            <span class="fridge-suggestion" onclick="Fridge.addItem('${item}')">${item}</span>
        `).join('');

        // Fridge items
        if (State.user.fridge.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>🧊</span>
                    <h3>Ton frigo est vide</h3>
                    <p>Ajoute des ingrédients pour des suggestions personnalisées</p>
                </div>
            `;
            return;
        }

        container.innerHTML = State.user.fridge.map((item, i) => `
            <div class="fridge-item">
                <span class="fridge-item-icon">${item.icon || '🥫'}</span>
                <div class="fridge-item-info">
                    <span class="fridge-item-name">${item.name}</span>
                    <span class="fridge-item-qty">${item.qty || ''}</span>
                </div>
                <button class="fridge-item-delete" onclick="Fridge.remove(${i})">×</button>
            </div>
        `).join('');
    },

    renderShopping() {
        const container = document.getElementById('shopping-list');

        if (State.user.shopping.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>🛒</span>
                    <h3>Liste vide</h3>
                    <p>Ajoute des articles à ta liste de courses</p>
                </div>
            `;
            return;
        }

        container.innerHTML = State.user.shopping.map((item, i) => `
            <div class="shopping-item ${item.done ? 'checked' : ''}">
                <input type="checkbox" ${item.done ? 'checked' : ''} onchange="Shopping.toggle(${i})">
                <span>${item.name}</span>
                <button class="shopping-item-delete" onclick="Shopping.remove(${i})">×</button>
            </div>
        `).join('');
    },

    renderFavorites() {
        const container = document.getElementById('favorites-list');

        if (State.user.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>❤️</span>
                    <h3>Pas encore de favoris</h3>
                    <p>Ajoute des recettes à tes favoris pour les retrouver facilement</p>
                </div>
            `;
            return;
        }

        container.innerHTML = State.user.favorites.map(id => {
            const recipe = DATA.recipes.find(r => r.id === id);
            if (!recipe) return '';
            return `
                <div class="favorite-item" onclick="openRecipeModal(${recipe.id})">
                    <div class="favorite-item-img" style="background-image: url(${recipe.img})"></div>
                    <div class="favorite-item-info">
                        <span class="favorite-item-name">${recipe.name}</span>
                        <span class="favorite-item-meta">⏱️ ${recipe.time}min • ${recipe.cost}</span>
                    </div>
                    <button class="favorite-item-remove" onclick="event.stopPropagation(); Favorites.remove(${recipe.id})">❌</button>
                </div>
            `;
        }).join('');
    },

    renderSettings() {
        document.getElementById('settings-username').value = State.user.username || '';
        document.getElementById('settings-email').value = State.user.email || '';
        document.getElementById('settings-diet').value = State.user.preferences.diet;
        
        document.getElementById('settings-notif-daily').checked = State.user.settings.notifications.daily;
        document.getElementById('settings-notif-streak').checked = State.user.settings.notifications.streak;
        document.getElementById('settings-notif-recipes').checked = State.user.settings.notifications.recipes;
        document.getElementById('settings-sounds').checked = State.user.settings.sounds;

        // Allergies
        State.user.preferences.allergies.forEach(allergy => {
            const checkbox = document.querySelector(`input[name="settings-allergy"][value="${allergy}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
};

// ============================================
// ONBOARDING MODULE
// ============================================
const Onboarding = {
    index: 0,

    init() {
        this.render();
        
        document.getElementById('ob-next').addEventListener('click', () => {
            if (this.index < DATA.onboarding.length - 1) {
                this.index++;
                this.update();
            } else {
                Router.go('quiz-choice');
                Quiz.initChoice();
            }
        });

        document.getElementById('ob-skip').addEventListener('click', () => {
            Router.go('auth');
        });
    },

    render() {
        const slider = document.getElementById('ob-slider');
        const dots = document.getElementById('ob-dots');

        slider.innerHTML = DATA.onboarding.map((slide, i) => `
            <div class="ob-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                <div class="ob-icon">${slide.icon}</div>
                <h2 class="ob-title">${slide.title}</h2>
                <p class="ob-text">${slide.text}</p>
            </div>
        `).join('');

        dots.innerHTML = DATA.onboarding.map((_, i) => `
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
            this.index === DATA.onboarding.length - 1 ? "C'est parti !" : "Continuer";
    }
};

// ============================================
// QUIZ MODULE
// ============================================
const Quiz = {
    initChoice() {
        document.querySelectorAll('.quiz-choice-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.quiz-choice-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                State.quizCount = parseInt(card.dataset.count);
            });
        });

        document.getElementById('quiz-start').addEventListener('click', () => {
            State.quizIndex = 0;
            State.quizLikes = [];
            Router.go('quiz');
            this.init();
        });
    },

    init() {
        this.renderCards();
        this.bindSwipe();
        this.updateProgress();

        document.getElementById('quiz-back').addEventListener('click', () => {
            Router.go('quiz-choice');
        });

        document.getElementById('quiz-love').addEventListener('click', () => this.swipe(true));
        document.getElementById('quiz-nope').addEventListener('click', () => this.swipe(false));
    },

    renderCards() {
        const stack = document.getElementById('quiz-stack');
        const items = DATA.quiz.slice(State.quizIndex, State.quizIndex + 3);

        stack.innerHTML = items.map((item, i) => `
            <div class="quiz-card" data-id="${item.id}" style="
                background-image: url(${item.img});
                z-index: ${100 - i};
                transform: scale(${1 - i * 0.05}) translateY(${i * 12}px);
            ">
                <div class="quiz-indicator like">LIKE</div>
                <div class="quiz-indicator nope">NOPE</div>
                <div class="card-content">
                    <h2>${item.name}</h2>
                    <p>${item.type}</p>
                </div>
            </div>
        `).join('');
    },

    bindSwipe() {
        const stack = document.getElementById('quiz-stack');
        let startX, startY, currentX, currentY, card, isDragging = false;

        const getCard = () => stack.querySelector('.quiz-card');

        stack.addEventListener('touchstart', (e) => {
            card = getCard();
            if (!card) return;
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            card.style.transition = 'none';
        });

        stack.addEventListener('touchmove', (e) => {
            if (!isDragging || !card) return;
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = currentX - startX;
            const diffY = currentY - startY;
            const rotate = diffX * 0.1;

            card.style.transform = `translateX(${diffX}px) translateY(${diffY}px) rotate(${rotate}deg)`;

            // Show indicators
            const likeIndicator = card.querySelector('.quiz-indicator.like');
            const nopeIndicator = card.querySelector('.quiz-indicator.nope');
            
            if (diffX > 50) {
                likeIndicator.style.opacity = Math.min((diffX - 50) / 100, 1);
                nopeIndicator.style.opacity = 0;
            } else if (diffX < -50) {
                nopeIndicator.style.opacity = Math.min((-diffX - 50) / 100, 1);
                likeIndicator.style.opacity = 0;
            } else {
                likeIndicator.style.opacity = 0;
                nopeIndicator.style.opacity = 0;
            }
        });

        stack.addEventListener('touchend', () => {
            if (!isDragging || !card) return;
            isDragging = false;
            
            const diffX = currentX - startX;
            card.style.transition = 'transform 0.3s var(--spring)';

            if (diffX > 100) {
                this.swipe(true);
            } else if (diffX < -100) {
                this.swipe(false);
            } else {
                card.style.transform = 'scale(1) translateY(0)';
                card.querySelector('.quiz-indicator.like').style.opacity = 0;
                card.querySelector('.quiz-indicator.nope').style.opacity = 0;
            }
        });

        // Mouse events for desktop
        stack.addEventListener('mousedown', (e) => {
            card = getCard();
            if (!card) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            card.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !card) return;
            currentX = e.clientX;
            currentY = e.clientY;
            
            const diffX = currentX - startX;
            const rotate = diffX * 0.1;
            card.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;

            const likeIndicator = card.querySelector('.quiz-indicator.like');
            const nopeIndicator = card.querySelector('.quiz-indicator.nope');
            
            if (diffX > 50) {
                likeIndicator.style.opacity = Math.min((diffX - 50) / 100, 1);
                nopeIndicator.style.opacity = 0;
            } else if (diffX < -50) {
                nopeIndicator.style.opacity = Math.min((-diffX - 50) / 100, 1);
                likeIndicator.style.opacity = 0;
            } else {
                likeIndicator.style.opacity = 0;
                nopeIndicator.style.opacity = 0;
            }
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging || !card) return;
            isDragging = false;
            
            const diffX = currentX - startX;
            card.style.transition = 'transform 0.3s var(--spring)';

            if (diffX > 100) {
                this.swipe(true);
            } else if (diffX < -100) {
                this.swipe(false);
            } else {
                card.style.transform = 'scale(1) translateY(0)';
            }
        });
    },

    swipe(liked) {
        const stack = document.getElementById('quiz-stack');
        const card = stack.querySelector('.quiz-card');
        if (!card) return;

        const direction = liked ? 1 : -1;
        card.style.transition = 'transform 0.4s var(--ease)';
        card.style.transform = `translateX(${direction * 150}vw) rotate(${direction * 30}deg)`;

        if (liked) {
            const item = DATA.quiz.find(q => q.id === parseInt(card.dataset.id));
            if (item) State.quizLikes.push(item);
        }

        State.quizIndex++;
        this.updateProgress();

        setTimeout(() => {
            if (State.quizIndex >= State.quizCount) {
                this.showPrefs();
            } else {
                this.renderCards();
            }
        }, 300);
    },

    updateProgress() {
        const progress = (State.quizIndex / State.quizCount) * 100;
        document.getElementById('quiz-progress').style.width = `${progress}%`;
        document.getElementById('quiz-counter').textContent = `${State.quizIndex}/${State.quizCount}`;
    },

    showPrefs() {
        Router.go('quiz-prefs');
        
        document.getElementById('prefs-done').addEventListener('click', () => {
            const diet = document.querySelector('input[name="diet"]:checked')?.value || 'omnivore';
            const allergies = [...document.querySelectorAll('input[name="allergy"]:checked')].map(c => c.value);
            const level = document.querySelector('input[name="level"]:checked')?.value || 'beginner';

            State.user.preferences = { diet, allergies, level };
            this.showResult();
        });
    },

    showResult() {
        Router.go('quiz-result');
        
        // Analyze likes to determine profile
        const typeCounts = { healthy: 0, comfort: 0, dessert: 0 };
        State.quizLikes.forEach(item => {
            if (typeCounts[item.type] !== undefined) {
                typeCounts[item.type]++;
            }
        });

        let profileIndex = 2; // Default: Healthy
        if (typeCounts.comfort > typeCounts.healthy && typeCounts.comfort > typeCounts.dessert) {
            profileIndex = Math.random() > 0.5 ? 0 : 4; // Italien or Asiatique
        } else if (typeCounts.dessert > typeCounts.healthy) {
            profileIndex = 3; // Gourmand
        }

        const profile = DATA.profiles[profileIndex];
        State.user.profile = profile;

        document.getElementById('result-emoji').textContent = profile.emoji;
        document.getElementById('result-name').textContent = profile.name;
        document.getElementById('result-desc').textContent = profile.desc;
        document.getElementById('result-tags').innerHTML = profile.tags.map(tag => 
            `<span class="result-tag">${tag}</span>`
        ).join('');

        // Confetti
        FX.confetti();

        document.getElementById('result-continue').addEventListener('click', () => {
            Router.go('auth');
        });
    }
};

// ============================================
// AUTH MODULE
// ============================================
const Auth = {
    isLogin: false,

    toggle() {
        Auth.isLogin = !Auth.isLogin;
        document.getElementById('group-username').style.display = Auth.isLogin ? 'none' : 'block';
        document.getElementById('auth-title').textContent = Auth.isLogin ? 'Content de te revoir !' : 'Crée ton compte';
        document.getElementById('auth-switch-text').textContent = Auth.isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?';
        document.getElementById('auth-toggle').textContent = Auth.isLogin ? "S'inscrire" : 'Se connecter';
    },

    submit() {
        const username = document.getElementById('input-username').value;
        const email = document.getElementById('input-email').value;
        const password = document.getElementById('input-password').value;

        if (!email || !password) {
            toast('Remplis tous les champs', 'error');
            return;
        }

        if (!Auth.isLogin && !username) {
            toast('Choisis un pseudo', 'error');
            return;
        }

        State.user.username = username || State.user.username || email.split('@')[0];
        State.user.email = email;
        State.save();

        State.addXP(100); // Bonus inscription
        toast('🎉 Bienvenue sur Yumr !', 'success');

        Router.go('home');
        UI.renderHome();
    }
};

// ============================================
// MENU GENERATOR MODULE
// ============================================
const MenuGenerator = {
    bindEvents() {
        document.getElementById('btn-generate-menu')?.addEventListener('click', () => {
            this.generate();
        });
    },

    generate() {
        const budget = document.querySelector('input[name="budget"]:checked')?.value || 'medium';
        const time = parseInt(document.querySelector('input[name="time"]:checked')?.value) || 30;
        const servings = State.servings;
        const cheese = document.getElementById('opt-cheese')?.checked;
        const wine = document.getElementById('opt-wine')?.checked;
        const useFridge = document.getElementById('opt-fridge')?.checked;
        
        const meals = [...document.querySelectorAll('input[name="meal"]:checked')].map(c => c.value);

        // Filter recipes
        let availableRecipes = DATA.recipes.filter(r => r.time <= time);
        
        // Budget filter
        if (budget === 'low') {
            availableRecipes = availableRecipes.filter(r => r.cost === '€');
        } else if (budget === 'high') {
            availableRecipes = availableRecipes.filter(r => r.cost !== '€');
        }

        // Build menu
        State.currentMenu = {};

        if (meals.includes('starter')) {
            const starters = availableRecipes.filter(r => r.type === 'starter');
            if (starters.length) {
                State.currentMenu.starter = starters[Math.floor(Math.random() * starters.length)];
            }
        }

        if (meals.includes('main')) {
            const mains = availableRecipes.filter(r => r.type === 'main');
            if (mains.length) {
                State.currentMenu.main = mains[Math.floor(Math.random() * mains.length)];
            }
        }

        if (meals.includes('dessert')) {
            const desserts = availableRecipes.filter(r => r.type === 'dessert');
            if (desserts.length) {
                State.currentMenu.dessert = desserts[Math.floor(Math.random() * desserts.length)];
            }
        }

        // Wine suggestion
        if (wine && State.currentMenu.main) {
            State.currentMenu.wine = State.currentMenu.main.wine || 'Un vin rouge léger';
        }

        State.currentMenu.servings = servings;
        State.currentMenu.generatedAt = new Date().toISOString();

        closeModal('modal-menu-gen');
        openModal('modal-menu-result');
        UI.renderMenuResult();
        UI.renderDailyMenuPreview();

        toast('✨ Menu généré !', 'success');
    }
};

// ============================================
// COOKING MODULE
// ============================================
const Cooking = {
    start(recipeId) {
        const recipe = DATA.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        State.currentRecipe = recipe;
        State.cookingStep = 0;

        Router.go('cooking');
        this.render();
    },

    render() {
        const recipe = State.currentRecipe;
        if (!recipe) return;

        document.getElementById('cooking-recipe-name').textContent = recipe.name;
        
        const isFav = State.user.favorites.includes(recipe.id);
        document.getElementById('cooking-fav').textContent = isFav ? '❤️' : '🤍';
        document.getElementById('cooking-fav').onclick = () => {
            Favorites.toggle(recipe.id);
            document.getElementById('cooking-fav').textContent = 
                State.user.favorites.includes(recipe.id) ? '❤️' : '🤍';
        };

        this.renderStep();
    },

    renderStep() {
        const recipe = State.currentRecipe;
        const step = recipe.steps[State.cookingStep];
        const totalSteps = recipe.steps.length;

        // Progress
        const progress = ((State.cookingStep + 1) / totalSteps) * 100;
        document.getElementById('cooking-progress-fill').style.width = `${progress}%`;
        document.getElementById('step-indicator').textContent = `ÉTAPE ${State.cookingStep + 1}/${totalSteps}`;

        // Step text
        document.getElementById('step-text').textContent = step.text;

        // Timer
        if (step.timer > 0) {
            document.getElementById('timer-container').style.display = 'block';
            this.resetTimer(step.timer * 60);
        } else {
            document.getElementById('timer-container').style.display = 'none';
        }

        // Buttons
        document.getElementById('step-prev').disabled = State.cookingStep === 0;
        document.getElementById('step-next').textContent = 
            State.cookingStep === totalSteps - 1 ? 'Terminer 🎉' : 'Suivant →';
    },

    resetTimer(seconds) {
        clearInterval(State.timerInterval);
        State.timerSeconds = seconds;
        this.updateTimerDisplay();
        
        const ring = document.getElementById('timer-ring');
        ring.style.strokeDashoffset = 283;
        ring.classList.remove('warning', 'danger');
        
        document.getElementById('timer-toggle').textContent = '▶';
    },

    toggleTimer() {
        if (State.timerInterval) {
            clearInterval(State.timerInterval);
            State.timerInterval = null;
            document.getElementById('timer-toggle').textContent = '▶';
        } else {
            const startSeconds = State.timerSeconds;
            document.getElementById('timer-toggle').textContent = '⏸';
            
            State.timerInterval = setInterval(() => {
                State.timerSeconds--;
                Cooking.updateTimerDisplay();
                
                const ring = document.getElementById('timer-ring');
                const progress = 283 - (State.timerSeconds / startSeconds) * 283;
                ring.style.strokeDashoffset = progress;

                if (State.timerSeconds <= 10) {
                    ring.classList.add('danger');
                } else if (State.timerSeconds <= 30) {
                    ring.classList.add('warning');
                }

                if (State.timerSeconds <= 0) {
                    clearInterval(State.timerInterval);
                    State.timerInterval = null;
                    toast('⏰ Timer terminé !', 'success');
                    document.getElementById('timer-toggle').textContent = '✓';
                }
            }, 1000);
        }
    },

    updateTimerDisplay() {
        const mins = Math.floor(State.timerSeconds / 60);
        const secs = State.timerSeconds % 60;
        document.getElementById('timer-display').textContent = 
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    prevStep() {
        if (State.cookingStep > 0) {
            clearInterval(State.timerInterval);
            State.timerInterval = null;
            State.cookingStep--;
            this.renderStep();
        }
    },

    nextStep() {
        clearInterval(State.timerInterval);
        State.timerInterval = null;

        if (State.cookingStep < State.currentRecipe.steps.length - 1) {
            State.cookingStep++;
            this.renderStep();
        } else {
            this.complete();
        }
    },

    complete() {
        State.user.cooked++;
        State.addXP(50);
        State.save();
        
        FX.confetti();
        toast('🎉 Bravo ! Recette terminée !', 'success');
        
        Router.go('home');
        UI.renderHome();
    }
};

// ============================================
// FRIDGE MODULE
// ============================================
const Fridge = {
    add() {
        const input = document.getElementById('fridge-input');
        const name = input.value.trim();
        if (!name) return;
        
        this.addItem(name);
        input.value = '';
    },

    addItem(name) {
        // Get emoji based on name
        const emojis = {
            'œufs': '🥚', 'oeuf': '🥚', 'lait': '🥛', 'beurre': '🧈',
            'poulet': '🍗', 'viande': '🥩', 'boeuf': '🥩',
            'tomate': '🍅', 'oignon': '🧅', 'ail': '🧄', 'carotte': '🥕',
            'pomme': '🍎', 'banane': '🍌', 'citron': '🍋',
            'fromage': '🧀', 'pain': '🍞', 'riz': '🍚', 'pâtes': '🍝',
            'poisson': '🐟', 'saumon': '🐟', 'crevette': '🦐'
        };
        
        const nameLower = name.toLowerCase();
        let icon = '🥫';
        for (const [key, emoji] of Object.entries(emojis)) {
            if (nameLower.includes(key)) {
                icon = emoji;
                break;
            }
        }

        State.user.fridge.push({ name, icon, addedAt: new Date().toISOString() });
        State.save();
        UI.renderFridge();
        UI.updateStats();
        toast('✅ Ajouté au frigo', 'success');
    },

    remove(index) {
        State.user.fridge.splice(index, 1);
        State.save();
        UI.renderFridge();
        UI.updateStats();
    }
};

// ============================================
// SHOPPING MODULE
// ============================================
const Shopping = {
    add() {
        const input = document.getElementById('shopping-input');
        const name = input.value.trim();
        if (!name) return;
        
        State.user.shopping.push({ name, done: false });
        State.user.totalShopping = (State.user.totalShopping || 0) + 1;
        State.save();
        input.value = '';
        UI.renderShopping();
        UI.updateStats();
    },

    toggle(index) {
        State.user.shopping[index].done = !State.user.shopping[index].done;
        State.save();
        UI.renderShopping();
        UI.updateStats();
    },

    remove(index) {
        State.user.shopping.splice(index, 1);
        State.save();
        UI.renderShopping();
        UI.updateStats();
    },

    clear() {
        if (confirm('Vider la liste ?')) {
            State.user.shopping = [];
            State.save();
            UI.renderShopping();
            UI.updateStats();
        }
    }
};

// ============================================
// FAVORITES MODULE
// ============================================
const Favorites = {
    toggle(recipeId) {
        const index = State.user.favorites.indexOf(recipeId);
        if (index > -1) {
            State.user.favorites.splice(index, 1);
            toast('Retiré des favoris');
        } else {
            State.user.favorites.push(recipeId);
            toast('❤️ Ajouté aux favoris', 'success');
        }
        State.save();
        UI.updateStats();
    },

    remove(recipeId) {
        const index = State.user.favorites.indexOf(recipeId);
        if (index > -1) {
            State.user.favorites.splice(index, 1);
            State.save();
            UI.renderFavorites();
            UI.updateStats();
        }
    }
};

// ============================================
// SETTINGS MODULE
// ============================================
const Settings = {
    save() {
        State.user.username = document.getElementById('settings-username').value || State.user.username;
        State.user.email = document.getElementById('settings-email').value || State.user.email;
        State.user.preferences.diet = document.getElementById('settings-diet').value;
        
        State.user.preferences.allergies = [...document.querySelectorAll('input[name="settings-allergy"]:checked')]
            .map(c => c.value);

        State.user.settings.notifications = {
            daily: document.getElementById('settings-notif-daily').checked,
            streak: document.getElementById('settings-notif-streak').checked,
            recipes: document.getElementById('settings-notif-recipes').checked
        };
        State.user.settings.sounds = document.getElementById('settings-sounds').checked;

        State.save();
        closeModal('modal-settings');
        toast('✅ Paramètres sauvegardés', 'success');
        UI.renderProfile();
    }
};

// ============================================
// FEED MODULE
// ============================================
const Feed = {
    like(index) {
        const card = document.querySelector(`.feed-card[data-index="${index}"]`);
        const heart = card.querySelector('.action-heart');
        const overlay = card.querySelector('.heart-overlay');

        heart.textContent = '❤️';
        heart.classList.add('heart-anim');
        
        overlay.style.opacity = '1';
        overlay.style.transform = 'scale(1)';
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0)';
            heart.classList.remove('heart-anim');
        }, 600);

        State.addXP(5);
    }
};

// ============================================
// FX ENGINE
// ============================================
const FX = {
    confetti() {
        const container = document.getElementById('particles-container');
        const colors = ['#FF6B35', '#FFD700', '#4ECB71', '#6C5DD3', '#FF4757'];

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = '-20px';
            particle.style.width = (Math.random() * 10 + 5) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 2 + 1) + 's';
            particle.style.animationDelay = (Math.random() * 0.5) + 's';
            container.appendChild(particle);

            setTimeout(() => particle.remove(), 4000);
        }
    }
};

// ============================================
// GLOBAL FUNCTIONS
// ============================================
function openModal(id) {
    document.getElementById(id)?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
    document.body.style.overflow = '';
}

function openRecipeModal(recipeId) {
    const recipe = DATA.recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    State.currentRecipe = recipe;

    document.getElementById('recipe-hero').style.backgroundImage = `url(${recipe.img})`;
    document.getElementById('recipe-title').textContent = recipe.name;
    document.getElementById('recipe-time').textContent = `⏱️ ${recipe.time}min`;
    document.getElementById('recipe-cal').textContent = `🔥 ${recipe.cal}kcal`;
    document.getElementById('recipe-cost').textContent = `💰 ${recipe.cost}`;
    document.getElementById('recipe-difficulty').textContent = `👨‍🍳 ${recipe.difficulty}`;

    document.getElementById('recipe-ingredients').innerHTML = recipe.ingredients
        .map(i => `<li>${i}</li>`).join('');

    document.getElementById('recipe-steps').innerHTML = recipe.steps
        .map(s => `<li>${s.text}</li>`).join('');

    if (recipe.wine) {
        document.getElementById('recipe-wine-section').style.display = 'block';
        document.getElementById('recipe-wine').textContent = recipe.wine;
    } else {
        document.getElementById('recipe-wine-section').style.display = 'none';
    }

    // Favorite button
    const isFav = State.user.favorites.includes(recipe.id);
    document.getElementById('recipe-fav-btn').textContent = isFav ? '❤️' : '🤍';
    document.getElementById('recipe-fav-btn').onclick = () => {
        Favorites.toggle(recipe.id);
        document.getElementById('recipe-fav-btn').textContent = 
            State.user.favorites.includes(recipe.id) ? '❤️' : '🤍';
    };

    // Actions
    document.getElementById('btn-add-to-shopping').onclick = () => {
        recipe.ingredients.forEach(ing => {
            State.user.shopping.push({ name: ing, done: false });
        });
        State.save();
        toast('🛒 Ingrédients ajoutés aux courses', 'success');
    };

    document.getElementById('btn-start-recipe').onclick = () => {
        closeModal('modal-recipe');
        Cooking.start(recipe.id);
    };

    openModal('modal-recipe');
}

function showXPPopup(amount) {
    const popup = document.getElementById('xp-popup');
    document.getElementById('xp-popup-amount').textContent = `+${amount} XP`;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 1500);
}

function showLevelUp(level) {
    document.getElementById('new-level').textContent = level;
    document.getElementById('levelup-overlay').classList.add('active');
    FX.confetti();
    State.checkBadges();
}

function toast(message, type = '') {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});
