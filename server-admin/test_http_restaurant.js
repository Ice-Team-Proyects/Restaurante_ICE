import https from 'https';

const url = "https://res.cloudinary.com/dss7fs6pl/image/upload/Restaurante_ICE/Ubications/exterior-198ba053.jpg";

const req = https.get(url, (res) => {
    console.log(`STATUS CODE: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
    process.exit(0);
});

req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
});

req.setTimeout(5000, () => {
    console.error("TIMEOUT!");
    req.destroy();
    process.exit(1);
});
