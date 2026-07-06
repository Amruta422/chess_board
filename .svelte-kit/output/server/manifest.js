export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BUfLIuVK.js",app:"_app/immutable/entry/app.r-mAV7xg.js",imports:["_app/immutable/entry/start.BUfLIuVK.js","_app/immutable/chunks/ByL3dd3y.js","_app/immutable/chunks/BIXlrTPz.js","_app/immutable/chunks/CnFhb7AW.js","_app/immutable/entry/app.r-mAV7xg.js","_app/immutable/chunks/BIXlrTPz.js","_app/immutable/chunks/JxIpVero.js","_app/immutable/chunks/GlWvgSC9.js","_app/immutable/chunks/CnFhb7AW.js","_app/immutable/chunks/CVt2LnFA.js","_app/immutable/chunks/BuEjMw5w.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
