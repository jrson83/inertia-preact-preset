export default definePreset({
	name: 'inertia-preact-preset',
	options: {
		// ...
	},
	handler: async() => {
		await extractTemplates()
		// ...
	},
})
