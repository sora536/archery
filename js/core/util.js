import {api} from "./api.js"
import {
  makeGroupSelect,
  changeGroupDateInput,
  changeRanking
} from "./ui.js";
export async function initializeAfterLogin() {
  //const myProfile = await api("getMyProfile")
  const myGroups = await api("getMyGroups");
  const myGroupScore = await changeGroupDateInput()
  if (myGroups.myGroup.length === 0) {
    showView("welcomeView");
  } else {
    showView("appView");
  }
  makeGroupSelect(myGroups)
  changeRanking()
  // 次はここで画面遷移を管理する
}

export function showView(viewId) {
  const views = [
    "loginView",
    "appView",
    "welcomeView",
  ];
  for (const id of views) {
    document.getElementById(id).hidden =(id !== viewId);

  }
}
export function showModal(viewId){
  const views=[
    "inviteModal",
    "createGroupModal"
  ]
  for (const id of views) {
    document.getElementById(id).hidden =(id !== viewId);
  }
}
export function closeModal(){
  const views=[
    "inviteModal",
    "createGroupModal"
  ]
  for (const id of views) {
    document.getElementById(id).hidden = true;
  }
}
export async function joinGroupFromModal() {
  const inviteCode = document.getElementById("inviteCodeInput").value;
  console.log(inviteCode)
  const check =await api("checkInviteCode",{inviteCode:inviteCode});
  if (!check.success) {
    alert("招待コードが無効です");
    return;
  }

  if (!confirm(`「${check.groupName}」に参加しますか？`)) return;

  const password = prompt("グループパスワードを入力してください");
  if (password === null) return;

  const result = await api("joinGroup",{
    inviteCode:inviteCode,
    password:password
  });
  if (result.success) {
    await initializeAfterLogin();
  }
}
export async function createGroup(){
  const groupName = document.getElementById("groupNameInput").value
  const password = document.getElementById("groupPasswordInput").value
  const result = await api("createGroup",{
    "groupName":groupName,
    "password":password
  })
  if(result.success){
    alert("招待コードは"+result.inviteCode+"です。絶対に忘れないでください。めんどくさくて確認する仕組みは作ってないです。")
    alert("招待コード(再掲):"+result.inviteCode)
    await initializeAfterLogin()
  }
}