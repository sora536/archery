home = document.getElementById("home");
homeButton = document.getElementById("homeButton");
record = document.getElementById("record");
recordButton = document.getElementById("recordButton");
memo = document.getElementById("memo");
memoButton = document.getElementById("memoButton");
setting = document.getElementById("setting");
settingButton = document.getElementById("settingButton");

homeScoreInfo = document.getElementById("homeScoreInfo");
select = document.getElementById("select");
finalSelect = document.getElementById("finalSelect");
addTableSelect = document.getElementById("addTableSelect");

memoList = document.getElementById("memoList");

recordDate = document.getElementById("recordDate");
recordDateInput = document.getElementById("recordDateInput");

toggle = document.getElementById("toggle");
if (localStorage.getItem("distance")) {
  document.getElementById("html").className = JSON.parse(
    localStorage.getItem("theme")
  );
}

day =
  new Date().getFullYear() +
  "年" +
  (new Date().getMonth() + 1) +
  "月" +
  new Date().getDate() +
  "日";

var score = [[]];
//localstorageのスコアの内容を取る
if (localStorage.getItem("score") && localStorage.getItem("score") !== "[]") {
  score = JSON.parse(localStorage.getItem("score"));
  //不要な日付を削除
  for (let i = 1; i < score.length; i++) {
    if (score[i].length == 1) {
      score.splice(i, 1);
      i -= 1;
    } else if (
      score[i][1].length +
        score[i][2].length +
        score[i][3].length +
        score[i][4].length +
        score[i][5].length ==
      0
    ) {
      score.splice(i, 1);
      i -= 1;
    }
    saveScore();
  }
} else {
  //ないときは初期化
  score = [[day, [], [], [], [], [], []]];
  saveScore();
}
//ログボ
if (score[0][0] !== day) {
  score.unshift([day, [], [], [], [], [], []]);
  saveScore();
}

//localstorageの距離の内容を取る
if (localStorage.getItem("distance")) {
  homeScoreInfo.textContent = JSON.parse(localStorage.getItem("distance"));
  select.value = JSON.parse(localStorage.getItem("distance"));
  document.getElementById(
    JSON.parse(localStorage.getItem("distance"))
  ).checked = true;
} else {
  //データが無いときに70mデータを表示
  localStorage.setItem("distance", '"70m"');
  document.getElementById("70m").checked = true;
}
if (!localStorage.getItem("goal")) {
  localStorage.setItem("goal", "250");
}
if (!localStorage.getItem("goodScoreRound")) {
  localStorage.setItem("goodScoreRound", 1);
}
if(localStorage.getItem("title")){
  document.getElementById("title").textContent = localStorage.getItem("title")
}else{
  document.getElementById("title").textContent = "Ianse◯的さむしんぐ"
}
imgLoad()
setScoreTable("home", 36, 0);

//上の日付を更新
recordDate.textContent = day;
//日付選択を生成
for (let i = 0; i < score.length; i++) {
  option = document.createElement("option");
  option.textContent = score[i][0];
  recordDateInput.appendChild(option);
}
toggle.addEventListener("click", function (e) {
  for (let j = 1; j < 6; j++) {
    if (j == 1) {
      distance = "70m";
    } else if (j == 2) {
      distance = "50m";
    } else if (j == 3) {
      distance = "30m";
    } else if (j == 4) {
      distance = "18m";
    } else if (j == 5) {
      distance = "10m";
    }

    document.getElementById(distance + "-scoreTable").style.display =
      toggle.checked ? "none" : "block";
    document.getElementById(distance + "-goodScoreTable").style.display =
      toggle.checked ? "block" : "none";
  }
});

