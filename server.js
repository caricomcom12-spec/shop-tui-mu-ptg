const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ================= DATABASE LƯU TRỮ VĨNH VIỄN CHỐNG MẤT SỐ DƯ =================
const DATA_FILE = path.join(__dirname, 'users_database.json');
let dbData = { users: {} };

if (fs.existsSync(DATA_FILE)) {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        if (content.trim().length > 0) dbData = JSON.parse(content);
    } catch (e) {
        dbData = { users: {} };
    }
}
if (!dbData.users) dbData.users = {};

function saveUsersToDisk() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2), 'utf8');
    } catch(err) {
        console.error("Lỗi ghi file:", err);
    }
}

// ================= KHO NICK GAME THẬT TÚI MÙ 7K (BẠN TỰ SỬA NICK TẠI ĐÂY) =================
let khoTuiMu7k = [
    { id: 1001, tk: "tuimu_7k_01", mk: "pass7k", note: "Acc Play Together sẵn đồ trang trí cute!" },
    { id: 1002, tk: "tuimu_7k_02", mk: "lucky7k", note: "Acc trắng thông tin hên xui!" }
];

function generateRandomUID() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= HỆ THỐNG ĐƯỜNG TRUYỀN API SHOP (EXPRESS) =================

// 1. API Đăng nhập Gmail cấp mã UID ngẫu nhiên cố định
app.post('/api/auth/gmail-login', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.json({ success: false, msg: "Gmail không hợp lệ" });
    const cleanEmail = email.toLowerCase().trim();

    if (!dbData.users[cleanEmail]) {
        const randomUID = generateRandomUID();
        dbData.users[cleanEmail] = { uid: randomUID, email: cleanEmail, balance: 0, avatar: 'https://imgur.com', history: [] };
        saveUsersToDisk();
    }
    return res.json({ success: true, user: dbData.users[cleanEmail] });
});

// 2. API Yêu cầu nạp tiền
app.post('/api/user/nap-tien', (req, res) => {
    const { email } = req.body;
    const user = dbData.users[(email || '').toLowerCase().trim()];
    if (!user) return res.status(400).json({ error: "Chưa đăng nhập" });
    return res.json({ success: true, uid: user.uid });
});

// 3. API Xé túi mù trừ tiền tự động
app.post('/api/shop/xe-tui', (req, res) => {
    const { email } = req.body;
    const user = dbData.users[(email || '').toLowerCase().trim()];
    if (!user) return res.json({ success: false, msg: "Vui lòng nhập định dạng Gmail trước!" });

    const giaTui = 7000;
    const tenTuiText = "Túi Mù Play Together VIP";

    if (!user.balance || user.balance < giaTui || user.balance <= 0) {
        return res.json({ 
            success: false, 
            msg: `Số dư không đủ vui lòng liên hệ sđt 0907859891 bank tiền + UID: ${user.uid} để được cộng tiền vào tài khoản` 
        });
    }
    if (khoTuiMu7k.length === 0) return res.json({ success: false, msg: `Sản phẩm [${tenTuiText}] này hiện đã hết hàng!` });

    const randomIdx = Math.floor(Math.random() * khoTuiMu7k.length);
    const accTrung = khoTuiMu7k.splice(randomIdx, 1)[0]; // Lấy chính xác object nick game trúng

    user.balance -= giaTui;
    user.history.unshift({ thoiGian: new Date().toLocaleString('vi-VN'), tenSp: "Túi Mù 7K", ketQua: `TK: ${accTrung.tk} | MK: ${accTrung.mk} (${accTrung.note})` });
    saveUsersToDisk();

    return res.json({ success: true, account: accTrung, newBalance: user.balance, history: user.history });
});

// 4. Giao diện quản trị Admin bí mật nạp tiền cho khách theo mã UID ngẫu nhiên
app.get('/panel-admin-an', (req, res) => {
    res.send(`
        <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cộng Tiền Chủ Shop</title></head>
        <body style="font-family:Arial; background:#2c3e50; color:white; text-align:center; padding:20px;">
            <div style="background:#34495e; padding:25px; border-radius:15px; display:inline-block; max-width:400px; width:100%; text-align:left; margin-top:40px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                <h2 style="text-align:center; color:#f1c40f;">⚙️ PANEL CỘNG TIỀN KHÁCH CDANG-PTGSHOP</h2>
                <label><b>Nhập Mã Số Khách Gửi (UID):</b></label><input type="text" id="uid" placeholder="Ví dụ: 582491" style="width:100%; padding:12px; margin:10px 0; font-size:16px; border-radius:8px; border:none; background:#0f172a; color:white;"><br>
                <label><b>Số Tiền Cộng Thêm (đ):</b></label><input type="number" id="amount" placeholder="Ví dụ: 50000" style="width:100%; padding:12px; margin:10px 0; font-size:16px; border-radius:8px; border:none; background:#0f172a; color:white;"><br>
                <button onclick="addMoney()" style="background:#2ecc71; color:white; padding:14px; width:100%; border:none; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">XÁC NHẬN CỘNG TIỀN</button>
            </div>
            <script>
                function addMoney() {
                    const uid = document.getElementById('uid').value.trim();
                    const amount = document.getElementById('amount').value;
                    if(!uid || !amount) return alert("Vui lòng điền đủ thông tin!");
                    fetch('/api/admin/add-money', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ uid, amount: parseInt(amount) }) })
                    .then(res => res.json()).then(data => { if(data.success) alert("Đã cộng tiền thành công!"); else alert("Lỗi: " + data.msg); });
                }
            </script>
        </body></html>
    `);
});

// 5. API Admin xử lý cộng số dư vĩnh viễn
app.post('/api/admin/add-money', (req, res) => {
    const { uid, amount } = req.body;
    let foundUser = null;
    for (let email in dbData.users) {
        if (dbData.users[email].uid === (uid || '').toString().trim()) { foundUser = dbData.users[email]; break; }
    }
    if (!foundUser) return res.json({ success: false, msg: "Không tìm thấy mã số khách!" });
    foundUser.balance += amount;
    saveUsersToDisk();
    return res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hệ thống máy chủ Express đang chạy tại cổng: ${PORT}`));
