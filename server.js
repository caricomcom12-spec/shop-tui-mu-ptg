const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static("public"));


// ================================
// DATABASE TẠM
// ================================

/*
  Gmail -> User

  UID được lưu ở server.

  Vì vậy:

  Gmail A
  -> UID PT-ABC12345

  đăng xuất

  đăng nhập Gmail A lần nữa
  -> vẫn UID PT-ABC12345

  Gmail B
  -> UID khác
*/

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
// LOGIN
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


    /*
      Tìm Gmail cũ.

      Nếu đã tồn tại:
      -> dùng lại UID cũ.

      Nếu chưa:
      -> tạo UID mới.
    */

    let user = users.get(gmail);


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
// BUY
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


    // Kiểm tra giá

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


    // ================================
    // KHÔNG ĐỦ TIỀN
    // ================================

    if(user.balance < price){

        return res.json({

            success:false,

            code:"NOT_ENOUGH",

            balance:user.balance

        });

    }


    // ================================
    // HẾT HÀNG
    // ================================

    if(
        !stock[product] ||
        stock[product].length === 0
    ){

        return res.json({

            success:false,

            message:"Túi này hiện đã hết hàng."

        });

    }


    // ================================
    // LẤY ACC
    // ================================

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


// ================================
// HOME
// ================================

app.get("/",(req,res)=>{

    res.sendFile(
        __dirname + "/public/index.html"
    );

});


// ================================
// START
// ================================

app.listen(PORT,"0.0.0.0",()=>{

    console.log(
        `PT BAG SHOP running on port ${PORT}`
    );

});
