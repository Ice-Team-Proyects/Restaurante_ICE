import Table from './table.model.js';

export const createTableRecord = async ({ tableData }) => {
    const table = new Table(tableData);
    await table.save();
    return table;
};

export const fetchTables = async ({
    page = 1,
    limit = 50,
    // isActive may be true, false, or undefined (when undefined we do not filter by activity)
    isActive,
    restaurant
}) => {
    const filter = {};
    if (restaurant) {
        filter.restaurant = restaurant;
    }
    if (typeof isActive !== 'undefined') {
        // accept string values from query param
        if (typeof isActive === 'string') {
            if (isActive === 'true') filter.isActive = true;
            else if (isActive === 'false') filter.isActive = false;
            // any other string leaves filter empty (e.g. 'all')
        } else {
            filter.isActive = isActive;
        }
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const tables = await Table.find(filter)
        .populate('restaurant')
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Table.countDocuments(filter);

    return {
        tables,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

// busca una mesa por su id
export const fetchTableById = async ({ id }) => {
    const table = await Table.findById(id).populate('restaurant');
    if (!table) {
        const err = new Error('Mesa no encontrada');
        err.status = 404;
        throw err;
    }
    return table;
};

// actualiza un registro de mesa y devuelve el documento actualizado
export const updateTableRecord = async ({ id, updateData }) => {
    const table = await Table.findByIdAndUpdate(id, updateData, { new: true });
    if (!table) {
        const err = new Error('Mesa no encontrada');
        err.status = 404;
        throw err;
    }
    return table;
};

// "soft delete" estableciendo isActive = false
export const softDeleteTable = async ({ id }) => {
    const table = await Table.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!table) {
        const err = new Error('Mesa no encontrada');
        err.status = 404;
        throw err;
    }
    return table;
};
 // \"restore\" (undo soft delete) estableciendo isActive = true
export const restoreTable = async ({ id }) => {
    const table = await Table.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!table) {
        const err = new Error('Mesa no encontrada');
        err.status = 404;
        throw err;
    }
    return table;
};