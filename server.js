// import Express module
let express=require("express")
// import MongoDB module
let mongoDB=require("mongodb")
// create Server by6 using Express package 
let server=express()
// to serve static file in express 
server.use(express.static("public"))
//To get axact port number that heroku enviroment want
let port =process.env.PORT
if(port == null || port == ""){
  port = 4000 
}
//by Setting port number rum "git init" command in CMD to prepare git to send our files to heroku
//To establishing the connection between node.js and MongoDB  in line 12
let dataBase
let conncetionString="mongodb+srv://todoAppUser:T0SHiJD3WCtUKKx1@cluster0.nxkw7.mongodb.net/ToDoList?retryWrites=true&w=majority"
//Connect method have 3 arguments 1st-connection string, 3rd arg-call back fun that call after connection with db get established
mongoDB.connect(conncetionString,{useNewUrlParser:true,useUnifiedTopology: true},(err,client)=>{
  dataBase=client.db()  //To access Database we giverefrense to dataBase variable
  server.listen(port)   //After established the connection to database server will listen
})

server.use(express.json()) // Server use json as middleware to send and recieve data in the form of object
server.use(express.urlencoded({extended:false})) // server use it dor parses the data

// server get req from home url 
server.get("/",(req,res)=>{
  // as soon as server get req,first thing server tries to make connection with mongodb
  // after getting connected with mongodb ,server res to browser by sending html
  dataBase.collection("items").find().toArray((err,items)=>{
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App! !</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form> 
        </div>
        
        <ul id="item-list" class="list-group pb-5">
        
        </ul>
        
      </div>
      <script>
      let items= ${JSON.stringify(items)}
      </Script>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script> 
      <script src="/browser.js"></script>
    </body>
    </html>
    `)
  })
    
})

// After getting post req from browser to server to store data in mongodb
// server tries to insert requested data into MongoDb that is send from browser 
server.post("/create-item",(req,res)=>{
  // tries to insert data into DataBase
  // inserOne()method have 2 argu
  // 1st argu- requested data that send from browser 
  // 2nd argu- callback fun that call by insertOne method after requested data stored successfully into mongoDb
  // after data stored in mongodb successfully callback function return json object data as response to browser 
  dataBase.collection("items").insertOne({text: req.body.text},(err,info)=> res.json(info.ops[0]))
  
})
// After getting post req from browser to server to update data in mongodb
// server tries to update requested data into MongoDb that is send from browser
server.post("/update-item",(req,res)=>{
  // console.log(req.body.newV) // we log data in node.js env that send from browser enviroment
  // Here,Below node.js tries to update data in mongodb and send "success" msg as response  to browser
  dataBase.collection("items").findOneAndUpdate({_id : new mongoDB.ObjectId(req.body.id)},{$set : {text:req.body.newV}},()=>{
    res.send("Success")
  })
})
 //node.js tries to delete data from mongodb and send "success" msg as response  to browser
 server.post("/delete-item",(req,res)=>{
  dataBase.collection("items").deleteOne({_id : new mongoDB.ObjectId(req.body.id)},()=>{
     res.send("Success")
   })
 })
