// ===== QUESTIONS DATABASE =====

const QUESTIONS = {
    // Questions sur les allergènes
    allergens: [
        { id: 'gluten', question: "Tu peux manger du gluten ?", icon: "🌾", tags: ['gluten'] },
        { id: 'lactose', question: "Les produits laitiers, ça passe ?", icon: "🥛", tags: ['lactose'] },
        { id: 'nuts', question: "Les fruits à coque (noix, amandes...) ?", icon: "🥜", tags: ['nuts'] },
        { id: 'seafood', question: "Les fruits de mer ?", icon: "🦐", tags: ['seafood'] },
        { id: 'eggs', question: "Les œufs ?", icon: "🥚", tags: ['eggs'] },
        { id: 'soy', question: "Le soja ?", icon: "🫘", tags: ['soy'] },
    ],

    // Questions sur les préférences alimentaires
    diet: [
        { id: 'vegetarian', question: "Tu manges de la viande ?", icon: "🥩", tags: ['meat'] },
        { id: 'fish', question: "Tu manges du poisson ?", icon: "🐟", tags: ['fish'] },
        { id: 'pork', question: "Tu manges du porc ?", icon: "🐷", tags: ['pork'] },
        { id: 'alcohol', question: "Tu bois de l'alcool ?", icon: "🍷", tags: ['alcohol'] },
    ],

    // Questions sur les goûts
    tastes: [
        { id: 'spicy', question: "Tu aimes les plats épicés ?", icon: "🌶️", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&h=700&fit=crop&q=80", category: "Goût" },
        { id: 'sweet_savory', question: "Le sucré-salé ?", icon: "🍯", image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&h=700&fit=crop&q=80", category: "Goût" },
        { id: 'acidic', question: "Les plats acidulés ?", icon: "🍋", image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&h=700&fit=crop&q=80", category: "Goût" },
        { id: 'garlic', question: "L'ail dans les plats ?", icon: "🧄", image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2f83?w=800&h=700&fit=crop&q=80", category: "Goût" },
        { id: 'herbs', question: "Les herbes fraîches ?", icon: "🌿", image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=700&fit=crop&q=80", category: "Goût" },
        { id: 'ginger', question: "Le gingembre ?", icon: "🫚", image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&h=700&fit=crop&q=80", category: "Goût" },
        { id: 'truffle', question: "La truffe ?", icon: "🍄", image: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&h=700&fit=crop&q=80", category: "Goût" },
        { id: 'lemon', question: "Le citron ?", icon: "🍋", image: "https://images.unsplash.com/photo-1582087463261-ddea03f80e5d?w=800&h=700&fit=crop&q=80", category: "Goût" },
        { id: 'mint', question: "La menthe ?", icon: "🌱", image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&h=700&fit=crop&q=80", category: "Goût" },
    ],

    // Questions sur les textures
    textures: [
        { id: 'melted_cheese', question: "Fan de fromage fondu ?", icon: "🧀", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&h=700&fit=crop&q=80", category: "Texture", tags: ['lactose'] },
        { id: 'crunchy', question: "Tu aimes le croustillant ?", icon: "🥨", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=700&fit=crop&q=80", category: "Texture" },
        { id: 'creamy', question: "Les textures crémeuses ?", icon: "🍦", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&h=700&fit=crop&q=80", category: "Texture" },
        { id: 'sauce', question: "Les plats en sauce ?", icon: "🍲", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=700&fit=crop&q=80", category: "Texture" },
    ],

    // Questions sur les cuisines
    cuisines: [
        { id: 'italian', question: "La cuisine italienne ?", icon: "🇮🇹", image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
        { id: 'asian', question: "La cuisine asiatique ?", icon: "🥢", image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
        { id: 'mexican', question: "La cuisine mexicaine ?", icon: "🇲🇽", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
        { id: 'indian', question: "La cuisine indienne ?", icon: "🇮🇳", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
        { id: 'japanese', question: "La cuisine japonaise ?", icon: "🇯🇵", image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
        { id: 'lebanese', question: "La cuisine libanaise ?", icon: "🇱🇧", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
        { id: 'thai', question: "La cuisine thaï ?", icon: "🇹🇭", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
        { id: 'greek', question: "La cuisine grecque ?", icon: "🇬🇷", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
        { id: 'korean', question: "La cuisine coréenne ?", icon: "🇰🇷", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=700&fit=crop&q=80", category: "Cuisine" },
    ],

    // Questions sur les légumes
    vegetables: [
        { id: 'mushrooms', question: "Les champignons ?", icon: "🍄", image: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&h=700&fit=crop&q=80", category: "Légume" },
        { id: 'avocado', question: "Les avocats ?", icon: "🥑", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=700&fit=crop&q=80", category: "Légume" },
        { id: 'spinach', question: "Les épinards ?", icon: "🥬", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=700&fit=crop&q=80", category: "Légume" },
        { id: 'tomatoes', question: "Les tomates fraîches ?", icon: "🍅", image: "https://images.unsplash.com/photo-1546470427-227c7369a9b9?w=800&h=700&fit=crop&q=80", category: "Légume" },
        { id: 'zucchini', question: "Les courgettes ?", icon: "🥒", image: "https://images.unsplash.com/photo-1563252722-6434563a985d?w=800&h=700&fit=crop&q=80", category: "Légume" },
        { id: 'peppers', question: "Les poivrons ?", icon: "🫑", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&h=700&fit=crop&q=80", category: "Légume" },
        { id: 'eggplant', question: "Les aubergines ?", icon: "🍆", image: "https://images.unsplash.com/photo-1528505086635-4c69d5f10908?w=800&h=700&fit=crop&q=80", category: "Légume" },
        { id: 'peas', question: "Les petits pois ?", icon: "🫛", image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&h=700&fit=crop&q=80", category: "Légume" },
    ],

    // Questions sur les protéines
    proteins: [
        { id: 'red_meat', question: "Viande rouge ?", icon: "🥩", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=700&fit=crop&q=80", category: "Protéine", tags: ['meat'] },
        { id: 'chicken', question: "Le poulet rôti ?", icon: "🍗", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=700&fit=crop&q=80", category: "Protéine", tags: ['meat'] },
        { id: 'salmon', question: "Le saumon ?", icon: "🐟", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=700&fit=crop&q=80", category: "Protéine", tags: ['fish'] },
        { id: 'seafood', question: "Les fruits de mer ?", icon: "🦐", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=700&fit=crop&q=80", category: "Protéine", tags: ['seafood'] },
        { id: 'lamb', question: "L'agneau ?", icon: "🐑", image: "https://images.unsplash.com/photo-1514516345957-556ca7c90a29?w=800&h=700&fit=crop&q=80", category: "Protéine", tags: ['meat'] },
        { id: 'duck', question: "Le canard ?", icon: "🦆", image: "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=800&h=700&fit=crop&q=80", category: "Protéine", tags: ['meat'] },
        { id: 'tofu', question: "Le tofu ?", icon: "🧈", image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=800&h=700&fit=crop&q=80", category: "Protéine", tags: ['soy'] },
        { id: 'eggs', question: "Les œufs ?", icon: "🥚", image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&h=700&fit=crop&q=80", category: "Protéine", tags: ['eggs'] },
    ],

    // Questions sur les desserts
    desserts: [
        { id: 'dark_chocolate', question: "Chocolat noir ?", icon: "🍫", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=700&fit=crop&q=80", category: "Dessert" },
        { id: 'pastries', question: "Les pâtisseries ?", icon: "🥐", image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&h=700&fit=crop&q=80", category: "Dessert", tags: ['gluten'] },
        { id: 'ice_cream', question: "La glace artisanale ?", icon: "🍨", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&h=700&fit=crop&q=80", category: "Dessert", tags: ['lactose'] },
        { id: 'tiramisu', question: "Le tiramisu ?", icon: "☕", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=700&fit=crop&q=80", category: "Dessert", tags: ['eggs', 'lactose'] },
        { id: 'cheesecake', question: "Le cheesecake ?", icon: "🍰", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=700&fit=crop&q=80", category: "Dessert", tags: ['lactose', 'gluten'] },
        { id: 'crepes', question: "Les crêpes ?", icon: "🥞", image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&h=700&fit=crop&q=80", category: "Dessert", tags: ['gluten', 'eggs'] },
        { id: 'macarons', question: "Les macarons ?", icon: "🍪", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&h=700&fit=crop&q=80", category: "Dessert", tags: ['nuts', 'eggs'] },
    ],

    // Questions sur le style de repas
    styles: [
        { id: 'homemade', question: "Plutôt fait maison ?", icon: "👨‍🍳", image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=700&fit=crop&q=80", category: "Style" },
        { id: 'street_food', question: "Le street food ?", icon: "🌯", image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&h=700&fit=crop&q=80", category: "Style" },
        { id: 'healthy_bowls', question: "Les bowls healthy ?", icon: "🥗", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=700&fit=crop&q=80", category: "Style" },
        { id: 'brunch', question: "Le brunch ?", icon: "🍳", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=700&fit=crop&q=80", category: "Style" },
        { id: 'tapas', question: "Les tapas ?", icon: "🍢", image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&h=700&fit=crop&q=80", category: "Style" },
        { id: 'mezze', question: "Les mezze ?", icon: "🥙", image: "https://images.unsplash.com/photo-1540914124281-342587941389?w=800&h=700&fit=crop&q=80", category: "Style" },
        { id: 'bbq', question: "Le barbecue ?", icon: "🔥", image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=700&fit=crop&q=80", category: "Style" },
    ],

    // Questions sur le fromage (si plateau fromage)
    cheese: [
        { id: 'soft_cheese', question: "Les fromages à pâte molle (Brie, Camembert) ?", icon: "🧀", category: "Fromage", tags: ['lactose'] },
        { id: 'hard_cheese', question: "Les fromages à pâte dure (Comté, Parmesan) ?", icon: "🧀", category: "Fromage", tags: ['lactose'] },
        { id: 'blue_cheese', question: "Les fromages bleus (Roquefort, Gorgonzola) ?", icon: "🧀", category: "Fromage", tags: ['lactose'] },
        { id: 'goat_cheese', question: "Les fromages de chèvre ?", icon: "🐐", category: "Fromage", tags: ['lactose'] },
        { id: 'strong_cheese', question: "Les fromages forts ?", icon: "💪", category: "Fromage", tags: ['lactose'] },
    ],

    // Questions sur le vin (si accord mets-vins)
    wine: [
        { id: 'red_wine', question: "Tu préfères le vin rouge ?", icon: "🍷", category: "Vin", tags: ['alcohol'] },
        { id: 'white_wine', question: "Le vin blanc ?", icon: "🥂", category: "Vin", tags: ['alcohol'] },
        { id: 'rose_wine', question: "Le vin rosé ?", icon: "🌸", category: "Vin", tags: ['alcohol'] },
        { id: 'sparkling', question: "Les bulles (Champagne, Crémant) ?", icon: "🍾", category: "Vin", tags: ['alcohol'] },
        { id: 'sweet_wine', question: "Les vins sucrés (Sauternes, Porto) ?", icon: "🍯", category: "Vin", tags: ['alcohol'] },
        { id: 'tannic', question: "Les vins tanniques puissants ?", icon: "💜", category: "Vin", tags: ['alcohol'] },
        { id: 'light_wine', question: "Les vins légers et fruités ?", icon: "🍇", category: "Vin", tags: ['alcohol'] },
    ]
};

// ===== ALLERGEN LIST =====
const ALLERGENS = [
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'lactose', name: 'Lactose', icon: '🥛' },
    { id: 'nuts', name: 'Fruits à coque', icon: '🥜' },
    { id: 'seafood', name: 'Fruits de mer', icon: '🦐' },
    { id: 'eggs', name: 'Œufs', icon: '🥚' },
    { id: 'soy', name: 'Soja', icon: '🫘' },
    { id: 'fish', name: 'Poisson', icon: '🐟' },
    { id: 'celery', name: 'Céleri', icon: '🥬' },
    { id: 'mustard', name: 'Moutarde', icon: '🟡' },
    { id: 'sesame', name: 'Sésame', icon: '⚪' },
];

// ===== MENU OPTIONS =====
const MENU_OPTIONS = [
    { id: 'full', name: 'Menu complet', desc: 'Entrée + Plat + Dessert', icon: '🍽️' },
    { id: 'starter_main', name: 'Entrée + Plat', desc: 'Sans dessert', icon: '🥗' },
    { id: 'main_dessert', name: 'Plat + Dessert', desc: 'Sans entrée', icon: '🍰' },
    { id: 'main_only', name: 'Plat seul', desc: 'Simple et efficace', icon: '🍲' },
];

// ===== PROFILE TYPES =====
const PROFILE_TYPES = [
    {
        id: 'epicurien',
        name: "L'Épicurien Audacieux",
        desc: "Tu aimes les saveurs prononcées et tu n'as pas peur de sortir de ta zone de confort. Les plats traditionnels revisités te font vibrer.",
        tags: ['🌶️ Épicé', '🧀 Fromager', '🍖 Carnivore', '🌍 Monde'],
        traits: ['spicy', 'melted_cheese', 'red_meat', 'asian', 'indian']
    },
    {
        id: 'gourmet',
        name: "Le Gourmet Classique",
        desc: "Tu apprécies la gastronomie française et les saveurs traditionnelles. La qualité des produits est ta priorité.",
        tags: ['🇫🇷 Français', '🍷 Vin', '🧈 Beurre', '🥖 Tradition'],
        traits: ['sauce', 'red_wine', 'french', 'homemade']
    },
    {
        id: 'healthy',
        name: "Le Healthy Gourmand",
        desc: "Tu privilégies une alimentation équilibrée sans sacrifier le plaisir. Les légumes et les protéines légères sont tes alliés.",
        tags: ['🥗 Fresh', '🥑 Healthy', '🐟 Poisson', '🌱 Végétal'],
        traits: ['healthy_bowls', 'salmon', 'avocado', 'spinach']
    },
    {
        id: 'explorer',
        name: "L'Explorateur Culinaire",
        desc: "Tu adores découvrir de nouvelles cuisines du monde. Chaque repas est une aventure gustative.",
        tags: ['🌍 Monde', '🌶️ Épices', '🥢 Asie', '🌮 Americas'],
        traits: ['asian', 'mexican', 'indian', 'korean', 'thai']
    },
    {
        id: 'comfort',
        name: "L'Amateur de Comfort Food",
        desc: "Tu aimes les plats réconfortants et généreux. Le fromage fondu et les gratins sont tes péchés mignons.",
        tags: ['🧀 Fromage', '🍝 Pâtes', '🥧 Gratin', '❤️ Réconfort'],
        traits: ['melted_cheese', 'italian', 'sauce', 'homemade']
    }
];

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUESTIONS, ALLERGENS, MENU_OPTIONS, PROFILE_TYPES };
}
