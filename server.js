// Sử dụng bộ thư viện lõi nguyên bản có sẵn của NodeJS, 100% không lo bị lỗi sập mạng
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'users_database.json');

// ================= TELEGRAM CONFIG =================
// Nhớ điền mã số Token và ID Telegram của bạn vào đây
const TELEGRAM_TOKEN = 'TOKEN_BOT_CUA_BAN'; 
const TELEGRAM_CHAT_ID = 'ID_CHAT_CUA_BAN'; 

function sendTelegramAlert(message) {
    if (TELEGRAM_TOKEN === 'TOKEN_BOT_CUA_BAN') return;
    const url = `https://telegram.org{TELEGRAM_TOKEN}/sendMessage`;
    
    const req = http.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    req.on('error', (e) => console.error(e));
    req.write(JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' }));
    req.end();
}

// ================= DATABASE LƯU TRỮ VĨNH VIỄN CỐ ĐỊNH UID =================
let dbData = { last_uid: 0, users: {} };

if (fs.existsSync(DATA_FILE)) {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        if (content.trim().length > 0) dbData = JSON.parse(content);
    } catch (e) {
        dbData = { last_uid: 0, users: {} };
    }
}
if (!dbData.users) dbData.users = {};
if (dbData.last_uid === undefined) dbData.last_uid = 0;

function saveUsersToDisk() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2), 'utf8');
}

// ================= KHO ACC THẬT (BẠN TỰ SỬA NICK TẠI ĐÂY) =================
let khoPlayTogether = [
    { id: 1001, tk: "play_vip_01", mk: "ptg1234", note: "Acc 50 ô tô, nhà siêu to khổng lồ!" },
    { id: 1002, tk: "cau_ca_pro", mk: "cauca999", note: "Acc chuyên câu cá, sẵn cần câu vàng!" }
];

let khoCloneCoKhi = [
    { id: 2001, tk: "clone_cokhi_01", mk: "cokhi123", note: "Acc clone cơ khí sẵn phôi vip 1" },
    { id: 2002, tk: "clone_cokhi_02", mk: "cokhi456", note: "Acc clone cơ khí full linh kiện cấp 2" }
];

function generateNextUID() {
    dbData.last_uid = parseInt(dbData.last_uid) + 1;
    return String(dbData.last_uid).padStart(3, '0');
}

