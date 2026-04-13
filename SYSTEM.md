# Whole-Star: System Specification

## 1. Core Philosophy

Whole-Star is an astrology app built on a single original idea: every planet in astrology implicitly relies on a complementary quality it does not itself express. We call this the **Twin** (Danish: *tvillingen*). The Twin is not an opposite — it is what the planet *rests on* but cannot name.

Classical astrology describes what the planets **do**. Whole-Star reveals what they **call for**.

Where Co-Star tells users "here is what the planets are doing to you today," Whole-Star says: "here is what is already stirring inside you — what would happen if you trusted it?"

---

## 2. The Ten Twins

Each classical planet has a Twin quality — the implicit competence the planet presupposes but does not express.

| Planet | Classical Quality | Twin Quality | Twin Name |
|--------|------------------|--------------|-----------|
| Sun ☉ | Expansive self-expression | Quiet self-recognition — identity without display | The Witness |
| Moon ☽ | Reactive sensitivity, attachment | Emotional spaciousness — holding feeling without being consumed | The Vessel |
| Mercury ☿ | Categorization, naming, mediation | Understanding before language — direct knowing without translation | The Silence |
| Venus ♀ | Relation, attraction, harmony | Wholeness alone — self-sufficiency that makes true relation possible | The Root |
| Mars ♂ | Action, will, drive | Strategic non-action — knowing when force serves most by holding still | The Pause |
| Jupiter ♃ | Expansion, meaning, belief | Immersion — staying with the one thing instead of reaching for everything | The Depth |
| Saturn ♄ | Structure, boundary, limitation | The living membrane — boundary that senses, responds, and negotiates | The Membrane |
| Uranus ♅ | Sudden change, rupture | Slow mutation — change from within, almost imperceptible | The Drift |
| Neptune ♆ | Dissolution, dream, transcendence | Incarnation — bringing the formless fully into the concrete | The Vessel of Form |
| Pluto ♇ | Transformation through destruction | Transformation through integration — what need not die to become new | The Weave |

---

## 3. Activation Logic

The Twin is not a position in the zodiac. It is an **intensity** — a field that grows stronger or weaker depending on the planet's condition.

**Core Principle:** Twin intensity is inversely proportional to the planet's wellbeing. The more the planet is stressed, the more urgently it calls for its Twin.

### 3.1 Stress Index (0–100)

The stress index is computed from four components:

#### Component 1: Dignity (base value)

| Dignity | Stress Points |
|---------|--------------|
| Domicile | 0 |
| Exaltation | 15 |
| Peregrine | 40 |
| Fall | 70 |
| Exile (Detriment) | 85 |

#### Component 2: Aspects (adjustment per aspect received)

| Aspect | Stress Adjustment |
|--------|------------------|
| Trine | −8 |
| Sextile | −5 |
| Conjunction (benefic) | −5 |
| Conjunction (malefic) | +10 |
| Square | +15 |
| Opposition | +12 |

Benefic planets: Venus, Jupiter. Malefic planets: Mars, Saturn. Others: neutral (conjunction = +0).

#### Component 3: Retrograde

| Condition | Stress Adjustment |
|-----------|------------------|
| Retrograde | +15 |
| Direct | +0 |

#### Component 4: House Strength

| House Type | Stress Adjustment |
|------------|------------------|
| Angular (1, 4, 7, 10) | −10 |
| Succedent (2, 5, 8, 11) | +0 |
| Cadent (3, 6, 9, 12) | +10 |

**Final formula:** `stressIndex = clamp(dignityBase + Σ(aspectAdjustments) + retrogradeAdjustment + houseAdjustment, 0, 100)`

**Twin Intensity = stressIndex.** At 0, the Twin is fully integrated and invisible. At 100, the Twin is maximally active.

### 3.2 Duration Dimension

Twin activation has not only intensity but **duration**, determined by the activating planet's orbital speed:

| Planet | Approximate Cycle | Twin Pulse |
|--------|-------------------|------------|
| Moon | 28 days | Hours |
| Mercury | 88 days | Days |
| Venus | 225 days | Days–weeks |
| Sun | 1 year | Weeks |
| Mars | 2 years | Weeks–months |
| Jupiter | 12 years | Months |
| Saturn | 29.5 years | Months–years |
| Uranus | 84 years | Years |
| Neptune | 165 years | Years–decades |
| Pluto | 248 years | Decades |

