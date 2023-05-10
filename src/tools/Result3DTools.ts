import { WebGLRenderer, Scene, Camera } from "three";

export const takeScreenshot = (renderer: WebGLRenderer, scene: Scene, camera: Camera) => {

    // open in new window like this
    //
    const w = window.open('', '') as WindowProxy;
    w.document.title = "Screenshot";
    //w.document.body.style.backgroundColor = "red";
    var img = new Image();
    // Without 'preserveDrawingBuffer' set to true, we must render now
    renderer.render(scene, camera);
    img.src = renderer.domElement.toDataURL();
    w.document.body.appendChild(img);  

/*
    // download file like this.
    //
    var a = document.createElement('a');
    // Without 'preserveDrawingBuffer' set to true, we must render now
    renderer.render(scene, camera);
    a.href = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
    a.download = 'canvas.png'
    a.click();
*/
    
/*
    // New version of file download using toBlob.
    // toBlob should be faster than toDataUrl.
    // But maybe not because also calling createOjectURL.
    //
    renderer.render(scene, camera);
    renderer.domElement.toBlob(function(blob){
    	var a = document.createElement('a');
      var url = URL.createObjectURL(blob);
      a.href = url;
      a.download = 'canvas.png';
      a.click();
    }, 'image/png', 1.0);
*/
    
}