import Restaurant from './restaurant.model.js';

export const createRestaurantRecord = async ({ restaurantData, file }) => {
    const data = { ...restaurantData };

    if (file) {
        const filename = file.filename;
        const match = filename.match(/Restaurante_ICE\/Restaurants\/Ubications\/.+$/);
        data.photo = match ? match[0] : filename;
    } else {
        data.photo = 'restaurants/default_restaurant_image';
    }

    const restaurant = new Restaurant(data);
    await restaurant.save();
    return restaurant;
};

export const fetchRestaurants = async ({
    page = 1,
    limit = 10,
    isActive = true,
}) => {
    const filter = { isActive };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const restaurants = await Restaurant.find(filter)
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Restaurant.countDocuments(filter);

    return {
        restaurants,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};