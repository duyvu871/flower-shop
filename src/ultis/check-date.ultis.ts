const getCurrentTimeOfDay = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return {
            message: 'Buổi sáng',
            type: 'morning'
        };
    } else if (currentHour >= 12 && currentHour < 18) {
        return {
            message: 'Buổi chiều',
            type: 'afternoon'
        };
    } else if (currentHour >= 18 && currentHour < 24) {
        return {
            message: 'Buổi tối',
            type: 'evening'
        };
    } else {
        return {
            message: 'Buổi tối',
            type: 'evening'
        };
    }
};

export type responseTimeOfDay = ReturnType<typeof getCurrentTimeOfDay>;

export {getCurrentTimeOfDay};