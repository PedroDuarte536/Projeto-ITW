function changeImage(newIm) {
    $(".imageholder .image").css("background-image", 'url('+newIm+')');
    if (newIm.includes("shiny")) {
        $(".imageholder .image").css({'border-color': 'yellow', 'background-color': 'rgba(255,255,0,.5)'});
    }
    else {
        $(".imageholder .image").css({'border-color': 'white', 'background-color': 'rgba(200,200,200,.5)'});
    }
}