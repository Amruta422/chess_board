import * as server from '../entries/pages/_page.server.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/2.Dau2MrDG.js","_app/immutable/chunks/GlWvgSC9.js","_app/immutable/chunks/BIXlrTPz.js","_app/immutable/chunks/JxIpVero.js","_app/immutable/chunks/CVt2LnFA.js","_app/immutable/chunks/BuEjMw5w.js"];
export const stylesheets = ["_app/immutable/assets/2.SC9qgQ7B.css"];
export const fonts = [];
