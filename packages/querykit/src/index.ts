export const queryKitVersion = "0.0.2-alpha.0";

export type QueryIR = unknown;

export {
  JsonValueSchema,
  parseQuerySpec,
  QueryFilterOperatorSchema,
  QueryFilterSchema,
  QueryOrderBySchema,
  QuerySortDirectionSchema,
  QuerySpecSchema,
  QueryVersionSchema,
  safeParseQuerySpec,
} from "./query.js";
export type {
  JsonValue,
  QueryFilter,
  QueryFilterOperator,
  QueryOrderBy,
  QuerySortDirection,
  QuerySpec,
} from "./query.js";

export {
  AdapterMetaSchema,
  AggregationSchema,
  ExposureModeSchema,
  FieldDefaultsSchema,
  FieldPolicySchema,
  FieldTypeSchema,
  parsePhysicalRegistry,
  parseRegistryDefaults,
  parseRegistryPolicy,
  parseResolvedRegistry,
  PhysicalFieldSchema,
  PhysicalRegistrySchema,
  PhysicalRelationSchema,
  PhysicalSourceKindSchema,
  PhysicalSourceSchema,
  RegistryDefaultsSchema,
  RegistryPolicySchema,
  RegistryVersionSchema,
  RelationDefaultsSchema,
  RelationKindSchema,
  RelationPolicySchema,
  ResolvedFieldSchema,
  ResolvedRegistrySchema,
  ResolvedRelationSchema,
  ResolvedSourceSchema,
  safeParsePhysicalRegistry,
  safeParseRegistryDefaults,
  safeParseRegistryPolicy,
  safeParseResolvedRegistry,
  SourceDefaultsSchema,
  SourcePolicySchema,
} from "./registry.js";
export type {
  Aggregation,
  FieldPolicy,
  FieldType,
  PhysicalRegistryLike,
  PhysicalField,
  PhysicalRegistry,
  PhysicalRelation,
  PhysicalSource,
  PhysicalSourceLike,
  Policy,
  PolicySource,
  RegistryDefaults,
  RegistryPolicy,
  RelationPolicy,
  ResolvedField,
  ResolvedRegistry,
  ResolvedRelation,
  ResolvedSource,
  SourcePolicy,
} from "./registry.js";

export {
  RegistryParseError,
  RegistryResolutionError,
  RegistryResolutionIssueSchema,
  resolveRegistry,
  resolveRegistryEffect,
  resolveRegistryPromise,
} from "./resolve-registry.js";
export type {
  RegistryResolutionIssue,
  ResolveRegistryError,
  ResolveRegistryInput,
} from "./resolve-registry.js";
