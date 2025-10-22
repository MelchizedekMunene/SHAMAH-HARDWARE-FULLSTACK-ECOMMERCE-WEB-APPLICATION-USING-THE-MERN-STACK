// Load environment variables first
require('dotenv').config();

const port = process.env.PORT;
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

//Database Connection with MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI)
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

//Creating API for searching products
app.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                success: false, 
                message: "Search query is required" 
            });
        }

        // Create a case-insensitive regex for the search
        const searchRegex = new RegExp(query, 'i');
        
        // Search across name, category, and description fields
        const products = await Product.find({
            $or: [
                { name: { $regex: searchRegex } },
                { category: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ],
            available: true // Only show available products
        }).sort({ date: -1 }); // Sort by newest first
        
        console.log(`Search for "${query}" returned ${products.length} products`);
        
        res.json({
            success: true,
            results: products,
            count: products.length
        });
        
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error performing search", 
            error: error.message 
        });
    }
});

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

    // Use environment variable for JWT secret
    const token = jwt.sign(data, process.env.JWT_SECRET);
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
            // Use environment variable for JWT secret
            const token = jwt.sign(data, process.env.JWT_SECRET);
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
            // Use environment variable for JWT secret
            const data = jwt.verify(token, process.env.JWT_SECRET); 
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

//M-Pesa Integration
const axios = require('axios');
const moment = require('moment');

