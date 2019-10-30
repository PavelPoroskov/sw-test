self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        // '/sw-test/',
        // '/sw-test/index.html',
        // '/sw-test/style.css',
        // '/sw-test/app.js',
        // '/sw-test/image-list.js',
        // '/sw-test/star-wars-logo.jpg',
        // '/sw-test/gallery/bountyHunters.jpg',
        './gallery/myLittleVader.jpg',
        // '/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
  console.log('from SW/install: is installed');
});

self.addEventListener('activate', function (event) {
  // Safary don't support clients.claim()
  try {
    event.waitUntil(self.clients.claim());
  // eslint-disable-next-line no-empty
  } catch (err) {
  }
  console.log('from SW/activate: is activated');
});

// self.addEventListener('fetch', function(event) {
//   const urlsForCacheRegExp = new RegExp('/gallery/', 'g');

//   if (!urlsForCacheRegExp.test(event.request.url)) {
//     return false;
//   }

//   console.log(`request ${event.request.url}`);

//   const replacement = event.request.url
//   .split('/')
//   .slice(0,-2)
//   .concat('gallery/myLittleVader.jpg')
//   .join('/');

//   event.respondWith(caches.match(event.request).then(function(response) {
//     // caches.match() always resolves
//     // but in case of success response will have value
//     if (response !== undefined) {
//       console.log(`cache ${event.request.url}`);

//       return caches.match(replacement)
//         .then(function (responseReplacement) {
//           if (!responseReplacement) {
//             console.log('have cache, but not have replacement');
//           }
//           return responseReplacement || response;
//         });
//     } else {
//       console.log(`fetch try: ${event.request.url}`);
//       return fetch(event.request).then(function (response) {
//         // response may be used only once
//         // we need to save clone to put one copy in cache
//         // and serve second one
//         let responseClone = response.clone();
        
//         caches.open('v1').then(function (cache) {
//           cache.put(event.request, responseClone);
//         });

//         // return response;
//         return caches.match(replacement)
//         .then(function (responseReplacement) {
//           if (!responseReplacement) {
//             console.log('have fetched, but not have replacement');
//           }
//           return responseReplacement || response;
//         });
//       });
//       // .catch(function () {
//       //   return caches.match('gallery/myLittleVader.jpg');
//       // });
//     }
//   }));
// });

var CACHE = 'v22';

self.addEventListener('fetch', function(event) {
  const urlsForCacheRegExp = new RegExp('/gallery/', 'g');

  if (!urlsForCacheRegExp.test(event.request.url)) {
    return false;
  }

  console.log(`request ${event.request.url}`);

  const replacement = event.request.url
  .split('/')
  .slice(0,-2)
  .concat('gallery/myLittleVader.jpg')
  .join('/');

  event.respondWith(caches.open(CACHE).then(function(cache) {
    return cache.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        console.log(`cache ${event.request.url}`);

        return caches.match(replacement).then(function (responseReplacement) {
          if (!responseReplacement) {
            console.log('have cache, but not have replacement');
          }
          return responseReplacement || response;
        });
      } else {
        console.log(`fetch try: ${event.request.url}`);
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();
          
          caches.open('v1').then(function (cache) {
            cache.put(event.request, responseClone);
          });

          // return response;
          return caches.match(replacement).then(function (responseReplacement) {
            if (!responseReplacement) {
              console.log('have fetched, but not have replacement');
            }
            return responseReplacement || response;
          });
        });
      }
    })
  }))
})
