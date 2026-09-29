const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================= TELEGRAM CONFIG =================
// Điền mã số Bot Telegram của bạn vào đây nhé
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

// ================= CƠ SỞ DỮ LIỆU ẢO =================
let users = {}; 
let accountsKho = [
    { id: 1001, tk: "play_vip_01", mk: "ptg1234", note: "Acc 50 ô tô, nhà siêu to khổng lồ, cánh hiếm!" },
    { id: 1002, tk: "cau_ca_pro", mk: "cauca999", note: "Acc chuyên câu cá, sẵn cần câu vàng, 500 kim cương." },
    { id: 1003, tk: "shiba_cute", mk: "playtogether", note: "Acc full pet hiếm lv max, trang phục giới hạn." }
];

function generateUserUID() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= API ENDPOINTS SHOP =================
app.post('/api/auth/google', (req, res) => {
    const { email, name, avatar } = req.body;
    if (!users[email]) {
        users[email] = {
            uid: generateUserUID(),
            name: name,
            email: email,
            balance: 0,
            avatar: avatar || 'https://imgur.com'
        };
        sendTelegramAlert(`🔔 <b>THÀNH VIÊN MỚI</b>\n👤 Khách: ${name}\n📧 Email: ${email}\n🆔 Mã số (UID): <code>${users[email].uid}</code>\n🌐 Đăng nhập qua: Google`);
    }
    res.json({ success: true, user: users[email] });
});

app.post('/api/user/nap-tien', (req, res) => {
    const { email } = req.body;
    const user = users[email];
    if (!user) return res.status(400).json({ error: "Chưa đăng nhập" });
    sendTelegramAlert(`💰 <b>YÊU CẦU NẠP TIỀN</b>\n🆔 Mã số khách: <code>${user.uid}</code>\n👤 Tên khách: ${user.name}\n📞 Liên hệ Zalo: 0907859891\n💬 Trạng thái: Đang chờ khách ib chuyển khoản.`);
    res.json({ success: true, uid: user.uid });
});

app.post('/api/shop/xe-tui', (req, res) => {
    const { email } = req.body;
    const user = users[email];
    const GIA_TUI = 30000; 

    if (!user) return res.json({ success: false, msg: "Vui lòng bấm đăng nhập tài khoản Google trước khi bốc!" });
    if (!user.balance || user.balance < GIA_TUI || user.balance <= 0) {
        return res.json({ success: false, msg: `Số dư tài khoản của bạn hiện tại là 0đ (Không đủ). Mã số tài khoản của bạn là ${user.uid}. Vui lòng gửi mã số này qua Zalo 0907859891 để Admin kích hoạt nạp tiền!` });
    }
    if (accountsKho.length === 0) return res.json({ success: false, msg: "Túi mù Play Together hiện đã hết hàng, vui lòng liên hệ admin bổ sung thêm nick vào kho!" });

    const randomIdx = Math.floor(Math.random() * accountsKho.length);
    const accTrung = accountsKho.splice(randomIdx, 1); 

    user.balance -= GIA_TUI;

    sendTelegramAlert(`🎁 <b>THÔNG BÁO TÚI MÙ</b>\n👤 Khách: ${user.name} (UID: <code>${user.uid}</code>)\n🛒 Đã xé thành công: Túi VIP Play Together\n💰 Số dư còn lại: ${user.balance.toLocaleString('vi-VN')}đ\n📦 Tài khoản trúng: \n🔑 TK: <code>${accTrung.tk}</code> | MK: <code>${accTrung.mk}</code>\n📝 Ghi chú: <i>${accTrung.note}</i>\n📉 Kho còn lại: ${accountsKho.length} acc.`);

    return res.json({ success: true, account: accTrung, newBalance: user.balance });
});

// ================= HỆ THỐNG PANEL ADMIN ẨN =================
app.get('/panel-admin-an', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hệ Thống Cộng Tiền Của Chủ Shop</title>
            <style>
                body { font-family: Arial, sans-serif; background: #2c3e50; color: white; padding: 20px; text-align: center; }
                .box { background: #34495e; padding: 25px; border-radius: 15px; display: inline-block; max-width: 400px; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); text-align: left; margin-top: 40px;}
                input { width: 100%; padding: 12px; margin: 10px 0 20px 0; border-radius: 8px; border: none; box-sizing: border-box; font-size: 16px; }
                button { background: #2ecc71; color: white; border: none; padding: 14px; width: 100%; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
                button:hover { background: #27ae60; }
                h2 { text-align: center; margin-bottom: 20px; color: #f1c40f; }
            </style>
        </head>
        <body>
            <div class="box">
                <h2>⚙️ CỘNG TIỀN KHÁCH HÀNG</h2>
                <label><b>Nhập Mã Số Khách (UID):</b></label>
                <input type="number" id="uid" placeholder="Ví dụ: 582913">
                <label><b>Nhập Số Tiền Cần Cộng (đ):</b></label>
                <input type="number" id="amount" placeholder="Ví dụ: 100000">
                <button onclick="addMoney()">XÁC NHẬN CỘNG TIỀN</button>
            </div>
            <script>
                function addMoney() {
                    const uid = document.getElementById('uid').value;
                    const amount = document.getElementById('amount').value;
                    if(!uid || !amount) return alert("Vui lòng điền đầy đủ thông tin!");
                    
                    fetch('/api/admin/add-money', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ uid, amount: parseInt(amount) })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.success) {
                            alert("Thành công! Đã cộng " + parseInt(amount).toLocaleString() + "đ vào mã tài khoản " + uid);
                        } else {
                            alert("Lỗi: " + data.msg);
                        }
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
        if (users[email].uid === uid.toString()) {
            foundUser = users[email];
            break;
        }
    }

    if (!foundUser) {
        return res.json({ success: false, msg: "Không tìm thấy mã số tài khoản này trên mạng! Khách cần bấm nút Đăng nhập Google trên web ít nhất 1 lần để hệ thống khởi tạo mã." });
    }

    foundUser.balance += amount;

    sendTelegramAlert(`💰 <b>XÁC NHẬN NẠP TIỀN THÀNH CÔNG</b>\n🆔 Mã số (UID): <code>${foundUser.uid}</code>\n👤 Tên khách: ${foundUser.name}\n💵 Số tiền vừa cộng: +${amount.toLocaleString('vi-VN')}đ\n📈 Tổng số dư mới: ${foundUser.balance.toLocaleString('vi-VN')}đ`);

    return res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web shop Play Together đang chạy tại cổng: ${PORT}`);
});
