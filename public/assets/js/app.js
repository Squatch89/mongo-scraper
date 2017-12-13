$(document).ready(function(){
    $('.collapsible').collapsible();
});

$(document).on("click", "submit", function(event){
    event.preventDefault();
    console.log("button clicked");
    $.ajax({
        method: "POST",
        url: `/articles/${this.id}`
    }).then(function(data){
        console.log(data);
    });
});

