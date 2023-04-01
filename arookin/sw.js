//Caching important resources
const CACHE_NAME = 'arookin-cache-v3.0';
const RUNTIME = 'runtime';
const urlsToCache = [
  '/',
  '/index.html',
  '/budget.html',
  '/calendar.html',
  '/login.html',
  '/assets/script/app.js',
  '/assets/script/budget.js',
  '/assets/script/calendar.js',
  '/assets/script/firebase.js',
  '/assets/script/script.js',
  '/assets/script/ui.js',
  '/assets/images/logo.png',
  '/assets/styles/ui.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css',
  'https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap'
];
//Offline fallback page
const FALLBACK_HTML_URL = '/404.html';

//Installing Service Worker
self.addEventListener('install', event => {
        event.waitUntil(
        Promise.all([
            // Cache resources here
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(urlsToCache)),
            
        ]).then(() => {
            self.skipWaiting();
        })
        
    );
    console.log('service worker installed');
});

//Listening to activate event
// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME, RUNTIME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
    
  });

//Notification
// Prompt user for notification permission
// self.registration.showNotification('Request Notification Permissions', {
//   body: 'We would like to send you notifications',
//   icon: 'assets/images/icons/logo-192x192.png',
//   requireInteraction: true,
//   actions: [
//       {
//           action: 'grant',
//           title: 'Grant permission',
//       },
//       {
//           action: 'deny',
//           title: 'Deny permission',
//       },
//   ],
// })
// self.addEventListener('notificationclick', event => {
//     event.notification.close();
//     if (event.action === 'grant') {
//         notification.requestPermission().then(permission => {
//             if (permission === 'granted') {
//                 // console.log('Notification permission granted');
//                 scheduleNotification();
//             }
//         });
//     } else if (event.action === 'deny') {
//         console.log('Notification permission denied');
//     } else {
//         event.waitUntil(
//             clients.openWindow('/index.html')
//         );
//     }
// });

//Listening to fetch requests
self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then(cache => {
            return fetch(event.request).then(response => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });

//   const NOTIFICATION_TITLE = 'Service Worker Notification';
// const NOTIFICATION_OPTIONS = {
//   body: 'This is a notification from your service worker!',
//   icon: '/path/to/icon.png',
// };

function scheduleNotification() {
  self.registration.showNotification('Remember your tasks', {
    body: 'You have some tasks to work on :)',
    icon: 'assets/images/task-192x192.png' 
});
  setTimeout(scheduleNotification, 5 * 60 * 60 * 1000); // schedule next notification in 5 hours
}

// self.addEventListener('notificationclick', event => {
//     event.notification.close();
//     if (event.action === 'grant') {
//         notification.requestPermission().then(permission => {
//             if (permission === 'granted') {
//                 console.log('Notification permission granted');
//                 setInterval(() => {
                    
//                 }, 10000);
//             }
//         });
//     } else if (event.action === 'deny') {
//         console.log('Notification permission denied');
//     } else {
//         event.waitUntil(
//             clients.openWindow('/index.html')
//         );
//     }
// });


