import { toast } from "react-toastify";
import { app } from "@/firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);;

export const simpleNotify = (msg) => toast(msg, {
    style: {
        color: 'black'
    }
});


export const waitForUser = () => new Promise((resolve) => {
    const checkUser = () => {
      if (auth.currentUser) {
        console.log(auth.currentUser);
        resolve(auth.currentUser);
      } else {
        setTimeout(checkUser, 100);
      }
    };
    checkUser();
  })

  export const getUserUID = async () => {
    if (typeof window !== 'undefined') {
        const user_id = await localStorage.getItem('user_uid'); 
      return user_id;
    }
    return null;
  };