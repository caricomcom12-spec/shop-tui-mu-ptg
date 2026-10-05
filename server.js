const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(
  path.join(__dirname, "public")
));

/*
  DEMO DATABASE

  Khi deploy thật trên Render,
  nên thay phần này bằng PostgreSQL.
*/

const users = new Map();

const stock = {

  tanbinh: [
    "ACC_TANBINH_01",
    "ACC_TANBINH_02",
    "ACC_TANBINH_03",
    "ACC_TANBINH_04",
    "ACC_TANBINH_05"
  ],

  premium: [
    "ACC_PREMIUM_01",
    "ACC_PREMIUM_02",
    "ACC_PREMIUM_03",
    "ACC_PREMIUM_04",
    "ACC_PREMIUM_05"
  ],

  legendary: [
    "ACC_LEGENDARY_01",
    "ACC_LEGENDARY_02",
    "ACC_LEGENDARY_03",
    "ACC_LEGENDARY_04",
    "ACC_LEGENDARY_05"
  ],

  vip: [
    "ACC_VIP_01",
    "ACC_VIP_02",
    "ACC_VIP_03",
    "ACC_VIP_04",
    "ACC_VIP_05"
  ],

  ultra: [
    "ACC_ULTRA_01",
    "ACC_ULTRA_02",
    "ACC_ULTRA_03",
    "ACC_ULTRA_04",
    "ACC_ULTRA_05"
  ],

  lucky: [
    "ACC_LUCKY_01",
    "ACC_LUCKY_02",
    "ACC_LUCKY_03",
    "ACC_LUCKY_04",
    "ACC_LUCKY_05"
  ]

};


function makeUID(){

  return "PT-" +
    crypto.randomBytes(4)
      .toString("hex")
      .toUpperCase();

}


/* LOGIN */

app.post("/api/login",(req,res)=>{

  const gmail =
    String(req.body.gmail || "")
      .trim()
      .toLowerCase();


  if(!gmail.includes("@")){

    return res.json({
      success:false,
      message:"Gmail không hợp lệ."
    });

  }


  let user=null;


  for(const u of users.values()){

    if(u.gmail===gmail){

      user=u;
      break;

    }

  }


  if(!user){

    user={

      gmail,

      uid:makeUID(),

      balance:0,

      createdAt:new Date().toISOString()

    };


    users.set(user.uid,user);

  }


  res.json({

    success:true,

    user

  });

});


/* MUA */

app.post("/api/buy",(req,res)=>{

  const {
    uid,
    product,
    price
  }=req.body;


  const user=users.get(uid);


  if(!user){

    return res.json({

      success:false,

      message:"Không tìm thấy tài khoản."

    });

  }


  const amount=Number(price);


  if(!Number.isFinite(amount) || amount<=0){

    return res.json({

      success:false,

      message:"Giá sản phẩm không hợp lệ."

    });

  }


  if(user.balance<amount){

    return res.json({

      success:false,

      code:"NOT_ENOUGH",

      balance:user.balance,

      message:
       "Số dư không đủ. Vui lòng nạp tiền qua Zalo 0907859891."

    });

  }


  if(!stock[product] ||
     stock[product].length===0){

    return res.json({

      success:false,

      message:"Túi này hiện đã hết ACC."

    });

  }


  const account=stock[product].shift();


  user.balance-=amount;


  res.json({

    success:true,

    account,

    balance:user.balance

  });

});


/* STATUS */

app.get("/api/status",(req,res)=>{

  res.json({

    success:true,

    shop:"PT BAG SHOP",

    status:"online"

  });

});


app.get("*",(req,res)=>{

  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );

});


app.listen(
  PORT,
  "0.0.0.0",
  ()=>{
    console.log(
      `PT BAG SHOP running on ${PORT}`
    );
  }
);
