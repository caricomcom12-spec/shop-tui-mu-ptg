const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================= TELEGRAM CONFIG =================
// Bạn nhớ điền lại 2 cái mã Token và ID Chat Telegram của bạn vào đây nhé!
const TELEGRAM_TOKEN = 'TOKEN_BOT_CUA_BAN'; 
const TELEGRAM_CHAT_ID = 'ID_CHAT_CUA_BAN'; 

function sendTelegramAlert(message) {
    if (TELEGRAM_TOKEN === 'TOKEN_BOT_CUA_BAN') return;
    const url = `https://telegram.org{TELEGRAM_TOKEN}/sendMessage`;
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' })
    }).catch(err => console.error("Lỗi gửi Telegram:", err));
}

// ================= HỆ THỐNG LƯU TRỮ VĨNH VIỄN KHÔNG MẤT SỐ DƯ =================
const DATA_FILE = path.join(__dirname, 'users_database.json');
let users = {};

// Khởi chạy: Tự động nạp dữ liệu khách hàng cũ từ file cứng lên
if (fs.existsSync(DATA_FILE)) {
    try {
        users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        users = {};
    }
}

// Hàm đồng bộ lưu ví tiền vào ổ đĩa cứng khi có thay đổi
function saveUsersToDisk() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

let accountsKho = [
    { id: 1001, tk: "play_vip_01", mk: "ptg1234", note: "Acc 50 ô tô, nhà siêu to khổng lồ, cánh hiếm!" },
    { id: 1002, tk: "cau_ca_pro", mk: "cauca999", note: "Acc chuyên câu cá, sẵn cần câu vàng, 500 kim cương." },
    { id: 1003, tk: "shiba_cute", mk: "playtogether", note: "Acc full pet hiếm lv max, trang phục giới hạn." }
];

function generateUserUID() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= API ĐĂNG NHẬP GMAIL THỦ CÔNG =================
app.post('/api/auth/gmail-login', (req, res) => {
    const { email } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Nếu Gmail này chưa từng vào shop, hệ thống tự động đăng ký mới luôn
    if (!users[cleanEmail]) {
        users[cleanEmail] = {
            uid: generateUserUID(),
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            balance: 0,
            avatar: 'https://imgur.com'
        };
        saveUsersToDisk(); // Lưu ngay vào ổ đĩa cứng
        sendTelegramAlert(`🔔 <b>THÀNH VIÊN ĐĂNG KÝ GMAIL MỚI</b>\n📧 Gmail: <code>${cleanEmail}</code>\n🆔 Mã số (UID): <code>${users[cleanEmail].uid}</code>`);
    } else {
        // Nếu đã có Gmail này rồi, Bot gửi tin báo khách cũ vừa quay trở lại đăng nhập
        sendTelegramAlert(`🔄 <b>KHÁCH CŨ ĐĂNG NHẬP</b>\n📧 Gmail: <code>${cleanEmail}</code>\n🆔 UID: <code>${users[cleanEmail].uid}</code>\n💰 Số dư hiện tại: ${users[cleanEmail].balance.toLocaleString()}đ`);
    }
    
    res.json({ success: true, user: users[cleanEmail] });
});

app.post('/api/user/nap-tien', (req, res) => {
    const { email } = req.body;
    const user = users[email.toLowerCase().trim()];
    if (!user) return res.status(400).json({ error: "Chưa đăng nhập" });
    sendTelegramAlert(`💰 <b>YÊU CẦU NẠP TIỀN</b>\n🆔 Mã số khách: <code>${user.uid}</code>\n📧 Gmail: <code>${user.email}</code>\n📞 Liên hệ Zalo: 0907859891\n💬 Hãy chờ khách gửi bill chuyển khoản.`);
    res.json({ success: true, uid: user.uid });
});

