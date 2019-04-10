var webPush = require('web-push');
var pushSubscription = {
    "endpoint": "https://android.googleapis.com/gcm/send/f_sZwEiDJPM:APA91bEB78yJXuf1P_9-w8Xhj_H1CfrtiiQiemu7aNikTksueVOO6wFpwrLfLGfOoy5aIJx5DESFn2YCzVQwCU-5K2h-kX6n3w0po9FaLFAT7IkaJKnh2qTZRZ5q3t7TbIRneNxRrlT0",
    "keys": {
        "p256dh": "BJQbHWPIN1M0wkld9OIQevrIgnVv0J8/Vb9fCjY7SSXrm6ATXUioZVvSJAbQEsKN6ccXpvQwt220lK2adYjmJh8=", 
        "auth": "9Aq26AEg74Rmn1GG51YHGg=="
    }
};
var payload = 'Hey tayo!! Kalo warnanya kuning namanya beda lagi...';
var options = {
    gcmAPIKey: 'AIzaSyC_xLWK0wY27s2qQ9_luSS-wSGNUv4FwZo',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);