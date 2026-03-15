import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#d4770b';   // Furnace orange
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(212,119,11,0.05)';
const CARD_BORDER = 'rgba(212,119,11,0.18)';
const STEAM_GREY = '#8a9199';
const COAL_BLACK = '#3c3c3c';
const IRON_RED = '#a83232';
const RAIL_BROWN = '#8b5e3c';
const FACTORY_GOLD = '#c9a84c';
const ELECTRIC_BLUE = '#3a7ca5';
const COTTON_WHITE = '#b5a88a';
const REFORM_GREEN = '#2e8b57';
const SMOKE_PURPLE = '#7b5e8b';

/* ───────── Types ───────── */
type SectionTab =
  | 'timeline'
  | 'whybritain'
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'inventions'
  | 'humancost'
  | 'labor'
  | 'figures'
  | 'railroads'
  | 'environment'
  | 'globalspread'
  | 'social'
  | 'legacy';

interface TimelineEvent {
  date: string;
  title: string;
  detail: string;
  color: string;
}

interface Figure {
  name: string;
  dates: string;
  role: string;
  contribution: string;
  detail: string;
  icon: string;
  color: string;
}

interface Invention {
  year: string;
  title: string;
  detail: string;
  icon: string;
  color: string;
}

/* ───────── Data ───────── */

const CONTEXT_TEXT = 'The Industrial Revolution was the biggest transformation in human life since the invention of agriculture. In barely 150 years — from about 1760 to 1914 — humanity went from a world where 90% of people farmed the land by hand to one of factories, railways, electric lights, and mass-produced goods. It created the modern world: cities, the middle class, global trade, the labor movement, environmental crisis, and the technology-driven economy we live in today. It also produced some of history\'s worst working conditions, child labor, and urban squalor. Every aspect of modern life — from your phone to the global economy — traces back to this revolution.';

const TIMELINE_EVENTS: TimelineEvent[] = [
  { date: '1712', title: 'Newcomen\'s Steam Pump', detail: 'Thomas Newcomen built the first practical steam engine — a massive atmospheric pump used to drain water from coal mines. Inefficient but revolutionary: it was the first time humans harnessed steam power for sustained mechanical work. It would be improved by James Watt six decades later into the engine that powered the Industrial Revolution.', color: STEAM_GREY },
  { date: '1733', title: 'Flying Shuttle (Kay)', detail: 'John Kay\'s flying shuttle doubled the speed of weaving, allowing a single weaver to produce wider cloth. This created a bottleneck — weavers could now work faster than spinners could supply yarn — which drove the invention of spinning machines and launched the textile revolution.', color: COTTON_WHITE },
  { date: '1764', title: 'Spinning Jenny (Hargreaves)', detail: 'James Hargreaves invented the Spinning Jenny, which allowed one worker to spin eight threads simultaneously instead of one. Named (supposedly) after his daughter, it was simple enough to use at home but productive enough to begin industrializing textile production. By the 1780s, Jennies with 80 spindles were common.', color: COTTON_WHITE },
  { date: '1769', title: 'Steam Engine Improved (Watt)', detail: 'James Watt transformed Newcomen\'s crude steam pump into a true engine by adding a separate condenser, which dramatically reduced fuel waste. Watt\'s engine was three times more efficient and could be adapted to power any kind of machinery — not just pumps. His partnership with Matthew Boulton brought steam power to factories, mills, and eventually transportation.', color: STEAM_GREY },
  { date: '1771', title: 'Arkwright\'s Water Frame Mill', detail: 'Richard Arkwright opened the first water-powered cotton spinning mill at Cromford, Derbyshire. This was the birth of the factory system — hundreds of workers under one roof, operating machines on a fixed schedule. Arkwright became fabulously wealthy and is often called the "father of the factory system."', color: FACTORY_GOLD },
  { date: '1779', title: 'Spinning Mule (Crompton)', detail: 'Samuel Crompton\'s spinning mule combined the best features of the Spinning Jenny and the Water Frame, producing thread that was both fine and strong. It could spin any type of yarn and became the dominant spinning technology for a century. Crompton was too poor to patent it and died in relative poverty while others profited.', color: COTTON_WHITE },
  { date: '1785', title: 'Power Loom (Cartwright)', detail: 'Edmund Cartwright\'s power loom mechanized weaving, completing the automation of the textile industry. Now both spinning and weaving could be done by machine in factories. The power loom was initially unreliable, but by the 1820s improved versions had replaced most handloom weavers — destroying a centuries-old craft but producing cloth at a fraction of the cost.', color: COTTON_WHITE },
  { date: '1793', title: 'Cotton Gin (Whitney)', detail: 'Eli Whitney\'s cotton gin could clean 50 pounds of cotton per day — versus one pound by hand. It made short-staple cotton enormously profitable, which massively expanded cotton cultivation across the American South. The tragic consequence: it entrenched and expanded slavery, as planters needed ever more enslaved labor to grow the cotton that the gin could now process. The cotton fed Britain\'s textile mills, linking American slavery directly to British industrialization.', color: IRON_RED },
  { date: '1804', title: 'First Steam Locomotive (Trevithick)', detail: 'Richard Trevithick built the first steam locomotive to run on rails, hauling 10 tons of iron and 70 men along a tramway in Merthyr Tydfil, Wales. It proved that steam power could move on rails, not just pump water or drive factory machines. Though the cast-iron rails cracked under its weight, Trevithick had invented the future of transportation.', color: RAIL_BROWN },
  { date: '1811–1816', title: 'The Luddite Movement', detail: 'Textile workers in Nottingham, Yorkshire, and Lancashire began destroying machinery that they believed was eliminating their jobs and driving down wages. Named after the possibly mythical "Ned Ludd," the Luddites were not anti-technology — they were skilled craftsmen fighting for living wages and fair treatment. The government responded with mass trials and hangings. The movement was crushed, but the underlying tension between technology and labor has never gone away.', color: IRON_RED },
  { date: '1825', title: 'First Passenger Railway', detail: 'George Stephenson\'s Stockton & Darlington Railway became the first public railway to use steam locomotives for passenger and freight service. It demonstrated that railways were not just for mines — they could connect cities and transform commerce. Five years later, the Liverpool & Manchester Railway would prove the concept at scale.', color: RAIL_BROWN },
  { date: '1833', title: 'Factory Act', detail: 'The first effective Factory Act banned employment of children under 9 in textile mills, limited children aged 9–13 to 8 hours per day, and required two hours of daily education. It also created factory inspectors to enforce the rules — the first government regulation of industrial working conditions. It was a modest start, but it established the principle that the state could intervene to protect workers from exploitation.', color: REFORM_GREEN },
  { date: '1844', title: 'Telegraph (Morse)', detail: 'Samuel Morse sent the first telegraph message ("What hath God wrought?") from Washington to Baltimore. The telegraph was the first technology to transmit information faster than a person could physically travel — a communication revolution as profound as the internet. Within a decade, telegraph wires connected cities across America and Europe. By 1866, a transatlantic cable linked the continents.', color: ELECTRIC_BLUE },
  { date: '1848', title: 'Communist Manifesto', detail: 'Karl Marx and Friedrich Engels published The Communist Manifesto, a direct response to the industrial misery they witnessed in Manchester\'s cotton mills. "Workers of the world, unite!" became the rallying cry for socialist and labor movements worldwide. Whether one agrees with Marx or not, his analysis of industrial capitalism\'s contradictions remains one of the most influential texts ever written.', color: IRON_RED },
  { date: '1856', title: 'Bessemer Steel Process', detail: 'Henry Bessemer invented a process to mass-produce steel cheaply by blowing air through molten pig iron. Before Bessemer, steel was expensive and made in small batches. After: steel became cheap enough to build railways, bridges, skyscrapers, and ships. The Bessemer process (and later the Siemens-Martin open hearth) made the modern built environment possible.', color: STEAM_GREY },
  { date: '1859', title: 'On the Origin of Species (Darwin)', detail: 'Charles Darwin published his theory of evolution by natural selection — a scientific revolution born of the same empirical spirit that drove industrial innovation. The industrial era\'s advances in geology, fossil collection, and global exploration made Darwin\'s work possible. His ideas transformed biology, medicine, and humanity\'s understanding of its place in nature.', color: REFORM_GREEN },
  { date: '1869', title: 'Transcontinental Railroad (USA)', detail: 'The completion of the first transcontinental railroad at Promontory Summit, Utah, connected the Atlantic and Pacific coasts by rail. Built largely by Irish and Chinese immigrant laborers under brutal conditions, it shrank a six-month journey to six days. It created a truly national American market, accelerated western settlement, and devastated Native American communities whose lands the railroad crossed.', color: RAIL_BROWN },
  { date: '1876', title: 'Telephone (Bell)', detail: 'Alexander Graham Bell patented the telephone, enabling real-time voice communication over distance for the first time. Within decades, telephone networks connected homes, businesses, and nations. The telephone transformed commerce, social life, and emergency response — and laid the groundwork for the telecommunications revolution of the 20th century.', color: ELECTRIC_BLUE },
  { date: '1879', title: 'Electric Light Bulb (Edison)', detail: 'Thomas Edison developed a practical incandescent light bulb that could burn for over 1,200 hours. More importantly, Edison built the entire electrical system — generators, wiring, meters, switches — needed to deliver electricity to homes and businesses. His Pearl Street Station in Manhattan (1882) was the first commercial power plant. Edison didn\'t just invent a bulb; he invented the electrical grid.', color: FACTORY_GOLD },
  { date: '1885', title: 'Automobile (Benz)', detail: 'Karl Benz built the first true automobile — the Benz Patent-Motorwagen — powered by an internal combustion engine. His wife Bertha made the first long-distance car journey (66 miles) to prove its practicality. The automobile would eventually transform cities, create suburbs, build highways, reshape the oil industry, and become the defining technology of 20th-century life.', color: RAIL_BROWN },
  { date: '1886', title: 'American Federation of Labor Founded', detail: 'Samuel Gompers founded the AFL, uniting craft unions into a national federation focused on practical gains: higher wages, shorter hours, better conditions. Unlike radical socialist unions, the AFL worked within the capitalist system. It became the dominant force in American labor for decades and established collective bargaining as a standard practice.', color: REFORM_GREEN },
  { date: '1901', title: 'US Steel — First Billion-Dollar Corporation', detail: 'J.P. Morgan merged Andrew Carnegie\'s steel empire with other companies to create US Steel, capitalized at $1.4 billion — the first corporation in history to exceed $1 billion. It controlled 67% of American steel production. The creation of US Steel symbolized the new era of corporate industrial capitalism and the staggering concentration of wealth the Industrial Revolution had produced.', color: STEAM_GREY },
  { date: '1903', title: 'Airplane (Wright Brothers)', detail: 'Orville and Wilbur Wright achieved the first sustained, controlled, powered heavier-than-air flight at Kitty Hawk, North Carolina. Their longest flight that day lasted 59 seconds and covered 852 feet. Within 66 years, humans would walk on the moon. The airplane revolutionized warfare, commerce, travel, and humanity\'s relationship with distance.', color: ELECTRIC_BLUE },
  { date: '1908', title: 'Model T Ford (Assembly Line)', detail: 'Henry Ford introduced the Model T and, by 1913, perfected the moving assembly line to produce it. The assembly line reduced production time from 12 hours per car to 93 minutes, dropping the price from $850 to $260. For the first time, ordinary workers could afford the products they made. Ford also paid workers $5/day — double the average wage — proving that well-paid workers become consumers. Mass production and mass consumption: the modern economy was born.', color: FACTORY_GOLD },
  { date: '1914', title: 'Start of World War I', detail: 'The industrial revolution\'s endpoint (and darkest product): industrial-scale warfare. Machine guns, poison gas, tanks, airplanes, submarines, and mass-produced artillery shells turned WWI into a mechanized slaughter that killed 20 million people. The same factories that mass-produced consumer goods now mass-produced death. The war demonstrated both the awesome power and the terrifying destructive potential of industrial civilization.', color: IRON_RED },
];

