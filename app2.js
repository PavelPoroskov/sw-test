if ('serviceWorker' in navigator) {

  let timeoutId;
  const timeoutTimer = msWait => new Promise((resolve) => {
    timeoutId = setTimeout(resolve, msWait, { timeout: true });
  });

  (async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw2.js');

      if (!registration.active) {
        // we need to reload page
        // 1) to activate service-worker on safary (need if safry do not has 'clients.claim())
        const readyResult = await Promise.race([
          navigator.serviceWorker.ready,
          timeoutTimer(200),
        ]);

        if (readyResult.timeout) {
          // to activate service-worker on safary 
          // (need if safry do not has 'clients.claim())
          document.location.reload();
        } else {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          // to process imgages loaaded before service-worker ready with service-worker 
          // (if we don't block loading images until service-worker ready)
          // (if we need to process images loaded until service-worker ready)
          document.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  })();
}
