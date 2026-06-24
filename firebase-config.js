// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// 1. اذهب إلى https://console.firebase.google.com/
// 2. أنشئ مشروعاً جديداً ثم أضف تطبيق ويب (Web App)
// 3. انسخ الإعدادات الخاصة بك واستبدلها بالأسفل
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    auth.languageCode = 'ar'; // Set SMS language to Arabic
    db = getFirestore(app);
    console.log("Firebase تم التهيئة بنجاح!");
} catch (error) {
    console.warn("تنبيه: Firebase غير مهيأ بعد. يرجى إدخال إعداداتك في firebase-config.js", error);
}

// Global reference for window to use in non-module scripts
window.firebaseAuth = auth;
window.firebaseDb = db;

// --- OTP SMS Logic ---

/**
 * دالة لتجهيز الـ Recaptcha
 * يجب وضع <div id="recaptcha-container"></div> في ملف الـ HTML
 */
window.setupRecaptcha = function() {
    if (!auth) return null;
    
    // Clear old recaptcha if exists
    if(window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
    }

    try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log("Recaptcha solved");
            }
        });
        return window.recaptchaVerifier;
    } catch (err) {
        console.error("خطأ في تهيئة Recaptcha: ", err);
        return null;
    }
};

/**
 * دالة لإرسال رسالة الـ OTP إلى رقم المريض
 * @param {string} phoneNumber - رقم الهاتف مع كود الدولة (مثال: +201012345678)
 */
window.sendOTP = function(phoneNumber) {
    return new Promise((resolve, reject) => {
        if (!auth || firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
            alert("رسالة ديمو: كود التحقق الخاص بك هو 1234");
            window._demoOTP = "1234";
            return resolve(true);
        }

        const appVerifier = window.setupRecaptcha();
        if (!appVerifier) return reject("فشل في تهيئة Recaptcha");

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. 
                window.confirmationResult = confirmationResult;
                resolve(true);
            }).catch((error) => {
                // Error; SMS not sent
                console.error("خطأ أثناء إرسال رسالة SMS: ", error);
                
                // Reset recaptcha on error
                if(window.recaptchaVerifier) window.recaptchaVerifier.render().then(widgetId => grecaptcha.reset(widgetId));
                
                reject(error);
            });
    });
};

/**
 * دالة للتحقق من كود الـ OTP
 * @param {string} code - الكود المكون من 6 أرقام
 */
window.verifyOTP = function(code) {
    return new Promise((resolve, reject) => {
        if (!auth || firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
            if (code === window._demoOTP) {
                return resolve({ user: { phoneNumber: "Demo User" } });
            } else {
                return reject(new Error("كود التحقق غير صحيح"));
            }
        }

        if (!window.confirmationResult) {
            return reject(new Error("يرجى إرسال الكود أولاً"));
        }

        window.confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            const user = result.user;
            resolve(result);
        }).catch((error) => {
            // User couldn't sign in (bad verification code?)
            reject(error);
        });
    });
};

// --- Firestore Database Logic ---

function checkDb() {
    if (!db || firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
        return false;
    }
    return true;
}

// 1. Chat & Support System
window.dbAddMessage = async function(collectionName, messageObj) {
    if (!checkDb()) {
        let msgs = JSON.parse(localStorage.getItem(collectionName) || "[]");
        messageObj.timestamp = new Date().toISOString();
        msgs.push(messageObj);
        localStorage.setItem(collectionName, JSON.stringify(msgs));
        window.dispatchEvent(new Event('local_update_' + collectionName));
        return { id: "demo_" + Date.now() };
    }
    messageObj.timestamp = serverTimestamp();
    return await addDoc(collection(db, collectionName), messageObj);
};

window.dbListenMessages = function(collectionName, callback) {
    if (!checkDb()) {
        const update = () => callback(JSON.parse(localStorage.getItem(collectionName) || "[]"));
        update();
        const storageListener = (e) => { if (e.key === collectionName) update(); };
        window.addEventListener('storage', storageListener);
        window.addEventListener('local_update_' + collectionName, update);
        return () => {
            window.removeEventListener('storage', storageListener);
            window.removeEventListener('local_update_' + collectionName, update);
        };
    }
    const q = query(collection(db, collectionName), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
        const msgs = [];
        snapshot.forEach((doc) => {
            msgs.push({ id: doc.id, ...doc.data() });
        });
        callback(msgs);
    });
};

// 2. Medical Data (Prescriptions, Labs)
window.dbAddRecord = async function(collectionName, recordObj) {
    if (!checkDb()) {
        let records = JSON.parse(localStorage.getItem(collectionName) || "[]");
        recordObj.timestamp = new Date().toISOString();
        records.push(recordObj);
        localStorage.setItem(collectionName, JSON.stringify(records));
        window.dispatchEvent(new Event('local_update_' + collectionName));
        return { id: "demo_" + Date.now() };
    }
    recordObj.timestamp = serverTimestamp();
    return await addDoc(collection(db, collectionName), recordObj);
};

window.dbListenRecords = function(collectionName, callback) {
    if (!checkDb()) {
        const update = () => {
            let records = JSON.parse(localStorage.getItem(collectionName) || "[]");
            records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            callback(records);
        };
        update();
        const storageListener = (e) => { if (e.key === collectionName) update(); };
        window.addEventListener('storage', storageListener);
        window.addEventListener('local_update_' + collectionName, update);
        return () => {
            window.removeEventListener('storage', storageListener);
            window.removeEventListener('local_update_' + collectionName, update);
        };
    }
    const q = query(collection(db, collectionName), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
        const records = [];
        snapshot.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() });
        });
        callback(records);
    });
};
