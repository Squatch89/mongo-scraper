$(document).ready(function () {
    $('.collapsible').collapsible();
    
});

$(document).on("click", ".submit", function (event) {
    event.preventDefault();
    console.log("button clicked");
    console.log($(this).attr("data-id"));
    console.log($(".commentArea").val());
    $.ajax({
        method: "POST",
        url: `/articles/${$(this).attr("data-id")}`,
        data: {body: $(".commentArea").val()}
    }).then(function (data) {
        console.log(data);
    });
});

$(document).on("click", ".comments", function () {
    let commentId = $(this).attr("data-id");
    console.log("this is commentId");
    console.log(commentId);
    $.ajax({
        method: "GET",
        url: `/articles/${$(this).attr("data-id")}`
    }).then(function (data) {
        // console.log(data);
        console.log(data.comment.body);
        for (let i = 0; i < data.comment.length; i++) {
            $("#" + commentId).append(`<span>${data.comment[i].body}</span>`);
        }
    })
});

