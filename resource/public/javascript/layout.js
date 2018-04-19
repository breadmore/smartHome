$(function () {

    $(".menu-text > div").on("click", function () {
        var name = $(this).attr('class');
        if (name == "dashboard") {
            location.href = "/dashboard";
        } else if ( name == "device_security") {
            location.href = "/device_security";
        } else if ( name == "account") {
            location.href = "/account";
        } else if ( name == "logger") {
            location.href = "/logger";
        }

    })


    var para = document.location.href.split("/");

    // console.log(para[3])

    if (para[3] == "dashboard") {
        $(".dashboard").css("background-color", "rgb(90,153,157)");
    } else if (para[3] == "device_security") {
        $(".device_security").css("background-color", "rgb(90,153,157)");
    } else if (para[3] == "account") {
        $(".account").css("background-color", "rgb(90,153,157)");
    } else if (para[3] == "logger") {
        $(".logger").css("background-color", "rgb(90,153,157)");
    }




    // $('#menu-logo').on('click', function(e){
    //     console.log(e.currentTarget.id);
    // });
    //
    // $('.menu-item').on('click', function(e) {
    //     requestPage(e.currentTarget.id);
    // });







});

/*
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

}*/
