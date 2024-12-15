if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceWorker.js')
 .then(
 function (registration) {
     if (typeof registration.update == 'function') {
         registration.update();
     }
 })
}


alert("できてます")



//変数定義編
var day = new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"+new Date().getDate()+"日";
var score=[[]];
var recordWindow = document.getElementById('recordWindow');
var delete_button =document.getElementById('delete_button');

var memo = document.getElementById('memo');
var setting = document.getElementById('setting');
//localstoregeの内容を取る
if(localStorage.getItem("score")&&localStorage.getItem("score")!=="[]"){
  score=JSON.parse(localStorage.getItem('score'));
}else{//ないときは初期化
  score = [[day]]
  save();  
}
//ログインボーナス
if(score[0][0]!==day){
  score.unshift([day]);
  save();
}
//セーブ
function save(){
  localStorage.setItem("score",JSON.stringify(score));
}
//スコアボタンのクリック
function buttonClick(scoreButton){
  recordWindow.classList.remove('open');
  if(score_active == data.length+1){
    score[0].push(scoreButton.id);
  }else{
    score[0][score_active]=scoreButton.id
  }
  save();
  resetTable();
}
//スコア氷のクッリク
function scoreClick(score){
  if(document.getElementById(score.id).textContent !== "" || score.id == data.length+1){
    document.getElementById(score_active).classList.remove("scoreActive");
    document.getElementById(score.id).classList.add("scoreActive");
    score_active = score.id;
  }
} 

//スコア氷のリセット
function resetTable(date){
  recordWindow.classList.remove('open');
  if(date){//一日トータル
    //特定の日付のスコアを読み出す
    data = score.filter(dates =>dates[0] == date)[0]
    //日付の部分よさらば
    data = data.slice(1)
  }else{//36射
    data = score[0].slice(score[0].length-(score[0].length-1)%36)
  }

  //既存のテーブルを削除
  let table =document.getElementById("table");
  while(table!==null){
    if(table !==null ){
      table.remove();
      table =document.getElementById("table");
    }
  }

  //ラウンド分繰り返す
  for(let round = 1;round<=Math.max(Math.ceil(data.length/36),1);round++){
    scoreTable =document.getElementById("scoreTable");

    table = document.createElement("table");
    table.classList.add("table_"+round,"scoreTable");
    table.id = "table";
    scoreTable.append(table);

    tr =document.createElement("tr");
    table.appendChild(tr);

    th =document.createElement("th");
    tr.appendChild(th);

    for(let k=1;k<=6;k++){
      th =document.createElement("th");
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
    th.textContent = "70m-"+(round)/*ラウンドインフォメーション*/ 
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
        td =document.createElement("td");
        td.textContent = data[36*round+6*j+i-43];
        td.setAttribute("onclick","scoreClick(this)");
        td.setAttribute("id",String(6*j+i-6));
        tr.appendChild(td);

        //小計,合計の計算
        if( data[36*round+6*j+i-43]=="X"){
          score_sum+=10;
          score_all+=10;
        }else if( data[36*round+6*j+i-43]=="M"){
        }else{
          score_sum+=Number(data[36*round+6*j+i-43]);
          score_all+=Number(data[36*round+6*j+i-43]);
        }
      }

      //小計
      td =document.createElement("td");
      if(6*j <= data.length&&String(score_sum)!=="NaN"){
        td.textContent = score_sum;
      }else{
        td.textContent ="";
      }
      td.classList.add("scoreTable_sum");
      tr.appendChild(td);

      //合計
      td =document.createElement("td");
      if(6*j <= data.length &&String(score_all)!=="NaN"){
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
  if(date == null){
    document.getElementById(data.length+1).classList.add("scoreActive")
    score_active =String(data.length+1);
  }
}

//メニューに日付を追加
function resetMemu(){
  for (let i=score.length; i>0;i--){
    if(document.getElementById(score[i-1][0])!==null){
      document.getElementById(score[i-1][0]).remove();
    }
  }
  for (let i=0; i<score.length;i++){
    ul =document.getElementById("recordWindow-list");
    li=document.createElement("li");
    li.textContent=score[i][0]+"　"+(score[i].length-1)+"射";
    li.classList.add("recordWindow_items");
    li.setAttribute("id",score[i][0]);
    li.setAttribute("ontouchend","recordWindow_click(this)")
    ul.appendChild(li);

    button=document.createElement("button");
    button.textContent="削除"
    button.setAttribute("id",score[i]);
    button.setAttribute("ontouchend","deleteButtonClick(this)")
    button.classList.add("recordWindow_items");
    li.appendChild(button);
  }
}




function recordWindow_click(items){
  recordClick();
  resetTable(items.id);
  scoreButton.classList.remove('open');
  delete_button.classList.remove('open');
  memo.classList.remove('open');
  setting.classList.remove('open')

}
//下のボタンのクッリク
function homeClick(){
  resetTable();
  scoreButton.classList.add('open');
  delete_button.classList.add('open')
  recordWindow.classList.remove('open');
  memo.classList.remove('open');
  setting.classList.remove('open')

}
function recordClick(){
  if (recordWindow.classList.contains('open')) {
    recordWindow.classList.remove('open');
  } else {
    recordWindow.classList.add('open');
  }
  resetMemu();
}
function memoClick(){
  recordWindow.classList.remove('open');
  let table =document.getElementById("table");
  while(table!==null){
    if(table !==null ){
      table.remove();
      table =document.getElementById("table");
    }
  }
  scoreButton.classList.remove('open');
  delete_button.classList.remove('open');
  memo.classList.add('open');
  setting.classList.remove('open')

}
function settingClick(){
  recordWindow.classList.remove('open');
  let table =document.getElementById("table");
  while(table!==null){
    if(table !==null ){
      table.remove();
      table =document.getElementById("table");
    }
  }
  scoreButton.classList.remove('open');
  delete_button.classList.remove('open');
  memo.classList.remove('open');
  setting.classList.add('open')
}

//記録の抹消
function deleteButtonClick(day){
  if(window.confirm("ガチィ？")){
    console.log(score.findIndex(date => date == day.id))

    score.splice(score.findIndex(date => date == day.id),1)
    save();
    window.location.reload();

  }

}
function scoreDelete(){
  if(score[0].length>1){
    score[0].pop();
  }
  save();
  resetTable();
}


resetTable();
