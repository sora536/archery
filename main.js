const home = document.getElementById("home");
const homeButton = document.getElementById("homeButton");
const record = document.getElementById("record");
const recordButton = document.getElementById("recordButton");
const group =document.getElementById("group");
const groupButton = document.getElementById("groupButton");
const memo = document.getElementById("memo");
const memoButton = document.getElementById("memoButton");
const setting = document.getElementById("setting");
const settingButton = document.getElementById("settingButton");
const homeScoreInfo = document.getElementById("homeScoreInfo");
const select = document.getElementById("select");
const finalSelect = document.getElementById("finalSelect");
const addTableSelect = document.getElementById("addTableSelect");
const memoList = document.getElementById("memoList");
const recordDate = document.getElementById("recordDate");
const recordDateInput = document.getElementById("recordDateInput");
const toggle = document.getElementById("toggle");
const scoreButton = document.getElementById("scoreButton");
const themeSelect = document.getElementById("themeSelect");
const titleElement = document.getElementById("title");
const htmlElement = document.getElementById("html");
const scoreTableTemplate = document.getElementById("scoreTableTemplate");
const memoFolderTemplate = document.getElementById("memoFolderTemplate");

const DISTANCES = ["70m", "50m", "30m", "18m", "10m"];
const HOME_DISTANCE = "home";
const STORAGE_KEY = "archeryAppData";
const DEFAULT_DISTANCE = "70m";
const DEFAULT_GOALS = {
  "70m": 0,
  "50m": 200,
  "30m": 300,
  "18m": 320,
  "10m": 350,
};

/**
 * appData オブジェクト構造:
 * {
 *   score: [
 *     {
 *       date: "2026年6月7日",
 *       scores: {
 *         "70m": [10, 9, 8, ...],    // 各距離のスコア配列（6射単位）
 *         "50m": [...],
 *         "30m": [...],
 *         "18m": [...],
 *         "10m": [...],
 *         home: [...]                 // 入力中のスコア
 *       }
 *     },
 *     ...
 *   ],
 *   distance: "70m",                  // 現在選択中の距離
 *   goodScoreRound: 1,                // いいとこどり用ラウンド数（1 = 36射, 2 = 72射）
 *   title: "Ianse◯的さむしんぐ",      // アプリタイトル
 *   theme: "",                        // テーマ名（""="basic", "Shigure"等）
 *   memoContent: [                    // メモフォルダ構造
 *     ["フォルダ名", ["メモ1", false], ["メモ2", true]],  // true=チェック済み
 *     ...
 *   ],
 *   img: null,                        // 背景画像（Data URL）
 *   goal: 0                           // 70m用のカスタムゴール
 * }
 */

/**
 * 新しいスコアエントリを作成
 * @param {string} date - 日付文字列（"2026年6月7日" 形式）
 * @returns {object} 空のスコアオブジェクト
 */
function createEmptyScoreEntry(date) {
  return {
    date,
    scores: {
      "70m": [],
      "50m": [],
      "30m": [],
      "18m": [],
      "10m": [],
      home: [],
    },
  };
}

function getDistanceIndex(distance) {
  const index = DISTANCES.indexOf(distance);
  return index === -1 ? null : index + 1;
}

/**
 * 指定日付・距離のスコア配列を取得（安全）
 * @param {number} dayIndex - 日付インデックス（0 = 今日）
 * @param {string} distance - 距離（"70m" など、または "home" = 入力中）
 * @returns {array} スコア配列
 */
function getScoreColumn(dayIndex, distance) {
  if (!score[dayIndex] || typeof score[dayIndex] !== "object") {
    score[dayIndex] = createEmptyScoreEntry(day);
  }
  const dayEntry = score[dayIndex];
  if (distance === HOME_DISTANCE) {
    return Array.isArray(dayEntry.scores?.home) ? dayEntry.scores.home : [];
  }
  return Array.isArray(dayEntry.scores?.[distance]) ? dayEntry.scores[distance] : [];
}

/**
 * 指定日付・距離のスコア配列を設定（安全）
 * @param {number} dayIndex - 日付インデックス
 * @param {string} distance - 距離（"70m" など、または "home"）
 * @param {array} values - 新しいスコア配列
 */
function setScoreColumn(dayIndex, distance, values) {
  if (!score[dayIndex] || typeof score[dayIndex] !== "object") {
    score[dayIndex] = createEmptyScoreEntry(day);
  }
  if (!score[dayIndex].scores || typeof score[dayIndex].scores !== "object") {
    score[dayIndex].scores = createEmptyScoreEntry(day).scores;
  }
  if (distance === HOME_DISTANCE) {
    score[dayIndex].scores.home = values;
    return;
  }
  if (DISTANCES.includes(distance)) {
    score[dayIndex].scores[distance] = values;
  }
}

function getGoal(distance) {
  if (distance === "70m") {
    return appData.goal || DEFAULT_GOALS["70m"];
  }
  return DEFAULT_GOALS[distance] || 0;
}

/**
 * localStorage から JSON を安全に読み込み
 * @param {string} key - ストレージキー
 * @param {*} fallback - パース失敗時の代替値
 * @returns {*} パース済みオブジェクト、または fallback
 */
function loadJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`localStorage ${key} parse failed:`, error);
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeScoreEntry(entry) {
  if (Array.isArray(entry)) {
    return {
      date: String(entry[0] || day),
      scores: {
        "70m": Array.isArray(entry[1]) ? entry[1] : [],
        "50m": Array.isArray(entry[2]) ? entry[2] : [],
        "30m": Array.isArray(entry[3]) ? entry[3] : [],
        "18m": Array.isArray(entry[4]) ? entry[4] : [],
        "10m": Array.isArray(entry[5]) ? entry[5] : [],
        home: Array.isArray(entry[6]) ? entry[6] : [],
      },
    };
  }
  if (entry && typeof entry === "object") {
    return {
      date: String(entry.date || day),
      scores: {
        "70m": Array.isArray(entry.scores?.["70m"]) ? entry.scores["70m"] : [],
        "50m": Array.isArray(entry.scores?.["50m"]) ? entry.scores["50m"] : [],
        "30m": Array.isArray(entry.scores?.["30m"]) ? entry.scores["30m"] : [],
        "18m": Array.isArray(entry.scores?.["18m"]) ? entry.scores["18m"] : [],
        "10m": Array.isArray(entry.scores?.["10m"]) ? entry.scores["10m"] : [],
        home: Array.isArray(entry.scores?.home) ? entry.scores.home : [],
      },
    };
  }
  return createEmptyScoreEntry(day);
}

function createDefaultAppData() {
  return {
    score: [createEmptyScoreEntry(day)],
    distance: DEFAULT_DISTANCE,
    goodScoreRound: 1,
    title: "Ianseo的さむしんぐ",
    theme: "",
    memoContent: [],
    img: null,
    goal: 0,
  };
}

function migrateLegacyData() {
  const legacyScore = loadJSON("score", null);
  const legacyDistance = loadJSON("distance", null);
  const legacyRound = loadJSON("goodScoreRound", null);
  const legacyTitle = loadJSON("title", null);
  const legacyTheme = loadJSON("theme", null);
  const legacyMemo = loadJSON("memoContent", null);
  const legacyImg = loadJSON("img", null);
  const legacyGoal = loadJSON("goal", null);

  if (
    legacyScore === null &&
    legacyDistance === null &&
    legacyRound === null &&
    legacyTitle === null &&
    legacyTheme === null &&
    legacyMemo === null &&
    legacyImg === null &&
    legacyGoal === null
  ) {
    return null;
  }

  const migrated = {
    score: Array.isArray(legacyScore) ? legacyScore.map(normalizeScoreEntry) : [createEmptyScoreEntry(day)],
    distance: DISTANCES.includes(legacyDistance) ? legacyDistance : DEFAULT_DISTANCE,
    goodScoreRound: Math.max(1, Number(legacyRound) || 1),
    title: typeof legacyTitle === "string" ? legacyTitle : "Ianseo的さむしんぐ",
    theme: typeof legacyTheme === "string" ? legacyTheme : "",
    memoContent: Array.isArray(legacyMemo) ? legacyMemo : [],
    img: typeof legacyImg === "string" ? legacyImg : null,
    goal: Number(legacyGoal) || 0,
  };

  ["score", "distance", "goodScoreRound", "title", "theme", "memoContent", "img", "goal"].forEach((key) => {
    localStorage.removeItem(key);
  });
  saveJSON(STORAGE_KEY, migrated);
  return migrated;
}

/**
 * appData を正規化し、不正な値を補正
 * @param {object} raw - 入力オブジェクト（可能性のある旧構造）
 * @returns {object} 正規化済みの appData
 */
function normalizeAppData(raw) {
  if (!raw || typeof raw !== "object") {
    return createDefaultAppData();
  }
  const data = createDefaultAppData();
  if (Array.isArray(raw.score) && raw.score.length > 0) {
    data.score = raw.score.map(normalizeScoreEntry);
  }
  if (typeof raw.distance === "string" && DISTANCES.includes(raw.distance)) {
    data.distance = raw.distance;
  }
  data.goodScoreRound = Math.max(1, Number(raw.goodScoreRound) || 1);
  data.title = typeof raw.title === "string" && raw.title.length ? raw.title : data.title;
  data.theme = typeof raw.theme === "string" ? raw.theme : data.theme;
  data.memoContent = Array.isArray(raw.memoContent) ? raw.memoContent : data.memoContent;
  data.img = typeof raw.img === "string" ? raw.img : data.img;
  data.goal = Number(raw.goal) || data.goal;
  return data;
}

/**
 * appData を localStorage から読み込む
 * 初回起動時に旧キーから新キーへ自動マイグレーション
 * @returns {object} 正規化済みの appData
 */
function loadAppData() {
  const legacy = migrateLegacyData();
  if (legacy) {
    return normalizeAppData(legacy);
  }
  const raw = loadJSON(STORAGE_KEY, null);
  const normalized = normalizeAppData(raw);
  if (raw && typeof raw === "object") {
    saveJSON(STORAGE_KEY, normalized);
  }
  return normalized;
}

