const DBConfigs = {
    URL: process.env.MONGO_URL,
    menu: {
        morning: "morning",
        afternoon: "afternoon",
        evening: "evening",
        night: "night"
    },
    perPage: 10
}
export default DBConfigs;