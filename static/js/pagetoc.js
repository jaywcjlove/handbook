var toc = document.getElementsByClassName('page-toc');
var top = window.pageYOffset;

if(toc.length>0){
    toc = toc[0];
}else{
    toc = false;
}

if(toc&&top>88){
    console.log("test")

}
