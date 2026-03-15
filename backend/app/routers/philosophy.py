"""
Philosophy explorer — hardcoded dataset of major philosophical schools,
key thinkers, thought experiments, and eternal questions.

Route prefix: /api/philosophy
"""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict

router = APIRouter(prefix="/api/philosophy", tags=["philosophy"])


# ── Models ────────────────────────────────────────────────────────────────────

class Thinker(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    bio: str


class School(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    dates: str
    start_year: int
    end_year: int
    region: str
    core_question: str
    thinkers: list[Thinker]
    core_ideas: list[str]
    famous_quote: str
    quote_author: str
    historical_impact: str
    search_query: str


class EternalQuestion(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    question: str
    description: str
    schools: list[str]


class ThoughtExperiment(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    thinker: str
    year: str
    description: str
    point: str


class PhilosophyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    schools: list[School]
    questions: list[EternalQuestion]
    thought_experiments: list[ThoughtExperiment]


# ── Data ──────────────────────────────────────────────────────────────────────

SCHOOLS: list[School] = [
    School(
        id="pre-socratic",
        name="Pre-Socratic Philosophy",
        dates="600–400 BCE",
        start_year=-600,
        end_year=-400,
        region="Greek",
        core_question="What is the fundamental nature of reality?",
        thinkers=[
            Thinker(name="Thales of Miletus", bio="First philosopher; proposed water as the fundamental substance of all things"),
            Thinker(name="Heraclitus", bio="Philosopher of flux — 'everything flows'; fire as the primal element"),
            Thinker(name="Parmenides", bio="Argued reality is unchanging and indivisible; change is an illusion"),
        ],
        core_ideas=[
            "The cosmos can be explained through natural principles, not myths",
            "There must be a single underlying substance (arche) from which all things arise",
            "Reason and observation, not tradition, reveal truth about the world",
        ],
        famous_quote="No man ever steps in the same river twice, for it's not the same river and he's not the same man.",
        quote_author="Heraclitus",
        historical_impact="Launched the Western philosophical tradition by replacing mythological explanations with rational inquiry, laying the groundwork for science and logic.",
        search_query="Pre-Socratic philosophy",
    ),
    School(
        id="socratic-platonic",
        name="Socratic / Platonic Philosophy",
        dates="470–347 BCE",
        start_year=-470,
        end_year=-347,
        region="Greek",
        core_question="What is the Good, and how should we live?",
        thinkers=[
            Thinker(name="Socrates", bio="Father of Western philosophy; developed the Socratic method of dialectical questioning"),
            Thinker(name="Plato", bio="Founded the Academy; articulated the Theory of Forms and the ideal state in the Republic"),
        ],
        core_ideas=[
            "True knowledge comes from examining our assumptions through rigorous dialogue",
            "The material world is a shadow of a higher realm of perfect Forms",
            "The just society requires philosopher-kings who understand the Form of the Good",
        ],
        famous_quote="The unexamined life is not worth living.",
        quote_author="Socrates",
        historical_impact="Defined the core questions of Western philosophy for 2,400 years. Plato's Academy became the model for universities; his political philosophy shaped theories of governance from Rome to the Enlightenment.",
        search_query="Socrates Plato philosophy",
    ),
    School(
        id="aristotelianism",
        name="Aristotelianism",
        dates="384–322 BCE",
        start_year=-384,
        end_year=-322,
        region="Greek",
        core_question="How can we systematically understand the natural world and human excellence?",
        thinkers=[
            Thinker(name="Aristotle", bio="Polymath who created formal logic, classified the sciences, and defined virtue ethics"),
            Thinker(name="Theophrastus", bio="Aristotle's successor; founded botany and expanded the Peripatetic school"),
        ],
        core_ideas=[
            "Knowledge comes from careful observation and classification of the natural world",
            "Virtue is a mean between extremes, achieved through habit and practical wisdom",
            "Every substance has four causes: material, formal, efficient, and final (purpose)",
        ],
        famous_quote="It is the mark of an educated mind to be able to entertain a thought without accepting it.",
        quote_author="Aristotle",
        historical_impact="Created the foundations of formal logic, biology, physics, and political science. Dominated medieval thought in both Christian and Islamic worlds. His scientific method shaped inquiry for two millennia.",
        search_query="Aristotle philosophy",
    ),
    School(
        id="stoicism",
        name="Stoicism",
        dates="300 BCE – 180 CE",
        start_year=-300,
        end_year=180,
        region="Greek/Roman",
        core_question="How can we live virtuously and find tranquility amid suffering?",
        thinkers=[
            Thinker(name="Zeno of Citium", bio="Founded Stoicism in Athens; taught from the Stoa Poikile (painted porch)"),
            Thinker(name="Marcus Aurelius", bio="Roman emperor and Stoic philosopher; authored the Meditations"),
            Thinker(name="Epictetus", bio="Born enslaved; taught that freedom lies in controlling our judgments, not our circumstances"),
        ],
        core_ideas=[
            "Virtue (wisdom, courage, justice, temperance) is the only true good",
            "We cannot control events, only our responses — this is the key to freedom",
            "The universe is rational and ordered; living according to nature means living by reason",
        ],
        famous_quote="You have power over your mind — not outside events. Realize this, and you will find strength.",
        quote_author="Marcus Aurelius",
        historical_impact="Shaped Roman law and governance. Deeply influenced early Christianity, the Renaissance, and modern cognitive behavioral therapy. Remains one of the most popular practical philosophies today.",
        search_query="Stoicism Marcus Aurelius",
    ),
    School(
        id="epicureanism",
        name="Epicureanism",
        dates="307 BCE onward",
        start_year=-307,
        end_year=-50,
        region="Greek/Roman",
        core_question="How can we achieve lasting happiness and freedom from fear?",
        thinkers=[
            Thinker(name="Epicurus", bio="Founded the Garden school; argued pleasure (ataraxia) is the highest good"),
            Thinker(name="Lucretius", bio="Roman poet who popularized Epicurean atomism in De Rerum Natura"),
        ],
        core_ideas=[
            "The greatest pleasure is the absence of pain and mental disturbance (ataraxia)",
            "The universe is made of atoms moving through void — no divine intervention needed",
            "Death is nothing to us; when we exist, death is not, and when death exists, we are not",
        ],
        famous_quote="Do not spoil what you have by desiring what you have not; remember that what you now have was once among the things you only hoped for.",
        quote_author="Epicurus",
        historical_impact="Epicurean atomism anticipated modern physics. Its empiricism and rejection of superstition influenced the Scientific Revolution. Jefferson cited Epicurus as a primary influence on the pursuit of happiness.",
        search_query="Epicurus Epicureanism",
    ),
    School(
        id="skepticism",
        name="Skepticism",
        dates="300 BCE onward",
        start_year=-300,
        end_year=-100,
        region="Greek",
        core_question="Can we truly know anything with certainty?",
        thinkers=[
            Thinker(name="Pyrrho of Elis", bio="Founder of Pyrrhonian skepticism; advocated suspension of judgment on all matters"),
            Thinker(name="Sextus Empiricus", bio="Systematized skeptical arguments; major source for ancient skepticism"),
        ],
        core_ideas=[
            "For every argument there is an equally strong counter-argument",
            "Suspending judgment (epoché) on dogmatic claims leads to mental tranquility",
            "Appearances can guide action without requiring claims about ultimate reality",
        ],
        famous_quote="The skeptic does not deny appearances; he merely refrains from asserting that things are in themselves as they appear.",
        quote_author="Sextus Empiricus",
        historical_impact="Profoundly influenced Descartes' method of doubt, Hume's empiricism, and the foundations of modern scientific methodology — the idea that claims require evidence and must survive scrutiny.",
        search_query="Skepticism Pyrrho philosophy",
    ),
    School(
        id="neoplatonism",
        name="Neoplatonism",
        dates="3rd–6th century CE",
        start_year=204,
        end_year=529,
        region="Roman/Late Antiquity",
        core_question="How does multiplicity arise from a single transcendent source?",
        thinkers=[
            Thinker(name="Plotinus", bio="Founder of Neoplatonism; articulated the metaphysics of emanation from the One"),
            Thinker(name="Proclus", bio="Systematized Neoplatonic theology; influential on both Christian and Islamic thought"),
        ],
        core_ideas=[
            "Reality emanates from a transcendent, unknowable source called the One",
            "The soul can ascend through contemplation back to unity with the One",
            "The material world is the lowest level of a hierarchical chain of being",
        ],
        famous_quote="The One is all things and no one of them.",
        quote_author="Plotinus",
        historical_impact="Bridged ancient philosophy and Christian theology. Deeply shaped Augustine, medieval mysticism, and the entire concept of a hierarchical cosmos. Influenced Islamic and Jewish philosophy.",
        search_query="Neoplatonism Plotinus",
    ),
    School(
        id="islamic-philosophy",
        name="Islamic Philosophy (Falsafa)",
        dates="9th–12th century",
        start_year=800,
        end_year=1198,
        region="Islamic",
        core_question="How can reason and divine revelation be harmonized?",
        thinkers=[
            Thinker(name="Avicenna (Ibn Sina)", bio="Persian polymath; synthesized Aristotle with Islamic theology; wrote the Canon of Medicine"),
            Thinker(name="Averroes (Ibn Rushd)", bio="Andalusian philosopher; his Aristotle commentaries transformed European scholasticism"),
            Thinker(name="Al-Kindi", bio="'Father of Islamic philosophy'; first to systematically apply Greek philosophy in Arabic"),
        ],
        core_ideas=[
            "Reason and revelation are complementary paths to truth, not contradictory",
            "Aristotelian logic and metaphysics can be integrated with monotheistic theology",
            "Philosophy, medicine, and science are interconnected pursuits of divine wisdom",
        ],
        famous_quote="The truth does not change according to our ability to stomach it.",
        quote_author="Averroes",
        historical_impact="Preserved and transmitted Greek philosophy to medieval Europe, enabling the Renaissance. Avicenna's medical canon was used for 600 years. Averroes' commentaries directly shaped Aquinas and Christian scholasticism.",
        search_query="Islamic philosophy Avicenna Averroes",
    ),
    School(
        id="scholasticism",
        name="Scholasticism",
        dates="11th–15th century",
        start_year=1050,
        end_year=1500,
        region="Western",
        core_question="Can Christian faith and Aristotelian reason be unified into a coherent system?",
        thinkers=[
            Thinker(name="Thomas Aquinas", bio="Dominican friar; synthesized Aristotle with Christian theology in the Summa Theologica"),
            Thinker(name="William of Ockham", bio="Franciscan friar; formulated Ockham's Razor — entities should not be multiplied beyond necessity"),
            Thinker(name="Peter Abelard", bio="Pioneered dialectical method in theology; championed reason as a path to faith"),
        ],
        core_ideas=[
            "Faith and reason are compatible — philosophy serves as 'handmaiden to theology'",
            "God's existence can be demonstrated through rational arguments (Five Ways)",
            "Natural law, discernible by reason, provides the basis for morality and justice",
        ],
        famous_quote="To one who has faith, no explanation is necessary. To one without faith, no explanation is possible.",
        quote_author="Thomas Aquinas",
        historical_impact="Created the intellectual framework of medieval universities. Aquinas' natural law theory shaped Western legal traditions. Ockham's Razor became a foundational principle of scientific methodology.",
        search_query="Scholasticism Thomas Aquinas",
    ),
    School(
        id="renaissance-humanism",
        name="Renaissance Humanism",
        dates="14th–16th century",
        start_year=1300,
        end_year=1600,
        region="Western",
        core_question="What is the potential and dignity of the human being?",
        thinkers=[
            Thinker(name="Erasmus of Rotterdam", bio="'Prince of Humanists'; championed education, tolerance, and reform through classical learning"),
            Thinker(name="Pico della Mirandola", bio="Wrote the Oration on the Dignity of Man — humans can shape their own nature"),
            Thinker(name="Niccolò Machiavelli", bio="Political philosopher; separated politics from morality in The Prince"),
        ],
        core_ideas=[
            "Humanity has inherent dignity and limitless potential for self-improvement",
            "Classical Greek and Roman texts provide models for art, ethics, and governance",
            "Education in the liberal arts (studia humanitatis) is the path to human flourishing",
        ],
        famous_quote="I have placed you at the centre of the world, so that from there you may more conveniently survey whatever is in the world.",
        quote_author="Pico della Mirandola",
        historical_impact="Sparked the Renaissance transformation of art, literature, science, and politics. Shifted focus from the divine to the human, laying groundwork for the Reformation, Scientific Revolution, and modern individualism.",
        search_query="Renaissance Humanism Erasmus",
    ),
    School(
        id="rationalism",
        name="Rationalism",
        dates="17th century",
        start_year=1596,
        end_year=1716,
        region="Western",
        core_question="Can pure reason, independent of experience, give us certain knowledge?",
        thinkers=[
            Thinker(name="René Descartes", bio="'Father of Modern Philosophy'; established systematic doubt and 'I think, therefore I am'"),
            Thinker(name="Baruch Spinoza", bio="Argued God and Nature are one substance; pioneered biblical criticism"),
            Thinker(name="Gottfried Wilhelm Leibniz", bio="Co-invented calculus; proposed we live in 'the best of all possible worlds'"),
        ],
        core_ideas=[
            "Certain knowledge comes from reason and innate ideas, not sense experience alone",
            "Mathematical and logical truths provide the model for all genuine knowledge",
            "The mind and body are fundamentally distinct substances (Cartesian dualism)",
        ],
        famous_quote="I think, therefore I am.",
        quote_author="René Descartes",
        historical_impact="Launched modern philosophy and the mind-body problem. Cartesian method shaped scientific methodology. Spinoza's monism influenced Einstein. Leibniz co-invented calculus and pioneered computing concepts.",
        search_query="Rationalism Descartes Spinoza",
    ),
    School(
        id="empiricism",
        name="Empiricism",
        dates="17th–18th century",
        start_year=1632,
        end_year=1776,
        region="Western",
        core_question="Is all knowledge ultimately derived from sensory experience?",
        thinkers=[
            Thinker(name="John Locke", bio="Argued the mind is a blank slate (tabula rasa); founded political liberalism"),
            Thinker(name="David Hume", bio="Radical empiricist; demolished causation as habit, challenged miracles and induction"),
            Thinker(name="George Berkeley", bio="Idealist who argued 'to be is to be perceived' — matter doesn't exist independently"),
        ],
        core_ideas=[
            "The mind at birth is a blank slate; all ideas come from experience",
            "We cannot know anything beyond what our senses can verify",
            "Causal connections are habits of the mind, not features of reality",
        ],
        famous_quote="No man's knowledge here can go beyond his experience.",
        quote_author="John Locke",
        historical_impact="Empiricism became the philosophical foundation of modern science. Locke's political philosophy directly shaped the American and French Revolutions. Hume's skepticism 'awoke Kant from his dogmatic slumber.'",
        search_query="Empiricism Locke Hume",
    ),
    School(
        id="enlightenment",
        name="Enlightenment Philosophy",
        dates="18th century",
        start_year=1685,
        end_year=1800,
        region="Western",
        core_question="Can reason liberate humanity from ignorance, superstition, and tyranny?",
        thinkers=[
            Thinker(name="Voltaire", bio="Championed civil liberties, freedom of religion, and separation of church and state"),
            Thinker(name="Jean-Jacques Rousseau", bio="Social contract theory; argued civilization corrupts natural goodness"),
            Thinker(name="Immanuel Kant", bio="Synthesized rationalism and empiricism; defined the categorical imperative"),
        ],
        core_ideas=[
            "Reason, not tradition or authority, should be the basis of knowledge and governance",
            "All humans possess natural rights: life, liberty, property, and the pursuit of happiness",
            "Progress is possible and achievable through education, science, and rational reform",
        ],
        famous_quote="Dare to know! Have the courage to use your own understanding.",
        quote_author="Immanuel Kant",
        historical_impact="Directly inspired the American Revolution, French Revolution, and the Declaration of Human Rights. Created the intellectual basis for democracy, secular governance, modern education, and international law.",
        search_query="Enlightenment Voltaire Rousseau Kant",
    ),
    School(
        id="german-idealism",
        name="German Idealism",
        dates="18th–19th century",
        start_year=1781,
        end_year=1860,
        region="Western",
        core_question="Does the mind actively construct the reality we experience?",
        thinkers=[
            Thinker(name="Immanuel Kant", bio="Argued we can only know phenomena (things as they appear), not things-in-themselves"),
            Thinker(name="Georg Wilhelm Friedrich Hegel", bio="Developed dialectical philosophy; history is Spirit's progressive self-realization"),
            Thinker(name="Johann Gottlieb Fichte", bio="Argued the self posits both itself and the world; championed moral freedom"),
        ],
        core_ideas=[
            "The mind does not passively receive reality — it actively structures experience",
            "History follows a dialectical process: thesis, antithesis, synthesis",
            "Freedom is realized progressively through the development of self-consciousness",
        ],
        famous_quote="The owl of Minerva spreads its wings only with the falling of the dusk.",
        quote_author="G.W.F. Hegel",
        historical_impact="Hegel's dialectic shaped Marx's historical materialism and 20th-century political thought. Kant's critical philosophy transformed every subsequent branch of philosophy. German Idealism influenced Romanticism, nationalism, and modern theories of consciousness.",
        search_query="German Idealism Hegel Kant",
    ),
    School(
        id="utilitarianism",
        name="Utilitarianism",
        dates="19th century",
        start_year=1789,
        end_year=1900,
        region="Western",
        core_question="Should morality be judged solely by its consequences — the greatest good for the greatest number?",
        thinkers=[
            Thinker(name="Jeremy Bentham", bio="Founder of utilitarianism; devised the 'felicific calculus' to measure pleasure and pain"),
            Thinker(name="John Stuart Mill", bio="Refined utilitarianism with qualitative pleasures; champion of liberty and women's rights"),
        ],
        core_ideas=[
            "The morally right action is the one that produces the greatest happiness for the greatest number",
            "Pleasures differ in quality, not just quantity — intellectual pleasures rank higher",
            "Individual liberty should only be restricted to prevent harm to others (harm principle)",
        ],
        famous_quote="It is better to be Socrates dissatisfied than a fool satisfied.",
        quote_author="John Stuart Mill",
        historical_impact="Transformed law, public policy, and economics. Bentham's ideas shaped modern prison reform, animal rights, and welfare economics. Mill's harm principle remains the foundation of liberal democratic theory.",
        search_query="Utilitarianism Bentham Mill",
    ),
    School(
        id="marxism",
        name="Marxism",
        dates="19th century onward",
        start_year=1848,
        end_year=1950,
        region="Western",
        core_question="Does economic structure determine all of society, politics, and consciousness?",
        thinkers=[
            Thinker(name="Karl Marx", bio="Analyzed capitalism's contradictions; predicted proletarian revolution and classless society"),
            Thinker(name="Friedrich Engels", bio="Co-author of the Communist Manifesto; developed dialectical materialism"),
        ],
        core_ideas=[
            "History is driven by class struggle between those who own production and those who labor",
            "Economic relations (base) determine politics, law, religion, and culture (superstructure)",
            "Capitalism contains internal contradictions that will inevitably lead to its transformation",
        ],
        famous_quote="The philosophers have only interpreted the world, in various ways. The point, however, is to change it.",
        quote_author="Karl Marx",
        historical_impact="Inspired the Russian Revolution, the Cold War, decolonization movements, and labor rights worldwide. Marxist analysis remains central to sociology, economics, and political theory regardless of political orientation.",
        search_query="Marxism Karl Marx",
    ),
    School(
        id="existentialism",
        name="Existentialism",
        dates="19th–20th century",
        start_year=1843,
        end_year=1970,
        region="Western",
        core_question="What does it mean to exist as a free, conscious being in an indifferent universe?",
        thinkers=[
            Thinker(name="Søren Kierkegaard", bio="'Father of existentialism'; emphasized subjective truth, anxiety, and the leap of faith"),
            Thinker(name="Jean-Paul Sartre", bio="Atheist existentialist; 'existence precedes essence' — we are condemned to be free"),
            Thinker(name="Albert Camus", bio="Explored the absurd — the conflict between human desire for meaning and the universe's silence"),
        ],
        core_ideas=[
            "Existence precedes essence — we are not born with a fixed nature but must create ourselves",
            "Authentic living requires confronting anxiety, freedom, and the absurdity of existence",
            "We are radically free and therefore radically responsible for our choices",
        ],
        famous_quote="Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.",
        quote_author="Jean-Paul Sartre",
        historical_impact="Profoundly influenced 20th-century literature, art, psychology, and politics. Shaped the civil rights movement, feminism, and anti-colonial struggles. Existential psychotherapy remains a major therapeutic approach.",
        search_query="Existentialism Sartre Camus",
    ),
    School(
        id="pragmatism",
        name="Pragmatism",
        dates="19th–20th century",
        start_year=1878,
        end_year=1960,
        region="Western",
        core_question="Is truth simply what works in practice?",
        thinkers=[
            Thinker(name="William James", bio="Psychologist-philosopher; truth is what works — ideas are tools for navigating reality"),
            Thinker(name="John Dewey", bio="Transformed education philosophy; democracy as a way of life, not just governance"),
            Thinker(name="Charles Sanders Peirce", bio="Founder of pragmatism; pioneered semiotics and the logic of scientific inquiry"),
        ],
        core_ideas=[
            "The meaning of an idea lies in its practical consequences",
            "Truth is not a fixed property but what proves useful through inquiry and experience",
            "Philosophy should address real human problems, not abstract puzzles",
        ],
        famous_quote="The true is the name of whatever proves itself to be good in the way of belief.",
        quote_author="William James",
        historical_impact="America's distinctive philosophical contribution. Dewey transformed progressive education worldwide. Pragmatist ideas shaped American law (Oliver Wendell Holmes), democracy, and modern design thinking.",
        search_query="Pragmatism William James Dewey",
    ),
    School(
        id="analytic-philosophy",
        name="Analytic Philosophy",
        dates="20th century onward",
        start_year=1905,
        end_year=2000,
        region="Western",
        core_question="Can the careful analysis of language and logic resolve — or dissolve — philosophical problems?",
        thinkers=[
            Thinker(name="Bertrand Russell", bio="Logician and activist; sought to ground mathematics in pure logic"),
            Thinker(name="Ludwig Wittgenstein", bio="Transformed philosophy twice — first with logical atomism, then with language games"),
        ],
        core_ideas=[
            "Most philosophical problems arise from misunderstandings of language and logic",
            "Meaning comes from use — language is a set of 'games' governed by social rules",
            "Rigorous logical analysis can clarify (or eliminate) metaphysical confusion",
        ],
        famous_quote="Whereof one cannot speak, thereof one must be silent.",
        quote_author="Ludwig Wittgenstein",
        historical_impact="Dominated Anglo-American philosophy departments for a century. Shaped modern linguistics, cognitive science, artificial intelligence, and computer science. Russell's activism influenced nuclear disarmament movements.",
        search_query="Analytic philosophy Russell Wittgenstein",
    ),
    School(
        id="postmodernism",
        name="Postmodernism",
        dates="Mid–late 20th century",
        start_year=1960,
        end_year=2000,
        region="Western",
        core_question="Are 'truth,' 'knowledge,' and 'progress' just masks for power?",
        thinkers=[
            Thinker(name="Michel Foucault", bio="Analyzed how power shapes knowledge, institutions, and what counts as 'normal'"),
            Thinker(name="Jacques Derrida", bio="Founder of deconstruction; showed how texts undermine their own assumptions"),
        ],
        core_ideas=[
            "Grand narratives (progress, reason, science) are social constructions, not objective truths",
            "Knowledge and power are inseparable — what we 'know' serves those who control discourse",
            "Texts contain internal contradictions that deconstruction can reveal",
        ],
        famous_quote="There is nothing outside the text.",
        quote_author="Jacques Derrida",
        historical_impact="Transformed literary criticism, cultural studies, and the humanities. Influenced architecture, art, and media theory. Shaped contemporary debates about identity, power, representation, and the nature of truth in the digital age.",
        search_query="Postmodernism Foucault Derrida",
    ),
]


QUESTIONS: list[EternalQuestion] = [
    EternalQuestion(
        question="What is real?",
        description="The question of the ultimate nature of reality — what truly exists beyond appearances?",
        schools=["Pre-Socratic Philosophy", "Socratic / Platonic Philosophy", "Neoplatonism", "Rationalism", "German Idealism", "Postmodernism"],
    ),
    EternalQuestion(
        question="What is good?",
        description="The question of morality and ethics — how should we act, and what makes an action right or wrong?",
        schools=["Socratic / Platonic Philosophy", "Aristotelianism", "Stoicism", "Utilitarianism", "Existentialism", "Enlightenment Philosophy"],
    ),
    EternalQuestion(
        question="What is just?",
        description="The question of justice, rights, and the ideal society — how should we organize collective life?",
        schools=["Socratic / Platonic Philosophy", "Enlightenment Philosophy", "Utilitarianism", "Marxism", "Scholasticism", "Renaissance Humanism"],
    ),
    EternalQuestion(
        question="What can we know?",
        description="The question of epistemology — what are the limits and foundations of human knowledge?",
        schools=["Skepticism", "Rationalism", "Empiricism", "Analytic Philosophy", "Pragmatism", "Postmodernism"],
    ),
    EternalQuestion(
        question="What is the mind?",
        description="The question of consciousness, thought, and the relationship between mind and body.",
        schools=["Rationalism", "German Idealism", "Analytic Philosophy", "Aristotelianism", "Empiricism", "Existentialism"],
    ),
    EternalQuestion(
        question="What is the meaning of life?",
        description="The question of purpose, significance, and what makes a life worth living.",
        schools=["Existentialism", "Stoicism", "Epicureanism", "Pragmatism", "Scholasticism", "Neoplatonism"],
    ),
]


THOUGHT_EXPERIMENTS: list[ThoughtExperiment] = [
    ThoughtExperiment(
        name="The Ship of Theseus",
        thinker="Plutarch (via Theseus legend)",
        year="~1st century CE",
        description="If every plank of a ship is replaced over time, is it still the same ship? And if the old planks are reassembled, which is the 'real' ship?",
        point="Challenges our concept of identity and persistence through change. Do objects (and people) remain the same despite constant material replacement?",
    ),
    ThoughtExperiment(
        name="Plato's Cave",
        thinker="Plato",
        year="~380 BCE",
        description="Prisoners chained in a cave see only shadows on a wall and mistake them for reality. One escapes, sees the sun, and returns — but the others refuse to believe him.",
        point="Illustrates the difference between appearance and reality, and the philosopher's duty to seek truth even when it's difficult or unpopular.",
    ),
    ThoughtExperiment(
        name="The Trolley Problem",
        thinker="Philippa Foot",
        year="1967",
        description="A trolley is heading toward five people. You can pull a lever to divert it to a track with only one person. Should you pull the lever?",
        point="Exposes the tension between utilitarian thinking (save the most lives) and deontological ethics (is it wrong to actively cause a death, even to save others?).",
    ),
    ThoughtExperiment(
        name="Brain in a Vat",
        thinker="Hilary Putnam",
        year="1981",
        description="How do you know you're not a brain in a vat, with all your experiences simulated by a supercomputer? (The philosophical ancestor of The Matrix.)",
        point="A modern restatement of Descartes' demon — challenges the reliability of all sense experience and raises deep questions about knowledge and reality.",
    ),
    ThoughtExperiment(
        name="The Chinese Room",
        thinker="John Searle",
        year="1980",
        description="A person in a room follows rules to manipulate Chinese symbols, producing correct responses — but understands no Chinese. Does a computer that processes language 'understand' it?",
        point="Argues that manipulating symbols (syntax) is not the same as understanding meaning (semantics). A powerful challenge to strong artificial intelligence.",
    ),
    ThoughtExperiment(
        name="The Prisoner's Dilemma",
        thinker="Merrill Flood & Melvin Dresher",
        year="1950",
        description="Two prisoners, unable to communicate, must each decide whether to betray the other or stay silent. Rational self-interest leads both to betray, even though mutual silence is better for both.",
        point="Demonstrates why rational individuals might not cooperate even when cooperation is in their best interest. Foundational to game theory, economics, and political science.",
    ),
    ThoughtExperiment(
        name="The Veil of Ignorance",
        thinker="John Rawls",
        year="1971",
        description="Imagine designing a society without knowing what position you'll occupy — your race, gender, wealth, abilities. What rules would you choose?",
        point="Argues that a just society is one we'd design if we didn't know our place in it. Leads to principles protecting the worst-off members of society.",
    ),
    ThoughtExperiment(
        name="Schrödinger's Cat",
        thinker="Erwin Schrödinger",
        year="1935",
        description="A cat in a sealed box is simultaneously alive and dead until observed, if quantum mechanics applies to everyday objects. But that seems absurd.",
        point="Highlights the measurement problem in quantum mechanics and the strange implications of applying quantum superposition to the macroscopic world.",
    ),
    ThoughtExperiment(
        name="The Experience Machine",
        thinker="Robert Nozick",
        year="1974",
        description="Imagine a machine that could give you any experience you desire — indistinguishable from reality. Would you plug in for life?",
        point="Most people say no, suggesting we value more than just subjective experience — we want authentic engagement with reality. Challenges hedonistic and utilitarian theories.",
    ),
    ThoughtExperiment(
        name="The Beetle in a Box",
        thinker="Ludwig Wittgenstein",
        year="1953",
        description="Everyone has a box that only they can look into, and everyone calls what's inside a 'beetle.' But no one can see anyone else's beetle. Do they all mean the same thing?",
        point="Challenges the idea of private, introspectable mental states. If 'pain' is like a beetle in a box, the actual sensation drops out of the language game — what matters is how the word is used.",
    ),
]


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.get("", response_model=PhilosophyResponse)
async def get_philosophy():
    """Return all philosophy data — schools, eternal questions, thought experiments."""
    return PhilosophyResponse(
        schools=SCHOOLS,
        questions=QUESTIONS,
        thought_experiments=THOUGHT_EXPERIMENTS,
    )
