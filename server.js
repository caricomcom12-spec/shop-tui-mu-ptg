const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* =========================
NGƯỜI DÙNG
========================= */

const users = new Map();

/* Gmail giống nhau -> UID giống nhau */
function createUID(gmail) {
const hash = crypto
.createHash("sha256")
.update(gmail.toLowerCase().trim())
.digest("hex")
.substring(0, 8)
.toUpperCase();

return "PT-" + hash;
}

/* =========================
KHO ACC DEMO
5K = 20 ACC
Các túi khác = 10 ACC
========================= */

function makeAccounts(type, count, level, rarity) {
const accounts = [];

for (let i = 1; i <= count; i++) {
const number = String(i).padStart(2, "0");

```
accounts.push({
  username: `demo_${type}_${number}`,
  password: "demo12345",
  level: level + Math.floor((i - 1) / 3),
  rarity: rarity,
  info: `ACC DEMO ${type.toUpperCase()} #${number}`
});
```

}

return accounts;
}

const stock = {
bag5k: makeAccounts("5k", 20, 5, "Thường"),

tanbinh: makeAccounts(
"tanbinh",
10,
10,
"Thường"
),

premium: makeAccounts(
"premium",
10,
20,
"Hiếm"
),

legendary: makeAccounts(
"legendary",
10,
30,
"Siêu hiếm"
),

vip: makeAccounts(
"vip",
10,
40,
"VIP"
),

ultra: makeAccounts(
"ultra",
10,
50,
"Cực hiếm"
),

lucky: makeAccounts(
"lucky",
10,
60,
"May mắn"
)
};

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
TELEGRAM
Đặt trong Render Environment:
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
========================= */

async function sendTelegram(message) {
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
console.log("Telegram chưa được cấu hình.");
return;
}

try {
const response = await fetch(
`https://api.telegram.org/bot${token}/sendMessage`,
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
chat_id: chatId,
text: message
})
}
);

```
const data = await response.json();

if (!data.ok) {
  console.log("Telegram lỗi:", data);
}
```

} catch (error) {
console.log("Không gửi được Telegram:", error.message);
}
}

/* =========================
ĐĂNG NHẬP
========================= */

app.post("/api/login", (req, res) => {
const gmail = String(req.body.gmail || "")
.trim()
.toLowerCase();

if (!gmail.endsWith("@gmail.com")) {
return res.json({
success: false,
message: "Vui lòng nhập đúng Gmail."
});
}

let user = users.get(gmail);

if (!user) {
user = {
gmail: gmail,
uid: createUID(gmail),
balance: 0,
history: []
};

```
users.set(gmail, user);
```

}

res.json({
success: true,
user: {
gmail: user.gmail,
uid: user.uid,
balance: user.balance
}
});
});

/* =========================
TRẠNG THÁI SHOP + SỐ LƯỢNG KHO
========================= */

app.get("/api/status", (req, res) => {
const stockCount = {};

for (const [key, list] of Object.entries(stock)) {
stockCount[key] = list.length;
}

res.json({
success: true,
message: "PT BAG SHOP đang hoạt động.",
users: users.size,
stock: stockCount
});
});

/* =========================
BỐC TÚI
========================= */

app.post("/api/buy", async (req, res) => {
const uid = String(req.body.uid || "").trim();
const product = String(req.body.product || "").trim();

let user = null;

for (const u of users.values()) {
if (u.uid === uid) {
user = u;
break;
}
}

if (!user) {
return res.json({
success: false,
code: "NOT_LOGGED_IN",
message: "Phiên đăng nhập không hợp lệ."
});
}

if (!validPrices[product]) {
return res.json({
success: false,
message: "Túi không tồn tại."
});
}

const price = validPrices[product];

if (user.balance < price) {
return res.json({
success: false,
code: "NOT_ENOUGH",
message: "Số dư không đủ."
});
}

if (!stock[product] || stock[product].length === 0) {
return res.json({
success: false,
code: "OUT_OF_STOCK",
message: "Túi này hiện đã hết hàng."
});
}

/*
Lấy acc đầu tiên khỏi kho.
Sau khi shift(), acc này không còn trong stock,
nên khách sau không thể bốc lại acc đó.
*/
const account = stock[product].shift();

user.balance -= price;

const historyItem = {
product: product,
account: account,
price: price,
time: new Date().toISOString()
};

user.history.push(historyItem);

/* =========================
TELEGRAM THÔNG BÁO
========================= */

const telegramMessage =
`🎁 CÓ KHÁCH VỪA BỐC ACC

📦 Túi: ${product}
💰 Giá: ${price.toLocaleString("vi-VN")}đ

👤 Gmail: ${user.gmail}
🆔 UID: ${user.uid}

🎮 Username: ${account.username}
🔐 Password: ${account.password}
⭐ Level: ${account.level}
💎 Độ hiếm: ${account.rarity}
📝 Thông tin: ${account.info}

💰 Số dư còn lại:
${user.balance.toLocaleString("vi-VN")}đ

⏰ ${new Date().toLocaleString("vi-VN")}`;

await sendTelegram(telegramMessage);

res.json({
success: true,
account: account,
balance: user.balance
});
});

