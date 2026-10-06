const express = require("express");
const crypto = require("crypto");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
EXPRESS
========================= */

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* =========================
DATABASE
========================= */

const dbPath =
process.env.DB_PATH ||
path.join(__dirname, "shop.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
gmail TEXT UNIQUE NOT NULL,
uid TEXT UNIQUE NOT NULL,
balance INTEGER NOT NULL DEFAULT 0,
created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
id INTEGER PRIMARY KEY AUTOINCREMENT,
product TEXT NOT NULL,
username TEXT NOT NULL,
password TEXT NOT NULL,
level INTEGER NOT NULL,
rarity TEXT NOT NULL,
info TEXT NOT NULL,
sold INTEGER NOT NULL DEFAULT 0,
sold_uid TEXT,
sold_at TEXT
);

CREATE TABLE IF NOT EXISTS history (
id INTEGER PRIMARY KEY AUTOINCREMENT,
uid TEXT NOT NULL,
product TEXT NOT NULL,
account_id INTEGER NOT NULL,
username TEXT NOT NULL,
password TEXT NOT NULL,
level INTEGER NOT NULL,
rarity TEXT NOT NULL,
info TEXT NOT NULL,
price INTEGER NOT NULL,
created_at TEXT NOT NULL
);
`);

/* =========================
UID CỐ ĐỊNH THEO GMAIL
========================= */

function createUID(gmail) {
return (
"PT-" +
crypto
.createHash("sha256")
.update(gmail.toLowerCase().trim())
.digest("hex")
.substring(0, 8)
.toUpperCase()
);
}

/* =========================
GIÁ
========================= */

const validPrices = {
bag5k: 5000,
tanbinh: 20000,
premium: 50000,
legendary: 100000,
vip: 200000,
ultra: 500000,
lucky: 1000000
};

/* =========================
TÊN TÚI
========================= */

const productNames = {
bag5k: "🎁 TÚI 5K",
tanbinh: "🥉 TÂN BINH",
premium: "💎 PREMIUM",
legendary: "🔥 LEGENDARY",
vip: "👑 VIP",
ultra: "⚡ ULTRA",
lucky: "🍀 LUCKY"
};

/* =========================
TẠO ACC DEMO
========================= */

function createDemoAccounts() {

const exists =
db.prepare(
"SELECT COUNT(*) AS count FROM accounts"
).get().count;

if (exists > 0) {
return;
}

const bags = [
{
product: "bag5k",
count: 20,
level: 5,
rarity: "Thường"
},

```
{
  product: "tanbinh",
  count: 10,
  level: 10,
  rarity: "Thường"
},

{
  product: "premium",
  count: 10,
  level: 20,
  rarity: "Hiếm"
},

{
  product: "legendary",
  count: 10,
  level: 30,
  rarity: "Siêu hiếm"
},

{
  product: "vip",
  count: 10,
  level: 40,
  rarity: "VIP"
},

{
  product: "ultra",
  count: 10,
  level: 50,
  rarity: "Cực hiếm"
},

{
  product: "lucky",
  count: 10,
  level: 60,
  rarity: "May mắn"
}
```

];

const insert =
db.prepare(`       INSERT INTO accounts
      (
        product,
        username,
        password,
        level,
        rarity,
        info
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

const transaction =
db.transaction(() => {

```
  for (const bag of bags) {

    for (let i = 1; i <= bag.count; i++) {

      const number =
        String(i).padStart(2, "0");

      insert.run(
        bag.product,
        `demo_${bag.product}_${number}`,
        "demo12345",
        bag.level + Math.floor((i - 1) / 3),
        bag.rarity,
        `ACC DEMO ${bag.product.toUpperCase()} #${number}`
      );
    }
  }
});
```

transaction();

console.log(
"Đã tạo kho acc demo."
);
}

createDemoAccounts();

/* =========================
TELEGRAM
========================= */

async function sendTelegram(message) {

const token =
process.env.TELEGRAM_BOT_TOKEN;

const chatId =
process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
console.log(
"Telegram chưa được cấu hình."
);
return;
}

try {

```
const response =
  await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    }
  );

const result =
  await response.json();

if (!result.ok) {
  console.log(
    "Telegram error:",
    result
  );
}
```

} catch (error) {

```
console.log(
  "Telegram error:",
  error.message
);
```

}
}

/* =========================
TÌM USER
========================= */

function getUserByUID(uid) {

return db
.prepare(
"SELECT * FROM users WHERE uid = ?"
)
.get(uid);
}

/* =========================
LOGIN
========================= */

app.post("/api/login", (req, res) => {

const gmail =
String(req.body.gmail || "")
.trim()
.toLowerCase();

if (!gmail.endsWith("@gmail.com")) {

```
return res.json({
  success: false,
  message: "Vui lòng nhập đúng Gmail."
});
```

}

let user =
db
.prepare(
"SELECT * FROM users WHERE gmail = ?"
)
.get(gmail);

if (!user) {

```
const uid =
  createUID(gmail);