/**
 * appData を localStorage に保存
 * 変更時に常に実行して、旧データ構造を防止
 */
function saveAppData() {
  saveJSON(STORAGE_KEY, appData);
}

/**
 * 詳しい説明表示（初回使用時のみ）
 */
function showWelcomeIfNeeded() {
  if (localStorage.getItem(STORAGE_KEY) === null) {
    alert("HelloWorld!ようこそ新しい世界へ");
    alert("これはアーチェリーのスコアを記録するためのwebアプリです。");
    alert("といっても自作のサイトのためあんまり高度なことはできませんが...");
    alert("基本的にスコアの記録、いいとこ取り、スコアをLINEで共有する");
    alert("これくらいしかできません。");
    alert("詳しい説明は下の歯車マークを押して見てください");
    alert("最後に'ホーム画面に追加'を押すとアプリっぽくなるのでやりましょう");
  }
}

function scoreEntryIsEmpty(entry) {
  if (!entry || typeof entry !== "object" || !entry.scores || typeof entry.scores !== "object") {
    return true;
  }
  return DISTANCES.every((distance) => Array.isArray(entry.scores[distance]) && entry.scores[distance].length === 0) &&
    Array.isArray(entry.scores.home) && entry.scores.home.length === 0;
}

/**
 * 誤入力から保護するユーティリティ
 * @param {event} event - イベントオブジェクト（箇可）
 */
function safePreventDefault(event) {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }
}

let day = new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日";
let appData = loadAppData();
showWelcomeIfNeeded();
if (localStorage.getItem(STORAGE_KEY) === null) {
  saveAppData();
}
let score = appData.score;
let memoContent = appData.memoContent;

if (score.length === 0) {
  score = [createEmptyScoreEntry(day)];
  appData.score = score;
}
if (score[0].date !== day) {
  score.unshift(createEmptyScoreEntry(day));
  appData.score = score;
}
if (!DISTANCES.includes(appData.distance)) {
  appData.distance = DEFAULT_DISTANCE;
}
homeScoreInfo.textContent = appData.distance;
select.value = appData.distance;
if (document.getElementById(appData.distance)) {
  document.getElementById(appData.distance).checked = true;
}
if (!appData.title) {
  appData.title = "Ianse◯的さむしんぐ";
}
if (appData.title) {
  document.getElementById("title").textContent = appData.title;
}
if (appData.theme) {
  if (themeSelect) {
    themeSelect.value = appData.theme;
  }
  if (htmlElement) {
    htmlElement.className = appData.theme;
  }
  if (scoreButton) {
    scoreButton.style.opacity = 0.85;
    if (appData.theme === "Transparent") {
      scoreButton.style.opacity = 0.2;
    }
  }
}
imgLoad();
setScoreTable("home", 36, 0);
//上の日付を更新
if (recordDate) {
  recordDate.textContent = day;
}
//日付選択を生成
if (recordDateInput) {
  for (let i = 0; i < score.length; i++) {
    const option = document.createElement("option");
    option.textContent = score[i].date;
    recordDateInput.appendChild(option);
  }
}
if (toggle) {
  toggle.addEventListener("click", function () {
    DISTANCES.forEach((distance) => {
      const scoreTable = document.getElementById(distance + "-scoreTable");
      const goodTable = document.getElementById(distance + "-goodScoreTable");
      if (scoreTable) {
        scoreTable.style.display = toggle.checked ? "none" : "block";
      }
      if (goodTable) {
        goodTable.style.display = toggle.checked ? "block" : "none";
      }
    });
  });
}
//スコアをlocalstorageに保存
/**
 * スコアを localStorage に保存
 */
function saveScore() {
  appData.score = score;
  saveAppData();
}

/**
 * ラインを URL エンコードして LINE 共有用 URL を生成
 * @param {string} text - 共有テキスト
 * @returns {string} LINE 特有スキキム付き URL
 */
function createLineShareUrl(text) {
  return "http://line.me/R/msg/text/?" + encodeURIComponent(text).replace(/%0A/g, "%0D%0A");
}

//フッターのクリック
/**
 * フッターナビゲーションクリック時（ページ上部のイラストを取り除け）
 * @param {element} e - クリック対象
 * @param {element} id - 詨ページ div
 */
function footerClick(e, id) {
  safePreventDefault(e);
  home.classList.remove("open");
  homeButton.classList.remove("open");
  record.classList.remove("open");
  recordButton.classList.remove("open");
  group.classList.remove("open");
  groupButton.classList.remove("open");
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
    if (document.getElementById(appData.distance)) {
      document.getElementById(appData.distance).checked = true;
    }
  }
}
//黒いやつのクリック
/**
 * ダイアログ・オーバーレイを閉じる
 */
function overlayClose() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("saveCheckWindow").style.display = "none";
  document.getElementById("addTableWindow").style.display = "none";
  select.value = appData.distance;
}
//recordのスコア氷を作る、ついで表示まで
/**
 * スコアテーブルを複数ラウンド分ごとに生成・表示
 * @param {number} day - 日付インデックス
 */
