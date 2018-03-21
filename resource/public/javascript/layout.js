$(function () {
    $(".menu_list > div").on("click", function () {
        var url = $(this).attr("class");
        if (url == "gateway") {
            location.href = "/gateway";
        } else if (url == "iot_device") {
            location.href = "/iotdevices";
        } else if (url == "account") {
            location.href = "/account";
        } else if (url == "security") {
            location.href = "/security";
        } else if (url == "dashboard") {
            location.href = "/dashboard";
        }
    });

    var para = document.location.href.split("/");

    console.log(para[3])

    if (para[3] == "dashboard") {
        $(".dashboard").css("background-color", "#848484");
        $(".dashboard > p").css("background-color", "#848484");
    } else if (para[3] == "gateway") {
        $(".gateway").css("background-color", "#848484");
        $(".gateway > p").css("background-color", "#848484");
    } else if (para[3] == "iotdevices") {
        $(".iot_device").css("background-color", "#848484");
        $(".iot_device > p").css("background-color", "#848484");
    } else if (para[3] == "security") {
        $(".security").css("background-color", "#848484");
        $(".security > p").css("background-color", "#848484");
    } else if (para[3] == "account") {
        $(".account").css("background-color", "#848484");
        $(".account > p").css("background-color", "#848484");
    }




    $('#menu-logo').on('click', function(e){
        console.log(e.currentTarget.id);
    });

    $('.menu-item').on('click', function(e) {
        requestPage(e.currentTarget.id);
    });







});

function requestPage(page) {
    console.log(page);
    var url = '/';
    switch (page) {
        case 'menu-dashboard':
            url = '/new/dashboard';
            break;
        case 'menu-gateway':
            url = '/new/gateway';
            break;
        case 'menu-device':
            url = '/new/iotdevices';
            break;
        case 'menu-security':
            url = '/new/security';
            break;
        case 'menu-account':
            url = '/new/account';
            break;
        case 'menu-event':
            // url = '/new/event';
            break;
        default:
            url = '/';
            break;
    }
    // console.log(url);
    location.href = url;

}