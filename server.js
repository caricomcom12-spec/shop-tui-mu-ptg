const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ================= TELEGRAM CONFIG =================
// Điền mã số Token và ID Telegram của bạn vào đây để nhận thông báo tự động nhé
const TELEGRAM_TOKEN = 'TOKEN_BOT_CUA_BAN'; 
const TELEGRAM_CHAT_ID = '8814138987'; 

function sendTelegramAlert(message) {
    if (TELEGRAM_TOKEN === 'TOKEN_BOT_CUA_BAN') return;
    const url = `https://telegram.org{TELEGRAM_TOKEN}/sendMessage`;
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' })
    }).catch(err => console.error("Lỗi gửi Telegram:", err));
}

// ================= DATABASE LƯU TRỮ VĨNH VIỄN KHÔNG MẤT DỮ LIỆU =================
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
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2), 'utf8'); } catch(e){}
}

// ================= KHO TÀI KHOẢN VÀ THIẾT LẬP TỶ LỆ TRÚNG ACC (%) =================

// 1. KHO TÚI MÙ 7K (Bạn tự sửa tài khoản thật ở đây)
let khoTuiMu7k = [
    { id: 1001, tk: "acc_tuimu_vip01", mk: "pass7k", note: "Acc VIP 50 ô tô, nhà siêu to!" },
    { id: 1002, tk: "acc_tuimu_normal", mk: "lucky7k", note: "Acc trắng thông tin cày cuốc!" }
];

// 2. KHO VÒNG QUAY MAY MẮN 20K
// Bạn chỉnh tỷ lệ trúng ở biến "tyLe" dưới đây (Tổng 4 ô cộng lại phải bằng đúng 100)
let phanThuongVongQuay = [
    { index: 0, ten: "Nick Sơ Cấp", loai: "acc", tk: "clone01", mk: "123", note: "Nick sơ cấp sẵn cần vàng", tyLe: 50 },
    { index: 1, ten: "Chúc May Mắn", loai: "text", msg: "Bạn đã trúng phần quà may mắn lượt sau!", tyLe: 30 },
    { index: 2, ten: "Nick Trung Cấp", loai: "acc", tk: "trungcap01", mk: "456", note: "Nick trung cấp full pet", tyLe: 15 },
    { index: 3, ten: "Siêu Siêu VIP", loai: "acc", tk: "sieuvip999", mk: "admin", note: "SIÊU PHẨM: Acc full rương, cánh hiếm, biệt thự!", tyLe: 5 }
];

function generateRandomUID() { return Math.floor(100000 + Math.random() * 900000).toString(); }

// ================= API ENDPOINTS SHOP =================

app.post('/api/auth/gmail-login', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.json({ success: false, msg: "Gmail không hợp lệ" });
    const cleanEmail = email.toLowerCase().trim();

    if (!dbData.users[cleanEmail]) {
        const randomUID = generateRandomUID();
        dbData.users[cleanEmail] = { 
            uid: randomUID, 
            email: cleanEmail, 
            balance: 0, 
            avatar: 'https://imgur.com',
            history: []
        };
        saveUsersToDisk();
        sendTelegramAlert(`🔔 <b>THÀNH VIÊN ĐĂNG KÝ MỚI</b>\n📧 Gmail: <code>${cleanEmail}</code>\n🆔 UID: <b>${randomUID}</b>`);
    } else {
        sendTelegramAlert(`🔄 <b>KHÁCH CŨ ĐĂNG NHẬP LẠI</b>\n📧 Gmail: <code>${cleanEmail}</code>\n🆔 UID: <b>${dbData.users[cleanEmail].uid}</b>\n💰 Số dư cũ: ${dbData.users[cleanEmail].balance.toLocaleString()}đ`);
    }
    return res.json({ success: true, user: dbData.users[cleanEmail] });
});

app.post('/api/user/nap-tien', (req, res) => {
    const { email } = req.body;
    const user = dbData.users[(email || '').toLowerCase().trim()];
    if (!user) return res.status(400).json({ error: "Chưa đăng nhập" });
    sendTelegramAlert(`💰 <b>YÊU CẦU NẠP TIỀN</b>\n🆔 UID: <b>${user.uid}</b>\n📧 Gmail: <code>${user.email}</code>`);
    return res.json({ success: true, uid: user.uid });
});

app.post('/api/shop/xe-tui', (req, res) => {
    const { email } = req.body;
    const user = dbData.users[(email || '').toLowerCase().trim()];
    const giaTui = 7000;

    if (!user) return res.json({ success: false, msg: "Vui lòng nhập định dạng Gmail trước!" });
    if (!user.balance || user.balance < giaTui || user.balance <= 0) {
        return res.json({ success: false, msg: `Số dư không đủ vui lòng liên hệ sđt 0907859891 bank tiền + UID: ${user.uid} để được cộng tiền vào tài khoản` });
    }
    if (khoTuiMu7k.length === 0) return res.json({ success: false, msg: "Túi mù hiện đã hết hàng!" });

    const randomIdx = Math.floor(Math.random() * khoTuiMu7k.length);
    const accTrung = khoTuiMu7k.splice(randomIdx, 1)[0];

    user.balance -= giaTui;
    
    const logJson = { thoiGian: new Date().toLocaleString('vi-VN'), tenSp: "Túi Mù Play Together 7K", ketQua: `TK: ${accTrung.tk} | MK: ${accTrung.mk} (${accTrung.note})` };
    user.history.unshift(logJson);
    saveUsersToDisk();

    sendTelegramAlert(`🎁 <b>THÔNG BÁO TÚI MÙ</b>\n👤 Khách UID: <b>${user.uid}</b>\n🛒 Đã xé: Túi 7K\n🔑 TK: <code>${accTrung.tk}</code> | MK: <code>${accTrung.mk}</code>`);
    return res.json({ success: true, account: accTrung, newBalance: user.balance, history: user.history });
});

