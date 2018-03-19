$(function () {
    $(".switch > input").on("click", function () {
        var id = $(this).parents("div").parents("div").attr("id");
        var id2 = $(this).parents("span").parents("div").attr("id");
        if (id == null) {
            $("#" + id2 + " .toggle > p").toggle();
        } else {
            $("#" + id + " .toggle > p").toggle();
        }
    });

});