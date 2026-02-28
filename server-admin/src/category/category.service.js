import Category from './category.model.js';

export const createCategoryRecord = async ({ categoryData}) => {
    const data = { ...categoryData };

    const Category = new Category(data);
    await Category.save();
    return Category;
};

export const fetchCategorys = async ({
    page = 1,
    limit = 10,
    isActive = true,
}) => {
    const filter = { isActive };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const category = await Category.find(filter)
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Category.countDocuments(filter);

    return {
        category,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const deleteCategory = async (id) => {
    return await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

export const restoreCategory = async (id) => {
    return await Category.findByIdAndUpdate(id, { isActive: true }, { new: true });
};