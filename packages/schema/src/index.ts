/**
 * @designed/schema — DesignSpec: the single source of truth of a design.
 *
 * Import the schemas for validation and `parseDesignSpec` as the entry point
 * (it validates shape via Zod AND global id uniqueness).
 */

export * from './common';
export * from './animation';
export * from './overlay';
export * from './background';
export * from './tokens';
export * from './components';
export * from './layout';
export * from './navigation';
export * from './design-spec';
