import { api } from "./api.js";
import { showModal } from "./util.js";
import { state } from "./state.js";
let currentSelectedIndex = 0;
export function makeGroupSelect(myGroup){
  console.log(myGroup.myGroup)
  const sel=document.getElementById("groupSelect")
  myGroup.myGroup.forEach(g => {
    const groupSelect = document.createElement("option");
    groupSelect.value = g[0];
    groupSelect.textContent = g[1];
    const lastIndex = sel.options.length - 3;
    sel.add(groupSelect, lastIndex);
    sel.selectedIndex = 0;
      });
}
export async function changeGroupSelect(target){
   const sel = document.getElementById("groupSelect");
  if(target.value=="__JOIN__"){
    sel.selectedIndex = currentSelectedIndex;
    showModal("inviteModal")
    return
  }
  if(target.value=="__CREATE__"){
    sel.selectedIndex = currentSelectedIndex;
    showModal("createGroupModal")
    return
  }
  currentSelectedIndex = sel.selectedIndex;
  changeRanking()
}
export async function changeGroupDateInput(){
  state.groupScores= await api("getMyGroupScores",{"date":document.getElementById("dateInput").value})
}
export function changeRanking(){
  const category = document.querySelector(".metric-chip.active")?.dataset.type;
  const groupId = document.getElementById("groupSelect").value;
  const myGroupScores = state.groupScores.result;
  let data = null
  for (let i=0;i<myGroupScores.length;i++){
    console.log(myGroupScores[i].group[0]==groupId)
    if(myGroupScores[i].group[0]==groupId){
      const rankingData =myGroupScores[i].scores.map(score => ({
      displayName: score.displayName,
      data:
        category === "best"
          ? Number(score.record[3])
          : category === "average"
          ? Number(score.record[4])
          : Number(score.record[5])
        })).sort((a, b) => b.data - a.data);
      renderRanking(rankingData)
    }   
  }
}
function renderRanking(rankingData) {
  const rankingList =document.getElementById("rankingList");
  rankingList.innerHTML =
    rankingData.map((row, index) => `
          <div class="ranking-row">
            <span class="rank-col">
              ${index + 1}
            </span>
            <span class="name-col">
              ${row.displayName}
            </span>
            <span class="value-col">
              ${row.data}
            </span>
          </div>
        `
      ).join("");
}