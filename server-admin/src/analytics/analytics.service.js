import Analytics from './analytics.model.js';

export const createAnalyticsRecord = async ({ analyticsData }) => {
    const data = { ...analyticsData };
    const analytics = new Analytics(data);
    await analytics.save();
    return analytics;
};

export const fetchAnalytics = async ({
    page = 1,
    limit = 10,
    isActive = true,
    type
}) => {
    const filter = { isActive };
    if (type) filter.type = type; 

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const analyticsRecords = await Analytics.find(filter)
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Analytics.countDocuments(filter);

    return {
        analyticsRecords,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const updateAnalyticsRecord = async (id, updateData) => {
    return await Analytics.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
    });
};

export const deleteAnalyticsRecord = async (id) => {
    return await Analytics.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

export const restoreAnalyticsRecord = async (id) => {
    return await Analytics.findByIdAndUpdate(id, { isActive: true }, { new: true });
};