db.prepare(`
  INSERT INTO users
  (
    gmail,
    uid,
    balance,
    created_at
  )
  VALUES (?, ?, 0, ?)
`).run(
  gmail,
  uid,
  new Date().toISOString()
);

user =
  db
    .prepare(
      "SELECT * FROM users WHERE gmail = ?"
    )
    .get(gmail);
```

}

res.json({
success: true,

```
user: {
  gmail: user.gmail,
  uid: user.uid,
  balance: user.balance
}
```

});
});

/* =========================
SHOP STATUS
========================= */

app.get("/api/status", (req, res) => {

const stock = {};

for (const product of Object.keys(validPrices)) {

```
const row =
  db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM accounts
      WHERE product = ?
      AND sold = 0
    `)
    .get(product);

stock[product] =
  row.count;
```

}

res.json({
success: true,
message: "PT BAG SHOP đang hoạt động.",
stock: stock
});
});

/* =========================
BỐC ACC
========================= */

app.post("/api/buy", async (req, res) => {

const uid =
String(req.body.uid || "").trim();

const product =
String(req.body.product || "").trim();

const user =
getUserByUID(uid);

if (!user) {

```
return res.json({
  success: false,
  code: "NOT_LOGGED_IN",
  message:
    "Phiên đăng nhập không hợp lệ."
});
```

}

if (!validPrices[product]) {

```
return res.json({
  success: false,
  message: "Túi không tồn tại."
});
```

}

const price =
validPrices[product];

if (user.balance < price) {

```
return res.json({
  success: false,
  code: "NOT_ENOUGH",
  message: "Số dư không đủ."
});
```

}

/*
Transaction giúp tránh 2 khách
cùng lấy một acc.
*/

const buyTransaction =
db.transaction(() => {

```
  const account =
    db
      .prepare(`
        SELECT *
        FROM accounts
        WHERE product = ?
        AND sold = 0
        ORDER BY id ASC
        LIMIT 1
      `)
      .get(product);

  if (!account) {
    return null;
  }

  const now =
    new Date().toISOString();

  db.prepare(`
    UPDATE accounts
    SET
      sold = 1,
      sold_uid = ?,
      sold_at = ?
    WHERE id = ?
    AND sold = 0
  `).run(
    uid,
    now,
    account.id
  );

  db.prepare(`
    UPDATE users
    SET balance = balance - ?
    WHERE uid = ?
    AND balance >= ?
  `).run(
    price,
    uid,
    price
  );

  db.prepare(`
    INSERT INTO history
    (
      uid,
      product,
      account_id,
      username,
      password,
      level,
      rarity,
      info,
      price,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uid,
    product,
    account.id,
    account.username,
    account.password,
    account.level,
    account.rarity,
    account.info,
    price,
    now
  );

  return {
    account,
    now
  };
});
```

if (!buyTransaction) {

```
return res.json({
  success: false,
  code: "OUT_OF_STOCK",
  message:
    "Túi này hiện đã hết hàng."
});
```

}

const updatedUser =
getUserByUID(uid);

const account =
buyTransaction.account;

const telegramMessage =
`🎁 CÓ KHÁCH VỪA BỐC ACC

📦 Túi: ${productNames[product]}
💰 Giá: ${price.toLocaleString("vi-VN")}đ

👤 Gmail: ${user.gmail}
🆔 UID: ${user.uid}

🎮 Username: ${account.username}
🔐 Password: ${account.password}
⭐ Level: ${account.level}
💎 Độ hiếm: ${account.rarity}
📝 Thông tin: ${account.info}

💰 Số dư còn lại:
${updatedUser.balance.toLocaleString("vi-VN")}đ

⏰ ${new Date().toLocaleString("vi-VN")}`;

await sendTelegram(
telegramMessage
);

res.json({
success: true,

```
account: {
  username: account.username,
  password: account.password,
  level: account.level,
  rarity: account.rarity,
  info: account.info
},

balance:
  updatedUser.balance
```

});
});

/* =========================
LỊCH SỬ KHÁCH
========================= */

app.get("/api/history", (req, res) => {

const uid =
String(req.query.uid || "").trim();

const user =
getUserByUID(uid);

if (!user) {

```
return res.json({
  success: false,
  message: "Không tìm thấy UID."
});
```

}

const history =
db
.prepare(`         SELECT
          product,
          username,
          password,
          level,
          rarity,
          info,
          price,
          created_at AS time
        FROM history
        WHERE uid = ?
        ORDER BY id DESC
      `)
.all(uid);

res.json({
success: true,
history: history.map(item => ({
product: item.product,

```
  account: {
    username: item.username,
    password: item.password,
    level: item.level,
    rarity: item.rarity,
    info: item.info
  },

  price: item.price,
  time: item.time
}))
```

});
});

/* =========================
ADMIN
========================= */

const ADMIN_PASSWORD =
process.env.ADMIN_PASSWORD ||
"congdang86";

const ADMIN_TOKEN =
process.env.ADMIN_TOKEN ||
"PTG-ADMIN-SECRET-2026";

function checkAdmin(req, res) {

const token =
req.headers.authorization ||
req.query.token ||
req.body.token;

if (token !== ADMIN_TOKEN) {

```
res.status(403).json({
  success: false,
  message: "Không có quyền admin."
});

