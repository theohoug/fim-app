/* YUMR - Complete App */
document.addEventListener(‘DOMContentLoaded’, () => {

const state={user:null,token:localStorage.getItem(‘yumr_token’),isRegister:false,setupStep:1,quizCount:30,diet:‘omnivore’,allergies:[],goal:‘none’,conditions:[],currentQ:0,answers:[],streak:0,xp:0,level:1,profile:null,fridge:[],favorites:JSON.parse(localStorage.getItem(‘yumr_fav’)||’[]’),shopping:[],todayMenu:null,menuOptions:{budget:‘low’,persons:2,time:30,difficulty:‘easy’}};

const QUESTIONS=[
{q:“Tu aimes les pizzas ?”,emoji:“🍕”,tags:[“italien”,“fromage”]},
{q:“Fan de sushis ?”,emoji:“🍣”,tags:[“japonais”,“poisson”]},
{q:“Les burgers c’est la vie ?”,emoji:“🍔”,tags:[“américain”,“viande”]},
{q:“Tu kiffes les salades ?”,emoji:“🥗”,tags:[“healthy”,“végétarien”]},
{q:“Pasta lover ?”,emoji:“🍝”,tags:[“italien”,“pâtes”]},
{q:“Les tacos ça te parle ?”,emoji:“🌮”,tags:[“mexicain”,“épicé”]},
{q:“Amateur de fruits de mer ?”,emoji:“🦐”,tags:[“poisson”,“luxe”]},
{q:“Le fromage c’est sacré ?”,emoji:“🧀”,tags:[“fromage”,“français”]},
{q:“Tu aimes le chocolat ?”,emoji:“🍫”,tags:[“sucré”,“dessert”]},
{q:“Les plats épicés ça passe ?”,emoji:“🌶️”,tags:[“épicé”,“asiatique”]},
{q:“Fan de barbecue ?”,emoji:“🍖”,tags:[“viande”,“grillé”]},
{q:“Tu manges végétarien parfois ?”,emoji:“🥬”,tags:[“végétarien”,“healthy”]},
{q:“Les soupes c’est ton truc ?”,emoji:“🍲”,tags:[“réconfort”,“healthy”]},
{q:“Amateur de vin ?”,emoji:“🍷”,tags:[“alcool”,“français”]},
{q:“Le petit-déj c’est important ?”,emoji:“🥐”,tags:[“matin”,“français”]},
{q:“Tu aimes cuisiner toi-même ?”,emoji:“👨‍🍳”,tags:[“cuisine”,“passion”]},
{q:“Fan de street food ?”,emoji:“🍜”,tags:[“asiatique”,“rapide”]},
{q:“Le bio c’est important ?”,emoji:“🌱”,tags:[“bio”,“healthy”]},
{q:“Tu aimes les desserts ?”,emoji:“🍰”,tags:[“sucré”,“gourmand”]},
{q:“Les plats mijotés ?”,emoji:“🥘”,tags:[“réconfort”,“traditionnel”]},
{q:“Fan de cuisine asiatique ?”,emoji:“🥡”,tags:[“asiatique”,“varié”]},
{q:“Les brunchs du dimanche ?”,emoji:“🥞”,tags:[“weekend”,“social”]},
{q:“Tu aimes le café ?”,emoji:“☕”,tags:[“boisson”,“énergie”]},
{q:“La cuisine française ?”,emoji:“🇫🇷”,tags:[“français”,“traditionnel”]},
{q:“Les plats healthy ?”,emoji:“💪”,tags:[“healthy”,“sport”]},
{q:“Fan de glaces ?”,emoji:“🍦”,tags:[“sucré”,“été”]},
{q:“Tu cuisines pour des amis ?”,emoji:“👥”,tags:[“social”,“partage”]},
{q:“Les plats exotiques ?”,emoji:“🌍”,tags:[“monde”,“découverte”]},
{q:“Le meal prep ça t’intéresse ?”,emoji:“📅”,tags:[“organisation”,“efficacité”]},
{q:“Les cocktails ça te dit ?”,emoji:“🍹”,tags:[“alcool”,“fête”]}
];

const PROFILES=[
{name:“Le Gourmet”,emoji:“🍳”,desc:“Tu apprécies la bonne cuisine et les saveurs authentiques.”,tags:[“Curieux”,“Épicurien”,“Traditionnel”]},
{name:“L’Aventurier”,emoji:“🌍”,desc:“Tu adores découvrir de nouvelles saveurs du monde entier.”,tags:[“Explorateur”,“Ouvert”,“Audacieux”]},
{name:“Le Healthy”,emoji:“🥗”,desc:“Manger sain et équilibré, c’est ta priorité.”,tags:[“Équilibré”,“Sportif”,“Conscient”]},
{name:“Le Gourmand”,emoji:“🍰”,desc:“Tu ne dis jamais non à un bon dessert ou un plat réconfortant.”,tags:[“Généreux”,“Convivial”,“Heureux”]},
{name:“Le Social”,emoji:“👥”,desc:“Pour toi, manger c’est avant tout partager.”,tags:[“Convivial”,“Fêtard”,“Chaleureux”]},
{name:“Le Rapide”,emoji:“⚡”,desc:“Efficace en cuisine, tu optimises ton temps.”,tags:[“Pratique”,“Efficace”,“Malin”]}
];

const RECIPES=[
{id:1,name:“Poulet rôti aux herbes”,type:“main”,time:45,cost:“€€”,img:“https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400”,ingredients:[“1 poulet”,“Herbes de Provence”,“Beurre”,“Ail”],steps:[“Préchauffer le four à 200°C”,“Badigeonner le poulet de beurre”,“Ajouter les herbes et l’ail”,“Enfourner 45 min”],calories:450},
{id:2,name:“Salade César”,type:“starter”,time:15,cost:“€”,img:“https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400”,ingredients:[“Laitue romaine”,“Parmesan”,“Croûtons”,“Sauce César”],steps:[“Laver la salade”,“Préparer la sauce”,“Mélanger le tout”],calories:280},
{id:3,name:“Tiramisu”,type:“dessert”,time:30,cost:“€€”,img:“https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400”,ingredients:[“Mascarpone”,“Café”,“Biscuits”,“Cacao”],steps:[“Préparer le café”,“Monter les œufs et le mascarpone”,“Alterner les couches”],calories:420},
{id:4,name:“Pasta carbonara”,type:“main”,time:20,cost:“€”,img:“https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400”,ingredients:[“Spaghetti”,“Guanciale”,“Œufs”,“Pecorino”],steps:[“Cuire les pâtes”,“Faire revenir le guanciale”,“Mélanger œufs et fromage”,“Assembler hors du feu”],calories:520},
{id:5,name:“Buddha bowl”,type:“main”,time:25,cost:“€”,img:“https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400”,ingredients:[“Quinoa”,“Pois chiches”,“Avocat”,“Légumes”],steps:[“Cuire le quinoa”,“Rôtir les pois chiches”,“Assembler le bowl”],calories:380},
{id:6,name:“Tarte aux pommes”,type:“dessert”,time:50,cost:“€”,img:“https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400”,ingredients:[“Pâte brisée”,“Pommes”,“Sucre”,“Cannelle”],steps:[“Étaler la pâte”,“Disposer les pommes”,“Saupoudrer de sucre”,“Enfourner 40 min”],calories:320},
{id:7,name:“Risotto aux champignons”,type:“main”,time:35,cost:“€€”,img:“https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400”,ingredients:[“Riz arborio”,“Champignons”,“Parmesan”,“Bouillon”],steps:[“Faire revenir les champignons”,“Ajouter le riz”,“Mouiller progressivement”],calories:450},
{id:8,name:“Soupe miso”,type:“starter”,time:15,cost:“€”,img:“https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400”,ingredients:[“Pâte miso”,“Tofu”,“Algues wakame”,“Ciboule”],steps:[“Chauffer l’eau”,“Diluer le miso”,“Ajouter tofu et algues”],calories:85}
];

const BADGES=[
{id:1,name:“Premier Plat”,emoji:“🥇”,desc:“Cuisine ta première recette”,unlocked:true},
{id:2,name:“Streak 7j”,emoji:“🔥”,desc:“7 jours consécutifs”,unlocked:false},
{id:3,name:“Social Chef”,emoji:“👥”,desc:“Partage 5 photos”,unlocked:false},
{id:4,name:“Globe-trotter”,emoji:“🌍”,desc:“Cuisine 10 pays différents”,unlocked:false},
{id:5,name:“Veggie Week”,emoji:“🌱”,desc:“Une semaine végétarienne”,unlocked:false},
{id:6,name:“Sommelier”,emoji:“🍷”,desc:“10 accords mets-vins”,unlocked:false},
{id:7,name:“Économe”,emoji:“💰”,desc:“Budget < 5€/repas pendant 1 mois”,unlocked:false},
{id:8,name:“Batch Master”,emoji:“📅”,desc:“Complete 4 meal preps”,unlocked:false},
{id:9,name:“Légende”,emoji:“👑”,desc:“Atteins le niveau 50”,unlocked:false}
];

const LEADERBOARD=[
{rank:1,name:“MasterChef99”,pts:2850,img:1},
{rank:2,name:“FoodieQueen”,pts:2720,img:2},
{rank:3,name:“CuisineKing”,pts:2650,img:3},
{rank:4,name:“ChefNinja”,pts:2480,img:4},
{rank:5,name:“TasteExplorer”,pts:2350,img:5},
{rank:6,name:“YumrPro”,pts:2200,img:6},
{rank:7,name:“SpiceHunter”,pts:2100,img:7},
{rank:8,name:“BowlMaster”,pts:1950,img:9},
{rank:9,name:“HealthyBite”,pts:1820,img:10},
{rank:10,name:“PastaLover”,pts:1750,img:11}
];

function addDays(d){const date=new Date();date.setDate(date.getDate()+d);return date.toISOString().split(‘T’)[0];}

const FRIDGE_INIT=[
{id:1,name:“Tomates”,qty:“500g”,cat:“legumes”,icon:“🍅”,exp:addDays(3)},
{id:2,name:“Poulet”,qty:“400g”,cat:“viandes”,icon:“🍗”,exp:addDays(2)},
{id:3,name:“Lait”,qty:“1L”,cat:“laitiers”,icon:“🥛”,exp:addDays(5)},
{id:4,name:“Œufs”,qty:“6”,cat:“laitiers”,icon:“🥚”,exp:addDays(10)},
{id:5,name:“Pommes”,qty:“4”,cat:“fruits”,icon:“🍎”,exp:addDays(7)},
{id:6,name:“Pâtes”,qty:“500g”,cat:“epicerie”,icon:“🍝”,exp:addDays(180)}
];

const $=id=>document.getElementById(id);
const $$=sel=>document.querySelectorAll(sel);
const show=el=>{if(el)el.classList.add(‘active’);};
const hide=el=>{if(el)el.classList.remove(‘active’);};
const showScreen=id=>{$$(’.screen’).forEach(s=>hide(s));show($(id));};

function toast(msg,type=’’){const t=document.createElement(‘div’);t.className=`toast ${type}`;t.textContent=msg;$(‘toasts’).appendChild(t);setTimeout(()=>t.remove(),3000);}
function showXP(amount){$(‘xp-amount’).textContent=`+${amount} XP`;$(‘xp-popup’).classList.add(‘show’);setTimeout(()=>$(‘xp-popup’).classList.remove(‘show’),1500);state.xp+=amount;updateStats();checkLevelUp();}
function checkLevelUp(){const needed=100*Math.pow(1.5,state.level-1);if(state.xp>=needed){state.level++;$(‘new-lv’).textContent=state.level;$(‘levelup’).classList.add(‘show’);}}
function updateStats(){if($(‘h-xp’))$(‘h-xp’).textContent=state.xp;if($(‘h-streak’))$(‘h-streak’).textContent=state.streak;if($(‘s-level’))$(‘s-level’).textContent=state.level;if($(‘s-streak’))$(‘s-streak’).textContent=state.streak;if($(‘ps-xp’))$(‘ps-xp’).textContent=state.xp;if($(‘ps-streak’))$(‘ps-streak’).textContent=state.streak;if($(‘p-lv’))$(‘p-lv’).textContent=state.level;if($(‘xp-lv’))$(‘xp-lv’).textContent=state.level;const needed=Math.floor(100*Math.pow(1.5,state.level-1));const progress=(state.xp%needed)/needed*100;if($(‘xp-fill’))$(‘xp-fill’).style.width=`${progress}%`;if($(‘xp-cur’))$(‘xp-cur’).textContent=state.xp%needed;if($(‘xp-max’))$(‘xp-max’).textContent=needed;}
function openModal(id){show($(id));}
function closeModal(id){hide($(id));}

// SPLASH -> ONBOARDING or MAIN
if(state.token){
state.user={username:‘Chef’,email:‘demo@yumr.app’};
state.xp=Math.floor(Math.random()*500);
state.level=Math.floor(state.xp/100)+1;
state.streak=Math.floor(Math.random()*10);
setTimeout(()=>initMainApp(),2500);
} else {
setTimeout(()=>showScreen(‘onboarding’),2500);
}

// ONBOARDING
let obSlide=0;
$(‘ob-next’).addEventListener(‘click’,()=>{
obSlide++;
if(obSlide>=3){
showScreen(‘auth’);
state.isRegister=true;
updateAuthUI();
}else{
$$(’.ob-slide’).forEach((s,i)=>s.classList.toggle(‘active’,i===obSlide));
$$(’.ob-dots .dot’).forEach((d,i)=>d.classList.toggle(‘active’,i===obSlide));
}
});
$(‘ob-login’).addEventListener(‘click’,()=>{state.isRegister=false;showScreen(‘auth’);updateAuthUI();});

// AUTH
function updateAuthUI(){
$(‘auth-title’).textContent=state.isRegister?‘Créer un compte’:‘Connexion’;
$(‘field-username’).style.display=state.isRegister?‘block’:‘none’;
$(‘auth-submit’).textContent=state.isRegister?‘Créer mon compte’:‘Se connecter’;
$(‘auth-switch’).innerHTML=state.isRegister?‘Déjà un compte ? <button id="auth-toggle">Se connecter</button>’:‘Pas de compte ? <button id="auth-toggle">Créer</button>’;
$(‘auth-toggle’).addEventListener(‘click’,()=>{state.isRegister=!state.isRegister;updateAuthUI();});
}
$(‘auth-back’).addEventListener(‘click’,()=>showScreen(‘onboarding’));
$(‘auth-form’).addEventListener(‘submit’,e=>{
e.preventDefault();
const email=$(‘auth-email’).value;
const pass=$(‘auth-password’).value;
const username=$(‘auth-username’)?.value||email.split(’@’)[0];
if(!email||!pass){$(‘auth-error’).textContent=‘Remplis tous les champs’;return;}
state.user={email,username};
state.token=‘demo_token_’+Date.now();
localStorage.setItem(‘yumr_token’,state.token);
showScreen(‘setup’);
updateSetupUI();
});

// SETUP
$(‘setup-back’).addEventListener(‘click’,()=>showScreen(‘auth’));
$(‘setup-next’).addEventListener(‘click’,()=>{
if(state.setupStep<3){
state.setupStep++;
updateSetupUI();
}else{
state.quizCount=parseInt(document.querySelector(‘input[name=“dur”]:checked’)?.value||30);
state.diet=document.querySelector(‘input[name=“diet”]:checked’)?.value||‘omnivore’;
state.allergies=[…$$(’.allergy-wrap input:checked’)].map(i=>i.value);
state.goal=document.querySelector(‘input[name=“goal”]:checked’)?.value||‘none’;
state.conditions=[…$$(’.cond-wrap input:checked’)].map(i=>i.value);
startQuiz();
}
});
$(‘setup-prev’).addEventListener(‘click’,()=>{if(state.setupStep>1){state.setupStep–;updateSetupUI();}});
function updateSetupUI(){
$$(’.setup-page’).forEach((p,i)=>p.classList.toggle(‘active’,i+1===state.setupStep));
$$(’.setup-steps .step’).forEach((s,i)=>s.classList.toggle(‘active’,i+1<=state.setupStep));
$(‘setup-prev’).style.visibility=state.setupStep>1?‘visible’:‘hidden’;
$(‘setup-next’).textContent=state.setupStep===3?‘Commencer le quiz’:‘Continuer’;
}

// QUIZ
function startQuiz(){showScreen(‘quiz’);state.currentQ=0;state.answers=[];state.streak=0;loadQuestion();}
function loadQuestion(){
if(state.currentQ>=state.quizCount){finishQuiz();return;}
const q=QUESTIONS[state.currentQ%QUESTIONS.length];
$(‘card-emoji’).textContent=q.emoji;
$(‘card-q’).textContent=q.q;
$(‘quiz-count’).textContent=`${state.currentQ+1}/${state.quizCount}`;
$(‘quiz-prog-fill’).style.width=`${(state.currentQ/state.quizCount)*100}%`;
$(‘quiz-streak’).textContent=state.streak;
const card=$(‘quiz-card’);
card.classList.remove(‘left’,‘right’,‘hint-left’,‘hint-right’);
card.style.transform=’’;
}
function answerQuestion(liked){
const q=QUESTIONS[state.currentQ%QUESTIONS.length];
state.answers.push({…q,liked});
if(liked)state.streak++;else state.streak=0;
const card=$(‘quiz-card’);
card.classList.add(liked?‘right’:‘left’);
setTimeout(()=>{state.currentQ++;loadQuestion();},400);
}

let startX=0,currentX=0,isDragging=false;
$(‘quiz-card’).addEventListener(‘touchstart’,e=>{startX=e.touches[0].clientX;isDragging=true;$(‘quiz-card’).classList.add(‘dragging’);});
$(‘quiz-card’).addEventListener(‘touchmove’,e=>{
if(!isDragging)return;
currentX=e.touches[0].clientX;
const diff=currentX-startX;
const card=$(‘quiz-card’);
card.style.transform=`translateX(${diff}px) rotate(${diff*0.05}deg)`;
card.classList.toggle(‘hint-left’,diff<-50);
card.classList.toggle(‘hint-right’,diff>50);
});
$(‘quiz-card’).addEventListener(‘touchend’,()=>{
isDragging=false;
$(‘quiz-card’).classList.remove(‘dragging’);
const diff=currentX-startX;
if(Math.abs(diff)>100){answerQuestion(diff>0);}
else{$(‘quiz-card’).style.transform=’’;$(‘quiz-card’).classList.remove(‘hint-left’,‘hint-right’);}
startX=currentX=0;
});
$(‘q-nope’).addEventListener(‘click’,()=>answerQuestion(false));
$(‘q-love’).addEventListener(‘click’,()=>answerQuestion(true));
$(‘quiz-close’).addEventListener(‘click’,()=>{if(confirm(‘Quitter le quiz ?’))showScreen(‘onboarding’);});

// RESULT
function finishQuiz(){
const profile=PROFILES[Math.floor(Math.random()*PROFILES.length)];
state.profile=profile;
showScreen(‘result’);
$(‘res-emoji’).textContent=profile.emoji;
$(‘res-name’).textContent=profile.name;
$(‘res-desc’).textContent=profile.desc;
$(‘res-tags’).innerHTML=profile.tags.map(t=>`<span>${t}</span>`).join(’’);
createConfetti();
setTimeout(()=>showXP(50),1000);
}
function createConfetti(){
const container=$(‘confetti’);
container.innerHTML=’’;
const colors=[’#FF6B35’,’#FFD166’,’#4ECB71’,’#FF4757’,’#fff’];
for(let i=0;i<50;i++){
const c=document.createElement(‘div’);
c.style.cssText=`position:absolute;width:10px;height:10px;background:${colors[i%colors.length]};left:${Math.random()*100}%;top:-10px;border-radius:${Math.random()>.5?'50%':'2px'};animation:fall ${2+Math.random()*2}s linear forwards;`;
container.appendChild(c);
}
const style=document.createElement(‘style’);
style.textContent=’@keyframes fall{to{top:100%;transform:rotate(720deg);}}’;
document.head.appendChild(style);
}
$(‘res-signup’).addEventListener(‘click’,()=>initMainApp());
$(‘res-skip’).addEventListener(‘click’,()=>{state.user={username:‘Invité’,email:’’};initMainApp();});

// MAIN APP
function initMainApp(){
showScreen(‘main’);
state.fridge=[…FRIDGE_INIT];
if(state.user){
$(‘u-name’).textContent=state.user.username||‘Chef’;
$(‘p-name’).textContent=’@’+(state.user.username||‘chef’);
}
if(state.profile){
$(‘p-emoji’).textContent=state.profile.emoji;
$(‘p-type’).textContent=state.profile.name;
}
updateStats();
updateFridgeCount();
renderRecipes();
renderLeaderboard();
renderBadges();
}

// NAV
$$(’.nav-btn’).forEach(btn=>{
btn.addEventListener(‘click’,()=>{
const tab=btn.dataset.tab;
$$(’.nav-btn’).forEach(b=>b.classList.remove(‘active’));
btn.classList.add(‘active’);
$$(’.tab’).forEach(t=>t.classList.toggle(‘active’,t.id===`tab-${tab}`));
});
});

// MENU OPTIONS
$(‘btn-menu’).addEventListener(‘click’,()=>openModal(‘m-menu’));
$$(’.budget-btns button’).forEach(btn=>{btn.addEventListener(‘click’,()=>{$$(’.budget-btns button’).forEach(b=>b.classList.remove(‘active’));btn.classList.add(‘active’);state.menuOptions.budget=btn.dataset.v;});});
$$(’.time-btns button’).forEach(btn=>{btn.addEventListener(‘click’,()=>{$$(’.time-btns button’).forEach(b=>b.classList.remove(‘active’));btn.classList.add(‘active’);state.menuOptions.time=parseInt(btn.dataset.v);});});
$$(’.diff-btns button’).forEach(btn=>{btn.addEventListener(‘click’,()=>{$$(’.diff-btns button’).forEach(b=>b.classList.remove(‘active’));btn.classList.add(‘active’);state.menuOptions.difficulty=btn.dataset.v;});});
document.querySelectorAll(’.stepper’).forEach(stepper=>{
const val=stepper.querySelector(‘span’);
stepper.querySelector(’.st-minus’)?.addEventListener(‘click’,()=>{let v=parseInt(val.textContent);if(v>1)val.textContent=v-1;});
stepper.querySelector(’.st-plus’)?.addEventListener(‘click’,()=>{let v=parseInt(val.textContent);if(v<12)val.textContent=v+1;});
});
$(‘confirm-menu’).addEventListener(‘click’,()=>{closeModal(‘m-menu’);generateMenu();});

function generateMenu(){
const starter=RECIPES.find(r=>r.type===‘starter’);
const main=RECIPES.find(r=>r.type===‘main’);
const dessert=RECIPES.find(r=>r.type===‘dessert’);
state.todayMenu={starter,main,dessert};
$(‘daily-status’).textContent=‘Menu prêt !’;
$(‘daily-preview’).innerHTML=` <div class="daily-item" data-id="${starter.id}"><div class="daily-item-img" style="background-image:url(${starter.img})"></div><div class="daily-item-info"><span class="daily-item-type">Entrée</span><span class="daily-item-name">${starter.name}</span></div></div> <div class="daily-item" data-id="${main.id}"><div class="daily-item-img" style="background-image:url(${main.img})"></div><div class="daily-item-info"><span class="daily-item-type">Plat</span><span class="daily-item-name">${main.name}</span></div></div> <div class="daily-item" data-id="${dessert.id}"><div class="daily-item-img" style="background-image:url(${dessert.img})"></div><div class="daily-item-info"><span class="daily-item-type">Dessert</span><span class="daily-item-name">${dessert.name}</span></div></div>`;
$$(’.daily-item’).forEach(item=>{item.addEventListener(‘click’,()=>openRecipe(parseInt(item.dataset.id)));});
showXP(20);
toast(‘Menu généré ! 🍽️’,‘success’);
}

// QUICK ACTIONS
$(‘q-fridge’).addEventListener(‘click’,()=>{openModal(‘m-fridge’);renderFridge();});
$(‘q-shop’).addEventListener(‘click’,()=>{openModal(‘m-shop’);renderShopping();});
$(‘q-prep’).addEventListener(‘click’,()=>openModal(‘m-prep’));
$(‘q-coach’).addEventListener(‘click’,()=>openModal(‘m-coach’));
$(‘q-resto’).addEventListener(‘click’,()=>openModal(‘m-resto’));
$(‘q-challenge’).addEventListener(‘click’,()=>toast(‘Défis bientôt disponibles !’));
$(‘s-rank-btn’).addEventListener(‘click’,()=>{
$$(’.nav-btn’).forEach(b=>b.classList.remove(‘active’));
document.querySelector(’.nav-btn[data-tab=“leagues”]’)?.classList.add(‘active’);
$$(’.tab’).forEach(t=>t.classList.toggle(‘active’,t.id===‘tab-leagues’));
});

// FRIDGE
function updateFridgeCount(){const count=state.fridge.length;if($(‘fridge-count’))$(‘fridge-count’).textContent=count;}
function renderFridge(cat=‘all’){
const list=$(‘fridge-list’);
if(!list)return;
const items=cat===‘all’?state.fridge:state.fridge.filter(i=>i.cat===cat);
const expiring=state.fridge.filter(i=>{const days=Math.ceil((new Date(i.exp)-new Date())/(1000*60*60*24));return days<=3;});
list.innerHTML=items.map(item=>{
const days=Math.ceil((new Date(item.exp)-new Date())/(1000*60*60*24));
const expClass=days<=2?‘bad’:days<=5?‘warn’:‘ok’;
return`<div class="fridge-item" data-id="${item.id}"><span class="fridge-item-icon">${item.icon}</span><div class="fridge-item-info"><span class="fridge-item-name">${item.name}</span><span class="fridge-item-qty">${item.qty}</span></div><span class="fridge-item-exp ${expClass}">${days}j</span><button class="fridge-item-del" data-id="${item.id}">🗑️</button></div>`;
}).join(’’);
if($(‘exp-list’)){
$(‘exp-list’).innerHTML=expiring.map(i=>`<div class="fridge-item"><span>${i.icon}</span><span>${i.name}</span></div>`).join(’’);
$(‘fridge-exp’).style.display=expiring.length?‘block’:‘none’;
}
$$(’.fridge-item-del’).forEach(btn=>{
btn.addEventListener(‘click’,e=>{
e.stopPropagation();
const id=parseInt(btn.dataset.id);
state.fridge=state.fridge.filter(i=>i.id!==id);
renderFridge(cat);
updateFridgeCount();
toast(‘Ingrédient supprimé’);
});
});
}
$$(’.fcat’).forEach(btn=>{btn.addEventListener(‘click’,()=>{$$(’.fcat’).forEach(b=>b.classList.remove(‘active’));btn.classList.add(‘active’);renderFridge(btn.dataset.c);});});
$(‘add-ing’).addEventListener(‘click’,()=>openModal(‘m-ing’));
$(‘save-ing’).addEventListener(‘click’,()=>{
const name=$(‘ing-name’).value;
const qty=$(‘ing-qty’).value;
const cat=$(‘ing-cat’).value;
const exp=$(‘ing-exp’).value;
if(!name){toast(‘Ajoute un nom’,‘error’);return;}
const icons={fruits:‘🍎’,legumes:‘🥬’,viandes:‘🥩’,laitiers:‘🧀’,epicerie:‘🥫’,surgeles:‘❄️’};
state.fridge.push({id:Date.now(),name,qty,cat,icon:icons[cat]||‘🍽️’,exp:exp||addDays(7)});
closeModal(‘m-ing’);
renderFridge();
updateFridgeCount();
toast(‘Ingrédient ajouté !’,‘success’);
$(‘ing-name’).value=’’;
$(‘ing-qty’).value=’’;
});
$(‘scan-fridge’).addEventListener(‘click’,()=>toast(‘Snap Frigo IA bientôt disponible ! 📷’));
$(‘scan-ticket’).addEventListener(‘click’,()=>toast(‘Scanner ticket bientôt disponible ! 🧾’));
$(‘tgtg’).addEventListener(‘click’,()=>toast(‘Too Good To Go bientôt disponible ! 🍀’));

// SHOPPING
function renderShopping(){
if(state.todayMenu){
state.shopping=[];
[state.todayMenu.starter,state.todayMenu.main,state.todayMenu.dessert].forEach(r=>{
if(r?.ingredients){r.ingredients.forEach(ing=>{if(!state.shopping.find(s=>s.name===ing)){state.shopping.push({name:ing,done:false});}});}
});
}
$(‘shop-count’).textContent=state.shopping.length;
$(‘shop-cost’).textContent=`~${state.shopping.length*2}€`;
$(‘shop-list’).innerHTML=state.shopping.map((item,i)=>`<div class="shop-item ${item.done?'done':''}" data-i="${i}"><input type="checkbox" ${item.done?'checked':''}><span class="shop-item-name">${item.name}</span></div>`).join(’’);
$$(’.shop-item input’).forEach((cb,i)=>{cb.addEventListener(‘change’,()=>{state.shopping[i].done=cb.checked;renderShopping();});});
}
$(‘btn-order’).addEventListener(‘click’,()=>toast(‘Commande bientôt disponible ! 🛒’));

// RECIPES
function renderRecipes(filter=‘all’,search=’’){
let recipes=[…RECIPES];
if(filter!==‘all’){
if(filter===‘quick’)recipes=recipes.filter(r=>r.time<=20);
else recipes=recipes.filter(r=>r.type===filter);
}
if(search){recipes=recipes.filter(r=>r.name.toLowerCase().includes(search.toLowerCase()));}
$(‘recipes’).innerHTML=recipes.map(r=>`<div class="recipe-card" data-id="${r.id}"><div class="recipe-img" style="background-image:url(${r.img})"><button class="recipe-save ${state.favorites.includes(r.id)?'saved':''}" data-id="${r.id}">${state.favorites.includes(r.id)?'❤️':'🤍'}</button></div><div class="recipe-body"><div class="recipe-name">${r.name}</div><div class="recipe-meta">⏱️ ${r.time}min • ${r.cost}</div></div></div>`).join(’’);
$$(’.recipe-card’).forEach(card=>{card.addEventListener(‘click’,e=>{if(!e.target.classList.contains(‘recipe-save’)){openRecipe(parseInt(card.dataset.id));}});});
$$(’.recipe-save’).forEach(btn=>{
btn.addEventListener(‘click’,e=>{
e.stopPropagation();
const id=parseInt(btn.dataset.id);
if(state.favorites.includes(id)){state.favorites=state.favorites.filter(f=>f!==id);btn.classList.remove(‘saved’);btn.textContent=‘🤍’;}
else{state.favorites.push(id);btn.classList.add(‘saved’);btn.textContent=‘❤️’;}
localStorage.setItem(‘yumr_fav’,JSON.stringify(state.favorites));
});
});
}
$$(’.filter’).forEach(btn=>{btn.addEventListener(‘click’,()=>{$$(’.filter’).forEach(b=>b.classList.remove(‘active’));btn.classList.add(‘active’);renderRecipes(btn.dataset.f);});});
$$(’.etab’).forEach(btn=>{
btn.addEventListener(‘click’,()=>{
$$(’.etab’).forEach(b=>b.classList.remove(‘active’));
btn.classList.add(‘active’);
if(btn.dataset.t===‘saved’){
const saved=RECIPES.filter(r=>state.favorites.includes(r.id));
$(‘recipes’).innerHTML=saved.length?saved.map(r=>`<div class="recipe-card" data-id="${r.id}"><div class="recipe-img" style="background-image:url(${r.img})"><button class="recipe-save saved" data-id="${r.id}">❤️</button></div><div class="recipe-body"><div class="recipe-name">${r.name}</div><div class="recipe-meta">⏱️ ${r.time}min • ${r.cost}</div></div></div>`).join(’’):’<p style="text-align:center;color:var(--text2);padding:40px">Aucune recette sauvegardée</p>’;
}else{renderRecipes();}
});
});
let searchTimeout;
$(‘search-in’).addEventListener(‘input’,e=>{clearTimeout(searchTimeout);searchTimeout=setTimeout(()=>renderRecipes(‘all’,e.target.value),300);});

function openRecipe(id){
const recipe=RECIPES.find(r=>r.id===id);
if(!recipe)return;
const types={starter:‘Entrée’,main:‘Plat’,dessert:‘Dessert’};
$(‘recipe-page’).innerHTML=`<div class="recipe-hero" style="background-image:url(${recipe.img})"><button class="back-btn recipe-back" data-close="m-recipe">←</button><button class="recipe-save-btn ${state.favorites.includes(id)?'saved':''}" data-id="${id}">${state.favorites.includes(id)?'❤️':'🤍'}</button></div><div class="recipe-content"><span class="recipe-type">${types[recipe.type]}</span><h1 class="recipe-title">${recipe.name}</h1><p class="recipe-desc">Une recette délicieuse et facile à préparer.</p><div class="recipe-metas"><span>⏱️ ${recipe.time} min</span><span>💰 ${recipe.cost}</span><span>🔥 ${recipe.calories} kcal</span></div><div class="recipe-section"><h3>🥗 Ingrédients</h3><ul>${recipe.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul></div><div class="recipe-section"><h3>👨‍🍳 Étapes</h3><ol>${recipe.steps.map(s=>`<li>${s}</li>`).join('')}</ol></div><button class="btn btn-primary btn-full" id="btn-cook">J'ai cuisiné ! +50 XP</button></div>`;
openModal(‘m-recipe’);
$(‘recipe-page’).querySelector(’.recipe-back’)?.addEventListener(‘click’,()=>closeModal(‘m-recipe’));
$(‘recipe-page’).querySelector(’.recipe-save-btn’)?.addEventListener(‘click’,function(){
if(state.favorites.includes(id)){state.favorites=state.favorites.filter(f=>f!==id);this.classList.remove(‘saved’);this.textContent=‘🤍’;}
else{state.favorites.push(id);this.classList.add(‘saved’);this.textContent=‘❤️’;}
localStorage.setItem(‘yumr_fav’,JSON.stringify(state.favorites));
});
$(‘btn-cook’)?.addEventListener(‘click’,()=>{closeModal(‘m-recipe’);showXP(50);toast(‘Bravo ! Recette cuisinée 👨‍🍳’,‘success’);state.streak++;updateStats();});
}

// POST
$(‘upload-zone’).addEventListener(‘click’,()=>$(‘post-file’).click());
$(‘post-file’).addEventListener(‘change’,e=>{
const file=e.target.files[0];
if(file){
const reader=new FileReader();
reader.onload=ev=>{$(‘post-img’).src=ev.target.result;$(‘post-img’).classList.add(‘show’);$$(’.upload-inner’).forEach(el=>el.style.display=‘none’);};
reader.readAsDataURL(file);
}
});
$(‘btn-post’).addEventListener(‘click’,()=>{
if(!$(‘post-img’).classList.contains(‘show’)){toast(‘Ajoute une photo !’,‘error’);return;}
toast(‘Photo publiée ! 📸’,‘success’);
showXP(30);
$(‘post-img’).classList.remove(‘show’);
$(‘post-img’).src=’’;
$$(’.upload-inner’).forEach(el=>el.style.display=’’);
$(‘post-caption’).value=’’;
});

// LEADERBOARD
function renderLeaderboard(){$(‘leaderboard’).innerHTML=LEADERBOARD.map(u=>`<div class="lb-item ${u.rank===12?'me':''}"><span class="lb-rank ${u.rank===1?'gold':u.rank===2?'silver':u.rank===3?'bronze':''}">#${u.rank}</span><div class="lb-av" style="background-image:url(https://i.pravatar.cc/40?img=${u.img})"></div><span class="lb-name">${u.name}</span><span class="lb-pts">${u.pts}</span></div>`).join(’’);}
$$(’.ltab’).forEach(btn=>{btn.addEventListener(‘click’,()=>{$$(’.ltab’).forEach(b=>b.classList.remove(‘active’));btn.classList.add(‘active’);const isRank=btn.dataset.v===‘rank’;$(‘leaderboard’).style.display=isRank?‘block’:‘none’;$(‘league-all’).style.display=isRank?‘none’:‘block’;});});

// BADGES
function renderBadges(){
$(‘badges-scroll’).innerHTML=BADGES.slice(0,5).map(b=>`<div class="badge-item ${b.unlocked?'':'locked'}"><div class="badge-icon">${b.emoji}</div><span>${b.name}</span></div>`).join(’’);
$(‘badges-grid’).innerHTML=BADGES.map(b=>`<div class="badge-card ${b.unlocked?'':'locked'}"><div class="badge-card-icon">${b.emoji}</div><div class="badge-card-name">${b.name}</div><div class="badge-card-desc">${b.desc}</div></div>`).join(’’);
$(‘ps-badges’).textContent=BADGES.filter(b=>b.unlocked).length;
}

// PROFILE
$(‘av-edit’).addEventListener(‘click’,()=>$(‘av-file’).click());
$(‘av-file’).addEventListener(‘change’,e=>{const file=e.target.files[0];if(file){const reader=new FileReader();reader.onload=ev=>$(‘av-img’).src=ev.target.result;reader.readAsDataURL(file);}});
$(‘badges-all’).addEventListener(‘click’,()=>openModal(‘m-badges’));
$(‘btn-prefs’).addEventListener(‘click’,()=>openModal(‘m-prefs’));
$(‘btn-fridge’).addEventListener(‘click’,()=>{openModal(‘m-fridge’);renderFridge();});
$(‘btn-ref’).addEventListener(‘click’,()=>openModal(‘m-ref’));
$(‘btn-premium’).addEventListener(‘click’,()=>openModal(‘m-prem’));
$(‘btn-settings’).addEventListener(‘click’,()=>toast(‘Paramètres bientôt disponibles !’));
$(‘btn-logout’).addEventListener(‘click’,()=>{if(confirm(‘Déconnexion ?’)){localStorage.removeItem(‘yumr_token’);location.reload();}});
$(‘save-prefs’).addEventListener(‘click’,()=>{state.diet=document.querySelector(‘input[name=“p-diet”]:checked’)?.value||state.diet;closeModal(‘m-prefs’);toast(‘Préférences sauvegardées !’,‘success’);});
$(‘copy-code’).addEventListener(‘click’,()=>{navigator.clipboard?.writeText(‘CHEF2024’);toast(‘Code copié !’,‘success’);});
$(‘share-ref’).addEventListener(‘click’,()=>{if(navigator.share){navigator.share({title:‘Yumr’,text:‘Rejoins Yumr avec mon code CHEF2024 !’,url:‘https://yumr.app’});}else{toast(‘Partage: https://yumr.app?ref=CHEF2024’);}});
$(‘btn-sub’).addEventListener(‘click’,()=>toast(‘Abonnement bientôt disponible !’));

// MODALS CLOSE
$$(’[data-close]’).forEach(btn=>{btn.addEventListener(‘click’,()=>closeModal(btn.dataset.close));});
$$(’.modal-bg’).forEach(bg=>{bg.addEventListener(‘click’,()=>{const modal=bg.closest(’.modal’);if(modal)hide(modal);});});
$(‘close-lv’).addEventListener(‘click’,()=>$(‘levelup’).classList.remove(‘show’));

console.log(‘🍽️ Yumr loaded!’);

}); // END DOMContentLoaded