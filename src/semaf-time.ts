// ═══════════════════════════════════════════════════════════════════════════
// @amlhubs/semaf-time — ISO 24617-1:2012 (confirmed 2023) SemAF-Time
// Language resource management — Semantic annotation framework
// Part 1: Time and events (also known as ISO-TimeML)
//
// Authority: ISO/TC 37/SC 4 — Language resource management
// Spec:      https://www.iso.org/standard/37331.html
// Predecessor (academic): TimeML 1.2.1 (Pustejovsky et al., TERQAS/TANGO/ARDA)
// Optional companion: W3C OWL Time (https://www.w3.org/TR/owl-time/)
//
// Scope: full SemAF-Time annotation surface — Event (with EventClass:
//   Reporting, Perception, Aspectual, I-Action, I-State, State, Occurrence),
//   MakeInstance (event-instance materialisation), Time (TIMEX3 with
//   normalised ISO 8601 value, TimexType, TimexMod), Signal (lexical anchor
//   of temporal relations), TLink (typed temporal relation, Allen interval
//   algebra: Before, After, Includes, IsIncluded, During, DuringInv,
//   Simultaneous, IAfter, IBefore, Identity, Begins, Ends, BegunBy, EndedBy),
//   SLink (subordinating link: Modal, Evidential, Negative-Evidential,
//   Factive, Counter-Factive, Conditional), ALink (aspectual link:
//   Initiates, Culminates, Terminates, Continues, Reinitiates), MeasureLink
//   (quantitative duration measure on Event/Time), ConfidenceLink
//   (annotation of inter-annotator confidence on a Link).
//
// Anchoring discipline: every annotation carries a (beginIndex, endIndex)
// pair pointing into a NIF 2.0 Context (re-used from @amlhubs/nif), per the
// SemAF series convention that source-text anchoring is delegated to NIF
// rather than re-modelled per-part.
//
// Cross-reference discipline: every relation between SemAF-Time concepts
// (Event ↔ Event, Event ↔ Time, Time ↔ Time, Event ↔ Signal, Signal ↔ Time,
// Link ↔ Link) is realised as a UML Association whose memberEnds carry the
// typed referent identifiers — never an opaque string.
//
// Architectural ordering:
//   @amlhubs/uml          (root — OMG UML 2.5.1)
//      ↑ peer
//   @amlhubs/mof          (reflective machinery over UML)
//      ↑ peer
//   @amlhubs/nif          (offset-anchoring substrate)
//      ↑ peer
//   @amlhubs/semaf-time   (THIS PACKAGE — temporal annotation surface)
//
// This file is PURE SemAF-Time. It contains NO content of SemAF Parts 2/4/
// 7/8/9/14 (Dialogue Acts, Semantic Roles, ISOspace, Discourse Relations,
// RAF, Spatial Semantics) — those are sibling packages.
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// SemAF-Time METACLASSES (filled in by sequential implementer waves)
// ═══════════════════════════════════════════════════════════════════════════
// BEGIN-EXTRACTED-SEMAF-TIME

// ───────────────────────────────────────────────────────────────────────────
// WAVE 1 — Annotation root + Anchor (NIF-anchored offset substrate)
// ───────────────────────────────────────────────────────────────────────────

// --- 1. IAnnotation (§6) --- ABSOLUTE ROOT of SemAF-Time
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §6 — Annotation root
 * @metaclass abstract
 * @generalization (root of SemAF-Time — every concrete SemAF-Time element
 *   that can be anchored to source text Inherits from this)
 * @definition An Annotation is the abstract supertype of every SemAF-Time
 *   element that carries an anchor into source-text. ISO 24617-1 follows
 *   the ISO 24612 (LAF) convention of standoff annotation: the annotation
 *   does not modify the source text; it points into it via offset indices.
 *   Every concrete metaclass (Event, Time, Signal, MakeInstance, TLink,
 *   SLink, ALink, MeasureLink, ConfidenceLink) is an Annotation.
 * @ownedAttributes
 *   id : String [1] — the annotation identifier (e.g., "e1", "t2", "l3")
 *   comment : String [0..1] — human-readable annotator note
 * @associationEnds
 *   anchor : Anchor [0..1] — the offset anchor into the source NIF Context;
 *     optional because Link-typed annotations (TLink, SLink, ALink,
 *     MeasureLink, ConfidenceLink) do not anchor — they relate two
 *     already-anchored Annotations.
 * @constraints
 *   [unique_id]: id->isUnique() within the enclosing isoTimeML root
 *     element — no two Annotations share the same id.
 */
export interface IAnnotation {
  readonly id: string;
  readonly comment: string | undefined;
  readonly anchorId: string | undefined;
}

// --- 2. IAnchor (§6) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §6 — Standoff anchoring (per ISO 24612 LAF convention)
 * @metaclass concrete
 * @generalization (root — anchors are not Annotations themselves;
 *   they are pointed-to by Annotations)
 * @definition An Anchor is the standoff pointer from a SemAF-Time
 *   Annotation into its source NIF 2.0 Context. The pair (beginIndex,
 *   endIndex) is the half-open character interval [beginIndex, endIndex)
 *   into the surface form of the source Context, mirroring NIF's
 *   nif:beginIndex / nif:endIndex semantics. Anchors may be discontinuous;
 *   the ranges array carries one (begin, end) tuple per discontinuous
 *   token (cf. the LREC 2010 "looked ... up" example).
 * @ownedAttributes
 *   beginIndex : Integer [1] — primary span character offset start
 *   endIndex : Integer [1] — primary span character offset end (exclusive)
 *   contextUri : String [0..1] — NIF Context URI; absent when the Anchor
 *     is interpreted relative to the enclosing document.
 * @associationEnds
 *   ranges : Range [0..*] — additional discontinuous (begin, end) tuples
 *     when the annotated form spans non-contiguous tokens; primary span
 *     is always (beginIndex, endIndex).
 * @constraints
 *   [non_negative_indices]: beginIndex >= 0 and endIndex >= 0
 *   [ordered_indices]: beginIndex <= endIndex
 *   [valid_ranges]: ranges->forAll(r | r.beginIndex >= 0 and
 *     r.endIndex >= 0 and r.beginIndex <= r.endIndex)
 */