//スコアをlocalstorageに保存
function saveScore() {
  localStorage.setItem("score", JSON.stringify(score));
}
//フッターのクリック
function footerClick(e, id) {
  event.preventDefault();
  home.classList.remove("open");
  homeButton.classList.remove("open");
  record.classList.remove("open");
  recordButton.classList.remove("open");
  memo.classList.remove("open");
  memoButton.classList.remove("open");
  setting.classList.remove("open");
  settingButton.classList.remove("open");
  e.classList.add("open");
  id.classList.add("open");
  if (id.id == "record") {
    makeScoreTable(0);
    makeGoodScoreTable(0);
    recordDateInput.value = day;
    recordDate.textContent = day;
    document.getElementById(
      JSON.parse(localStorage.getItem("distance"))
    ).checked = true;
  }
}
//黒いやつのクリック
function overlayClose() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("saveCheckWindow").style.display = "none";
  document.getElementById("addTableWindow").style.display = "none";
  select.value = JSON.parse(localStorage.getItem("distance"));
}
//recordのスコア氷を作る、ついで表示まで
function makeScoreTable(day) {
  for (let j = 1; j < 6; j++) {
    if (j == 1) {
      distance = "70m";
    } else if (j == 2) {
      distance = "50m";
    } else if (j == 3) {
      distance = "30m";
    } else if (j == 4) {
      distance = "18m";
    } else if (j == 5) {
      distance = "10m";
    }
    document.getElementById(distance + "-scoreTable").innerHTML = "";
    scoreTable = document.getElementById(distance + "-scoreTable");
    for (let round = 0; round < score[day][j].length / 36; round++) {
      //テーブルをラウンド数分作る
      var clone = scoreTableTemplate.content.cloneNode(true);
      scoreTable.appendChild(clone);
      document.getElementById("scoreInfo").textContent =
        distance + "-" + Number(round + 1);
      document.getElementById("scoreInfo").setAttribute("id", "");
      //各エンド毎に
      for (let end = 0; end < 6; end++) {
        row = document.getElementById("row-" + Number(end + 1));
        for (let i = 0; i < 6; i++) {
          td = document.createElement("td");
          td.setAttribute(
            "id",
            distance + "-" + Number(36 * round + 6 * end + i)
          );
          row.appendChild(td);
        }
        td = document.createElement("td");
        td.classList.add("scoreSum");
        td.setAttribute("id", distance + "Sum-" + Number(6 * round + end + 1));
        row.appendChild(td);
        td = document.createElement("td");
        td.classList.add("scoreSum");
        td.setAttribute("id", distance + "All-" + Number(6 * round + end + 1));
        row.appendChild(td);
        row.setAttribute("id", "");
      }
    }
    setScoreTable(distance, score[day][j].length, day);
  }
}

