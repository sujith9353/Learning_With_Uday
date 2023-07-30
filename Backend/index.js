const express=require('express')
const cors=require('cors')
require('./Db/Config')
const User=require('./Db/User')
const Product=require('./Db/Product')
const app=express()
app.use(cors())
app.use(express.json());

//Register API
app.post('/signup',async(req,res)=>{
    let user=new User(req.body);
    let result=await user.save()
    //why cant we use select and remove password here:Here we are saving the data and we cant use select there.
    result=result.toObject()    //Function which converts the results to object
    delete result.password
    res.send(result)
})

//Login API
app.post('/login',async(req,res)=>{
   if(req.body.password && req.body.email){
    let user=await User.findOne(req.body).select("-password")
    if(user){
        res.send(user)
    }else{
        res.send({result:"No User Found"})
    }
   }else{
    res.send({result:"No user found"})
   }
})

//Add-product Api
app.post('/add-product',async(req,res)=>{
    let product=new Product(req.body)
    let result=await product.save()
    res.send(result)
})

//Get Product-List
app.get('/products',async(req,res)=>{
    let product=await Product.find()
    if(Product.length>0){
        res.send(product)
    }
    else{
        res.send({result:"Product Not Found"})
    }
})

//Delete a product
app.delete("/product/:id",async(req,res)=>{
    let result=await Product.deleteOne({_id:req.params.id})
   res.send(result)
})

//Get a single product
app.get('/product/:id',async(req,res)=>{
    let result=await Product.findOne({_id:req.params.id})
    if(result){
        res.send(result)
    }
    else{
        res.send({message:"No record Found"})
    }
})

//Update product
app.put('/product/:id',async(req,res)=>{
    let result=await Product.updateOne({_id:req.params.id},
        {
            $set:req.body
        })
        res.send(result)
})

//Seraching a product
app.get('/search/:key',async(req,res)=>{
    let result=await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {price:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}}
        ]
    })
    res.send(result)
})

app.listen(5000);