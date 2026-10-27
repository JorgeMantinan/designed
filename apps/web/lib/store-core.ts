import { parseDesignSpec } from '@designed/schema';
import type { DesignSpec } from '@designed/schema';

/**
 * Builder state core: spec + undo/redo history + selection, as a pure
 * reducer (no JSX — importable from tests and from the React provider).
 *
 * Every mutation goes through `update`, which clones the spec, runs the
 * mutation and RE-VALIDATES with parseDesignSpec — a bug in the UI can never
 * corrupt the stored design (invalid mutations are rejected silently).
 */

export type Selection =
  | { kind: 'global' }
  | { kind: 'header' }
  | { kind: 'footer' }
  | { kind: 'section'; id: string }
  | { kind: 'row'; sectionId: string; id: string }
  | { kind: 'column'; sectionId: string; id: string }
  | { kind: 'component'; sectionId: string; id: string };

export interface BuilderState {
  spec: DesignSpec;
  past: DesignSpec[];
  future: DesignSpec[];
  selection: Selection;
  /** Bumped to replay entrance animations in the preview. */
  previewKey: number;
}

export type BuilderAction =
  | { type: 'load'; spec: DesignSpec }
  | { type: 'update'; mutate: (draft: DesignSpec) => void }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'select'; selection: Selection }
  | { type: 'replay' };

const HISTORY_LIMIT = 60;

export function createInitialState(spec: DesignSpec): BuilderState {
  return { spec, past: [], future: [], selection: { kind: 'global' }, previewKey: 0 };
}

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'load':
      return createInitialState(action.spec);

    case 'update': {
      const draft = structuredClone(state.spec);
      action.mutate(draft);
      const parsed = parseDesignSpec(draft);
      // Reject invalid mutations instead of corrupting the design.
      if (!parsed.success) return state;
      return {
        ...state,
        spec: parsed.data,
        past: [...state.past.slice(-(HISTORY_LIMIT - 1)), state.spec],
        future: [],
      };
    }

    case 'undo': {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      return {
        ...state,
        spec: previous,
        past: state.past.slice(0, -1),
        future: [state.spec, ...state.future].slice(0, HISTORY_LIMIT),
      };
    }

    case 'redo': {
      const next = state.future[0];
      if (!next) return state;
      return {
        ...state,
        spec: next,
        past: [...state.past.slice(-(HISTORY_LIMIT - 1)), state.spec],
        future: state.future.slice(1),
      };
    }

    case 'select':
      return { ...state, selection: action.selection };

    case 'replay':
      return { ...state, previewKey: state.previewKey + 1 };

    default:
      return state;
  }
}
