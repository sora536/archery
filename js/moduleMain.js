import {
  login,
  logout,
  observeAuth,
  getIdToken
} from "./core/firebase.js";
import {api} from "./core/api.js";
import {
  initializeAfterLogin,
  joinGroupFromModal,
  showView,
  showModal,
  closeModal,
  createGroup,
 } from "./core/util.js"; 
 import {
  changeGroupSelect ,
  changeGroupDateInput,
  changeRanking
 } from "./core/ui.js";
import { state } from "./core/state.js";

const date = document.getElementById("dateInput").value = new Date().toLocaleDateString('sv-SE');


//loginをconsoleに津宇一
window.addEventListener("DOMContentLoaded",() => {
    console.log("ページ読み込み完了");
    document.getElementById("loginButton").addEventListener("click",async () => {
          try {
            console.log("ログイン開始");
            await login();
          } catch (e) {
            console.error(e);
          }
        }
      );
    document.getElementById("logoutButton").addEventListener("click",async () => {await logout();});
    document.getElementById("createGroupButton").addEventListener("click",async()=>{await showModal("createGroupModal")})
    document.getElementById("joinGroupButton").addEventListener("click",async()=>{await showModal("inviteModal")})
    document.getElementById("inviteCancelButton").addEventListener("click",async()=>{await closeModal()})
    document.getElementById("createCancelButton").addEventListener("click",async()=>{await closeModal()})
    document.getElementById("inviteSubmitButton").addEventListener("click",async()=>{
      closeModal()
      await joinGroupFromModal()})
    document.getElementById("createSubmitButton").addEventListener("click",async()=>{
      closeModal()
      await createGroup()})
    document.getElementById("groupSelect").addEventListener("change",(e)=>{changeGroupSelect(e.target)})
    document.getElementById("dateInput").addEventListener("change",async()=>{
      await changeGroupDateInput();
      changeRanking();
    })
    document.querySelectorAll(".metric-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".metric-chip").forEach(c =>c.classList.remove("active"));
        chip.classList.add("active");
        changeRanking();
      });
    });
    observeAuth(async(user) => {
      if(!user){
        showView("loginView");
        return
      }
      await initializeAfterLogin();
    });
  }
);