return false;
```

}

return true;
}

/* =========================
ADMIN LOGIN
========================= */

app.post("/api/admin/login", (req, res) => {

const password =
String(req.body.password || "");

if (password !== ADMIN_PASSWORD) {

```
return res.json({
  success: false,
  message: "Sai mật khẩu admin."
});
```

}

res.json({
success: true,
token: ADMIN_TOKEN
});
});

/* =========================
ADMIN TÌM USER
========================= */

app.get("/api/admin/user", (req, res) => {

if (!checkAdmin(req, res)) {
return;
}

const uid =
String(req.query.uid || "").trim();

const user =
getUserByUID(uid);

if (!user) {

```
return res.json({
  success: false,
  message: "Không tìm thấy UID."
});
```

}

const historyCount =
db
.prepare(`         SELECT COUNT(*) AS count
        FROM history
        WHERE uid = ?
      `)
.get(uid).count;

res.json({
success: true,

```
user: {
  gmail: user.gmail,
  uid: user.uid,
  balance: user.balance,
  historyCount: historyCount
}
```

});
});

/* =========================
ADMIN CỘNG TIỀN
========================= */

app.post("/api/admin/add-money", (req, res) => {

if (!checkAdmin(req, res)) {
return;
}

const uid =
String(req.body.uid || "").trim();

const amount =
Number(req.body.amount);

if (
!Number.isFinite(amount) ||
amount <= 0
) {

```
return res.json({
  success: false,
  message: "Số tiền không hợp lệ."
});
```

}

const user =
getUserByUID(uid);

if (!user) {

```
return res.json({
  success: false,
  message: "Không tìm thấy UID."
});
```

}

db.prepare(`     UPDATE users
    SET balance = balance + ?
    WHERE uid = ?
  `).run(
amount,
uid
);

const updated =
getUserByUID(uid);

res.json({
success: true,
balance: updated.balance
});
});

/* =========================
ADMIN XEM LỊCH SỬ
========================= */

app.get("/api/admin/history", (req, res) => {

if (!checkAdmin(req, res)) {
return;
}

const uid =
String(req.query.uid || "").trim();

const user =
getUserByUID(uid);

if (!user) {

```
return res.json({
  success: false,
  message: "Không tìm thấy UID."
});
```

}

const history =
db
.prepare(`         SELECT
          product,
          username,
          password,
          level,
          rarity,
          info,
          price,
          created_at AS time
        FROM history
        WHERE uid = ?
        ORDER BY id DESC
      `)
.all(uid);

res.json({
success: true,
history: history.map(item => ({
product: item.product,

```
  account: {
    username: item.username,
    password: item.password,
    level: item.level,
    rarity: item.rarity,
    info: item.info
  },

  price: item.price,
  time: item.time
}))
```

});
});

/* =========================
RESET KHO DEMO
CHỈ DÙNG KHI TEST
========================= */

app.post("/api/admin/reset-demo-stock", (req, res) => {

if (!checkAdmin(req, res)) {
return;
}

db.prepare(`     DELETE FROM accounts
  `).run();

db.prepare(`     DELETE FROM history
  `).run();

createDemoAccounts();

res.json({
success: true,
message:
"Đã tạo lại kho acc demo."
});
});

/* =========================
TRANG WEB
========================= */

app.get("/", (req, res) => {

res.sendFile(
path.join(
__dirname,
"public",
"index.html"
)
);
});

app.get("/admin", (req, res) => {

res.sendFile(
path.join(
__dirname,
"public",
"admin.html"
)
);
});

/* =========================
START
========================= */

app.listen(
PORT,
"0.0.0.0",
() => {

```
console.log(
  `PT BAG SHOP chạy tại port ${PORT}`
);
```

}
);