const WHY_BRITAIN = [
  { title: 'Coal and Iron Geography', detail: 'Britain sat on enormous, easily accessible deposits of both coal and iron ore — often located near each other and near navigable rivers or coasts. Coal powered the steam engines; iron (and later steel) built the machines, rails, and bridges. No other country had such convenient deposits in such close proximity. Geography was destiny.', icon: '⛏️', color: COAL_BLACK },
  { title: 'Stable Government and Property Rights', detail: 'After the Glorious Revolution of 1688, Britain had a constitutional monarchy with strong property rights, rule of law, and a Parliament that included merchant interests. Investors could build factories without fear of royal confiscation. Contracts were enforceable. This political stability made long-term capital investment rational in a way it wasn\'t in absolutist France or fragmented Germany.', icon: '⚖️', color: REFORM_GREEN },
  { title: 'Patent System', detail: 'Britain\'s patent system (dating from the 1624 Statute of Monopolies) gave inventors exclusive rights to profit from their innovations for 14 years. This created a direct financial incentive to invent — your ideas were legally yours. James Watt\'s steam engine patent made him wealthy and attracted investors. Without patent protection, why risk years perfecting a machine?', icon: '📜', color: FACTORY_GOLD },
  { title: 'Colonial Markets and Raw Materials', detail: 'The British Empire provided both raw materials (cotton from India and America, wool from Australia, sugar from the Caribbean) and captive markets to sell finished goods. British textile mills processed American cotton picked by enslaved people, then sold the cloth back to the colonies. Empire was not incidental to industrialization — it was fuel.', icon: '🌍', color: ELECTRIC_BLUE },
  { title: 'Enclosure Movement', detail: 'From the 16th to 19th centuries, Parliament passed Enclosure Acts that privatized common lands — village fields and pastures that peasant farmers had used for centuries. Wealthy landowners consolidated holdings; displaced peasants had no land to farm. They migrated to cities seeking factory work, providing the enormous labor force that industrialization demanded. The workers didn\'t choose the factories — they were pushed there.', icon: '🏚️', color: RAIL_BROWN },
  { title: 'Banking and Capital', detail: 'The Bank of England (founded 1694) and London\'s financial markets provided the capital needed for large-scale investment. Joint-stock companies allowed many investors to pool money and share risk. Britain had more accumulated wealth and better financial infrastructure than any rival. Starting a factory required enormous upfront investment — and Britain had the money.', icon: '🏦', color: FACTORY_GOLD },
  { title: 'Island Geography and Naval Power', detail: 'As an island nation, Britain was protected from invasion (no foreign army had landed since 1066), allowing uninterrupted economic development. Its powerful Royal Navy protected trade routes and ensured access to global markets. Continental rivals faced constant threats of land invasion and had to spend resources on armies rather than factories.', icon: '⚓', color: STEAM_GREY },
  { title: 'Culture of Practical Innovation', detail: 'Britain\'s scientific societies, coffeehouses, and "Lunar Society" of industrialists fostered a culture where practical tinkering was celebrated. Many key inventors were self-taught craftsmen, not university professors. The Royal Society promoted applied science. Nonconformist Protestants (barred from universities and politics) channeled their energies into business and invention. Innovation was culturally respected and economically rewarded.', icon: '🔧', color: ACCENT },
];

