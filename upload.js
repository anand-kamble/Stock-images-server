dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
    evt.preventDefault();
        $("#dropContainer").css("background-color","rgb(150,150,150)");
};
var file_tosend ;

dropContainer.ondrop = function(evt) {

fileInput.files = evt.dataTransfer.files;
console.log(fileInput.files.length)
if(fileInput.files.length == 0){
    $("#dropContainer").css("background-color","rgb(0,0,0)");
    $("#drop_here").text("Select a file first");
};
if(fileInput.files.length === 1){
    file_tosend = evt.dataTransfer.files[0];
    filecheck(fileInput.files[0]);
};
if(fileInput.files.length > 1){
    clearFileInput("fileInput");
    $("#dropContainer").css("background-color","rgb(0,0,0)");
    $("#drop_here").text("Only one file at a time.");
};


evt.preventDefault();
};


document.getElementById("fileInput").onchange = function(evt) {
    file_tosend = evt.target.files[0];
    filecheck(evt.target.files[0])
    console.log(file_tosend + "FL")
evt.preventDefault();
};

function filecheck (file_data){
    $("#dropContainer").css("background-color","rgb(0,0,0)");
    $("#drop_here").text(file_data.name);
    var valid_type = check_file(file_data.type);
    var valid_size = check_size(file_data.size);
    var valid_resolution = false;

    if (valid_type === false){
        $("#drop_here").text("IT'S NOT MY TYPE.");
        $("#validity_info").text("JPEG,PNG,GIF,MP4,WEBM,OOG Supported.");
    };
    if(valid_size === false){
        $("#drop_here").text("IT'S TOO BIG FOR ME.");
        $("#validity_info").text("Maximum 10 MB");
    };

    var _URL = window.URL || window.webkitURL;
    var img = new Image();
    
    img.src = _URL.createObjectURL(file_data);
    img.addEventListener('load',()=>{
        console.log(img.width*img.height  )
        if(img.height*img.width >2073599){
            valid_resolution = true
        }

        if(valid_resolution === false){
            $("#drop_here").text("WALLPAPERS NEED MORE RESOLUTION !!");
            $("#validity_info").text("Min. 2 MegaPixels");
        }
            
    
        if(valid_size === true && valid_type === true && valid_resolution === true  ) {
            $("#validity_info").text("Perfect");
            document.getElementById('form_title').value = file_data.name.split('.')[0];
            var currentposition = 100;
            var slider = document.getElementById("file_metadata");
            var looplenght = 0;
            var loop = setInterval(()=>{
                currentposition--;
                looplenght++;
                slider.style = `top : ${currentposition}%`
                if(looplenght >= 100){
                    clearInterval(loop);
                }
            },1);
        }
    })

    

}

function check_size(size){
    if(size < 10485760 ){
        return true;
    }else{
        return false;
    }
}

function check_file(type){
    const validTypes = ['image/gif', 'image/jpeg', 'image/png','video/mp4','video/webm','video/ogg'];
    if(validTypes.includes(type)){
        return true;
    }else{
        return false;
    }
}

function clearFileInput(id) 
{ 
    var oldInput = document.getElementById(id); 
    var newInput = document.createElement("input"); 

    newInput.type = "file"; 
    newInput.id = oldInput.id; 
    newInput.name = oldInput.name; 
    newInput.className = oldInput.className; 
    newInput.style.cssText = oldInput.style.cssText; 
    oldInput.parentNode.replaceChild(newInput, oldInput); 
}

function checking_form(){
    let form_data_title = document.forms["metadata"]["title"].value;
    let form_data_disc = document.forms["metadata"]["discription_to_upload"].value;
    /* let form_data_mentions = document.forms["metadata"]["peoples_name"].value; */
    let form_data_tags = document.forms["metadata"]["tags"].value;
    
    let form_data_toggle = document.forms["metadata"]["toggle_switch"].checked;
    if(form_data_title.length > 0){
        if(form_data_disc.length > 0){
            if(form_data_tags.length > 0){
                console.log("All good");
                $("#upload_button").hide();
                $("#progressBar").show();
                uploadFile();
            }else{
                warntofill(2);
            }
        }else{
            warntofill(1);
        }
    }else{
        warntofill(0);
    }
}

function warntofill (number) {
    var titleHead = document.getElementById("title");
    var descriptionHead = document.getElementById("discription_to_upload");
    var tagHead = document.getElementById("tags");
    if(number == 0){titleHead.style = 'color : red;'}
    if(number == 1){descriptionHead.style = 'color : red;'}
    if(number == 2){tagHead.style = 'color : red;'}
}

function uploadFile() {
    var file = file_tosend;
    var title = document.forms["metadata"]["title"].value.split('.')[0];
    var description = document.forms["metadata"]["discription_to_upload"].value;
    var tag = document.forms["metadata"]["tags"].value;
    var nsfw = document.forms["metadata"]["toggle_switch"].checked;
    var tags;
    if(tag.includes(',')){
         tags = tag.split(',');
    }else{
        tags = tag;
    }
    console.log(file);
    var formdata = new FormData();
    console.log(title)
    formdata.append("title",title)
    formdata.append("file", file);
    formdata.append("description", description);
    formdata.append("tags", tags);
    formdata.append("is_nsfw", nsfw);
    formdata.append("timeOfUpload", + new Date());
    
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", "/uploadfile");
    ajax.send(formdata);
  }
  
  function progressHandler(event) {
    /* document.getElementById("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total; */
    var percent = (event.loaded / event.total) * 100;
    /* _("progressBar").value = Math.round(percent); */
    document.getElementById("progressBar").style = "width:"+Math.round(percent)+"%;display:block;"; // Math.round(percent) + "% uploaded... please wait";
    document.getElementById("progressBar").innerHTML = Math.round(percent)+"%";
}
  
  function completeHandler(event) {
    document.getElementById("progressBar").innerHTML = event.target.responseText;
    //document.getElementById("progressBar").value = 0; //wil clear progress bar after successful upload
    $("#form_holder").hide();
    var enddiv = document.getElementById("livelinkdiv");
    enddiv.style = "display:block";
    var linklive = document.getElementById("livelink");
    linklive.href = event.target.responseText;
    linklive.innerHTML = event.target.responseText;
  }
  
  function errorHandler(event) {
    document.getElementById("progressBar").innerHTML = "Upload Failed";
  }
  
  function abortHandler(event) {
    document.getElementById("progressBar").innerHTML = "Upload Aborted";
  }