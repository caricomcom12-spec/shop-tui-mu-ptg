const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép đọc thư mục public
app.use(express.static(path.join(__dirname, "public")));

// =========================
// DATABASE DEMO
// =========================

const users = new Map();

const stock = {
  tanbinh: [
    "ACC_TANBINH_01",
    "ACC_TANBINH_02",
    "ACC_TANBINH_03",
    "ACC_TANBINH_04",
    "ACC_TANBINH_05"
  ],

  premium: [
    "ACC_PREMIUM_01",
    "ACC_PREMIUM_02",
    "ACC_PREMIUM_03",
    "ACC_PREMIUM_04",
    "ACC_PREMIUM_05"
  ],

  legendary: [
    "ACC_LEGENDARY_01",
    "ACC_LEGENDARY_02",
    "ACC_LEGENDARY_03",
    "ACC_LEGENDARY_04",
    "ACC_LEGENDARY_05"
  ],

  vip: [
    "ACC_VIP_01",
    "ACC_VIP_02",
    "ACC_VIP_03",
    "ACC_VIP_04",
    "ACC_VIP_05"
  ],

  ultra: [
    "ACC_ULTRA_01",
    "ACC_ULTRA_02",
    "ACC_ULTRA_03",
    "ACC_ULTRA_04",
    "ACC_ULTRA_05"
  ],

  lucky: [
    "ACC_LUCKY_01",
    "ACC_LUCKY_02",
    "ACC_LUCKY_03",
    "ACC_LUCKY_04",
    "ACC_LUCKY_05"
  ]
};


// =========================
// TẠO UID
// =========================

function makeUID() {
  return (
    "PT-" +
    crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()
  );
}


// =========================
// KIỂM TRA GMAIL
// =========================

function validGmail(gmail) {
  return /^[^\s@]+@gmail\.com$/i.test(gmail);
}


// =========================
// ĐĂNG NHẬP / TẠO TÀI KHOẢN
// =========================

app.post("/api/login", (req, res) => {

  try {

    const gmail = String(
      req.body.gmail || ""
    )
      .trim()
      .toLowerCase();


    if (!validGmail(gmail)) {

      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đúng Gmail."
      });

    }


    // Tìm tài khoản cũ
    let user = null;

    for (const account of users.values()) {

      if (account.gmail === gmail) {
        user = account;
        break;
      }

    }


    // Nếu chưa có thì tạo mới
    if (!user) {

      user = {
        gmail: gmail,
        uid: makeUID(),
        balance: 0,
        createdAt: new Date().toISOString()
      };

      users.set(user.uid, user);
    }


    return res.json({
      success: true,
      user: {
        gmail: user.gmail,
        uid: user.uid,
        balance: user.balance
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server."
    });

  }

});


// =========================
// LẤY THÔNG TIN USER
// =========================

app.get("/api/user/:uid", (req, res) => {

  const user = users.get(req.params.uid);

  if (!user) {

    return res.status(404).json({
      success: false,
      message: "Không tìm thấy tài khoản."
    });

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


// =========================
// MUA TÚI MÙ
// =========================

app.post("/api/buy", (req, res) => {

  try {

    const {
      uid,
      product,
      price
    } = req.body;


    const user = users.get(uid);


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản."
      });

    }


    const amount = Number(price);


    if (!Number.isFinite(amount) || amount <= 0) {

      return res.status(400).json({
        success: false,
        message: "Giá sản phẩm không hợp lệ."
      });

    }


    // Kiểm tra số dư
    if (user.balance < amount) {

      return res.json({
        success: false,
        code: "NOT_ENOUGH",
        balance: user.balance,
        message:
          "Số dư không đủ. Vui lòng nạp tiền qua Zalo 0907859891."
      });

    }


    // Kiểm tra kho
    if (
      !stock[product] ||
      stock[product].length === 0
    ) {

      return res.json({
        success: false,
        message: "Túi này hiện đã hết ACC."
      });

    }


    // Lấy ACC đầu tiên
    const account = stock[product].shift();


    // Trừ tiền
    user.balance -= amount;


    return res.json({
      success: true,
      account: account,
      balance: user.balance
    });

  } catch (error) {

    console.error("BUY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi mua hàng."
    });

  }

});


// =========================
// TEST SERVER
// =========================

app.get("/api/status", (req, res) => {

  res.json({
    success: true,
    status: "online",
    shop: "PT BAG SHOP"
  });

});


// =========================
// TRANG CHỦ
// =========================

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );

});


// =========================
// 404 API
// =========================

app.use("/api", (req, res) => {

  res.status(404).json({
    success: false,
    message: "API không tồn tại."
  });

});


// =========================
// CHẠY SERVER
// =========================

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `PT BAG SHOP đang chạy tại port ${PORT}`
    );

  }
);
