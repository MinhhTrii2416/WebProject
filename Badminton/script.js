const dropdown = document.getElementsByClassName("dropdown");
dropdown[0].addEventListener("mouseover", ()=> {
    document.getElementById("dropdown-menu").style.display = "block";
});
dropdown[0].addEventListener("mouseout", ()=> {
    document.getElementById("dropdown-menu").style.display = "none";
});