const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// ==================================================
// DATABASE TẠM
// ==================================================

const users = new Map();

// ==================================================
// TẠO UID
// ==================================================

function createUID(){

const random =
    Math.random()
    .toString(16)
    .substring(2,10)
    .toUpperCase();

return "PT-" + random;

}

// ==================================================
// KHO TÚI MÙ
// MỖI TÚI CÓ 5 ACC ẢO
// ==================================================

const stock = {

// =========================
// TÚI 5K
// =========================

bag5k: [

    {
        username:"PTG_DEMO_5K_01",
        password:"demo123",
        level:12,
        rarity:"Thường",
        info:"Acc demo 5K - nhân vật cơ bản"
    },

    {
        username:"PTG_DEMO_5K_02",
        password:"demo456",
        level:18,
        rarity:"Hiếm",
        info:"Acc demo 5K - có một số vật phẩm"
    },

    {
        username:"PTG_DEMO_5K_03",
        password:"demo789",
        level:25,
        rarity:"Hiếm",
        info:"Acc demo 5K - nhiều trang phục"
    },

    {
        username:"PTG_DEMO_5K_04",
        password:"demo999",
        level:31,
        rarity:"Siêu hiếm",
        info:"Acc demo 5K - nhiều vật phẩm"
    },

    {
        username:"PTG_DEMO_5K_05",
        password:"demo000",
        level:40,
        rarity:"Cực hiếm",
        info:"Acc demo 5K - acc mẫu đặc biệt"
    }

],


// =========================
// TÂN BINH
// =========================

tanbinh: [

    {
        username:"PTG_DEMO_TB_01",
        password:"tb111",
        level:10,
        rarity:"Thường",
        info:"Acc Tân Binh mẫu"
    },

    {
        username:"PTG_DEMO_TB_02",
        password:"tb222",
        level:20,
        rarity:"Hiếm",
        info:"Acc Tân Binh mẫu"
    },

    {
        username:"PTG_DEMO_TB_03",
        password:"tb333",
        level:27,
        rarity:"Hiếm",
        info:"Acc Tân Binh mẫu"
    },

    {
        username:"PTG_DEMO_TB_04",
        password:"tb444",
        level:35,
        rarity:"Siêu hiếm",
        info:"Acc Tân Binh mẫu"
    },

    {
        username:"PTG_DEMO_TB_05",
        password:"tb555",
        level:45,
        rarity:"Cực hiếm",
        info:"Acc Tân Binh mẫu đặc biệt"
    }

],


// =========================
// PREMIUM
// =========================

premium: [

    {
        username:"PTG_DEMO_PRE_01",
        password:"pre111",
        level:35,
        rarity:"Hiếm",
        info:"Acc Premium mẫu"
    },

    {
        username:"PTG_DEMO_PRE_02",
        password:"pre222",
        level:42,
        rarity:"Hiếm",
        info:"Acc Premium mẫu"
    },

    {
        username:"PTG_DEMO_PRE_03",
        password:"pre333",
        level:50,
        rarity:"Siêu hiếm",
        info:"Acc Premium mẫu"
    },

    {
        username:"PTG_DEMO_PRE_04",
        password:"pre444",
        level:58,
        rarity:"Siêu hiếm",
        info:"Acc Premium mẫu"
    },

    {
        username:"PTG_DEMO_PRE_05",
        password:"pre555",
        level:65,
        rarity:"Cực hiếm",
        info:"Acc Premium mẫu đặc biệt"
    }

],


// =========================
// LEGENDARY
// =========================

legendary: [

    {
        username:"PTG_DEMO_LEG_01",
        password:"leg111",
        level:50,
        rarity:"Hiếm",
        info:"Acc Legendary mẫu"
    },

    {
        username:"PTG_DEMO_LEG_02",
        password:"leg222",
        level:60,
        rarity:"Siêu hiếm",
        info:"Acc Legendary mẫu"
    },

    {
        username:"PTG_DEMO_LEG_03",
        password:"leg333",
        level:70,
        rarity:"Siêu hiếm",
        info:"Acc Legendary mẫu"
    },

    {
        username:"PTG_DEMO_LEG_04",
        password:"leg444",
        level:80,
        rarity:"Cực hiếm",
        info:"Acc Legendary mẫu"
    },

    {
        username:"PTG_DEMO_LEG_05",
        password:"leg555",
        level:90,
        rarity:"Huyền thoại",
        info:"Acc Legendary mẫu đặc biệt"
    }

],


// =========================
// VIP
// =========================

vip: [

    {
        username:"PTG_DEMO_VIP_01",
        password:"vip111",
        level:60,
        rarity:"Siêu hiếm",
        info:"Acc VIP mẫu"
    },

    {
        username:"PTG_DEMO_VIP_02",
        password:"vip222",
        level:70,
        rarity:"Siêu hiếm",
        info:"Acc VIP mẫu"
    },

    {
        username:"PTG_DEMO_VIP_03",
        password:"vip333",
        level:80,
        rarity:"Cực hiếm",
        info:"Acc VIP mẫu"
    },

    {
        username:"PTG_DEMO_VIP_04",
        password:"vip444",
        level:90,
        rarity:"Huyền thoại",
        info:"Acc VIP mẫu"
    },

    {
        username:"PTG_DEMO_VIP_05",
        password:"vip555",
        level:100,
        rarity:"Huyền thoại",
        info:"Acc VIP mẫu đặc biệt"
    }

],


// =========================
// ULTRA
// =========================

ultra: [

    {
        username:"PTG_DEMO_ULT_01",
        password:"ult111",
        level:70,
        rarity:"Cực hiếm",
        info:"Acc Ultra mẫu"
    },

    {
        username:"PTG_DEMO_ULT_02",
        password:"ult222",
        level:80,
        rarity:"Cực hiếm",
        info:"Acc Ultra mẫu"
    },

    {
        username:"PTG_DEMO_ULT_03",
        password:"ult333",
        level:90,
        rarity:"Huyền thoại",
        info:"Acc Ultra mẫu"
    },

    {
        username:"PTG_DEMO_ULT_04",
        password:"ult444",
        level:100,
        rarity:"Huyền thoại",
        info:"Acc Ultra mẫu"
    },

    {
        username:"PTG_DEMO_ULT_05",
        password:"ult555",
        level:120,
        rarity:"Cực phẩm",
        info:"Acc Ultra mẫu đặc biệt"
    }

],


// =========================
// LUCKY
// =========================

lucky: [

    {
        username:"PTG_DEMO_LUCKY_01",
        password:"luck111",
        level:80,
        rarity:"Cực hiếm",
        info:"Acc Lucky mẫu"
    },

    {
        username:"PTG_DEMO_LUCKY_02",
        password:"luck222",
        level:90,
        rarity:"Huyền thoại",
        info:"Acc Lucky mẫu"
    },

    {
        username:"PTG_DEMO_LUCKY_03",
        password:"luck333",
        level:100,
        rarity:"Huyền thoại",
        info:"Acc Lucky mẫu"
    },

    {
        username:"PTG_DEMO_LUCKY_04",
        password:"luck444",
        level:120,
        rarity:"Cực phẩm",
        info:"Acc Lucky mẫu"
    },

    {
        username:"PTG_DEMO_LUCKY_05",
        password:"luck555",
        level:150,
        rarity:"SIÊU CỰC PHẨM",
        info:"Acc Lucky mẫu đặc biệt"
    }

]

};

