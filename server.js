const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static("public"));


// ================================
// DATABASE TẠM
// ================================

const users = new Map();


// ================================
// TẠO UID
// ================================

function createUID(){

    const random =
        Math.random()
        .toString(16)
        .substring(2,10)
        .toUpperCase();

    return "PT-" + random;
}


// ================================
// STOCK
// ================================

const stock = {

    tanbinh: [
        "ACC TÂN BINH #01",
        "ACC TÂN BINH #02",
        "ACC TÂN BINH #03",
        "ACC TÂN BINH #04",
        "ACC TÂN BINH #05"
    ],

    premium: [
        "ACC PREMIUM #01",
        "ACC PREMIUM #02",
        "ACC PREMIUM #03",
        "ACC PREMIUM #04",
        "ACC PREMIUM #05"
    ],

    legendary: [
        "ACC LEGENDARY #01",
        "ACC LEGENDARY #02",
        "ACC LEGENDARY #03",
        "ACC LEGENDARY #04",
        "ACC LEGENDARY #05"
    ],

    vip: [
        "ACC VIP #01",
        "ACC VIP #02",
        "ACC VIP #03",
        "ACC VIP #04",
        "ACC VIP #05"
    ],

    ultra: [
        "ACC ULTRA #01",
        "ACC ULTRA #02",
        "ACC ULTRA #03",
        "ACC ULTRA #04",
        "ACC ULTRA #05"
    ],

    lucky: [
        "ACC LUCKY #01",
        "ACC LUCKY #02",
        "ACC LUCKY #03",
        "ACC LUCKY #04",
        "ACC LUCKY #05"
    ]

};


// ================================
// LOGIN KHÁCH HÀNG
// ================================

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


    // Gmail cũ -> giữ nguyên UID
    if(!user){

        user = {

            gmail:gmail,

            uid:createUID(),

            balance:0

        };

        users.set(gmail,user);

    }


    return res.json({

        success:true,

        user:user

    });

});


// ================================
// MUA TÚI
// ================================

app.post("/api/buy",(req,res)=>{

    const uid =
        String(req.body.uid || "");

    const product =
        String(req.body.product || "");

    const price =
        Number(req.body.price);


    // Tìm user bằng UID

    let user = null;

    for(const item of users.values()){

        if(item.uid === uid){

            user = item;

            break;

        }

    }


    if(!user){

        return res.json({

            success:false,

            message:"Phiên đăng nhập không hợp lệ."

        });

    }


    // Giá sản phẩm

    const validPrices = {

        tanbinh:20000,

        premium:50000,

        legendary:100000,

        vip:200000,

        ultra:500000,

        lucky:1000000

    };


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


    // Hết hàng

    if(
        !stock[product] ||
        stock[product].length === 0
    ){

        return res.json({

            success:false,

            message:"Túi này hiện đã hết hàng."

        });

    }


    // Lấy tài khoản

    const account =
        stock[product].shift();


    // Trừ tiền

    user.balance -= price;


    return res.json({

        success:true,

        account:account,

        balance:user.balance

    });

});


// ================================
// STATUS
// ================================

app.get("/api/status",(req,res)=>{

    res.json({

        success:true,

        message:"PT BAG SHOP đang hoạt động.",

        users:users.size

    });

});


// ==================================================
// ================= ADMIN PANEL ====================
// ==================================================


// Mật khẩu Admin
const ADMIN_PASSWORD = "congdang86";

// Token Admin
const ADMIN_TOKEN = "PTG-ADMIN-SECRET-2026";


// ================================
// ADMIN LOGIN
// ================================

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


// ================================
// KIỂM TRA QUYỀN ADMIN
// ================================

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


// ================================
// TÌM KHÁCH THEO UID
// ================================

app.get(
    "/api/admin/user",
    checkAdmin,
    (req,res)=>{

        const uid =
            String(req.query.uid || "")
            .trim();


        let found = null;


        for(const user of users.values()){

            if(user.uid === uid){

                found = user;

                break;

            }

        }


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


// ================================
// CỘNG TIỀN
// ================================

app.post(
    "/api/admin/add-money",
    checkAdmin,
    (req,res)=>{

        const uid =
            String(req.body.uid || "")
            .trim();


        const amount =
            Number(req.body.amount);


        // Kiểm tra số tiền

        if(
            !Number.isFinite(amount) ||
            amount <= 0
        ){

            return res.json({

                success:false,

                message:"Số tiền không hợp lệ."

            });

        }


        // Giới hạn mỗi lần cộng

        if(amount > 100000000){

            return res.json({

                success:false,

                message:"Số tiền cộng quá lớn."

            });

        }


        // Tìm khách

        let found = null;


        for(const user of users.values()){

            if(user.uid === uid){

                found = user;

                break;

            }

        }


        if(!found){

            return res.json({

                success:false,

                message:"Không tìm thấy UID."

            });

        }


        // Cộng tiền

        found.balance += amount;


        res.json({

            success:true,

            balance:found.balance,

            message:
                "Đã cộng tiền thành công."

        });

    }
);


// ================================
// TRANG ADMIN
// ================================

app.get("/admin",(req,res)=>{

    res.sendFile(
        __dirname + "/public/admin.html"
    );

});


// ================================
// HOME
// ================================

app.get("/",(req,res)=>{

    res.sendFile(
        __dirname + "/public/index.html"
    );

});


// ================================
// START SERVER
// ================================

app.listen(PORT,"0.0.0.0",()=>{

    console.log(
        `PT BAG SHOP running on port ${PORT}`
    );

});
