module.exports = {
	apps: [
		{
			name: 'app1',
			script: 'set DEV_HOSTNAME=14.225.218.92&&set PORT=3000&&node server.js',
			watch: '.',
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
};