function makeGoodScoreTable(day) {
  data = [[], [], [], [], []];
  for (let j = 1; j < 6; j++) {
    //distanceの設定(70m,50m,...etc)
    if (j == 1) {
      distance = "70m";
      goal = JSON.parse(localStorage.getItem("goal"));
    } else if (j == 2) {
      distance = "50m";
      goal = 200;
    } else if (j == 3) {
      distance = "30m";
      goal = 300;
    } else if (j == 4) {
      distance = "18m";
      goal = 320;
    } else if (j == 5) {
      distance = "10m";
      goal = 350;
    }
    //dataの作成(dataは小計)
    for (let i = 0; i < score[day][j].length / 6; i++) {
      num = 0;
      for (let h = 0; h < 6; h++) {
        if (score[day][j][6 * i + h] == "X") {
          num += 10;
        } else if (score[day][j][6 * i + h] == "M") {
        } else if (
          score[day][j][6 * i + h] == undefined ||
          score[day][j][6 * i + h] == ""
        ) {
          num = NaN;
        } else {
          num += Number(score[day][j][6 * i + h]);
        }
      }
      data[j - 1].push(num);
    }
    for (
      let i = 0;
      i <=
      data[j - 1].length - 6 * Number(localStorage.getItem("goodScoreRound"));
      i++
    ) {
      max = 0;
      for (
        let k = 0;
        k < 6 * Number(localStorage.getItem("goodScoreRound"));
        k++
      ) {
        max += data[j - 1][i + k];
      }
      data[j - 1][i] = max;
    }

    for (
      let i = 1;
      i < 6 * Number(localStorage.getItem("goodScoreRound"));
      i++
    ) {
      data[j - 1].pop();
    }
    max = 0;
    for (let i = 0; i < data[j - 1].length; i++) {
      if (!isNaN(data[j - 1][i])) {
        max = Math.max(data[j - 1][i], max);
      }
    }

    num = data[j - 1].indexOf(max) * 6;
    data[j - 1] = score[day][j].slice(
      num,
      num + 36 * Number(localStorage.getItem("goodScoreRound"))
    );

    document.getElementById(distance + "-goodScoreTable").innerHTML = "";

    for (
      let round = 1;
      round <= Number(localStorage.getItem("goodScoreRound"));
      round++
    ) {
      sumAll = 0;
      scoreTable = document.getElementById(distance + "-goodScoreTable");
      var clone = scoreTableTemplate.content.cloneNode(true);
      scoreTable.appendChild(clone);
      document.getElementById("scoreInfo").textContent =
        distance + "-goodScore-" + round;
      document.getElementById("scoreInfo").setAttribute("id", "");

      for (let end = 0; end < 6; end++) {
        sum = 0;
        row = document.getElementById("row-" + Number(end + 1));
        for (let i = 0; i < 6; i++) {
          td = document.createElement("td");
          td.textContent = data[j - 1][6 * end + i + 36 * (round - 1)];
          row.appendChild(td);
          if (data[j - 1][6 * end + i + 36 * (round - 1)] == "X") {
            sum += 10;
            sumAll += 10;
          } else if (data[j - 1][6 * end + i + 36 * (round - 1)] == "M") {
          } else {
            sum += Number(data[j - 1][6 * end + i + 36 * (round - 1)]);
            sumAll += Number(data[j - 1][6 * end + i + 36 * (round - 1)]);
          }
        }
        if (isNaN(sum)) {
          sum = "";
          sumAll = "";
        }
        td = document.createElement("td");
        td.classList.add("scoreSum");
        td.textContent = sum;
        row.appendChild(td);

        td = document.createElement("td");
        td.classList.add("scoreSum");
        td.textContent = sumAll;
        row.appendChild(td);

        row.setAttribute("id", "");
      }
    }

    //アナリティクス的さむしんぐ
    anaData = [];
    for (let i = 0; i < score[day][j].length; i++) {
      if (score[day][j][i] == "X") {
        anaData.push(10);
      } else if (score[day][j][i] == "M") {
        anaData.push(0);
      } else if (score[day][j][i] == "" || score[day][j][i] == undefined) {
      } else {
        anaData.push(Number(score[day][j][i]));
      }
    }

    if (anaData.length !== 0) {
      average =
        anaData.reduce((previous, current) => previous + current) /
        anaData.length;
    } else {
      average = NaN;
    }
    if (anaData.length !== 0) {
      sd = Math.sqrt(
        anaData
          .map((current) => {
            const difference = current - average;
            return difference ** 2;
          })
          .reduce((previous, current) => previous + current) / anaData.length
      );
    } else {
      sd = NaN;
    }
    probability = rightTailProbability((goal / 36 - average) / sd);

    p = document.createElement("p");
    p.textContent = "average:" + (average * 36).toFixed(2);
    scoreTable.appendChild(p);

    p = document.createElement("p");
    p.textContent =
      goal + "点を超える確率:" + (probability * 100).toFixed(2) + "%";
    scoreTable.appendChild(p);

    console.log(max);
    a = document.createElement("a");
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "nofollow noopener");
    if (localStorage.getItem("goodScoreRound") == 2) {
      a.setAttribute(
        "href",
        "http://line.me/R/msg/text/?" +
          distance +
          "%0D%0A%E5%89%8D%E5%8D%8A" +
          Number(max - sumAll) +
          "%E7%82%B9%0D%0A%E5%BE%8C%E5%8D%8A" +
          sumAll +
          "%E7%82%B9%0D%0A%E5%90%88%E8%A8%88" +
          max +
          "%E7%82%B9%E3%81%A7%E3%81%97%E3%81%9F"
      );
    } else {
      a.setAttribute(
        "href",
        "http://line.me/R/msg/text/?" +
          distance +
          sumAll +
          "%E7%82%B9%E3%81%A7%E3%81%97%E3%81%9F"
      );
    }
    a.textContent = "LINEに送る";
    scoreTable.appendChild(a);
  }
}
function erf(x) {
  // Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

function normalCDF(z) {
  return (1 + erf(z / Math.sqrt(2))) / 2;
}

function rightTailProbability(z) {
  return 1 - normalCDF(z);
}
//新しいテーブルの用意
function newTableClick() {
  if (score[0][6].length !== 0) {
    addTableSelect.value = select.value;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("addTableWindow").style.display = "block";
  }
}
//push
function addTable() {
  num = score[0][6].length;
  for (let i = 0; i < 36 - num; i++) {
    score[0][6].push("");
  }
  if (addTableSelect.value == "70m") {
    score[0][1] = score[0][1].concat(score[0][6]);
  } else if (addTableSelect.value == "50m") {
    score[0][2] = score[0][2].concat(score[0][6]);
  } else if (addTableSelect.value == "30m") {
    score[0][3] = score[0][3].concat(score[0][6]);
  } else if (addTableSelect.value == "18m") {
    score[0][4] = score[0][4].concat(score[0][6]);
  } else if (addTableSelect.value == "10m") {
    score[0][5] = score[0][5].concat(score[0][6]);
  }
  score[0][6] = [];
  saveScore();
  overlayClose();
  setScoreTable("home", 36, 0);
}
//素点の入力
function scoreButtonClick(num) {
  event.preventDefault();
  if (score[0][6].length == 36) {
    finalSelect.value = select.value;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("saveCheckWindow").style.display = "block";
  } else {
    //レジスタに保存
    score[0][6].push(num.textContent);
    setScoreTable("home", score[0][6].length, 0);
  }
  saveScore();
}
//素点の削除
function scoreRemove() {
  event.preventDefault();
  score[0][6].pop();
  setScoreTable("home", score[0][6].length + 1, 0);
  saveScore();
}
//最終確認のとき
function saveCheckClick() {
  event.preventDefault();
  if (finalSelect.value == "70m") {
    score[0][1] = score[0][1].concat(score[0][6]);
  } else if (finalSelect.value == "50m") {
    score[0][2] = score[0][2].concat(score[0][6]);
  } else if (finalSelect.value == "30m") {
    score[0][3] = score[0][3].concat(score[0][6]);
  } else if (finalSelect.value == "18m") {
    score[0][4] = score[0][4].concat(score[0][6]);
  } else if (finalSelect.value == "10m") {
    score[0][5] = score[0][5].concat(score[0][6]);
  }
  score[0][6] = [];
  saveScore();
  overlayClose();
  setScoreTable("home", 36, 0);
}
//距離が変わったとき
function changeDistance(distance) {
  localStorage.setItem("distance", JSON.stringify(distance.value));
  homeScoreInfo.textContent = distance.value;
  document.getElementById(distance.value).checked = true;
}
//引き数として距離と表示する行射数day(arrayの場所)をとる
function setScoreTable(distance, shots, day) {
  //使うデータの複製
  if (distance == "70m") {
    data = score[day][1].slice(
      score[day][1].length - shots,
      score[day][1].length
    );
  } else if (distance == "50m") {
    data = score[day][2].slice(
      score[day][2].length - shots,
      score[day][2].length
    );
  } else if (distance == "30m") {
    data = score[day][3].slice(
      score[day][3].length - shots,
      score[day][3].length
    );
  } else if (distance == "18m") {
    data = score[day][4].slice(
      score[day][4].length - shots,
      score[day][4].length
    );
  } else if (distance == "10m") {
    data = score[day][5].slice(
      score[day][5].length - shots,
      score[day][5].length
    );
  } else if (distance == "home") {
    data = score[day][6].slice(0, score[day][6].length);
  }
  //素点の表示
  for (let i = 0; i < shots; i++) {
    if (data[i] == undefined) {
      document.getElementById(distance + "-" + i).textContent = "";
    } else {
      document.getElementById(distance + "-" + i).textContent = data[i];
    }
  }
  //合計の計算、表示
  for (let round = 1; round - 1 < shots / 36; round++) {
    scoreSumAll = 0;
    for (let j = 1; j <= 6; j++) {
      scoreSum = 0;
      for (let i = 0; i < 6; i++) {
        if (data[i + 6 * (j - 1) + 36 * (round - 1)] == "X") {
          scoreSum += 10;
          scoreSumAll += 10;
        } else if (data[i + 6 * (j - 1) + 36 * (round - 1)] == "M") {
        } else if (
          data[i + 6 * (j - 1) + 36 * (round - 1)] == undefined ||
          data[i + 6 * (j - 1) + 36 * (round - 1)] == ""
        ) {
          scoreSum = NaN;
          scoreSumAll = NaN;
        } else {
          scoreSum += Number(data[i + 6 * (j - 1) + 36 * (round - 1)]);
          scoreSumAll += Number(data[i + 6 * (j - 1) + 36 * (round - 1)]);
        }
      }
      if (isNaN(scoreSum) || isNaN(scoreSumAll)) {
        document.getElementById(
          distance + "Sum-" + Number(j + 6 * (round - 1))
        ).textContent = "";
        document.getElementById(
          distance + "All-" + Number(j + 6 * (round - 1))
        ).textContent = "";
      } else {
        document.getElementById(
          distance + "Sum-" + Number(j + 6 * (round - 1))
        ).textContent = scoreSum;
        document.getElementById(
          distance + "All-" + Number(j + 6 * (round - 1))
        ).textContent = scoreSumAll;
      }
    }
  }
}

//record

//日付の更新時の処理
function changeDateInput(date) {
  recordDate.textContent = date.value;
  for (let i = 0; i < score.length; i++) {
    if (score[i][0] == date.value) {
      makeScoreTable(i);
      makeGoodScoreTable(i);
    }
  }
}

//memo

//memoの削除をsettingで
var memoContent = [];
//localstorageの取得
if (localStorage.getItem("memoContent")) {
  memoContent = JSON.parse(localStorage.getItem("memoContent"));
  makeMemo();
}

function makeMemo() {
  document.getElementById("memoMain").innerHTML = "";
  for (let j = 0; j < memoContent.length; j++) {
    var clone = memoFolderTemplate.content.cloneNode(true);
    document.getElementById("memoMain").appendChild(clone);
    document.getElementById("memoFolder").setAttribute("id", "memoFolder" + j);
    document.getElementById("memoInput").setAttribute("id", "memoInput" + j);
    document.getElementById("memoList").setAttribute("id", "memoList" + j);
    document.getElementById("memoTitle").textContent = memoContent[j][0];
    span = document.createElement("span");
    span.classList.add("material-symbols-outlined");
    span.setAttribute("id", "memoFolderDelete" + j);
    span.setAttribute("onclick", "memoFolderDeleteClick(this)");
    span.textContent = "delete";
    document.getElementById("memoTitle").append(span);
    document.getElementById("memoTitle").setAttribute("id", "");

    for (let i = 1; i < memoContent[j].length; i++) {
      div = document.createElement("div");
      div.classList.add("memoItem");
      document.getElementById("memoList" + j).append(div);
      p = document.createElement("p");
      p.className = memoContent[j][i][1] ? "memoText checked" : "memoText";
      p.setAttribute("id", "memoText" + j + "-" + i);
      p.setAttribute("onclick", "memoTextClick(this)");
      p.textContent = memoContent[j][i][0];
      div.append(p);

      span = document.createElement("span");
      span.classList.add("material-symbols-outlined");
      span.setAttribute("id", "memoItemDelete" + j + "-" + i);
      span.setAttribute("onclick", "memoDeleteClick(this)");
      span.textContent = "delete";
      div.append(span);
    }
  }
}
function memoDeleteClick(item) {
  if (window.confirm("消したくなることを書いたってコト?")) {
    console.log(item.id);
    let num = item.id.substring(14).split("-").map(Number);
    memoContent[num[0]].splice(num[1], 1);
    localStorage.setItem("memoContent", JSON.stringify(memoContent));
    makeMemo();
  }
}
function memoFolderDeleteClick(item) {
  if (window.confirm("ほんとに消えるが？")) {
    console.log(item.id);
    let num = item.id.substring(16);
    memoContent.splice(num, 1);
    localStorage.setItem("memoContent", JSON.stringify(memoContent));
    makeMemo();
  }
}
function addNewFolder() {
  folderName = prompt("Folderの名前を入力してください");
  if (folderName) {
    memoContent.push([folderName]);
    localStorage.setItem("memoContent", JSON.stringify(memoContent));
    makeMemo();
  }
}
//memoの追加
function memoClick(memoInput, memoId) {
  event.preventDefault();
  console.log(memoInput);
  var id = memoId.substring(9);
  memoContent[id].push([memoInput, false]);

  div = document.createElement("div");
  div.classList.add("memoItem");
  document.getElementById("memoList" + id).append(div);

  p = document.createElement("p");
  p.className = "memoText";
  p.setAttribute(
    "id",
    "memoText" + id + "-" + Number(memoContent[id].length - 1)
  );
  p.setAttribute("onclick", "memoTextClick(this)");
  p.textContent = memoInput;
  div.append(p);
  span = document.createElement("span");
  span.classList.add("material-symbols-outlined");
  span.setAttribute(
    "id",
    "memoItemDelete" + id + "-" + Number(memoContent[id].length - 1)
  );
  span.setAttribute("onclick", "memoDeleteClick(this)");
  span.textContent = "delete";
  div.append(span);

  document.getElementById("memoInput" + id).value = "";
  localStorage.setItem("memoContent", JSON.stringify(memoContent));
}
//表示,非表示の切り替え
function memoTextClick(item) {
  event.preventDefault();
  item.classList.toggle("checked");
  for (let j = 0; j < memoContent.length; j++) {
    for (let i = 1; i < memoContent[j].length; i++) {
      if (item === document.getElementById("memoText" + j + "-" + i)) {
        memoContent[j][i][1] = !memoContent[j][i][1];
        localStorage.setItem("memoContent", JSON.stringify(memoContent));
      }
    }
  }
}

//setting
function changeTheme(theme) {
  document.getElementById("html").className = theme;
  localStorage.setItem("theme", JSON.stringify(theme));
}

//以下デバック用のボタン

function settingScoreAllRemove() {
  if (window.confirm("スコアが消えるよん")) {
    localStorage.removeItem("score");
    window.location.reload();
  }
}

function settingDataAllRemove() {
  if (window.confirm("全消したすかる")) {
    localStorage.clear();
    window.location.reload();
  }
}
function memoCheckedRemove() {
  if (window.confirm("消したくなることを書いたってコト?")) {
    localStorage.removeItem("memoContent");
    window.location.reload();
  }
}
function settingShowLocalstorage() {
  alert(JSON.parse(localStorage.getItem("memoContent")));
  alert(JSON.parse(localStorage.getItem("distance")));
  alert(JSON.parse(localStorage.getItem("score")));
  alert(JSON.parse(localStorage.getItem("goal")));
  alert(JSON.parse(localStorage.getItem("theme")));
  alert(JSON.parse(localStorage.getItem("img")));
}
function changeGoal() {
  goal = prompt("目標点数を入力してください(半角数字のみ)");
  localStorage.setItem("goal", goal);
}
function changeGoodScoreRound() {
  goodScoreRound = prompt("何ラウンド分のいいとこ取りをするか(半角数字のみ)");
  localStorage.setItem("goodScoreRound", goodScoreRound);
}
function changeTitle(){
  title = prompt("タイトルを入力してください")
  localStorage.setItem("title", title);
  document.getElementById("title").textContent = title
}
function imgInput(){
  const file =document.getElementById("imgInput").files[0]
  if(file){
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function(){
    localStorage.setItem("img",reader.result)
  }}else{
    localStorage.removeItem("img")
  }
window.location.reload()
}
function imgLoad(){
  if(localStorage.getItem("img")){
  document.getElementById("home").style.backgroundImage = "url("+localStorage.getItem("img")+")"
  document.getElementById("record").style.backgroundImage = "url("+localStorage.getItem("img")+")"
  document.getElementById("memo").style.backgroundImage = "url("+localStorage.getItem("img")+")"
  document.getElementById("setting").style.backgroundImage = "url("+localStorage.getItem("img")+")"
}else{
  document.getElementById("home").style.backgroundImage = ""
  document.getElementById("record").style.backgroundImage = ""  
  document.getElementById("memo").style.backgroundImage = ""
  document.getElementById("setting").style.backgroundImage = ""

  }
}

//serviceWorker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("serviceWorker.js").then(
      () => {
        console.log("登録成功");
      },
      () => {
        console.log("登録失敗");
      }
    );
  });
}
