/* YUMR V3 - Complete App */
document.addEventListener('DOMContentLoaded', () => {

// ==================== STATE ====================
const state = {
    user: null,
    token: localStorage.getItem('yumr_token'),
    isRegister: false,
    setupStep: 1,
    quizTotal: 20,
    diet: 'omnivore',
    allergies: [],
    disliked: [],
    goal: 'maintain',
    currentQ: 0,
    answers: [],
    quizStreak: 0,
    streak: parseInt(localStorage.getItem('yumr_streak') || '1'),
    xp: parseInt(localStorage.getItem('yumr_xp') || '0'),
    level: 1,
    profile: null,
    fridge: [],
    favorites: JSON.parse(localStorage.getItem('yumr_fav') || '[]'),
    shopping: JSON.parse(localStorage.getItem('yumr_shop') || '[]'),
    posts: JSON.parse(localStorage.getItem('yumr_posts') || '[]'),
    notifications: [],
    badges: [],
    featuredBadges: JSON.parse(localStorage.getItem('yumr_featured') || '[0,1,2]'),
    todayMenu: null,
    currentPost: null
};
state.level = Math.floor(state.xp / 100) + 1;

// ==================== DATA ====================
const FOODS_TO_DISLIKE = {
    veggies: ['Artichaut','Asperge','Aubergine','Betterave','Brocoli','Carotte','Céleri','Champignon','Chou','Chou-fleur','Concombre','Courgette','Endive','Épinard','Fenouil','Haricot vert','Navet','Oignon','Poireau','Poivron','Radis','Salade','Tomate','Ail','Échalote'],
    fruits: ['Abricot','Ananas','Avocat','Banane','Cerise','Citron','Clémentine','Figue','Fraise','Framboise','Kiwi','Litchi','Mangue','Melon','Myrtille','Nectarine','Orange','Pamplemousse','Pastèque','Pêche','Poire','Pomme','Prune','Raisin'],
    proteins: ['Agneau','Bœuf','Boudin','Canard','Cheval','Foie','Lapin','Mouton','Porc','Poulet','Rognons','Tripes','Veau','Cabillaud','Crevette','Homard','Huître','Moule','Saumon','Thon','Anchois','Sardine'],
    dairy: ['Beurre','Bleu','Brie','Camembert','Chèvre','Comté','Crème fraîche','Emmental','Feta','Fromage blanc','Gruyère','Lait','Mascarpone','Mozzarella','Parmesan','Raclette','Roquefort','Yaourt'],
    other: ['Ail','Anchois','Câpres','Champignon','Coriandre','Cornichon','Curry','Gingembre','Menthe','Moutarde','Olive','Persil','Piment','Wasabi']
};

const QUIZ_ITEMS = [
    {name:"Pizza Margherita",emoji:"🍕",desc:"Tomate, mozzarella, basilic",img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",tags:["italien","fromage"]},
    {name:"Sushi varié",emoji:"🍣",desc:"Assortiment de poissons crus",img:"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",tags:["japonais","poisson"]},
    {name:"Burger gourmet",emoji:"🍔",desc:"Bœuf, cheddar, bacon",img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",tags:["americain","viande"]},
    {name:"Pad Thaï",emoji:"🍜",desc:"Nouilles sautées aux crevettes",img:"https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",tags:["thai","épicé"]},
    {name:"Salade César",emoji:"🥗",desc:"Romaine, parmesan, croûtons",img:"https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400",tags:["healthy","léger"]},
    {name:"Tacos al pastor",emoji:"🌮",desc:"Porc mariné, ananas, coriandre",img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",tags:["mexicain","épicé"]},
    {name:"Ramen tonkotsu",emoji:"🍜",desc:"Bouillon de porc, œuf mollet",img:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",tags:["japonais","réconfortant"]},
    {name:"Croissant beurre",emoji:"🥐",desc:"Feuilleté pur beurre",img:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",tags:["français","sucré"]},
    {name:"Poke bowl",emoji:"🥗",desc:"Saumon, avocat, riz",img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",tags:["hawaien","healthy"]},
    {name:"Tiramisu",emoji:"🍰",desc:"Mascarpone, café, cacao",img:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",tags:["italien","dessert"]},
    {name:"Curry indien",emoji:"🍛",desc:"Poulet tikka masala",img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",tags:["indien","épicé"]},
    {name:"Pâtes carbonara",emoji:"🍝",desc:"Guanciale, œuf, pecorino",img:"https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",tags:["italien","crémeux"]},
    {name:"Bibimbap",emoji:"🍚",desc:"Riz, légumes, œuf, bœuf",img:"https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400",tags:["coréen","healthy"]},
    {name:"Crêpe Nutella",emoji:"🥞",desc:"Nutella, banane, chantilly",img:"https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400",tags:["français","sucré"]},
    {name:"Falafel",emoji:"🧆",desc:"Pois chiches, houmous, pita",img:"https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400",tags:["libanais","végé"]},
    {name:"Fish & Chips",emoji:"🐟",desc:"Cabillaud pané, frites",img:"https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400",tags:["anglais","frit"]},
    {name:"Paella",emoji:"🥘",desc:"Riz, fruits de mer, safran",img:"https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400",tags:["espagnol","festif"]},
    {name:"Cheesecake",emoji:"🍰",desc:"New York style",img:"https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400",tags:["americain","dessert"]},
    {name:"Pho vietnamien",emoji:"🍲",desc:"Bouillon bœuf, nouilles",img:"https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",tags:["vietnamien","réconfortant"]},
    {name:"Avocado toast",emoji:"🥑",desc:"Pain complet, avocat, œuf",img:"https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",tags:["brunch","healthy"]},
    {name:"Steak frites",emoji:"🥩",desc:"Entrecôte, frites maison",img:"https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400",tags:["français","viande"]},
    {name:"Lasagne",emoji:"🍝",desc:"Bolognaise, béchamel",img:"https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400",tags:["italien","fromage"]},
    {name:"Smoothie bowl",emoji:"🥣",desc:"Açaï, fruits, granola",img:"https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",tags:["healthy","sucré"]},
    {name:"Gyoza",emoji:"🥟",desc:"Raviolis japonais grillés",img:"https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400",tags:["japonais","croustillant"]},
    {name:"Brownie",emoji:"🍫",desc:"Chocolat fondant, noix",img:"https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400",tags:["américain","dessert"]},
    {name:"Couscous",emoji:"🥘",desc:"Semoule, légumes, merguez",img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",tags:["maghrébin","épicé"]},
    {name:"Croque-monsieur",emoji:"🥪",desc:"Jambon, fromage gratiné",img:"https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400",tags:["français","fromage"]},
    {name:"Tartare de bœuf",emoji:"🥩",desc:"Bœuf cru, câpres, œuf",img:"https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",tags:["français","cru"]},
    {name:"Pancakes",emoji:"🥞",desc:"Sirop d'érable, myrtilles",img:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",tags:["américain","sucré"]},
    {name:"Soupe miso",emoji:"🍲",desc:"Tofu, algues, ciboule",img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",tags:["japonais","léger"]}
];

const RECIPES = [
    {id:1,name:"Poulet rôti",type:"main",time:45,cost:"€€",img:"https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",ingredients:["1 poulet","Herbes","Beurre","Ail"],steps:["Préchauffer à 200°C","Badigeonner","Enfourner 45 min"],calories:450},
    {id:2,name:"Salade César",type:"starter",time:15,cost:"€",img:"https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400",ingredients:["Laitue romaine","Parmesan","Croûtons","Sauce César"],steps:["Laver","Préparer sauce","Mélanger"],calories:280},
    {id:3,name:"Tiramisu",type:"dessert",time:30,cost:"€€",img:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",ingredients:["Mascarpone","Café","Biscuits","Cacao"],steps:["Préparer café","Monter crème","Alterner couches"],calories:420},
    {id:4,name:"Carbonara",type:"main",time:20,cost:"€",img:"https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",ingredients:["Spaghetti","Guanciale","Œufs","Pecorino"],steps:["Cuire pâtes","Faire revenir","Assembler"],calories:520},
    {id:5,name:"Buddha bowl",type:"main",time:25,cost:"€",img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",ingredients:["Quinoa","Pois chiches","Avocat","Légumes"],steps:["Cuire quinoa","Rôtir","Assembler"],calories:380},
    {id:6,name:"Tarte pommes",type:"dessert",time:50,cost:"€",img:"https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400",ingredients:["Pâte","Pommes","Sucre","Cannelle"],steps:["Étaler","Disposer","Enfourner"],calories:320},
    {id:7,name:"Risotto",type:"main",time:35,cost:"€€",img:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",ingredients:["Riz arborio","Champignons","Parmesan","Bouillon"],steps:["Revenir","Ajouter riz","Mouiller"],calories:450},
    {id:8,name:"Soupe miso",type:"starter",time:15,cost:"€",img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",ingredients:["Pâte miso","Tofu","Algues","Ciboule"],steps:["Chauffer","Diluer","Ajouter"],calories:85}
];

const FRIDGE_INIT = [
    {id:1,name:"Tomates",icon:"🍅",qty:"500g",cat:"veggies",exp:new Date(Date.now()+5*24*60*60*1000)},
    {id:2,name:"Poulet",icon:"🍗",qty:"400g",cat:"meat",exp:new Date(Date.now()+2*24*60*60*1000)},
    {id:3,name:"Lait",icon:"🥛",qty:"1L",cat:"dairy",exp:new Date(Date.now()+7*24*60*60*1000)},
    {id:4,name:"Œufs",icon:"🥚",qty:"6",cat:"other",exp:new Date(Date.now()+14*24*60*60*1000)},
    {id:5,name:"Pommes",icon:"🍎",qty:"4",cat:"fruits",exp:new Date(Date.now()+10*24*60*60*1000)},
    {id:6,name:"Salade",icon:"🥬",qty:"1",cat:"veggies",exp:new Date(Date.now()+3*24*60*60*1000)}
];

const LEADERBOARD = [
    {rank:1,name:"MasterChef_",pts:2450,img:1},{rank:2,name:"CookingQueen",pts:2280,img:2},{rank:3,name:"FoodieKing",pts:2150,img:3},
    {rank:4,name:"ChefAlex",pts:1980,img:4},{rank:5,name:"TastyBites",pts:1850,img:5},{rank:6,name:"GourmetGal",pts:1720,img:6},
    {rank:7,name:"SpiceMaster",pts:1650,img:7},{rank:8,name:"YumYumChef",pts:1580,img:8},{rank:9,name:"FoodLover99",pts:1490,img:9},{rank:10,name:"ChefNoob",pts:1420,img:10}
];

const ALL_BADGES = [
    {id:0,name:"Premier plat",emoji:"🍳",desc:"Cuisine ta première recette",cat:"cooking",unlocked:false},
    {id:1,name:"Chef débutant",emoji:"👨‍🍳",desc:"Cuisine 5 recettes",cat:"cooking",unlocked:false},
    {id:2,name:"Cordon bleu",emoji:"🎖️",desc:"Cuisine 25 recettes",cat:"cooking",unlocked:false},
    {id:3,name:"Master Chef",emoji:"⭐",desc:"Cuisine 100 recettes",cat:"cooking",unlocked:false},
    {id:4,name:"Pâtissier",emoji:"🧁",desc:"Cuisine 10 desserts",cat:"cooking",unlocked:false},
    {id:5,name:"Healthy",emoji:"🥗",desc:"Cuisine 10 plats healthy",cat:"cooking",unlocked:false},
    {id:6,name:"World Food",emoji:"🌍",desc:"5 cuisines différentes",cat:"cooking",unlocked:false},
    {id:7,name:"Speed Cook",emoji:"⚡",desc:"10 plats en -15min",cat:"cooking",unlocked:false},
    {id:8,name:"Influenceur",emoji:"📸",desc:"Publie 10 posts",cat:"social",unlocked:false},
    {id:9,name:"Populaire",emoji:"❤️",desc:"Reçois 50 likes",cat:"social",unlocked:false},
    {id:10,name:"Viral",emoji:"🔥",desc:"Un post avec 100+ likes",cat:"social",unlocked:false},
    {id:11,name:"Communauté",emoji:"🤝",desc:"10 abonnés",cat:"social",unlocked:false},
    {id:12,name:"Star",emoji:"⭐",desc:"100 abonnés",cat:"social",unlocked:false},
    {id:13,name:"Parrain",emoji:"🎁",desc:"Parraine un ami",cat:"social",unlocked:false},
    {id:14,name:"Niveau 5",emoji:"5️⃣",desc:"Atteins le niveau 5",cat:"progress",unlocked:false},
    {id:15,name:"Niveau 10",emoji:"🔟",desc:"Atteins le niveau 10",cat:"progress",unlocked:false},
    {id:16,name:"Streak 7",emoji:"🔥",desc:"7 jours de streak",cat:"progress",unlocked:false},
    {id:17,name:"Streak 30",emoji:"💪",desc:"30 jours de streak",cat:"progress",unlocked:false},
    {id:18,name:"XP Master",emoji:"✨",desc:"Gagne 1000 XP",cat:"progress",unlocked:false},
    {id:19,name:"Ligue Or",emoji:"🥇",desc:"Atteins la ligue Or",cat:"progress",unlocked:false},
    {id:20,name:"Champion",emoji:"🏆",desc:"1ère place en ligue",cat:"progress",unlocked:false},
    {id:21,name:"Noctambule",emoji:"🌙",desc:"Cuisine après minuit",cat:"secret",unlocked:false},
    {id:22,name:"Early Bird",emoji:"🐤",desc:"Cuisine avant 6h",cat:"secret",unlocked:false},
    {id:23,name:"Pizza Time",emoji:"🍕",desc:"Swipe 10 pizzas",cat:"secret",unlocked:false},
    {id:24,name:"Frigo vide",emoji:"🧊",desc:"Vide ton frigo",cat:"secret",unlocked:false},
    {id:25,name:"Explorer",emoji:"🗺️",desc:"Visite tous les onglets",cat:"secret",unlocked:false},
    {id:26,name:"Perfectionniste",emoji:"💯",desc:"Profil 100%",cat:"secret",unlocked:false}
];
state.badges = ALL_BADGES;

const SAMPLE_POSTS = [
    {id:1,user:"ChefAlex",userId:101,avatar:"https://i.pravatar.cc/44?img=4",img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",caption:"Mon poke bowl 🥗 #healthy",likes:42,comments:[{user:"Marie",text:"Trop beau!"}],time:"2h"},
    {id:2,user:"FoodieKing",userId:102,avatar:"https://i.pravatar.cc/44?img=3",img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",caption:"Pizza maison 🍕",likes:87,comments:[],time:"5h"},
    {id:3,user:"CookingQueen",userId:103,avatar:"https://i.pravatar.cc/44?img=2",img:"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600",caption:"Dessert du dimanche 🍰",likes:156,comments:[{user:"Tom",text:"Recette?"}],time:"1j"}
];

const SAMPLE_USERS = [
    {id:101,name:"ChefAlex",avatar:"https://i.pravatar.cc/80?img=4",followers:234,following:89,posts:12,bio:"Passionné de cuisine 🍳"},
    {id:102,name:"FoodieKing",avatar:"https://i.pravatar.cc/80?img=3",followers:1205,following:156,posts:45,bio:"Food lover | Paris"},
    {id:103,name:"CookingQueen",avatar:"https://i.pravatar.cc/80?img=2",followers:3420,following:230,posts:89,bio:"Recettes healthy 🥗"}
];

const PROFILES = [
    {name:"L'Italien",emoji:"🍝",desc:"Tu adores les saveurs méditerranéennes",tags:["Pasta","Fromage","Méditerranéen"]},
    {name:"L'Aventurier",emoji:"🌶️",desc:"Tu aimes découvrir de nouvelles saveurs",tags:["Épicé","Exotique","Curieux"]},
    {name:"Le Healthy",emoji:"🥗",desc:"Tu privilégies une alimentation saine",tags:["Healthy","Léger","Équilibré"]},
    {name:"Le Gourmand",emoji:"🍰",desc:"Tu ne résistes pas aux desserts",tags:["Sucré","Desserts","Gourmand"]},
    {name:"Le Classique",emoji:"🍖",desc:"Tu apprécies la cuisine traditionnelle",tags:["Traditionnel","Viande","Réconfortant"]}
];

const NOTIFICATIONS = [
    {id:1,icon:"🔥",text:"Ta streak continue !",time:"2h",unread:true},
    {id:2,icon:"❤️",text:"ChefAlex a aimé ton post",time:"5h",unread:true},
    {id:3,icon:"🏆",text:"Tu es monté en ligue !",time:"1j",unread:false},
    {id:4,icon:"🎯",text:"Nouveau défi disponible",time:"1j",unread:false}
];
state.notifications = NOTIFICATIONS;

// ==================== HELPERS ====================
const $=id=>document.getElementById(id);
const $$=sel=>document.querySelectorAll(sel);
const show=el=>{if(el)el.classList.add('active');};
const hide=el=>{if(el)el.classList.remove('active');};
const showScreen=id=>{$$('.screen').forEach(s=>hide(s));show($(id));};
const openModal=id=>{show($(id));document.body.style.overflow='hidden';};
const closeModal=id=>{hide($(id));document.body.style.overflow='';};

function toast(msg,type=''){const t=document.createElement('div');t.className=`toast ${type}`;t.textContent=msg;$('toasts').appendChild(t);setTimeout(()=>t.remove(),3000);}
function showXP(amount){$('xp-amount').textContent=`+${amount} XP`;$('xp-popup').classList.add('show');setTimeout(()=>$('xp-popup').classList.remove('show'),1500);state.xp+=amount;localStorage.setItem('yumr_xp',state.xp);updateStats();checkLevelUp();}
function checkLevelUp(){const newLevel=Math.floor(state.xp/100)+1;if(newLevel>state.level){state.level=newLevel;$('new-lv').textContent=state.level;$('levelup').classList.add('show');}}
function updateStats(){
    if($('h-xp'))$('h-xp').textContent=state.xp;
    if($('h-streak'))$('h-streak').textContent=state.streak;
    if($('s-level'))$('s-level').textContent=state.level;
    if($('s-streak'))$('s-streak').textContent=state.streak;
    if($('s-badges'))$('s-badges').textContent=state.badges.filter(b=>b.unlocked).length;
    if($('p-lv'))$('p-lv').textContent=state.level;
    if($('xp-lv'))$('xp-lv').textContent=state.level;
    if($('ps-xp'))$('ps-xp').textContent=state.xp;
    if($('ps-posts'))$('ps-posts').textContent=state.posts.length;
    const xpMod=state.xp%100;
    if($('xp-fill'))$('xp-fill').style.width=`${xpMod}%`;
    if($('xp-cur'))$('xp-cur').textContent=xpMod;
    if($('xp-max'))$('xp-max').textContent=100;
}

// ==================== INIT ====================
if(state.token){
    state.user=JSON.parse(localStorage.getItem('yumr_user')||'{"username":"Chef"}');
    setTimeout(()=>initMainApp(),2000);
}else{
    setTimeout(()=>showScreen('onboarding'),2000);
}

// ==================== ONBOARDING ====================
let obSlide=0;
$('ob-next').addEventListener('click',()=>{
    obSlide++;
    if(obSlide>=3){showScreen('quiz-choice');}
    else{$$('.ob-slide').forEach((s,i)=>s.classList.toggle('active',i===obSlide));$$('.ob-dots .dot').forEach((d,i)=>d.classList.toggle('active',i===obSlide));}
});
$('ob-login').addEventListener('click',()=>{state.isRegister=false;showScreen('auth');updateAuthUI();});

// ==================== QUIZ CHOICE ====================
$$('.qc-opt').forEach(opt=>{opt.addEventListener('click',()=>{$$('.qc-opt').forEach(o=>o.classList.remove('selected'));opt.classList.add('selected');state.quizTotal=parseInt(opt.dataset.count);});});
$('qc-start').addEventListener('click',()=>startQuiz());
$('qc-back').addEventListener('click',()=>showScreen('onboarding'));

// ==================== AUTH ====================
function updateAuthUI(){
    $('auth-title').textContent=state.isRegister?'Créer un compte':'Connexion';
    $('auth-switch-text').textContent=state.isRegister?'Déjà un compte ?':'Pas encore de compte ?';
    $('auth-toggle').textContent=state.isRegister?'Se connecter':"S'inscrire";
    $('field-username').classList.toggle('hidden',!state.isRegister);
}
$('auth-toggle').addEventListener('click',()=>{state.isRegister=!state.isRegister;updateAuthUI();});
$('auth-back').addEventListener('click',()=>{state.profile?showScreen('result'):showScreen('onboarding');});
$('auth-form').addEventListener('submit',e=>{
    e.preventDefault();
    const email=$('in-email').value,pass=$('in-pass').value,username=$('in-username').value;
    if(!email||!pass){$('auth-error').textContent='Remplis tous les champs';return;}
    state.user={username:username||email.split('@')[0],email};
    localStorage.setItem('yumr_user',JSON.stringify(state.user));
    if(state.isRegister){showScreen('setup');}
    else{state.token='token';localStorage.setItem('yumr_token',state.token);initMainApp();}
});

// ==================== SETUP ====================
function updateSetupSteps(){$$('.step').forEach((s,i)=>s.classList.toggle('active',i<state.setupStep));$$('.setup-page').forEach((p,i)=>p.classList.toggle('active',i===state.setupStep-1));}
function renderDislikeSection(){
    let html='';
    Object.entries(FOODS_TO_DISLIKE).forEach(([key,items])=>{
        const icons={veggies:'🥬',fruits:'🍎',proteins:'🥩',dairy:'🧀',other:'🌶️'};
        const names={veggies:'Légumes',fruits:'Fruits',proteins:'Viandes & Poissons',dairy:'Produits laitiers',other:'Autres'};
        html+=`<div class="dislike-section"><div class="dislike-header"><h3>${icons[key]} ${names[key]}</h3><button class="select-all" data-group="${key}">Tout sélectionner</button></div><div class="dislike-wrap" id="dislike-${key}">${items.map(i=>`<label class="chip-opt"><input type="checkbox" value="${i}"><span>${i}</span></label>`).join('')}</div></div>`;
    });
    $('dislike-container').innerHTML=html;
    $$('.select-all').forEach(btn=>{btn.addEventListener('click',()=>{const group=btn.dataset.group;const checks=$(`dislike-${group}`).querySelectorAll('input');const allChecked=[...checks].every(c=>c.checked);checks.forEach(c=>c.checked=!allChecked);btn.textContent=allChecked?'Tout sélectionner':'Tout désélectionner';});});
}
renderDislikeSection();
$('dislike-search').addEventListener('input',e=>{
    const val=e.target.value.toLowerCase();
    $$('.dislike-wrap label').forEach(l=>{l.style.display=l.textContent.toLowerCase().includes(val)?'':'none';});
});
$('setup-next-1').addEventListener('click',()=>{state.diet=document.querySelector('input[name="diet"]:checked').value;state.allergies=[...document.querySelectorAll('input[name="allergy"]:checked')].map(c=>c.value);state.setupStep=2;updateSetupSteps();});
$('setup-back-2').addEventListener('click',()=>{state.setupStep=1;updateSetupSteps();});
$('setup-next-2').addEventListener('click',()=>{state.goal=document.querySelector('input[name="goal"]:checked').value;state.setupStep=3;updateSetupSteps();});
$('setup-back-3').addEventListener('click',()=>{state.setupStep=2;updateSetupSteps();});
$('setup-finish').addEventListener('click',()=>{state.disliked=[...$$('#dislike-container input:checked')].map(c=>c.value);localStorage.setItem('yumr_prefs',JSON.stringify({diet:state.diet,allergies:state.allergies,goal:state.goal,disliked:state.disliked}));state.token='token';localStorage.setItem('yumr_token',state.token);initMainApp();});

// ==================== QUIZ ====================
function startQuiz(){showScreen('quiz');state.currentQ=0;state.answers=[];state.quizStreak=0;loadQuestion();}
function loadQuestion(){
    if(state.currentQ>=state.quizTotal){finishQuiz();return;}
    const item=QUIZ_ITEMS[state.currentQ%QUIZ_ITEMS.length];
    const card=$('quiz-card');
    card.classList.remove('left','right','hint-left','hint-right');
    card.style.transform='';
    $('card-img').style.backgroundImage=`url(${item.img})`;
    $('card-emoji').textContent=item.emoji;
    $('card-q').textContent=item.name;
    $('card-desc').textContent=item.desc;
    $('quiz-count').textContent=`${state.currentQ+1}/${state.quizTotal}`;
    $('quiz-prog-fill').style.width=`${(state.currentQ/state.quizTotal)*100}%`;
    $('q-streak').textContent=state.quizStreak;
}
function answerQuiz(liked){
    const card=$('quiz-card');
    card.classList.add(liked?'right':'left');
    state.answers.push({item:QUIZ_ITEMS[state.currentQ%QUIZ_ITEMS.length],liked});
    if(liked)state.quizStreak++;
    setTimeout(()=>{state.currentQ++;loadQuestion();},400);
}
let startX=0,currentX=0,isDragging=false;
const card=$('quiz-card');
card.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;isDragging=true;card.classList.add('dragging');});
card.addEventListener('touchmove',e=>{if(!isDragging)return;currentX=e.touches[0].clientX;const diff=currentX-startX;card.style.transform=`translateX(${diff}px) rotate(${diff*0.05}deg)`;card.classList.toggle('hint-left',diff<-50);card.classList.toggle('hint-right',diff>50);});
card.addEventListener('touchend',()=>{if(!isDragging)return;isDragging=false;card.classList.remove('dragging');const diff=currentX-startX;if(Math.abs(diff)>100){answerQuiz(diff>0);}else{card.style.transform='';card.classList.remove('hint-left','hint-right');}});
$('btn-nope').addEventListener('click',()=>answerQuiz(false));
$('btn-love').addEventListener('click',()=>answerQuiz(true));
$('quiz-close').addEventListener('click',()=>{if(confirm('Quitter ?'))showScreen('onboarding');});

function finishQuiz(){
    const likedTags=state.answers.filter(a=>a.liked).flatMap(a=>a.item.tags);
    const tagCounts={};likedTags.forEach(t=>tagCounts[t]=(tagCounts[t]||0)+1);
    let profileIndex=0;
    if(tagCounts['italien']>3)profileIndex=0;
    else if(tagCounts['épicé']>2)profileIndex=1;
    else if(tagCounts['healthy']>2)profileIndex=2;
    else if(tagCounts['sucré']>2||tagCounts['dessert']>2)profileIndex=3;
    else profileIndex=4;
    state.profile=PROFILES[profileIndex];
    showScreen('result');
    $('res-emoji').textContent=state.profile.emoji;
    $('res-title').textContent=state.profile.name;
    $('res-desc').textContent=state.profile.desc;
    $('res-tags').innerHTML=state.profile.tags.map(t=>`<span>${t}</span>`).join('');
    createConfetti();
    setTimeout(()=>showXP(100),1000);
}
function createConfetti(){const c=$('confetti');c.innerHTML='';const colors=['#FF6B35','#FFD166','#4ECB71','#FF4757'];for(let i=0;i<40;i++){const d=document.createElement('div');d.style.cssText=`position:absolute;width:8px;height:8px;background:${colors[i%colors.length]};left:${Math.random()*100}%;top:-10px;border-radius:${Math.random()>.5?'50%':'2px'};animation:fall ${2+Math.random()*2}s linear forwards;`;c.appendChild(d);}}
const confettiStyle=document.createElement('style');confettiStyle.textContent='@keyframes fall{to{transform:translateY(100vh) rotate(720deg);opacity:0;}}';document.head.appendChild(confettiStyle);

$('res-continue').addEventListener('click',()=>{state.isRegister=true;showScreen('auth');updateAuthUI();});
$('res-skip').addEventListener('click',()=>{state.user={username:'Invité',email:''};state.token='guest';localStorage.setItem('yumr_token',state.token);localStorage.setItem('yumr_user',JSON.stringify(state.user));initMainApp();});

// ==================== MAIN APP ====================
function initMainApp(){
    showScreen('main');
    state.fridge=JSON.parse(localStorage.getItem('yumr_fridge'))||[...FRIDGE_INIT];
    if($('u-name'))$('u-name').textContent=state.user?.username||'Chef';
    if($('p-name'))$('p-name').textContent='@'+(state.user?.username||'chef').toLowerCase();
    updateStats();
    renderRecipes();
    renderFeed();
    renderLeagues();
    renderBadges();
    updateFridgeCount();
    updateNotifDot();
}

// ==================== NAVIGATION ====================
$$('.nav-btn[data-tab]').forEach(btn=>{
    btn.addEventListener('click',()=>{
        $$('.nav-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        $$('.tab').forEach(t=>t.classList.remove('active'));
        $(`tab-${btn.dataset.tab}`).classList.add('active');
    });
});
$('nav-post').addEventListener('click',()=>openPostModal());

// ==================== MODALS ====================
$$('[data-modal]').forEach(btn=>{btn.addEventListener('click',()=>{const id=btn.dataset.modal;openModal(id);initModal(id);});});
$$('[data-close]').forEach(btn=>{btn.addEventListener('click',()=>closeModal(btn.dataset.close));});
$$('.modal-bg').forEach(bg=>{bg.addEventListener('click',()=>closeModal(bg.dataset.close));});
$('close-lv').addEventListener('click',()=>$('levelup').classList.remove('show'));

function initModal(id){
    switch(id){
        case'm-streak':renderStreakModal();break;
        case'm-xp':renderXPModal();break;
        case'm-notifs':renderNotifs();break;
        case'm-fridge':renderFridge();break;
        case'm-shopping':renderShopping();break;
        case'm-badges':renderBadgesModal();break;
        case'm-prefs':renderPrefs();break;
        case'm-settings':renderSettings();break;
        case'm-premium':renderPremium();break;
        case'm-referral':renderReferral();break;
        case'm-challenges':renderChallenges();break;
    }
}

// Header buttons
$('h-streak-btn').addEventListener('click',()=>{openModal('m-streak');renderStreakModal();});
$('h-xp-btn').addEventListener('click',()=>{openModal('m-xp');renderXPModal();});
$('h-notif-btn').addEventListener('click',()=>{openModal('m-notifs');renderNotifs();});

function renderStreakModal(){
    const days=['L','M','M','J','V','S','D'];
    const today=new Date().getDay();
    let cal=days.map((d,i)=>`<div class="streak-day ${i<today||(i===today&&state.streak>0)?'done':''}"><span>${d}</span>${i<today||(i===today&&state.streak>0)?'🔥':''}</div>`).join('');
    $('streak-content').innerHTML=`<div class="streak-modal"><div style="font-size:64px;text-align:center">🔥</div><h2 style="text-align:center;margin:16px 0">${state.streak} jour${state.streak>1?'s':''} de streak !</h2><p style="text-align:center;color:var(--text2);margin-bottom:20px">Continue chaque jour</p><div style="display:flex;justify-content:space-around;padding:16px;background:var(--glass);border-radius:var(--r);margin-bottom:20px">${cal}</div><h4 style="margin-bottom:12px">Comment gagner ?</h4><ul style="color:var(--text2);font-size:13px;padding-left:20px"><li>Cuisine une recette</li><li>Publie un post</li><li>Connecte-toi chaque jour</li></ul></div>`;
}

function renderXPModal(){
    const xpMod=state.xp%100;
    $('xp-content').innerHTML=`<div style="text-align:center"><div style="font-size:64px">⭐</div><h2 style="margin:16px 0">${state.xp} XP</h2><p style="color:var(--text2)">Niveau ${state.level}</p><div style="margin:20px 0;height:10px;background:rgba(255,255,255,0.1);border-radius:5px;overflow:hidden"><div style="height:100%;width:${xpMod}%;background:linear-gradient(90deg,var(--accent),var(--gold));border-radius:5px"></div></div><h4 style="margin:20px 0 12px;text-align:left">Comment gagner ?</h4><div style="text-align:left">${[{e:'🍳',t:'Cuisiner',x:50},{e:'📸',t:'Publier',x:25},{e:'💚',t:'Swiper 10 plats',x:10},{e:'🎯',t:'Compléter défi',x:75},{e:'🔥',t:'Streak 7 jours',x:100}].map(w=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)"><span style="font-size:20px">${w.e}</span><span style="flex:1;font-size:13px">${w.t}</span><span style="color:var(--gold);font-weight:700">+${w.x}</span></div>`).join('')}</div></div>`;
}

function updateNotifDot(){const unread=state.notifications.some(n=>n.unread);$('notif-dot').classList.toggle('hidden',!unread);}
function renderNotifs(){
    $('notifs-list').innerHTML=state.notifications.length?state.notifications.map(n=>`<div class="notif-item" style="display:flex;gap:12px;padding:14px;background:${n.unread?'rgba(255,107,53,0.1)':'var(--glass)'};border:1px solid var(--border);border-radius:var(--r);margin-bottom:8px"><span style="font-size:24px">${n.icon}</span><div style="flex:1"><p style="font-size:13px">${n.text}</p><span style="font-size:11px;color:var(--text3)">${n.time}</span></div></div>`).join(''):'<p style="text-align:center;color:var(--text3);padding:40px">Aucune notification</p>';
    state.notifications.forEach(n=>n.unread=false);
    updateNotifDot();
}

// ==================== MENU GENERATOR ====================
$('btn-gen-menu').addEventListener('click',()=>{openModal('m-menu');renderMenuOptions();});
function renderMenuOptions(){
    $('menu-content').innerHTML=`
    <div class="menu-config">
        <h3 style="margin-bottom:16px">Configure ton menu</h3>
        <div class="menu-options">
            <div class="menu-opt"><div class="menu-opt-label"><span>🍽️</span><strong>Repas</strong></div><div class="menu-chips"><button class="menu-chip active" data-meal="lunch">Déjeuner</button><button class="menu-chip" data-meal="dinner">Dîner</button></div></div>
            <div class="menu-opt"><div class="menu-opt-label"><span>🥗</span><strong>Entrée</strong></div><div class="menu-chips"><button class="menu-chip active" data-starter="yes">Oui</button><button class="menu-chip" data-starter="no">Non</button></div></div>
            <div class="menu-opt"><div class="menu-opt-label"><span>🍝</span><strong>Plat</strong></div><div class="menu-chips"><button class="menu-chip active" data-main="yes">Oui</button><button class="menu-chip" data-main="no">Non</button></div></div>
            <div class="menu-opt"><div class="menu-opt-label"><span>🍰</span><strong>Dessert</strong></div><div class="menu-chips"><button class="menu-chip" data-dessert="yes">Oui</button><button class="menu-chip active" data-dessert="no">Non</button></div></div>
            <div class="menu-opt"><div class="menu-opt-label"><span>🍷</span><strong>Vin</strong></div><div class="menu-chips"><button class="menu-chip" data-wine="yes">Oui</button><button class="menu-chip active" data-wine="no">Non</button></div></div>
            <div class="menu-opt"><div class="menu-opt-label"><span>💰</span><strong>Budget</strong></div><div class="menu-chips"><button class="menu-chip" data-budget="low">€</button><button class="menu-chip active" data-budget="med">€€</button><button class="menu-chip" data-budget="high">€€€</button></div></div>
            <div class="menu-opt"><div class="menu-opt-label"><span>⏱️</span><strong>Temps max</strong></div><div class="menu-chips"><button class="menu-chip" data-time="15">15min</button><button class="menu-chip active" data-time="30">30min</button><button class="menu-chip" data-time="60">1h+</button></div></div>
        </div>
        <button class="btn btn-primary btn-full" id="btn-start-menu-quiz" style="margin-top:24px">Affiner mes goûts 🎯</button>
    </div>`;
    $$('.menu-chip').forEach(c=>{c.addEventListener('click',()=>{c.parentElement.querySelectorAll('.menu-chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');});});
    $('btn-start-menu-quiz').addEventListener('click',startMenuQuiz);
}

let menuQuizIndex=0;
function startMenuQuiz(){
    menuQuizIndex=0;
    renderMenuQuizCard();
}
function renderMenuQuizCard(){
    if(menuQuizIndex>=20){generateFinalMenu();return;}
    const item=QUIZ_ITEMS[(menuQuizIndex+10)%QUIZ_ITEMS.length];
    $('menu-content').innerHTML=`
    <div class="menu-quiz">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
            <div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden"><div style="height:100%;width:${(menuQuizIndex/20)*100}%;background:linear-gradient(90deg,var(--accent),var(--gold))"></div></div>
            <span style="font-size:12px;color:var(--text2)">${menuQuizIndex+1}/20</span>
        </div>
        <div class="quiz-card" style="margin:0 auto 20px;max-width:280px">
            <div class="card-img" style="height:160px;background-image:url(${item.img})"></div>
            <div class="card-body"><span class="card-emoji">${item.emoji}</span><h2 style="font-size:16px">${item.name}</h2><p class="card-desc">${item.desc}</p></div>
        </div>
        <div style="display:flex;justify-content:center;gap:32px">
            <button class="qbtn nope" id="mq-nope">✕</button>
            <button class="qbtn love" id="mq-love">♥</button>
        </div>
        <p style="text-align:center;color:var(--text3);font-size:12px;margin-top:12px">Pour ce repas, tu en veux ?</p>
    </div>`;
    $('mq-nope').addEventListener('click',()=>{menuQuizIndex++;renderMenuQuizCard();});
    $('mq-love').addEventListener('click',()=>{menuQuizIndex++;renderMenuQuizCard();});
}
function generateFinalMenu(){
    const starter=RECIPES.find(r=>r.type==='starter');
    const main=RECIPES.find(r=>r.type==='main');
    const dessert=RECIPES.find(r=>r.type==='dessert');
    state.todayMenu={starter,main,dessert};
    $('menu-content').innerHTML=`
    <div style="text-align:center;margin-bottom:24px"><span style="font-size:48px">🎉</span><h2 style="margin:12px 0">Ton menu est prêt !</h2><p style="color:var(--text2)">Basé sur tes préférences</p></div>
    <div class="menu-results">
        ${[{label:'Entrée',r:starter},{label:'Plat',r:main},{label:'Dessert',r:dessert}].map(({label,r})=>`<div class="daily-item" onclick="openRecipe(${r.id})"><div class="daily-item-img" style="background-image:url(${r.img})"></div><div class="daily-item-info"><span class="daily-item-type">${label}</span><span class="daily-item-name">${r.name}</span></div></div>`).join('')}
    </div>
    <button class="btn btn-glass btn-full" style="margin-top:16px" id="btn-alt-menu">🔄 Voir 4 alternatives</button>
    <button class="btn btn-primary btn-full" style="margin-top:12px" id="btn-use-menu">Utiliser ce menu</button>`;
    $('btn-alt-menu').addEventListener('click',()=>toast('4 alternatives générées !'));
    $('btn-use-menu').addEventListener('click',()=>{closeModal('m-menu');renderDailyPreview();toast('Menu du jour défini !','success');});
}
function renderDailyPreview(){
    if(!state.todayMenu)return;
    $('daily-preview').innerHTML=[{l:'Entrée',r:state.todayMenu.starter},{l:'Plat',r:state.todayMenu.main},{l:'Dessert',r:state.todayMenu.dessert}].map(({l,r})=>`<div class="daily-item" onclick="openRecipe(${r.id})"><div class="daily-item-img" style="background-image:url(${r.img})"></div><div class="daily-item-info"><span class="daily-item-type">${l}</span><span class="daily-item-name">${r.name}</span></div></div>`).join('');
}

// ==================== FRIDGE ====================
function updateFridgeCount(){$('fridge-count').textContent=state.fridge.length;}
function renderFridge(){
    const cats=[{id:'all',name:'Tout'},{id:'fruits',name:'🍎 Fruits'},{id:'veggies',name:'🥬 Légumes'},{id:'meat',name:'🥩 Viandes'},{id:'dairy',name:'🧀 Laitiers'},{id:'other',name:'📦 Autres'}];
    $('fridge-content').innerHTML=`
    <div class="fridge-acts">
        <button class="fridge-act" id="fridge-snap"><span>📸</span><span>Snap Frigo</span><span class="ai">IA</span></button>
        <button class="fridge-act" id="fridge-ticket"><span>🧾</span><span>Scanner ticket</span><span class="ai">IA</span></button>
    </div>
    <div class="fridge-cats">${cats.map((c,i)=>`<button class="fcat ${i===0?'active':''}" data-cat="${c.id}">${c.name}</button>`).join('')}</div>
    <div id="fridge-items"></div>`;
    renderFridgeItems('all');
    $$('.fcat').forEach(c=>{c.addEventListener('click',()=>{$$('.fcat').forEach(x=>x.classList.remove('active'));c.classList.add('active');renderFridgeItems(c.dataset.cat);});});
    $('fridge-snap').addEventListener('click',()=>toast('Fonctionnalité IA bientôt disponible'));
    $('fridge-ticket').addEventListener('click',()=>toast('Fonctionnalité IA bientôt disponible'));
}
function renderFridgeItems(cat){
    const items=cat==='all'?state.fridge:state.fridge.filter(i=>i.cat===cat);
    const container=$('fridge-items');
    if(!container)return;
    container.innerHTML=items.length?items.map(i=>{
        const exp=new Date(i.exp);
        const days=Math.ceil((exp-Date.now())/(1000*60*60*24));
        const cls=days<=2?'bad':days<=5?'warn':'ok';
        return`<div class="fridge-item"><span class="fridge-item-icon">${i.icon}</span><div class="fridge-item-info"><span class="fridge-item-name">${i.name}</span><span class="fridge-item-qty">${i.qty}</span></div><span class="fridge-item-exp ${cls}">${days}j</span><button class="fridge-item-del" onclick="removeFridgeItem(${i.id})">🗑️</button></div>`;
    }).join(''):'<p style="text-align:center;color:var(--text3);padding:40px">Aucun aliment</p>';
}
window.removeFridgeItem=id=>{state.fridge=state.fridge.filter(i=>i.id!==id);localStorage.setItem('yumr_fridge',JSON.stringify(state.fridge));renderFridgeItems('all');updateFridgeCount();toast('Aliment supprimé');};
$('btn-add-item').addEventListener('click',()=>{openModal('m-add-item');renderAddItemForm();});
function renderAddItemForm(){
    $('add-item-form').innerHTML=`
    <input type="text" id="new-item-name" class="input-field" placeholder="Nom de l'aliment" style="margin-bottom:12px">
    <input type="text" id="new-item-qty" class="input-field" placeholder="Quantité (ex: 500g)" style="margin-bottom:12px">
    <select id="new-item-cat" class="input-field" style="margin-bottom:12px"><option value="fruits">🍎 Fruits</option><option value="veggies">🥬 Légumes</option><option value="meat">🥩 Viandes</option><option value="dairy">🧀 Laitiers</option><option value="other">📦 Autres</option></select>
    <input type="date" id="new-item-exp" class="input-field" style="margin-bottom:16px">
    <button class="btn btn-primary btn-full" id="btn-confirm-add">Ajouter</button>`;
    $('btn-confirm-add').addEventListener('click',()=>{
        const name=$('new-item-name').value,qty=$('new-item-qty').value,cat=$('new-item-cat').value,exp=$('new-item-exp').value;
        if(!name){toast('Nom requis','error');return;}
        const icons={fruits:'🍎',veggies:'🥬',meat:'🥩',dairy:'🧀',other:'📦'};
        state.fridge.push({id:Date.now(),name,icon:icons[cat],qty:qty||'1',cat,exp:exp?new Date(exp):new Date(Date.now()+7*24*60*60*1000)});
        localStorage.setItem('yumr_fridge',JSON.stringify(state.fridge));
        closeModal('m-add-item');renderFridge();updateFridgeCount();toast('Aliment ajouté !','success');
    });
}

// ==================== SHOPPING ====================
function renderShopping(){
    $('shop-content').innerHTML=state.shopping.length?`<div id="shop-items">${state.shopping.map((s,i)=>`<div class="fridge-item"><input type="checkbox" ${s.done?'checked':''} onchange="toggleShopItem(${i})" style="width:20px;height:20px;accent-color:var(--accent)"><span style="flex:1;${s.done?'text-decoration:line-through;opacity:.5':''}">${s.name}</span><button class="fridge-item-del" onclick="removeShopItem(${i})">🗑️</button></div>`).join('')}</div><div style="display:flex;gap:12px;margin-top:16px"><input type="text" id="new-shop-item" class="input-field" placeholder="Ajouter un article..." style="flex:1"><button class="btn btn-primary" onclick="addShopItem()">+</button></div>`:'<p style="text-align:center;color:var(--text3);padding:40px">Liste vide</p><div style="display:flex;gap:12px;margin-top:16px"><input type="text" id="new-shop-item" class="input-field" placeholder="Ajouter un article..." style="flex:1"><button class="btn btn-primary" onclick="addShopItem()">+</button></div>';
}
window.addShopItem=()=>{const inp=$('new-shop-item');if(!inp.value)return;state.shopping.push({name:inp.value,done:false});localStorage.setItem('yumr_shop',JSON.stringify(state.shopping));inp.value='';renderShopping();};
window.toggleShopItem=i=>{state.shopping[i].done=!state.shopping[i].done;localStorage.setItem('yumr_shop',JSON.stringify(state.shopping));renderShopping();};
window.removeShopItem=i=>{state.shopping.splice(i,1);localStorage.setItem('yumr_shop',JSON.stringify(state.shopping));renderShopping();};
$('btn-clear-shop').addEventListener('click',()=>{state.shopping=[];localStorage.setItem('yumr_shop','[]');renderShopping();toast('Liste vidée');});

// ==================== RECIPES ====================
function renderRecipes(filter='all',search=''){
    let list=RECIPES;
    if(filter!=='all')list=list.filter(r=>r.type===filter);
    if(search)list=list.filter(r=>r.name.toLowerCase().includes(search.toLowerCase()));
    $('recipes').innerHTML=list.map(r=>`<div class="recipe-card" onclick="openRecipe(${r.id})"><div class="recipe-img" style="background-image:url(${r.img})"><button class="recipe-save ${state.favorites.includes(r.id)?'saved':''}" onclick="event.stopPropagation();toggleFav(${r.id})">${state.favorites.includes(r.id)?'❤️':'🤍'}</button></div><div class="recipe-body"><p class="recipe-name">${r.name}</p><p class="recipe-meta">⏱️ ${r.time}min · ${r.cost}</p></div></div>`).join('');
}
window.toggleFav=id=>{if(state.favorites.includes(id)){state.favorites=state.favorites.filter(f=>f!==id);}else{state.favorites.push(id);}localStorage.setItem('yumr_fav',JSON.stringify(state.favorites));renderRecipes();};
window.openRecipe=id=>{
    const r=RECIPES.find(x=>x.id===id);if(!r)return;
    openModal('m-recipe');
    $('recipe-page').innerHTML=`
    <div class="recipe-hero" style="background-image:url(${r.img})"><button class="back-btn recipe-back" data-close="m-recipe">←</button><button class="recipe-save-btn ${state.favorites.includes(r.id)?'saved':''}" onclick="toggleFav(${r.id});this.classList.toggle('saved')">${state.favorites.includes(r.id)?'❤️':'🤍'}</button></div>
    <div class="recipe-content"><span class="recipe-type">${r.type}</span><h1 class="recipe-title">${r.name}</h1><p class="recipe-desc">Une délicieuse recette à essayer !</p><div class="recipe-metas"><span>⏱️ ${r.time} min</span><span>💰 ${r.cost}</span><span>🔥 ${r.calories} kcal</span></div><div class="recipe-section"><h3>Ingrédients</h3><ul>${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul></div><div class="recipe-section"><h3>Étapes</h3><ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol></div><button class="btn btn-primary btn-full" onclick="cookRecipe(${r.id})">J'ai cuisiné ce plat ! +50 XP</button></div>`;
    $('recipe-page').querySelector('.recipe-back').addEventListener('click',()=>closeModal('m-recipe'));
};
window.cookRecipe=id=>{showXP(50);toast('Bravo chef ! 🎉','success');closeModal('m-recipe');state.badges[0].unlocked=true;};
$$('.filter').forEach(f=>{f.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));f.classList.add('active');renderRecipes(f.dataset.cat,$('search-in').value);});});
$$('.etab').forEach(t=>{t.addEventListener('click',()=>{$$('.etab').forEach(x=>x.classList.remove('active'));t.classList.add('active');if(t.dataset.filter==='saved'){$('recipes').innerHTML=state.favorites.length?RECIPES.filter(r=>state.favorites.includes(r.id)).map(r=>`<div class="recipe-card" onclick="openRecipe(${r.id})"><div class="recipe-img" style="background-image:url(${r.img})"><button class="recipe-save saved" onclick="event.stopPropagation();toggleFav(${r.id})">❤️</button></div><div class="recipe-body"><p class="recipe-name">${r.name}</p><p class="recipe-meta">⏱️ ${r.time}min</p></div></div>`).join(''):'<p style="grid-column:1/-1;text-align:center;color:var(--text3);padding:40px">Aucun favori</p>';}else{renderRecipes();}});});
$('search-in').addEventListener('input',e=>renderRecipes(document.querySelector('.filter.active')?.dataset.cat||'all',e.target.value));

// ==================== LEAGUES ====================
function renderLeagues(){
    const content=$('league-content');
    if(!content)return;
    content.innerHTML=`<div id="lb-list">${LEADERBOARD.map((p,i)=>`<div class="lb-item ${p.name==='ChefNoob'?'me':''} ${i<3?'top3':''}"><span class="lb-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${i<3?['🥇','🥈','🥉'][i]:p.rank}</span><div class="lb-av" style="background-image:url(https://i.pravatar.cc/40?img=${p.img})"></div><span class="lb-name">${p.name}</span><span class="lb-pts">${p.pts} pts</span></div>`).join('')}</div>`;
}
$$('.ltab').forEach(t=>{t.addEventListener('click',()=>{$$('.ltab').forEach(x=>x.classList.remove('active'));t.classList.add('active');const content=$('league-content');if(t.dataset.lb==='all'){content.innerHTML=`<div class="tiers">${[{e:'💎',n:'Master',s:'Top 1%'},{e:'💠',n:'Diamant',s:'Top 5%'},{e:'🏅',n:'Platine',s:'Top 15%'},{e:'🥇',n:'Or',s:'Top 30%'},{e:'🥈',n:'Argent',s:'Top 50%'},{e:'🥉',n:'Bronze',s:'Actuel',cur:true}].map(t=>`<div class="tier ${t.cur?'current':''}"><span>${t.e}</span><span>${t.n}</span><small>${t.s}</small></div>`).join('')}</div>`;}else{renderLeagues();}});});

// ==================== FEED ====================
function renderFeed(filter='all'){
    const allPosts=[...SAMPLE_POSTS,...state.posts].sort((a,b)=>(b.likes||0)-(a.likes||0));
    const posts=filter==='mine'?state.posts:filter==='following'?allPosts.slice(0,2):allPosts;
    $('feed').innerHTML=posts.length?posts.map(p=>`<div class="feed-post"><div class="feed-header" onclick="openUserProfile(${p.userId||0})"><div class="feed-av" style="background-image:url(${p.avatar||'https://i.pravatar.cc/44?img=33'})"></div><div class="feed-user"><strong>${p.user||state.user?.username}</strong><span>${p.time||'maintenant'}</span></div></div><div class="feed-img" style="background-image:url(${p.img})" onclick="openPostView(${p.id})"></div><div class="feed-content"><div class="feed-actions"><button class="${p.liked?'liked':''}" onclick="likePost(${p.id})"><svg viewBox="0 0 24 24" fill="${p.liked?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>${p.likes||0}</button><button onclick="openComments(${p.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${p.comments?.length||0}</button></div><p>${p.caption||''}</p></div></div>`).join(''):'<p style="text-align:center;color:var(--text3);padding:40px">Aucun post</p>';
}
window.likePost=id=>{const p=[...SAMPLE_POSTS,...state.posts].find(x=>x.id===id);if(p){p.liked=!p.liked;p.likes=(p.likes||0)+(p.liked?1:-1);renderFeed();if(p.liked)showXP(5);}};
window.openPostView=id=>{
    const p=[...SAMPLE_POSTS,...state.posts].find(x=>x.id===id);if(!p)return;
    state.currentPost=p;
    openModal('m-post-view');
    $('post-view-page').innerHTML=`<div class="post-view-header"><button class="back-btn" onclick="closeModal('m-post-view')">←</button><div class="feed-user" style="flex:1;margin-left:12px" onclick="openUserProfile(${p.userId||0})"><strong>${p.user||state.user?.username}</strong><span style="display:block;font-size:11px;color:var(--text3)">${p.time||'maintenant'}</span></div></div><img src="${p.img}" class="post-view-img"><div class="post-view-bottom"><div class="post-view-actions"><button class="${p.liked?'liked':''}" onclick="likePost(${p.id});renderFeed()"><svg width="24" height="24" viewBox="0 0 24 24" fill="${p.liked?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> ${p.likes||0}</button><button onclick="openComments(${p.id})"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> ${p.comments?.length||0}</button></div><p class="post-view-caption"><strong>${p.user||state.user?.username}</strong> ${p.caption||''}</p></div>`;
};
window.openUserProfile=id=>{
    const u=SAMPLE_USERS.find(x=>x.id===id);if(!u)return;
    openModal('m-user');
    $('user-page').innerHTML=`<div class="user-profile-header"><button class="back-btn" onclick="closeModal('m-user')">←</button><span style="flex:1;font-weight:600">@${u.name}</span><button class="btn btn-primary btn-sm">S'abonner</button></div><div class="user-profile-hero"><div class="user-av" style="background-image:url(${u.avatar})"></div><h2>@${u.name}</h2><p>${u.bio}</p><div class="user-stats"><div><strong>${u.posts}</strong><span>Posts</span></div><div><strong>${u.followers}</strong><span>Abonnés</span></div><div><strong>${u.following}</strong><span>Abonnements</span></div></div></div><div class="user-posts">${SAMPLE_POSTS.filter(p=>p.userId===id).map(p=>`<div class="user-post" style="background-image:url(${p.img})" onclick="openPostView(${p.id})"></div>`).join('')}</div>`;
};
window.openComments=id=>{
    const p=[...SAMPLE_POSTS,...state.posts].find(x=>x.id===id);if(!p)return;
    state.currentPost=p;
    openModal('m-comments');
    renderComments();
};
function renderComments(){
    const p=state.currentPost;if(!p)return;
    $('comments-content').innerHTML=`<div class="comments-list">${(p.comments||[]).map(c=>`<div class="comment-item"><div class="comment-av" style="background-image:url(https://i.pravatar.cc/36?u=${c.user})"></div><div class="comment-content"><strong>${c.user}</strong><p>${c.text}</p></div></div>`).join('')||'<p style="text-align:center;color:var(--text3);padding:20px">Aucun commentaire</p>'}</div><div class="comment-input"><input type="text" id="comment-text" placeholder="Ajouter un commentaire..."><button class="btn btn-primary btn-sm" onclick="addComment()">Envoyer</button></div>`;
}
window.addComment=()=>{const txt=$('comment-text').value;if(!txt||!state.currentPost)return;state.currentPost.comments=state.currentPost.comments||[];state.currentPost.comments.push({user:state.user?.username||'Moi',text:txt});renderComments();renderFeed();showXP(5);};
$$('.ftab').forEach(t=>{t.addEventListener('click',()=>{$$('.ftab').forEach(x=>x.classList.remove('active'));t.classList.add('active');renderFeed(t.dataset.feed);});});
$('user-search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();const results=SAMPLE_USERS.filter(u=>u.name.toLowerCase().includes(q));if(q&&results.length){$('feed').innerHTML=results.map(u=>`<div class="feed-post" onclick="openUserProfile(${u.id})" style="cursor:pointer"><div class="feed-header"><div class="feed-av" style="background-image:url(${u.avatar})"></div><div class="feed-user"><strong>@${u.name}</strong><span>${u.followers} abonnés</span></div></div></div>`).join('');}else if(!q){renderFeed();}});

// ==================== POST ====================
function openPostModal(){
    openModal('m-post');
    $('post-content').innerHTML=`
    <div class="upload" id="upload-zone"><input type="file" id="post-file" accept="image/*" hidden><div class="upload-inner" style="padding:60px 20px;text-align:center;cursor:pointer"><span style="font-size:48px">📷</span><p style="margin-top:12px;color:var(--text2)">Ajoute une photo</p></div><img id="post-preview" style="width:100%;display:none;border-radius:var(--r)"></div>
    <textarea id="post-caption" class="input-field" placeholder="Décris ton plat..." rows="3" style="margin-top:16px;resize:none"></textarea>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">${['#healthy','#homemade','#dessert','#quickmeal'].map(t=>`<button class="menu-chip" onclick="this.classList.toggle('active')">${t}</button>`).join('')}</div>
    <button class="btn btn-primary btn-full" style="margin-top:20px" id="btn-publish">Publier <span style="opacity:.7">+25 XP</span></button>`;
    const zone=$('upload-zone'),file=$('post-file'),preview=$('post-preview');
    zone.addEventListener('click',()=>file.click());
    file.addEventListener('change',e=>{if(e.target.files[0]){const reader=new FileReader();reader.onload=ev=>{preview.src=ev.target.result;preview.style.display='block';zone.querySelector('.upload-inner').style.display='none';};reader.readAsDataURL(e.target.files[0]);}});
    $('btn-publish').addEventListener('click',()=>{
        const caption=$('post-caption').value;
        const img=preview.src||'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
        state.posts.unshift({id:Date.now(),user:state.user?.username,avatar:'https://i.pravatar.cc/44?img=33',img,caption,likes:0,comments:[],time:'maintenant'});
        localStorage.setItem('yumr_posts',JSON.stringify(state.posts));
        closeModal('m-post');renderFeed();showXP(25);toast('Post publié !','success');updateStats();
    });
}

// ==================== BADGES ====================
function renderBadges(){
    const scroll=$('badges-scroll');if(!scroll)return;
    const unlocked=state.badges.filter(b=>b.unlocked);
    scroll.innerHTML=unlocked.length?unlocked.slice(0,5).map(b=>`<div class="badge-item"><div class="badge-icon">${b.emoji}</div><span>${b.name}</span></div>`).join(''):'<p style="color:var(--text3);font-size:12px;white-space:nowrap">Aucun badge débloqué</p>';
    if($('badge-count'))$('badge-count').textContent=unlocked.length;
    renderFeaturedBadges();
}
function renderFeaturedBadges(){
    const container=$('featured-badges');if(!container)return;
    container.innerHTML=state.featuredBadges.map(id=>{const b=state.badges[id];return b?`<div class="featured-badge" title="${b.name}">${b.emoji}</div>`:`<div class="featured-badge empty">+</div>`;}).join('');
}
function renderBadgesModal(){
    const unlocked=state.badges.filter(b=>b.unlocked).length;
    $('badges-unlocked').textContent=`${unlocked}/${state.badges.length}`;
    $('badges-content').innerHTML=`
    <p class="badges-hint">Appuie sur un badge pour le mettre en avant</p>
    <div class="badges-tabs">${['all','cooking','social','progress','secret'].map((c,i)=>`<button class="btab ${i===0?'active':''}" data-cat="${c}">${c==='all'?'Tous':c==='cooking'?'🍳 Cuisine':c==='social'?'🌍 Social':c==='progress'?'📈 Progression':'🔮 Secrets'}</button>`).join('')}</div>
    <div class="badges-grid" id="badges-grid-modal"></div>`;
    renderBadgeGrid('all');
    $$('.btab').forEach(t=>{t.addEventListener('click',()=>{$$('.btab').forEach(x=>x.classList.remove('active'));t.classList.add('active');renderBadgeGrid(t.dataset.cat);});});
}
function renderBadgeGrid(cat){
    const list=cat==='all'?state.badges:state.badges.filter(b=>b.cat===cat);
    $('badges-grid-modal').innerHTML=list.map(b=>`<div class="badge-card ${b.unlocked?'':'locked'} ${state.featuredBadges.includes(b.id)?'selected':''} ${b.cat==='secret'?'secret':''}" onclick="selectBadge(${b.id})"><div class="badge-card-icon">${b.unlocked?b.emoji:'🔒'}</div><p class="badge-card-name">${b.unlocked?b.name:'???'}</p><p class="badge-card-desc">${b.desc}</p></div>`).join('');
}
window.selectBadge=id=>{
    const b=state.badges.find(x=>x.id===id);
    if(!b||!b.unlocked){toast('Badge non débloqué');return;}
    if(state.featuredBadges.includes(id)){state.featuredBadges=state.featuredBadges.filter(x=>x!==id);}
    else if(state.featuredBadges.length<3){state.featuredBadges.push(id);}
    else{state.featuredBadges.shift();state.featuredBadges.push(id);}
    localStorage.setItem('yumr_featured',JSON.stringify(state.featuredBadges));
    renderBadgeGrid(document.querySelector('.btab.active')?.dataset.cat||'all');
    renderFeaturedBadges();
};

// ==================== PREFS/SETTINGS ====================
function renderPrefs(){
    const prefs=JSON.parse(localStorage.getItem('yumr_prefs')||'{}');
    $('prefs-content').innerHTML=`
    <div class="pref-section"><h3>Régime alimentaire</h3><div class="diet-grid">${['omnivore','vegetarian','vegan','flexitarian'].map(d=>`<label class="diet-opt"><input type="radio" name="pref-diet" value="${d}" ${prefs.diet===d?'checked':''}><div class="diet-card"><span>${d==='omnivore'?'🍖':d==='vegetarian'?'🥬':d==='vegan'?'🌱':'🐟'}</span><span>${d.charAt(0).toUpperCase()+d.slice(1)}</span></div></label>`).join('')}</div></div>
    <div class="pref-section"><h3>Allergies</h3><div class="allergy-wrap">${['gluten','lactose','nuts','seafood','eggs','soy'].map(a=>`<label class="chip-opt"><input type="checkbox" name="pref-allergy" value="${a}" ${prefs.allergies?.includes(a)?'checked':''}><span>${a==='gluten'?'🌾':a==='lactose'?'🥛':a==='nuts'?'🥜':a==='seafood'?'🦐':a==='eggs'?'🥚':'🫘'} ${a.charAt(0).toUpperCase()+a.slice(1)}</span></label>`).join('')}</div></div>
    <div class="pref-section"><h3>Objectif</h3><div class="goal-list">${['lose','maintain','gain','health'].map(g=>`<label class="goal-opt"><input type="radio" name="pref-goal" value="${g}" ${prefs.goal===g?'checked':''}><div class="goal-card"><span>${g==='lose'?'⚖️':g==='maintain'?'💪':g==='gain'?'🏋️':'❤️'}</span><div><strong>${g==='lose'?'Perdre du poids':g==='maintain'?'Maintenir':g==='gain'?'Prendre du muscle':'Manger sain'}</strong></div></div></label>`).join('')}</div></div>`;
}
$('btn-save-prefs').addEventListener('click',()=>{
    const diet=document.querySelector('input[name="pref-diet"]:checked')?.value||'omnivore';
    const allergies=[...document.querySelectorAll('input[name="pref-allergy"]:checked')].map(c=>c.value);
    const goal=document.querySelector('input[name="pref-goal"]:checked')?.value||'maintain';
    localStorage.setItem('yumr_prefs',JSON.stringify({diet,allergies,goal}));
    closeModal('m-prefs');toast('Préférences sauvegardées !','success');
});
function renderSettings(){
    $('settings-content').innerHTML=`
    <div class="settings-section"><h3>Notifications</h3><label class="toggle-row"><span>Notifications push</span><input type="checkbox" checked><span class="toggle"></span></label><label class="toggle-row"><span>Rappels quotidiens</span><input type="checkbox" checked><span class="toggle"></span></label><label class="toggle-row"><span>Nouveaux défis</span><input type="checkbox" checked><span class="toggle"></span></label></div>
    <div class="settings-section"><h3>Confidentialité</h3><label class="toggle-row"><span>Profil public</span><input type="checkbox" checked><span class="toggle"></span></label><label class="toggle-row"><span>Afficher dans les ligues</span><input type="checkbox" checked><span class="toggle"></span></label></div>
    <div class="settings-section"><h3>Compte</h3><button class="pmenu" style="margin-bottom:8px"><span>📧</span><span>Changer email</span><span>›</span></button><button class="pmenu"><span>🔒</span><span>Changer mot de passe</span><span>›</span></button></div>
    <div class="settings-section"><h3>Données</h3><button class="pmenu"><span>📥</span><span>Exporter mes données</span><span>›</span></button><button class="pmenu danger"><span>🗑️</span><span>Supprimer mon compte</span><span>›</span></button></div>`;
}

// ==================== PREMIUM ====================
function renderPremium(){
    $('premium-content').innerHTML=`
    <div class="prem-hero"><span>👑</span><h1>Yumr PRO</h1><p>Débloquez toutes les fonctionnalités</p></div>
    <div class="prem-features">${[{e:'🤖',t:'Coach IA',d:'Conseils personnalisés'},{e:'📆',t:'Meal Prep',d:'Planification semaine'},{e:'🍴',t:'Mode Resto',d:'Scanner les menus'},{e:'📊',t:'Stats avancées',d:'Analyses détaillées'},{e:'🎯',t:'Défis exclusifs',d:'Challenges premium'},{e:'🚫',t:'Sans pub',d:'Expérience fluide'}].map(f=>`<div class="prem-f"><span>${f.e}</span><div><strong>${f.t}</strong><span>${f.d}</span></div></div>`).join('')}</div>
    <div class="prem-plans"><div class="plan" onclick="this.parentElement.querySelectorAll('.plan').forEach(p=>p.classList.remove('pop'));this.classList.add('pop')"><span>Mensuel</span><strong>4,99€</strong><small>/mois</small></div><div class="plan pop"><span class="plan-badge">-40%</span><span>Annuel</span><strong>2,99€</strong><small>/mois</small></div></div>
    <button class="btn btn-primary btn-full">Commencer l'essai gratuit</button><p style="text-align:center;color:var(--text3);font-size:11px;margin-top:12px">7 jours gratuits, annulez à tout moment</p>`;
}

// ==================== REFERRAL ====================
function renderReferral(){
    const code='YUMR'+Math.random().toString(36).substring(2,8).toUpperCase();
    $('referral-content').innerHTML=`
    <div style="text-align:center;padding:30px 0"><span style="font-size:64px">🎁</span><h2 style="margin:16px 0">Parraine tes amis</h2><p style="color:var(--text2)">Gagne 100 XP pour chaque ami qui s'inscrit !</p></div>
    <div class="glass-card" style="padding:20px;text-align:center;margin-bottom:20px"><p style="font-size:12px;color:var(--text2);margin-bottom:8px">Ton code de parrainage</p><h2 style="font-size:28px;letter-spacing:4px;background:linear-gradient(135deg,var(--accent),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent">${code}</h2></div>
    <button class="btn btn-primary btn-full" onclick="navigator.clipboard.writeText('${code}');toast('Code copié !','success')">📋 Copier le code</button>
    <button class="btn btn-glass btn-full" style="margin-top:12px" onclick="navigator.share?.({title:'Yumr',text:'Rejoins-moi sur Yumr avec le code ${code}'})">📤 Partager</button>
    <div style="margin-top:24px"><h4 style="margin-bottom:12px">Tes récompenses</h4><div class="prem-f"><span>👤</span><div><strong>0 amis parrainés</strong><span>Prochaine récompense : 1 ami</span></div></div></div>`;
}

// ==================== CHALLENGES ====================
function renderChallenges(){
    $('challenges-content').innerHTML=`
    <div class="challenge glass-card" style="margin-bottom:16px"><div class="ch-head"><span class="ch-tag">🔥 Défi du jour</span><span class="ch-timer">23h</span></div><h3>Cuisine un plat végétarien</h3><p>+75 XP et badge "Green Chef"</p><button class="btn btn-primary btn-sm" style="margin-top:12px">Participer</button></div>
    <h3 style="margin:20px 0 12px">Défis hebdomadaires</h3>
    ${[{t:'5 recettes cette semaine',xp:150,p:2},{t:'Publie 3 posts',xp:100,p:1},{t:'Streak de 7 jours',xp:200,p:5}].map(c=>`<div class="glass-card" style="padding:16px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:center"><div><h4 style="font-size:14px">${c.t}</h4><p style="font-size:12px;color:var(--text2)">+${c.xp} XP</p></div><span style="color:var(--accent);font-size:13px">${c.p}/5</span></div><div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;margin-top:10px;overflow:hidden"><div style="height:100%;width:${c.p*20}%;background:linear-gradient(90deg,var(--accent),var(--gold))"></div></div></div>`).join('')}
    <h3 style="margin:20px 0 12px">Défis saisonniers</h3>
    <div class="glass-card" style="padding:16px"><div style="display:flex;gap:14px;align-items:center"><span style="font-size:36px">🎄</span><div><h4>Spécial Noël</h4><p style="font-size:12px;color:var(--text2)">Cuisine 10 plats de fêtes</p><p style="font-size:11px;color:var(--gold);margin-top:4px">Badge exclusif + 500 XP</p></div></div></div>`;
}

// ==================== PROFILE ACTIONS ====================
$('btn-share-profile').addEventListener('click',()=>{navigator.share?.({title:'Mon profil Yumr',url:window.location.href})||toast('Lien copié !','success');});
$('btn-logout').addEventListener('click',()=>{if(confirm('Déconnexion ?')){localStorage.removeItem('yumr_token');localStorage.removeItem('yumr_user');location.reload();}});

// ==================== END ====================
});