function makeScoreTable(day) {
  if (!scoreTableTemplate) {
    return;
  }
  DISTANCES.forEach((distance) => {
    const scoreTable = document.getElementById(distance + "-scoreTable");
    if (!scoreTable) {
      return;
    }
    scoreTable.innerHTML = "";
    const values = getScoreColumn(day, distance);
    const rounds = Math.ceil(values.length / 36);
    for (let round = 0; round < rounds; round++) {
      const clone = scoreTableTemplate.content.cloneNode(true);
      const scoreInfo = clone.querySelector("#scoreInfo");
      if (scoreInfo) {
        scoreInfo.textContent = `${distance}-${round + 1}`;
        scoreInfo.removeAttribute("id");
      }
      scoreTable.appendChild(clone);
      for (let end = 0; end < 6; end++) {
        const row = document.getElementById(`row-${end + 1}`);
        if (!row) {
          continue;
        }
        for (let i = 0; i < 6; i++) {
          const td = document.createElement("td");
          td.setAttribute("id", `${distance}-${36 * round + 6 * end + i}`);
          row.appendChild(td);
        }
        let td = document.createElement("td");
        td.classList.add("scoreSum");
        td.setAttribute("id", `${distance}Sum-${6 * round + end + 1}`);
        row.appendChild(td);
        td = document.createElement("td");
        td.classList.add("scoreSum");
        td.setAttribute("id", `${distance}All-${6 * round + end + 1}`);
        row.appendChild(td);
        row.removeAttribute("id");
      }
    }
    setScoreTable(distance, values.length, day);
  });
}
/**
 * 指定したスコア列から「いいとこどり」を計算する
 * @param {Array} values - getScoreColumn() が返す配列
 * @param {number} roundCount - 連続ラウンド数
 * @returns {{
 *   bestSegment: Array,
 *   bestScore: number,
 *   roundScores: number[],
 *   bestStartSegmentIndex: number
 * }}
 */
/**
 * 指定したスコア列から「いいとこどり」を計算する
 * @param {Array} values - getScoreColumn() が返す配列
 * @param {number} roundCount - 連続ラウンド数
 * @returns {{
 *   bestSegment: Array,
 *   bestScore: number,
 *   roundScores: number[],
 *   bestStartSegmentIndex: number,
 *   average36: number,
 *   shotCount: number
 * }}
 */
function getBestSegment(values, roundCount = 1) {

  // ===== 全体の平均・射数計算 =====
  let totalPoint = 0;
  let shotCount = 0;

  values.forEach((item) => {
    if (item === "X") {
      totalPoint += 10;
      shotCount++;
    } else if (item === "M") {
      shotCount++;
    } else if (item !== undefined && item !== "") {
      totalPoint += Number(item);
      shotCount++;
    }
  });

  const average36 =
    shotCount > 0
      ? (totalPoint / shotCount) * 36
      : NaN;

  // ===== 6射ごとのエンド合計 =====
  const segmentValues = [];

  for (let block = 0; block < values.length / 6; block++) {
    let subtotal = 0;

    for (let h = 0; h < 6; h++) {
      const item = values[6 * block + h];

      if (item === "X") {
        subtotal += 10;
      } else if (item === "M") {
        // Mは0点
      } else if (item === undefined || item === "") {
        subtotal = NaN;
        break;
      } else {
        subtotal += Number(item);
      }
    }

    segmentValues.push(subtotal);
  }

  // ===== スライディングウィンドウで最高区間探索 =====
  const windowSize = 6 * roundCount;
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestStartSegmentIndex = 0;

  for (let i = 0; i <= segmentValues.length - windowSize; i++) {
    let total = 0;

    for (let k = 0; k < windowSize; k++) {
      total += segmentValues[i + k];
    }

    if (!isNaN(total) && total > bestScore) {
      bestScore = total;
      bestStartSegmentIndex = i;
    }
  }

  const bestSegment = values.slice(
    bestStartSegmentIndex * 6,
    bestStartSegmentIndex * 6 + 36 * roundCount
  );

  // ===== ラウンドごとの合計 =====
  const roundScores = [];

  for (let round = 0; round < roundCount; round++) {
    let total = 0;

    for (let i = 0; i < 36; i++) {
      const value = bestSegment[36 * round + i];

      if (value === "X") {
        total += 10;
      } else if (value === "M") {
        // 0点
      } else if (value !== undefined && value !== "") {
        total += Number(value);
      }
    }

    roundScores.push(total);
  }

  return {
    bestSegment,
    bestScore,
    roundScores,
    bestStartSegmentIndex,
    average36,
    shotCount
  };
}
/**
 * いいとこどりテーブルを生成・表示
 * 連続した指定ラウンド数の中で、合計スコアが最高の区間を抽出して表示
 * @param {number} day - 日付インデックス（0 = 今日）
 */
/**
 * いいとこどりテーブルを生成・表示
 * 連続した指定ラウンド数の中で、合計スコアが最高の区間を表示する
 * @param {number} day - 日付インデックス（0 = 今日）
 */
