$("#scrape").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        $.ajax({
            method: "GET",
            url: "/"
        }).then(function (data) {
            console.log("yay");
        })
    })
});


$(document).on("click", ".submit", function (event) {
    event.preventDefault();
    console.log("button clicked");
    
    $.ajax({
        method: "POST",
        url: `/articles/${$(this).attr("data-id")}`,
        data: {body: $(".commentArea").val()}
    }).then(function (data) {
        console.log(data);
    });
    $(".commentArea").val("");
});

$(document).on("click", ".comments", function () {
    
    let commentId = $(this).attr("data-id");
    $("#" + commentId).empty();
    console.log("this is commentId");
    console.log(commentId);
    $.ajax({
        method: "GET",
        url: `/articles/${$(this).attr("data-id")}`
    }).then(function (data) {
        // console.log(data);
        console.log(data.comment.body);
        for (let i = 0; i < data.comment.length; i++) {
            $("#" + commentId).addClass("commentHolder").append(`<div>${data.comment[i].body}</div>`);
        }
    })
});