app.post('/api/shop/xe-tui', (req, res) => {
    const { email } = req.body;
    const user = users[email.toLowerCase().trim()];
    const GIA_TUI = 30000; 

    if (!user) return res.json({ success: false, msg: "Vui lòng nhập định dạng Gmail trước!" });
    if (!user.balance || user.balance < GIA_TUI || user.balance <= 0) {
        return res.json({ success: false, msg: `Số dư tài khoản không đủ. Mã số tài khoản của bạn là ${user.uid}. Vui lòng gửi mã này qua Zalo 0907859891 để kích hoạt nạp tiền!` });
    }
    if (accountsKho.length === 0) return res.json({ success: false, msg: "Túi mù hiện đã hết hàng, liên hệ admin để nạp thêm!" });

    const randomIdx = Math.floor(Math.random() * accountsKho.length);
    const accTrung = accountsKho.splice(randomIdx, 1)[0]; 

    user.balance -= GIA_TUI;
    saveUsersToDisk(); // Khách bốc xong trừ tiền và lưu ví cứng luôn

    sendTelegramAlert(`🎁 <b>THÔNG BÁO TÚI MÙ</b>\n👤 Khách UID: <code>${user.uid}</code>\n📧 Gmail: <code>${user.email}</code>\n🛒 Đã xé: Túi VIP Play Together\n🔑 Nick trúng:\nTK: <code>${accTrung.tk}</code>\nMK: <code>${accTrung.mk}</code>\n📝 Mô tả: <i>${accTrung.note}</i>`);

    return res.json({ success: true, account: accTrung, newBalance: user.balance });
});

// ================= HỆ THỐNG PANEL ADMIN CỘNG TIỀN =================
app.get('/panel-admin-an', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cộng Tiền Chủ Shop</title></head>
        <body style="font-family:Arial; background:#2c3e50; color:white; text-align:center; padding:20px;">
            <div style="background:#34495e; padding:25px; border-radius:15px; display:inline-block; max-width:400px; width:100%; text-align:left; margin-top:40px;">
                <h2 style="text-align:center; color:#f1c40f;">⚙️ PANEL CỘNG TIỀN KHÁCH</h2>
                <label><b>Mã Số Khách (UID):</b></label><input type="number" id="uid" style="width:100%; padding:12px; margin:10px 0; font-size:16px;"><br>
                <label><b>Số Tiền Cộng:</b></label><input type="number" id="amount" style="width:100%; padding:12px; margin:10px 0; font-size:16px;"><br>
                <button onclick="addMoney()" style="background:#2ecc71; color:white; padding:14px; width:100%; border:none; border-radius:8px; font-weight:bold; font-size:16px;">XÁC NHẬN CỘNG TIỀN</button>
            </div>
            <script>
                function addMoney() {
                    const uid = document.getElementById('uid').value;
                    const amount = document.getElementById('amount').value;
                    fetch('/api/admin/add-money', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ uid, amount: parseInt(amount) })
                    }).then(res => res.json()).then(data => {
                        if(data.success) alert("Đã cộng tiền thành công!"); else alert("Lỗi: " + data.msg);
                    });
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/api/admin/add-money', (req, res) => {
    const { uid, amount } = req.body;
    let foundUser = null;
    for (let email in users) {
        if (users[email].uid === uid.toString()) { foundUser = users[email]; break; }
    }
    if (!foundUser) return res.json({ success: false, msg: "Không tìm thấy mã số khách hàng này!" });

    foundUser.balance += amount;
    saveUsersToDisk(); // Lưu lại vào ổ đĩa cứng sau khi cộng tiền thành công

    sendTelegramAlert(`💰 <b>XÁC NHẬN NẠP TIỀN THÀNH CÔNG</b>\n🆔 UID khách: <code>${foundUser.uid}</code>\n📧 Gmail: <code>${foundUser.email}</code>\n💵 Số tiền cộng: +${amount.toLocaleString()}đ\n📈 Số dư mới: ${foundUser.balance.toLocaleString()}đ`);
    return res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hệ thống đang chạy tại cổng: ${PORT}`));
