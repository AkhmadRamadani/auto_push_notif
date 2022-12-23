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
// const tokens = db.collection('users').get().then((snapshot) => {
//     snapshot.forEach((doc) => {
//         // console.log(doc.id, '=>', doc.data());
//         return doc.data().token;
//     });
// });

cron.schedule('0 9 * * *', () => {
    /// get user id from firestore
    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {

            const morningMessage = {
                notification: {
                    title: 'Good Morning! Have a Nice Day',
                    body: 'Start your day with a glass of water',
                },
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    userId: doc.id,

                },

                topic: topicDrinkReminder,
            };
            sendNotification(morningMessage);

        });
    });

});


cron.schedule('0 12 * * *', () => {
    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {

            const lunchMessage = {
                notification: {
                    title: "It's time to take a break",
                    body: 'Have a glass of water and keep hydrated',
                },
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    userId: doc.id,
                },

                topic: topicDrinkReminder,
            };
            sendNotification(lunchMessage);

        });
    }
    );
});

cron.schedule('0 17 * * *', () => {
    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {

            const dinnerMessage = {
                notification: {
                    title: "Wow! You've done a great job today",
                    body: "Keep hydrated and don't forget to fill your journal",
                },
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    userId: doc.id,
                },
                
                topic: topicDrinkReminder,
            };
            sendNotification(dinnerMessage);

        });
    }
    );
});
cron.schedule('0 20 * * *', () => {
    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {

            const dinnerMessage = {
                notification: {
                    title: "How was your day?",
                    body: "We hope you had a great day. Don't forget to fill your journal",
                },
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    userId: doc.id,
                },
                
                topic: topicFillJournal,
            };
            sendNotification(dinnerMessage);
        });
    });
});

cron.schedule('0 22 * * *', () => {
    db.collection('users').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const dinnerMessage = {
                notification: {
                    title: 'Good Night! Have a Nice Dream',
                    body: 'Rest well and have a glass of water before you sleep',
                },
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    userId: doc.id,
                },
                topic: topicDrinkReminder,
            };
            sendNotification(dinnerMessage);
        });
    });
});


function sendNotification(data) {
    admin.messaging().send(data)
        .then((response) => {
            db.collection('notifications').add({
                title: data.notification.title,
                body: data.notification.body,
                userId: data.data.userId,
                date: new Date(),
            });

            console.log(`Successfully sent message: ${response}`);
        })
        .catch((error) => {
            console.log(`Error sending message: ${error}`);
        });
}