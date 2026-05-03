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

// (intentionally empty — implementer waves INSERT here, never rewrite)

// END-EXTRACTED-SEMAF-TIME
