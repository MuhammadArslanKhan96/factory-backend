import * as  admin from "firebase-admin";

import serviceAccount from "./firebaseconfig.json";

admin.initializeApp({
    //@ts-ignore
    credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();