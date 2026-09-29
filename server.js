const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================= TELEGRAM CONFIG =================
// Tạm thời để nguyên, lát nữa tớ hướng dẫn bạn điền sau nhé
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

// ================= API ENDPOINTS =================
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
    const { email, amount } = req.body;
    const user = users[email];
    if (!user) return res.status(400).json({ error: "Chưa đăng nhập" });
    sendTelegramAlert(`💰 <b>YÊU CẦU NẠP TIỀN</b>\n🆔 Mã số khách: <code>${user.uid}</code>\n👤 Tên khách: ${user.name}\n📞 Liên hệ Zalo: 0907859891\n💬 Trạng thái: Đang chờ khách ib chuyển khoản.`);
    res.json({ success: true, uid: user.uid });
});

app.post('/api/shop/xe-tui', (req, res) => {
    const { email } = req.body;
    const user = users[email];
    const GIA_TUI = 30000; 

    if (!user) return res.status(400).json({ error: "Vui lòng đăng nhập!" });
    
    if (user.balance < GIA_TUI) {
        return res.json({ success: false, msg: `Số dư không đủ! Mã số của bạn là ${user.uid}, vui lòng gửi mã này qua Zalo 0907859891 để nạp thêm tiền.` });
    }

    if (accountsKho.length === 0) {
        return res.json({ success: false, msg: "Túi mù Play Together hiện đã hết hàng, vui lòng liên hệ admin bổ sung!" });
    }

    const randomIdx = Math.floor(Math.random() * accountsKho.length);
    const accTrung = accountsKho.splice(randomIdx, 1)[0];
    user.balance -= GIA_TUI;

    sendTelegramAlert(`🎁 <b>THÔNG BÁO TÚI MÙ</b>\n👤 Khách: ${user.name} (UID: <code>${user.uid}</code>)\n🛒 Đã xé: Túi Mù Play Together VIP (30,000đ)\n📦 Acc trúng số: MS${accTrung.id}\n🔑 TK: <code>${accTrung.tk}</code> | MK: <code>${accTrung.mk}</code>\n📉 Kho còn lại: ${accountsKho.length} acc.`);

    res.json({ success: true, account: accTrung, newBalance: user.balance });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web shop Play Together đang chạy tại cổng: ${PORT}`);
});