function makeGoodScoreTable(day) {
  const roundCount = Math.max(
    1,
    Number(appData.goodScoreRound) || 1
  );

  DISTANCES.forEach((distance) => {
    const values = getScoreColumn(day, distance);

    const {
      bestSegment,
      roundScores
    } = getBestSegment(values, roundCount);

    const scoreTable = document.getElementById(
      distance + "-goodScoreTable"
    );

    if (!scoreTable) {
      return;
    }

    scoreTable.innerHTML = "";

    // ===== テーブル描画 =====
    for (let round = 1; round <= roundCount; round++) {
      let roundTotal = 0;

      const clone =
        scoreTableTemplate.content.cloneNode(true);

      const scoreInfo =
        clone.querySelector("#scoreInfo");

      if (scoreInfo) {
        scoreInfo.textContent =
          `${distance}-goodScore-${round}`;
        scoreInfo.removeAttribute("id");
      }

      scoreTable.appendChild(clone);

      for (let end = 0; end < 6; end++) {
        const row =
          document.getElementById(
            `row-${end + 1}`
          );

        if (!row) {
          continue;
        }

        let endSum = 0;

        for (let i = 0; i < 6; i++) {
          const index =
            6 * end +
            i +
            36 * (round - 1);

          const value =
            bestSegment[index];

          const td =
            document.createElement("td");

          td.textContent = value;
          row.appendChild(td);

          if (value === "X") {
            endSum += 10;
            roundTotal += 10;
          } else if (value === "M") {
            // 0点
          } else if (
            value !== undefined &&
            value !== ""
          ) {
            endSum += Number(value);
            roundTotal += Number(value);
          }
        }

        const sumTd =
          document.createElement("td");
        sumTd.classList.add("scoreSum");
        sumTd.textContent =
          isNaN(endSum) ? "" : endSum;
        row.appendChild(sumTd);

        const totalTd =
          document.createElement("td");
        totalTd.classList.add("scoreSum");
        totalTd.textContent =
          isNaN(roundTotal)
            ? ""
            : roundTotal;
        row.appendChild(totalTd);

        row.removeAttribute("id");
      }
    }

    // ===== 平均表示 =====
    const validValues = values
      .map((item) =>
        item === "X"
          ? 10
          : item === "M"
          ? 0
          : item === undefined || item === ""
          ? null
          : Number(item)
      )
      .filter(
        (value) => value !== null
      );

    const average =
      validValues.length !== 0
        ? validValues.reduce(
            (acc, num) => acc + num,
            0
          ) / validValues.length
        : NaN;

    const p =
      document.createElement("p");
    p.textContent =
      "average:" +
      (average * 36).toFixed(2);

    scoreTable.appendChild(p);

    // ===== LINE共有 =====
    const totalScore =
      roundScores.reduce(
        (acc, num) => acc + num,
        0
      );

    const a =
      document.createElement("a");

    a.setAttribute(
      "target",
      "_blank"
    );
    a.setAttribute(
      "rel",
      "nofollow noopener"
    );

    if (roundCount === 2) {
      a.setAttribute(
        "href",
        createLineShareUrl(
          `${distance}\n前半${roundScores[0]}点\n後半${roundScores[1]}点\n合計${totalScore}点でした`
        )
      );
    } else {
      a.setAttribute(
        "href",
        createLineShareUrl(
          `${distance}${totalScore}点でした`
        )
      );
    }

    a.textContent = "LINEに送る";
    scoreTable.appendChild(a);
  });
}
//新しいテーブルの用意
function newTableClick() {
  if (getScoreColumn(0, HOME_DISTANCE).length !== 0) {
    addTableSelect.value = select.value;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("addTableWindow").style.display = "block";
  }
}

//push
/**
 * 新規シートへの転送ダイアログを表示
 */
function addTable() {
  const currentScores = getScoreColumn(0, HOME_DISTANCE);
  while (currentScores.length < 36) {
    currentScores.push("");
  }
  const targetDistance = addTableSelect.value;
  setScoreColumn(0, targetDistance, getScoreColumn(0, targetDistance).concat(currentScores));
  setScoreColumn(0, HOME_DISTANCE, []);
  saveScore();
  overlayClose();
  setScoreTable(HOME_DISTANCE, 36, 0);
  saveScoreApi()
}

//素点の入力
/**
 * スコアボタンクリック時のハンドラ
 * 入力中の距離に射を追加、36射到達で距離選択ダイアログを表示
 * @param {event} event - イベントオブジェクト
 * @param {element} num - ボタン要素（textContent にスコア値）
 */
function scoreButtonClick(event, num) {
  safePreventDefault(event);
  if (day !== new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日") {
    alert("日付が変わるました。再起します");
    window.location.reload();
    return;
  }
  const currentScores = getScoreColumn(0, HOME_DISTANCE);
  if (currentScores.length === 36) {
    finalSelect.value = select.value;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("saveCheckWindow").style.display = "block";
  } else {
    currentScores.push(num.textContent);
    setScoreTable(HOME_DISTANCE, currentScores.length, 0);
  }
  saveScore();
}

//素点の削除
/**
 * スコア削除（最後の射を戻す）
 * @param {event} event - イベントオブジェクト
 */
function scoreRemove(event) {
  safePreventDefault(event);
  const currentScores = getScoreColumn(0, HOME_DISTANCE);
  currentScores.pop();
  setScoreTable(HOME_DISTANCE, currentScores.length + 1, 0);
  saveScore();
}