// ==================================================
// GIÁ TÚI
// ==================================================

const validPrices = {

bag5k:5000,

tanbinh:20000,

premium:50000,

legendary:100000,

vip:200000,

ultra:500000,

lucky:1000000

};

// ==================================================
// LOGIN
// ==================================================

app.post("/api/login",(req,res)=>{

const gmail =
    String(req.body.gmail || "")
    .trim()
    .toLowerCase();


if(!gmail.endsWith("@gmail.com")){

    return res.json({

        success:false,

        message:"Gmail không hợp lệ."

    });

}


let user = users.get(gmail);


// Gmail cũ -> giữ UID
if(!user){

    user = {

        gmail:gmail,

        uid:createUID(),

        balance:0,

        history:[]

    };


    users.set(gmail,user);

}


if(!user.history){

    user.history=[];

}


return res.json({

    success:true,

    user:{

        gmail:user.gmail,

        uid:user.uid,

        balance:user.balance

    }

});

});

// ==================================================
// TÌM USER THEO UID
// ==================================================

function findUserByUID(uid){

for(const user of users.values()){

    if(user.uid === uid){

        return user;

    }

}

return null;

}

// ==================================================
// MUA / BỐC TÚI
// ==================================================

app.post("/api/buy",(req,res)=>{

const uid =
    String(req.body.uid || "")
    .trim();


const product =
    String(req.body.product || "")
    .trim();


const price =
    Number(req.body.price);


// Tìm user
const user =
    findUserByUID(uid);


if(!user){

    return res.json({

        success:false,

        message:"Phiên đăng nhập không hợp lệ."

    });

}


// Kiểm tra sản phẩm + giá
if(
    !validPrices[product] ||
    validPrices[product] !== price
){

    return res.json({

        success:false,

        message:"Sản phẩm không hợp lệ."

    });

}


// Không đủ tiền
if(user.balance < price){

    return res.json({

        success:false,

        code:"NOT_ENOUGH",

        balance:user.balance

    });

}


// Hết acc
if(
    !stock[product] ||
    stock[product].length === 0
){

    return res.json({

        success:false,

        code:"OUT_OF_STOCK",

        message:"Túi này hiện đã hết acc."

    });

}


// ==============================================
// BỐC ACC
// ==============================================

const account =
    stock[product].shift();


// ==============================================
// TRỪ TIỀN
// ==============================================

user.balance -= price;


// ==============================================
// TẠO LỊCH SỬ
// ==============================================

const historyItem = {

    product:product,

    price:price,

    account:{

        username:account.username,

        password:account.password,

        level:account.level,

        rarity:account.rarity,

        info:account.info

    },

    time:new Date().toISOString()

};


user.history.push(historyItem);


// ==============================================
// TRẢ KẾT QUẢ
// ==============================================

return res.json({

    success:true,

    account:account,

    balance:user.balance,

    history:historyItem

});

});

