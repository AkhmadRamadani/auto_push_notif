const admin = require('firebase-admin');
const cron = require('node-cron');
const firestore = require('@google-cloud/firestore');

var file = 'mood-journal-435b7-firebase-adminsdk-wkgvn-ef25b6fcbb.json'

admin.initializeApp({
    credential: admin.credential.cert(file),
    databaseURL: 'https://mood-journal-435b7.firebaseio.com'
});

const db = admin.firestore();

// get the tokens from the firestore users collection
const topicDrinkReminder = "drinkReminder";
const topicFillJournal = "fillJournal";

cron.schedule('0 9 * * *', () => {
    const data = {
        notification: {
            title: 'Good Morning! Have a Nice Day',
            body: 'Start your day with a glass of water',
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        topic: topicDrinkReminder,
    };

    sendNotification(data);

    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            db.collection('notifications').add({
                title: data.notification.title,
                body: data.notification.body,
                userId: doc.id,
                date: new Date(),
                topic: topicDrinkReminder,
                isRead: false,
            });
        });
    });


});


cron.schedule('0 12 * * *', () => {
    const data = {
        notification: {
            title: "It's time to take a break",
            body: 'Have a glass of water and keep hydrated',
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        topic: topicDrinkReminder,
    };

    sendNotification(data);

    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            db.collection('notifications').add({
                title: data.notification.title,
                body: data.notification.body,
                userId: doc.id,
                date: new Date(),
                topic: topicDrinkReminder,
                isRead: false,

            });
        });
    });

});

cron.schedule('* * * * *', () => {

    const data = {
        notification: {
            title: "Wow! You've done a great job today",
            body: "Keep hydrated and don't forget to fill your journal",
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        topic: topicDrinkReminder,
    };

    sendNotification(data);

    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            db.collection('notifications').add({
                title: data.notification.title,
                body: data.notification.body,
                userId: doc.id,
                date: new Date(),
                topic: topicDrinkReminder,
                isRead: false,

            });
        });
    });

});

cron.schedule('0 20 * * *', () => {

    const data = {
        notification: {
            title: "How was your day?",
            body: "We hope you had a great day. Don't forget to fill your journal",
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        topic: topicFillJournal,
    };

    sendNotification(data);

    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            db.collection('notifications').add({
                title: data.notification.title,
                body: data.notification.body,
                userId: doc.id,
                date: new Date(),
                topic: topicFillJournal,
                isRead: false,

            });
        });
    });
});

cron.schedule('0 22 * * *', () => {

    const data = {
        notification: {
            title: 'Good Night! Have a Nice Dream',
            body: 'Rest well and have a glass of water before you sleep',
        },
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        topic: topicDrinkReminder,
    };

    sendNotification(data);

    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            db.collection('notifications').add({
                title: data.notification.title,
                body: data.notification.body,
                userId: doc.id,
                date: new Date(),
                topic: topicDrinkReminder,
                isRead: false,

            });
        });
    });
});


function sendNotification(data) {
    admin.messaging().send(data)
        .then((response) => {
            console.log(`Successfully sent message: ${response}`);
        })
        .catch((error) => {
            console.log(`Error sending message: ${error}`);
        });
}