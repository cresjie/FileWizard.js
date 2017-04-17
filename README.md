# FileWizard.js
    Light JS Library for drag and drop upload files. Provides skeletal support to your file upload.
    You can easily create your theme by just attaching in the triggered events, especially: "progress" event for detecting upload percent 
- **FileWizard.min.js** - is the minified version of the filewizard
- **FileWizard-bundle.min.js** - is the compile minification of fileuploader and fileward, so you dont need to download the FileUploader.js

# Installation via Bower
```{r, engine='bash', count_lines}
bower install filewizard.js --save
```
# Requirement(s)
* [jQuery][1]
* [FileUploader][2] <sub>(already included in the **FileWizard-bundle.min.js**)</sub>

# Constructor
- **FileWizard(element, options, headers)**
 - element <sub>| String[selector], jQuery element, DOM</sub>
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
- **fileRemoved** <sub>Function(Array files)</sub>
    - trigger when file(s) is/are removed
- **paramName** <sub>String| default: files</sub>
    - paramater name for the file
- **url** <sub>String| required</sub>
    - url to where to send the request
- **method** <sub>String | default: POST</sub>
   - http method to use in the request
- **clickable** <sub>Boolean| default: true</sub>
    - opens window file browser if the element is clicked
- **acceptedFiles** <sub>Array | default: ['jpg','jpeg','png','gif']</sub>
    - accepted file extension 
- **maxSize** <sub>Integer | default: 5</sub>
    - maximum size of the file in MB
- **multipleFiles** <sub>Boolean | default: true</sub>
    - upload multiple file in one request
- **beforeSubmit** <sub>Function(settings, Array|File file(s) )</sub>
    - triggers before the request is submitted
- **see also FileUploader js** for additional options

# Methods
- **addData** <sub>Function(key, value) or Function(Object)</sub>
    - add data paramater to the request in a key-value pair. 
    e.g fw.addData({x: 0, y: 0, width: 300, height: 300}); //data parameter for the image to be cropped
- **getFiles** 
    - returns files
- **resetFiles**
    - resets file list in 0 (zero)
- **addFiles** <sub>Function([FileList|Array] files)</sub>
    - add files to the list
- **removeFile** <sub>Function(index, range)</sub>
    - remove file(s) in the list
- **setOptions** <sub>Function(Object option)</sub>
    - set the options of the file wizard
- **send** <sub>Function(Object data) *optional</sub>
    - send the data/files to the url specified, optional additional data parameters can be added before send
- **abort** <sub>Integer | default: 0</sub>
    - cancel's the request at the specific index
- **abortAll**
    - cancel all the ongoing request

 
[1]: http://jquery.com/
[2]: https://github.com/cresjie/FileUploader.js
