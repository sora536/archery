import { getIdToken } from "./firebase.js";
import {CONFIG} from "./config.js"

const GAS_URL = CONFIG.GAS_URL;


export async function api(action, data = {}) {
  const idToken = await getIdToken();
  console.log("API Post:",action,JSON.stringify({
      "idToken":idToken,
      "action":action,
      ...data
    }))
  const response = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({
      "idToken":idToken,
      "action":action,
      ...data
    })
  });
  const result = await response.json();
  console.log("API Result:",action,result)
  if(!result.success){
    console.log(result)
    alert(result.message)
  }
  return await result;
}