const PHASE1 = [
  { title: 'Textile Revolution', detail: 'Cotton textiles drove the first phase. A cascade of inventions — the flying shuttle (1733), spinning jenny (1764), water frame (1769), spinning mule (1779), power loom (1785) — mechanized both spinning and weaving. Production exploded: British cotton output increased 10,000% between 1760 and 1840. Manchester became "Cottonopolis," the world\'s first industrial city. Hand spinners and weavers — who had worked at home for centuries — were replaced by factory workers tending machines.', icon: '🧵', color: COTTON_WHITE },
  { title: 'The Steam Engine', detail: 'James Watt\'s improved steam engine (patented 1769, commercially produced from 1776) was the breakthrough technology that made everything else possible. Steam power freed factories from rivers — you could build a mill anywhere with a coal supply. Steam pumped water from deeper mines, unlocking more coal and iron. Steam powered the bellows in iron foundries. By 1800, there were over 500 Watt steam engines operating in Britain.', icon: '♨️', color: STEAM_GREY },
  { title: 'Iron Industry', detail: 'Abraham Darby\'s technique of smelting iron with coke (purified coal) instead of charcoal, perfected by his son and grandson, made iron cheap and abundant. Iron replaced wood in machines, bridges, and buildings. The Iron Bridge at Coalbrookdale (1779) — the first major bridge made entirely of iron — became a symbol of the new age. Iron production in Britain grew from 28,000 tons in 1760 to 250,000 tons in 1806.', icon: '⚒️', color: IRON_RED },
  { title: 'Canal Mania (1760s–1830s)', detail: 'Before railways, canals were the arteries of industry. The Bridgewater Canal (1761) halved the price of coal in Manchester and triggered a canal-building frenzy. By 1830, Britain had over 4,000 miles of navigable waterways connecting mines, factories, and ports. Canals made it economical to move heavy goods — coal, iron, pottery — that roads couldn\'t handle. The canal network was the first modern freight infrastructure.', icon: '🚢', color: ELECTRIC_BLUE },
  { title: 'The Factory System', detail: 'Before industrialization, most goods were produced by skilled artisans working at home or in small workshops (the "putting-out" or "domestic" system). Factories centralized production: hundreds of workers under one roof, operating machines on a fixed schedule, supervised by managers. Workers lost independence but gained (low) wages. Factory owners gained control over production speed, quality, and labor. Richard Arkwright\'s Cromford Mill (1771) was the prototype — and the model for every factory since.', icon: '🏭', color: ACCENT },
];

const PHASE2 = [
  { title: 'Railway Revolution (1830s–1860s)', detail: 'The Liverpool & Manchester Railway (1830) proved that railways could profitably carry both passengers and freight between major cities. A building frenzy followed: Britain had 6,000 miles of track by 1850; the US had 30,000 by 1860. Railways shrank distances, created national markets, enabled mass migration, and stimulated demand for iron, steel, and coal. They were the backbone of industrial expansion.', icon: '🚂', color: RAIL_BROWN },
  { title: 'Steel Age Begins', detail: 'Henry Bessemer\'s process (1856) and the Siemens-Martin open hearth furnace made mass-produced steel affordable. Steel was stronger, lighter, and more durable than iron — perfect for rails, bridges, ships, and buildings. World steel production rose from 500,000 tons in 1870 to 28 million tons by 1900. Steel made skyscrapers, modern navies, and transcontinental railroads possible.', icon: '🔩', color: STEAM_GREY },
  { title: 'Spread to Continental Europe', detail: 'Belgium industrialized first (1830s), followed by France, the German states, and northern Italy. Each adapted British technology to local conditions. Germany\'s Krupp steelworks became Europe\'s largest industrial enterprise. The Zollverein (German customs union, 1834) created a unified market that accelerated German industrialization. By 1870, Germany was challenging Britain\'s industrial supremacy.', icon: '🌍', color: ELECTRIC_BLUE },
  { title: 'American Industrialization', detail: 'The United States industrialized rapidly from the 1840s, powered by vast natural resources, mass immigration (cheap labor), the transcontinental railroad (1869), and a culture of entrepreneurial capitalism. The Civil War (1861–65) massively accelerated Northern industrialization — the Union\'s industrial superiority in factories, railroads, and weapons production was decisive in winning the war. By 1900, the US had overtaken Britain as the world\'s largest industrial economy.', icon: '🇺🇸', color: IRON_RED },
  { title: 'Telegraph Networks', detail: 'The electric telegraph (1840s) created the first global information network. By the 1860s, undersea cables connected continents. News, stock prices, and military orders could travel in minutes instead of weeks. Reuters and the Associated Press were founded to exploit the telegraph. It transformed finance (real-time markets), journalism (breaking news), warfare (battlefield communication), and diplomacy. It was the Victorian internet.', icon: '⚡', color: ELECTRIC_BLUE },
];

const PHASE3 = [
  { title: 'Electricity', detail: 'Thomas Edison\'s Pearl Street Station (1882) brought electric power to lower Manhattan — the first commercial power grid. Within a generation, electricity transformed factory production (individual electric motors replaced cumbersome belt-and-shaft systems), enabled new industries (aluminum smelting, electroplating), and revolutionized daily life (electric lights, streetcars, elevators, refrigeration). Nikola Tesla and George Westinghouse promoted alternating current (AC), which could transmit power over long distances, winning the "War of Currents" against Edison\'s direct current (DC).', icon: '💡', color: FACTORY_GOLD },
  { title: 'Chemical Industry', detail: 'Germany led the second industrial revolution\'s chemical sector. Synthetic dyes (starting with mauveine in 1856) replaced natural dyes and spawned the modern chemical industry. German companies like BASF, Bayer, and Hoechst pioneered pharmaceuticals (aspirin, 1897), fertilizers (the Haber process for synthetic nitrogen), explosives, and plastics. Chemistry became an industrial science — and Germany\'s chemical companies remain global giants today.', icon: '🧪', color: SMOKE_PURPLE },
  { title: 'Oil and Internal Combustion', detail: 'The first commercial oil well (Titusville, Pennsylvania, 1859) launched the petroleum industry. Initially used for kerosene lighting, oil became the fuel of the 20th century with the internal combustion engine. Karl Benz built the first automobile (1885); Henry Ford made it affordable (Model T, 1908). John D. Rockefeller\'s Standard Oil became the world\'s most powerful monopoly. Oil would reshape geopolitics, create the modern Middle East, and drive the climate crisis.', icon: '🛢️', color: COAL_BLACK },
  { title: 'Mass Production and Scientific Management', detail: 'Henry Ford\'s moving assembly line (1913) reduced Model T assembly from 12 hours to 93 minutes. Frederick Winslow Taylor\'s "scientific management" broke work into timed, repetitive tasks for maximum efficiency. Mass production made consumer goods affordable for ordinary people but turned workers into interchangeable parts performing monotonous tasks. Charlie Chaplin\'s Modern Times (1936) brilliantly satirized this dehumanization.', icon: '⚙️', color: ACCENT },
  { title: 'Communications Revolution', detail: 'The telephone (1876), phonograph (1877), radio (1890s), and cinema (1890s) created mass media and mass culture for the first time. People could hear distant voices in real time, listen to recorded music, receive news wirelessly, and watch moving pictures. These technologies created shared cultural experiences across classes and regions — and launched the entertainment and advertising industries that dominate modern economies.', icon: '📻', color: ELECTRIC_BLUE },
  { title: 'Rise of the Corporation', detail: 'The Second Industrial Revolution was dominated by enormous corporations and the "robber barons" who controlled them. Andrew Carnegie (steel), John D. Rockefeller (oil), J.P. Morgan (finance), Cornelius Vanderbilt (railroads) amassed fortunes that dwarf today\'s billionaires in relative terms. Rockefeller\'s Standard Oil controlled 90% of US oil refining. These monopolies provoked the first antitrust laws and debates about corporate power that continue today.', icon: '🏛️', color: FACTORY_GOLD },
];

