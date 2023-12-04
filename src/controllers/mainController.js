const { default: axios } = require("axios")
const apiDataKeys=require("./apiDataKeys.json");
const fs=require("fs");
const jwt=require("jsonwebtoken");
const nodemailer=require("nodemailer");


const altinkeys=apiDataKeys.altinkeys;

homePage=(istek,cevap,next)=>{

    const sayfayiGoster=(data)=>{
        cevap.render("homePage",{"data":data,"keys":altinkeys});
    }
    axios.get("https://finans.truncgil.com/today.json",).then(
        (data)=>{
            let cleanData={"Update_Date":data.data["Update_Date"]};
            altinkeys.forEach(key => {
                cleanData[key]=data.data[key];
            });
            fs.writeFileSync("lastData.txt",JSON.stringify(cleanData))
            sayfayiGoster(cleanData);
        }
    ).catch((err)=>{
        data=fs.readFileSync("lastData.txt");
        data=JSON.parse(data);
        sayfayiGoster(data);
    });
}

Girisekrani=(istek,cevap,next)=>{
    const token=istek.query.id;
    if(token){
        jwt.verify(token,process.env.SECRET_JWT_KEY,(err,decode)=>{
            if(err){
                cevap.render("loginPage",{layout:"./layout/loginLayout.ejs","msgDanger":"GEÇERSİZ TOKEN!!"});
            }else{
                const sayfayiGoster=(data)=>{
                    istek.session.token=token;
                    const date=new Date;
                    console.log(decode.email +"=> GİRİŞ YAPTI "+date.toString() );
                    cevap.render("homePage",{"data":data,"keys":altinkeys});
                }
                axios.get("https://finans.truncgil.com/today.json",).then(
                    (data)=>{
                        let cleanData={"Update_Date":data.data["Update_Date"]};
                        altinkeys.forEach(key => {
                            cleanData[key]=data.data[key];
                        });
                        fs.writeFileSync("lastData.txt",JSON.stringify(cleanData))
                        sayfayiGoster(cleanData);
                    }
                ).catch((err)=>{
                    data=fs.readFileSync("lastData.txt");
                    data=JSON.parse(data);
                    sayfayiGoster(data);
                });
            }
        })
    }else if(istek.session.token){
        const sessiontoken=istek.session.token;
        jwt.verify(sessiontoken,process.env.SECRET_JWT_KEY,(err,decode)=>{
            if(err){
                cevap.render("loginPage",{layout:"./layout/loginLayout.ejs","msgDanger":"GEÇERSİZ TOKEN!!"});
            }else{
                const sayfayiGoster=(data)=>{
                    const date=new Date;
                    console.log(decode.email +"=> GİRİŞ YAPTI "+date.toString() );
                    cevap.render("homePage",{"data":data,"keys":altinkeys});
                }
                axios.get("https://finans.truncgil.com/today.json",).then(
                    (data)=>{
                        let cleanData={"Update_Date":data.data["Update_Date"]};
                        altinkeys.forEach(key => {
                            cleanData[key]=data.data[key];
                        });
                        fs.writeFileSync("lastData.txt",JSON.stringify(cleanData))
                        sayfayiGoster(cleanData);
                    }
                ).catch((err)=>{
                    data=fs.readFileSync("lastData.txt");
                    data=JSON.parse(data);
                    sayfayiGoster(data);
                });
                
            }
        })

    }
    else{
        cevap.render("loginPage",{layout:"./layout/loginLayout.ejs","msg":"DOVİZ KURLARINA ERİŞEBİLMEK İÇİN LİNKTE TOKENİNİZİ BELİRTİN! Tokeniniz yoksa token almak için mailinizi girin!"});
    }
    
}

login=async(istek,cevap,next)=>{
    console.log(istek.body.email);

    jwtIcerik={email:istek.body.email};
    
    const jwttoken=jwt.sign(jwtIcerik,process.env.SECRET_JWT_KEY,{expiresIn:"5m"});
    //const jwttoken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im96YW5saXNsYXMxQGdtYWlsLmNvbSIsImlhdCI6MTY5ODcwMjYyMiwiZXhwIjoxNjk4NzAyOTIyfQ.R7qW5RP_OWHLGyeoGH07FA71dbrRwrQxx9E-zv5WN98";
    

    const tokenUrl=process.env.WEBSITEURL+"?id="+jwttoken;

    let transporter=nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.SIFRE
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: 'EBAY SOFTWARE DOVİZ KURLARI <info@ebaysoftware.com>',
        to: istek.body.email,
        subject:'KİŞİSEL TOKENINIZLA GİRİŞ VERİLERİMİZE ERİŞEBİLİRSİNİZ!',
        text:"EBAY SOFTWARE olarak verilerimize ulaşmak isteyenleri kimliklendirip, kimlerle veri paylaştığımızı bilmek istiyoruz.Bu nedenle girişlerimizde kişisel tokenlarınızı kullanmak zorundasınız.Size özel oluşturduğumuz link ile 5 dakika geçerli olan tokeninizle verilere ulaşabilirsiniz: "+tokenUrl,
    },(err,info)=>{
        if(err){
            console.log(err);
        }
        console.log('mail gonderildi!');
        transporter.close();
    });
    const msg="TOKENİNİZ MAİLİNİZE GÖNDERİLDİ MAİLİNİZE GELEN LİNKE GİREREK VERİLERE ULAŞABİLİRSİNİZ! LÜTFEN MAİLİNİZİ KONTROL EDİNİZ!!"
    cevap.render("loginPage",{layout:"./layout/loginLayout.ejs","msg":msg});


    
}




module.exports={
    homePage,
    Girisekrani,
    login,
}