export interface IAnchor {
  readonly beginIndex: number;
  readonly endIndex: number;
  readonly contextUri: string | undefined;
  readonly ranges: ReadonlyArray<IRange>;
}

// --- 3. IRange (§6) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §6 — Standoff anchoring; LREC 2010 §3.3 (discontinuous tokens)
 * @metaclass concrete
 * @generalization (root)
 * @definition A Range is a single half-open character interval into a NIF
 *   Context. Used inside Anchor.ranges to capture additional segments of
 *   a discontinuous form (e.g., the verb "looked ... up" in LREC 2010
 *   §3.3 example — Anchor.beginIndex/endIndex covers "looked",
 *   ranges[0] covers "up").
 * @ownedAttributes
 *   beginIndex : Integer [1] — segment character offset start
 *   endIndex : Integer [1] — segment character offset end (exclusive)
 * @constraints
 *   [non_negative]: beginIndex >= 0 and endIndex >= 0
 *   [ordered]: beginIndex <= endIndex
 */
export interface IRange {
  readonly beginIndex: number;
  readonly endIndex: number;
}

/** Concrete extensible base — see IRange. */
export class Range implements IRange {
  constructor(
    public readonly beginIndex: number,
    public readonly endIndex: number,
  ) {}
}

/** Concrete extensible base — see IAnchor. */
export class Anchor implements IAnchor {
  constructor(
    public readonly beginIndex: number,
    public readonly endIndex: number,
    public readonly contextUri: string | undefined = undefined,
    public readonly ranges: ReadonlyArray<IRange> = [],
  ) {}
}

/** Abstract extensible base — see IAnnotation. Concrete metaclasses
 *  (Event, Time, Signal, MakeInstance, TLink, SLink, ALink, MeasureLink,
 *  ConfidenceLink) MUST extend this base.
 */
export abstract class Annotation implements IAnnotation {
  constructor(
    public readonly id: string,
    public readonly comment: string | undefined = undefined,
    public readonly anchorId: string | undefined = undefined,
  ) {}
}

// ───────────────────────────────────────────────────────────────────────────
// WAVE 2 — EVENT + MAKEINSTANCE + their enumerations
// ───────────────────────────────────────────────────────────────────────────

// --- 4. EventClassValue + ENUM_EVENT_CLASS (§7.1, EVENT.class) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §7.1 — EVENT.class
 * @metaclass enumeration
 * @definition The EVENT.class attribute partitions every Event into one
 *   of seven ontological classes drawn directly from TimeML 1.2.1 §2.1.
 *   The seven classes are exhaustive and mutually exclusive.
 * @literals
 *   OCCURRENCE  — a default-class event that occurs (most verbs)
 *   PERCEPTION  — an event of physical perception (see, hear, …)
 *   REPORTING   — an event of communicative reporting (say, announce, …)
 *   ASPECTUAL   — an event modifying another event's aspect (begin, finish)
 *   STATE       — a stative situation (be, know, …)
 *   I_STATE     — an intensional state (believe, want, …)
 *   I_ACTION    — an intensional action (try, attempt, …)
 */
export type EventClassValue =
  | 'OCCURRENCE'
  | 'PERCEPTION'
  | 'REPORTING'
  | 'ASPECTUAL'
  | 'STATE'
  | 'I_STATE'
  | 'I_ACTION';

/** Frozen registry of every EVENT.class literal — single source of truth. */
export const ENUM_EVENT_CLASS: ReadonlyArray<EventClassValue> = Object.freeze([
  'OCCURRENCE',
  'PERCEPTION',
  'REPORTING',
  'ASPECTUAL',
  'STATE',
  'I_STATE',
  'I_ACTION',
] as const);

// --- 5. PosValue + ENUM_POS (§7.2, MAKEINSTANCE.pos) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §7.2 — MAKEINSTANCE.pos
 * @metaclass enumeration
 * @definition Part-of-speech tag of the lexical realisation of an Event
 *   instance. Replaces TimeML 1.2.0's nf_morph attribute (TimeML 1.2.1
 *   §3 changes-from-1.2 list). The five-literal set is exhaustive.
 * @literals ADJECTIVE | NOUN | VERB | PREPOSITION | OTHER
 */
export type PosValue = 'ADJECTIVE' | 'NOUN' | 'VERB' | 'PREPOSITION' | 'OTHER';

/** Frozen registry of every MAKEINSTANCE.pos literal. */
export const ENUM_POS: ReadonlyArray<PosValue> = Object.freeze([
  'ADJECTIVE',
  'NOUN',
  'VERB',
  'PREPOSITION',
  'OTHER',
] as const);