// ==================================================
// LỊCH SỬ CỦA UID
// ==================================================

app.get("/api/history",(req,res)=>{

const uid =
    String(req.query.uid || "")
    .trim();


const user =
    findUserByUID(uid);


if(!user){

    return res.json({

        success:false,

        message:"Không tìm thấy UID."

    });

}


return res.json({

    success:true,

    uid:user.uid,

    gmail:user.gmail,

    history:user.history || []

});

});

// ==================================================
// STATUS
// ==================================================

app.get("/api/status",(req,res)=>{

const stockCount = {};

for(const product in stock){

    stockCount[product] =
        stock[product].length;

}


res.json({

    success:true,

    message:"PT BAG SHOP đang hoạt động.",

    users:users.size,

    stock:stockCount

});

});

// ==================================================
// ADMIN
// ==================================================

const ADMIN_PASSWORD = "congdang86";

const ADMIN_TOKEN =
"PTG-ADMIN-SECRET-2026";

// ==================================================
// ADMIN LOGIN
// ==================================================

app.post("/api/admin/login",(req,res)=>{

const password =
    String(req.body.password || "");


if(password !== ADMIN_PASSWORD){

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
// KIỂM TRA QUYỀN ADMIN
// ==================================================

function checkAdmin(req,res,next){

const token =
    req.headers["x-admin-token"];


if(token !== ADMIN_TOKEN){

    return res.status(401).json({

        success:false,

        message:"Bạn không có quyền Admin."

    });

}


next();

}

// ==================================================
// ADMIN TÌM USER
// ==================================================

app.get(

"/api/admin/user",

checkAdmin,

(req,res)=>{

    const uid =
        String(req.query.uid || "")
        .trim();


    const found =
        findUserByUID(uid);


    if(!found){

        return res.json({

            success:false,

            message:"Không tìm thấy UID."

        });

    }


    res.json({

        success:true,

        user:{

            gmail:found.gmail,

            uid:found.uid,

            balance:found.balance

        }

    });

}

);

// ==================================================
// ADMIN CỘNG TIỀN
// ==================================================

app.post(

"/api/admin/add-money",

checkAdmin,

(req,res)=>{

    const uid =
        String(req.body.uid || "")
        .trim();


    const amount =
        Number(req.body.amount);


    if(
        !Number.isFinite(amount) ||
        amount <= 0
    ){

        return res.json({

            success:false,

            message:"Số tiền không hợp lệ."

        });

    }


    if(amount > 100000000){

        return res.json({

            success:false,

            message:"Số tiền cộng quá lớn."

        });

    }


    const found =
        findUserByUID(uid);


    if(!found){

        return res.json({

            success:false,

            message:"Không tìm thấy UID."

        });

    }


    found.balance += amount;


    res.json({

        success:true,

        balance:found.balance

    });

}

);

// ==================================================
// ADMIN XEM LỊCH SỬ UID
// ==================================================

app.get(

"/api/admin/history",

checkAdmin,

(req,res)=>{

    const uid =
        String(req.query.uid || "")
        .trim();


    const found =
        findUserByUID(uid);


    if(!found){

        return res.json({

            success:false,

            message:"Không tìm thấy UID."

        });

    }


    res.json({

        success:true,

        gmail:found.gmail,

        uid:found.uid,

        history:found.history || []

    });

}

);

// ==================================================
// TRANG ADMIN
// ==================================================

app.get("/admin",(req,res)=>{

res.sendFile(

    __dirname +
    "/public/admin.html"

);

});

// ==================================================
// TRANG CHÍNH
// ==================================================

app.get("/",(req,res)=>{

res.sendFile(

    __dirname +
    "/public/index.html"

);

});

// ==================================================
// START SERVER
// ==================================================

app.listen(

PORT,

"0.0.0.0",

()=>{

    console.log(

        `PT BAG SHOP running on port ${PORT}`

    );

}

)
