let express = require("express");
let parser=require("body-parser");
let app = express();
app.use(express.static("www"));
app.use(parser.urlencoded({extended:true}));
// 因為 parser 是一個中介函式，所以這邊用 use

// 初始化 Firebase
let admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://javascriptsnode.firebaseio.com"
});

// 操作資料庫
let database=admin.database();
let ref=database.ref("/messages");

// 用 get 方法處理 /get 路徑
app.get("/get", function(req, res){
	var time=parseInt(req.query.time); // get 參數 方法二
	var ref=admin.database().ref("/comments");
	ref.orderByChild("time").startAt(time).on("value", function(snapshot){
		var value=snapshot.val();
		if(value==null){ // 資料是空的
			res.send({});
		}else{
			res.send(value);
			console.log(value);
		}
		// res.send(value); 這個就不要了
	}, function(error){
		res.send("Error");
	});
});

// 用 post 方法處理，聆聽 /post 路經 
app.post("/post", function(req, res){
	var name=req.body.name;
	var content=req.body.content;
	var ref=admin.database().ref("/comments");
	ref.push({
		name:name, content:content, time:(new Date()).getTime()
	}, function(error){
		if(error){
			res.send("Error");
		}else{
			res.send("OK");
		}
	});
});





app.listen(3000, function () {
	console.log("Server Started");
});
