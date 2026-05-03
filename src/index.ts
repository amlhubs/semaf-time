// @amlhubs/semaf-time — ISO 24617-1:2012 SemAF-Time / ISO-TimeML
//
// Public re-export surface. Concrete classes, interface contracts, enum
// value-types, and frozen enum literal arrays are re-exported from
// semaf-time.ts so consumers can import either the extensible base class
// or the structural contract directly:
//
//   import { Event, Time, TLink, ENUM_TLINK_REL_TYPE } from '@amlhubs/semaf-time';
//   import type { IEvent, ITime, ITLink, TLinkRelTypeValue } from '@amlhubs/semaf-time';

// ─── Concrete extensible base classes ──────────────────────────────────────
export {
  Range,
  Anchor,
  Annotation,
  Event,
  MakeInstance,
  Time,
  Signal,
  TLink,
  SLink,
  ALink,
  MeasureLink,
  ConfidenceLink,
} from './semaf-time.js'

// ─── Frozen enum literal registries (runtime values) ───────────────────────
export {
  ENUM_EVENT_CLASS,
  ENUM_POS,
  ENUM_TENSE,
  ENUM_ASPECT,
  ENUM_POLARITY,
  ENUM_TIMEX_TYPE,
  ENUM_TIMEX_MOD,
  ENUM_FID,
  ENUM_TLINK_REL_TYPE,
  ENUM_SLINK_REL_TYPE,
  ENUM_ALINK_REL_TYPE,
  ENUM_MEASURE_LINK_REL_TYPE,
} from './semaf-time.js'

// ─── Interface type re-exports (extendable contracts) ──────────────────────
export type {
  IRange,
  IAnchor,
  IAnnotation,
  IEvent,
  IMakeInstance,
  ITime,
  ISignal,
  ITLink,
  ISLink,
  IALink,
  IMeasureLink,
  IConfidenceLink,
} from './semaf-time.js'

// ─── Enum value-type re-exports (closed string-union types) ────────────────
export type {
  EventClassValue,
  PosValue,
  TenseValue,
  AspectValue,
  PolarityValue,
  TimexTypeValue,
  TimexModValue,
  FunctionInDocumentValue,
  TLinkRelTypeValue,
  SLinkRelTypeValue,
  ALinkRelTypeValue,
  MeasureLinkRelTypeValue,
} from './semaf-time.js'
