/**
 * ChristianityHistoryPage — comprehensive deep-dive on the origins and history
 * of Christianity.
 *
 * Route: /christianity-history
 *
 * Sections:
 *  1. Hero — headline, 2.4 billion adherents, from Jewish sect to global religion
 *  2. Jewish Context — Second Temple Judaism, Roman occupation, messianic expectations
 *  3. Jesus of Nazareth — historical consensus, ministry, crucifixion, resurrection
 *  4. The Apostolic Era — Paul, Peter, James, New Testament formation
 *  5. Early Christian Diversity — Gnostics, Marcionites, Ebionites, orthodoxy
 *  6. Key Figures — 15+ figures from Jesus to Bonhoeffer
 *  7. From Persecution to Empire — Constantine, Nicaea, Theodosius
 *  8. The Great Schism — East vs West, 1054 CE
 *  9. The Reformation — Luther, Calvin, Henry VIII, religious wars
 * 10. Global Spread and Christianity Today — missions, colonialism, secularization
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const BLUE = '#3b82f6';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const SLATE = '#64748b';
const ASH = '#94a3b8';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface InsightEntry {
  label: string;
  detail: string;
}

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

// ── Jewish Context ─────────────────────────────────────────────────────────

const JEWISH_CONTEXT: InsightEntry[] = [
  {
    label: 'Roman Occupation of Judea',
    detail:
      'After centuries of foreign domination — Babylon, Persia, Alexander\'s successors — Judea fell under Roman control in 63 BCE when Pompey marched into Jerusalem. The Romans installed client kings (the Herodian dynasty) and later direct governors (prefects). For Jews, this was not merely political humiliation — it was a theological crisis. God had promised the land to Abraham\'s descendants. Why, then, were pagans ruling the Holy Land? This question fueled intense messianic expectation.',
  },
  {
    label: 'Second Temple Judaism',
    detail:
      'The Judaism of Jesus\'s time was not a single monolithic religion but a diverse family of movements united by Torah, Temple, and monotheism. The Second Temple in Jerusalem — rebuilt after the Babylonian exile and massively expanded by Herod the Great — was the center of Jewish worship, where priests offered daily sacrifices. But fierce debates raged: How should Jews live under foreign occupation? Which scriptures were authoritative? What happened after death? Different groups answered differently.',
  },
  {
    label: 'Jewish Sects and Movements',
    detail:
      'The Pharisees emphasized oral tradition and Torah observance in daily life, believing in resurrection of the dead. The Sadducees were the priestly aristocracy — conservative, tied to the Temple, rejecting belief in resurrection. The Essenes (likely the community behind the Dead Sea Scrolls) withdrew to the desert, practicing ritual purity and expecting an imminent apocalypse. The Zealots advocated armed resistance against Rome. Jesus emerged from this cauldron of competing visions.',
  },
  {
    label: 'Messianic Expectations',
    detail:
      'The Hebrew prophets had spoken of a future anointed king ("mashiach" / messiah) who would restore Israel\'s sovereignty, defeat its enemies, and inaugurate an era of justice and peace. By the 1st century CE, these expectations had intensified to a fever pitch. Multiple would-be messiahs arose — and were crushed by Rome. The idea that the messiah would be crucified by the very pagans he was supposed to defeat was, as Paul later admitted, "a stumbling block to Jews" (1 Corinthians 1:23).',
  },
  {
    label: 'The Hebrew Bible as Foundation',
    detail:
      'Christianity did not emerge from nothing — it grew from the rich soil of Jewish scripture. The Torah (five books of Moses), the Prophets, and the Writings formed the sacred library that Jesus quoted, debated, and reinterpreted. Christians would later call these texts the "Old Testament," pairing them with their own "New Testament." But in Jesus\'s lifetime, they were simply "the Scriptures" — the authoritative word of the God of Israel.',
  },
];

// ── Jesus of Nazareth ──────────────────────────────────────────────────────

const JESUS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Historical Jesus',
    detail:
      'Virtually all historians — including non-Christian scholars — agree that Jesus of Nazareth was a real historical person. He was a Jewish teacher and healer from Galilee, born around 4 BCE (the calendar is off because of a medieval miscalculation), baptized by John the Baptist, and crucified under the Roman prefect Pontius Pilate around 30–33 CE. These are among the most securely attested facts of ancient history, confirmed by multiple independent sources including Roman historian Tacitus and Jewish historian Josephus.',
  },
  {
    label: 'Ministry: The Kingdom of God',
    detail:
      'Jesus\'s central message was the "Kingdom of God" — not a political territory but God\'s reign breaking into the world. He taught through parables (short stories with subversive twists), performed healings that drew large crowds, and articulated a radical ethic: love your enemies, forgive without limit, care for the poor and marginalized, do not judge others. He dined with tax collectors and sinners — people the religious establishment considered impure — scandalizing respectable society.',
  },
  {
    label: 'Entry into Jerusalem and the Temple Incident',
    detail:
      'Jesus\'s decision to enter Jerusalem during Passover — when the city swelled with pilgrims and messianic hopes ran high — was a fateful turning point. He overturned the tables of money changers in the Temple, a provocative act that challenged the priestly establishment\'s authority and their economic arrangements with Rome. This "Temple incident" almost certainly sealed his fate. The priestly aristocracy, already nervous about popular unrest, saw him as a dangerous threat to the fragile peace.',
  },
  {
    label: 'Arrest and Crucifixion',
    detail:
      'Jesus was arrested at night — betrayed, according to the Gospels, by one of his own disciples, Judas Iscariot. He was interrogated by the Jewish high priest, then handed to the Roman governor Pontius Pilate. Crucifixion was Rome\'s punishment for political criminals — slaves, rebels, and those who challenged Roman authority. The charge was sedition: "King of the Jews," a claim that threatened Caesar\'s sovereignty. Jesus died on a cross outside Jerusalem, probably in 30 or 33 CE.',
  },
  {
    label: 'The Resurrection Claim',
    detail:
      'The central Christian claim — and the one that separates historical investigation from theological faith — is that Jesus rose from the dead. His disciples reported finding an empty tomb and experiencing appearances of the risen Jesus. Historians can confirm that the disciples genuinely believed this happened (their willingness to die for the claim is strong evidence of sincere belief). Whether the resurrection actually occurred is a matter of faith, not historical proof. But its impact is historical fact: without the resurrection belief, there would be no Christianity.',
  },
  {
    label: 'Historical Jesus vs. Christ of Faith',
    detail:
      'Scholars draw a careful distinction between the "historical Jesus" (what can be established through evidence and critical analysis) and the "Christ of faith" (the theological figure of Christian belief — Son of God, Second Person of the Trinity, Savior of humanity). The historical Jesus was a Jewish apocalyptic preacher; the Christ of faith is the cosmic Lord of the universe. These two portraits overlap but are not identical. Serious scholarship respects both the historical evidence and the theological claims without confusing the two.',
  },
];

// ── Apostolic Era Timeline ─────────────────────────────────────────────────

const APOSTOLIC_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 33 CE',
    title: 'Pentecost and the Birth of the Church',
    description:
      'According to the Book of Acts, the Holy Spirit descended on Jesus\'s followers in Jerusalem, empowering them to speak in tongues and preach boldly. This event — Pentecost — is traditionally considered the birthday of the Christian church. The early community was entirely Jewish, worshipping in the Temple and synagogues while also meeting in private homes to break bread "in memory of" Jesus.',
    color: GOLD,
  },
  {
    year: 'c. 35 CE',
    title: 'Paul\'s Damascus Road Conversion',
    description:
      'Saul of Tarsus — a zealous Pharisee who had been actively persecuting the Jesus movement — experienced a dramatic conversion on the road to Damascus. He reported a vision of the risen Christ that left him temporarily blind. Renamed Paul, he became Christianity\'s most influential missionary and theologian. His letters (written 49–58 CE) are the earliest surviving Christian documents — older than the Gospels.',
    color: AMBER,
  },
  {
    year: '49 CE',
    title: 'Council of Jerusalem',
    description:
      'The first great crisis of the early church: must Gentile (non-Jewish) converts be circumcised and follow Jewish dietary laws? Paul argued no — faith in Christ was sufficient. James (Jesus\'s brother, leader of the Jerusalem church) agreed to a compromise. This decision was revolutionary: it meant Christianity could spread beyond the Jewish world without requiring converts to become Jews first. Without this decision, Christianity might have remained a Jewish sect.',
    color: TEAL,
  },
  {
    year: '50–58 CE',
    title: 'Paul\'s Letters — The Earliest New Testament',
    description:
      'Paul\'s letters to churches he had founded (Romans, Corinthians, Galatians, Thessalonians, Philippians, Philemon) are the earliest Christian writings we possess. They predate the Gospels by decades. Paul developed a sophisticated theology: Jesus as cosmic Christ, salvation through faith rather than law, the church as the "body of Christ" uniting Jew and Gentile, slave and free, male and female. These ideas would shape Christianity more than any other writings except the Gospels themselves.',
    color: BLUE,
  },
  {
    year: '64 CE',
    title: 'Nero\'s Persecution — First Martyrs',
    description:
      'When a catastrophic fire devastated Rome, Emperor Nero blamed the Christians — a convenient scapegoat for a group already viewed with suspicion. According to the Roman historian Tacitus, Christians were "covered with the skins of beasts and torn by dogs, nailed to crosses, or set on fire to serve as nighttime illumination." Tradition holds that both Peter and Paul were martyred in Rome during this persecution — Peter crucified upside down, Paul beheaded.',
    color: CRIMSON,
  },
  {
    year: '66–73 CE',
    title: 'Jewish Revolt and the Destruction of the Temple',
    description:
      'The Jewish revolt against Rome ended in catastrophe: Jerusalem was besieged, the Second Temple was destroyed in 70 CE (it has never been rebuilt), and the Jewish state ceased to exist. For Christianity, this was a watershed. The Jerusalem church scattered, Jewish Christianity gradually declined, and Gentile Christianity became dominant. The destruction of the Temple also seemed to validate Jesus\'s prophecy of its destruction, strengthening Christian claims.',
    color: RED,
  },
  {
    year: '70–110 CE',
    title: 'The Gospels Are Written',
    description:
      'The four canonical Gospels — Mark (c. 70), Matthew (c. 80–85), Luke (c. 80–85), and John (c. 90–110) — were composed decades after Jesus\'s death by authors writing for specific communities. Mark, the earliest and shortest, emphasizes Jesus\'s suffering. Matthew presents Jesus as the new Moses. Luke stresses compassion for outsiders. John, the most theological, declares Jesus the divine Word (Logos) made flesh. Together they provide four distinct portraits of one person.',
    color: INDIGO,
  },
];

// ── Early Christian Diversity ──────────────────────────────────────────────

const DIVERSITY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Gnostic Christians',
    detail:
      'The Gnostics ("those who know") taught that the material world was created by an ignorant or malevolent lesser god (the Demiurge), and that salvation came through secret spiritual knowledge (gnosis) revealed by Jesus. In their view, Jesus was a purely spiritual being who only appeared to have a physical body. The Nag Hammadi library, discovered in Egypt in 1945, revealed dozens of Gnostic texts — including the Gospel of Thomas, Gospel of Philip, and the fascinating cosmological text Apocryphon of John — showing how rich and varied Gnostic thought was.',
  },
  {
    label: 'Marcionites',
    detail:
      'Marcion of Sinope (c. 85–160 CE) proposed the most radical revision of Christian scripture. He argued that the God of the Hebrew Bible — wrathful, violent, tribal — was a completely different deity from the loving Father revealed by Jesus. Marcion rejected the entire Old Testament and accepted only an edited version of Luke\'s Gospel and ten of Paul\'s letters. His movement was enormously popular across the Roman Empire. Ironically, Marcion\'s challenge forced the proto-orthodox church to begin defining which writings were authoritative — accelerating the formation of the New Testament canon.',
  },
  {
    label: 'Ebionites — Jewish Christians',
    detail:
      'The Ebionites ("the poor ones") represented the original strand of Christianity: Jewish followers of Jesus who kept the Torah, observed the Sabbath, practiced circumcision, and worshipped in synagogues. They revered Jesus as the Messiah but rejected the idea that he was divine — he was a righteous man chosen by God, not God himself. They used their own Hebrew Gospel and regarded Paul as an apostate who had corrupted Jesus\'s message. As Gentile Christianity became dominant, the Ebionites were marginalized and eventually disappeared.',
  },
  {
    label: 'How "Orthodox" Won',
    detail:
      'What we call "orthodox" Christianity — the version that became mainstream — was not predetermined to win. It emerged through centuries of debate, council decisions, political maneuvering, and sometimes coercion. Bishops like Irenaeus of Lyon (c. 180 CE) wrote lengthy refutations of "heresies," establishing boundary lines. The development of creeds, the episcopal hierarchy, the canon of scripture, and eventually imperial backing all consolidated one version of Christianity. But for the first three centuries, Christianity was far more diverse than most people realize.',
  },
];

// ── Key Figures ────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Jesus of Nazareth',
    years: 'c. 4 BCE–30/33 CE',
    contribution:
      'Jewish teacher whose life, death, and reported resurrection founded the world\'s largest religion. His message of God\'s kingdom, radical love, and care for the marginalized transformed human history. Christians believe he is the Son of God; historians agree he was a real person whose impact is unparalleled.',
  },
  {
    name: 'Paul of Tarsus',
    years: 'c. 5–64 CE',
    contribution:
      'Persecutor-turned-apostle who transformed a Jewish sect into a universal faith. His letters are the earliest Christian writings. His theology — salvation by faith, Gentile inclusion, the church as Christ\'s body — shaped Christianity more than any figure except Jesus himself. Without Paul, Christianity likely remains a branch of Judaism.',
  },
  {
    name: 'Peter',
    years: 'd. c. 64 CE',
    contribution:
      'Jesus\'s leading disciple, called "the rock" on which the church would be built. Led the early Jerusalem community. Tradition holds he was martyred in Rome under Nero, crucified upside down. Catholics regard him as the first Pope; his claimed tomb lies beneath St. Peter\'s Basilica in Vatican City.',
  },
  {
    name: 'Constantine the Great',
    years: '272–337 CE',
    contribution:
      'Roman emperor whose Edict of Milan (313 CE) granted Christians religious freedom after centuries of intermittent persecution. He convened the Council of Nicaea (325 CE) to resolve theological disputes. Whether his conversion was genuine faith or political calculation — or both — he transformed Christianity from a persecuted minority into an imperial religion.',
  },
  {
    name: 'Augustine of Hippo',
    years: '354–430 CE',
    contribution:
      'North African bishop and the most influential Christian theologian after Paul. His "Confessions" invented spiritual autobiography. His "City of God" provided a Christian philosophy of history after Rome fell. His doctrines of original sin, predestination, and grace shaped Western Christianity — both Catholic and Protestant — for 1,600 years and counting.',
  },
  {
    name: 'Thomas Aquinas',
    years: '1225–1274',
    contribution:
      'Dominican friar who synthesized Christian theology with Aristotelian philosophy in his monumental "Summa Theologica." His argument that faith and reason are complementary — not contradictory — remains the intellectual foundation of Catholic thought. Declared a Doctor of the Church, his influence on Western philosophy extends far beyond theology.',
  },
  {
    name: 'Francis of Assisi',
    years: '1181–1226',
    contribution:
      'Son of a wealthy merchant who renounced his inheritance to live in radical poverty. Founded the Franciscan order, preached to birds and (according to legend) a wolf, and received the stigmata. His emphasis on simplicity, humility, and care for creation made him one of Christianity\'s most beloved saints. Pope Francis chose his name as a statement of priorities.',
  },
  {
    name: 'Martin Luther',
    years: '1483–1546',
    contribution:
      'German monk whose 95 Theses (1517) against indulgences ignited the Protestant Reformation. His doctrines — salvation by faith alone, scripture alone, the priesthood of all believers — shattered Western Christendom. His German Bible translation democratized access to scripture. He permanently divided Western Christianity into Catholic and Protestant.',
  },
  {
    name: 'John Calvin',
    years: '1509–1564',
    contribution:
      'French-born reformer who built Geneva into a "Protestant Rome." His "Institutes of the Christian Religion" provided the most systematic Protestant theology. His doctrine of predestination — that God has already chosen who will be saved — was controversial but enormously influential. Calvinism shaped Reformed churches, Puritanism, Presbyterianism, and the religious culture of the Netherlands, Scotland, and colonial America.',
  },
  {
    name: 'Erasmus of Rotterdam',
    years: '1466–1536',
    contribution:
      'The greatest humanist scholar of the Renaissance. His Greek New Testament (1516) revealed translation errors in the Latin Vulgate that had persisted for a millennium. His satirical works mocked corruption in the Church. He wanted reform from within — not schism. "Erasmus laid the egg that Luther hatched," critics said. He chose unity over revolution, making him a tragic figure of the Reformation era.',
  },
  {
    name: 'Teresa of Ávila',
    years: '1515–1582',
    contribution:
      'Spanish Carmelite nun, mystic, and reformer who revitalized monastic life during the Counter-Reformation. Her "Interior Castle" maps the soul\'s journey toward union with God through seven "mansions" of prayer. She was practical, witty, and formidable — founding 17 convents despite opposition from male authorities. Named a Doctor of the Church in 1970, the first woman so honored.',
  },
  {
    name: 'William Tyndale',
    years: 'c. 1494–1536',
    contribution:
      'English scholar who defied Church and Crown to translate the Bible into English from the original Hebrew and Greek. His work was declared heretical, and he was strangled and burned at the stake in Belgium. His dying words: "Lord, open the King of England\'s eyes." Within three years, Henry VIII authorized an English Bible — largely based on Tyndale\'s translation. Much of the King James Version echoes his prose.',
  },
  {
    name: 'Dietrich Bonhoeffer',
    years: '1906–1945',
    contribution:
      'German Lutheran pastor and theologian who opposed the Nazi regime from the beginning. He helped found the Confessing Church, which rejected the nazification of German Protestantism. Involved in the plot to assassinate Hitler, he was arrested, imprisoned, and hanged at Flossenbürg concentration camp just weeks before liberation. His writings — especially "The Cost of Discipleship" and "Letters and Papers from Prison" — remain among the most powerful Christian texts of the 20th century.',
  },
  {
    name: 'Origen of Alexandria',
    years: 'c. 185–253 CE',
    contribution:
      'One of the most brilliant and controversial early Christian thinkers. He pioneered allegorical interpretation of scripture, produced the Hexapla (a six-column comparison of Old Testament texts), and developed sophisticated theology on the Trinity and the soul. Some of his ideas — universal salvation, the pre-existence of souls — were later condemned. His influence on Eastern Christian theology was immense.',
  },
  {
    name: 'Hildegard of Bingen',
    years: '1098–1179',
    contribution:
      'German Benedictine abbess, mystic, composer, writer, and polymath. She composed liturgical music, wrote theological and scientific works, corresponded with popes and emperors, and described vivid mystical visions. Named a Doctor of the Church in 2012, she is a towering figure of medieval Christianity and one of the most creative minds of the Middle Ages.',
  },
];

// ── From Persecution to Empire ─────────────────────────────────────────────

const EMPIRE_TIMELINE: TimelineEntry[] = [
  {
    year: '250 CE',
    title: 'Decian Persecution — Empire-Wide Crackdown',
    description:
      'Emperor Decius ordered all citizens to sacrifice to Roman gods and obtain certificates proving compliance. Christians who refused faced imprisonment, torture, and execution. This was the first systematic, empire-wide persecution (earlier persecutions were local). It created a crisis within the church: what to do with those who had lapsed under pressure? The question of readmitting the "lapsi" divided Christians for decades.',
    color: CRIMSON,
  },
  {
    year: '303–311 CE',
    title: 'The Great Persecution under Diocletian',
    description:
      'The most severe persecution in Christian history. Diocletian ordered churches destroyed, scriptures burned, and clergy arrested. Christians were stripped of legal rights and forced to sacrifice or face death. Thousands were martyred across the empire. Yet Christianity survived and even grew — the courage of martyrs inspired conversions. The blood of martyrs, Tertullian had said, "is the seed of the church."',
    color: RED,
  },
  {
    year: '312 CE',
    title: 'Constantine\'s Vision at the Milvian Bridge',
    description:
      'Before a decisive battle against his rival Maxentius, Constantine reportedly saw a cross of light in the sky with the words "In this sign, conquer." He ordered his soldiers to paint Christian symbols (the Chi-Rho) on their shields. He won the battle and entered Rome as sole ruler of the Western Empire. Whether the vision was genuine mystical experience, political theater, or later legend, its consequences were world-changing.',
    color: GOLD,
  },
  {
    year: '313 CE',
    title: 'Edict of Milan — Religious Tolerance',
    description:
      'Constantine and his Eastern co-emperor Licinius issued the Edict of Milan, granting religious freedom to all faiths across the empire. Christianity was not yet the official religion — but it went from illegal to legal overnight. Constantine lavished favors on the church: tax exemptions, building programs, donations of land. Bishops gained political influence. The transformation from persecuted sect to favored religion had begun.',
    color: AMBER,
  },
  {
    year: '325 CE',
    title: 'Council of Nicaea — Defining the Trinity',
    description:
      'Constantine convened the first ecumenical council to resolve the Arian controversy: Was Jesus fully divine (same substance as God the Father) or a created being (similar but not equal)? The difference hinged on a single Greek letter — "homoousios" (same substance) vs. "homoiousios" (similar substance). Nicaea declared Jesus "of the same substance" as the Father, producing the Nicene Creed. Arianism was declared heresy. One letter nearly split the empire — and defined Christian theology for all time.',
    color: INDIGO,
  },
  {
    year: '380 CE',
    title: 'Theodosius I — Christianity Becomes the ONLY Legal Religion',
    description:
      'Emperor Theodosius issued the Edict of Thessalonica, making Nicene Christianity the official state religion of the Roman Empire. Pagan temples were closed, sacrifices banned, and non-Christian worship increasingly suppressed. The persecuted had become the persecutors. Within seven decades of Constantine\'s tolerance edict, the Roman Empire had gone from persecuting Christians to persecuting everyone else. The marriage of church and state — with all its benefits and corruptions — would define European civilization for the next 1,400 years.',
    color: PURPLE,
  },
];

// ── The Great Schism ───────────────────────────────────────────────────────

const SCHISM_INSIGHTS: InsightEntry[] = [
  {
    label: 'Seeds of Division',
    detail:
      'The Eastern and Western halves of Christendom had been drifting apart for centuries. They spoke different languages (Greek vs. Latin), operated under different political systems (Byzantine Empire vs. fragmented Western kingdoms), and developed different liturgical traditions and theological emphases. The East stressed mystical experience and collective conciliar authority; the West emphasized legal structures and papal supremacy. These differences simmered for 500 years before boiling over.',
  },
  {
    label: 'The Filioque Controversy',
    detail:
      'The Nicene Creed originally stated that the Holy Spirit "proceeds from the Father." Western churches gradually added "and the Son" (in Latin: "filioque"). To Eastern theologians, this was an unauthorized alteration of a creed defined by ecumenical council — and a theological error that subordinated the Spirit and distorted the Trinity. To Westerners, it was a legitimate theological clarification. This dispute over a single Latin word became the theological flashpoint of the schism.',
  },
  {
    label: 'The Break of 1054',
    detail:
      'In 1054, a papal legate (Cardinal Humbert) traveled to Constantinople and placed a bull of excommunication on the altar of the Hagia Sophia, denouncing the Patriarch of Constantinople. The Patriarch promptly excommunicated the legate in return. Though both sides initially saw this as a dispute between individuals, not churches, the breach hardened over time. The Fourth Crusade (1204), when Western Crusaders sacked Constantinople — a Christian city — rather than fighting Muslims, made reconciliation nearly impossible. The scars have never fully healed.',
  },
  {
    label: 'Two Branches Today',
    detail:
      'The Orthodox Church (about 220 million adherents) is organized as a communion of self-governing national churches — Greek, Russian, Serbian, Romanian, and others — each led by a patriarch or archbishop. The Ecumenical Patriarch of Constantinople holds honorary primacy but not governing authority. The Catholic Church (about 1.4 billion) is centralized under the Pope in Rome. Despite ecumenical dialogue since the 1960s, the two churches remain separate — divided by authority, theology, and 970 years of history.',
  },
];

// ── The Reformation ────────────────────────────────────────────────────────

const REFORMATION_TIMELINE: TimelineEntry[] = [
  {
    year: '1517',
    title: 'Luther\'s 95 Theses',
    description:
      'Martin Luther, an Augustinian monk and theology professor, nailed (or possibly mailed) 95 propositions to the door of the Castle Church in Wittenberg, protesting the sale of indulgences — papal certificates that supposedly reduced time in purgatory. Luther\'s core argument: salvation comes through faith alone ("sola fide"), not through works, payments, or church authority. Thanks to the printing press, his theses spread across Europe within weeks. He had intended an academic debate; he ignited a revolution.',
    color: AMBER,
  },
  {
    year: '1521',
    title: 'Diet of Worms — "Here I Stand"',
    description:
      'Summoned before Emperor Charles V and ordered to recant, Luther reportedly declared: "Here I stand. I can do no other. God help me." (The exact words may be later embellishment, but the defiance was real.) He was declared an outlaw. Protected by a sympathetic German prince, Luther went into hiding and used the time to translate the New Testament into German — making scripture accessible to ordinary people for the first time.',
    color: RED,
  },
  {
    year: '1534',
    title: 'Henry VIII and the Church of England',
    description:
      'When Pope Clement VII refused to annul Henry VIII\'s marriage to Catherine of Aragon (who had failed to produce a male heir), Henry broke with Rome entirely. The Act of Supremacy declared the English monarch the "Supreme Head of the Church of England." Henry\'s motivations were personal and political, not theological — he remained doctrinally Catholic in most respects. But the break opened the door to genuine Protestant reform under his successors. The Anglican Communion today has 85 million members worldwide.',
    color: INDIGO,
  },
  {
    year: '1536–1541',
    title: 'Calvin\'s Geneva — "Protestant Rome"',
    description:
      'John Calvin transformed Geneva into a model Protestant city-state. His "Institutes of the Christian Religion" provided the most comprehensive systematic theology of the Reformation. Calvin\'s doctrine of predestination — that God has foreordained who will be saved and who will be damned — was controversial but provided psychological certainty to believers who felt "elected." Calvinism spread to France (Huguenots), the Netherlands, Scotland (Presbyterians), and colonial New England (Puritans).',
    color: TEAL,
  },
  {
    year: '1545–1563',
    title: 'Council of Trent — The Catholic Counter-Reformation',
    description:
      'The Catholic Church responded to the Protestant challenge with its own reform council. Trent reaffirmed Catholic doctrines (salvation through faith AND works, the authority of tradition alongside scripture, transubstantiation, the seven sacraments) while addressing genuine abuses: simony, absentee bishops, poorly educated clergy. The Jesuits (founded 1540) became the intellectual spearhead of Catholic renewal, establishing schools and missions worldwide. Trent did not reunite Christendom, but it revitalized Catholicism.',
    color: PURPLE,
  },
  {
    year: '1618–1648',
    title: 'Thirty Years\' War — Religion\'s Bloodiest Century',
    description:
      'What began as a conflict between Protestant and Catholic states in the Holy Roman Empire escalated into Europe\'s most devastating war before the 20th century. Roughly 8 million people died — about 20% of Germany\'s population. The Peace of Westphalia (1648) established the principle of cuius regio, eius religio ("whose realm, his religion") and laid the foundation for the modern nation-state system. It also convinced many Europeans that religious warfare was suicidal — planting seeds of secularism and religious tolerance.',
    color: CRIMSON,
  },
];

// ── Global Spread and Today ────────────────────────────────────────────────

const GLOBAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Missions, Colonialism, and Voluntary Conversion',
    detail:
      'Christianity\'s global spread is a complex story that resists simple narratives. In some cases, missionaries accompanied colonizers and conversion was coerced or incentivized (the Spanish Americas, parts of Africa). In other cases, Christianity spread through voluntary conversion, offering education, healthcare, and a message of dignity to oppressed peoples (Korea, parts of sub-Saharan Africa). Often both dynamics operated simultaneously. Honest history must acknowledge both the genuine faith of missionaries and the violence and cultural destruction that accompanied colonialism.',
  },
  {
    label: 'Christianity Today: The Numbers',
    detail:
      'With 2.4 billion adherents (31% of humanity), Christianity is the world\'s largest religion. Catholics make up roughly 50% (1.4 billion, led by the Pope in Rome). Protestants account for about 37% in countless denominations — Lutherans, Baptists, Methodists, Pentecostals, Anglicans, and thousands more. Orthodox Christians comprise about 12% (220 million). The remaining fraction includes independent and non-denominational churches, especially in Africa and Asia. Christianity is deeply divided on issues like women\'s ordination, LGBTQ+ inclusion, and the relationship between faith and politics.',
  },
  {
    label: 'Secularization in the West',
    detail:
      'In Europe — Christianity\'s historical heartland — church attendance has plummeted since the mid-20th century. The Netherlands, once fiercely Protestant, is now one of the most secular nations on Earth. France, "the eldest daughter of the Church," has seen Mass attendance drop below 5%. Britain\'s Church of England has more buildings than regular worshippers. The causes are complex: Enlightenment rationalism, two world wars that shattered faith, rising prosperity, sexual revolution, clergy abuse scandals. America remains more religious than Europe but is secularizing rapidly, especially among younger generations.',
  },
  {
    label: 'Growth in the Global South',
    detail:
      'While Christianity shrinks in the West, it is exploding in the Global South. Sub-Saharan Africa had 10 million Christians in 1900; today it has over 600 million. Latin America remains overwhelmingly Christian, though Pentecostalism is rapidly growing at Catholicism\'s expense. China may have 100 million Christians, many in underground "house churches." South Korea is 30% Christian. The center of gravity of world Christianity has shifted decisively from the North Atlantic to the Southern Hemisphere — the typical Christian today is a young woman in Lagos or São Paulo, not an elderly man in London or Boston.',
  },
  {
    label: 'Thousands of Denominations',
    detail:
      'Christianity today encompasses an estimated 45,000 denominations worldwide — from the highly centralized Catholic Church to tiny independent congregations. This fragmentation is both Christianity\'s weakness (endless division) and its strength (extraordinary adaptability). Pentecostalism, barely a century old, is already the fastest-growing form of Christianity, with over 600 million adherents. Its emphasis on personal experience of the Holy Spirit, emotional worship, and faith healing resonates powerfully in the Global South.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({
  id,
  icon,
  title,
  accentColor,
  intro,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  accentColor: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        padding: '48px 0',
        borderTop: `1px solid ${accentColor}33`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: accentColor,
            marginBottom: 12,
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.7,
            maxWidth: 800,
            marginBottom: 28,
          }}
        >
          {intro}
        </p>
      </motion.div>
      {children}
    </section>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: e.color,
              marginRight: 8,
              verticalAlign: 'middle',
            }}
          />
          <p
            style={{
              display: 'inline',
              color: e.color,
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {e.year}
          </p>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#f1f5f9',
              marginTop: 4,
              marginBottom: 6,
            }}
          >
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            {e.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: 8,
              fontSize: '1rem',
            }}
          >
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

const FIGURE_COLORS = [RED, BLUE, ROSE, GOLD, INDIGO, TEAL];

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {figures.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${FIGURE_COLORS[i % FIGURE_COLORS.length]}33`,
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4
            style={{
              fontWeight: 600,
              color: FIGURE_COLORS[i % FIGURE_COLORS.length],
              marginBottom: 2,
              fontSize: '1.05rem',
            }}
          >
            {f.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 8 }}>
            {f.years}
          </p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {f.contribution}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function ChristianityHistoryPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header style={{ paddingTop: 40, paddingBottom: 32 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${ASH}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Christianity — From Jewish Sect to Global Religion
            (1st Century CE–Present)
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', marginBottom: 16 }}
          >
            2.4 billion Christians — 31% of humanity — making it the largest
            religion in the world. How did a small Jewish sect in
            Roman-occupied Palestine, centered on a crucified teacher from a
            backwater Galilean village, become a global faith that shaped
            empires, inspired art and philosophy, fueled both liberation
            movements and oppression, and continues to grow in the Global
            South even as it recedes in the West?
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem' }}
          >
            The answer spans two millennia, six continents, and thousands of
            denominations — from the catacombs of Rome to the megachurches of
            Lagos, from the theological debates of Greek-speaking bishops to
            the liberation theology of Latin American priests. This is the
            story of Christianity's origins, its transformations, its
            divisions, and its enduring power.
          </motion.p>
        </header>

        {/* ── Jewish Context ───────────────────────────────────────────── */}
        <SectionWrapper
          id="jewish-context"
          icon="📜"
          title="Jewish Context — Second Temple Judaism"
          accentColor={AMBER}
          intro="Christianity did not drop from the sky. It emerged from a specific time, place, and religious tradition: 1st-century Judaism under Roman occupation. To understand Jesus and the movement he inspired, you must first understand the world he was born into — a world of messianic hope, foreign oppression, and fierce theological debate."
        >
          <InsightGrid items={JEWISH_CONTEXT} />
        </SectionWrapper>

        {/* ── Jesus of Nazareth ────────────────────────────────────────── */}
        <SectionWrapper
          id="jesus"
          icon="✝️"
          title="Jesus of Nazareth (c. 4 BCE–30/33 CE)"
          accentColor={GOLD}
          intro="At the center of Christianity stands a single figure: Jesus of Nazareth. Historians and theologians approach him differently — one seeking what can be established through evidence, the other exploring claims of faith. Both perspectives deserve respect. Here is what we know, what is debated, and why it matters."
        >
          <InsightGrid items={JESUS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Apostolic Era ────────────────────────────────────────────── */}
        <SectionWrapper
          id="apostolic-era"
          icon="🕊️"
          title="The Apostolic Era (30–100 CE)"
          accentColor={BLUE}
          intro="After Jesus's death, his followers faced a question that would determine everything: what now? The decades that followed saw the movement spread from Jerusalem to Rome, transform from a Jewish sect into a multiethnic faith, and produce the writings that would become the New Testament. The key figure of this era is not Peter or James — it is Paul."
        >
          <TimelineCard entries={APOSTOLIC_TIMELINE} />
        </SectionWrapper>

        {/* ── Early Christian Diversity ─────────────────────────────────── */}
        <SectionWrapper
          id="diversity"
          icon="🌿"
          title="Early Christian Diversity"
          accentColor={GREEN}
          intro="The Christianity that eventually became 'orthodox' was not the only version on offer. For the first three centuries, wildly different interpretations of Jesus competed for followers. Secret knowledge cults, Jewish Torah-keepers, radical dualists — all considered themselves the true Christians. The version that won was shaped as much by politics and power as by theology."
        >
          <InsightGrid items={DIVERSITY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="key-figures"
          icon="👤"
          title="Key Figures — 2,000 Years of Christianity"
          accentColor={ROSE}
          intro="From a Galilean carpenter to a German monk who split Christendom, from a North African bishop who defined Western theology to a pastor hanged by the Nazis — these are the people who shaped Christianity across two millennia."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── From Persecution to Empire ────────────────────────────────── */}
        <SectionWrapper
          id="empire"
          icon="🏛️"
          title="From Persecution to Empire (250–380 CE)"
          accentColor={INDIGO}
          intro="For three centuries, Christians were intermittently persecuted — sometimes ignored, sometimes hunted. Then, in one of history's most dramatic reversals, Christianity went from outlawed sect to the only legal religion of the Roman Empire. The transformation took less than 70 years and changed everything."
        >
          <TimelineCard entries={EMPIRE_TIMELINE} />
        </SectionWrapper>

        {/* ── The Great Schism ─────────────────────────────────────────── */}
        <SectionWrapper
          id="schism"
          icon="⚔️"
          title="The Great Schism (1054 CE)"
          accentColor={PURPLE}
          intro="Christianity's first great fracture was not the Reformation — it was the split between East and West in 1054. The Latin-speaking Catholic West and the Greek-speaking Orthodox East had been drifting apart for centuries. When they finally broke, they created a division that persists nearly a millennium later."
        >
          <InsightGrid items={SCHISM_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Reformation ──────────────────────────────────────────── */}
        <SectionWrapper
          id="reformation"
          icon="📖"
          title="The Reformation (1517–1648)"
          accentColor={RED}
          intro="In 1517, a German monk's protest against the sale of indulgences ignited a revolution that shattered Western Christendom into pieces. Within a generation, Europe was divided into Catholic and Protestant camps — and would remain at war for over a century. The Reformation remade not just religion but politics, culture, and the very idea of individual conscience."
        >
          <TimelineCard entries={REFORMATION_TIMELINE} />
        </SectionWrapper>

        {/* ── Global Spread and Today ──────────────────────────────────── */}
        <SectionWrapper
          id="global"
          icon="🌍"
          title="Global Spread and Christianity Today"
          accentColor={TEAL}
          intro="Christianity's journey from a Palestinian sect to a global religion of 2.4 billion is a story of missions, empires, voluntary conversion, cultural adaptation, and — in the 21st century — a dramatic geographic shift. The faith that shaped Europe is now reshaping Africa, Asia, and Latin America."
        >
          <InsightGrid items={GLOBAL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '32px 0 48px',
            marginTop: 24,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: SLATE,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 20px',
              fontStyle: 'italic',
            }}
          >
            "In essentials, unity; in non-essentials, liberty; in all things,
            charity."
            — Often attributed to Augustine, popularized during the
            Reformation era
          </p>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
