console.log("Service worker loaded...");

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received:', data);
    if (!data || !data.title) {
        console.error('Received WebPush with an empty title. Received body: ', data);
    }
    const options = {
        body: data.body,
        icon: './img/icon.png',
        data: {
            url: 'https://ata-production.up.railway.app/notifications.html'
          }
    };

    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push({ title: data.title, body: data.body, timestamp: Date.now() });
    localStorage.setItem('notifications', JSON.stringify(notifications));

       self.registration.showNotification(data.title, options)
       .then(() => {
        // You can save to your analytics fact that push was shown
        // fetch('https://your_backend_server.com/track_show?message_id=' + pushData.data.message_id);
    });
});

self.addEventListener('notificationclick', function (event) {   
    event.notification.close();

    if (!event.notification.data) {
        alert('Click on WebPush with empty data, where url should be. Notification: ', event.notification)
        return;
    }
    if (!event.notification.data.url) {
        alert('Click on WebPush without url. Notification: ', event.notification)
        return;
    }
    if (event.notification.data && event.notification.data.url) {
        alert(event.notification.data.url);
        event.waitUntil(
          clients.openWindow(event.notification.data.url)
        );
      }
    clients.openWindow(event.notification.data.url)
        .then(() => {
            // You can send fetch request to your analytics API fact that push was clicked
            // fetch('https://your_backend_server.com/track_click?message_id=' + pushData.data.message_id);
        });
});