//最終確認のとき
/**
 * スコア警告ダイアログを閉じてスコアを正式保存
 * @param {event} event - イベントオブジェクト
 */
function saveCheckClick(event) {
  safePreventDefault(event);
  const targetDistance = finalSelect.value;
  setScoreColumn(0, targetDistance, getScoreColumn(0, targetDistance).concat(getScoreColumn(0, HOME_DISTANCE)));
  setScoreColumn(0, HOME_DISTANCE, []);
  saveScore();
  overlayClose();
  setScoreTable(HOME_DISTANCE, 36, 0);
  //ここで自動更新
  saveScoreApi()
}

function saveScoreApi(){
  const targetDistance = finalSelect.value;
  const values = getScoreColumn(0,targetDistance);
  const {bestScore,average36,shotCount} = getBestSegment(values, 1);
  window.Api.api("saveScore",{
    "maxScore":bestScore,
    "avgScore":Math.floor(average36,0),
    "totalArrows":shotCount
  })
}

//距離が変わったとき
/**
 * 距離変更時のハンドラ
 * 選択距離を appData に保存（不正値を無視）
 * @param {element} distance - select 要素（value に距離設定値）
 */
function changeDistance(distance) {
  const selectedValue = distance && distance.value ? distance.value : null;
  if (!selectedValue || !DISTANCES.includes(selectedValue)) {
    return;
  }
  appData.distance = selectedValue;
  saveAppData();
  if (homeScoreInfo) {
    homeScoreInfo.textContent = selectedValue;
  }
  const radio = document.getElementById(selectedValue);
  if (radio) {
    radio.checked = true;
  }
}

/**
 * スコアテーブルを下書き表示
 * @param {string} distance - 距離
 * @param {number} shots - 表示射数
 * @param {number} day - 日付インデックス
 */
function setScoreTable(distance, shots, day) {
  const values = distance === HOME_DISTANCE
    ? getScoreColumn(day, HOME_DISTANCE).slice()
    : getScoreColumn(day, distance).slice(-shots);

  for (let i = 0; i < shots; i++) {
    const cell = document.getElementById(`${distance}-${i}`);
    if (cell) {
      cell.textContent = values[i] === undefined ? "" : values[i];
    }
  }

  for (let round = 1; round - 1 < shots / 36; round++) {
    let scoreSumAll = 0;
    for (let j = 1; j <= 6; j++) {
      let scoreSum = 0;
      for (let i = 0; i < 6; i++) {
        const value = values[i + 6 * (j - 1) + 36 * (round - 1)];
        if (value === "X") {
          scoreSum += 10;
          scoreSumAll += 10;
        } else if (value === "M") {
        } else if (value === undefined || value === "") {
          scoreSum = NaN;
          scoreSumAll = NaN;
        } else {
          scoreSum += Number(value);
          scoreSumAll += Number(value);
        }
      }
      const sumElement = document.getElementById(`${distance}Sum-${j + 6 * (round - 1)}`);
      const allElement = document.getElementById(`${distance}All-${j + 6 * (round - 1)}`);
      if (sumElement) {
        sumElement.textContent = isNaN(scoreSum) ? "" : scoreSum;
      }
      if (allElement) {
        allElement.textContent = isNaN(scoreSumAll) ? "" : scoreSumAll;
      }
    }
  }
}

/**
 * 日付選択変更時のハンドラ
 * @param {element} date - select 要素（value に日付文字列）
 */
function changeDateInput(date) {
  recordDate.textContent = date.value;
  const scoreIndex = score.findIndex((entry) => entry.date === date.value);
  if (scoreIndex !== -1) {
    makeScoreTable(scoreIndex);
    makeGoodScoreTable(scoreIndex);
  }
}
if (Array.isArray(memoContent) && memoContent.length > 0) {
  makeMemo();
}
/**
 * メモ管理画面を再描画
 * appData.memoContent からフォルダとメモを再設定
 */