/* =========================
LỊCH SỬ KHÁCH
========================= */

app.get("/api/history", (req, res) => {
const uid = String(req.query.uid || "").trim();

let user = null;

for (const u of users.values()) {
if (u.uid === uid) {
user = u;
break;
}
}

if (!user) {
return res.json({
success: false,
message: "Không tìm thấy UID."
});
}

res.json({
success: true,
history: user.history
});
});

/* =========================
ADMIN
========================= */

const ADMIN_PASSWORD =
process.env.ADMIN_PASSWORD || "congdang86";

const ADMIN_TOKEN =
process.env.ADMIN_TOKEN || "PTG-ADMIN-SECRET-2026";

/* Đăng nhập admin */

app.post("/api/admin/login", (req, res) => {
const password = String(req.body.password || "");

if (password !== ADMIN_PASSWORD) {
return res.json({
success: false,
message: "Sai mật khẩu admin."
});
}

res.json({
success: true,
token: ADMIN_TOKEN
});
});

/* Kiểm tra token admin */

function checkAdmin(req, res) {
const token =
req.headers.authorization ||
req.body.token ||
req.query.token;

if (token !== ADMIN_TOKEN) {
res.status(403).json({
success: false,
message: "Không có quyền admin."
});

```
return false;
```

}

return true;
}

/* Tìm user */

app.get("/api/admin/user", (req, res) => {
if (!checkAdmin(req, res)) return;

const uid = String(req.query.uid || "").trim();

let user = null;

for (const u of users.values()) {
if (u.uid === uid) {
user = u;
break;
}
}

if (!user) {
return res.json({
success: false,
message: "Không tìm thấy UID."
});
}

res.json({
success: true,
user: {
gmail: user.gmail,
uid: user.uid,
balance: user.balance,
historyCount: user.history.length
}
});
});

/* Cộng tiền */

app.post("/api/admin/add-money", (req, res) => {
if (!checkAdmin(req, res)) return;

const uid = String(req.body.uid || "").trim();
const amount = Number(req.body.amount);

if (!Number.isFinite(amount) || amount <= 0) {
return res.json({
success: false,
message: "Số tiền không hợp lệ."
});
}

let user = null;

for (const u of users.values()) {
if (u.uid === uid) {
user = u;
break;
}
}

if (!user) {
return res.json({
success: false,
message: "Không tìm thấy UID."
});
}

user.balance += amount;

res.json({
success: true,
balance: user.balance
});
});

/* Lịch sử admin */

app.get("/api/admin/history", (req, res) => {
if (!checkAdmin(req, res)) return;

const uid = String(req.query.uid || "").trim();

let user = null;

for (const u of users.values()) {
if (u.uid === uid) {
user = u;
break;
}
}

if (!user) {
return res.json({
success: false,
message: "Không tìm thấy UID."
});
}

res.json({
success: true,
history: user.history
});
});

/* =========================
ADMIN + TRANG CHỦ
========================= */

app.get("/admin", (req, res) => {
res.sendFile(__dirname + "/public/admin.html");
});

app.get("/", (req, res) => {
res.sendFile(__dirname + "/public/index.html");
});

/* =========================
START SERVER
========================= */

app.listen(PORT, "0.0.0.0", () => {
console.log(`PT BAG SHOP running on port ${PORT}`);
});
