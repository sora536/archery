//変数定義編
let round =1;
let practiceDay = [];
let practiceDay_shots =[];
let scoreArray = [];
let score_active ="";
let hamburgerButton = document.getElementById('header-hamburger');
let hamburgerWindow = document.getElementById('hamburgerWindow');
let scoreButton = document.getElementById("scoreButton");
let day = new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"+new Date().getDate()+"日";
//練習の情報を取り出す
if(localStorage.getItem('practiceDay')){
  practiceDay=JSON.parse(localStorage.getItem('practiceDay'));  
  practiceDay_shots=JSON.parse(localStorage.getItem('practiceDay_shots'));  
}
//スコアの情報を取り出す
if(localStorage.getItem('scoreArray')){
  scoreArray=JSON.parse(localStorage.getItem('scoreArray'));  
}
//ログインボーナス
if (!practiceDay.includes(day)){
  practiceDay.push(day);
  practiceDay_shots.push(0);
  localStorage.setItem("practiceDay",JSON.stringify(practiceDay));
  localStorage.setItem("practiceDay_shots",JSON.stringify(practiceDay_shots));
}
//メニューに日付を追加
function resetMemu(){
  for (let i=practiceDay.length; i>0;i--){
    if(document.getElementById(practiceDay[i-1])!==null){
      document.getElementById(practiceDay[i-1]).remove();
    }
  }
  for (let i=practiceDay.length; i>0;i--){
    let li=document.createElement("li");
    let button=document.createElement("button");
    let ul =document.getElementById("hamburgerWindow-list");
    li.textContent=practiceDay[i-1]+"　"+practiceDay_shots[i-1]+"射";
    li.classList.add("hamburgerWindow_items");
    li.setAttribute("id",practiceDay[i-1]);
    li.setAttribute("ontouchend","hamburgerWindow_click(this)")
    ul.appendChild(li);
    button.textContent="削除"
    button.setAttribute("id",practiceDay[i-1]);
    button.setAttribute("ontouchend","deleteButtonClick(this)")
    button.classList.add("hamburgerWindow_items");
    li.appendChild(button);
  }
}
//3本線のやつが押されたとき
function hamburgerClick(){
  if (hamburgerButton.classList.contains('active')) {
    hamburgerButton.classList.remove('active');
    hamburgerWindow.classList.remove('open');
  } else {
    hamburgerButton.classList.add('active');
    hamburgerWindow.classList.add('open');
  }
}
//日付のやつが押されたとき
function hamburgerWindow_click(items){
  hamburgerClick();
  resetTable(items);
  scoreButton.classList.add('open');
}
//ホームボタンが押されたとき
function homeClick(){
  resetTable();
  scoreButton.classList.remove('open');
  hamburgerButton.classList.remove('active');
  hamburgerWindow.classList.remove('open');
}
//スコアボタンが押されたとき
function buttonClick(score){
  hamburgerButton.classList.remove('active');
  hamburgerWindow.classList.remove('open');
  //新規の場所が選択されたとき
  if(score_active ==String(practiceDay_shots[practiceDay_shots.length-1]%36+1)){
    //スコアのリストにスコアを追加
    scoreArray.push(score.id);
    //今日の行射数を更新
    practiceDay_shots[practiceDay_shots.length-1] +=1;
    resetMemu();





  }else{//上書きのとき
    //スコアを更新する
    scoreArray[scoreArray.length-practiceDay_shots[practiceDay_shots.length-1]%36-1+Number(score_active)]=score.id;
  }

  //ローカルストレージに保存
  localStorage.setItem("scoreArray",JSON.stringify(scoreArray));
  localStorage.setItem("practiceDay_shots",JSON.stringify(practiceDay_shots));
  //スコア氷の更新
  resetTable();

}
//スコアが押されたとき(セルの選択)
function scoreClick(score){
  hamburgerButton.classList.remove('active');
  hamburgerWindow.classList.remove('open');
  if(document.getElementById(score.id).textContent !==""){
    document.getElementById(score_active).classList.remove("scoreActive");
    document.getElementById(score.id).classList.add("scoreActive");
    score_active = score.id;
  }else if(score.id ==practiceDay_shots[practiceDay_shots.length-1]%36+1){
    document.getElementById(score_active).classList.remove("scoreActive");
    document.getElementById(score.id).classList.add("scoreActive");
    score_active = score.id;
  }
}
//スコア表のリロード
function resetTable(day){
  let day_start=0;
  let day_shots=0;
  if(day == null){
    day_shots =practiceDay_shots[practiceDay_shots.length-1]%36;
    day_start =scoreArray.length-day_shots;
  }else{
    //いつの行射
    let day_number = practiceDay.indexOf(day.id);
    //Arrayの始点
    for (let i=0;i<day_number;i++){
      day_start += Number(practiceDay_shots[i]);
    }
    //行射数
    day_shots = practiceDay_shots[day_number];

  }
  let table =document.getElementById("table");
  while(table!==null){
    if(table !==null ){
      table.remove();
      table =document.getElementById("table");

    }
  }
  for(let round=0;round<=Math.floor((Math.max(day_shots-1,0))/36);round++){
    let scoreTable =document.getElementById("scoreTable")
    table = document.createElement("table");
    table.classList.add("table_"+round,"scoreTable");
    table.id = "table";
    scoreTable.prepend(table);
    let tr =document.createElement("tr");
    table.appendChild(tr);
    th =document.createElement("th");
    tr.appendChild(th);
    for(let k=1;k<7;k++){
      let th =document.createElement("th");
      th.textContent = k;
      tr.appendChild(th);
    }
    th =document.createElement("th");
    th.textContent = "小計";
    tr.appendChild(th);
    th =document.createElement("th");
    th.textContent = "合計";
    tr.appendChild(th);
    tr =document.createElement("tr");
    table.appendChild(tr);
    th=document.createElement("th");
    th.textContent = "70m-"+(round+1)/*ラウンドインフォメーション*/ 
    th.colSpan="9";
    th.style.textAlign="left";
    tr.appendChild(th);







    let score_sum=0;
    let score_all=0;
    for(let j=1;j<7;j++){
      //各エンドごとの見出し
      tr =document.createElement("tr");
      tr.classList.add("end_"+j);
      table.appendChild(tr);
      th = document.createElement("th");
      th.textContent=j;
      tr.appendChild(th);
  
      for(let i=1;i<7;i++){
        //スコアをかく
        let td =document.createElement("td");
        let score ="";
        if(i+6*j-6 <= day_shots){
          score = scoreArray[day_start+i+6*j-7+36*round]
        }else{
          score ="";
        }
        td.textContent = score;
        td.setAttribute("onclick","scoreClick(this)");
        td.setAttribute("id",String(i+6*j-6));
        tr.appendChild(td);
        if( score=="X"){
          score_sum+=10;
          score_all+=10;
        }else if( score=="M"){

        }else{
          score_sum+=Number(score);
          score_all+=Number(score);
        }
      }

      //小計、合計をかく
      td =document.createElement("td");
      if(6*j <= day_shots&&String(score_sum)!=="NaN"){
        td.textContent = score_sum;
      }else{
        td.textContent ="";
      }
      td.classList.add("scoreTable_sum");
      tr.appendChild(td);
      td =document.createElement("td");
      if(6*j <= day_shots &&String(score_all)!=="NaN"){
        td.textContent = score_all;
      }else{
        td.textContent ="";
      }    
      td.classList.add("scoreTable_sum");
      tr.appendChild(td);
      //小計をリセット
      score_sum=0;


    }

    
  }
  if(day == null){
    document.getElementById(day_shots+1).classList.add("scoreActive")
    score_active =String(day_shots+1);
  }
}
//記録の抹消
function deleteButtonClick(day){
  let delete_day = practiceDay.indexOf(day.id);
  let delete_start =0;
  let delete_shots = practiceDay_shots[delete_day];
  for (let i=0;i<delete_day;i++){
    delete_start += Number(practiceDay_shots[i]);
  }
  practiceDay.splice(delete_day,1);
  practiceDay_shots.splice(delete_day,1);
  scoreArray.splice(delete_start,delete_shots);
  localStorage.setItem("practiceDay",JSON.stringify(practiceDay));
  localStorage.setItem("practiceDay_shots",JSON.stringify(practiceDay_shots));
  localStorage.setItem("scoreArray",JSON.stringify(scoreArray));
  window.location.reload();
}
homeClick();
resetMemu();

