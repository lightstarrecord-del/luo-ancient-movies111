import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/lib/firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

export { auth, provider };