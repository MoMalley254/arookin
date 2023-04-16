//Caching important resources
const CACHE_NAME = 'arookin-cache-v10.0';
const RUNTIME = 'runtime';
const urlsToCache = [
  '/',
  '/index.html',
  '/budget.html',
  '/calendar.html',
  '/login.html',
  '/use.html',
  '/assets/script/app.js',
  '/assets/script/budget.js',
  '/assets/script/calendar.js',
  '/assets/script/firebase.js',
  '/assets/script/script.js',
  '/assets/script/ui.js',
  '/assets/images/logo.png',
  '/assets/styles/ui.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.es.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.debug.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css',
  'https://fonts.googleapis.com/css2?family=Josefin+Sans'
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


// //NOTIFICATIONS
// self.addEventListener("message", (event) => {
//   event.waitUntil(
//     importScripts('/assets/script/script.js').then(
//       console.log('Scripts loaded first')
//       if (event.data.type === 'notification-interval') {
//         const interval = event.data.interval;
//         // console.log(interval)
//         // set up notification interval here
//         setInterval(() => {
//           self.registration.showNotification("Task Notification", {
//             body: "You have a task to complete.",
//             icon: '/assets/images/icons/logo-192x192.png',
//             data: { url: "/calendar.html" },
//           });
//         }, interval * 60 * 60 * 1000); // convert hours to milliseconds
//       }
//     )
//   )
  
// });

// //Check whether notification will show

// const now = Date.now();
// const nextNotification = now + interval * 60 * 60 * 1000;

// self.registration.getNotifications().then(notifications => {
//   const nextNotification = notifications.find(notification => {
//     return notification.timestamp >= nextNotification;
//   });
//   if (nextNotification) {
//     console.log('Notification scheduled for:', new Date(nextNotification.timestamp));
//   } else {
//     console.log('Notification not schedlued');
//   }
// })

//NEW NOTIFICATIONS CODE
// NOTIFICATIONS
self.addEventListener("message", (event) => {
  if (event.data.type === 'notification-interval') {
    const interval = event.data.interval;
    // console.log(interval)
    // set up notification interval here
    setInterval(() => {
      self.registration.showNotification("Task Notification", {
        body: "You have a task to complete.",
        icon: '/assets/images/icons/logo-192x192.png',
        data: { url: "/calendar.html" },
      });
    }, interval * 60 * 60 * 1000); // convert hours to milliseconds
  }
  // event.waitUntil(
  //   // Added a return statement to the importScripts method
  //   // Moved the console.log inside the then method
  //   //  importScripts('assets/script/script.js').then(() => {
  //   //   console.log('Scripts loaded first')
      
  //   // })
  // )
});

// Check whether notification will show
// Moved the `interval` variable declaration outside the `if` block
self.addEventListener('message', (event) => {
  const interval = event.data.interval;
  const now = Date.now();
  const nextNotificationTime = now + interval * 60 * 60 * 1000;

  self.registration.getNotifications().then(notifications => {
    const nextNotification = notifications.find(notification => {
      return notification.timestamp >= nextNotificationTime;
    });
    if (nextNotification) {
      console.log('Notification scheduled for:', new Date(nextNotification.timestamp));
    } else {
      console.log('Notification not scheduled');
    }
  });
});



self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        if (client.openWindow) {
          return client.openWindow(event.notification.data.url);
        }
      })
  );
});




