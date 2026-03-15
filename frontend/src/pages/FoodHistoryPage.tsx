/**
 * FoodHistoryPage — curated topic page: History of Food, Cuisine & Agriculture.
 *
 * Route: /food
 *
 * Sections:
 *  1. Hero — "You Are What History Ate"
 *  2. Filter bar — category + era filters
 *  3. Timeline milestones — 32 entries from fire to lab-grown meat
 *  4. Cuisine Explorer — 10 world cuisines with origin stories
 *  5. Foods That Changed History — 5 dramatic examples
 *
 * All data is static/curated — no backend API needed.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type FoodCategory = 'Cooking' | 'Agriculture' | 'Preservation' | 'Beverages' | 'Trade' | 'Industry' | 'Science' | 'Culture';
type Era = 'Prehistoric' | 'Ancient' | 'Medieval' | 'Early Modern' | 'Industrial' | 'Modern';

interface Milestone {
  name: string; year: number; isBce: boolean; figure: string;
  category: FoodCategory; whatItChanged: string; impact?: string; era: Era; slug?: string;
}
interface WorldCuisine {
  name: string; flag: string; origin: string; keyIngredients: string[];
  signatureDishes: string[]; howItSpread: string; color: string;
}
interface FoodThatChangedHistory {
  title: string; period: string; summary: string; consequence: string; icon: string; color: string;
}

const CATEGORY_COLORS: Record<FoodCategory, string> = {
  Cooking: '#ef4444', Agriculture: '#22c55e', Preservation: '#3b82f6', Beverages: '#a855f7',
  Trade: '#f97316', Industry: '#14b8a6', Science: '#ec4899', Culture: '#eab308',
};
const CATEGORY_ICONS: Record<FoodCategory, string> = {
  Cooking: '\u{1F525}', Agriculture: '\u{1F33E}', Preservation: '\u{1F9C2}', Beverages: '\u{2615}',
  Trade: '\u{1F6A2}', Industry: '\u{1F3ED}', Science: '\u{1F52C}', Culture: '\u{1F37D}\uFE0F',
};
const ERA_ORDER: Era[] = ['Prehistoric', 'Ancient', 'Medieval', 'Early Modern', 'Industrial', 'Modern'];

const MILESTONES: Milestone[] = [
  { name: 'Controlled Fire & Cooking', year: 1000000, isBce: true, figure: 'Homo erectus', category: 'Cooking', whatItChanged: 'The mastery of fire transformed human evolution. Cooking made food easier to digest, unlocking more calories and nutrients. This surplus energy fueled brain growth, with cranial capacity increasing roughly 20% over subsequent millennia. Cooked food also reduced parasites and foodborne illness, extending lifespans.', impact: 'Enabled human brain evolution', era: 'Prehistoric' },
  { name: 'Salt Harvesting Begins', year: 6050, isBce: true, figure: 'Neolithic communities', category: 'Preservation', whatItChanged: 'Salt became one of humanity\'s first preservatives, allowing food to be stored for months. Salt deposits in modern-day Romania and China were among the earliest exploited. The word "salary" derives from Latin salarium, reflecting how Roman soldiers were partially paid in salt. Salt routes shaped trade networks for millennia.', impact: 'Created global trade networks', era: 'Prehistoric' },
  { name: 'Wine Fermentation', year: 6000, isBce: true, figure: 'South Caucasus peoples', category: 'Beverages', whatItChanged: 'Archaeological evidence from Georgia and Armenia shows grape cultivation and wine production dating to 6000 BCE. The oldest known winery (Areni-1 cave, Armenia) dates to 4100 BCE. Wine became central to religious ceremonies, trade, and social life across the ancient Mediterranean.', era: 'Prehistoric' },
  { name: 'Agricultural Revolution', year: 10000, isBce: true, figure: 'Fertile Crescent farmers', category: 'Agriculture', whatItChanged: 'The single most transformative event in food history. Wild wheat, barley, and emmer were domesticated in the Fertile Crescent (modern Iraq, Syria, Turkey). Humans shifted from nomadic hunting-gathering to settled farming. This enabled permanent settlements, population growth, social hierarchy, and eventually civilization itself.', impact: 'Birth of civilization', era: 'Prehistoric', slug: 'neolithic-revolution' },
  { name: 'Olive Cultivation', year: 4000, isBce: true, figure: 'Eastern Mediterranean peoples', category: 'Agriculture', whatItChanged: 'Olive trees were among the first cultivated fruit trees, domesticated in the Levant around 4000 BCE. Olive oil became a pillar of Mediterranean civilization \u2014 used for cooking, lamp fuel, medicine, soap, and religious anointing. It was so valuable it served as trade currency and tribute payment.', era: 'Ancient' },
  { name: 'Beer Brewing', year: 3500, isBce: true, figure: 'Sumerians', category: 'Beverages', whatItChanged: 'The Sumerians composed the "Hymn to Ninkasi," a prayer to the goddess of beer that doubles as the oldest known beer recipe. Beer was a dietary staple \u2014 safer than water, nutritious, and consumed by all social classes. Brewers held high social status, and beer rations were a form of currency in Mesopotamia.', era: 'Ancient' },
  { name: 'Leavened Bread', year: 3000, isBce: true, figure: 'Egyptian bakers', category: 'Cooking', whatItChanged: 'Egyptian bakers discovered that wild yeast in dough produced carbon dioxide, creating light, airy bread. This accident revolutionized baking. Egypt became known as the "breadbasket of the ancient world." Bread became the primary caloric source for most civilizations and remains so today \u2014 the word "companion" literally means "one who shares bread."', era: 'Ancient' },
  { name: 'Spice Trade Begins', year: 2000, isBce: true, figure: 'Indian & Arab merchants', category: 'Trade', whatItChanged: 'The spice trade connected Asia to the Mediterranean via overland and maritime routes. Pepper, cinnamon, cardamom, and turmeric from India were worth their weight in gold in Europe. These trade networks became the Silk Road, driving exploration, colonization, and eventually globalization. Wars were fought over spice monopolies.', impact: 'Drove global exploration', era: 'Ancient' },
  { name: 'Soy Sauce & Fermentation in China', year: 1000, isBce: true, figure: 'Chinese fermenters', category: 'Preservation', whatItChanged: 'Chinese artisans developed sophisticated fermentation techniques producing soy sauce, tofu, vinegar, and preserved vegetables. Fermentation extended food shelf life in a pre-refrigeration world and created entirely new flavor profiles (umami). These techniques spread across East Asia, shaping Japanese, Korean, and Southeast Asian cuisines.', era: 'Ancient' },
  { name: 'Roman Garum & Culinary Culture', year: 100, isBce: true, figure: 'Roman cooks', category: 'Culture', whatItChanged: 'Rome\'s garum \u2014 a fermented fish sauce \u2014 was the ketchup of the ancient world, used in virtually every dish. Roman cuisine featured elaborate multi-course feasts (cena), exotic imports, and the first known cookbook (Apicius). Roman food culture established dining as a social institution, with reclining banquets that could last hours.', era: 'Ancient' },
  { name: 'Sugar Cane Cultivation Spreads', year: 600, isBce: false, figure: 'Indian & Persian cultivators', category: 'Agriculture', whatItChanged: 'Sugar cane, native to New Guinea and domesticated in India, spread to Persia, then the Arab world, and finally Europe via the Crusades. By the 1500s, sugar plantations in the Caribbean and Brazil relied on enslaved African labor, creating one of history\'s greatest moral catastrophes. Sugar transformed from luxury spice to global commodity.', impact: 'Drove transatlantic slave trade', era: 'Medieval' },
  { name: 'Distillation of Spirits', year: 800, isBce: false, figure: 'Jabir ibn Hayyan', category: 'Beverages', whatItChanged: 'Islamic alchemists perfected distillation (the word "alcohol" comes from Arabic al-kuhl). While initially used for perfumes and medicines, the technique spread to Europe where it produced brandy, whiskey, gin, and vodka. Distilled spirits became trade goods, naval provisions, and unfortunately, tools of colonial exploitation.', era: 'Medieval' },
  { name: 'Spice Wars & the Pepper Trade', year: 1200, isBce: false, figure: 'Venetian & Arab merchants', category: 'Trade', whatItChanged: 'Venice monopolized the European spice trade through its relationship with Arab middlemen. Black pepper was so valuable that peppercorns were counted individually and used as currency. The desire to break Venice\'s monopoly drove Portugal and Spain to seek sea routes to Asia \u2014 directly causing the Age of Exploration.', impact: 'Caused the Age of Exploration', era: 'Medieval' },
  { name: 'Chocolate in Mesoamerica', year: 1400, isBce: false, figure: 'Aztec & Maya', category: 'Beverages', whatItChanged: 'The Maya and Aztec prepared cacao as a bitter, spiced drink called xocolatl \u2014 literally "bitter water." Cacao beans were so prized they served as currency. After Spanish conquest, Europeans added sugar to chocolate, transforming it into the sweet confection we know today. The chocolate industry is now worth over $130 billion annually.', era: 'Medieval' },
  { name: 'Columbian Exchange', year: 1492, isBce: false, figure: 'Christopher Columbus & traders', category: 'Trade', whatItChanged: 'The most dramatic food exchange in history. Tomatoes, potatoes, corn, chili peppers, cacao, and vanilla went from the Americas to Europe. Wheat, sugar, rice, coffee, horses, and cattle went the other direction. This reshaped every cuisine on Earth. Italy got tomatoes. Ireland got potatoes. Thailand got chili peppers. Nothing was the same.', impact: 'Reshaped every cuisine on Earth', era: 'Early Modern', slug: 'columbian-exchange' },
  { name: 'Potatoes Transform Europe', year: 1600, isBce: false, figure: 'Frederick the Great & others', category: 'Agriculture', whatItChanged: 'Initially rejected as poisonous or associated with leprosy, the potato eventually became Europe\'s most important crop. Frederick the Great of Prussia ordered peasants to grow potatoes to prevent famine. Potatoes produced 2\u20134x more calories per acre than grain, enabling population booms in Ireland, Prussia, and Russia. They became the caloric backbone of industrializing Europe.', impact: 'Enabled European population boom', era: 'Early Modern' },
  { name: 'Coffee Houses & Intellectual Culture', year: 1650, isBce: false, figure: 'London & Vienna merchants', category: 'Beverages', whatItChanged: 'Coffee arrived in Europe via Ottoman Turkey and spawned a revolution in public life. London\'s coffee houses \u2014 dubbed "penny universities" \u2014 became hubs of intellectual exchange, business deals, and political debate. Lloyd\'s of London started in a coffee house. The Enlightenment itself was partly fueled by caffeine replacing alcohol as the daytime drink of choice.', impact: 'Fueled the Enlightenment', era: 'Early Modern' },
  { name: 'Tea Transforms the British Empire', year: 1700, isBce: false, figure: 'East India Company', category: 'Beverages', whatItChanged: 'Britain\'s appetite for Chinese tea drove the establishment of tea plantations in India and Ceylon. The tea trade shaped imperial policy: Britain exported opium to China to balance tea payments, sparking the Opium Wars. The Boston Tea Party (1773) helped ignite the American Revolution. Tea remains the world\'s most consumed beverage after water.', impact: 'Shaped British imperialism', era: 'Early Modern' },
  { name: 'Canning Invented', year: 1810, isBce: false, figure: 'Nicolas Appert', category: 'Preservation', whatItChanged: 'Napoleon offered a 12,000-franc prize for a method to preserve food for his armies. Nicolas Appert won by sealing food in glass jars and heating them \u2014 the birth of canning. Peter Durand soon patented the tin can. Canning transformed warfare, exploration, and eventually everyday life, making seasonal foods available year-round.', impact: 'Revolutionized food storage', era: 'Industrial' },
  { name: 'Mechanical Refrigeration', year: 1856, isBce: false, figure: 'James Harrison', category: 'Industry', whatItChanged: 'Australian James Harrison built the first practical mechanical refrigeration system. By the 1880s, refrigerated ships transported frozen meat from Australia and Argentina to Britain. Home refrigerators became common by the 1930s. Refrigeration ended seasonal eating, enabled supermarkets, and fundamentally changed how humanity stores and distributes food.', impact: 'Ended seasonal eating', era: 'Industrial' },
  { name: 'Pasteurization', year: 1864, isBce: false, figure: 'Louis Pasteur', category: 'Science', whatItChanged: 'Louis Pasteur demonstrated that heating beverages killed harmful microorganisms without destroying flavor. Applied first to wine, then milk, pasteurization dramatically reduced tuberculosis, typhoid, and infant mortality. Before pasteurization, up to 25% of all foodborne illness was traced to contaminated milk. It remains one of the most impactful food safety innovations in history.', impact: 'Billions of lives protected', era: 'Industrial' },
  { name: 'Margarine Invented', year: 1869, isBce: false, figure: 'Hippolyte M\u00e8ge-Mouri\u00e8s', category: 'Industry', whatItChanged: 'Napoleon III offered a prize for a cheap butter substitute to feed his army and the poor. French chemist Hippolyte M\u00e8ge-Mouri\u00e8s created margarine from beef tallow and milk. It sparked a century-long "butter vs. margarine" war, with dairy lobbyists banning margarine coloring in many US states. Margarine eventually outsold butter in most countries.', era: 'Industrial' },
  { name: 'Processed Food Revolution', year: 1906, isBce: false, figure: 'Kellogg, Post & others', category: 'Industry', whatItChanged: 'The early 1900s saw the birth of processed food: Kellogg\'s corn flakes (originally an anti-masturbation health food), Wonder Bread (first sliced bread, 1928), Coca-Cola, and canned soup. Upton Sinclair\'s "The Jungle" (1906) exposed meatpacking horrors, leading to the Pure Food and Drug Act. Convenience food transformed American eating habits forever.', era: 'Industrial' },
  { name: 'Frozen Foods Go Mainstream', year: 1930, isBce: false, figure: 'Clarence Birdseye', category: 'Industry', whatItChanged: 'Clarence Birdseye, inspired by Inuit flash-freezing techniques in Labrador, developed quick-freezing technology that preserved food quality. His Birds Eye brand launched in 1930, and by the 1950s, frozen TV dinners symbolized modern American life. Flash-freezing preserved nutrients better than canning and revolutionized food distribution.', era: 'Modern' },
  { name: 'Microwave Oven', year: 1945, isBce: false, figure: 'Percy Spencer', category: 'Science', whatItChanged: 'Raytheon engineer Percy Spencer noticed that a magnetron (radar component) melted a chocolate bar in his pocket. He experimented with popcorn and eggs, then built the first microwave oven. The countertop model arrived in 1967, and by the 1980s, microwaves were in 90% of American kitchens. It epitomized the convenience food revolution.', impact: 'In 90% of US kitchens', era: 'Modern' },
  { name: 'Green Revolution', year: 1961, isBce: false, figure: 'Norman Borlaug', category: 'Agriculture', whatItChanged: 'Norman Borlaug developed high-yield, disease-resistant wheat varieties that tripled harvests in Mexico, India, and Pakistan. His work prevented predicted mass famines in the 1970s and is credited with saving over one billion lives. He won the Nobel Peace Prize in 1970. Critics note the environmental costs of intensive agriculture, but the human impact is undeniable.', impact: 'Saved 1 billion+ lives', era: 'Modern', slug: 'green-revolution' },
  { name: 'McDonald\'s Goes Global', year: 1967, isBce: false, figure: 'Ray Kroc', category: 'Culture', whatItChanged: 'McDonald\'s opened its first international restaurant in Canada (1967), then rapidly expanded worldwide. By 2024, it operates 40,000+ restaurants in 100+ countries. McDonald\'s became the symbol of American cultural export \u2014 and a target of anti-globalization movements. The "Big Mac Index" is used by The Economist as a measure of purchasing power parity.', impact: '40,000+ restaurants worldwide', era: 'Modern' },
  { name: 'Organic & Farm-to-Table Movement', year: 1971, isBce: false, figure: 'Alice Waters', category: 'Culture', whatItChanged: 'Alice Waters opened Chez Panisse in Berkeley, California, championing locally sourced, seasonal, organic ingredients. This was a direct reaction against processed food industrialization. The organic food market grew from niche to a $200+ billion global industry. Waters\' philosophy influenced chefs worldwide and spawned farmers\' markets, CSAs, and the "slow food" movement.', era: 'Modern' },
  { name: 'Food Network Launches', year: 1993, isBce: false, figure: 'Reese Schonfeld', category: 'Culture', whatItChanged: 'The Television Food Network launched in 1993, transforming cooking from domestic chore to entertainment spectacle. Celebrity chefs like Emeril Lagasse, Julia Child, and later Gordon Ramsay became household names. Food television spawned food tourism, competitive cooking shows, and a cultural obsession with restaurant culture that persists through social media today.', era: 'Modern' },
  { name: 'Molecular Gastronomy', year: 1994, isBce: false, figure: 'Ferran Adri\u00e0', category: 'Science', whatItChanged: 'Ferran Adri\u00e0 at El Bulli (Spain) pioneered molecular gastronomy \u2014 using scientific techniques like spherification, foams, and liquid nitrogen to deconstruct and reimagine food. His restaurant was named the world\'s best five times. This movement proved cooking could be a form of artistic and intellectual expression, blurring the line between science and cuisine.', era: 'Modern' },
  { name: 'Lab-Grown Meat', year: 2013, isBce: false, figure: 'Mark Post', category: 'Science', whatItChanged: 'Dutch scientist Mark Post served the first lab-grown beef burger in London, cultured from bovine stem cells at a cost of $300,000. By 2024, regulatory approvals were granted in Singapore and the US for cultured meat products. This technology promises to reduce the environmental impact of livestock farming, which produces 14.5% of global greenhouse gas emissions.', impact: 'Future of sustainable protein', era: 'Modern' },
];

const WORLD_CUISINES: WorldCuisine[] = [
  { name: 'Chinese', flag: '\u{1F1E8}\u{1F1F3}', origin: 'One of the world\'s oldest culinary traditions, Chinese cuisine evolved over 5,000 years across eight regional schools (Sichuan, Cantonese, Shandong, etc.). Philosophy of yin-yang balance, medicinal eating, and the "five flavors" (sweet, sour, salty, bitter, umami) shaped every dish.', keyIngredients: ['soy sauce', 'rice', 'ginger', 'garlic', 'sesame oil', 'Sichuan peppercorn'], signatureDishes: ['Peking duck', 'dim sum', 'mapo tofu', 'kung pao chicken', 'hot pot'], howItSpread: 'Chinese diaspora communities established restaurants worldwide from the 1800s. American Chinese food (chop suey, General Tso\'s) became its own distinct cuisine. Today Chinese food is available in virtually every country on Earth.', color: '#ef4444' },
  { name: 'Indian', flag: '\u{1F1EE}\u{1F1F3}', origin: 'Indian cuisine spans 5,000 years of history, shaped by Ayurvedic medicine, Mughal courts, British colonialism, and regional diversity. The subcontinent\'s 28 states each have distinct culinary identities. Vegetarianism, influenced by Hindu and Jain traditions, produced the world\'s most diverse meat-free cooking.', keyIngredients: ['turmeric', 'cumin', 'coriander', 'chili', 'ghee', 'cardamom', 'garam masala'], signatureDishes: ['butter chicken', 'biryani', 'dosa', 'samosa', 'dal makhani'], howItSpread: 'British colonialism created "curry" as a catch-all term. Indian restaurants spread through the British Commonwealth. Chicken tikka masala was declared Britain\'s "national dish." Indian spice blends now influence cuisines worldwide.', color: '#f97316' },
  { name: 'Italian', flag: '\u{1F1EE}\u{1F1F9}', origin: 'Italian cuisine descends from Roman culinary traditions but was transformed by New World imports \u2014 tomatoes, peppers, and corn arrived after 1492. Regional diversity is extreme: Neapolitan pizza, Bolognese rag\u00f9, Sicilian seafood, Tuscan simplicity. The Italian philosophy of few, excellent ingredients prepared simply became globally influential.', keyIngredients: ['olive oil', 'tomatoes', 'basil', 'Parmigiano-Reggiano', 'pasta', 'garlic'], signatureDishes: ['pizza Margherita', 'pasta carbonara', 'risotto', 'osso buco', 'tiramisu'], howItSpread: 'Italian immigrants brought their food to the Americas (1880s\u20131920s). Pizza became America\'s favorite food. Italian cuisine is consistently ranked the world\'s most popular, with pasta and pizza available in every country.', color: '#22c55e' },
  { name: 'French', flag: '\u{1F1EB}\u{1F1F7}', origin: 'French cuisine was codified by chefs like Marie-Antoine Car\u00eame and Auguste Escoffier, who created the brigade system and classical techniques (saut\u00e9, flamb\u00e9, julienne). The French Revolution displaced aristocratic chefs who then opened public restaurants \u2014 inventing the modern restaurant industry. French cooking emphasizes technique, sauce-making, and terroir.', keyIngredients: ['butter', 'cream', 'wine', 'shallots', 'herbs de Provence', 'Dijon mustard'], signatureDishes: ['coq au vin', 'bouillabaisse', 'croissants', 'souffl\u00e9', 'cr\u00e8me br\u00fbl\u00e9e'], howItSpread: 'French cuisine became the international standard for fine dining. Le Cordon Bleu schools opened worldwide. The Michelin Guide (1900) created the restaurant rating system still used today. "Haute cuisine" remains synonymous with culinary excellence.', color: '#3b82f6' },
  { name: 'Japanese', flag: '\u{1F1EF}\u{1F1F5}', origin: 'Japanese cuisine reflects the island nation\'s geography and Buddhist influence. Washoku (traditional Japanese cuisine) was designated a UNESCO Intangible Cultural Heritage in 2013. Emphasis on seasonality (shun), presentation, umami, and respect for ingredients defines the cuisine. The concept of "ichigo ichie" (one chance, one meeting) elevates each meal.', keyIngredients: ['rice', 'soy sauce', 'miso', 'dashi', 'wasabi', 'nori', 'mirin'], signatureDishes: ['sushi', 'ramen', 'tempura', 'kaiseki', 'okonomiyaki'], howItSpread: 'Sushi bars emerged in the US in the 1960s\u201370s. Ramen became a global phenomenon in the 2010s. Japanese food culture (izakaya, bento, convenience store food) is widely imitated. Japan has more Michelin-starred restaurants than any other country.', color: '#ec4899' },
  { name: 'Mexican', flag: '\u{1F1F2}\u{1F1FD}', origin: 'Mexican cuisine is built on the ancient "trinity" of corn, beans, and squash cultivated by Maya and Aztec civilizations for millennia. Spanish colonization added pork, beef, dairy, and wheat, creating mestizo cuisine. In 2010, traditional Mexican cuisine was designated a UNESCO Intangible Cultural Heritage \u2014 the first cuisine to receive this honor.', keyIngredients: ['corn', 'chili peppers', 'beans', 'avocado', 'tomato', 'lime', 'cilantro'], signatureDishes: ['tacos', 'mole', 'tamales', 'pozole', 'chiles en nogada'], howItSpread: 'Tex-Mex emerged in the US borderlands. Taco culture went global in the 2010s. Mexican street food (tacos al pastor, elote, churros) is now found worldwide. Mole, with 20+ ingredients, is considered one of the world\'s most complex sauces.', color: '#14b8a6' },
  { name: 'Thai', flag: '\u{1F1F9}\u{1F1ED}', origin: 'Thai cuisine masterfully balances five flavors: sweet, sour, salty, bitter, and spicy. Influenced by Chinese, Indian, and Southeast Asian traditions, it was transformed by the Columbian Exchange \u2014 chili peppers from the Americas became central to Thai cooking only after the 1500s. The royal court refined street food into an art form.', keyIngredients: ['lemongrass', 'galangal', 'kaffir lime', 'fish sauce', 'Thai basil', 'chili', 'coconut milk'], signatureDishes: ['pad Thai', 'green curry', 'tom yum soup', 'som tam', 'massaman curry'], howItSpread: 'Thailand\'s "Global Thai" program (2002) strategically promoted Thai restaurants abroad as cultural diplomacy \u2014 a strategy now called "gastrodiplomacy." Thai restaurants increased from 5,500 worldwide in 2002 to over 15,000 by 2020.', color: '#a855f7' },
  { name: 'Ethiopian', flag: '\u{1F1EA}\u{1F1F9}', origin: 'Ethiopia is the birthplace of coffee and home to one of Africa\'s most distinctive cuisines. Injera, a sourdough flatbread made from teff flour, serves as both plate and utensil. Ethiopian cuisine features complex spice blends (berbere, mitmita) and a strong tradition of fasting foods (vegan dishes for Orthodox Christian fasting days).', keyIngredients: ['teff', 'berbere spice', 'niter kibbeh', 'mitmita', 'korarima', 'fenugreek'], signatureDishes: ['injera with wot', 'doro wot', 'kitfo', 'shiro', 'tibs'], howItSpread: 'Ethiopian diaspora communities established restaurants in Washington DC, London, and other cities from the 1980s. Ethiopian coffee ceremonies became cultural exports. The communal eating style (sharing from one plate) attracted food enthusiasts globally.', color: '#eab308' },
  { name: 'Turkish', flag: '\u{1F1F9}\u{1F1F7}', origin: 'Turkish cuisine is the heir to the Ottoman Empire\'s vast culinary network, which fused Central Asian, Middle Eastern, Mediterranean, and Balkan influences. The Ottoman palace kitchens employed hundreds of specialized cooks. Turkish cuisine bridges East and West, with breakfast culture (kahvalt\u0131) considered among the world\'s finest.', keyIngredients: ['yogurt', 'lamb', 'eggplant', 'pomegranate', 'sumac', 'pul biber', 'tahini'], signatureDishes: ['kebab', 'baklava', 'manti', 'lahmacun', 'pide'], howItSpread: 'Ottoman expansion spread kebab culture across the Middle East, Balkans, and North Africa. The d\u00f6ner kebab became Germany\'s most popular street food via Turkish immigrants. Turkish coffee culture influenced cafes from Vienna to Baghdad.', color: '#f59e0b' },
  { name: 'Peruvian', flag: '\u{1F1F5}\u{1F1EA}', origin: 'Peru sits at the crossroads of Incan, Spanish, African, Chinese, and Japanese culinary traditions. With 84 of the world\'s 117 life zones, Peru has extraordinary biodiversity \u2014 over 3,000 potato varieties alone. The Nikkei (Japanese-Peruvian) and Chifa (Chinese-Peruvian) fusion cuisines are unique culinary innovations found nowhere else.', keyIngredients: ['aji peppers', 'potato', 'corn', 'quinoa', 'lime', 'cilantro', 'huacatay'], signatureDishes: ['ceviche', 'lomo saltado', 'causa', 'aji de gallina', 'anticuchos'], howItSpread: 'Lima was named the "gastronomic capital of the Americas." Central (Lima) is consistently ranked among the world\'s best restaurants. Ceviche went global in the 2000s, and quinoa \u2014 a Peruvian/Bolivian staple \u2014 became a global superfood.', color: '#6366f1' },
];

const FOODS_THAT_CHANGED_HISTORY: FoodThatChangedHistory[] = [
  { title: 'The Irish Potato Famine (1845\u20131852)', period: '1845\u20131852', summary: 'Ireland\'s dependence on a single potato variety (the Irish Lumper) proved catastrophic when the Phytophthora infestans blight struck. Over one million people died of starvation and disease. Another million emigrated, mostly to the United States. Ireland\'s population dropped by 25% in seven years \u2014 it still hasn\'t recovered to pre-famine levels.', consequence: 'Reshaped Irish demographics forever. Created the Irish-American diaspora that influenced US politics, culture, and identity. Led to lasting resentment of British rule and fueled the Irish independence movement.', icon: '\u{1F954}', color: '#22c55e' },
  { title: 'Spice Trade Wars (1500s\u20131700s)', period: '1500s\u20131700s', summary: 'The quest for cloves, nutmeg, and pepper drove European powers to war. Portugal seized Malacca (1511) to control the spice route. The Dutch East India Company (VOC) became the world\'s first multinational corporation, monopolizing the "Spice Islands" (Moluccas). The Dutch traded Manhattan to the English for Run Island \u2014 a tiny nutmeg-producing atoll.', consequence: 'Created the first global corporations. Established colonial empires in Southeast Asia. The Dutch, Portuguese, and British empires were built largely on spice profits. Modern Indonesia\'s borders were shaped by spice geography.', icon: '\u{1F336}\uFE0F', color: '#f97316' },
  { title: 'Sugar & the Atlantic Slave Trade', period: '1500s\u20131800s', summary: 'Sugar cane production in the Caribbean and Brazil was the primary economic driver of the Atlantic slave trade. An estimated 12.5 million Africans were forcibly transported to the Americas, with the majority destined for sugar plantations. Sugar work was so brutal that plantations required constant resupply of enslaved workers \u2014 mortality rates exceeded birth rates.', consequence: 'The single greatest forced migration in human history. Created the African diaspora across the Americas. Sugar profits funded the Industrial Revolution in Britain. The legacy of plantation slavery shapes racial inequality to this day.', icon: '\u{1F36C}', color: '#a855f7' },
  { title: 'Salt & the Rise of Empires', period: 'Ancient\u2013Modern', summary: 'Salt was the most strategically important food substance for millennia. It preserved meat and fish, enabling armies to march, navies to sail, and cities to survive winter. Control of salt production meant control of populations. Salt taxes (gabelle in France) were a primary revenue source for empires and a primary grievance of their subjects.', consequence: 'Salt taxes helped trigger the French Revolution. Gandhi\'s Salt March (1930) became a defining moment of Indian independence. The word "salary" and the phrase "worth his salt" reflect salt\'s historic value. Salt routes created cities (Salzburg = "salt fortress").', icon: '\u{1F9C2}', color: '#3b82f6' },
  { title: 'The Columbian Exchange (1492\u2013)', period: '1492 onward', summary: 'When Columbus reached the Americas, he triggered the largest biological exchange in history. Potatoes and corn from the Americas prevented famines and enabled population growth in Europe, Africa, and Asia. But European diseases (smallpox, measles) killed an estimated 90% of indigenous Americans. Sugar and tobacco created plantation economies built on slavery.', consequence: 'Every major cuisine on Earth was transformed. Italy without tomatoes, Ireland without potatoes, Thailand without chili peppers \u2014 none existed before 1492. The exchange also brought ecological devastation and demographic catastrophe to the Americas.', icon: '\u{1F30D}', color: '#14b8a6' },
];

function formatYear(year: number, isBce: boolean): string {
  if (isBce) {
    if (year >= 1000000) return `~${(year / 1000000).toFixed(0)}M BCE`;
    if (year >= 1000) return `${(year / 1000).toFixed(0)},000 BCE`;
    return `${year} BCE`;
  }
  return String(year);
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: active ? `1px solid ${color ?? '#60a5fa'}` : '1px solid rgba(255,255,255,0.1)', backgroundColor: active ? `${color ?? '#60a5fa'}22` : 'rgba(255,255,255,0.04)', color: active ? color ?? '#60a5fa' : '#94a3b8', transition: 'all 0.15s' }}>
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>{icon}</span>{title}
    </h2>
  );
}

function MilestoneCard({ milestone: m, index }: { milestone: Milestone; index: number }) {
  const color = CATEGORY_COLORS[m.category];
  const icon = CATEGORY_ICONS[m.category];
  const yearDisplay = formatYear(m.year, m.isBce);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }} style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33`, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, backgroundColor: `${color}22`, color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{icon} {m.category}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>{yearDisplay}</span>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, margin: 0 }}>{m.name}</h3>
      <div style={{ fontSize: 13, color: '#94a3b8' }}><strong style={{ color: '#cbd5e1' }}>{m.figure}</strong></div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>{m.whatItChanged}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
        {m.impact && <span style={{ fontSize: 12, fontWeight: 600, color: '#f97316', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(249,115,22,0.1)' }}>{m.impact}</span>}
        {m.slug ? (
          <Link to={`/event/${m.slug}`} style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(96,165,250,0.25)', backgroundColor: 'rgba(96,165,250,0.08)' }}>Find in Chronicle &rarr;</Link>
        ) : (
          <span style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>Find in Chronicle &rarr;</span>
        )}
      </div>
    </motion.div>
  );
}

function CuisineCard({ cuisine, index }: { cuisine: WorldCuisine; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }} onClick={() => setExpanded(!expanded)} style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${cuisine.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{cuisine.flag}</span>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{cuisine.name}</h3>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginBottom: expanded ? 16 : 0 }}>
        {expanded ? cuisine.origin : cuisine.origin.slice(0, 120) + '...'}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Key Ingredients</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {cuisine.keyIngredients.map((ing) => <span key={ing} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: `${cuisine.color}18`, color: cuisine.color, fontWeight: 600 }}>{ing}</span>)}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Signature Dishes</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {cuisine.signatureDishes.map((dish) => <span key={dish} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)', color: '#cbd5e1', fontWeight: 600 }}>{dish}</span>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Global Spread</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>{cuisine.howItSpread}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HistoryCard({ item, index }: { item: FoodThatChangedHistory; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }} style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${item.color}33`, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `${item.color}18`, border: `2px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{item.title}</h3>
          <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{item.period}</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{item.summary}</div>
      <div style={{ fontSize: 13, color: item.color, lineHeight: 1.65, padding: '10px 14px', borderRadius: 8, backgroundColor: `${item.color}0d`, borderLeft: `3px solid ${item.color}55` }}>
        <strong>Consequence:</strong> {item.consequence}
      </div>
    </motion.div>
  );
}

export default function FoodHistoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');
  const [selectedEra, setSelectedEra] = useState<Era | 'All'>('All');
  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter((m) => {
      if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
      if (selectedEra !== 'All' && m.era !== selectedEra) return false;
      return true;
    });
  }, [selectedCategory, selectedEra]);
  const categories: FoodCategory[] = ['Cooking', 'Agriculture', 'Preservation', 'Beverages', 'Trade', 'Industry', 'Science', 'Culture'];

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(249,115,22,0.08) 100%)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 28, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>{'\u2190'} Back to Timeline</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(249,115,22,0.15)', border: '2px solid rgba(249,115,22,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 0 24px rgba(249,115,22,0.2)' }}>{'\u{1F372}'}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: 'rgba(249,115,22,0.15)', color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Topic Page</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.15, marginBottom: 14 }}>You Are What History Ate</h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, maxWidth: 700, margin: 0 }}>Food Through the Ages {'\u2014'} from the first controlled fire to lab-grown meat. The milestones, cuisines, and ingredients that shaped civilizations, toppled empires, and fed revolutions.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value={`${MILESTONES.length}`} label="Milestones" />
            <StatBadge value="10" label="World Cuisines" />
            <StatBadge value="1M+" label="Years of History" />
          </div>
        </motion.div>

        {/* Category Filters */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Category:</span>
          <FilterPill label="All" active={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')} />
          {categories.map((cat) => <FilterPill key={cat} label={`${CATEGORY_ICONS[cat]} ${cat}`} active={selectedCategory === cat} color={CATEGORY_COLORS[cat]} onClick={() => setSelectedCategory(cat)} />)}
        </div>

        {/* Era Filters */}
        <div style={{ padding: '12px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Era:</span>
          <FilterPill label="All Eras" active={selectedEra === 'All'} onClick={() => setSelectedEra('All')} />
          {ERA_ORDER.map((era) => <FilterPill key={era} label={era} active={selectedEra === era} onClick={() => setSelectedEra(era)} />)}
        </div>

        {/* Milestones Grid */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F4C5}'} title={`Timeline \u2014 ${filteredMilestones.length} Milestones`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {filteredMilestones.map((m, i) => <MilestoneCard key={m.name} milestone={m} index={i} />)}
            </AnimatePresence>
          </div>
          {filteredMilestones.length === 0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569', fontSize: 14 }}>No milestones match the current filters.</div>}
        </section>

        {/* Cuisine Explorer */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F30D}'} title="Cuisine Explorer \u2014 10 World Cuisines" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Click any cuisine to explore its origin story, key ingredients, signature dishes, and how it spread around the world.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {WORLD_CUISINES.map((c, i) => <CuisineCard key={c.name} cuisine={c} index={i} />)}
          </div>
        </section>

        {/* Foods That Changed History */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F4A5}'} title="Foods That Changed History" />
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Five dramatic examples of how a single food reshaped demographics, economies, and the fate of nations.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FOODS_THAT_CHANGED_HISTORY.map((item, i) => <HistoryCard key={item.title} item={item} index={i} />)}
          </div>
        </section>

        {/* Footer */}
        <div style={{ padding: '32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>{'\u2190'} Back to Timeline</Link>
        </div>
      </div>
    </div>
  );
}