const HUMAN_COST = [
  { title: 'Child Labor', detail: 'Children as young as 5 or 6 worked 14–16 hour days in coal mines, textile mills, and factories. In mines, small children ("trappers") sat alone in total darkness opening ventilation doors. "Hurriers" — children as young as 6 — dragged coal carts through tunnels too narrow for adults, crawling on hands and knees. In mills, children ("scavengers") crawled under running machines to gather loose cotton — regularly losing fingers, hands, or their lives. The 1842 Mines Act banned underground work for children under 10 and all females — after a parliamentary report with illustrations that shocked the nation.', icon: '👶', color: IRON_RED },
  { title: 'Urban Squalor', detail: 'Industrial cities grew explosively without planning, sanitation, or clean water. In Manchester, average life expectancy was 17 years for laborers (compared to 38 in rural areas). London\'s slums packed families into windowless cellars. Open sewers ran through streets. The Great Stink of 1858 made the Thames so foul that Parliament couldn\'t meet. Cholera outbreaks killed tens of thousands — London\'s 1854 epidemic was only stopped when John Snow traced the disease to a contaminated water pump on Broad Street, founding modern epidemiology.', icon: '🏚️', color: SMOKE_PURPLE },
  { title: 'The Luddites (1811–1816)', detail: 'Skilled textile workers in the English Midlands and North began smashing factory machines in organized nighttime raids. They were not ignorant technophobes — they were highly skilled artisans whose livelihoods were being destroyed by machines that produced inferior goods with unskilled labor at lower cost. They wanted fair wages, quality standards, and a voice in how technology was implemented. The government sent more troops to suppress the Luddites than it had sent to fight Napoleon in the Peninsular War. Seventeen Luddites were hanged; many more were transported to Australia. The word "Luddite" survives as (unfair) shorthand for anyone who resists new technology.', icon: '🔨', color: IRON_RED },
  { title: 'Working Conditions', detail: 'Factory workers endured 14–16 hour days, 6 days a week, with no breaks, no safety equipment, no compensation for injuries, and wages that barely covered food and rent. Cotton mill workers breathed fiber-laden air that destroyed their lungs ("byssinosis" or "brown lung"). Matchstick workers developed "phossy jaw" — phosphorus poisoning that literally rotted their jawbones. Workers who complained were fired and blacklisted. There was no social safety net: lose your job and your family starved.', icon: '⚠️', color: ACCENT },
  { title: 'Housing Crisis', detail: 'Workers were crammed into "back-to-back" houses with no ventilation, shared privies, and contaminated water. A single room might house an entire family. In some industrial cities, 30+ people shared a single toilet. Friedrich Engels described Manchester\'s working-class housing in The Condition of the Working Class in England (1845) — a devastating firsthand account that would help inspire The Communist Manifesto three years later.', icon: '🏘️', color: RAIL_BROWN },
];

const LABOR_MOVEMENT = [
  { title: 'Trade Unions', detail: 'Despite being illegal until 1824 (under the Combination Acts), workers organized secretly and then openly to demand better conditions. The Grand National Consolidated Trades Union (1834) was an early attempt at a national union. The Tolpuddle Martyrs — six farm laborers transported to Australia in 1834 for swearing a union oath — became symbols of the labor movement. By the late 19th century, unions had won the right to strike, bargain collectively, and participate in politics.', icon: '✊', color: IRON_RED },
  { title: 'Factory Acts and Reform', detail: 'A series of Factory Acts gradually improved conditions: 1833 (limited child labor hours, required education), 1844 (women\'s hours limited to 12/day, machinery must be fenced), 1847 (ten-hour day for women and children), 1867 (extended to all industries, not just textiles). Each act was bitterly fought by factory owners who claimed regulation would destroy the economy. It didn\'t — profits continued to rise even as conditions improved.', icon: '📋', color: REFORM_GREEN },
  { title: 'Marx and Engels', detail: 'Friedrich Engels arrived in Manchester in 1842 to work in his family\'s cotton mill and was horrified by what he saw. His book The Condition of the Working Class in England (1845) documented the misery in searing detail. He partnered with Karl Marx, who was developing a systematic critique of capitalism. Together they wrote The Communist Manifesto (1848), arguing that industrial capitalism inevitably exploited workers and would be overthrown by proletarian revolution. Marx\'s Capital (1867) provided the theoretical framework. Their ideas would shape the 20th century — inspiring both democratic socialism and authoritarian communism.', icon: '📕', color: IRON_RED },
  { title: 'Chartism (1838–1857)', detail: 'The Chartist movement was Britain\'s first mass working-class political movement. Their "People\'s Charter" demanded six reforms: universal male suffrage, secret ballots, no property qualification for MPs, payment for MPs, equal electoral districts, and annual parliaments. At its peak, Chartism presented petitions with millions of signatures. Though it failed in the short term, five of its six demands were eventually adopted — Chartism laid the foundation for modern democracy.', icon: '🗳️', color: ELECTRIC_BLUE },
  { title: 'Robert Owen and Utopian Reform', detail: 'Robert Owen, a wealthy mill owner, proved that humane treatment of workers was compatible with profit. At his New Lanark mill in Scotland (from 1800), he provided decent housing, schools for workers\' children, reasonable hours, and fair prices in the company store. Production and profits increased. Owen then attempted to create ideal communities (New Harmony, Indiana) based on cooperation rather than competition — these failed, but his ideas influenced the cooperative movement, education reform, and labor rights advocacy.', icon: '🌱', color: REFORM_GREEN },
  { title: 'The Eight-Hour Day Movement', detail: 'From the 1860s, workers organized globally for an eight-hour workday — "Eight hours for work, eight hours for rest, eight hours for what we will." The movement gained momentum after the Haymarket Affair in Chicago (1886), where a bombing during a labor rally led to the execution of anarchist leaders. May 1 — May Day — was declared International Workers\' Day in their memory. The eight-hour day was gradually won through strikes, legislation, and collective bargaining over the next half-century.', icon: '⏰', color: FACTORY_GOLD },
];

