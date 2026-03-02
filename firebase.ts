// firebase.ts

// 1. 引入需要的 Firebase 功能
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 這是新增的，用來連線資料庫

// 2. 這是你截圖中的設定檔 (來自截圖)
const firebaseConfig = {
  apiKey: "AIzaSyAwYcTUw26Recvi479unDhMRL-0GiPUsLs",
  authDomain: "neko-master-db.firebaseapp.com",
  projectId: "neko-master-db",
  storageBucket: "neko-master-db.firebasestorage.app",
  messagingSenderId: "456592216607",
  appId: "1:456592216607:web:fe49db41b55af207ce3b2a",
  measurementId: "G-EY8HKXCMYB"
};

// 3. 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 4. 【重要】把資料庫功能匯出，讓其他檔案可以用
export const db = getFirestore(app);