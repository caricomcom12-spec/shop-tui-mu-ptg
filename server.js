const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));


// ==================================================
// DATABASE TẠM
// ==================================================

const users = new Map();

function createUID(){
    const random = Math.random()
        .toString(16)
        .substring(2,10)
        .toUpperCase();

    return "PT-" + random;
}


// ==================================================
// KHO ACC DEMO
// ==================================================

const stock = {

    // ==================================================
    // TÚI 5K
    // ==================================================

    bag5k: [
        {username:"PTG_DEMO_5K_01",password:"demo123",level:12,rarity:"Thường",info:"Acc demo 5K - nhân vật cơ bản"},
        {username:"PTG_DEMO_5K_02",password:"demo456",level:18,rarity:"Hiếm",info:"Acc demo 5K - có một số vật phẩm"},
        {username:"PTG_DEMO_5K_03",password:"demo789",level:25,rarity:"Hiếm",info:"Acc demo 5K - nhiều trang phục"},
        {username:"PTG_DEMO_5K_04",password:"demo999",level:31,rarity:"Siêu hiếm",info:"Acc demo 5K - nhiều vật phẩm"},
        {username:"PTG_DEMO_5K_05",password:"demo000",level:40,rarity:"Cực hiếm",info:"Acc demo 5K - acc mẫu đặc biệt"},
        {username:"PTG_DEMO_5K_06",password:"demo006",level:14,rarity:"Thường",info:"Acc demo 5K - tài khoản mẫu"},
        {username:"PTG_DEMO_5K_07",password:"demo007",level:16,rarity:"Thường",info:"Acc demo 5K - tài khoản mẫu"},
        {username:"PTG_DEMO_5K_08",password:"demo008",level:19,rarity:"Hiếm",info:"Acc demo 5K - có vật phẩm"},
        {username:"PTG_DEMO_5K_09",password:"demo009",level:21,rarity:"Hiếm",info:"Acc demo 5K - có vật phẩm"},
        {username:"PTG_DEMO_5K_10",password:"demo010",level:23,rarity:"Hiếm",info:"Acc demo 5K - tài khoản mẫu"},
        {username:"PTG_DEMO_5K_11",password:"demo011",level:26,rarity:"Hiếm",info:"Acc demo 5K - nhiều vật phẩm"},
        {username:"PTG_DEMO_5K_12",password:"demo012",level:28,rarity:"Siêu hiếm",info:"Acc demo 5K - tài khoản mẫu"},
        {username:"PTG_DEMO_5K_13",password:"demo013",level:30,rarity:"Siêu hiếm",info:"Acc demo 5K - nhiều trang phục"},
        {username:"PTG_DEMO_5K_14",password:"demo014",level:32,rarity:"Siêu hiếm",info:"Acc demo 5K - tài khoản mẫu"},
        {username:"PTG_DEMO_5K_15",password:"demo015",level:34,rarity:"Siêu hiếm",info:"Acc demo 5K - nhiều vật phẩm"},
        {username:"PTG_DEMO_5K_16",password:"demo016",level:36,rarity:"Cực hiếm",info:"Acc demo 5K - tài khoản mẫu"},
        {username:"PTG_DEMO_5K_17",password:"demo017",level:38,rarity:"Cực hiếm",info:"Acc demo 5K - nhiều trang phục"},
        {username:"PTG_DEMO_5K_18",password:"demo018",level:40,rarity:"Cực hiếm",info:"Acc demo 5K - nhiều vật phẩm"},
        {username:"PTG_DEMO_5K_19",password:"demo019",level:42,rarity:"Cực hiếm",info:"Acc demo 5K - nhiều vật phẩm"},
        {username:"PTG_DEMO_5K_20",password:"demo020",level:44,rarity:"Cực hiếm",info:"Acc demo 5K - nhiều vật phẩm"},
        {username:"PTG_DEMO_5K_21",password:"demo021",level:46,rarity:"Cực hiếm",info:"Acc demo 5K - nhiều vật phẩm"},
        {username:"PTG_DEMO_5K_22",password:"demo022",level:48,rarity:"Cực hiếm",info:"Acc demo 5K - tài khoản mẫu"},
        {username:"PTG_DEMO_5K_23",password:"demo023",level:50,rarity:"Huyền thoại",info:"Acc demo 5K - tài khoản mẫu đặc biệt"},
        {username:"PTG_DEMO_5K_24",password:"demo024",level:52,rarity:"Huyền thoại",info:"Acc demo 5K - nhiều vật phẩm"},
        {username:"PTG_DEMO_5K_25",password:"demo025",level:54,rarity:"Huyền thoại",info:"Acc demo 5K - tài khoản mẫu đặc biệt"},
        {username:"PTG_DEMO_5K_26",password:"demo026",level:56,rarity:"Huyền thoại",info:"Acc demo 5K - nhiều trang phục"},
        {username:"PTG_DEMO_5K_27",password:"demo027",level:58,rarity:"Cực hiếm",info:"Acc demo 5K - tài khoản mẫu"},
        {username:"PTG_DEMO_5K_28",password:"demo028",level:60,rarity:"Cực hiếm",info:"Acc demo 5K - tài khoản mẫu đặc biệt"}
    ],


    // ==================================================
    // TÂN BINH
    // ==================================================

    tanbinh: [
        {username:"PTG_DEMO_TB_01",password:"tb111",level:10,rarity:"Thường",info:"Acc Tân Binh mẫu"},
        {username:"PTG_DEMO_TB_02",password:"tb222",level:20,rarity:"Hiếm",info:"Acc Tân Binh mẫu"},
        {username:"PTG_DEMO_TB_03",password:"tb333",level:27,rarity:"Hiếm",info:"Acc Tân Binh mẫu"},
        {username:"PTG_DEMO_TB_04",password:"tb444",level:35,rarity:"Siêu hiếm",info:"Acc Tân Binh mẫu"},
        {username:"PTG_DEMO_TB_05",password:"tb555",level:45,rarity:"Cực hiếm",info:"Acc Tân Binh mẫu đặc biệt"}
    ],


    // ==================================================
    // PREMIUM
    // ==================================================

    premium: [
        {username:"PTG_DEMO_PRE_01",password:"pre111",level:35,rarity:"Hiếm",info:"Acc Premium mẫu"},
        {username:"PTG_DEMO_PRE_02",password:"pre222",level:42,rarity:"Hiếm",info:"Acc Premium mẫu"},
        {username:"PTG_DEMO_PRE_03",password:"pre333",level:50,rarity:"Siêu hiếm",info:"Acc Premium mẫu"},
        {username:"PTG_DEMO_PRE_04",password:"pre444",level:58,rarity:"Siêu hiếm",info:"Acc Premium mẫu"},
        {username:"PTG_DEMO_PRE_05",password:"pre555",level:65,rarity:"Cực hiếm",info:"Acc Premium mẫu đặc biệt"}
    ],


    // ==================================================
    // LEGENDARY
    // ==================================================

    legendary: [
        {username:"PTG_DEMO_LEG_01",password:"leg111",level:50,rarity:"Hiếm",info:"Acc Legendary mẫu"},
        {username:"PTG_DEMO_LEG_02",password:"leg222",level:60,rarity:"Siêu hiếm",info:"Acc Legendary mẫu"},
        {username:"PTG_DEMO_LEG_03",password:"leg333",level:70,rarity:"Siêu hiếm",info:"Acc Legendary mẫu"},
        {username:"PTG_DEMO_LEG_04",password:"leg444",level:80,rarity:"Cực hiếm",info:"Acc Legendary mẫu"},
        {username:"PTG_DEMO_LEG_05",password:"leg555",level:90,rarity:"Huyền thoại",info:"Acc Legendary mẫu đặc biệt"}
    ],


    // ==================================================
    // LUCKY
    // ==================================================

    lucky: [
        {username:"PTG_DEMO_LUCKY_01",password:"luck111",level:80,rarity:"Cực hiếm",info:"Acc Lucky mẫu"},
        {username:"PTG_DEMO_LUCKY_02",password:"luck222",level:90,rarity:"Huyền thoại",info:"Acc Lucky mẫu"},
        {username:"PTG_DEMO_LUCKY_03",password:"luck333",level:100,rarity:"Huyền thoại",info:"Acc Lucky mẫu"},
        {username:"PTG_DEMO_LUCKY_04",password:"luck444",level:120,rarity:"Cực phẩm",info:"Acc Lucky mẫu"}
    ],


    // ==================================================
    // ⚙️ ACC CẦN CƠ KHÍ
    // 40K - 3 ACC
    // ==================================================

    acc1: [
        {
            username:"DEMO_COKHI_01",
            password:"demo_cokhi_001",
            level:50,
            rarity:"Hiếm",
            info:"Acc Cần Cơ Khí demo 01"
        },
        {
            username:"DEMO_COKHI_02",
            password:"demo_cokhi_002",
            level:60,
            rarity:"Cực hiếm",
            info:"Acc Cần Cơ Khí demo 02"
        },
        {
            username:"DEMO_COKHI_03",
            password:"demo_cokhi_003",
            level:70,
            rarity:"Huyền thoại",
            info:"Acc Cần Cơ Khí demo 03"
        }
    ],


    // ==================================================
    // 🎮 ACC CLONE 8XX-1XXKC
    // 13K - 12 ACC
    // ==================================================

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


    // ==================================================
    // 🎮 ACC REG QUA GAME
    // 4K - 48 ACC
    // ==================================================

    acc3: [
        {username:"DEMO_REG_01",password:"reg_demo_001",level:10,rarity:"Thường",info:"Acc Reg Qua Game demo 01"},
        {username:"DEMO_REG_02",password:"reg_demo_002",level:11,rarity:"Thường",info:"Acc Reg Qua Game demo 02"},
        {username:"DEMO_REG_03",password:"reg_demo_003",level:12,rarity:"Thường",info:"Acc Reg Qua Game demo 03"},
        {username:"DEMO_REG_04",password:"reg_demo_004",level:13,rarity:"Thường",info:"Acc Reg Qua Game demo 04"},
        {username:"DEMO_REG_05",password:"reg_demo_005",level:14,rarity:"Thường",info:"Acc Reg Qua Game demo 05"},
        {username:"DEMO_REG_06",password:"reg_demo_006",level:15,rarity:"Thường",info:"Acc Reg Qua Game demo 06"},
        {username:"DEMO_REG_07",password:"reg_demo_007",level:16,rarity:"Thường",info:"Acc Reg Qua Game demo 07"},
        {username:"DEMO_REG_08",password:"reg_demo_008",level:17,rarity:"Thường",info:"Acc Reg Qua Game demo 08"},
        {username:"DEMO_REG_09",password:"reg_demo_009",level:18,rarity:"Thường",info:"Acc Reg Qua Game demo 09"},
        {username:"DEMO_REG_10",password:"reg_demo_010",level:19,rarity:"Thường",info:"Acc Reg Qua Game demo 10"},
        {username:"DEMO_REG_11",password:"reg_demo_011",level:20,rarity:"Hiếm",info:"Acc Reg Qua Game demo 11"},
        {username:"DEMO_REG_12",password:"reg_demo_012",level:21,rarity:"Hiếm",info:"Acc Reg Qua Game demo 12"},
        {username:"DEMO_REG_13",password:"reg_demo_013",level:22,rarity:"Hiếm",info:"Acc Reg Qua Game demo 13"},
        {username:"DEMO_REG_14",password:"reg_demo_014",level:23,rarity:"Hiếm",info:"Acc Reg Qua Game demo 14"},
        {username:"DEMO_REG_15",password:"reg_demo_015",level:24,rarity:"Hiếm",info:"Acc Reg Qua Game demo 15"},
        {username:"DEMO_REG_16",password:"reg_demo_016",level:25,rarity:"Hiếm",info:"Acc Reg Qua Game demo 16"},
        {username:"DEMO_REG_17",password:"reg_demo_017",level:26,rarity:"Hiếm",info:"Acc Reg Qua Game demo 17"},
        {username:"DEMO_REG_18",password:"reg_demo_018",level:27,rarity:"Hiếm",info:"Acc Reg Qua Game demo 18"},
        {username:"DEMO_REG_19",password:"reg_demo_019",level:28,rarity:"Hiếm",info:"Acc Reg Qua Game demo 19"},
        {username:"DEMO_REG_20",password:"reg_demo_020",level:29,rarity:"Hiếm",info:"Acc Reg Qua Game demo 20"},
        {username:"DEMO_REG_21",password:"reg_demo_021",level:30,rarity:"Hiếm",info:"Acc Reg Qua Game demo 21"},
        {username:"DEMO_REG_22",password:"reg_demo_022",level:31,rarity:"Hiếm",info:"Acc Reg Qua Game demo 22"},
        {username:"DEMO_REG_23",password:"reg_demo_023",level:32,rarity:"Hiếm",info:"Acc Reg Qua Game demo 23"},
        {username:"DEMO_REG_24",password:"reg_demo_024",level:33,rarity:"Hiếm",info:"Acc Reg Qua Game demo 24"},
        {username:"DEMO_REG_25",password:"reg_demo_025",level:34,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 25"},
        {username:"DEMO_REG_26",password:"reg_demo_026",level:35,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 26"},
        {username:"DEMO_REG_27",password:"reg_demo_027",level:36,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 27"},
        {username:"DEMO_REG_28",password:"reg_demo_028",level:37,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 28"},
        {username:"DEMO_REG_29",password:"reg_demo_029",level:38,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 29"},
        {username:"DEMO_REG_30",password:"reg_demo_030",level:39,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 30"},
        {username:"DEMO_REG_31",password:"reg_demo_031",level:40,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 31"},
        {username:"DEMO_REG_32",password:"reg_demo_032",level:41,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 32"},
        {username:"DEMO_REG_33",password:"reg_demo_033",level:42,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 33"},
        {username:"DEMO_REG_34",password:"reg_demo_034",level:43,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 34"},
        {username:"DEMO_REG_35",password:"reg_demo_035",level:44,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 35"},
        {username:"DEMO_REG_36",password:"reg_demo_036",level:45,rarity:"Siêu hiếm",info:"Acc Reg Qua Game demo 36"},
        {username:"DEMO_REG_37",password:"reg_demo_037",level:46,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 37"},
        {username:"DEMO_REG_38",password:"reg_demo_038",level:47,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 38"},
        {username:"DEMO_REG_39",password:"reg_demo_039",level:48,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 39"},
        {username:"DEMO_REG_40",password:"reg_demo_040",level:49,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 40"},
        {username:"DEMO_REG_41",password:"reg_demo_041",level:50,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 41"},
        {username:"DEMO_REG_42",password:"reg_demo_042",level:51,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 42"},
        {username:"DEMO_REG_43",password:"reg_demo_043",level:52,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 43"},
        {username:"DEMO_REG_44",password:"reg_demo_044",level:53,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 44"},
        {username:"DEMO_REG_45",password:"reg_demo_045",level:54,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 45"},
        {username:"DEMO_REG_46",password:"reg_demo_046",level:55,rarity:"Cực hiếm",info:"Acc Reg Qua Game demo 46"},
        {username:"DEMO_REG_47",password:"reg_demo_047",level:56,rarity:"Huyền thoại",info:"Acc Reg Qua Game demo 47"},
        {username:"DEMO_REG_48",password:"reg_demo_048",level:57,rarity:"Huyền thoại",info:"Acc Reg Qua Game demo 48"}
    ]
};


// ==================================================
// LƯỢT BÁN DEMO
// Chỉ dùng để hiển thị giao diện demo
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

    // ACC
    acc1:40000,
    acc2:13000,
    acc3:4000
};


// ==================================================
// LOGIN
// ==================================================

app.post("/api/login",(req,res)=>{

    const gmail = String(req.body.gmail || "")
        .trim()
        .toLowerCase();

    if(!gmail.endsWith("@gmail.com")){

        return res.json({
            success:false,
            message:"Gmail không hợp lệ."
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
// MUA SẢN PHẨM
// ==================================================

app.post("/api/buy",(req,res)=>{

    const uid = String(req.body.uid || "").trim();

    const product = String(req.body.product || "").trim();

    const price = Number(req.body.price);

    const user = findUserByUID(uid);


    if(!user){

        return res.json({

            success:false,

            message:"Phiên đăng nhập không hợp lệ."

        });

    }


    // KIỂM TRA SẢN PHẨM + GIÁ

    if(
        !Object.prototype.hasOwnProperty.call(validPrices,product) ||
        validPrices[product] !== price
    ){

        return res.json({

            success:false,

            message:"Sản phẩm không hợp lệ."

        });

    }


    // KIỂM TRA SỐ DƯ

    if(user.balance < price){

        return res.json({

            success:false,

            code:"NOT_ENOUGH",

            balance:user.balance,

            message:"Số dư không đủ."

        });

    }


    // KIỂM TRA KHO

    if(!stock[product] || stock[product].length === 0){

        return res.json({

            success:false,

            code:"OUT_OF_STOCK",

            message:"Sản phẩm này hiện đã hết acc."

        });

    }


    // LẤY ACC ĐẦU KHO

    const account = stock[product].shift();


    // TRỪ TIỀN

    user.balance -= price;


    // LƯU LỊCH SỬ

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


    // TRẢ KẾT QUẢ

    return res.json({

        success:true,

        account:account,

        balance:user.balance,

        history:historyItem

    });

});


// ==================================================
// LỊCH SỬ MUA
// ==================================================

app.get("/api/history",(req,res)=>{

    const uid = String(req.query.uid || "").trim();

    const user = findUserByUID(uid);


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
// SHOP STATUS
// ==================================================

app.get("/api/status",(req,res)=>{

    const stockCount = {};

    for(const product in stock){

        stockCount[product] = stock[product].length;

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

const ADMIN_TOKEN = "PTG-ADMIN-SECRET-2026";


// ==================================================
// ADMIN LOGIN
// ==================================================

app.post("/api/admin/login",(req,res)=>{

    const password = String(req.body.password || "");


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
// KIỂM TRA ADMIN
// ==================================================

function checkAdmin(req,res,next){

    const token = req.headers["x-admin-token"];


    if(token !== ADMIN_TOKEN){

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

app.get("/api/admin/user",checkAdmin,(req,res)=>{

    const uid = String(req.query.uid || "").trim();

    const found = findUserByUID(uid);


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

});


// ==================================================
// ADMIN CỘNG TIỀN
// ==================================================

app.post("/api/admin/add-money",checkAdmin,(req,res)=>{

    const uid = String(req.body.uid || "").trim();

    const amount = Number(req.body.amount);


    if(!Number.isFinite(amount) || amount <= 0){

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


    const found = findUserByUID(uid);


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

});


// ==================================================
// ADMIN XEM LỊCH SỬ
// ==================================================

app.get("/api/admin/history",checkAdmin,(req,res)=>{

    const uid = String(req.query.uid || "").trim();

    const found = findUserByUID(uid);


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

});


// ==================================================
// ADMIN PAGE
// ==================================================

app.get("/admin",(req,res)=>{

    res.sendFile(__dirname + "/public/admin.html");

});


// ==================================================
// TRANG CHỦ
// ==================================================

app.get("/",(req,res)=>{

    res.sendFile(__dirname + "/public/index.html");

});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT,"0.0.0.0",()=>{

    console.log(
        `PT BAG SHOP running on port ${PORT}`
    );

});
