# FileWizard.js
drag and drop upload files
- **FileWizard.min.js** - is the minified version of the filewizard
- **FileWizard-bundle.min.js** - is the compile minification of fileuploader and fileward, so you dont need to download the FileUploader.js

# Requirement(s)
* [jQuery][1]
* [FileUploader][2]

# Constructor
- **FileWizard(element, options, headers)**
 - element <sub>| String[selector], jQuery, DOM</sub>
 - options <sub>| Object</sub>
 - headers <sub>| Object</sub>
 
 # Options
- **dragover** <sub>Function</sub>
    - mouse event drag over the element
- **drop** <sub>Function</sub>
    - on drop item event
- **dragenter** <sub>Function</sub>
    - dragenter mouse event
- **rejected** <sub>Function(file,error)</sub>
    - callback if the file is rejected (e.g file_limit, file_type)
- **fileAdded** <sub>Function(file)</sub>
    - event callback if the file is successfully added to the list
- **paramName** <sub>String| default: files</sub>
    - paramater name for the file
- **url** <sub>String| required</sub>
    - url to where to send the request
- **method** <sub>String | default: POST</sub>
   - http method to use in the request
- **clickable** <sub>Boolean| default: true</sub>
    - opens window file browser if the element is clicked
- **acceptedFiles** <sub>String | default: image/*</sub>
    - accepted mime types
- **maxSize** <sub>Integer | default: 5</sub>
    - maximum size of the file in MB
- **multipleFiles** <sub>Boolean | default: true</sub>
    - upload multiple file in one request
- **see also FileUploader js** for additional options

# Methods
- **addData** <sub>Function(key, value)</sub>
    - add data paramater to the request in a key-value pair
- **getFiles** 
    - returns files
- **resetFiles**
    - resets file list in 0 (zero)
- **addFiles** <sub>Function([FileList|Array] files)</sub>
    - add files to the list
- **removeFile** <sub>Function(index, range)</sub>
    - remove file(s) in the list
- **setOptions** <sub>Object</sub>
    - set the options of the file wizard
- **send** 
    - send the data/files to the url specified
- **abort**
    - cancel's the request if the request is still sending

 
[1]: http://jquery.com/
[2]: https://github.com/cresjie/FileUploader.js
