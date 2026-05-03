# @amlhubs/semaf-time — ISO 24617-1:2012 SemAF-Time as a Typed Metamodel

## Identity

| Field | Value |
|---|---|
| Standard | ISO 24617-1:2012 — Language resource management — Semantic annotation framework — Part 1: Time and events (SemAF-Time, ISO-TimeML) |
| ISO Reference | [ISO 24617-1:2012](https://www.iso.org/standard/37331.html) |
| Edition | 1st edition 2012-01, **confirmed 2023** |
| Authority | [ISO/TC 37 — Language and terminology](https://www.iso.org/committee/48104.html), Subcommittee SC 4 — Language resource management |
| De-facto sibling | [TimeML 1.2.1 academic specification](https://timeml.github.io/site/publications/timeMLdocs/timeml_1.2.1.pdf) — academically-developed predecessor; ISO-TimeML is the standardised re-codification |
| npm Package | `@amlhubs/semaf-time` |
| npm Version | `0.0.1` |
| Peer Dependencies | `@amlhubs/uml ^0.0.2`, `@amlhubs/mof ^0.0.1`, `@amlhubs/nif ^0.0.1` |
| License | MIT |

## Abstract

ISO 24617-1:2012 (SemAF-Time, also called **ISO-TimeML**) is the international standard for the semantic annotation of time and events in natural-language text. It is Part 1 of the multi-part **Semantic Annotation Framework (SemAF)** maintained by ISO/TC 37/SC 4. The standard codifies the academic **TimeML 1.2.1** specification — the fruit of the TERQAS / TANGO / ARDA workshops chaired by James Pustejovsky — into an ISO-grade interoperable format suitable for cross-corpus, cross-tool temporal-annotation interchange. The annotation surface defines **events** (occurrences in time), **temporal expressions** (TIMEX3 — calendar dates, durations, frequencies normalised to ISO 8601), **temporal signals** (lexical anchors such as *before*, *during*, *while*), **temporal links (TLink)** typed by the thirteen relations of **Allen's interval algebra**, **subordinating links (SLink)** that capture modal/factive/evidential subordination between events, and **aspectual links (ALink)** that capture aspectual modification (initiation, continuation, culmination, termination, reinitiation).

The `@amlhubs/semaf-time` npm package re-projects the SemAF-Time metaclass surface as **extensible TypeScript interfaces and base classes**. Every concept declared in ISO 24617-1:2012 is surfaced as a metaclass with a JSDoc header citing the precise §-section of the spec, the concept's parent in the UML metaclass hierarchy, the owned attributes, the association ends to other SemAF-Time concepts, the operations declared in the spec, and the constraints reproduced verbatim from the spec text. Anchoring of every annotation to its source text span is realised through the standard `nif:beginIndex` / `nif:endIndex` Properties of `@amlhubs/nif` (NLP Interchange Format 2.0), and cross-references between SemAF-Time concepts are realised through Associations whose member-ends carry the typed referents (`Event`, `Time`, `Signal`, …). The package is **pure SemAF-Time**: it contains no SemAF Part 2 (Dialogue Acts), no SemAF Part 4 (Semantic Roles), no SemAF Part 7/14 (Spatial / ISOspace), no SemAF Part 8 (Discourse Relations), no SemAF Part 9 (Reference Annotation Framework). Each of those parts is — or will be — its own sibling `@amlhubs/semaf-*` package.

## Business Value — Why Extending This Metamodel Pays Off

Adopting SemAF-Time through a typed package produces an immediate **temporal-reasoning interoperability dividend**. Every temporal-annotation tool in the academic and industrial NLP ecosystem — [HeidelTime](https://heideltime.github.io/heideltime/) (the leading rule-based TIMEX3 tagger), [SUTime](https://nlp.stanford.edu/software/sutime.shtml) (Stanford's library, also TIMEX3-shaped), [CAEVO](https://github.com/nchambers/caevo) (the Cascading Event-time Ordering system), [TARSQI](http://www.timeml.org/site/tarsqi/index.html), [JulieTime](https://www.julielab.de/Resources/Software/) — produces standoff annotations conformant with the TimeML / ISO-TimeML schema. A temporal annotation expressed against the metaclasses `@amlhubs/semaf-time` exports is, by construction, portable to every one of those tools without a custom converter. Ventures that would otherwise spend quarters re-modelling Event/TIMEX3/TLink for each acquired corpus or each new compliance regime amortize that engineering cost to zero.

ISO standardisation — confirmed in 2023 — turns internal temporal-annotation decisions into **regulator-recognized artifacts**. ISO 24617-1:2012 is cited in clinical-trial timeline-extraction frameworks (the i2b2 Temporal Reasoning Challenge, n2c2 / 2012 i2b2 Temporal Relations corpus), in financial-narrative timeline reconstruction frameworks (banking compliance reporting), and in legal-discovery timeline frameworks (where the temporal ordering of email events is itself the discovery artefact). A regulated ageni venture — a healthtech platform extracting medication-event timelines from clinical notes, a finhub platform reconstructing transaction timelines from narrative disclosures, a legalhub platform ordering communication events for discovery — presents the same surface to an auditor without translating internal jargon into standards language.

The second business lever is **agentic runtime leverage**. Ageni's Probabilistic Reduction Engine consumes the SemAF-Time metamodel as the deterministic substrate over which large-language-model temporal reasoning operates. When an agent writes source code against `IEvent`, `ITime`, `ITLink`, the TypeScript compiler evaluates whether the proposed temporal annotation is a well-formed SemAF-Time annotation at the same moment the compiler evaluates whether the code itself is well-formed — the two correctness checks collapse into one `tsc` pass. Structural hallucinations that would otherwise slip past a natural-language review (inventing an EventClass not in the spec, mistyping an Allen relation, forgetting that a TLink requires either two relatedToEventInstances or one event+time pair) are caught at compile time, and every surviving interface reference traces to a §-section of the specification through the JSDoc header. The agent's reasoning surface is reduced from the open set of possible English sentences about time to the closed set of typed SemAF-Time metaclass compositions over the thirteen Allen relations.

The third lever is **compounding reuse across the SemAF series**. SemAF-Time is the foundational part of ISO 24617 — every other part of the SemAF series depends on its event-and-time substrate. SemAF-2 (Dialogue Acts) timestamps each functional segment with a SemAF-Time `Time`; SemAF-4 (Semantic Roles) anchors arguments to the temporal frame the predicate event occupies; SemAF-7/14 (ISOspace) shares the very same `Signal` and Allen-style spatio-temporal relation pattern; SemAF-8 (Discourse Relations) consumes Event ordering to compute Cause/Result/Background relations; SemAF-9 (RAF) anchors anaphoric reference chains across timeline-ordered events. Every downstream `@amlhubs/semaf-*` package consumes these same SemAF-Time metaclasses through their transitively-dependent packages. The engineering investment that produced `@amlhubs/semaf-time` is not charged to any single venture; it is amortized over every SemAF sibling and every ageni venture that ever extends it.

The fourth lever is **composability across the AML metamodel stack**. SemAF-Time alone is a vocabulary; SemAF-Time plus NIF is an offset-anchored vocabulary; SemAF-Time plus NIF plus LMF (Lexical Markup Framework) is a vocabulary that resolves event-triggering verbs to lexical entries; SemAF-Time plus NIF plus OWL Time (the optional W3C ontology of time) is a vocabulary that interoperates with the broader semantic-web temporal-reasoning stack. Owning all of these typed packages under one coherent registry gives the ageni platform one unified temporal-annotation surface rather than five loosely-coupled specifications.

## Scope — What the Package Surfaces

The package exports the SemAF-Time metaclass surface as defined by ISO 24617-1:2012 and the academic TimeML 1.2.1 it codifies. The complete enumeration lives in [`src/semaf-time.ts`](./src/semaf-time.ts); the table below summarises the groups and cites the authoritative section.

| Group | §Section | Metaclasses Surfaced |
|---|---|---|
| Annotation root | §6 | `IAnnotation`, `IAnchor` (offset-anchored to source span via NIF) |
| Events | §7 | `IEvent`, `IEventInstance`, `IMakeInstance`, `EventClass` enum-of-Forms (Reporting, Perception, Aspectual, I-Action, I-State, State, Occurrence) |
| Temporal expressions | §8 | `ITime` (TIMEX3), `TimexType` enum-of-Forms (Date, Time, Duration, Set), `TimexValue` (ISO 8601 normalized), `TimexMod` (modifier: Before, After, OnOrBefore, OnOrAfter, LessThan, MoreThan, EqualOrLess, EqualOrMore, Approx, Mid, Start, End) |
| Temporal signals | §9 | `ISignal` (lexical anchor for temporal relations) |
| Temporal links | §10 | `ITLink`, `TLinkRelType` enum-of-Forms (Allen interval algebra: Before, After, Includes, IsIncluded, During, DuringInv, Simultaneous, IAfter, IBefore, Identity, Begins, Ends, BegunBy, EndedBy) |
| Subordinating links | §11 | `ISLink`, `SLinkRelType` enum-of-Forms (Modal, Evidential, Negative-Evidential, Factive, Counter-Factive, Conditional) |
| Aspectual links | §12 | `IALink`, `ALinkRelType` enum-of-Forms (Initiates, Culminates, Terminates, Continues, Reinitiates) |
| Measure links | §13 | `IMeasureLink` (links Event/Time to a quantitative duration measure) |
| Confidence annotations | §14 | `IConfidenceLink` (annotation of inter-annotator confidence on a Link) |

Every interface is accompanied by an extensible base class with the same name minus the `I` prefix (e.g., `Event`, `Time`, `TLink`). The full list and the JSDoc headers citing each §-section live at [`src/semaf-time.ts`](./src/semaf-time.ts).

## Dependency Topology

`@amlhubs/semaf-time` depends transitively on the OMG UML 2.5.1 substrate and on the W3C-area NIF 2.0 anchoring substrate. It does not depend on any other SemAF part.

```
@amlhubs/uml          (root — OMG UML 2.5.1 metaclasses)
   ▲
   │ peerDependency
   ├── @amlhubs/mof   (reflective machinery over UML)
   │
   └── @amlhubs/nif   (NLP Interchange Format 2.0 — offset-anchored URI scheme)
              ▲
              │ peerDependency
              └── @amlhubs/semaf-time   (this package — temporal annotation)
```

The edges are load-bearing. `@amlhubs/semaf-time` imports `IClass`, `IProperty`, `IAssociation`, `IEnumeration`, `IEnumerationLiteral`, `IDirectedRelationship` from `@amlhubs/uml` to ground every SemAF-Time metaclass in the UML substrate. It imports the offset-anchoring shape from `@amlhubs/nif` so that every `Annotation` carries a `nif:beginIndex` / `nif:endIndex` pair pointing into the source `Context`. Optional integration with [W3C OWL Time](https://www.w3.org/TR/owl-time/) is left to a sibling `@amlhubs/owl-time` package (forthcoming).

## Installation & Usage

```bash
npm install @amlhubs/semaf-time
```

```typescript
import type {
  IEvent,
  ITime,
  ITLink,
  EventClassValue,
  TLinkRelTypeValue,
} from '@amlhubs/semaf-time';

// Declare an Event mention as a typed metamodel instance.
const eventVisited: IEvent = {
  elementId: 'SEMAF_Event_visited_001',
  name: 'visited',
  beginIndex: 42,
  endIndex: 49,
  eventClass: 'Occurrence' as EventClassValue,
  // ... remaining ownedAttribute / association memberEnds
};
```

The source artifact is [`src/semaf-time.ts`](./src/semaf-time.ts). Every interface JSDoc header declares `@standard ISO 24617-1:2012 (confirmed 2023)` and a `@section §x.y` reference.

## Provenance & Formal References

- [ISO 24617-1:2012 — Language resource management — Semantic annotation framework — Part 1: Time and events](https://www.iso.org/standard/37331.html)
- [ISO/TC 37 — Language and terminology](https://www.iso.org/committee/48104.html), Subcommittee SC 4 — Language resource management
- [TimeML 1.2.1 academic specification (Pustejovsky et al., TERQAS/TANGO/ARDA workshops)](https://timeml.github.io/site/publications/timeMLdocs/timeml_1.2.1.pdf)
- [TIMEX3 schema and tag set (TimeML.org)](http://www.timeml.org/timeMLdocs/TimeMLdocs.html)
- [Allen J. F. — Maintaining knowledge about temporal intervals — Communications of the ACM 26(11):832-843 (1983)](https://dl.acm.org/doi/10.1145/182.358434)
- [W3C OWL Time — Time Ontology in OWL](https://www.w3.org/TR/owl-time/) (optional sibling integration)
- [ISO 8601-1:2019 — Date and time representations — Part 1: Basic rules](https://www.iso.org/standard/70907.html) (TIMEX3 normalisation target)
- [Pustejovsky J., et al. — ISO-TimeML: An International Standard for Semantic Annotation — LREC 2010](http://www.lrec-conf.org/proceedings/lrec2010/pdf/55_Paper.pdf)

## Version History

| Version | Date | Change Summary |
|---|---|---|
| 0.0.1 | 2026-05-03 | Initial publish — full ISO 24617-1:2012 (confirmed 2023) SemAF-Time surface: Event, Time (TIMEX3), Signal, TLink (Allen interval algebra), SLink, ALink, MakeInstance, MeasureLink, ConfidenceLink. NIF 2.0 anchoring. |

## License

MIT — see [LICENSE](./LICENSE).
