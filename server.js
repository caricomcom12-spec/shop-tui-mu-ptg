const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'users_database.json');

// ================= DATABASE LƯU TRỮ VĨNH VIỄN KHÔNG MẤT DỮ LIỆU =================
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2), 'utf8');
}

// ================= KHO TÀI KHOẢN VÀ THIẾT LẬP TỶ LỆ TRÚNG ACC (%) =================

// 1. KHO TÚI MÙ 7K (Bạn tự sửa tài khoản thật ở đây)
let khoTuiMu7k = [
    { id: 1001, tk: "acc_tuimu_vip01", mk: "pass7k", note: "Acc VIP 50 ô tô, nhà siêu to!" },
    { id: 1002, tk: "acc_tuimu_normal", mk: "lucky7k", note: "Acc trắng thông tin cày cuốc!" }
];

// 2. KHO VÒNG QUAY MAY MẮN 20K (Tổng tỷ lệ 4 ô phải bằng đúng 100)
let phanThuongVongQuay = [
    { index: 0, ten: "Nick Sơ Cấp", loai: "acc", tk: "clone01", mk: "123", note: "Nick sơ cấp sẵn cần vàng", tyLe: 50 },
    { index: 1, ten: "Chúc May Mắn", loai: "text", msg: "Bạn đã trúng phần quà may mắn lượt sau!", tyLe: 30 },
    { index: 2, ten: "Nick Trung Cấp", loai: "acc", tk: "trungcap01", mk: "456", note: "Nick trung cấp full pet", tyLe: 15 },
    { index: 3, ten: "Siêu Siêu VIP", loai: "acc", tk: "sieuvip999", mk: "admin", note: "SIÊU PHẨM: Acc full rương, cánh hiếm, biệt thự!", tyLe: 5 }
];

function generateRandomUID() { return Math.floor(100000 + Math.random() * 900000).toString(); }

// ================= MÁY CHỦ SẠCH RÁC CHẠY ĐỘC LẬP =================
const server = http.createServer((req, res) => {
    const sendJSON = (data, status = 200) => {
        res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(data));
    };

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        let parseBody = {};
        try { if (body) parseBody = JSON.parse(body); } catch(e){}

        // 1. API Đăng nhập Gmail
        if (req.url === '/api/auth/gmail-login' && req.method === 'POST') {
            const email = parseBody.email;
            if (!email || !email.includes('@')) return sendJSON({ success: false, msg: "Gmail không hợp lệ" });
            const cleanEmail = email.toLowerCase().trim();

            if (!dbData.users[cleanEmail]) {
                const randomUID = generateRandomUID();
                dbData.users[cleanEmail] = { uid: randomUID, email: cleanEmail, balance: 0, avatar: 'https://imgur.com', history: [] };
                saveUsersToDisk();
            }
            return sendJSON({ success: true, user: dbData.users[cleanEmail] });
        }

        // 2. API Xé túi mù 7K
        if (req.url === '/api/shop/xe-tui' && req.method === 'POST') {
            const email = parseBody.email;
            const user = dbData.users[(email || '').toLowerCase().trim()];
            const giaTui = 7000;

            if (!user) return sendJSON({ success: false, msg: "Vui lòng đăng nhập trước!" });
            if (!user.balance || user.balance < giaTui || user.balance <= 0) {
                return sendJSON({ success: false, msg: `Số dư không đủ vui lòng liên hệ sđt 0907859891 bank tiền + UID: ${user.uid} để được cộng tiền vào tài khoản` });
            }
            if (khoTuiMu7k.length === 0) return sendJSON({ success: false, msg: "Túi mù hiện đã hết hàng!" });

            const randomIdx = Math.floor(Math.random() * khoTuiMu7k.length);
            const accTrung = khoTuiMu7k.splice(randomIdx, 1)[0];

            user.balance -= giaTui;
            user.history.unshift({ thoiGian: new Date().toLocaleString('vi-VN'), tenSp: "Túi Mù 7K", ketQua: `TK: ${accTrung.tk} | MK: ${accTrung.mk} (${accTrung.note})` });
            saveUsersToDisk();

            return sendJSON({ success: true, account: accTrung, newBalance: user.balance, history: user.history });
        }

        // 3. API Quay vòng quay 20K
        if (req.url === '/api/shop/quay-vong-quay' && req.method === 'POST') {
            const email = parseBody.email;
            const user = dbData.users[(email || '').toLowerCase().trim()];
            const giaQuay = 20000;

            if (!user) return sendJSON({ success: false, msg: "Vui lòng đăng nhập trước!" });
            if (!user.balance || user.balance < giaQuay || user.balance <= 0) {
                return sendJSON({ success: false, msg: `Số dư không đủ vui lòng liên hệ sđt 0907859891 bank tiền + UID: ${user.uid} để được cộng tiền vào tài khoản` });
            }

            let xacSuat = Math.floor(Math.random() * 100) + 1; 
            let mocDuoi = 0, phanThuongTrung = phanThuongVongQuay[1]; 

            for (let i = 0; i < phanThuongVongQuay.length; i++) {
                let mocTren = mocDuoi + phanThuongVongQuay[i].tyLe;
                if (xacSuat > mocDuoi && xacSuat <= mocTren) { phanThuongTrung = phanThuongVongQuay[i]; break; }
                mocDuoi = mocTren;
            }

            user.balance -= giaQuay;
            let textKetQua = phanThuongTrung.loai === 'acc' ? `Trúng ${phanThuongTrung.ten} -> TK: ${phanThuongTrung.tk} | MK: ${phanThuongTrung.mk}` : `Trúng ô: ${phanThuongTrung.ten}`;
            user.history.unshift({ thoiGian: new Date().toLocaleString('vi-VN'), tenSp: "Vòng Quay 20K", ketQua: textKetQua });
            saveUsersToDisk();

            return sendJSON({ success: true, reward: phanThuongTrung, newBalance: user.balance, history: user.history });
        }

        // 4. API Admin bí mật cộng tiền
        if (req.url === '/api/admin/add-money' && req.method === 'POST') {
            const { uid, amount } = parseBody;
            let foundUser = null;
            for (let email in dbData.users) { if (dbData.users[email].uid === (uid || '').toString().trim()) { foundUser = dbData.users[email]; break; } }
            if (!foundUser) return sendJSON({ success: false, msg: "Không tìm thấy mã số khách!" });
            foundUser.balance += amount;
            saveUsersToDisk();
            return sendJSON({ success: true });
        }

        // ================= ROUTER PHỤC VỤ FILE GIAO DIỆN TĨNH =================
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        
        if (req.url === '/panel-admin-an') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            return res.end(`
                <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cộng Tiền Chủ Shop</title></head>
                <body style="font-family:Arial; background:#0f172a; color:white; text-align:center; padding:20px;">
                    <div style="background:#1e293b; padding:25px; border-radius:15px; display:inline-block; max-width:400px; width:100%; text-align:left; margin-top:40px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #3b82f6;">
                        <h2 style="text-align:center; color:#3b82f6;">⚙️ PANEL CỘNG TIỀN KHÁCH</h2>
                        <label><b>Nhập Mã Số Khách (UID):</b></label><input type="text" id="uid" placeholder="Ví dụ: 582491" style="width:100%; padding:12px; margin:10px 0; font-size:16px; border-radius:8px; border:none; background:#0f172a; color:white;"><br>
                        <label><b>Số Tiền Cộng Thêm (đ):</b></label><input type="number" id="amount" style="width:100%; padding:12px; margin:10px 0; font-size:16px; border-radius:8px; border:none; background:#0f172a; color:white;"><br>
                        <button onclick="addMoney()" style="background:#3b82f6; color:white; padding:14px; width:100%; border:none; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">XÁC NHẬN CỘNG TIỀN</button>
                    </div>
                    <script>
                        function addMoney() {
                            const uid = document.getElementById('uid').value.trim(); const amount = document.getElementById('amount').value;
                            if(!uid || !amount) return alert("Vui lòng điền đủ thông tin!");
                            fetch('/api/admin/add-money', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ uid, amount: parseInt(amount) }) })
                            .then(res => res.json()).then(data => { alert(data.success ? "Cộng tiền thành công!" : "Lỗi: " + data.msg); });
                        }
                    </script>
                </body></html>
            `);
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
        fs.readFile(filePath, (error, content) => {
            if (error) { res.writeHead(404); res.end(); } 
            else { res.writeHead(200, { 'Content-Type': (mimeTypes[extname] || 'application/octet-stream') + '; charset=UTF-8' }); res.end(content, 'utf-8'); }
        });
    });
});

server.listen(PORT, () => console.log(`Hệ thống thuần đang chạy tại cổng: ${PORT}`));
