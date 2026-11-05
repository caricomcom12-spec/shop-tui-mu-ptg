const express = require("express");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL
        ? { rejectUnauthorized: false }
        : false,
    max: 5
});

function createUID() {
    return "PT-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}


// ==================================================
// KHO ACC DEMO
// ==================================================

const stock = {
    bag5k: [],
    tanbinh: [
        {username:"PTG_DEMO_TB_01",password:"tb111",level:10,rarity:"Thường",info:"Acc Tân Binh mẫu"},
        {username:"PTG_DEMO_TB_02",password:"tb222",level:20,rarity:"Hiếm",info:"Acc Tân Binh mẫu"},
        {username:"PTG_DEMO_TB_03",password:"tb333",level:27,rarity:"Hiếm",info:"Acc Tân Binh mẫu"},
        {username:"PTG_DEMO_TB_04",password:"tb444",level:35,rarity:"Siêu hiếm",info:"Acc Tân Binh mẫu"},
        {username:"PTG_DEMO_TB_05",password:"tb555",level:45,rarity:"Cực hiếm",info:"Acc Tân Binh mẫu đặc biệt"}
    ],
    premium: [
        {username:"PTG_DEMO_PRE_01",password:"pre111",level:35,rarity:"Hiếm",info:"Acc Premium mẫu"},
        {username:"PTG_DEMO_PRE_02",password:"pre222",level:42,rarity:"Hiếm",info:"Acc Premium mẫu"},
        {username:"PTG_DEMO_PRE_03",password:"pre333",level:50,rarity:"Siêu hiếm",info:"Acc Premium mẫu"},
        {username:"PTG_DEMO_PRE_04",password:"pre444",level:58,rarity:"Siêu hiếm",info:"Acc Premium mẫu"},
        {username:"PTG_DEMO_PRE_05",password:"pre555",level:65,rarity:"Cực hiếm",info:"Acc Premium mẫu đặc biệt"}
    ],
    legendary: [
        {username:"PTG_DEMO_LEG_01",password:"leg111",level:50,rarity:"Hiếm",info:"Acc Legendary mẫu"},
        {username:"PTG_DEMO_LEG_02",password:"leg222",level:60,rarity:"Siêu hiếm",info:"Acc Legendary mẫu"},
        {username:"PTG_DEMO_LEG_03",password:"leg333",level:70,rarity:"Siêu hiếm",info:"Acc Legendary mẫu"},
        {username:"PTG_DEMO_LEG_04",password:"leg444",level:80,rarity:"Cực hiếm",info:"Acc Legendary mẫu"},
        {username:"PTG_DEMO_LEG_05",password:"leg555",level:90,rarity:"Huyền thoại",info:"Acc Legendary mẫu đặc biệt"}
    ],
    lucky: [
        {username:"PTG_DEMO_LUCKY_01",password:"luck111",level:80,rarity:"Cực hiếm",info:"Acc Lucky mẫu"},
        {username:"PTG_DEMO_LUCKY_02",password:"luck222",level:90,rarity:"Huyền thoại",info:"Acc Lucky mẫu"},
        {username:"PTG_DEMO_LUCKY_03",password:"luck333",level:100,rarity:"Huyền thoại",info:"Acc Lucky mẫu"},
        {username:"PTG_DEMO_LUCKY_04",password:"luck444",level:120,rarity:"Cực phẩm",info:"Acc Lucky mẫu"}
    ],
    acc1: [
        {username:"DEMO_COKHI_01",password:"demo_cokhi_001",level:50,rarity:"Hiếm",info:"Acc Cần Cơ Khí demo 01"},
        {username:"DEMO_COKHI_02",password:"demo_cokhi_002",level:60,rarity:"Cực hiếm",info:"Acc Cần Cơ Khí demo 02"},
        {username:"DEMO_COKHI_03",password:"demo_cokhi_003",level:70,rarity:"Huyền thoại",info:"Acc Cần Cơ Khí demo 03"}
    ],
    acc2: [
        {username:"DEMO_CLONE_01",password:"clone_demo_001",level:20,rarity:"Thường",info:"Acc Clone 8XX-1XXKC demo 01"},
        {username:"DEMO_CLONE_02",password:"clone_demo_002",level:25,rarity:"Thường",info:"Acc Clone 8XX-1XXKC demo 02"},
        {username:"DEMO_CLONE_03",password:"clone_demo_003",level:30,rarity:"Hiếm",info:"Acc Clone 8XX-1XXKC demo 03"},
        {username:"DEMO_CLONE_04",password:"clone_demo_004",level:35,rarity:"Hiếm",info:"Acc Clone 8XX-1XXKC demo 04"},
        {username:"DEMO_CLONE_05",password:"clone_demo_005",level:40,rarity:"Hiếm",info:"Acc Clone 8XX-1XXKC demo 05"},
        {username:"DEMO_CLONE_06",password:"clone_demo_006",level:45,rarity:"Hiếm",info:"Acc Clone 8XX-1XXKC demo 06"},
        {username:"DEMO_CLONE_07",password:"clone_demo_007",level:50,rarity:"Siêu hiếm",info:"Acc Clone 8XX-1XXKC demo 07"},
        {username:"DEMO_CLONE_08",password:"clone_demo_008",level:55,rarity:"Siêu hiếm",info:"Acc Clone 8XX-1XXKC demo 08"},
        {username:"DEMO_CLONE_09",password:"clone_demo_009",level:60,rarity:"Siêu hiếm",info:"Acc Clone 8XX-1XXKC demo 09"},
        {username:"DEMO_CLONE_10",password:"clone_demo_010",level:65,rarity:"Cực hiếm",info:"Acc Clone 8XX-1XXKC demo 10"},
        {username:"DEMO_CLONE_11",password:"clone_demo_011",level:70,rarity:"Cực hiếm",info:"Acc Clone 8XX-1XXKC demo 11"},
        {username:"DEMO_CLONE_12",password:"clone_demo_012",level:75,rarity:"Cực hiếm",info:"Acc Clone 8XX-1XXKC demo 12"}
    ],
    acc3: []
};


// ==================================================
// TÚI 5K - 28 ACC MẪU
// ==================================================

const bag5kLevels = [
    12,18,25,31,40,14,16,19,21,23,26,28,30,32,
    34,36,38,40,42,44,46,48,50,52,54,56,58,60
];

const bag5kRarities = [
    "Thường","Hiếm","Hiếm","Siêu hiếm","Cực hiếm","Thường","Thường",
    "Hiếm","Hiếm","Hiếm","Hiếm","Siêu hiếm","Siêu hiếm","Siêu hiếm",
    "Siêu hiếm","Cực hiếm","Cực hiếm","Cực hiếm","Cực hiếm","Cực hiếm",
    "Cực hiếm","Cực hiếm","Huyền thoại","Huyền thoại","Huyền thoại",
    "Huyền thoại","Cực hiếm","Cực hiếm"
];

const bag5kInfo = [
    "nhân vật cơ bản","có một số vật phẩm","nhiều trang phục","nhiều vật phẩm",
    "acc mẫu đặc biệt","tài khoản mẫu","tài khoản mẫu","có vật phẩm",
    "có vật phẩm","tài khoản mẫu","nhiều vật phẩm","tài khoản mẫu",
    "nhiều trang phục","tài khoản mẫu","nhiều vật phẩm","tài khoản mẫu",
    "nhiều trang phục","nhiều vật phẩm","nhiều vật phẩm","nhiều vật phẩm",
    "nhiều vật phẩm","tài khoản mẫu","tài khoản mẫu đặc biệt","nhiều vật phẩm",
    "tài khoản mẫu đặc biệt","nhiều trang phục","tài khoản mẫu",
    "tài khoản mẫu đặc biệt"
];

for (let i = 0; i < 28; i++) {
    const n = String(i + 1).padStart(2, "0");

    const pass = [
        "demo123","demo456","demo789","demo999","demo000"
    ][i] || "demo" + String(i + 1).padStart(3, "0");

    stock.bag5k.push({
        username: "PTG_DEMO_5K_" + n,
        password: pass,
        level: bag5kLevels[i],
        rarity: bag5kRarities[i],
        info: "Acc demo 5K - " + bag5kInfo[i]
    });
}


// ==================================================
// ACC REG QUA GAME - 48 ACC MẪU
// ==================================================

const regRarities = [
    ...Array(10).fill("Thường"),
    ...Array(14).fill("Hiếm"),
    ...Array(12).fill("Siêu hiếm"),
    ...Array(10).fill("Cực hiếm"),
    ...Array(2).fill("Huyền thoại")
];

for (let i = 1; i <= 48; i++) {
    const n = String(i).padStart(2, "0");

    stock.acc3.push({
        username: "DEMO_REG_" + n,
        password: "reg_demo_" + String(i).padStart(3, "0"),
        level: i + 9,
        rarity: regRarities[i - 1],
        info: "Acc Reg Qua Game demo " + n
    });
}


// ==================================================
// LƯỢT BÁN DEMO
// ==================================================

const demoSold = {
    bag5k:7,
    tanbinh:3,
    premium:2,
    legendary:0,
    lucky:0,
    acc1:5,
    acc2:0,
    acc3:22
};


// ==================================================
// GIÁ SẢN PHẨM
// ==================================================

const validPrices = {
    bag5k:5000,
    tanbinh:20000,
    premium:50000,
    legendary:100000,
    lucky:500000,
    acc1:40000,
    acc2:13000,
    acc3:4000
};


// ==================================================
// KẾT NỐI SUPABASE VÀ TẠO BẢNG NẾU CHƯA CÓ
// ==================================================

async function initDatabase() {
    if (!process.env.DATABASE_URL) {
        throw new Error("Thiếu biến DATABASE_URL trong Render Environment.");
    }

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            gmail TEXT UNIQUE NOT NULL,
            uid TEXT UNIQUE NOT NULL,
            balance BIGINT NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS stock (
            id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            product TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            level INTEGER DEFAULT 0,
            rarity TEXT DEFAULT '',
            info TEXT DEFAULT '',
            sold BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS purchase_history (
            id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            uid TEXT NOT NULL REFERENCES users(uid),
            product TEXT NOT NULL,
            price BIGINT NOT NULL,
            account JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS stock_product_username_uidx
        ON stock(product, username)
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_purchase_uid
        ON purchase_history(uid, created_at DESC)
    `);

    for (const [product, accounts] of Object.entries(stock)) {
        for (const account of accounts) {
            await pool.query(
                `INSERT INTO stock
                (product, username, password, level, rarity, info)
                VALUES ($1,$2,$3,$4,$5,$6)
                ON CONFLICT (product, username) DO NOTHING`,
                [
                    product,
                    account.username,
                    account.password,
                    account.level,
                    account.rarity,
                    account.info
                ]
            );
        }
    }

    console.log("Supabase connected; demo stock checked.");
}


// ==================================================
// ĐĂNG NHẬP GMAIL - GIỮ UID VÀ SỐ DƯ CŨ
// ==================================================

app.post("/api/login", async (req, res) => {
    try {
        const gmail = String(req.body.gmail || "")
            .trim()
            .toLowerCase();

        if (!/^[^\s@]+@gmail\.com$/.test(gmail)) {
            return res.json({
                success: false,
                message: "Gmail không hợp lệ."
            });
        }

        // Chỉ tạo tài khoản mới nếu Gmail chưa tồn tại
        await pool.query(
            `INSERT INTO users (gmail, uid, balance)
             VALUES ($1, $2, 0)
             ON CONFLICT (gmail) DO NOTHING`,
            [gmail, createUID()]
        );

        // Lấy UID và số dư đã lưu
        const result = await pool.query(
            `SELECT gmail, uid, balance
             FROM users
             WHERE gmail = $1`,
            [gmail]
        );

        const user = result.rows[0];

        res.json({
            success: true,
            user: {
                gmail: user.gmail,
                uid: user.uid,
                balance: Number(user.balance)
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể đăng nhập."
        });
    }
});


// ==================================================
// LẤY LẠI UID VÀ SỐ DƯ THEO UID
// ==================================================

app.get("/api/user/:uid", async (req, res) => {
    try {
        const uid = String(req.params.uid || "").trim();

        const result = await pool.query(
            `SELECT gmail, uid, balance
             FROM users
             WHERE uid = $1`,
            [uid]
        );

        if (result.rowCount === 0) {
            return res.json({
                success: false,
                message: "Không tìm thấy tài khoản."
            });
        }

        const user = result.rows[0];

        res.json({
            success: true,
            user: {
                gmail: user.gmail,
                uid: user.uid,
                balance: Number(user.balance)
            }
        });

    } catch (error) {
        console.error("GET USER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy thông tin tài khoản."
        });
    }
});


// ==================================================
// MUA SẢN PHẨM - KHÓA KHO, CHỐNG BÁN TRÙNG
// ==================================================

app.post("/api/buy", async (req, res) => {
    const uid = String(req.body.uid || "").trim();
    const product = String(req.body.product || "").trim();
    const price = Number(req.body.price);

    if (
        !Object.prototype.hasOwnProperty.call(validPrices, product) ||
        validPrices[product] !== price
    ) {
        return res.json({
            success:false,
            message:"Sản phẩm không hợp lệ."
        });
    }

    let client;

    try {
        client = await pool.connect();

        await client.query("BEGIN");

        const userResult = await client.query(
            `SELECT gmail, uid, balance
             FROM users
             WHERE uid = $1
             FOR UPDATE`,
            [uid]
        );

        if (userResult.rowCount === 0) {
            await client.query("ROLLBACK");

            return res.json({
                success:false,
                message:"Phiên đăng nhập không hợp lệ."
            });
        }

        const balance = Number(userResult.rows[0].balance);

        if (balance < price) {
            await client.query("ROLLBACK");

            return res.json({
                success:false,
                code:"NOT_ENOUGH",
                balance:balance,
                message:"Số dư không đủ."
            });
        }

        const stockResult = await client.query(
            `SELECT id, username, password, level, rarity, info
             FROM stock
             WHERE product = $1 AND sold = FALSE
             ORDER BY id
             LIMIT 1
             FOR UPDATE SKIP LOCKED`,
            [product]
        );

        if (stockResult.rowCount === 0) {
            await client.query("ROLLBACK");

            return res.json({
                success:false,
                code:"OUT_OF_STOCK",
                message:"Sản phẩm này hiện đã hết acc."
            });
        }

        const row = stockResult.rows[0];

        const account = {
            username:row.username,
            password:row.password,
            level:row.level,
            rarity:row.rarity,
            info:row.info
        };

        await client.query(
            "UPDATE stock SET sold = TRUE WHERE id = $1",
            [row.id]
        );

        const newBalance = balance - price;

        await client.query(
            "UPDATE users SET balance = $1 WHERE uid = $2",
            [newBalance, uid]
        );

        const historyResult = await client.query(
            `INSERT INTO purchase_history
             (uid, product, price, account)
             VALUES ($1, $2, $3, $4)
             RETURNING created_at`,
            [uid, product, price, JSON.stringify(account)]
        );

        await client.query("COMMIT");

        res.json({
            success:true,
            account:account,
            balance:newBalance,
            history:{
                product:product,
                price:price,
                account:account,
                time:historyResult.rows[0].created_at
            }
        });

    } catch (error) {
        if (client) {
            try {
                await client.query("ROLLBACK");
            } catch (_) {}
        }

        console.error("BUY ERROR:", error);

        res.status(500).json({
            success:false,
            message:"Có lỗi khi mua sản phẩm."
        });

    } finally {
        if (client) {
            client.release();
        }
    }
});


// ==================================================
// LỊCH SỬ MUA
// ==================================================

app.get("/api/history", async (req, res) => {
    try {
        const uid = String(req.query.uid || "").trim();

        const user = await pool.query(
            "SELECT gmail, uid FROM users WHERE uid = $1",
            [uid]
        );

        if (user.rowCount === 0) {
            return res.json({
                success:false,
                message:"Không tìm thấy UID."
            });
        }

        const history = await pool.query(
            `SELECT product, price, account, created_at AS time
             FROM purchase_history
             WHERE uid = $1
             ORDER BY created_at DESC`,
            [uid]
        );

        res.json({
            success:true,
            uid:user.rows[0].uid,
            gmail:user.rows[0].gmail,
            history:history.rows
        });

    } catch (error) {
        console.error("HISTORY ERROR:", error);

        res.status(500).json({
            success:false,
            message:"Không tải được lịch sử."
        });
    }
});


// ==================================================
// SHOP STATUS
// ==================================================

app.get("/api/status", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT product, COUNT(*)::int AS total
             FROM stock
             WHERE sold = FALSE
             GROUP BY product`
        );

        const stockCount = {};

        for (const product of Object.keys(validPrices)) {
            stockCount[product] = 0;
        }

        for (const row of result.rows) {
            stockCount[row.product] = row.total;
        }

        const userCount = await pool.query(
            "SELECT COUNT(*)::int AS total FROM users"
        );

        res.json({
            success:true,
            message:"PT BAG SHOP đang hoạt động.",
            users:userCount.rows[0].total,
            stock:stockCount,
            demoSold:demoSold
        });

    } catch (error) {
        console.error("STATUS ERROR:", error);

        res.status(500).json({
            success:false,
            message:"Không tải được trạng thái shop."
        });
    }
});


// ==================================================
// ADMIN - DÙNG BIẾN MÔI TRƯỜNG RENDER
// ==================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;


// ==================================================
// ADMIN LOGIN
// ==================================================

app.post("/api/admin/login", (req, res) => {
    if (!ADMIN_PASSWORD || !ADMIN_TOKEN) {
        return res.status(503).json({
            success:false,
            message:"Admin chưa được cấu hình trên Render."
        });
    }

    const password = String(req.body.password || "");

    if (password !== ADMIN_PASSWORD) {
        return res.json({
            success:false,
            message:"Sai mật khẩu Admin."
        });
    }

    res.json({
        success:true,
        token:ADMIN_TOKEN
    });
});


// ==================================================
// KIỂM TRA ADMIN
// ==================================================

function checkAdmin(req, res, next) {
    const token = req.headers["x-admin-token"];

    if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
        return res.status(401).json({
            success:false,
            message:"Bạn không có quyền Admin."
        });
    }

    next();
}


// ==================================================
// ADMIN XEM USER
// ==================================================

app.get("/api/admin/user", checkAdmin, async (req, res) => {
    try {
        const uid = String(req.query.uid || "").trim();

        const result = await pool.query(
            `SELECT gmail, uid, balance
             FROM users
             WHERE uid = $1`,
            [uid]
        );

        if (result.rowCount === 0) {
            return res.json({
                success:false,
                message:"Không tìm thấy UID."
            });
        }

        const user = result.rows[0];

        res.json({
            success:true,
            user:{
                gmail:user.gmail,
                uid:user.uid,
                balance:Number(user.balance)
            }
        });

    } catch (error) {
        console.error("ADMIN USER ERROR:", error);

        res.status(500).json({
            success:false,
            message:"Lỗi máy chủ."
        });
    }
});


// ==================================================
// ADMIN CỘNG TIỀN
// ==================================================

app.post("/api/admin/add-money", checkAdmin, async (req, res) => {
    try {
        const uid = String(req.body.uid || "").trim();
        const amount = Number(req.body.amount);

        if (
            !Number.isSafeInteger(amount) ||
            amount <= 0 ||
            amount > 100000000
        ) {
            return res.json({
                success:false,
                message:"Số tiền không hợp lệ."
            });
        }

        const result = await pool.query(
            `UPDATE users
             SET balance = balance + $1
             WHERE uid = $2
             RETURNING balance`,
            [amount, uid]
        );

        if (result.rowCount === 0) {
            return res.json({
                success:false,
                message:"Không tìm thấy UID."
            });
        }

        res.json({
            success:true,
            balance:Number(result.rows[0].balance)
        });

    } catch (error) {
        console.error("ADMIN ADD MONEY ERROR:", error);

        res.status(500).json({
            success:false,
            message:"Không thể cộng tiền."
        });
    }
});


// ==================================================
// ADMIN XEM LỊCH SỬ
// ==================================================

app.get("/api/admin/history", checkAdmin, async (req, res) => {
    try {
        const uid = String(req.query.uid || "").trim();

        const user = await pool.query(
            "SELECT gmail, uid FROM users WHERE uid = $1",
            [uid]
        );

        if (user.rowCount === 0) {
            return res.json({
                success:false,
                message:"Không tìm thấy UID."
            });
        }

        const history = await pool.query(
            `SELECT product, price, account, created_at AS time
             FROM purchase_history
             WHERE uid = $1
             ORDER BY created_at DESC`,
            [uid]
        );

        res.json({
            success:true,
            gmail:user.rows[0].gmail,
            uid:user.rows[0].uid,
            history:history.rows
        });

    } catch (error) {
        console.error("ADMIN HISTORY ERROR:", error);

        res.status(500).json({
            success:false,
            message:"Không tải được lịch sử Admin."
        });
    }
});


// ==================================================
// TRANG ADMIN
// ==================================================

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});


// ==================================================
// TRANG CHỦ
// ==================================================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


// ==================================================
// START SERVER
// ==================================================

initDatabase()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`PT BAG SHOP running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("DATABASE START ERROR:", error);
        process.exit(1);
    });
