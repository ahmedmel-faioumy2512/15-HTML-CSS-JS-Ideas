let toggler = document.querySelector(".toggle");
let nav = document.querySelector("nav");
let closSpan = document.querySelector(".close");

toggler.onclick = function(){
    nav.classList.add("open");
};

closSpan.onclick = function(){
    this.parentElement.classList.remove("open");
};

document.onkeyup = function (e){
    if(e.key === "Escape"){
        nav.classList.remove("open");
    }
};