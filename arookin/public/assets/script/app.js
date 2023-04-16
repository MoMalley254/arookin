//Check if browser supports Service Workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js') //Register Service Worker
    .then((reg) => console.log('Service Worker Registered Successfully'))
    .catch((err) => console.log('Service Worker registration failed', err));
};