const KEY_FIGURES: Figure[] = [
  { name: 'James Watt', dates: '1736–1819', role: 'Engineer & Inventor', contribution: 'Transformed the steam engine from a crude pump into the versatile power source that drove the Industrial Revolution', detail: 'A Scottish instrument maker who recognized that Newcomen\'s engine wasted enormous energy by heating and cooling the same cylinder. His separate condenser (patented 1769) tripled efficiency. His partnership with Birmingham manufacturer Matthew Boulton commercialized the engine. The unit of power — the watt — is named after him. He didn\'t invent the steam engine, but he made it the engine of modernity.', icon: '♨️', color: STEAM_GREY },
  { name: 'Richard Arkwright', dates: '1732–1792', role: 'Industrialist', contribution: 'Created the factory system — centralized, mechanized, clock-regulated mass production', detail: 'Originally a barber and wigmaker, Arkwright patented the water frame spinning machine and built the first water-powered cotton mill at Cromford (1771). He pioneered the factory system: centralized production, shift work, time discipline, and management hierarchy. He employed 5,000 workers and became one of the wealthiest men in Britain. He was knighted in 1786. He is the prototype of the industrial capitalist.', icon: '🏭', color: ACCENT },
  { name: 'George Stephenson', dates: '1781–1848', role: 'Railway Pioneer', contribution: 'Built the first public railway and established the standard gauge used worldwide', detail: 'Born illiterate in a mining family, Stephenson taught himself to read at 18 and became a self-taught engineer. He built the Stockton & Darlington Railway (1825) and the Liverpool & Manchester Railway (1830) — proving that railways could carry passengers and freight reliably. His track gauge of 4 feet 8.5 inches became the world standard. His son Robert became an equally famous engineer. "The Railway King" rose from poverty to transform the world.', icon: '🚂', color: RAIL_BROWN },
  { name: 'Isambard Kingdom Brunel', dates: '1806–1859', role: 'Engineer', contribution: 'Designed railways, bridges, tunnels, and steamships that pushed engineering to its limits', detail: 'Possibly the greatest engineer who ever lived. Brunel designed the Great Western Railway (London to Bristol), the Clifton Suspension Bridge, the Thames Tunnel (first underwater tunnel), and three revolutionary steamships — including the SS Great Eastern, the largest ship built until the 20th century. He worked himself to death at 53, having created infrastructure that still serves Britain today. His ambition, creativity, and sheer audacity remain unmatched.', icon: '🌉', color: ELECTRIC_BLUE },
  { name: 'Thomas Edison', dates: '1847–1931', role: 'Inventor & Industrialist', contribution: 'Invented the practical light bulb, phonograph, and built the first electrical power system', detail: 'Edison held 1,093 patents — more than any inventor in history. His Menlo Park laboratory was the world\'s first industrial research facility — invention as a systematic business. He created the phonograph, the practical incandescent bulb, the motion picture camera, and the entire infrastructure for electrical power distribution. His greatest invention was arguably the concept of organized research and development itself.', icon: '💡', color: FACTORY_GOLD },
  { name: 'Andrew Carnegie', dates: '1835–1919', role: 'Steel Magnate', contribution: 'Built the American steel industry and became the world\'s richest man', detail: 'A Scottish immigrant who started as a bobbin boy in a cotton mill at age 13. Carnegie built the largest steel company in the world, then sold it to J.P. Morgan for $480 million (about $17 billion today) in 1901. He then gave away 90% of his fortune — funding 2,509 public libraries, universities, and foundations. His "Gospel of Wealth" argued that the rich had a moral duty to redistribute their wealth. Yet his fortune was built on the Homestead Strike (1892), where strikers were shot by Pinkerton agents.', icon: '🏗️', color: STEAM_GREY },
  { name: 'John D. Rockefeller', dates: '1839–1937', role: 'Oil Magnate', contribution: 'Founded Standard Oil and created the modern petroleum industry', detail: 'Rockefeller built Standard Oil into a monopoly controlling 90% of American oil refining through ruthless business tactics: secret railroad rebates, predatory pricing, and buying out (or crushing) competitors. The Supreme Court broke up Standard Oil in 1911 under antitrust law — but the successor companies (ExxonMobil, Chevron, etc.) remain among the world\'s largest corporations. Rockefeller became history\'s wealthiest person in relative terms. His philanthropy funded the University of Chicago, Rockefeller University, and modern medical research.', icon: '🛢️', color: COAL_BLACK },
  { name: 'Karl Marx', dates: '1818–1883', role: 'Philosopher & Economist', contribution: 'Analyzed industrial capitalism and inspired the global labor and socialist movements', detail: 'A German philosopher exiled to London, Marx spent decades in the British Museum library analyzing capitalism\'s mechanics. His key insight: industrial workers create value through their labor, but capitalists extract "surplus value" (profit) by paying workers less than the value they produce. This exploitation, Marx argued, was not a bug but a feature of capitalism, and would inevitably lead to revolution. Whether one agrees with his solutions, his diagnosis of industrial capitalism\'s dynamics remains powerfully relevant.', icon: '📕', color: IRON_RED },
  { name: 'Robert Owen', dates: '1771–1858', role: 'Social Reformer', contribution: 'Proved that humane factory conditions could coexist with profitability', detail: 'Owen bought the New Lanark cotton mills in Scotland and transformed them into a model of enlightened management: decent housing, fair wages, schools for children, no child labor under 10, and a company store selling goods at near cost. Productivity and profits rose. Owen proved the factory owners\' argument wrong — you didn\'t need to exploit workers to make money. He went on to advocate for labor rights, cooperative economics, and universal education. He is the father of British socialism and the cooperative movement.', icon: '🌱', color: REFORM_GREEN },
  { name: 'Nikola Tesla', dates: '1856–1943', role: 'Inventor & Electrical Engineer', contribution: 'Developed alternating current (AC) power systems that made long-distance electricity transmission possible', detail: 'A Serbian-American inventor whose AC motor and transformer designs won the "War of Currents" against Edison\'s DC system. Tesla\'s AC system could transmit power hundreds of miles with minimal loss — essential for electrifying cities far from power plants. He also pioneered radio technology, X-ray imaging, and envisioned wireless communication decades before it existed. Brilliant but eccentric, Tesla died in poverty while his inventions powered the modern world.', icon: '⚡', color: ELECTRIC_BLUE },
  { name: 'Henry Ford', dates: '1863–1947', role: 'Industrialist', contribution: 'Perfected mass production and made automobiles affordable for ordinary workers', detail: 'Ford didn\'t invent the automobile or the assembly line — he perfected both. His moving assembly line (1913) at Highland Park reduced Model T assembly time from 12 hours to 93 minutes. He paid workers $5/day — double the prevailing wage — reasoning that well-paid workers would buy his cars. He was right: the Model T became ubiquitous. Ford created mass consumer capitalism. However, he was also a virulent antisemite whose newspaper published hateful propaganda, and his labor practices later became brutally anti-union.', icon: '🚗', color: ACCENT },
  { name: 'Ada Lovelace', dates: '1815–1852', role: 'Mathematician', contribution: 'Wrote the first computer algorithm and envisioned general-purpose computing', detail: 'The daughter of Lord Byron, Lovelace worked with Charles Babbage on his Analytical Engine — a mechanical computer designed in the 1830s. Lovelace wrote what is recognized as the first computer program (an algorithm to compute Bernoulli numbers) and, uniquely for her time, envisioned that computing machines could go beyond pure calculation to compose music, produce graphics, and handle any process expressible in symbols. She saw the future of computing over a century before it arrived.', icon: '🖥️', color: SMOKE_PURPLE },
  { name: 'Florence Nightingale', dates: '1820–1910', role: 'Nurse & Statistician', contribution: 'Pioneered modern nursing and used data visualization to reform military healthcare', detail: 'During the Crimean War, Nightingale used statistical analysis and innovative data visualizations (her "rose diagrams") to prove that most soldiers were dying of preventable diseases in filthy hospitals, not battlefield wounds. Her evidence forced the military to reform sanitation — death rates dropped from 42% to 2%. She founded professional nursing education and transformed hospitals from places of death to places of healing. She was a pioneer of evidence-based medicine and public health — using industrial-era tools (statistics, data) to save lives.', icon: '🏥', color: REFORM_GREEN },
  { name: 'Eli Whitney', dates: '1765–1825', role: 'Inventor', contribution: 'Invented the cotton gin and pioneered interchangeable parts in manufacturing', detail: 'Whitney\'s cotton gin (1793) revolutionized cotton processing but had devastating consequences: by making cotton enormously profitable, it entrenched and expanded slavery across the American South. Whitney later developed the concept of interchangeable parts for musket manufacturing — a foundational principle of mass production. His legacy embodies the Industrial Revolution\'s dual nature: technological brilliance with profound moral consequences.', icon: '🌿', color: COTTON_WHITE },
  { name: 'Charles Dickens', dates: '1812–1870', role: 'Novelist', contribution: 'Exposed industrial poverty and child labor to the reading public through unforgettable fiction', detail: 'Dickens experienced industrial-era poverty firsthand — at 12, he was sent to work in a boot-blacking factory when his father was imprisoned for debt. His novels (Oliver Twist, Hard Times, David Copperfield, Bleak House) gave faces and voices to the poor, the exploited, and the forgotten. His writing influenced public opinion and policy — Oliver Twist helped reform the cruel Poor Laws; Hard Times attacked the dehumanizing philosophy of industrial utilitarianism. Literature as social conscience.', icon: '📖', color: COTTON_WHITE },
];

