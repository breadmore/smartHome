$(function () {
    $(".exit-img").on("click", () => {
        $.ajax({
            url: '../api/logout',
            type: 'post',
            success: function (data) {
                console.log(data);
                location.href = "/";
            },
            error: function (data) {
                console.log(data);
            }
        });
    });
});