function makeMemo() {
  const memoMain = document.getElementById("memoMain");
  if (!memoMain || !memoFolderTemplate) {
    return;
  }
  memoMain.innerHTML = "";
  for (let j = 0; j < memoContent.length; j++) {
    const clone = memoFolderTemplate.content.cloneNode(true);
    memoMain.appendChild(clone);
    const memoFolder = document.getElementById("memoFolder");
    const memoInputNode = document.getElementById("memoInput");
    const memoListNode = document.getElementById("memoList");
    const memoTitleNode = document.getElementById("memoTitle");
    if (memoFolder) {
      memoFolder.setAttribute("id", "memoFolder" + j);
    }
    if (memoInputNode) {
      memoInputNode.setAttribute("id", "memoInput" + j);
    }
    if (memoListNode) {
      memoListNode.setAttribute("id", "memoList" + j);
    }
    if (memoTitleNode) {
      memoTitleNode.textContent = memoContent[j][0];
      const titleSpan = document.createElement("span");
      titleSpan.classList.add("material-symbols-outlined");
      titleSpan.setAttribute("id", "memoFolderDelete" + j);
      titleSpan.setAttribute("onclick", "memoFolderDeleteClick(this)");
      titleSpan.textContent = "delete";
      memoTitleNode.append(titleSpan);
      memoTitleNode.setAttribute("id", "");
    }
    for (let i = 1; i < memoContent[j].length; i++) {
      const div = document.createElement("div");
      div.classList.add("memoItem");
      const listNode = document.getElementById("memoList" + j);
      if (listNode) {
        listNode.append(div);
      }
      const p = document.createElement("p");
      p.className = memoContent[j][i][1] ? "memoText checked" : "memoText";
      p.setAttribute("id", "memoText" + j + "-" + i);
      p.setAttribute("onclick", "memoTextClick(event, this)");
      p.textContent = memoContent[j][i][0];
      div.append(p);
      const itemSpan = document.createElement("span");
      itemSpan.classList.add("material-symbols-outlined");
      itemSpan.setAttribute("id", "memoItemDelete" + j + "-" + i);
      itemSpan.setAttribute("onclick", "memoDeleteClick(this)");
      itemSpan.textContent = "delete";
      div.append(itemSpan);
    }
  }
}
/**
 * メモ項目削除時のハンドラ（インデックス検証付き）
 * @param {element} item - 削除ボタン
 */
function memoDeleteClick(item) {
  const id = item?.id;
  if (!id || !id.startsWith("memoItemDelete")) {
    return;
  }
  const num = id.substring(14).split("-").map(Number);
  if (num.length !== 2 || Number.isNaN(num[0]) || Number.isNaN(num[1])) {
    return;
  }
  if (!memoContent[num[0]] || memoContent[num[0]].length <= num[1]) {
    return;
  }
  // グローバル変数に削除対象を保存
  window.memoDeleteTarget = { type: "item", folderIndex: num[0], itemIndex: num[1] };
  // ダイアログを表示
  const dialog = document.getElementById("memoConfirmDialog");
  const message = document.getElementById("memoConfirmMessage");
  if (dialog && message) {
    const memoText = memoContent[num[0]][num[1]][0];
    message.textContent = "「" + memoText + "」を削除しますか？";
    dialog.style.display = "block";
  }
}
/**
 * メモフォルダ削除時のハンドラ（インデックス検証付き）
 * @param {element} item - 削除ボタン
 */
function memoFolderDeleteClick(item) {
  const id = item?.id;
  if (!id || !id.startsWith("memoFolderDelete")) {
    return;
  }
  const num = Number(id.substring(16));
  if (Number.isNaN(num) || num < 0 || num >= memoContent.length) {
    return;
  }
  // グローバル変数に削除対象を保存
  window.memoDeleteTarget = { type: "folder", index: num };
  // ダイアログを表示
  const dialog = document.getElementById("memoConfirmDialog");
  const message = document.getElementById("memoConfirmMessage");
  if (dialog && message) {
    message.textContent = "フォルダ「" + memoContent[num][0] + "」を削除しますか？";
    dialog.style.display = "block";
  }
}
/**
 * 新しいメモフォルダを作成ダイアログを表示
 */
function memoShowFolderDialog() {
  const dialog = document.getElementById("memoFolderDialog");
  const input = document.getElementById("memoFolderInput");
  if (dialog && input) {
    input.value = "";
    dialog.style.display = "block";
    input.focus();
  }
}
/**
 * 新しいメモフォルダを作成（ダイアログOKボタン）
 */
function memoFolderOk() {
  const input = document.getElementById("memoFolderInput");
  if (!input) return;
  const folderName = input.value.trim();
  if (!folderName) {
    alert("フォルダ名を入力してください");
    return;
  }
  memoContent.push([folderName]);
  appData.memoContent = memoContent;
  saveAppData();
  makeMemo();
  memoFolderCancel();
}
/**
 * フォルダ作成ダイアログを閉じる
 */
function memoFolderCancel() {
  const dialog = document.getElementById("memoFolderDialog");
  const input = document.getElementById("memoFolderInput");
  if (dialog) {
    dialog.style.display = "none";
  }
  if (input) {
    input.value = "";
  }
}
/**
 * メモ追加ボタンクリック時のハンドラ
 * フォルダに新しいメモを追加して表示
 * @param {event} event - イベントオブジェクト
 * @param {string} memoInput - 入力テキスト
 * @param {string} memoId - フォルダ ID（"memoInput0" など）
 */
function memoClick(event, memoInput, memoId) {
  safePreventDefault(event);
  const id = memoId.substring(9);
  if (!memoContent[id]) {
    return;
  }
  memoContent[id].push([memoInput, false]);
  const div = document.createElement("div");
  div.classList.add("memoItem");
  const memoListNode = document.getElementById("memoList" + id);
  if (memoListNode) {
    memoListNode.append(div);
  }
  const p = document.createElement("p");
  p.className = "memoText";
  p.setAttribute("id", "memoText" + id + "-" + Number(memoContent[id].length - 1));
  p.setAttribute("onclick", "memoTextClick(event, this)");
  p.textContent = memoInput;
  div.append(p);
  const span = document.createElement("span");
  span.classList.add("material-symbols-outlined");
  span.setAttribute("id", "memoItemDelete" + id + "-" + Number(memoContent[id].length - 1));
  span.setAttribute("onclick", "memoDeleteClick(this)");
  span.textContent = "delete";
  div.append(span);
  const memoInputNode = document.getElementById("memoInput" + id);
  if (memoInputNode) {
    memoInputNode.value = "";
  }
  appData.memoContent = memoContent;
  saveAppData();
}
/**
 * メモ選択テキストクリック時（チェック不一致）
 * @param {event} event - イベントオブジェクト
 * @param {element} item - メモ要素
 */
