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
  console.log("a");
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

//memoの削除をsettingで
var memoContent = [];
//localstorageの取得
if (localStorage.getItem("memoContent")) {
  memoContent = JSON.parse(localStorage.getItem("memoContent"));
  makeMemo(memoContent);
}
var score = [[]];
//localstorageのスコアの内容を取る
if (localStorage.getItem("score") && localStorage.getItem("score") !== "[]") {
  score = JSON.parse(localStorage.getItem("score"));
  //不要な日付を削除
  for (let i = 1; i < score.length; i++) {
    if (
      score[i][1].length +
        score[i][2].length +
        score[i][3].length +
        score[i][4].length +
        score[i][5].length +
        score[i][6].length ==
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
    max = 0;
    for (let i = 0; i < data[j - 1].length - 5; i++) {
      data[j - 1][i] = Number(
        data[j - 1][i] +
          data[j - 1][i + 1] +
          data[j - 1][i + 2] +
          data[j - 1][i + 3] +
          data[j - 1][i + 4] +
          data[j - 1][i + 5]
      );
    }
    for (let i = 0; i < 5; i++) {
      data[j - 1].pop();
    }
    for (let i = 0; i < data[j - 1].length; i++) {
      if (!isNaN(data[j - 1][i])) {
        max = Math.max(data[j - 1][i], max);
      }
    }
    num = data[j - 1].indexOf(max) * 6;
    data[j - 1] = score[day][j].slice(num, num + 36);

    document.getElementById(distance + "-goodScoreTable").innerHTML = "";
    scoreTable = document.getElementById(distance + "-goodScoreTable");
    var clone = scoreTableTemplate.content.cloneNode(true);
    scoreTable.appendChild(clone);
    document.getElementById("scoreInfo").textContent = distance + "-goodScore";
    document.getElementById("scoreInfo").setAttribute("id", "");

    sumAll = 0;
    for (let end = 0; end < 6; end++) {
      sum = 0;
      row = document.getElementById("row-" + Number(end + 1));
      for (let i = 0; i < 6; i++) {
        td = document.createElement("td");
        td.textContent = data[j - 1][6 * end + i];
        row.appendChild(td);
        if (data[j - 1][6 * end + i] == "X") {
          sum += 10;
          sumAll += 10;
        } else if (data[j - 1][6 * end + i] == "M") {
        } else {
          sum += Number(data[j - 1][6 * end + i]);
          sumAll += Number(data[j - 1][6 * end + i]);
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
  console.log(addTableSelect.value);
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

function makeMemo(content) {
  if (content !== null) {
    for (let i = 0; i < content.length; i++) {
      p = document.createElement("p");
      if (content[i][1]) {
        p.classList.add("checked");
      }
      p.classList.add("memoItem");
      p.setAttribute("onclick", "memoItemClick(this)");
      p.setAttribute("id", "memo-" + i);
      p.textContent = content[i][0];
      memoList.prepend(p);
    }
  }
}
//memoの追加
function memoClick(memoInput) {
  event.preventDefault();
  if (memoContent == null) {
    memoContent = [];
  }
  memoContent.push([memoInput, false]);
  localStorage.setItem("memoContent", JSON.stringify(memoContent));
  p = document.createElement("p");
  p.classList.add("memoItem");
  p.setAttribute("id", "memo-" + Number(memoContent.length - 1));
  p.setAttribute("onclick", "memoItemClick(this)");
  p.textContent = memoInput;
  memoList.prepend(p);
  document.getElementById("memoInput").value = "";
}
//表示,非表示の切り替え
function memoItemClick(item) {
  event.preventDefault();
  item.classList.toggle("checked");
  for (let i = 0; i < memoContent.length; i++) {
    if (memoContent[i][0] == item.textContent) {
      memoContent[i][1] = !memoContent[i][1];
      localStorage.setItem("memoContent", JSON.stringify(memoContent));
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
    if (!window.confirm("続きの話をskipしますか")) {
      alert("'◯◯ってコト?'が最近ちいかわとやらに勘違いされる。");
      alert("誠に遺憾です。(by 知り合いのミオファ)");
      alert("私もとても由々しき事態と認識しております");
      alert("'◯◯って...コト?'と'◯◯ってコト?'");
      alert("この大きな違いにすら気づいていないとは");
      alert("日々の生活の中でしつかりと構文を理解、");
      alert("読解ができていないのでは無いかと心配になります");
      alert("この溜めの有無によってホロリスなのか");
      alert("それともちいかわファンなのか");
      alert("次の会話において組み込む語録が大きく変わっていきます");
      alert("日常に溢れている身内ネタにレーダーを張り");
      alert("同じ趣味の同士を見つけましょう");
      alert("ノー筋肉！ノーライフ！");
    }
    memoContent = JSON.parse(localStorage.getItem("memoContent"));

    num = memoContent.length;

    num1 = 0;
    for (let i = 0; i < num; i++) {
      document.getElementById("memo-" + i).remove();
      console.log(memoContent[num1]);
      if (memoContent[num1][1]) {
        memoContent.splice(num1, 1);
        num1 -= 1;
      }
      num1 += 1;
    }
    localStorage.setItem("memoContent", JSON.stringify(memoContent));
    makeMemo(memoContent);
  }
}
function settingShowLocalstorage() {
  alert(JSON.parse(localStorage.getItem("memoContent")));
  alert(JSON.parse(localStorage.getItem("distance")));
  alert(JSON.parse(localStorage.getItem("score")));
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