app.post('/api/shop/quay-vong-quay', (req, res) => {
    const { email } = req.body;
    const user = dbData.users[(email || '').toLowerCase().trim()];
    const giaQuay = 20000;

    if (!user) return res.json({ success: false, msg: "Vui lòng đăng nhập trước!" });
    if (!user.balance || user.balance < giaQuay || user.balance <= 0) {
        return res.json({ success: false, msg: `Số dư không đủ vui lòng liên hệ sđt 0907859891 bank tiền + UID: ${user.uid} để được cộng tiền vào tài khoản` });
    }

    let xacSuat = Math.floor(Math.random() * 100) + 1; 
    let mocDuoi = 0;
    let phanThuongTrung = phanThuongVongQuay[1]; 

    for (let i = 0; i < phanThuongVongQuay.length; i++) {
        let mocTren = mocDuoi + phanThuongVongQuay[i].tyLe;
        if (xacSuat > mocDuoi && xacSuat <= mocTren) {
            phanThuongTrung = phanThuongVongQuay[i];
            break;
        }
        mocDuoi = mocTren;
    }

    user.balance -= giaQuay;
    
    let textKetQua = "";
    if (phanThuongTrung.loai === 'acc') {
        textKetQua = `Trúng ${phanThuongTrung.ten} -> TK: ${phanThuongTrung.tk} | MK: ${phanThuongTrung.mk}`;
    } else {
        textKetQua = `Trúng ô: ${phanThuongTrung.ten}`;
    }

    const logJson = { thoiGian: new Date().toLocaleString('vi-VN'), tenSp: "Vòng Quay May Mắn 20K", ketQua: textKetQua };
    user.history.unshift(logJson);
    saveUsersToDisk();

    sendTelegramAlert(`🎯 <b>VÒNG QUAY MAY MẮN</b>\n👤 UID: <b>${user.uid}</b>\n🎁 Phần thưởng: <b>${phanThuongTrung.ten}</b>\n💰 Còn lại: ${user.balance.toLocaleString()}đ`);
    return res.json({ success: true, reward: phanThuongTrung, newBalance: user.balance, history: user.history });
});

app.get('/panel-admin-an', (req, res) => {
    res.send(`
        <!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cộng Tiền Chủ Shop</title></head>
        <body style="font-family:Arial; background:#0f172a; color:white; text-align:center; padding:20px;">
            <div style="background:#1e293b; padding:25px; border-radius:15px; display:inline-block; max-width:400px; width:100%; text-align:left; margin-top:40px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #3b82f6;">
                <h2 style="text-align:center; color:#3b82f6; text-shadow:0 0 10px #3b82f6;">⚙️ CYBER PANEL ADMIN</h2>
                <label><b>Nhập Mã Số Khách (UID):</b></label><input type="text" id="uid" style="width:100%; padding:12px; margin:10px 0; font-size:16px; border-radius:8px; border:none; background:#0f172a; color:white;"><br>
                <label><b>Số Tiền Cộng Thêm (đ):</b></label><input type="number" id="amount" style="width:100%; padding:12px; margin:10px 0; font-size:16px; border-radius:8px; border:none; background:#0f172a; color:white;"><br>
                <button onclick="addMoney()" style="background:#3b82f6; color:white; padding:14px; width:100%; border:none; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer; text-shadow:0 0 5px white;">XÁC NHẬN CỘNG TIỀN</button>
            </div>
            <script>
                function addMoney() {
                    const uid = document.getElementById('uid').value.trim();
                    const amount = document.getElementById('amount').value;
                    fetch('/api/admin/add-money', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ uid, amount: parseInt(amount) }) })
                    .then(res => res.json()).then(data => { alert(data.success ? "Cộng tiền thành công!" : "Lỗi: " + data.msg); });
                }
            </script>
        </body></html>
    `);
});

app.post('/api/admin/add-money', (req, res) => {
    const { uid, amount } = req.body;
    let foundUser = null;
    for (let email in dbData.users) { if (dbData.users[email].uid === (uid || '').toString().trim()) { foundUser = dbData.users[email]; break; } }
    if (!foundUser) return res.json({ success: false, msg: "Không tìm thấy mã số khách!" });
    foundUser.balance += amount;
    saveUsersToDisk();
    sendTelegramAlert(`💰 <b>XÁC NHẬN NẠP TIỀN THÀNH CÔNG</b>\n🆔 UID: <b>${foundUser.uid}</b>\n💵 Cộng: +${amount.toLocaleString()}đ`);
    return res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hệ thống Cyber đang chạy tại cổng: ${PORT}`));
