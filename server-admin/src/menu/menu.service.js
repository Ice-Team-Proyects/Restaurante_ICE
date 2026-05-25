import Menu from './menu.model.js';

export const fetchMenus = async ({ page = 1, limit = 10, isActive = true }) => {
    const filter = { isActive };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const menus = await Menu.find(filter)
        .populate({
            path: 'products',
            select: 'saucer description price photo category isActive',
            populate: { path: 'category', select: 'categoryName type' },
        })
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Menu.countDocuments(filter);

    return {
        menus,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const createMenu = async ({ name, description, products = [] }) => {
    const menu = new Menu({ name, description, products });
    await menu.save();
    return menu.populate({
        path: 'products',
        select: 'saucer description price photo category isActive',
        populate: { path: 'category', select: 'categoryName type' },
    });
};

export const updateMenu = async (id, { name, description, products }) => {
    const data = {};
    if (name        !== undefined) data.name        = name;
    if (description !== undefined) data.description = description;
    if (products    !== undefined) data.products    = products;

    const menu = await Menu.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate({
            path: 'products',
            select: 'saucer description price photo category isActive',
            populate: { path: 'category', select: 'categoryName type' },
        });
    return menu;
};

export const deleteMenu = async (id) =>
    Menu.findByIdAndUpdate(id, { isActive: false }, { new: true });

export const restoreMenu = async (id) =>
    Menu.findByIdAndUpdate(id, { isActive: true }, { new: true });