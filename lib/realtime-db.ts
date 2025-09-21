import { getDatabase } from "firebase/database";
import { app } from "@/lib/firebase";

const db = getDatabase(app);
export { db };