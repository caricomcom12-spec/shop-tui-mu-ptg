const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(
    path.join(__dirname, "public")
));


/* =========================
   DATABASE DEMO
========================= */

const users = new Map();


/* =========================
   KHO ACC
   M thay thông tin ACC ở đây
========================= */

const stock = {

    tanbinh: [
        "Gmail: acc1@gmail.com | MK: matkhau1",
        "Gmail: acc2@gmail.com | MK: matkhau2",
        "Gmail: acc3@gmail.com | MK: matkhau3",
        "Gmail: acc4@gmail.com | MK: matkhau4",
        "Gmail: acc5@gmail.com | MK: matkhau5"
    ],

    premium: [
        "Gmail: premium1@gmail.com | MK: matkhau1",
        "Gmail: premium2@gmail.com | MK: matkhau2",
        "Gmail: premium3@gmail.com | MK: matkhau3",
        "Gmail: premium4@gmail.com | MK: matkhau4",
        "Gmail: premium5@gmail.com | MK: matkhau5"
    ],

    legendary: [
        "Gmail: legendary1@gmail.com | MK: matkhau1",
        "Gmail: legendary2@gmail.com | MK: matkhau2",
        "Gmail: legendary3@gmail.com | MK: matkhau3",
        "Gmail: legendary4@gmail.com | MK: matkhau4",
        "Gmail: legendary5@gmail.com | MK: matkhau5"
    ],

    vip: [
        "Gmail: vip1@gmail.com | MK: matkhau1",
        "Gmail: vip2@gmail.com | MK: matkhau2",
        "Gmail: vip3@gmail.com | MK: matkhau3",
        "Gmail: vip4@gmail.com | MK: matkhau4",
        "Gmail: vip5@gmail.com | MK: matkhau5"
    ],

    ultra: [
        "Gmail: ultra1@gmail.com | MK: matkhau1",
        "Gmail: ultra2@gmail.com | MK: matkhau2",
        "Gmail: ultra3@gmail.com | MK: matkhau3",
        "Gmail: ultra4@gmail.com | MK: matkhau4",
        "Gmail: ultra5@gmail.com | MK: matkhau5"
    ],

    lucky: [
        "Gmail: lucky1@gmail.com | MK: matkhau1",
        "Gmail: lucky2@gmail.com | MK: matkhau2",
        "Gmail: lucky3@gmail.com | MK: matkhau3",
        "Gmail: lucky4@gmail.com | MK: matkhau4",
        "Gmail: lucky5@gmail.com | MK: matkhau5"
    ]

};


/* =========================
   UID
========================= */

function createUID(){

    return "PT-" +
        crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

}


/* =========================
   LOGIN
========================= */

app.post("/api/login",(req,res)=>{

    const gmail =
        String(req.body.gmail || "")
        .trim()
        .toLowerCase();


    if(!gmail.endsWith("@gmail.com")){

        return res.status(400).json({

            success:false,

            message:
            "Vui lòng nhập đúng Gmail."

        });

    }


    let user=null;


    /* Tìm Gmail cũ */

    for(const account of users.values()){

        if(account.gmail===gmail){

            user=account;

            break;

        }

    }


    /* Gmail mới */

    if(!user){

        user={

            gmail:gmail,

            uid:createUID(),

            balance:0

        };


        users.set(
            user.uid,
            user
        );

    }


    res.json({

        success:true,

        user:user

    });

});


/* =========================
   MUA SẢN PHẨM
========================= */

app.post("/api/buy",(req,res)=>{

    const {
        uid,
        product,
        price
    }=req.body;


    const user=users.get(uid);


    if(!user){

        return res.status(404).json({

            success:false,

            message:
            "Không tìm thấy tài khoản."

        });

    }


    const amount=Number(price);


    if(!Number.isFinite(amount)){

        return res.status(400).json({

            success:false,

            message:
            "Giá sản phẩm không hợp lệ."

        });

    }


    /* Chỉ kiểm tra thiếu tiền
       khi khách thực sự bấm mua */

    if(user.balance < amount){

        return res.json({

            success:false,

            code:"NOT_ENOUGH",

            balance:user.balance

        });

    }


    /* Kiểm tra kho */

    if(
        !stock[product] ||
        stock[product].length===0
    ){

        return res.json({

            success:false,

            message:
            "Túi mù này hiện đã hết ACC."

        });

    }


    /* Lấy ACC */

    const account =
        stock[product].shift();


    /* Trừ số dư */

    user.balance -= amount;


    res.json({

        success:true,

        account:account,

        balance:user.balance

    });

});


/* =========================
   STATUS
========================= */

app.get("/api/status",(req,res)=>{

    res.json({

        success:true,

        status:"online",

        shop:"PT BAG SHOP"

    });

});


/* =========================
   TRANG CHỦ
========================= */

app.get("/",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


/* =========================
   404 API
========================= */

app.use("/api",(req,res)=>{

    res.status(404).json({

        success:false,

        message:"API không tồn tại."

    });

});


/* =========================
   START
========================= */

app.listen(
    PORT,
    "0.0.0.0",
    ()=>{

        console.log(
            "PT BAG SHOP running on port "
            + PORT
        );

    }
);
