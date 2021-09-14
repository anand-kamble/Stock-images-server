var ejs = require('ejs');
const express = require('express');
const fs = require('fs');
var crypto = require("crypto");
const upload =require('express-fileupload');
const Jimp = require("jimp");
var Datastore = require('nedb');

const database = new Datastore('database.db');
database.loadDatabase();

const app = express();
app.use(upload());
app.use(express.json({limit : '1MB'}))

const port = 3000;



app.get('/imagesdata',(req,res)=>{
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.log(ip);
    var thumbnails = fs.readdirSync(__dirname + '/main_images');
    var time_id = crypto.randomBytes(20).toString('hex');;
    var to_send = {
        time_id : time_id,
        node : thumbnails
    }
    res.write(JSON.stringify(to_send)); 
    res.end();
})


var imageViewKeys = [];

app.get('/',(req,res)=>{
    var images = fs.readdirSync('C:/Users/91911/Documents/Codes/Project 1/main_images');
    /*
    var html_data_post_page = fs.readFileSync('image.html', 'utf-8', function(err, content) {
        if (err) {
        res.end('error occurred');
        return;
        }   
    });

    var view_key = crypto.randomBytes(20).toString('hex');;
    var renderedHtml = ejs.render(html_data_post_page, {imageViewKey  : view_key , imageName : images[0]});
    res.end(renderedHtml);
    imageViewKeys.push(view_key); */
    var random = Math.trunc(Math.random()*images.length);
    console.log(random +'::'+ images.length )
    var imageID = images[random];
    database.find({ imageId: imageID }, function (err, docs) {
        if(docs.length > 0){
            image_details = docs[0];
            var html_data_post_page = fs.readFileSync('image.html', 'utf-8', function(err, content) {
                if (err) {
                res.end('error occurred');
                return;
                }   
            });
        
            var view_key = crypto.randomBytes(20).toString('hex');;
            var renderedHtml = ejs.render(html_data_post_page, {
                imageViewKey  : view_key , 
                imageName : imageID,
                tiTle : image_details.title,
                desCriPtion : image_details.description,
                taGs : image_details.tags,
                timeofupload : image_details.timeOfUpload
            });
            res.end(renderedHtml);
            imageViewKeys.push(view_key);
        }else{
            res.sendStatus(404)
        }
        });

})
app.get('/like.png',(req,res)=>{
    res.sendFile('c:/Users/91911/Documents/Codes/Project 1/like.png')
})

app.get('/upload' , (req,res)=>{
    res.sendFile(__dirname + '/upload.html');
})

app.post('/uploadfile', (req,res)=>{
    moveuploadedfile();
  function moveuploadedfile () {
        var idOfImage = makeid(9);
        if(fs.existsSync(__dirname + '/main_images/' + idOfImage)){
            moveuploadedfile();
        }
        else{
            var imageData = {
                imageId : idOfImage,
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags,
                is_nsfw: req.body.is_nsfw,
                timeOfUpload: req.body.timeOfUpload,
                is_active : true
            }
            req.files.file.mv('./temp_files/'+idOfImage, async (err)=>{
                    if(err){
                    res.end('Please Try Again in some time.');
                    }
                    else{
                    await image_processesing(idOfImage);
                    }
                })
            
            database.insert(imageData);

            res.write(`http://localhost:3000/${idOfImage}`);
            res.end()
            
        }    
    
        
    }
    
})

app.get('/favicon.png',(req,res)=>{
    res.sendFile(__dirname + '/like.png')
})


app.get('/:imageID',(req,res)=>{
    console.log(req.params.imageID);
    var image_details;
    database.find({ imageId: req.params.imageID }, function (err, docs) {
    if(docs.length > 0){
        image_details = docs[0];
        var html_data_post_page = fs.readFileSync('image.html', 'utf-8', function(err, content) {
            if (err) {
            res.end('error occurred');
            return;
            }   
        });
    
        var view_key = crypto.randomBytes(20).toString('hex');;
        var renderedHtml = ejs.render(html_data_post_page, {
            imageViewKey  : view_key , 
            imageName : req.params.imageID,
            tiTle : image_details.title,
            desCriPtion : image_details.description,
            taGs : image_details.tags,
            timeofupload : image_details.timeOfUpload
        });
        res.end(renderedHtml);
        imageViewKeys.push(view_key);
    }else{
        res.sendStatus(404)
    }
    });
    
    
})

app.get('/sctipts/:scriptName',(req,res)=>{
    
        res.sendFile(__dirname + '/' + req.params.scriptName);

})

app.get('/getcss/:CSSFileName',(req,res)=>{
    res.sendFile(__dirname + '/' + req.params.CSSFileName)
})

app.get('/getmeimage/:imagename/:imageViewKey',(req , res) => {
    console.log(req.params.imagename);
    console.log(req.params.imageViewKey);
    //res.set('Content-Type','image/jpeg')
    if(imageViewKeys.includes(req.params.imageViewKey)){
        res.sendFile('C:/Users/91911/Documents/Codes/Project 1/main_images/'+ req.params.imagename);
        imageViewKeys.splice(imageViewKeys.indexOf(req.params.imageViewKey),1);
    }else{
        res.end("Pall")
    }
})

app.get('/getmethumbnail/:thumbnailName',(req,res)=>{
    res.sendFile(__dirname+'/main_images/'+req.params.thumbnailName);
})


app.get('/getmeimage/:imagename',(req , res) => {

        res.sendFile('C:/Users/91911/Documents/Codes/images/'+ req.params.imagename);

    
})


app.listen(port)

async function image_processesing (name_of_file) {
    var image = await Jimp.read(__dirname + '/temp_files/' + name_of_file);
    await image.resize(320,Jimp.AUTO);
    image.write(__dirname + '/thumbnails/' + name_of_file);
    fs.rename(__dirname + '/temp_files/' + name_of_file, __dirname + '/main_images/' + name_of_file, (err)=>{})
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}