Short activations = a glimpse, an insight. Long activations = a developmental period, a life chapter.

---

## 4. The House Logic

In classical astrology, the house tells you **where in life** a planetary energy plays out. The Twin does not operate in the same house as its planet — it operates in the **opposite house**.

The 6 house axes:

| House | Opposite | Axis Theme |
|-------|----------|------------|
| 1 (Identity) | 7 (Relationship) | Self ↔ Other |
| 2 (Resources) | 8 (Shared depth) | Mine ↔ Ours |
| 3 (Near world) | 9 (Far world) | Local ↔ Universal |
| 4 (Home, root) | 10 (Public, career) | Private ↔ Public |
| 5 (Creation, play) | 11 (Community) | Personal expression ↔ Collective |
| 6 (Daily work, body) | 12 (Unconscious, surrender) | Doing ↔ Releasing |

**The Twin always operates where you are not looking.** The planet directs your attention to one house; the Twin works in the opposite house. The developmental invitation lives in the axis between them.

Example: Saturn in 10th house (career demands structure) → Saturn's Twin (the Membrane) activates in 4th house (home, inner foundation). Your ability to sense when boundaries should soften awakens not at work but at home — and from there it informs your public life.

---

## 5. The 45 Twin Pairs

When two Twins are simultaneously active, their meeting produces a distinct quality. Below are all 45 possible pairings.

### Sun's Twin (The Witness) with:

- **Moon's Twin (The Vessel):** Identity that does not waver when emotions storm. Knowing who you are *through* feeling without losing yourself in it.
- **Mercury's Twin (The Silence):** Self-recognition that needs no explanation. Knowing who you are without being able to articulate it.
- **Venus's Twin (The Root):** Self-recognition that needs no mirroring from others. The deepest form of being enough.
- **Mars's Twin (The Pause):** The self resting in its own power without needing to prove it. Authority without action.
- **Jupiter's Twin (The Depth):** Finding oneself by going deep into one thing rather than expressing broadly. Identity through dedication.
- **Saturn's Twin (The Membrane):** Sensing when to open and when to close. Self-protection as intelligence, not fear.
- **Uranus's Twin (The Drift):** Identity transforming so gradually it never feels like crisis. Maturation without rupture.
- **Neptune's Twin (The Vessel of Form):** The self that can bring a dream fully into the concrete. Vision becoming flesh.
- **Pluto's Twin (The Weave):** The self transforming without anything needing to die first. Change as addition, not loss.

### Moon's Twin (The Vessel) with:

- **Mercury's Twin (The Silence):** Holding a feeling and understanding it without analyzing. Emotional wisdom that is bodily, not mental.
- **Venus's Twin (The Root):** Being with your emotions without seeking comfort from outside. Emotional self-sufficiency.
- **Mars's Twin (The Pause):** Feeling the emotional impulse and choosing not to act on it. Readiness without reactivity.
- **Jupiter's Twin (The Depth):** Staying with one feeling long enough for it to reveal its true content. Emotional patience.
- **Saturn's Twin (The Membrane):** Knowing when to let others into your emotional world and when to keep it private. Emotional boundary as care, not rejection.
- **Uranus's Twin (The Drift):** Emotional life gradually shifting character over years without dramatic ruptures. Maturation you only see in hindsight.
- **Neptune's Twin (The Vessel of Form):** Bringing the deepest feeling into a concrete action — a letter, a touch, a decision. Feeling becoming reality.
- **Pluto's Twin (The Weave):** Letting an overwhelming emotion become part of you without it taking over. Emotional transformation without losing yourself.

### Mercury's Twin (The Silence) with:

- **Venus's Twin (The Root):** Direct understanding of what you need without having to ask anyone. Intuitive self-sufficiency.
- **Mars's Twin (The Pause):** Knowing exactly what must be done and still waiting. Knowledge that holds back.
- **Jupiter's Twin (The Depth):** Understanding something before words arrive and staying with it long enough for it to ripen into something real. Insight with patience.
- **Saturn's Twin (The Membrane):** Sensing the limits of what understanding can reach and respecting it. Knowing when knowledge must stop and something else begin.
- **Uranus's Twin (The Drift):** Understanding that shifts so slowly you do not notice the change. What you *know* transforms imperceptibly over time.
- **Neptune's Twin (The Vessel of Form):** The unsayable finding form — not as words but as action, gesture, presence.
- **Pluto's Twin (The Weave):** Understanding that transforms without requiring the old worldview to collapse. Knowledge absorbing the new without rejecting the old.

