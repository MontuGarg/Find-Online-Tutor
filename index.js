import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app=express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
mongoose.connect("mongodb://localhost:27017/findOnlineTutor",{
    useNewUrlParser:true, 
    useUnifiedTopology:true
},()=>{
    console.log("db connected");
})

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    profession:String,
    password:String,
    mode:String,
    max_fees:String,
    min_fees:String,
    exp:String,
    edu:String,
    ids:String,
    field:String,
    note:[{
        name:String,
        email:String,
        phone:Number
    }]
})
const User=new mongoose.model("User",userSchema)
app.post("/login",(req,res)=>{
    const {email,password,profession} =req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
            if(password===user.password && profession===user.profession){
                res.send({message:"login successfull",user:user})
            }else{
                
                    res.send({message:"Invalid data.",user})
                
            }
        }else{
            res.send({message:"user not registered",user});
        }
    })
})
app.post("/change",(req,res)=>{
    const {email,password} =req.body;
    User.updateOne({email:email},{password:password},(err,user)=>{
        if(user){
            res.send({message:"changed successfully"});
        }else{
            res.send({message:"email not found"});
        }
    })
})
app.get("/teacher",(req,res)=>{

    User.find({profession:"Teacher"},(err,user)=>{
        if(user){
            res.send(user);
        }
        else{
            res.send(err);
        }
    })
})
app.get("/register",(req,res)=>{
    User.find((err,user)=>{
        if(user){
            res.send(user);
        }
        else{
            res.send(err);
        }
    })
})
app.post("/profile",(req,res)=>{
    const {email,mode,field,max_fees,min_fees,edu,exp,ids,note}=req.body;
    console.log(note);
    User.updateOne({email:email},{$set:{ids:ids,mode:mode,field:field,max_fees:max_fees,min_fees:min_fees,note:note,edu:edu,exp:exp}}, (err,user)=>{
        if(user){
            res.send({message:"Profile Updated Successfully."});
        }else{
            res.send({message:""});
        }
    })
    
 

})
app.post("/note",(req,res)=>{
    const {email,note}=req.body;
    console.log(note[0],email);
    User.updateOne({email:email},{$set:{note:note}}, (err,user)=>{
        if(user){
            res.send({message:"Profile Updated Successfully."});
        }else{
            res.send({message:""});
        }
    })
    
 

})
app.post("/register",(req,res)=>{
    const {name,email,phone,profession,password}=req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"User already, Reegistered"})
        }else{
            const user=new User({
                name,
                email,
                phone,
                profession,
                password,
            })
            user.save(err=>{
                if(err){
                    res.send(err);
                }
                else{
                    res.send({message:"successfully Registered"})
                }
            })
        }
    })
 

})
app.listen(9802,()=>{
    console.log("started on port 9802 ...");
})