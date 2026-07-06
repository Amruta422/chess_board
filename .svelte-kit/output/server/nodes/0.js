

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Dy78mqOf.js","_app/immutable/chunks/GlWvgSC9.js","_app/immutable/chunks/BIXlrTPz.js","_app/immutable/chunks/BuEjMw5w.js"];
export const stylesheets = [];
export const fonts = [];