### Venus's Twin (The Root) with:

- **Mars's Twin (The Pause):** Being whole in yourself and knowing when to remain still. Self-sufficiency without isolation — quiet power.
- **Jupiter's Twin (The Depth):** Immersing yourself in your own company. Being alone not as a deficit but as enrichment.
- **Saturn's Twin (The Membrane):** Knowing the difference between shutting others out from fear and choosing your own company from love. Boundary as self-respect.
- **Uranus's Twin (The Drift):** Your relationship with being alone gradually changing character from necessity to choice. Your relationship with yourself maturing quietly.
- **Neptune's Twin (The Vessel of Form):** The dream of whole relation beginning by incarnating wholeness in yourself first. Not waiting for the other but becoming what you wait for.
- **Pluto's Twin (The Weave):** Integrating the loss of a relationship without losing your own wholeness. Grief that does not fragment the self.

### Mars's Twin (The Pause) with:

- **Jupiter's Twin (The Depth):** Withholding action *and* immersing in what actually is. The opposite of action: deep presence with things as they are, without fixing.
- **Saturn's Twin (The Membrane):** Knowing when not to act and simultaneously sensing precisely what the situation requires. Responsive passivity — not slackness but intelligent waiting.
- **Uranus's Twin (The Drift):** Drive that gradually shifts direction from within. You discover only in retrospect that you changed course.
- **Neptune's Twin (The Vessel of Form):** Stillness that becomes a concrete action at precisely the right moment. The opposite of impulse — action that arises of itself when the time is ripe.
- **Pluto's Twin (The Weave):** Force that transforms without destroying. Changing a situation without confrontation, without battle, yet with irrevocable effect.

### Jupiter's Twin (The Depth) with:

- **Saturn's Twin (The Membrane):** Immersion that knows its own boundaries. Going deep while sensing when to surface. Depth with self-protection.
- **Uranus's Twin (The Drift):** Immersion that imperceptibly shifts what you immerse yourself in. The focus you had five years ago is not the same as now, but the shift happened without decision.
- **Neptune's Twin (The Vessel of Form):** Taking what you have immersed yourself in and making it concrete in the world. Contemplation becoming action. Study becoming the work.
- **Pluto's Twin (The Weave):** Immersion that transforms you without losing what you were. You come up from the depth changed but whole.

### Saturn's Twin (The Membrane) with:

- **Uranus's Twin (The Drift):** Boundaries that gradually shift without conscious decision. What you protected yourself from ten years ago you now let in, naturally, without drama.
- **Neptune's Twin (The Vessel of Form):** The living boundary that translates between inner and outer. The membrane that does not merely sort but *translates*.
- **Pluto's Twin (The Weave):** Boundaries that transform themselves. The membrane that fundamentally changes character through what it encounters.

### Uranus's Twin (The Drift) with:

- **Neptune's Twin (The Vessel of Form):** Slow change gradually taking form. The visionary materializing over years without anyone being able to point to when it happened.
- **Pluto's Twin (The Weave):** Mutation and integration simultaneously. Change so slow and so thorough that there is never a rupture — only a day when you realize everything is different.

### Neptune's Twin (The Vessel of Form) with:

- **Pluto's Twin (The Weave):** The formless becoming flesh *and* what already exists transforming to receive it. The meeting between what comes in and what makes space. Birth as mutual adaptation.

---

## 6. Three Layers of Reading

The system has three layers:

### Layer 1: Individual Twin Intensity
For each planet: stress index → Twin intensity. "Your Membrane is at 78 today."

### Layer 2: Predictable Twin Pairs
When two Twins are both highly active, their meeting produces a nameable quality from the 45 pairs above. This is the map — it gives direction and vocabulary.

