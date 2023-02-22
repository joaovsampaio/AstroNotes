import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Cole as configurações do seu projeto do Firebase
  // Visite: https://firebase.google.com/docs/web/learn-more#config-object
  //
  //
  //
  //
  //
};

const app = initializeApp(firebaseConfig);
export const dataBase = getDatabase(app);
export const auth = getAuth(app);