const RAILROAD_REVOLUTION = [
  { title: 'Shrinking the World', detail: 'Before railways, travel speed hadn\'t changed significantly since Roman times — a horse could cover about 30 miles per day. Early railways moved at 30 mph; by 1900, express trains hit 100 mph. A journey from London to Edinburgh that took four days by stagecoach in 1800 took eight hours by train in 1850. Railways annihilated distance and fundamentally changed humanity\'s relationship with space and time.', icon: '🌐', color: ELECTRIC_BLUE },
  { title: 'Creating National Markets', detail: 'Before railways, most commerce was local — it was too expensive to transport heavy goods over land. Railways made it cheap to move coal, iron, grain, and manufactured goods across entire countries. This created national (and then international) markets: a factory in Manchester could sell to customers in London, Glasgow, and Liverpool. Competition increased, prices fell, and regional economic isolation ended forever.', icon: '📦', color: FACTORY_GOLD },
  { title: 'Standardizing Time', detail: 'Before railways, every town kept its own local time based on the sun. This chaos was unworkable for train schedules — a train arriving at "2:00 PM" in Bristol would be 10 minutes different from "2:00 PM" in London. In 1840, the Great Western Railway imposed "Railway Time" — London (Greenwich) time for all stations. By 1880, Greenwich Mean Time was legal standard time across Britain. Railways literally standardized time itself.', icon: '🕐', color: STEAM_GREY },
  { title: 'Mass Migration and Immigration', detail: 'Railways enabled mass migration within and between countries. Rural workers could reach industrial cities in hours instead of days. In America, the transcontinental railroad (1869) opened the West to mass settlement — and devastating displacement of Native Americans. Across Europe, railways carried millions of emigrants to port cities for the voyage to America. Between 1870 and 1914, 26 million Europeans emigrated to the US, most traveling to ports by rail.', icon: '🚶', color: RAIL_BROWN },
  { title: 'Military Transformation', detail: 'Railways transformed warfare by enabling rapid troop movement and supply. Prussia\'s use of railways in the Franco-Prussian War (1870–71) — moving 460,000 troops to the front in 18 days — demonstrated their military power. The American Civil War was the first "railroad war," where control of rail lines was strategically decisive. By 1914, every major European power had war plans based on railway timetables.', icon: '⚔️', color: IRON_RED },
];

const ENVIRONMENTAL_IMPACT = [
  { title: 'Coal Smoke and Air Pollution', detail: 'Industrial cities were choked with coal smoke. London\'s famous fogs were largely industrial smog — a mix of coal smoke, sulfur dioxide, and particulates that killed thousands during severe episodes. The word "smog" was coined in 1905 to describe London\'s deadly air. In 1873, a fog lasting several days killed over 700 Londoners. Rivers ran black with coal waste. Factory chimneys belched smoke visible for miles. The first Clean Air Act didn\'t pass until 1956 — after the Great Smog of 1952 killed 4,000–12,000 Londoners.', icon: '🌫️', color: SMOKE_PURPLE },
  { title: 'River Pollution', detail: 'Industrial waste — chemicals, dyes, heavy metals, sewage — was dumped directly into rivers. The Thames became an open sewer. The River Irwell in Manchester was described as "ink-black" and so polluted that nothing could live in it. Fish populations collapsed across industrial regions. The Great Stink of 1858 finally forced Parliament to fund a modern London sewer system — but only because the smell made their building unusable.', icon: '🏭', color: STEAM_GREY },
  { title: 'Deforestation', detail: 'Early industrialization consumed vast quantities of wood — for construction, charcoal iron-smelting, and fuel. Britain\'s forests were largely cleared by 1800. The switch to coal actually saved remaining forests but created new problems (mining subsidence, coal waste). Globally, industrial demand for timber, rubber, and agricultural land drove deforestation across colonies in Asia, Africa, and the Americas.', icon: '🌲', color: REFORM_GREEN },
  { title: 'The First Climate Change', detail: 'The Industrial Revolution began the era of fossil fuel combustion that drives today\'s climate crisis. CO₂ concentrations were about 280 ppm in 1760; by 1900, they had risen to 295 ppm; today they exceed 420 ppm. The greenhouse effect was identified by scientists as early as the 1890s (Svante Arrhenius calculated in 1896 that doubling CO₂ would raise global temperatures by 5–6°C — remarkably close to modern estimates). The industrial revolution didn\'t just change the economy — it changed the planet\'s atmosphere.', icon: '🌡️', color: IRON_RED },
];

const GLOBAL_SPREAD = [
  { title: 'Germany Overtakes Britain', detail: 'Germany unified in 1871 and industrialized with ruthless efficiency. German companies led in chemicals (BASF, Bayer), electrical engineering (Siemens), and steel (Krupp). Germany invested heavily in technical education, producing engineers and scientists rather than the gentleman amateurs Britain favored. By 1900, German industrial output had surpassed Britain\'s. Germany\'s "Made in Germany" label — originally imposed by Britain as a warning — became a mark of quality.', icon: '🇩🇪', color: STEAM_GREY },
  { title: 'American Industrial Supremacy', detail: 'The US overtook Britain as the world\'s largest economy by the 1890s. America had everything: vast resources (coal, iron, oil, timber), mass immigration (cheap labor), continental-scale railways, minimal regulation, and a culture that celebrated entrepreneurship. The Civil War had accelerated Northern industrialization. By 1914, the US produced more steel, oil, and manufactured goods than any nation on Earth.', icon: '🇺🇸', color: ELECTRIC_BLUE },
  { title: 'Japan\'s Meiji Restoration', detail: 'Japan industrialized in a single generation through deliberate government policy after the Meiji Restoration (1868). The new government sent scholars worldwide to study Western technology, built state-funded railways and factories, created a modern military, and established universal education. By 1905, Japan had defeated Russia in war — the first modern Asian victory over a European power. Japan proved that industrialization was not exclusively Western.', icon: '🇯🇵', color: IRON_RED },
  { title: 'Russia\'s Late Industrialization', detail: 'Russia industrialized late and unevenly under Tsarist modernization programs (1890s–1910s). The Trans-Siberian Railway (1891–1916) was the world\'s longest railroad. Heavy industry concentrated in a few centers (St. Petersburg, Moscow, the Donbas). But Russia remained overwhelmingly rural and agricultural. The tension between a modernizing industrial sector and a feudal agricultural society would explode in the Russian Revolution of 1917.', icon: '🇷🇺', color: SMOKE_PURPLE },
  { title: 'Colonial Deindustrialization', detail: 'While Europe and America industrialized, their colonies were often deliberately deindustrialized. India — which had been the world\'s largest textile producer — was flooded with cheap British machine-made cloth, destroying its handloom industry. Colonial policies forced colonies to export raw materials (cotton, rubber, minerals) and import finished goods from the metropole. Industrialization enriched some nations partly by impoverishing others.', icon: '🌍', color: RAIL_BROWN },
];

