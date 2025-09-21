import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBpkKhBusfzM45RsP464KpoABxw1-TBaB8",
  authDomain: "luo-ancient-movies-com.firebaseapp.com",
  databaseURL: "https://luo-ancient-movies-com-default-rtdb.firebaseio.com",
  projectId: "luo-ancient-movies-com",
  storageBucket: "luo-ancient-movies-com.appspot.com",
  messagingSenderId: "86595039806",
  appId: "1:86595039806:web:c2c386f9fd1ea02c0ad76f",
  measurementId: "G-BEH73CPP70"
};

const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };