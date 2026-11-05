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
// KHO ACC DEMO - GIá»® NGUYĂN TĂN, Máº¬T KHáº¨U VĂ€ GIĂ TRá»
// ==================================================

const stock = {
    bag5k: [],
    tanbinh: [
        {username:"PTG_DEMO_TB_01",password:"tb111",level:10,rarity:"ThÆ°á»ng",info:"Acc TĂ¢n Binh máº«u"},
        {username:"PTG_DEMO_TB_02",password:"tb222",level:20,rarity:"Hiáº¿m",info:"Acc TĂ¢n Binh máº«u"},
        {username:"PTG_DEMO_TB_03",password:"tb333",level:27,rarity:"Hiáº¿m",info:"Acc TĂ¢n Binh máº«u"},
        {username:"PTG_DEMO_TB_04",password:"tb444",level:35,rarity:"SiĂªu hiáº¿m",info:"Acc TĂ¢n Binh máº«u"},
        {username:"PTG_DEMO_TB_05",password:"tb555",level:45,rarity:"Cá»±c hiáº¿m",info:"Acc TĂ¢n Binh máº«u Ä‘áº·c biá»‡t"}
    ],
    premium: [
        {username:"PTG_DEMO_PRE_01",password:"pre111",level:35,rarity:"Hiáº¿m",info:"Acc Premium máº«u"},
        {username:"PTG_DEMO_PRE_02",password:"pre222",level:42,rarity:"Hiáº¿m",info:"Acc Premium máº«u"},
        {username:"PTG_DEMO_PRE_03",password:"pre333",level:50,rarity:"SiĂªu hiáº¿m",info:"Acc Premium máº«u"},
        {username:"PTG_DEMO_PRE_04",password:"pre444",level:58,rarity:"SiĂªu hiáº¿m",info:"Acc Premium máº«u"},
        {username:"PTG_DEMO_PRE_05",password:"pre555",level:65,rarity:"Cá»±c hiáº¿m",info:"Acc Premium máº«u Ä‘áº·c biá»‡t"}
    ],
    legendary: [
        {username:"PTG_DEMO_LEG_01",password:"leg111",level:50,rarity:"Hiáº¿m",info:"Acc Legendary máº«u"},
        {username:"PTG_DEMO_LEG_02",password:"leg222",level:60,rarity:"SiĂªu hiáº¿m",info:"Acc Legendary máº«u"},
        {username:"PTG_DEMO_LEG_03",password:"leg333",level:70,rarity:"SiĂªu hiáº¿m",info:"Acc Legendary máº«u"},
        {username:"PTG_DEMO_LEG_04",password:"leg444",level:80,rarity:"Cá»±c hiáº¿m",info:"Acc Legendary máº«u"},
        {username:"PTG_DEMO_LEG_05",password:"leg555",level:90,rarity:"Huyá»n thoáº¡i",info:"Acc Legendary máº«u Ä‘áº·c biá»‡t"}
    ],
    lucky: [
        {username:"PTG_DEMO_LUCKY_01",password:"luck111",level:80,rarity:"Cá»±c hiáº¿m",info:"Acc Lucky máº«u"},
        {username:"PTG_DEMO_LUCKY_02",password:"luck222",level:90,rarity:"Huyá»n thoáº¡i",info:"Acc Lucky máº«u"},
        {username:"PTG_DEMO_LUCKY_03",password:"luck333",level:100,rarity:"Huyá»n thoáº¡i",info:"Acc Lucky máº«u"},
        {username:"PTG_DEMO_LUCKY_04",password:"luck444",level:120,rarity:"Cá»±c pháº©m",info:"Acc Lucky máº«u"}
    ],
    acc1: [
        {username:"DEMO_COKHI_01",password:"demo_cokhi_001",level:50,rarity:"Hiáº¿m",info:"Acc Cáº§n CÆ¡ KhĂ­ demo 01"},
        {username:"DEMO_COKHI_02",password:"demo_cokhi_002",level:60,rarity:"Cá»±c hiáº¿m",info:"Acc Cáº§n CÆ¡ KhĂ­ demo 02"},
        {username:"DEMO_COKHI_03",password:"demo_cokhi_003",level:70,rarity:"Huyá»n thoáº¡i",info:"Acc Cáº§n CÆ¡ KhĂ­ demo 03"}
    ],
    acc2: [
        {username:"DEMO_CLONE_01",password:"clone_demo_001",level:20,rarity:"ThÆ°á»ng",info:"Acc Clone 8XX-1XXKC demo 01"},
        {username:"DEMO_CLONE_02",password:"clone_demo_002",level:25,rarity:"ThÆ°á»ng",info:"Acc Clone 8XX-1XXKC demo 02"},
        {username:"DEMO_CLONE_03",password:"clone_demo_003",level:30,rarity:"Hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 03"},
        {username:"DEMO_CLONE_04",password:"clone_demo_004",level:35,rarity:"Hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 04"},
        {username:"DEMO_CLONE_05",password:"clone_demo_005",level:40,rarity:"Hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 05"},
        {username:"DEMO_CLONE_06",password:"clone_demo_006",level:45,rarity:"Hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 06"},
        {username:"DEMO_CLONE_07",password:"clone_demo_007",level:50,rarity:"SiĂªu hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 07"},
        {username:"DEMO_CLONE_08",password:"clone_demo_008",level:55,rarity:"SiĂªu hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 08"},
        {username:"DEMO_CLONE_09",password:"clone_demo_009",level:60,rarity:"SiĂªu hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 09"},
        {username:"DEMO_CLONE_10",password:"clone_demo_010",level:65,rarity:"Cá»±c hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 10"},
        {username:"DEMO_CLONE_11",password:"clone_demo_011",level:70,rarity:"Cá»±c hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 11"},
        {username:"DEMO_CLONE_12",password:"clone_demo_012",level:75,rarity:"Cá»±c hiáº¿m",info:"Acc Clone 8XX-1XXKC demo 12"}
    ],
    acc3: []
};

// TĂºi 5K: giá»¯ nguyĂªn 28 máº«u, thá»© tá»± vĂ  thĂ´ng tin.
const bag5kLevels = [12,18,25,31,40,14,16,19,21,23,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60];
const bag5kRarities = [
    "ThÆ°á»ng","Hiáº¿m","Hiáº¿m","SiĂªu hiáº¿m","Cá»±c hiáº¿m","ThÆ°á»ng","ThÆ°á»ng",
    "Hiáº¿m","Hiáº¿m","Hiáº¿m","Hiáº¿m","SiĂªu hiáº¿m","SiĂªu hiáº¿m","SiĂªu hiáº¿m",
    "SiĂªu hiáº¿m","Cá»±c hiáº¿m","Cá»±c hiáº¿m","Cá»±c hiáº¿m","Cá»±c hiáº¿m","Cá»±c hiáº¿m",
    "Cá»±c hiáº¿m","Cá»±c hiáº¿m","Huyá»n thoáº¡i","Huyá»n thoáº¡i","Huyá»n thoáº¡i",
    "Huyá»n thoáº¡i","Cá»±c hiáº¿m","Cá»±c hiáº¿m"
];
const bag5kInfo = [
    "nhĂ¢n váº­t cÆ¡ báº£n","cĂ³ má»™t sá»‘ váº­t pháº©m","nhiá»u trang phá»¥c","nhiá»u váº­t pháº©m",
    "acc máº«u Ä‘áº·c biá»‡t","tĂ i khoáº£n máº«u","tĂ i khoáº£n máº«u","cĂ³ váº­t pháº©m",
    "cĂ³ váº­t pháº©m","tĂ i khoáº£n máº«u","nhiá»u váº­t pháº©m","tĂ i khoáº£n máº«u",
    "nhiá»u trang phá»¥c","tĂ i khoáº£n máº«u","nhiá»u váº­t pháº©m","tĂ i khoáº£n máº«u",
    "nhiá»u trang phá»¥c","nhiá»u váº­t pháº©m","nhiá»u váº­t pháº©m","nhiá»u váº­t pháº©m",
    "nhiá»u váº­t pháº©m","tĂ i khoáº£n máº«u","tĂ i khoáº£n máº«u Ä‘áº·c biá»‡t","nhiá»u váº­t pháº©m",
    "tĂ i khoáº£n máº«u Ä‘áº·c biá»‡t","nhiá»u trang phá»¥c","tĂ i khoáº£n máº«u",
    "tĂ i khoáº£n máº«u Ä‘áº·c biá»‡t"
];
for (let i = 0; i < 28; i++) {
    const n = String(i + 1).padStart(2, "0");
    const pass = ["demo123","demo456","demo789","demo999","demo000"][i] ||
        "demo" + String(i + 1).padStart(3, "0");
    stock.bag5k.push({
        username: "PTG_DEMO_5K_" + n,
        password: pass,
        level: bag5kLevels[i],
        rarity: bag5kRarities[i],
        info: "Acc demo 5K - " + bag5kInfo[i]
    });
}

// Acc Reg Qua Game: giá»¯ nguyĂªn 48 máº«u.
const regRarities = [
    ...Array(10).fill("ThÆ°á»ng"),
    ...Array(14).fill("Hiáº¿m"),
    ...Array(12).fill("SiĂªu hiáº¿m"),
    ...Array(10).fill("Cá»±c hiáº¿m"),
    ...Array(2).fill("Huyá»n thoáº¡i")
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
// LÆ¯á»¢T BĂN DEMO VĂ€ GIĂ Sáº¢N PHáº¨M
// ==================================================

const demoSold = {
    bag5k:7, tanbinh:3, premium:2, legendary:0, lucky:0,
    acc1:5, acc2:0, acc3:22
};

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
// DATABASE: Táº O Báº¢NG Náº¾U CHÆ¯A CĂ“ + Náº P KHO MáºªU AN TOĂ€N
// ==================================================

async function initDatabase() {
    if (!process.env.DATABASE_URL) {
        throw new Error("Thiáº¿u biáº¿n DATABASE_URL trong Render Environment.");
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
                [product, account.username, account.password,
                 account.level, account.rarity, account.info]
            );
        }
    }

    console.log("Supabase connected; demo stock checked.");
}


// ==================================================
// LOGIN - KHĂ”NG OTP (LÆ¯U UID VĂ€ Sá» DÆ¯ TRONG DATABASE)
// ==================================================

app.post("/api/login", async (req, res) => {
    try {
        const gmail = String(req.body.gmail || "").trim().toLowerCase();

        if (!/^[^\s@]+@gmail\.com$/.test(gmail)) {
            return res.json({ success:false, message:"Gmail khĂ´ng há»£p lá»‡." });
        }

        const result = await pool.query(
            `INSERT INTO users (gmail, uid, balance)
             VALUES ($1, $2, 0)
             ON CONFLICT (gmail) DO UPDATE SET gmail = EXCLUDED.gmail
             RETURNING gmail, uid, balance`,
            [gmail, createUID()]
        );

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
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ success:false, message:"KhĂ´ng thá»ƒ Ä‘Äƒng nháº­p." });
    }
});


// ==================================================
// MUA HĂ€NG: TRANSACTION + KHĂ“A DĂ’NG Äá»‚ TRĂNH BĂN TRĂ™NG
// ==================================================

