// Ambient declarations for style side-effect imports (Next resolves the real
// files through its loaders; TypeScript only needs to know they exist).

declare module '*.css';
declare module '*.scss';

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}
