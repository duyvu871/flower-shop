const getCurrentTimeOfDay = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 0 && currentHour < 9) {
        return {
            message: 'Buổi sáng',
            type: 'morning',
            currentHour
        };
    } else if (currentHour >= 9 && currentHour < 15) {
        return {
            message: 'Buổi chiều',
            type: 'afternoon',
            currentHour
        };
    } else if (currentHour >= 15 && currentHour < 19) {
        return {
            message: 'Buổi tối',
            type: 'evening',
            currentHour
        };
    } else {
        return {
            message: 'Buổi tối',
            type: 'evening',
            currentHour,
        };
    }
};

export type responseTimeOfDay = ReturnType<typeof getCurrentTimeOfDay>;

export {getCurrentTimeOfDay};