const SOCIAL_CHANGES = [
  { title: 'Rise of the Middle Class', detail: 'The Industrial Revolution created a new social class between aristocrats and workers: factory owners, managers, engineers, lawyers, doctors, accountants, and shopkeepers. This middle class (or "bourgeoisie") demanded political representation, built suburban homes, valued education and respectability, and became the dominant cultural force of the 19th century. They didn\'t inherit power — they earned it through industry and commerce.', icon: '🎩', color: FACTORY_GOLD },
  { title: 'Women Enter the Workforce', detail: 'Industrialization pulled women and girls into factories, mines, and mills — often at half the wages paid to men. While exploitation was severe, factory work also gave women economic independence for the first time. Women\'s participation in the workforce, unions, and political movements (suffrage, temperance) was a direct consequence of industrialization. The Matchgirls\' Strike (1888) — where 1,400 women walked out of the Bryant & May factory over pay and phossy jaw — was a landmark in labor history.', icon: '👩', color: COTTON_WHITE },
  { title: 'Urbanization', detail: 'In 1800, about 20% of Britain\'s population lived in cities. By 1900, it was 75%. Manchester grew from 25,000 (1772) to 645,000 (1901). London reached 6.5 million by 1900 — the world\'s largest city. This was the most rapid urbanization in history. Cities offered jobs, entertainment, anonymity, and opportunity — but also overcrowding, disease, crime, and pollution. The modern city, with all its promise and problems, is an industrial creation.', icon: '🏙️', color: STEAM_GREY },
  { title: 'Mass Literacy and Education', detail: 'Factories needed workers who could read instructions, keep accounts, and operate complex machines. Governments responded with compulsory education laws: Britain\'s 1870 Education Act aimed for universal primary education. Literacy rates soared — from about 60% in 1800 to over 95% by 1900 in industrial nations. Mass literacy enabled mass democracy, mass media, and mass political movements. An educated workforce was also a more productive workforce.', icon: '📚', color: ELECTRIC_BLUE },
  { title: 'Newspapers and Public Opinion', detail: 'Steam-powered printing presses, cheap paper, railways for distribution, and mass literacy combined to create the modern newspaper industry. By 1900, London had dozens of daily papers with circulations in the hundreds of thousands. Newspapers created public opinion as a political force, exposed scandals and injustice, and connected citizens to national and international events. The "Fourth Estate" became a check on power — and a power in itself.', icon: '📰', color: COTTON_WHITE },
  { title: 'Consumer Culture', detail: 'Mass production made goods cheap enough for ordinary people to buy things beyond bare necessities. Department stores (Selfridges, 1909), mail-order catalogs (Sears, 1888), and advertising created a new consumer culture. People defined themselves partly by what they bought. The idea that economic growth depends on consumer spending — the foundation of modern capitalism — emerged from the Industrial Revolution\'s abundance.', icon: '🛍️', color: ACCENT },
];

const TABS = [
  { key: 'timeline', label: 'Timeline', icon: '📜' },
  { key: 'whybritain', label: 'Why Britain?', icon: '🇬🇧' },
  { key: 'phase1', label: 'Phase 1', icon: '🧵' },
  { key: 'phase2', label: 'Phase 2', icon: '🚂' },
  { key: 'phase3', label: 'Phase 3', icon: '💡' },
  { key: 'inventions', label: 'Inventions', icon: '⚙️' },
  { key: 'humancost', label: 'Human Cost', icon: '⚠️' },
  { key: 'labor', label: 'Labor Movement', icon: '✊' },
  { key: 'figures', label: 'Key Figures', icon: '👤' },
  { key: 'railroads', label: 'Railroads', icon: '🛤️' },
  { key: 'environment', label: 'Environment', icon: '🌫️' },
  { key: 'globalspread', label: 'Global Spread', icon: '🌍' },
  { key: 'social', label: 'Social Changes', icon: '🏙️' },
  { key: 'legacy', label: 'Legacy', icon: '🔮' },
];

/* ───────── Helpers ───────── */

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
    </div>
  );
}

/* ───────── Component ───────── */