// Payment Transaction Schema
const Payment = mongoose.model('Payment', {
    merchantRequestID: {
        type: String,
        required: true,
        unique: true
    },
    checkoutRequestID: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    orderItems: [{
        id: Number,
        name: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    mpesaReceiptNumber: {
        type: String,
        default: null
    },
    transactionDate: {
        type: Date,
        default: null
    },
    resultCode: {
        type: String,
        default: null
    },
    resultDesc: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// M-Pesa Utility Functions
class MpesaService {
    constructor() {
        this.consumerKey = process.env.MPESA_CONSUMER_KEY;
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        this.shortcode = process.env.MPESA_SHORTCODE;
        this.passkey = process.env.MPESA_PASSKEY;
        this.callbackUrl = process.env.MPESA_CALLBACK_URL;
        this.environment = 'sandbox';
        
        // Set API URLs based on environment
        this.baseUrl = this.environment === 'production' 
            ? 'https://api.safaricom.co.ke' 
            : 'https://sandbox.safaricom.co.ke';
    }

    // Generate OAuth Token
    async getOAuthToken() {
        try {
            const url = `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`;
            const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
            
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data.access_token;
        } catch (error) {
            console.error('Error getting OAuth token:', error.response?.data || error.message);
            throw new Error('Failed to get M-Pesa OAuth token');
        }
    }

    // Generate Password for STK Push
    generatePassword() {
        const timestamp = moment().format('YYYYMMDDHHmmss');
        const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
        return { password, timestamp };
    }

    // Initiate STK Push
    async initiateSTKPush(phoneNumber, amount, userId, orderItems) {
        try {
            const token = await this.getOAuthToken();
            const { password, timestamp } = this.generatePassword();
            
            // Format phone number (ensure it starts with 254)
            const formattedPhone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.substring(1)}`;
            
            const stkPushData = {
                BusinessShortCode: this.shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.round(amount), // Ensure amount is integer
                PartyA: formattedPhone,
                PartyB: this.shortcode,
                PhoneNumber: formattedPhone,
                CallBackURL: this.callbackUrl,
                AccountReference: `ORDER_${Date.now()}`,
                TransactionDesc: 'Payment for hardware store purchase'
            };

            const url = `${this.baseUrl}/mpesa/stkpush/v1/processrequest`;
            
            const response = await axios.post(url, stkPushData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Save payment record to database
            const payment = new Payment({
                merchantRequestID: response.data.MerchantRequestID,
                checkoutRequestID: response.data.CheckoutRequestID,
                userId: userId,
                phoneNumber: formattedPhone,
                amount: amount,
                orderItems: orderItems,
                status: 'pending'
            });

            await payment.save();

            return {
                success: true,
                merchantRequestID: response.data.MerchantRequestID,
                checkoutRequestID: response.data.CheckoutRequestID,
                responseCode: response.data.ResponseCode,
                responseDescription: response.data.ResponseDescription,
                customerMessage: response.data.CustomerMessage
            };

        } catch (error) {
            console.error('STK Push Error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.errorMessage || 'Failed to initiate payment');
        }
    }

    // Check STK Push Status
    async checkSTKPushStatus(checkoutRequestID) {
        try {
            const token = await this.getOAuthToken();
            const { password, timestamp } = this.generatePassword();

            const queryData = {
                BusinessShortCode: this.shortcode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestID
            };

            const url = `${this.baseUrl}/mpesa/stkpushquery/v1/query`;
            
            const response = await axios.post(url, queryData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('STK Push Status Check Error:', error.response?.data || error.message);
            throw new Error('Failed to check payment status');
        }
    }
}

// Initialize M-Pesa Service
const mpesaService = new MpesaService();

// M-Pesa STK Push Route
app.post('/mpesa/stkpush', fetchUser, async (req, res) => {
    try {
        const { phoneNumber, amount, orderItems } = req.body;
        
        // Validate input
        if (!phoneNumber || !amount || !orderItems) {
            return res.status(400).json({
                success: false,
                message: 'Phone number, amount, and order items are required'
            });
        }

        // Ensure amount is properly formatted (no decimals for M-Pesa)
        const mpesaAmount = Math.round(parseFloat(amount));
        
        // Validate phone number format
        let formattedPhone = phoneNumber.toString();
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith('254')) {
            formattedPhone = '254' + formattedPhone;
        }

        if (!/^254[17]\d{8}$/.test(formattedPhone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Use format 254XXXXXXXXX'
            });
        }

        // Validate amount
        if (mpesaAmount < 1) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be at least 1 KSh'
            });
        }

        console.log('Initiating payment:', {
            phone: formattedPhone,
            amount: mpesaAmount,
            userId: req.user.id
        });

        const result = await mpesaService.initiateSTKPush(
            formattedPhone, 
            mpesaAmount, 
            req.user.id, 
            orderItems
        );

        res.json({
            success: true,
            message: 'STK Push sent successfully',
            checkoutRequestID: result.checkoutRequestID,
            merchantRequestID: result.merchantRequestID,
            customerMessage: result.customerMessage
        });

    } catch (error) {
        console.error('STK Push Route Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Payment initiation failed'
        });
    }
});

// M-Pesa Callback Route
app.post('/mpesa/callback', async (req, res) => {
    try {
        console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));
        
        // Handle both possible callback structures
        const stkCallback = req.body.Body?.stkCallback || req.body.stkCallback;
        
        if (!stkCallback) {
            console.error('Invalid callback structure:', req.body);
            return res.status(400).json({ message: 'Invalid callback structure' });
        }

        const { 
            MerchantRequestID, 
            CheckoutRequestID, 
            ResultCode, 
            ResultDesc 
        } = stkCallback;

        console.log('Processing callback for:', {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc
        });

        // Find the payment record
        const payment = await Payment.findOne({ 
            checkoutRequestID: CheckoutRequestID 
        });

        if (!payment) {
            console.error('Payment record not found for CheckoutRequestID:', CheckoutRequestID);
            return res.status(404).json({ message: 'Payment record not found' });
        }

        console.log('Found payment record:', payment._id);

        // Update payment status based on result code
        if (ResultCode === 0) {
            // Payment successful
            const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
            const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
            const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
            const amountPaid = callbackMetadata.find(item => item.Name === 'Amount')?.Value;

            payment.status = 'completed';
            payment.mpesaReceiptNumber = mpesaReceiptNumber;
            payment.transactionDate = transactionDate ? new Date(transactionDate.toString()) : new Date();
            payment.resultCode = ResultCode.toString();
            payment.resultDesc = ResultDesc;
            payment.updatedAt = new Date();

            await payment.save();

            // Clear user's cart after successful payment
            const cartReset = {};
            for (let i = 0; i < 300; i++) {
                cartReset[i] = 0;
            }
            
            await users.findOneAndUpdate(
                { _id: payment.userId },
                { $set: { cartData: cartReset } }
            );

            console.log(`Payment completed successfully: ${mpesaReceiptNumber}`);
        } else {
            // Payment failed or cancelled
            payment.status = 'failed';
            payment.resultCode = ResultCode.toString();
            payment.resultDesc = ResultDesc;
            payment.updatedAt = new Date();
            
            await payment.save();
            console.log(`Payment failed: ${ResultDesc}`);
        }

        res.status(200).json({ message: 'Callback processed successfully' });

    } catch (error) {
        console.error('Callback processing error:', error);
        res.status(500).json({ message: 'Callback processing failed' });
    }
});

//Test CallBack route for development
app.post('/mpesa/test-callback', async (req, res) => {
    try {
        const { checkoutRequestID, resultCode = 0 } = req.body;
        
        const payment = await Payment.findOne({ checkoutRequestID });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (resultCode === 0) {
            payment.status = 'completed';
            payment.mpesaReceiptNumber = 'TEST' + Date.now();
            payment.transactionDate = new Date();
            payment.resultCode = '0';
            payment.resultDesc = 'Test payment completed';
        } else {
            payment.status = 'failed';
            payment.resultCode = resultCode.toString();
            payment.resultDesc = 'Test payment failed';
        }

        await payment.save();
        
        res.json({ success: true, message: 'Test callback processed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check Payment Status Route
app.get('/mpesa/status/:checkoutRequestID', fetchUser, async (req, res) => {
    try {
        const { checkoutRequestID } = req.params;
        
        console.log('Checking status for:', checkoutRequestID);
        
        // Check our database first
        const payment = await Payment.findOne({ 
            checkoutRequestID,
            userId: req.user.id 
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        console.log('Current payment status:', payment.status);

        // If payment is still pending, try to check with M-Pesa
        if (payment.status === 'pending') {
            try {
                console.log('Payment still pending, checking with M-Pesa...');
                const mpesaStatus = await mpesaService.checkSTKPushStatus(checkoutRequestID);
                console.log('M-Pesa status response:', mpesaStatus);
                
                // Update local status if M-Pesa shows completion
                if (mpesaStatus.ResultCode === '0' && payment.status === 'pending') {
                    payment.status = 'completed';
                    payment.resultCode = mpesaStatus.ResultCode;
                    payment.resultDesc = mpesaStatus.ResultDesc;
                    payment.updatedAt = new Date();
                    await payment.save();
                    console.log('Updated payment status to completed');
                } else if (mpesaStatus.ResultCode !== '1032') { // 1032 means still pending
                    payment.status = 'failed';
                    payment.resultCode = mpesaStatus.ResultCode;
                    payment.resultDesc = mpesaStatus.ResultDesc;
                    payment.updatedAt = new Date();
                    await payment.save();
                    console.log('Updated payment status to failed');
                }
            } catch (mpesaError) {
                console.error('M-Pesa status check failed:', mpesaError.message);
                // Continue with database status if M-Pesa check fails
            }
        }

        res.json({
            success: true,
            payment: {
                checkoutRequestID: payment.checkoutRequestID,
                status: payment.status,
                amount: payment.amount,
                phoneNumber: payment.phoneNumber,
                mpesaReceiptNumber: payment.mpesaReceiptNumber,
                transactionDate: payment.transactionDate,
                resultDesc: payment.resultDesc,
                orderItems: payment.orderItems,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt
            }
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check payment status'
        });
    }
});

// Get User's Payment History
app.get('/mpesa/payments', fetchUser, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            payments: payments.map(payment => ({
                checkoutRequestID: payment.checkoutRequestID,
                status: payment.status,
                amount: payment.amount,
                phoneNumber: payment.phoneNumber,
                mpesaReceiptNumber: payment.mpesaReceiptNumber,
                transactionDate: payment.transactionDate,
                orderItems: payment.orderItems,
                createdAt: payment.createdAt
            }))
        });

    } catch (error) {
        console.error('Payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history'
        });
    }
});


//Generating Text on the terminal reflecting server status
app.listen(port,(error)=> {
    if(!error)
    {
        console.log("Server is running");
    }
    else
    {
        console.log("Error : "+error);
    }
});