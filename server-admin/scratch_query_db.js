import mongoose from 'mongoose';

const URI_MONGODB = "mongodb://localhost:27017/restICE";

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', ProductSchema, 'products');

const RestaurantSchema = new mongoose.Schema({}, { strict: false });
const Restaurant = mongoose.model('Restaurant', RestaurantSchema, 'restaurants');

async function main() {
    await mongoose.connect(URI_MONGODB);
    console.log("Connected to MongoDB.");
    
    const products = await Product.find({});
    console.log("\n--- PRODUCTS ---");
    products.forEach(p => {
        console.log(`ID: ${p._id}, Saucer: ${p.saucer}, Photo: ${p.photo}, IsActive: ${p.isActive}`);
    });
    
    const restaurants = await Restaurant.find({});
    console.log("\n--- RESTAURANTS ---");
    restaurants.forEach(r => {
        console.log(`ID: ${r._id}, Name: ${r.name}, Photo: ${r.photo}, IsActive: ${r.isActive}`);
    });
    
    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
