$(document).ready(function(){
    $('.collapsible').collapsible();
});

$(document).on("click", "submit", function(event){
    event.preventDefault();
    console.log("button clicked");
    $.ajax({
        method: "POST",
        url: "/post"
    }).then(function(data){
        console.log(data);
    });
});

