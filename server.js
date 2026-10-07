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
// KHO SẢN PHẨM
// VIP + ULTRA ĐÃ BỎ
// ==================================================

const stock = {

    // ==================================================
    // TÚI 5K
    // ==================================================

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
        },

        {
            username:"PTG_DEMO_5K_06",
            password:"demo006",
            level:14,
            rarity:"Thường",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_07",
            password:"demo007",
            level:16,
            rarity:"Thường",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_08",
            password:"demo008",
            level:19,
            rarity:"Hiếm",
            info:"Acc demo 5K - có vật phẩm"
        },

        {
            username:"PTG_DEMO_5K_09",
            password:"demo009",
            level:21,
            rarity:"Hiếm",
            info:"Acc demo 5K - có vật phẩm"
        },

        {
            username:"PTG_DEMO_5K_10",
            password:"demo010",
            level:23,
            rarity:"Hiếm",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_11",
            password:"demo011",
            level:26,
            rarity:"Hiếm",
            info:"Acc demo 5K - nhiều vật phẩm"
        },

        {
            username:"PTG_DEMO_5K_12",
            password:"demo012",
            level:28,
            rarity:"Siêu hiếm",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_13",
            password:"demo013",
            level:30,
            rarity:"Siêu hiếm",
            info:"Acc demo 5K - nhiều trang phục"
        },

        {
            username:"PTG_DEMO_5K_14",
            password:"demo014",
            level:32,
            rarity:"Siêu hiếm",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_15",
            password:"demo015",
            level:34,
            rarity:"Siêu hiếm",
            info:"Acc demo 5K - nhiều vật phẩm"
        },

        {
            username:"PTG_DEMO_5K_16",
            password:"demo016",
            level:36,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_17",
            password:"demo017",
            level:38,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - nhiều trang phục"
        },

        {
            username:"PTG_DEMO_5K_18",
            password:"demo018",
            level:40,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_19",
            password:"demo019",
            level:42,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - nhiều vật phẩm"
        },

        {
            username:"PTG_DEMO_5K_20",
            password:"demo020",
            level:44,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - nhiều vật phẩm"
        },

        {
            username:"PTG_DEMO_5K_21",
            password:"demo021",
            level:46,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - nhiều vật phẩm"
        },

        {
            username:"PTG_DEMO_5K_22",
            password:"demo022",
            level:48,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_23",
            password:"demo023",
            level:50,
            rarity:"Huyền thoại",
            info:"Acc demo 5K - tài khoản mẫu đặc biệt"
        },

        {
            username:"PTG_DEMO_5K_24",
            password:"demo024",
            level:52,
            rarity:"Huyền thoại",
            info:"Acc demo 5K - nhiều vật phẩm"
        },

        {
            username:"PTG_DEMO_5K_25",
            password:"demo025",
            level:54,
            rarity:"Huyền thoại",
            info:"Acc demo 5K - tài khoản mẫu đặc biệt"
        },

        {
            username:"PTG_DEMO_5K_26",
            password:"demo026",
            level:56,
            rarity:"Huyền thoại",
            info:"Acc demo 5K - nhiều trang phục"
        },

        {
            username:"PTG_DEMO_5K_27",
            password:"demo027",
            level:58,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - tài khoản mẫu"
        },

        {
            username:"PTG_DEMO_5K_28",
            password:"demo028",
            level:60,
            rarity:"Cực hiếm",
            info:"Acc demo 5K - tài khoản mẫu đặc biệt"
        }

    ],


    // ==================================================
    // TÂN BINH
    // ==================================================

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


    // ==================================================
    // PREMIUM
    // ==================================================

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


    // ==================================================
    // LEGENDARY
    // ==================================================

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


    // ==================================================
    // LUCKY
    // ==================================================

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
        }

    ],


    // ==================================================
    // ACC BÁN RIÊNG 1
    // ==================================================

    acc1: [

        {
            username:"ACC_BAN_01",
            password:"demoacc001",
            level:50,
            rarity:"Hiếm",
            info:"Acc bán riêng mẫu 01"
        },

        {
            username:"ACC_BAN_02",
            password:"demoacc002",
            level:60,
            rarity:"Hiếm",
            info:"Acc bán riêng mẫu 02"
        }

    ],


    // ==================================================
    // ACC BÁN RIÊNG 2
    // ==================================================

    acc2: [

        {
            username:"ACC_BAN_03",
            password:"demoacc003",
            level:70,
            rarity:"Cực hiếm",
            info:"Acc bán riêng mẫu 03"
        },

        {
            username:"ACC_BAN_04",
            password:"demoacc004",
            level:80,
            rarity:"Cực hiếm",
            info:"Acc bán riêng mẫu 04"
        }

    ],


    // ==================================================
    // ACC BÁN RIÊNG 3
    // ==================================================

    acc3: [

        {
            username:"ACC_BAN_05",
            password:"demoacc005",
            level:90,
            rarity:"Huyền thoại",
            info:"Acc bán riêng mẫu 05"
        },

        {
            username:"ACC_BAN_06",
            password:"demoacc006",
            level:100,
            rarity:"Huyền thoại",
            info:"Acc bán riêng mẫu 06"
        }

    ]

};


// ==================================================
// LƯỢT BÁN DEMO
// CHỈ LÀ SỐ HIỂN THỊ MÔ PHỎNG
// ==================================================

const demoSold = {

    bag5k:7,

    tanbinh:3,

    premium:2,

    legendary:0,

    lucky:0,

    acc1:2,

    acc2:0,

    acc3:5

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

    acc2:15000,

    acc3:3000

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

            message:"Gmail không hợp lệ nhìn nó 36 quá."

        });

    }


    let user = users.get(gmail);


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
// MUA / BỐC TÚI / MUA ACC
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


    const user =
        findUserByUID(uid);


    if(!user){

        return res.json({

            success:false,

            message:"Phiên đăng nhập không hợp lệ."

        });

    }


    if(
        !validPrices[product] ||
        validPrices[product] !== price
    ){

        return res.json({

            success:false,

            message:"Sản phẩm không hợp lệ."

        });

    }


    if(user.balance < price){

        return res.json({

            success:false,

            code:"NOT_ENOUGH",

            balance:user.balance,

            message:"Số dư không đủ."

        });

    }


    if(
        !stock[product] ||
        stock[product].length === 0
    ){

        return res.json({

            success:false,

            code:"OUT_OF_STOCK",

            message:"Sản phẩm này hiện đã hết acc."

        });

    }


    // ==============================================
    // LẤY ACC ĐẦU KHO
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
// LỊCH SỬ
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

        stock:stockCount,

        demoSold:demoSold

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

);