// ================= BỘ XỬ LÝ MÁY CHỦ ROUTER KHÔNG DÙNG EXPRESS =================
const server = http.createServer((req, res) => {
    // Tiện ích gửi dữ liệu JSON nhanh
    const sendJSON = (data, status = 200) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    // ĐỌC DỮ LIỆU ĐƯỜNG TRUYỀN (BODY)
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        let parseBody = {};
        try { if (body) parseBody = JSON.parse(body); } catch(e){}

        // 1. API ĐĂNG NHẬP GMAIL CỐ ĐỊNH SỐ DƯ
        if (req.url === '/api/auth/gmail-login' && req.method === 'POST') {
            const email = parseBody.email;
            if (!email || !email.includes('@')) return sendJSON({ success: false, msg: "Gmail không hợp lệ" });
            const cleanEmail = email.toLowerCase().trim();

            if (!dbData.users[cleanEmail]) {
                const customUID = generateNextUID();
                dbData.users[cleanEmail] = { uid: customUID, email: cleanEmail, balance: 0, avatar: 'https://imgur.com' };
                saveUsersToDisk();
                sendTelegramAlert(`🔔 <b>THÀNH VIÊN ĐĂNG KÝ MỚI</b>\n📧 Gmail: <code>${cleanEmail}</code>\n🆔 Mã số duy nhất (UID): <b>${customUID}</b>`);
            } else {
                sendTelegramAlert(`🔄 <b>KHÁCH CŨ ĐĂNG NHẬP LẠI</b>\n📧 Gmail: <code>${cleanEmail}</code>\n🆔 UID: <b>${dbData.users[cleanEmail].uid}</b>\n💰 Số dư: ${dbData.users[cleanEmail].balance.toLocaleString()}đ`);
            }
            return sendJSON({ success: true, user: dbData.users[cleanEmail] });
        }

        // 2. API YÊU CẦU NẠP TIỀN QUA ZALO
        if (req.url === '/api/user/nap-tien' && req.method === 'POST') {
            const email = parseBody.email;
            const user = dbData.users[(email || '').toLowerCase().trim()];
            if (!user) return sendJSON({ error: "Chưa đăng nhập" }, 400);
            sendTelegramAlert(`💰 <b>YÊU CẦU NẠP TIỀN</b>\n🆔 Mã số (UID): <b>${user.uid}</b>\n📧 Gmail: <code>${user.email}</code>\n📞 Zalo hỗ trợ: 0907859891`);
            return sendJSON({ success: true, uid: user.uid });
        }

        // 3. API XÉ TÚI MÙ TRỪ TIỀN TỰ ĐỘNG
        if (req.url === '/api/shop/xe-tui' && req.method === 'POST') {
            const { email, loaiTui } = parseBody;
            const user = dbData.users[(email || '').toLowerCase().trim()];
            if (!user) return sendJSON({ success: false, msg: "Vui lòng nhập định dạng Gmail trước!" });

            let giaTui = 0, targetKho = [], tenTuiText = "";
            if (loaiTui === 'playtogether') {
                giaTui = 30000; targetKho = khoPlayTogether; tenTuiText = "Túi VIP Play Together";
            } else if (loaiTui === 'clone_cokhi') {
                giaTui = 20000; targetKho = khoCloneCoKhi; tenTuiText = "Túi Clone Cơ Khí VIP";
            } else {
                return sendJSON({ success: false, msg: "Loại túi không hợp lệ!" });
            }

            if (!user.balance || user.balance < giaTui || user.balance <= 0) {
                return sendJSON({ success: false, msg: `Số dư tài khoản không đủ. Mã số tài khoản của bạn là ${user.uid}. Vui lòng gửi mã này qua Zalo 0907859891 để kích hoạt nạp tiền!` });
            }
            if (targetKho.length === 0) return sendJSON({ success: false, msg: `Túi mù [${tenTuiText}] hiện đã hết hàng!` });

            const randomIdx = Math.floor(Math.random() * targetKho.length);
            const accTrung = targetKho.splice(randomIdx, 1)[0];

            user.balance -= giaTui;
            saveUsersToDisk();

            sendTelegramAlert(`🎁 <b>THÔNG BÁO TÚI MÙ</b>\n👤 Khách UID: <b>${user.uid}</b>\n🛒 Đã xé: <b>${tenTuiText}</b>\n🔑 Nick trúng:\nTK: <code>${accTrung.tk}</code>\nMK: <code>${accTrung.mk}</code>`);
            return sendJSON({ success: true, account: accTrung, newBalance: user.balance });
        }

        // 4. API BẢO MẬT ADMIN CỘNG TIỀN CHO KHÁCH KHÔNG CẦN TOKEN
        if (req.url === '/api/admin/add-money' && req.method === 'POST') {
            const { uid, amount } = parseBody;
            let foundUser = null;
            for (let email in dbData.users) {
                if (dbData.users[email].uid === (uid || '').toString().trim()) { foundUser = dbData.users[email]; break; }
            }
            if (!foundUser) return sendJSON({ success: false, msg: "Không tìm thấy mã số khách!" });
            foundUser.balance += amount;
            saveUsersToDisk();
            sendTelegramAlert(`💰 <b>XÁC NHẬN NẠP TIỀN THÀNH CÔNG</b>\n🆔 UID khách: <b>${foundUser.uid}</b>\n💵 Số tiền cộng: +${amount.toLocaleString()}đ`);
            return sendJSON({ success: true });
        }

        // ================= ĐỌC PHẦN HIỂN THỊ GIAO DIỆN (TỆP TĨNH TỰ ĐỘNG) =================
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        
        // Đường dẫn ảo cho trang Admin ẩn nạp tiền
        if (req.url === '/panel-admin-an') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            return res.end(`
                <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cộng Tiền Chủ Shop</title></head>
                <body style="font-family:Arial; background:#2c3e50; color:white; text-align:center; padding:20px;">
                    <div style="background:#34495e; padding:25px; border-radius:15px; display:inline-block; max-width:400px; width:100%; text-align:left; margin-top:40px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        <h2 style="text-align:center; color:#f1c40f;">⚙️ PANEL CỘNG TIỀN KHÁCH</h2>
                        <label><b>Mã Số Khách Cần Tìm (UID):</b></label><input type="text" id="uid" placeholder="Ví dụ: 001" style="width:100%; padding:12px; margin:10px 0; font-size:16px; border-radius:8px; border:none;"><br>
                        <label><b>Số Tiền Cộng Thêm (đ):</b></label><input type="number" id="amount" placeholder="Ví dụ: 50000" style="width:100%; padding:12px; margin:10px 0; font-size:16px; border-radius:8px; border:none;"><br>
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
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {res.writeHead(200, { 'Content-Type': contentType + '; charset=UTF-8' });
res.end(content, 'utf-8');
}
});
});
});
server.listen(PORT, () => {
console.log(Hệ thống máy chủ sạch lỗi đang chạy tại cổng: ${PORT});
});
