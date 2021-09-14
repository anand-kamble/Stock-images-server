var Jimp = require('jimp');
var fs = require('fs');
var async = require('async');


var images = fs.readdirSync('C:/Users/91911/Documents/Codes/images')

/* Jimp.read('C:/Users/91911/Documents/Codes/images/5wigt0yucgy61.jpg', (err, lenna) => {
  if (err) throw err;
  lenna
    .resize(256, Jimp.AUTO) // resize
    .write('lena-small-bw.jpg'); // save
}); */
class editing {
  constructor () {
    this.q = async.queue(this.edittheimage , 1)
  }

  async edittheimage(imageName , callback){
    
    if(imageName.includes('.jpg') || imageName.includes('.png')){
    var photo = await Jimp.read('C:/Users/91911/Documents/Codes/images/'+imageName).catch(err => {
      console.log("Can't read : "+imageName);
      callback()
    });
      
    /* console.log("read : "+imageName);
    await photo.resize(320,Jimp.AUTO);
    await photo.write('thumbnails/'+imageName);
    console.log('resized : ' + image_name ); */

    callback();
    }else{
      callback();
    }
  }

  startprocessing(images){
    for(let image of images){
      this.q.push(image);
    }
  }
}

var process = new editing();
process.startprocessing(images); 

/* console.log(images);

async function main (image_name){
  var image = await Jimp.read('C:/Users/91911/Documents/Codes/images/Disha P Black  Calvin Klein Enhanced.jpg').catch(err => {console.log(err)});
  await image.resize(640,Jimp.AUTO);
  await image.write('thumbnails/Disha P Black  Calvin Klein Enhanced.jpg')
  console.log('resized : ' + image_name )
}

main(images[0]); */