$(function () {
    $(".confirm-btn").on("click", () => {


        var userId = $(".id").val();
        var password = $(".pw").val();

        var user = {
            "userId" : userId,
            "password" : password
        }
        console.log(user);
        $.ajax({
            url : "../api/login",
            type : "post",
            data : JSON.stringify(user),
            contentType:"application/json; charset=utf-8",
            success: function (data) {
                console.log("good");
                location.href = "/m/dashboard";
            },
            error: function (data) {
                console.log(data);
                if (data.status === 404) {
                    alert('id not found');
                } else if (data.status === 400) {
                    alert('password error');
                }
            }
        })
    });




});