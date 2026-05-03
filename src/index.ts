// @amlhubs/semaf-time — ISO 24617-1:2012 SemAF-Time / ISO-TimeML
//
// Public re-export surface. Concrete classes and interface types are
// re-exported from semaf-time.ts so consumers can import either the
// extensible base class or the structural contract directly:
//
//   import { Event, Time, TLink } from '@amlhubs/semaf-time';
//   import type { IEvent, ITime, ITLink } from '@amlhubs/semaf-time';
//
// Implementer waves populate this re-export block as new metaclasses are
// landed in semaf-time.ts. Until the first wave commits, the re-export
// list is intentionally empty — keeping it commented avoids tsc errors on
// missing exports while the root file is still being filled.

export {} from './semaf-time.js'