### Layer 3: Emergent Qualities
When two unspoken qualities meet, something arises that cannot be predicted from the components alone. The emergent layer depends on context — on the other planets, the moment, the person. The predictable layer is the threshold; the emergent layer is what the threshold opens toward.

**The predictable layer is the map. The emergent layer is the landscape. The map is necessary to orient. The landscape always exceeds the map.**

---

## 7. Visual Language

### 7.1 Fundamental Contrast with Classical Astrology

| Classical Astrology | Whole-Star |
|--------------------|------------|
| Circle | Field |
| Point | Gradient |
| Line | Pulsation |
| Snapshot | Movement |
| Sharp symbol | Open form |
| Position | Intensity |
| Tells you *where you are* | Shows you *what is calling* |

### 7.2 The Screen

**Background layer:** The user's classical birth chart — muted, near-transparent. The manifest layer as quiet foundation.

**Foreground layer:** Twin fields as luminous, soft zones with varying intensity. Where two fields overlap, visual interference patterns emerge — unpredictable, organic. Everything moves slowly.

The brightest field generates the daily invitation.

### 7.3 Color System

Each Twin's color is the **complement** of its planet's classical color — not in simple color-theory terms, but in the sense of expressing what the planet lacks to be whole.

| Planet | Classical Color | Twin Color Direction |
|--------|----------------|---------------------|
| Sun | Gold/yellow | Deep, quiet silver-blue |
| Moon | Silver/white | Warm, embodied amber |
| Mercury | Mixed/quicksilver | Still, deep indigo |
| Venus | Green/rose | Solitary earth tone |
| Mars | Red | Deep water — dark, still teal |
| Jupiter | Royal blue/violet | Concentrated warm amber |
| Saturn | Black/dark blue | Living warm light — soft rose-gold |
| Uranus | Electric blue | Slow ember — muted copper |
| Neptune | Sea green/lavender | Dense, incarnate terra cotta |
| Pluto | Deep crimson/black | Woven gold-green — moss, integration |

Colors communicate *relation*: the Twin's color answers the planet's color. Together they feel complete.

### 7.4 Pulsation

Twin fields pulse at rates corresponding to their planet's natural cycle:

- Moon's Twin: fast pulse (seconds)
- Inner planets: medium pulse (seconds–minutes)
- Jupiter/Saturn: slow pulse (minutes)
- Outer planets: very slow pulse — almost static, barely breathing

This creates an intuitive visual hierarchy communicating timescale without text.

### 7.5 Symbols

Classical planet symbols are sharp, iconic, closed forms (Mars's spear, Venus's mirror, Saturn's sickle).

Twin symbols are **open forms**: half-arcs, spirals that do not close, circles with openings. They communicate process, incompleteness, becoming.

Each Twin symbol contains a *fragment* of its planet's classical symbol — enough to recognize the connection, but transformed to express something still forming.

### 7.6 Interference Patterns

Where two Twin fields overlap visually, a third pattern emerges that belongs to neither. This is the visual representation of the emergent layer. The user can see it arise but cannot predict exactly how it will look.

---

## 8. Daily Invitation Format

Whole-Star does not deliver daily *information*. It delivers a daily *invitation*.

**Tone:** Not "the stars say..." but "what if you noticed that..." Not prescriptive but invitational. Not passive-receiving but active-sensing.

**Structure:**
1. Which Twin field is brightest today (highest intensity)
2. Which house axis it activates (where in your life)
3. An invitation question — not what to do, but what to notice

**Example:** "The Membrane is strong today — your sense for when boundaries should soften is heightened. It's working in your most private spaces (4th house), while your public life (10th house) demands structure. What would change if you let the sensing at home inform the holding at work?"

---

## 9. Differentiation from Co-Star

| Dimension | Co-Star | Whole-Star |
|-----------|---------|------------|
| Core message | Here is what the planets do to you | Here is what is stirring inside you |
| Tone | Informative, sometimes blunt | Invitational, sensing |
| Visual language | Minimalist black/white, geometric | Luminous fields, organic movement |
| Temporal feel | Daily snapshot | Pulsing, breathing, alive |
| User relationship | Passive receiver | Active noticer |
| Astrological layer | Manifest (planets, signs, houses) | Implicit (what the manifest presupposes) |
| Philosophical basis | Classical Western astrology | Original Twin system layered on classical foundation |
