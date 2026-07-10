import https from 'https';

const urls = [
    "https://res.cloudinary.com/dss7fs6pl/image/upload/Restaurante_ICE/Products/default_product_image.png",
    "https://res.cloudinary.com/dss7fs6pl/image/upload/Restaurante_ICE/restaurants/default_restaurant_image.jpg"
];

function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve({ url, status: res.statusCode });
        }).on('error', (err) => {
            resolve({ url, status: 'ERROR', error: err.message });
        });
    });
}

async function main() {
    for (const url of urls) {
        const res = await checkUrl(url);
        console.log(`URL: ${res.url}\nSTATUS: ${res.status}\n`);
    }
}

main();
