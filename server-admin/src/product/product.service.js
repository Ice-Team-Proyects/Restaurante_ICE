import Product from './product.model.js';

export const createProductRecord = async ({ productData, file}) => {
    const data = { ...productData };

    if (file) {
        const filename = file.filename;
        const match = filename.match(/Products\/.+$/);
        data.photo = match ? match[0] : filename;
    } else {
        data.photo = 'Products/default_product_image.png';
    }

    const product = new Product(data);
    await product.save();
    return product;
};

export const fetchProducts = async ({
    page = 1,
    limit = 10,
    isActive = true,
}) => {
    const filter = { isActive };
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const products = await Product.find(filter)
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    return {
        products,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};

export const deleteProduct = async (id) => {
    return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

export const restoreProduct = async (id) => {
    return await Product.findByIdAndUpdate(id, { isActive: true }, { new: true });
};