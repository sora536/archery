import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-nT8W1myZ9GD3KCSYuE-B4Ti9YlHck2Q",
  authDomain: "sora536.firebaseapp.com",
  projectId: "sora536",
  storageBucket: "sora536.firebasestorage.app",
  messagingSenderId: "435790419390",
  appId: "1:435790419390:web:68873c446b0b8394b295ef",
  measurementId: "G-P8JPZVFE4E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function login() {
  return await signInWithPopup(
    auth,
    provider
  );
}

export async function logout() {
  return await signOut(auth);
}
export async function getIdToken() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  return await user.getIdToken();
}
export function observeAuth(callback) {
  return onAuthStateChanged(
    auth,
    callback
  );
}

export function getCurrentUser() {
  return auth.currentUser;
}

//後で消す。
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("ログイン中");
    console.log(user.uid);
  } else {
    console.log("未ログイン");
  }
});