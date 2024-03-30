module.exports = {
    apps : [{
        name   : "app1",
        script : "set DEV_HOSTNAME=192.168.103.52&&set PORT=2000&&npx next start",
        watch: ".",
        env_production: {
            NODE_ENV: "production"
        },
    }],
}