const port = 4001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true
}));


//Database Connection with MongoDB 
mongoose.connect("mongodb+srv://melchimunesh:j0Mqiwk1aXoEQtQg@cluster0.cbjsc.mongodb.net/shamah-hardware-backend")
//Error handling for database connection
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

//API Creation
app.get("/",(req,res)=> {
    res.send("Express App is Running")
});

//Image Storage engine using Multer
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb) => {
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({storage:storage});

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'));

app.post("/upload",upload.single('product'),(req,res)=> {
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
});

//Schema for creating products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

//Creating API for adding products
app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        description:req.body.description,
        price:req.body.price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating API for deleting products
app.post('/removeproduct',async (req, res)=>{
    console.log("Request received to remove product:", req.body);
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating API for getting all products
app.get('/allproducts',async (req, res)=>{
    let products = await Product.find({});
    console.log("All products Fetched");
    res.send(products);
})

//Schema creating for user model
const users = mongoose.model('Users' , {
    name:{
        type: String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating endpoint for registering users
app.post('/signup', async (req, res)=> {

    let check = await users.findOne({email:req.body.email});
    if(check) {
        return res.status(400).json({success:false,errors:"Existing User found with same email address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;   
    }
    const user = new users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })


    await user.save();

    const data = {
        user:{
            id:user.id,
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true, token})
});


//Creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await users.findOne({email:req.body.email});
    if(user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data ={
                user:{
                    id:user.id,
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else {
        res.json({success:false,errors:"Wrong Email ID"});
    }
})

// Creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ date: -1 });
        console.log("Products found:", products.length);
        
        if (products.length <= 1) {
            return res.status(200).json([]);
        }
        
        const newcollection = products.slice(0, 8);
        console.log("New Collection Fetched, items:", newcollection.length);
        res.send(newcollection);
    } catch (error) {
        console.error("Error fetching new collections:", error);
        res.status(500).send("Error fetching new collections");
    }
});

//Creating endpoint for the featured products data
app.get('/featuredproducts', async (req, res) => {
    try {
      // Ensure you're using the correct model and query
      let products = await Product.find({ category: "construction" });
      
      // Check if products were found
      if (!products || products.length === 0) {
        return res.status(404).json({ 
          message: "No products found in the construction category" 
        });
      }
  
      // Slice the first 4 products
      let featuredProducts = products.slice(0, 4);
      
      console.log(`Found ${featuredProducts.length} featured products`);
      
      // Send the products with appropriate status code
      res.status(200).json(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ 
        message: "Error fetching featured products", 
        error: error.message 
      });
    }
  });

//Creating middleware to fetch user 
  const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom'); 
            req.user = data.user;
            next();  
    } catch	(error) {
            res.status(401).send({errors:"Please authenticate using valid token"});
    }
  }
  }

//Creating endpoint for adding products to cart data 
app.post('/addtocart',fetchUser,async(req,res)=>{ 
    console.log("added",req.body.itemId);
    let userData = await users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added successfully")
})

//Creating endpoint for removing products in cart data
app.post('/removefromcart',fetchUser,async (req,res) => {
    console.log("removed",req.body.itemId);
    let userData = await users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
    await users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed successfully")
}) 

//Creating endpoint to fetch cart data
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})
       
//Generating Text on the terminal reflecting server status
app.listen(port,(error)=> {
    if(!error)
    {
        console.log("Server is running on Port "+port);
    }
    else
    {
        console.log("Error : "+error);
    }
});

