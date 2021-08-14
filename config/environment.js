let environments = {
    staging: {
        FIREBASE_API_KEY: 'AIzaSyC0Q_FGOegySljKxuH5q-dji2yvZCd4fC4',
        FIREBASE_AUTH_DOMAIN: 'foodrr-4b163.firebaseapp.com',
        FIREBASE_DATABASE_URL: 'https://foodrr-4b163.firebaseio.com/',
        FIREBASE_PROJECT_ID: 'foodrr-4b163',
        FIREBASE_STORAGE_BUCKET: 'foodrr-4b163.appspot.com',
        FIREBASE_MESSAGING_SENDER_ID: '74495830395',
        GOOGLE_CLOUD_VISION_API_KEY: 'AIzaSyDlbePn-1ooGqbMQdNb-2YQlv1JplGbxI4'
    },
    production: {
        // Warning: This file still gets included in your native binary and is not a secure way to store secrets if you build for the app stores. Details: https://github.com/expo/expo/issues/83
    }
};

function getReleaseChannel() {
    let releaseChannel = 'staging'; // testing purpose
    if (releaseChannel === undefined) {
        return 'staging';
    } else if (releaseChannel === 'staging') {
        return 'staging';
    } else {
        return 'staging';
    }
}
function getEnvironment(env) {
    console.log('Release Channel: ', getReleaseChannel());
    return environments[env];
}
let Environment = getEnvironment(getReleaseChannel());
export default Environment;