// --- 6. TenseValue + ENUM_TENSE (§7.2, MAKEINSTANCE.tense) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §7.2 — MAKEINSTANCE.tense
 * @metaclass enumeration
 * @definition Grammatical tense of the lexical realisation. ISO-TimeML
 *   redistributed PRESPART, PASTPART, INFINITIVE from TimeML 1.2.0's
 *   nf_morph into the tense attribute (TimeML 1.2.1 §3 changes list);
 *   the LREC 2010 paper §3.3 also surfaces vForm="INFINITIVE" on EVENT
 *   directly in the standoff annotation example, retained as an alias.
 * @literals FUTURE | INFINITIVE | PAST | PASTPART | PRESENT | PRESPART | NONE
 */
export type TenseValue =
  | 'FUTURE'
  | 'INFINITIVE'
  | 'PAST'
  | 'PASTPART'
  | 'PRESENT'
  | 'PRESPART'
  | 'NONE';

/** Frozen registry of every MAKEINSTANCE.tense literal. */
export const ENUM_TENSE: ReadonlyArray<TenseValue> = Object.freeze([
  'FUTURE',
  'INFINITIVE',
  'PAST',
  'PASTPART',
  'PRESENT',
  'PRESPART',
  'NONE',
] as const);

// --- 7. AspectValue + ENUM_ASPECT (§7.2, MAKEINSTANCE.aspect) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §7.2 — MAKEINSTANCE.aspect
 * @metaclass enumeration
 * @definition Grammatical aspect of the lexical realisation.
 * @literals PROGRESSIVE | PERFECTIVE | PERFECTIVE_PROGRESSIVE | NONE
 */
export type AspectValue =
  | 'PROGRESSIVE'
  | 'PERFECTIVE'
  | 'PERFECTIVE_PROGRESSIVE'
  | 'NONE';

/** Frozen registry of every MAKEINSTANCE.aspect literal. */
export const ENUM_ASPECT: ReadonlyArray<AspectValue> = Object.freeze([
  'PROGRESSIVE',
  'PERFECTIVE',
  'PERFECTIVE_PROGRESSIVE',
  'NONE',
] as const);

// --- 8. PolarityValue + ENUM_POLARITY (§7.2, MAKEINSTANCE.polarity) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §7.2 — MAKEINSTANCE.polarity (default POS)
 * @metaclass enumeration
 * @definition Polarity of the lexical realisation. Default value is POS.
 * @literals POS | NEG
 */
export type PolarityValue = 'POS' | 'NEG';

/** Frozen registry of every MAKEINSTANCE.polarity literal. */
export const ENUM_POLARITY: ReadonlyArray<PolarityValue> = Object.freeze([
  'POS',
  'NEG',
] as const);

// --- 9. IEvent (§7.1) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §7.1 — EVENT tag (TimeML 1.2.1 §2.1)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition An Event is the SemAF-Time abstraction of an eventuality
 *   mentioned in source text — a situation that "occurs" or "obtains"
 *   in the world. ISO-TimeML's somewhat unique definition: an Event is
 *   simply something that can be related to another Event or Time via
 *   an ISO-TimeML relation (LREC 2010 §1). Events are typically realised
 *   by tensed verbs but also nominal event-denoting expressions (e.g.,
 *   "explosion", "meeting"), event adjectives, and event prepositions.
 * @ownedAttributes
 *   eid : String [1] — Event identifier, format `e<integer>` (TimeML 1.2.1
 *     §2.1 — corresponds to IAnnotation.id)
 *   eventClass : EventClassValue [1] — one of the seven classes; required
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   anchor : Anchor [0..1] — standoff pointer to source span (LREC 2010
 *     §3.3); the historical TimeML in-line form used `target="#tokenN"`
 *     pointers, normalised here to NIF-style offset indices.
 * @constraints
 *   [eid_format]: eid.matches('e[0-9]+')
 *   [class_in_enum]: ENUM_EVENT_CLASS->includes(eventClass)
 */
export interface IEvent extends IAnnotation {
  readonly eventClass: EventClassValue;
}

/** Concrete extensible base — see IEvent. */
export class Event extends Annotation implements IEvent {
  constructor(
    id: string,
    public readonly eventClass: EventClassValue,
    comment: string | undefined = undefined,
    anchorId: string | undefined = undefined,
  ) {
    super(id, comment, anchorId);
  }
}

// --- 10. IMakeInstance (§7.2) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §7.2 — MAKEINSTANCE tag (TimeML 1.2.1 §2.2)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition A MakeInstance is the realisation link from an Event
 *   (a kind of eventuality) to a specific event-instance with concrete
 *   tense/aspect/polarity/modality. The same Event token in source text
 *   may surface multiple distinct MakeInstance records when the event
 *   is referred to with distinct grammatical settings (e.g., a reported
 *   event vs. a counterfactual reformulation). This separation is
 *   ISO-TimeML's mechanism for distinguishing the lexical event-token
 *   from the world-level event-instance.
 * @ownedAttributes
 *   eiid : String [1] — Event-instance identifier, format `ei<integer>`
 *     (TimeML 1.2.1 §2.2)
 *   pos : PosValue [1] — required part-of-speech tag
 *   tense : TenseValue [1] — required tense
 *   aspect : AspectValue [1] — required aspect
 *   polarity : PolarityValue [1] — required polarity (default POS)
 *   cardinality : String [0..1] — optional CDATA expressing event count
 *   modality : String [0..1] — optional CDATA expressing modal operator
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   eventID : Event [1] — IDREF to the Event of which this is an instance
 *   signalID : Signal [0..1] — IDREF to a Signal disambiguating this
 *     instance (e.g., a modal auxiliary)
 * @constraints
 *   [eiid_format]: eiid.matches('ei[0-9]+')
 *   [event_exists]: eventID->referredAnnotation oclIsKindOf(Event)
 *   [pos_in_enum]: ENUM_POS->includes(pos)
 *   [tense_in_enum]: ENUM_TENSE->includes(tense)
 *   [aspect_in_enum]: ENUM_ASPECT->includes(aspect)
 *   [polarity_in_enum]: ENUM_POLARITY->includes(polarity)
 */
