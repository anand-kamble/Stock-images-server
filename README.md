# Stock-images-server

A NodeJS project which handles both backend and front and of a Stock Image Sharing platform. 
With the help of node modules like JIMP, nedb, ejs, express and async.

## USAGE :
Start the server by running the 'index.js' file.  
```
node index.js
```

On the home page, random image from the database is served along with the thumbnails of other images available.  

![Preview of the home page](Preview.jpg)


Users can also upload file on the server through the upload page.  
Where they can drag and drop the file and the page will check the if the file meets the specified requirements of the server.
If files don't match the requirements, users will be get a message about which required parameter their file lacks.