app.post("/api/buy", async (req, res) => {
    const uid = String(req.body.uid || "").trim();
    const product = String(req.body.product || "").trim();
    const price = Number(req.body.price);

    if (!Object.prototype.hasOwnProperty.call(validPrices, product) ||
        validPrices[product] !== price) {
        return res.json({ success:false, message:"Sáº£n pháº©m khĂ´ng há»£p lá»‡." });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query("BEGIN");

        const userResult = await client.query(
            "SELECT gmail, uid, balance FROM users WHERE uid = $1 FOR UPDATE",
            [uid]
        );

        if (userResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.json({ success:false, message:"PhiĂªn Ä‘Äƒng nháº­p khĂ´ng há»£p lá»‡." });
        }

        const balance = Number(userResult.rows[0].balance);
        if (balance < price) {
            await client.query("ROLLBACK");
            return res.json({
                success:false, code:"NOT_ENOUGH",
                balance, message:"Sá»‘ dÆ° khĂ´ng Ä‘á»§."
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
                success:false, code:"OUT_OF_STOCK",
                message:"Sáº£n pháº©m nĂ y hiá»‡n Ä‘Ă£ háº¿t acc."
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

        await client.query("UPDATE stock SET sold = TRUE WHERE id = $1", [row.id]);

        const newBalance = balance - price;
        await client.query(
            "UPDATE users SET balance = $1 WHERE uid = $2",
            [newBalance, uid]
        );

        const historyResult = await client.query(
            `INSERT INTO purchase_history (uid, product, price, account)
             VALUES ($1, $2, $3, $4)
             RETURNING created_at`,
            [uid, product, price, JSON.stringify(account)]
        );

        await client.query("COMMIT");

        res.json({
            success:true,
            account,
            balance:newBalance,
            history:{
                product, price, account,
                time:historyResult.rows[0].created_at
            }
        });
    } catch (error) {
        if (client) {
            try { await client.query("ROLLBACK"); } catch (_) {}
        }
        console.error("BUY ERROR:", error);
        res.status(500).json({ success:false, message:"CĂ³ lá»—i khi mua sáº£n pháº©m." });
    } finally {
        if (client) client.release();
    }
});


// ==================================================
// Lá»CH Sá»¬ MUA
// ==================================================

app.get("/api/history", async (req, res) => {
    try {
        const uid = String(req.query.uid || "").trim();
        const user = await pool.query(
            "SELECT gmail, uid FROM users WHERE uid = $1",
            [uid]
        );

        if (user.rowCount === 0) {
            return res.json({ success:false, message:"KhĂ´ng tĂ¬m tháº¥y UID." });
        }

        const history = await pool.query(
            `SELECT product, price, account, created_at AS time
             FROM purchase_history WHERE uid = $1
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
        res.status(500).json({ success:false, message:"KhĂ´ng táº£i Ä‘Æ°á»£c lá»‹ch sá»­." });
    }
});


// ==================================================
// SHOP STATUS
// ==================================================

app.get("/api/status", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT product, COUNT(*)::int AS total
             FROM stock WHERE sold = FALSE GROUP BY product`
        );

        const stockCount = {};
        for (const product of Object.keys(validPrices)) stockCount[product] = 0;
        for (const row of result.rows) stockCount[row.product] = row.total;

        const userCount = await pool.query("SELECT COUNT(*)::int AS total FROM users");

        res.json({
            success:true,
            message:"PT BAG SHOP Ä‘ang hoáº¡t Ä‘á»™ng.",
            users:userCount.rows[0].total,
            stock:stockCount,
            demoSold
        });
    } catch (error) {
        console.error("STATUS ERROR:", error);
        res.status(500).json({ success:false, message:"KhĂ´ng táº£i Ä‘Æ°á»£c tráº¡ng thĂ¡i shop." });
    }
});


// ==================================================
// ADMIN - Äá»ŒC BĂ Máº¬T Tá»ª RENDER ENVIRONMENT
// ==================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

app.post("/api/admin/login", (req, res) => {
    if (!ADMIN_PASSWORD || !ADMIN_TOKEN) {
        return res.status(503).json({
            success:false, message:"Admin chÆ°a Ä‘Æ°á»£c cáº¥u hĂ¬nh trĂªn Render."
        });
    }

    if (String(req.body.password || "") !== ADMIN_PASSWORD) {
        return res.json({ success:false, message:"Sai máº­t kháº©u Admin." });
    }

    res.json({ success:true, token:ADMIN_TOKEN });
});

function checkAdmin(req, res, next) {
    if (!ADMIN_TOKEN || req.headers["x-admin-token"] !== ADMIN_TOKEN) {
        return res.status(401).json({
            success:false, message:"Báº¡n khĂ´ng cĂ³ quyá»n Admin."
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
            "SELECT gmail, uid, balance FROM users WHERE uid = $1",
            [uid]
        );

        if (result.rowCount === 0) {
            return res.json({ success:false, message:"KhĂ´ng tĂ¬m tháº¥y UID." });
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
        res.status(500).json({ success:false, message:"Lá»—i mĂ¡y chá»§." });
    }
});


// ==================================================
// ADMIN Cá»˜NG TIá»€N
// ==================================================

app.post("/api/admin/add-money", checkAdmin, async (req, res) => {
    try {
        const uid = String(req.body.uid || "").trim();
        const amount = Number(req.body.amount);

        if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 100000000) {
            return res.json({ success:false, message:"Sá»‘ tiá»n khĂ´ng há»£p lá»‡." });
        }

        const result = await pool.query(
            `UPDATE users SET balance = balance + $1
             WHERE uid = $2 RETURNING balance`,
            [amount, uid]
        );

        if (result.rowCount === 0) {
            return res.json({ success:false, message:"KhĂ´ng tĂ¬m tháº¥y UID." });
        }

        res.json({ success:true, balance:Number(result.rows[0].balance) });
    } catch (error) {
        console.error("ADMIN ADD MONEY ERROR:", error);
        res.status(500).json({ success:false, message:"KhĂ´ng thá»ƒ cá»™ng tiá»n." });
    }
});


// ==================================================
// ADMIN XEM Lá»CH Sá»¬
// ==================================================

app.get("/api/admin/history", checkAdmin, async (req, res) => {
    try {
        const uid = String(req.query.uid || "").trim();
        const user = await pool.query(
            "SELECT gmail, uid FROM users WHERE uid = $1",
            [uid]
        );

        if (user.rowCount === 0) {
            return res.json({ success:false, message:"KhĂ´ng tĂ¬m tháº¥y UID." });
        }

        const history = await pool.query(
            `SELECT product, price, account, created_at AS time
             FROM purchase_history WHERE uid = $1
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
        res.status(500).json({ success:false, message:"KhĂ´ng táº£i Ä‘Æ°á»£c lá»‹ch sá»­ Admin." });
    }
});


// ==================================================
// TRANG ADMIN VĂ€ TRANG CHá»¦
// ==================================================

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});

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