export interface IMakeInstance extends IAnnotation {
  readonly eventID: string;
  readonly signalID: string | undefined;
  readonly pos: PosValue;
  readonly tense: TenseValue;
  readonly aspect: AspectValue;
  readonly polarity: PolarityValue;
  readonly cardinality: string | undefined;
  readonly modality: string | undefined;
}

/** Concrete extensible base — see IMakeInstance. */
export class MakeInstance extends Annotation implements IMakeInstance {
  constructor(
    id: string,
    public readonly eventID: string,
    public readonly pos: PosValue,
    public readonly tense: TenseValue,
    public readonly aspect: AspectValue,
    public readonly polarity: PolarityValue = 'POS',
    public readonly signalID: string | undefined = undefined,
    public readonly cardinality: string | undefined = undefined,
    public readonly modality: string | undefined = undefined,
    comment: string | undefined = undefined,
    anchorId: string | undefined = undefined,
  ) {
    super(id, comment, anchorId);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// WAVE 3 — TIMEX3 (§8) + its enumerations
// ───────────────────────────────────────────────────────────────────────────

// --- 11. TimexTypeValue + ENUM_TIMEX_TYPE (§8.1, TIMEX3.type) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §8.1 — TIMEX3.type (TimeML 1.2.1 §2.3)
 * @metaclass enumeration
 * @definition Partition of every TIMEX3 expression by its temporal kind.
 * @literals
 *   DATE      — calendar date (e.g., "yesterday", "2026-05-03")
 *   TIME      — clock time (e.g., "3pm", "noon")
 *   DURATION  — time amount (e.g., "two hours", "P2H"); per LREC 2010
 *               §3.4, ISO-TimeML reinterprets DURATION as the measure of
 *               an interval, not the interval itself
 *   SET       — recurring time (e.g., "every Monday")
 */
export type TimexTypeValue = 'DATE' | 'TIME' | 'DURATION' | 'SET';

/** Frozen registry of every TIMEX3.type literal. */
export const ENUM_TIMEX_TYPE: ReadonlyArray<TimexTypeValue> = Object.freeze([
  'DATE',
  'TIME',
  'DURATION',
  'SET',
] as const);

// --- 12. TimexModValue + ENUM_TIMEX_MOD (§8.2, TIMEX3.mod) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §8.2 — TIMEX3.mod (TimeML 1.2.1 §2.3)
 * @metaclass enumeration
 * @definition Modifier on a TIMEX3 expression that constrains the
 *   interpretation of value (e.g., "before noon" → mod=BEFORE).
 *   Twelve literals, exhaustive over the modifier vocabulary.
 * @literals BEFORE | AFTER | ON_OR_BEFORE | ON_OR_AFTER | LESS_THAN |
 *   MORE_THAN | EQUAL_OR_LESS | EQUAL_OR_MORE | START | MID | END | APPROX
 */
export type TimexModValue =
  | 'BEFORE'
  | 'AFTER'
  | 'ON_OR_BEFORE'
  | 'ON_OR_AFTER'
  | 'LESS_THAN'
  | 'MORE_THAN'
  | 'EQUAL_OR_LESS'
  | 'EQUAL_OR_MORE'
  | 'START'
  | 'MID'
  | 'END'
  | 'APPROX';

/** Frozen registry of every TIMEX3.mod literal. */
export const ENUM_TIMEX_MOD: ReadonlyArray<TimexModValue> = Object.freeze([
  'BEFORE',
  'AFTER',
  'ON_OR_BEFORE',
  'ON_OR_AFTER',
  'LESS_THAN',
  'MORE_THAN',
  'EQUAL_OR_LESS',
  'EQUAL_OR_MORE',
  'START',
  'MID',
  'END',
  'APPROX',
] as const);

// --- 13. FunctionInDocumentValue + ENUM_FID (§8.3, TIMEX3.functionInDocument) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §8.3 — TIMEX3.functionInDocument (TimeML 1.2.1 §2.3)
 * @metaclass enumeration
 * @definition Pragmatic role of a TIMEX3 within the source document.
 *   The "Document Creation Time" (DCT) is the canonical anchor for
 *   relative TIMEX3 resolution (e.g., "yesterday" relative to DCT).
 *   Default value is NONE.
 * @literals CREATION_TIME | EXPIRATION_TIME | MODIFICATION_TIME |
 *   PUBLICATION_TIME | RELEASE_TIME | RECEPTION_TIME | NONE
 */
export type FunctionInDocumentValue =
  | 'CREATION_TIME'
  | 'EXPIRATION_TIME'
  | 'MODIFICATION_TIME'
  | 'PUBLICATION_TIME'
  | 'RELEASE_TIME'
  | 'RECEPTION_TIME'
  | 'NONE';

/** Frozen registry of every TIMEX3.functionInDocument literal. */
export const ENUM_FID: ReadonlyArray<FunctionInDocumentValue> = Object.freeze([
  'CREATION_TIME',
  'EXPIRATION_TIME',
  'MODIFICATION_TIME',
  'PUBLICATION_TIME',
  'RELEASE_TIME',
  'RECEPTION_TIME',
  'NONE',
] as const);

// --- 14. ITime (§8) — the TIMEX3 metaclass ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §8 — TIMEX3 tag (TimeML 1.2.1 §2.3)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition A Time is an explicit temporal expression in source text:
 *   a calendar date, a clock time, a duration, or a recurring set.
 *   TIMEX3 extends the ACE 2004 TIMEX2 scheme (TimeML 1.2.1 §1).
 *   The value attribute carries the ISO-8601-normalised string
 *   representation (e.g., "2009-10-19" for "yesterday" relative to a
 *   DCT of "2009-10-20", per LREC 2010 §3.3). In ISO-TimeML, durations
 *   are reinterpreted as the measure of an interval (LREC 2010 §3.4).
 * @ownedAttributes
 *   tid : String [1] — Time identifier, format `t<integer>` (corresponds
 *     to IAnnotation.id)
 *   timexType : TimexTypeValue [1] — required type (DATE/TIME/DURATION/SET)
 *   value : String [0..1] — ISO 8601 normalised temporal value
 *   mod : TimexModValue [0..1] — optional modifier
 *   functionInDocument : FunctionInDocumentValue [1] — pragmatic doc role
 *     (default NONE)
 *   temporalFunction : Boolean [1] — true if value derived from a
 *     TemporalFunction (default false)
 *   quant : String [0..1] — quantifier modifier (e.g., "EVERY")
 *   freq : String [0..1] — frequency modifier (Duration-typed)
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   anchor : Anchor [0..1] — standoff pointer to source span
 *   valueFromFunction : TemporalFunction [0..1] — IDREF to a
 *     TemporalFunction whose evaluation produced value
 *   anchorTime : Time [0..1] — IDREF to the anchor Time relative to
 *     which value was computed
 *   beginPoint : Time [0..1] — IDREF to the Time marking duration start
 *   endPoint : Time [0..1] — IDREF to the Time marking duration end
 * @constraints
 *   [tid_format]: tid.matches('t[0-9]+')
 *   [type_in_enum]: ENUM_TIMEX_TYPE->includes(timexType)
 *   [mod_in_enum]: mod->notEmpty() implies ENUM_TIMEX_MOD->includes(mod)
 *   [fid_in_enum]: ENUM_FID->includes(functionInDocument)
 *   [duration_endpoints]: timexType = 'DURATION' implies
 *     (beginPointId->notEmpty() and endPointId->notEmpty()) or
 *     value->notEmpty()
 *   [function_consistency]: temporalFunction = true implies
 *     valueFromFunctionId->notEmpty()
 */
export interface ITime extends IAnnotation {
  readonly timexType: TimexTypeValue;
  readonly value: string | undefined;
  readonly mod: TimexModValue | undefined;
  readonly functionInDocument: FunctionInDocumentValue;
  readonly temporalFunction: boolean;
  readonly quant: string | undefined;
  readonly freq: string | undefined;
  readonly valueFromFunctionId: string | undefined;
  readonly anchorTimeId: string | undefined;
  readonly beginPointId: string | undefined;
  readonly endPointId: string | undefined;
}

/** Concrete extensible base — see ITime. */
export class Time extends Annotation implements ITime {
  constructor(
    id: string,
    public readonly timexType: TimexTypeValue,
    public readonly value: string | undefined = undefined,
    public readonly mod: TimexModValue | undefined = undefined,
    public readonly functionInDocument: FunctionInDocumentValue = 'NONE',
    public readonly temporalFunction: boolean = false,
    public readonly quant: string | undefined = undefined,
    public readonly freq: string | undefined = undefined,
    public readonly valueFromFunctionId: string | undefined = undefined,
    public readonly anchorTimeId: string | undefined = undefined,
    public readonly beginPointId: string | undefined = undefined,
    public readonly endPointId: string | undefined = undefined,
    comment: string | undefined = undefined,
    anchorId: string | undefined = undefined,
  ) {
    super(id, comment, anchorId);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// WAVE 4 — SIGNAL (§9) + LINK families (§10 TLINK / §11 SLINK / §12 ALINK)
// ───────────────────────────────────────────────────────────────────────────

// --- 15. ISignal (§9) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §9 — SIGNAL tag (TimeML 1.2.1 §2.4)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition A Signal marks a function word in source text that
 *   indicates a temporal relation, a subordination, an aspectual
 *   relation, or a quantification — typically a preposition (during,
 *   until), a conjunction (when, while, before), a negation marker (not),
 *   or a quantifier (every, twice). Signals are referenced by Links
 *   (TLink, SLink, ALink) via signalID to ground the lexical surface of
 *   the relation in the source text.
 * @ownedAttributes
 *   sid : String [1] — Signal identifier, format `s<integer>`
 *     (corresponds to IAnnotation.id)
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   anchor : Anchor [0..1] — standoff pointer to source span
 * @constraints
 *   [sid_format]: sid.matches('s[0-9]+')
 */
export interface ISignal extends IAnnotation {}

/** Concrete extensible base — see ISignal. */
export class Signal extends Annotation implements ISignal {}

// --- 16. TLinkRelTypeValue + ENUM_TLINK_REL_TYPE (§10.1, TLINK.relType) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §10.1 — TLINK.relType (TimeML 1.2.1 §2.5)
 * @metaclass enumeration
 * @definition The fourteen-literal relation type for a Temporal Link
 *   between two intervals. Drawn from Allen (1983) "Maintaining
 *   Knowledge about Temporal Intervals" — Allen's interval algebra
 *   defines thirteen primitive disjoint relations; ISO-TimeML adds
 *   IDENTITY (a = b, intentionally fused with SIMULTANEOUS but
 *   reserved for explicit co-reference) for fourteen total. The
 *   inverse of DURING is recorded as DURING_INV (TimeML 1.2.1 §2.5).
 * @literals BEFORE | AFTER | INCLUDES | IS_INCLUDED | DURING |
 *   DURING_INV | SIMULTANEOUS | IAFTER | IBEFORE | IDENTITY |
 *   BEGINS | ENDS | BEGUN_BY | ENDED_BY
 */
export type TLinkRelTypeValue =
  | 'BEFORE'
  | 'AFTER'
  | 'INCLUDES'
  | 'IS_INCLUDED'
  | 'DURING'
  | 'DURING_INV'
  | 'SIMULTANEOUS'
  | 'IAFTER'
  | 'IBEFORE'
  | 'IDENTITY'
  | 'BEGINS'
  | 'ENDS'
  | 'BEGUN_BY'
  | 'ENDED_BY';

/** Frozen registry of every TLINK.relType literal — Allen's algebra + IDENTITY. */
export const ENUM_TLINK_REL_TYPE: ReadonlyArray<TLinkRelTypeValue> = Object.freeze([
  'BEFORE',
  'AFTER',
  'INCLUDES',
  'IS_INCLUDED',
  'DURING',
  'DURING_INV',
  'SIMULTANEOUS',
  'IAFTER',
  'IBEFORE',
  'IDENTITY',
  'BEGINS',
  'ENDS',
  'BEGUN_BY',
  'ENDED_BY',
] as const);

// --- 17. ITLink (§10) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §10 — TLINK tag (TimeML 1.2.1 §2.5)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition A TLink (Temporal Link) encodes a typed temporal relation
 *   between two intervals — Event/Event, Event/Time, or Time/Time —
 *   typed by Allen (1983) interval algebra. The directional pair is
 *   (eventInstanceID | timeID, relatedToEventInstance | relatedToTime),
 *   read as "the first interval STANDS-IN-RELTYPE-TO the second".
 *   Optional signalID grounds the relation in a lexical Signal (e.g.,
 *   "before", "during"). Per LREC 2010 §3.3, the TLink is the primary
 *   ISO-TimeML mechanism for both ordering and anchoring events.
 * @ownedAttributes
 *   lid : String [1] — Link identifier, format `l<integer>` (corresponds
 *     to IAnnotation.id)
 *   relType : TLinkRelTypeValue [1] — required Allen-style relation type
 *   origin : String [0..1] — annotator/system that produced the link
 *   syntax : String [0..1] — optional syntactic context
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   eventInstance : MakeInstance [0..1] — IDREF to first interval (Event side)
 *   time : Time [0..1] — IDREF to first interval (Time side)
 *   signal : Signal [0..1] — IDREF to lexical Signal grounding the relation
 *   relatedToEventInstance : MakeInstance [0..1] — IDREF to second interval
 *     (Event side)
 *   relatedToTime : Time [0..1] — IDREF to second interval (Time side)
 * @constraints
 *   [lid_format]: lid.matches('l[0-9]+')
 *   [reltype_in_enum]: ENUM_TLINK_REL_TYPE->includes(relType)
 *   [first_arg]: eventInstanceID->notEmpty() xor timeID->notEmpty()
 *     — exactly one of the two MUST be set
 *   [second_arg]: relatedToEventInstanceID->notEmpty() xor
 *     relatedToTimeID->notEmpty() — exactly one of the two MUST be set
 */
export interface ITLink extends IAnnotation {
  readonly relType: TLinkRelTypeValue;
  readonly origin: string | undefined;
  readonly syntax: string | undefined;
  readonly eventInstanceID: string | undefined;
  readonly timeID: string | undefined;
  readonly signalID: string | undefined;
  readonly relatedToEventInstance: string | undefined;
  readonly relatedToTime: string | undefined;
}

/** Concrete extensible base — see ITLink. */
export class TLink extends Annotation implements ITLink {
  constructor(
    id: string,
    public readonly relType: TLinkRelTypeValue,
    public readonly eventInstanceID: string | undefined = undefined,
    public readonly timeID: string | undefined = undefined,
    public readonly relatedToEventInstance: string | undefined = undefined,
    public readonly relatedToTime: string | undefined = undefined,
    public readonly signalID: string | undefined = undefined,
    public readonly origin: string | undefined = undefined,
    public readonly syntax: string | undefined = undefined,
    comment: string | undefined = undefined,
    anchorId: string | undefined = undefined,
  ) {
    super(id, comment, anchorId);
  }
}

// --- 18. SLinkRelTypeValue + ENUM_SLINK_REL_TYPE (§11.1, SLINK.relType) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §11.1 — SLINK.relType (TimeML 1.2.1 §2.6)
 * @metaclass enumeration
 * @definition The six-literal relation type for a Subordination Link
 *   between a governing event-instance and a subordinated event-instance.
 *   Captures modal, evidential, factive, counter-factive, conditional,
 *   and negative-evidential subordination patterns.
 * @literals MODAL | EVIDENTIAL | NEG_EVIDENTIAL | FACTIVE | COUNTER_FACTIVE | CONDITIONAL
 */
export type SLinkRelTypeValue =
  | 'MODAL'
  | 'EVIDENTIAL'
  | 'NEG_EVIDENTIAL'
  | 'FACTIVE'
  | 'COUNTER_FACTIVE'
  | 'CONDITIONAL';

/** Frozen registry of every SLINK.relType literal. */
export const ENUM_SLINK_REL_TYPE: ReadonlyArray<SLinkRelTypeValue> = Object.freeze([
  'MODAL',
  'EVIDENTIAL',
  'NEG_EVIDENTIAL',
  'FACTIVE',
  'COUNTER_FACTIVE',
  'CONDITIONAL',
] as const);

// --- 19. ISLink (§11) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §11 — SLINK tag (TimeML 1.2.1 §2.6)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition An SLink (Subordination Link) encodes the subordination
 *   relation between a governing Event instance and a subordinated
 *   Event instance — typically introduced by a complement-taking verb
 *   such as "believe", "say", "want", "try", or by a counterfactual
 *   conditional. Both eventInstanceID and subordinatedEventInstance
 *   are REQUIRED in TimeML 1.2.1 (changed from optional in 1.2.0).
 * @ownedAttributes
 *   lid : String [1] — Link identifier, format `l<integer>`
 *   relType : SLinkRelTypeValue [1] — required relation type
 *   syntax : String [0..1] — optional syntactic context
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   eventInstance : MakeInstance [1] — IDREF to governing event-instance
 *   subordinatedEventInstance : MakeInstance [1] — IDREF to subordinated
 *     event-instance
 *   signal : Signal [0..1] — IDREF to lexical Signal (e.g., "if")
 * @constraints
 *   [lid_format]: lid.matches('l[0-9]+')
 *   [reltype_in_enum]: ENUM_SLINK_REL_TYPE->includes(relType)
 *   [event_required]: eventInstanceID->notEmpty()
 *   [subord_required]: subordinatedEventInstance->notEmpty()
 */
export interface ISLink extends IAnnotation {
  readonly relType: SLinkRelTypeValue;
  readonly eventInstanceID: string;
  readonly subordinatedEventInstance: string;
  readonly signalID: string | undefined;
  readonly syntax: string | undefined;
}

/** Concrete extensible base — see ISLink. */
export class SLink extends Annotation implements ISLink {
  constructor(
    id: string,
    public readonly relType: SLinkRelTypeValue,
    public readonly eventInstanceID: string,
    public readonly subordinatedEventInstance: string,
    public readonly signalID: string | undefined = undefined,
    public readonly syntax: string | undefined = undefined,
    comment: string | undefined = undefined,
    anchorId: string | undefined = undefined,
  ) {
    super(id, comment, anchorId);
  }
}

// --- 20. ALinkRelTypeValue + ENUM_ALINK_REL_TYPE (§12.1, ALINK.relType) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §12.1 — ALINK.relType (TimeML 1.2.1 §2.7)
 * @metaclass enumeration
 * @definition The five-literal relation type for an Aspectual Link
 *   between an aspectual event (begin, finish, …) and the event whose
 *   aspect it modifies.
 * @literals INITIATES | CULMINATES | TERMINATES | CONTINUES | REINITIATES
 */
export type ALinkRelTypeValue =
  | 'INITIATES'
  | 'CULMINATES'
  | 'TERMINATES'
  | 'CONTINUES'
  | 'REINITIATES';

/** Frozen registry of every ALINK.relType literal. */
export const ENUM_ALINK_REL_TYPE: ReadonlyArray<ALinkRelTypeValue> = Object.freeze([
  'INITIATES',
  'CULMINATES',
  'TERMINATES',
  'CONTINUES',
  'REINITIATES',
] as const);

// --- 21. IALink (§12) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §12 — ALINK tag (TimeML 1.2.1 §2.7)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition An ALink (Aspectual Link) encodes the aspectual modification
 *   of one Event instance by another — e.g., "John BEGAN reading" pairs
 *   the aspectual event "BEGAN" (governing) with "reading" (related-to)
 *   under relType=INITIATES. Both eventInstanceID and
 *   relatedToEventInstance are required.
 * @ownedAttributes
 *   lid : String [1] — Link identifier, format `l<integer>`
 *   relType : ALinkRelTypeValue [1] — required relation type
 *   syntax : String [0..1] — optional syntactic context
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   eventInstance : MakeInstance [1] — IDREF to governing aspectual
 *     event-instance
 *   relatedToEventInstance : MakeInstance [1] — IDREF to event whose
 *     aspect is modified
 *   signal : Signal [0..1] — IDREF to lexical Signal
 * @constraints
 *   [lid_format]: lid.matches('l[0-9]+')
 *   [reltype_in_enum]: ENUM_ALINK_REL_TYPE->includes(relType)
 *   [event_required]: eventInstanceID->notEmpty()
 *   [related_required]: relatedToEventInstance->notEmpty()
 */
export interface IALink extends IAnnotation {
  readonly relType: ALinkRelTypeValue;
  readonly eventInstanceID: string;
  readonly relatedToEventInstance: string;
  readonly signalID: string | undefined;
  readonly syntax: string | undefined;
}

/** Concrete extensible base — see IALink. */
export class ALink extends Annotation implements IALink {
  constructor(
    id: string,
    public readonly relType: ALinkRelTypeValue,
    public readonly eventInstanceID: string,
    public readonly relatedToEventInstance: string,
    public readonly signalID: string | undefined = undefined,
    public readonly syntax: string | undefined = undefined,
    comment: string | undefined = undefined,
    anchorId: string | undefined = undefined,
  ) {
    super(id, comment, anchorId);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// WAVE 5 — MeasureLink (ISO-TimeML addition) + ConfidenceLink
// ───────────────────────────────────────────────────────────────────────────

// --- 22. MeasureLinkRelTypeValue + ENUM_MEASURE_LINK_REL_TYPE (§13.1) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §13.1 — MLINK.relType (LREC 2010 §3.4 — MEASURE)
 * @metaclass enumeration
 * @definition Relation type for a Measure Link. ISO-TimeML's MeasureLink
 *   was introduced to capture the measure-of-an-interval semantics that
 *   TimeML's TLINK.SIMULTANEOUS conflated with positional anchoring
 *   (LREC 2010 §3.4 — "John taught for three hours on Tuesday" example,
 *   where SIMULTANEOUS over-commits to a contiguous-interval reading).
 *   The single literal MEASURE is currently defined; the enumeration is
 *   reserved for forward-compatible expansion if QUANTITY links are
 *   reified separately in a future ISO 24617-1 revision.
 * @literals MEASURE
 */
export type MeasureLinkRelTypeValue = 'MEASURE';

/** Frozen registry of every MLINK.relType literal — MEASURE only at v0.0.1. */
export const ENUM_MEASURE_LINK_REL_TYPE: ReadonlyArray<MeasureLinkRelTypeValue> =
  Object.freeze(['MEASURE'] as const);

// --- 23. IMeasureLink (§13) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §13 — MLINK tag (LREC 2010 §3.4 — Measuring Events)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition A MeasureLink (also: MLINK) records that a TIMEX3 of type
 *   DURATION is the measure µ(τ(e)) of the interval τ(e) of an Event,
 *   under the formal interpretation introduced in Bunt & Pustejovsky
 *   (2010). Distinguishes the measure of a temporal interval from the
 *   interval itself — a distinction TimeML 1.2.1 conflated under
 *   TLINK.SIMULTANEOUS. Reproduced here per the ISO-TimeML spec.
 * @ownedAttributes
 *   lid : String [1] — Link identifier, format `l<integer>`
 *   relType : MeasureLinkRelTypeValue [1] — fixed value MEASURE in v0.0.1
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   eventID : Event [1] — IDREF to the Event being measured
 *   relatedToTime : Time [1] — IDREF to the DURATION-typed TIMEX3 that
 *     measures the Event's interval
 *   signal : Signal [0..1] — IDREF to lexical Signal grounding the
 *     measure (e.g., "for" in "for three hours")
 * @constraints
 *   [lid_format]: lid.matches('l[0-9]+')
 *   [reltype_fixed]: relType = 'MEASURE'
 *   [event_required]: eventID->notEmpty()
 *   [time_required]: relatedToTime->notEmpty()
 *   [time_is_duration]: relatedToTime->referredAnnotation
 *     oclAsType(Time).timexType = 'DURATION'
 */
export interface IMeasureLink extends IAnnotation {
  readonly relType: MeasureLinkRelTypeValue;
  readonly eventID: string;
  readonly relatedToTime: string;
  readonly signalID: string | undefined;
}

/** Concrete extensible base — see IMeasureLink. */
export class MeasureLink extends Annotation implements IMeasureLink {
  constructor(
    id: string,
    public readonly eventID: string,
    public readonly relatedToTime: string,
    public readonly signalID: string | undefined = undefined,
    comment: string | undefined = undefined,
    anchorId: string | undefined = undefined,
    public readonly relType: MeasureLinkRelTypeValue = 'MEASURE',
  ) {
    super(id, comment, anchorId);
  }
}

// --- 24. IConfidenceLink (§14) ---
/**
 * @standard ISO 24617-1:2012 (confirmed 2023) — SemAF-Time / ISO-TimeML
 * @section §14 — CONFIDENCE tag (TimeML 1.2.1 §2.8)
 * @metaclass concrete
 * @generalization IAnnotation
 * @definition A ConfidenceLink assigns a numeric confidence value
 *   strictly between 0 and 1 (exclusive) to any other Annotation in
 *   the SemAF-Time graph — or, more narrowly, to a single attribute
 *   on that Annotation. Used to record inter-annotator confidence
 *   when a tag was disputed, partially reconciled, or assigned by an
 *   automatic system whose output is probability-weighted. Distinct
 *   from a TLink/SLink/ALink/MeasureLink: it does not relate two
 *   intervals — it qualifies one Annotation.
 * @ownedAttributes
 *   lid : String [1] — Link identifier, format `l<integer>`
 *   tagType : String [1] — name of the tag whose confidence is recorded
 *     (e.g., "EVENT", "TIMEX3", "TLINK")
 *   confidenceValue : Real [1] — confidence value, 0 < x < 1
 *   attributeName : String [0..1] — narrows the confidence to a single
 *     attribute of the referenced Annotation
 *   comment : String [0..1] — annotator note
 * @associationEnds
 *   tag : Annotation [1] — IDREF to the Annotation whose confidence is
 *     being recorded
 * @constraints
 *   [lid_format]: lid.matches('l[0-9]+')
 *   [tag_required]: tagId->notEmpty()
 *   [tagType_required]: tagType->notEmpty()
 *   [confidence_open_unit_interval]: confidenceValue > 0 and
 *     confidenceValue < 1
 */
export interface IConfidenceLink extends IAnnotation {
  readonly tagType: string;
  readonly tagId: string;
  readonly confidenceValue: number;
  readonly attributeName: string | undefined;
}

/** Concrete extensible base — see IConfidenceLink. */
export class ConfidenceLink extends Annotation implements IConfidenceLink {
  constructor(
    id: string,
    public readonly tagType: string,
    public readonly tagId: string,
    public readonly confidenceValue: number,
    public readonly attributeName: string | undefined = undefined,
    comment: string | undefined = undefined,
    anchorId: string | undefined = undefined,
  ) {
    super(id, comment, anchorId);
  }
}

// END-EXTRACTED-SEMAF-TIME