export default function IndustrialRevolutionPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('timeline');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', sans-serif" }}>
      {/* ── Hero ── */}
      <div style={{ padding: '56px 32px 40px', textAlign: 'center', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(180deg, rgba(212,119,11,0.08) 0%, transparent 100%)` }}>
        <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-block', marginBottom: 24, padding: '6px 14px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>
          ← Back to Timeline
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: '0 0 10px', lineHeight: 1.25 }}>
          The Industrial Revolution
        </h1>
        <p style={{ fontSize: 15, color: ACCENT, fontWeight: 600, margin: '0 0 20px' }}>
          How Machines Changed Everything (1760–1914)
        </p>
        <p style={{ fontSize: 13, color: TEXT_MUTED, maxWidth: 740, margin: '0 auto', lineHeight: 1.7 }}>
          {CONTEXT_TEXT}
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '16px 24px', borderBottom: `1px solid ${CARD_BORDER}`, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as SectionTab)}
            style={{
              padding: '8px 14px',
              border: `1px solid ${activeTab === t.key ? ACCENT : CARD_BORDER}`,
              borderRadius: 8,
              backgroundColor: activeTab === t.key ? `${ACCENT}18` : 'transparent',
              color: activeTab === t.key ? ACCENT : TEXT_DIM,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: activeTab === t.key ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <AnimatePresence mode="wait">

          {/* ── Timeline ── */}
          {activeTab === 'timeline' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="📜" title="Timeline of the Industrial Revolution (1712–1914)" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Two centuries of inventions, upheavals, and transformations that built the modern world.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {TIMELINE_EVENTS.map((ev, i) => (
                  <motion.div key={ev.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${ev.color}33`, backgroundColor: `${ev.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: ev.color, minWidth: 90 }}>{ev.date}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{ev.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{ev.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Why Britain ── */}
          {activeTab === 'whybritain' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="🇬🇧" title="Why Britain First?" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                The Industrial Revolution could only have started in Britain — a unique convergence of geography, politics, finance, empire, and culture that existed nowhere else.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {WHY_BRITAIN.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Phase 1 ── */}
          {activeTab === 'phase1' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="🧵" title="Phase 1 — Britain (1760–1840): Textiles, Steam, and the Factory System" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                The first phase was powered by cotton, coal, and Watt's steam engine. Britain transformed from an agricultural nation into the world's first industrial economy.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PHASE1.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Phase 2 ── */}
          {activeTab === 'phase2' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="🚂" title="Phase 2 — Spread (1840–1870): Railways, Steel, and Global Reach" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Railways connected nations, steel replaced iron, and industrialization spread from Britain to Europe and America.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PHASE2.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Phase 3 ── */}
          {activeTab === 'phase3' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="💡" title="Phase 3 — Second Industrial Revolution (1870–1914): Electricity, Oil, and Mass Production" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                The second wave brought electricity, chemicals, petroleum, and the rise of the corporation — transforming daily life even more profoundly than the first.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PHASE3.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Inventions (combined quick-reference) ── */}
          {activeTab === 'inventions' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="⚙️" title="Key Inventions Timeline — 30+ Breakthroughs" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                From Newcomen's steam pump (1712) to Ford's assembly line (1908) — the inventions that built the modern world.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TIMELINE_EVENTS.map((ev, i) => (
                  <motion.div key={ev.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03, duration: 0.3 }} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 16px', borderRadius: 10, border: `1px solid ${ev.color}22`, backgroundColor: `${ev.color}06` }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: ev.color, minWidth: 90, flexShrink: 0 }}>{ev.date}</span>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{ev.title}</span>
                      <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.6, marginTop: 4 }}>{ev.detail.split('.')[0]}.</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Human Cost ── */}
          {activeTab === 'humancost' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="⚠️" title="The Human Cost" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Progress came at a staggering human price. Child labor, urban squalor, dangerous working conditions, and the destruction of traditional livelihoods — the dark side of the machine age.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {HUMAN_COST.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Labor Movement ── */}
          {activeTab === 'labor' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="✊" title="The Response — Labor Movement and Reform" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Workers fought back. Through unions, strikes, political movements, and radical philosophy, they demanded — and gradually won — the rights and protections we take for granted today.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {LABOR_MOVEMENT.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Key Figures ── */}
          {activeTab === 'figures' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="👤" title="Key Figures — The People Who Built (and Challenged) the Machine Age" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Inventors, industrialists, reformers, and critics — 15 people who shaped the Industrial Revolution and its legacy.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {KEY_FIGURES.map((fig, i) => (
                  <motion.div key={fig.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${fig.color}33`, backgroundColor: `${fig.color}08`, cursor: 'pointer' }} onClick={() => setExpandedFigure(expandedFigure === fig.name ? null : fig.name)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 22 }}>{fig.icon}</span>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: fig.color }}>{fig.name}</span>
                        <span style={{ fontSize: 12, color: TEXT_MUTED, marginLeft: 8 }}>({fig.dates})</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_DIM, fontWeight: 600, marginBottom: 4 }}>{fig.role}</div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 }}>{fig.contribution}</div>
                    <AnimatePresence>
                      {expandedFigure === fig.name && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${fig.color}22` }}>{fig.detail}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Railroads ── */}
          {activeTab === 'railroads' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="🛤️" title="The Railroad Revolution — How Rails Shrank the World" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Railways didn't just move goods and people faster — they created national markets, standardized time, enabled mass migration, and transformed warfare.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {RAILROAD_REVOLUTION.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Environment ── */}
          {activeTab === 'environment' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="🌫️" title="Environmental Impact — The First Environmental Crisis" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Coal smoke, river pollution, deforestation, and the beginning of climate change — the Industrial Revolution's environmental legacy is still with us.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ENVIRONMENTAL_IMPACT.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Global Spread ── */}
          {activeTab === 'globalspread' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="🌍" title="Global Spread — How Industrialization Went Worldwide" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Germany overtook Britain, America became the world's factory, Japan modernized in a generation — and colonies were deliberately deindustrialized.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {GLOBAL_SPREAD.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Social Changes ── */}
          {activeTab === 'social' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="🏙️" title="Social Transformation — How Industry Remade Society" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                The middle class rose, women entered the workforce, cities exploded in size, literacy became universal, and consumer culture was born.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SOCIAL_CHANGES.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── Legacy ── */}
          {activeTab === 'legacy' && (
            <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
              <SectionHeader icon="🔮" title="Legacy — The Revolution That Never Ended" />
              <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
                Everything about the modern world traces back to the Industrial Revolution. We are still living in the world it created — and still grappling with the problems it unleashed.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { title: 'The Modern Economy', detail: 'Capitalism, corporations, stock markets, industrial production, global trade, consumer culture, the service economy — all are direct products of industrialization. Before 1760, most humans lived in subsistence economies that had barely changed in millennia. The Industrial Revolution created the economic growth that lifted billions out of poverty — and the inequality, boom-bust cycles, and environmental destruction that accompany it.', icon: '📈', color: FACTORY_GOLD },
                  { title: 'Urbanization and the Modern City', detail: 'For the first time in history, more than half of humanity lives in cities (since 2007). Every modern city — with its infrastructure, transportation, utilities, skyscrapers, and suburbs — is a product of industrial technology. The problems of cities (traffic, pollution, housing costs, inequality) are industrial-age problems that we still haven\'t solved.', icon: '🏙️', color: STEAM_GREY },
                  { title: 'Democracy and Workers\' Rights', detail: 'Universal suffrage, labor unions, the eight-hour day, workplace safety, child labor laws, social security, public education — all were fought for and won in response to industrial-era conditions. The welfare state, democratic socialism, and the social safety net are all products of the struggle between capital and labor that the Industrial Revolution created.', icon: '🗳️', color: ELECTRIC_BLUE },
                  { title: 'Technology as the Engine of Change', detail: 'The Industrial Revolution established the principle that technological innovation drives economic growth and social change. Every subsequent technological revolution — electricity, automobiles, aviation, nuclear power, computing, the internet, artificial intelligence — follows the pattern first established by steam and cotton. We live in a world of perpetual technological disruption because the Industrial Revolution made innovation the central force of civilization.', icon: '⚡', color: ACCENT },
                  { title: 'The Climate Crisis', detail: 'The Industrial Revolution\'s greatest legacy may be its most dangerous. The fossil fuel economy that began with coal-powered steam engines has raised atmospheric CO₂ from 280 ppm to over 420 ppm, warming the planet by over 1°C and threatening catastrophic climate change. The greatest challenge of the 21st century — decarbonizing the global economy — is, in essence, an attempt to solve a problem created by the Industrial Revolution 250 years ago.', icon: '🌡️', color: IRON_RED },
                  { title: 'Global Inequality', detail: 'The Industrial Revolution created the "Great Divergence" — the enormous wealth gap between industrialized and non-industrialized nations that persists today. Countries that industrialized first (Britain, Western Europe, the US, Japan) became wealthy; countries that were colonized and deindustrialized (much of Asia, Africa, Latin America) remained poor. Understanding why some nations are rich and others poor is impossible without understanding the Industrial Revolution.', icon: '🌍', color: RAIL_BROWN },
                  { title: 'The Ongoing Revolution', detail: 'We are arguably still in the Industrial Revolution — or at least in its latest phase. Digital technology, artificial intelligence, and automation are doing to white-collar work what steam and machines did to handloom weavers. The debates we have today about AI, job displacement, inequality, corporate power, and the pace of change are remarkably similar to the debates of the 1840s. The Luddites\' question — who benefits from technological change, and who pays the price? — has never been more relevant.', icon: '🤖', color: SMOKE_PURPLE },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: 32, textAlign: 'center', borderTop: `1px solid ${CARD_BORDER}` }}>
        <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>
          ← Back to Timeline
        </Link>
      </div>
    </div>
  );
}
