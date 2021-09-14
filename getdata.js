var json , curr_cl = 0;
$.get("/imagesdata", function(data, status){
      json = JSON.parse(data);
      var imagesrcs = json.node;
      console.log(imagesrcs)
      imagesrcs.forEach(element => {
            //if(element.includes('jpg') || element.includes('png')){
                  if(curr_cl<4){curr_cl++}
                  else{curr_cl=1}
                  var column = document.getElementById("column_"+curr_cl);
                  var image_html = `<img src="/getmethumbnail/${element}" onclick="window.location = '/${element}'" alt="Preety Thumbnail">`;
                  column.insertAdjacentHTML('afterbegin',image_html);
            //}
      });
});