function memoTextClick(event, item) {
  safePreventDefault(event);
  item.classList.toggle("checked");
  for (let j = 0; j < memoContent.length; j++) {
    for (let i = 1; i < memoContent[j].length; i++) {
      if (item === document.getElementById("memoText" + j + "-" + i)) {
        memoContent[j][i][1] = !memoContent[j][i][1];
        appData.memoContent = memoContent;
        saveAppData();
      }
    }
  }
}
/**
 * テーマ変更ハンドラ
 * @param {string} theme - テーマ名（"Shigure", "Kazama" など）
 */
function changeTheme(theme) {
  document.getElementById("html").className = theme;
  appData.theme = theme;
  saveAppData();
  window.location.reload();
}
/**
 * スコア全削除
 */
function settingScoreAllRemove() {
  if (window.confirm("スコアが消えるよん")) {
    appData.score = [createEmptyScoreEntry(day)];
    saveAppData();
    window.location.reload();
  }
}
/**
 * appData 全削除（localStorage から削除）
 */
function settingDataAllRemove() {
  if (window.confirm("全消したすかる")) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
}
/**
 * メモ全削除
 */
function memoCheckedRemove() {
  if (window.confirm("消したくなることを書いたってコト?")) {
    appData.memoContent = [];
    saveAppData();
    window.location.reload();
  }
}
/**
 * 現在の appData を JSON 診断用に表示
 */
function settingShowLocalstorage() {
  alert(JSON.stringify(loadJSON(STORAGE_KEY, null), null, 2));
}
/**
 * いいとこどり用ラウンド数を変更
 * @returns {string} 変更済みのらうんど数（整数）、または 変更前の値
 */
function changeGoodScoreRound() {
  const goodScoreRound = prompt("何ラウンド分のいいとこ取りをするか(半角数字のみ)");
  appData.goodScoreRound = Number(goodScoreRound) || appData.goodScoreRound;
  saveAppData();
}
/**
 * 距離費制限ゴールを設定（70mのみ）
 */
function changeTitle(){
  const title = prompt("タイトルを入力してください");
  if (typeof title === "string") {
    appData.title = title;
    saveAppData();
    document.getElementById("title").textContent = title;
  }
}
/**
 * 背景画像を Data URL で保存し、設定
 */
function imgInput(){
  const file = document.getElementById("imgInput").files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      appData.img = reader.result;
      saveAppData();
      window.location.reload();
    };
  } else {
    appData.img = null;
    saveAppData();
    window.location.reload();
  }
}
/**
 * 背景画像を appData.img からロードして接用
 */
function imgLoad(){
  const imageData = appData.img;
  if (typeof imageData === "string" && imageData.length) {
    const theme = appData.theme || "";
    const imageUrl = "url(" + imageData + ")";
    if (theme === "Transparent") {
      document.getElementById("body").style.backgroundImage = imageUrl;
    } else {
      document.getElementById("home").style.backgroundImage = imageUrl;
      document.getElementById("record").style.backgroundImage = imageUrl;
      document.getElementById("memo").style.backgroundImage = imageUrl;
      document.getElementById("setting").style.backgroundImage = imageUrl;
    }
  } else {
    document.getElementById("body").style.backgroundImage = "";
    document.getElementById("home").style.backgroundImage = "";
    document.getElementById("record").style.backgroundImage = "";
    document.getElementById("memo").style.backgroundImage = "";
    document.getElementById("setting").style.backgroundImage = "";
  }
}
/**
 * メモ削除確認ダイアログOKボタン
 */
function memoConfirmOk() {
  const target = window.memoDeleteTarget;
  if (!target) return;
  
  if (target.type === "item") {
    // メモ項目削除
    if (memoContent[target.folderIndex] && memoContent[target.folderIndex].length > target.itemIndex) {
      memoContent[target.folderIndex].splice(target.itemIndex, 1);
      appData.memoContent = memoContent;
      saveAppData();
      makeMemo();
    }
  } else if (target.type === "folder") {
    // メモフォルダ削除
    if (memoContent.length > target.index) {
      memoContent.splice(target.index, 1);
      appData.memoContent = memoContent;
      saveAppData();
      makeMemo();
    }
  }
  
  // ダイアログを閉じる
  memoConfirmCancel();
}

/**
 * メモ削除確認ダイアログキャンセルボタン
 */
function memoConfirmCancel() {
  const dialog = document.getElementById("memoConfirmDialog");
  if (dialog) {
    dialog.style.display = "none";
  }
  window.memoDeleteTarget = null;
}

//serviceWorker(正直よくわかんない)

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
