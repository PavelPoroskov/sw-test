self.addEventListener('install', function(event) {
  // event.waitUntil(
  //   caches.open('v1').then(function(cache) {
  //     return cache.addAll([
  //       '/sw-test/',
  //       '/sw-test/index.html',
  //       '/sw-test/style.css',
  //       '/sw-test/app.js',
  //       '/sw-test/image-list.js',
  //       '/sw-test/star-wars-logo.jpg',
  //       '/sw-test/gallery/bountyHunters.jpg',
  //       '/sw-test/gallery/myLittleVader.jpg',
  //       '/sw-test/gallery/snowTroopers.jpg'
  //     ]);
  //   })
  // );
  console.log('sw is installed');
});

self.addEventListener('activate', function (event) {
  // Safary don't support clients.claim()
  try {
    event.waitUntil(self.clients.claim());
  // eslint-disable-next-line no-empty
  } catch (err) {
  }
  console.log('sw is activated');
});

self.addEventListener('fetch', function(event) {
  console.log('sw-fetch: begin');
  console.log(event.request.url);
  // TODO filter for /galery

  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      console.log('sw: from cache');
      return response;
    } else {
      console.log('sw: fetch');
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('gallery/myLittleVader.jpg');
      });
    }
  }));
});
