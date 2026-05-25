// Ambient declarations for non-code asset imports.
//
// CSS files are bundled by Next.js at build time and carry no TypeScript types.
// TypeScript 6 requires a module declaration for side-effect imports of such
// assets (error TS2882); without this, `import '@/styles/globals.css'` and
// similar bare imports fail to typecheck. This declares those modules so the
// imports resolve, without relaxing any strictness for actual TypeScript code.
declare module '*.css';
