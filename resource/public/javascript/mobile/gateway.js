

var gatewayList;

$(document).ready(function () {
    createGatewayListView();
    console.log(gatewayList);

    $(".input-img").on("click", function () {
       var name = $(".search-bar").val();
       searchGateways(name);
    });

    $(".search-bar").keypress(function(e) {
        if (e.keyCode == 13){
            var name = $(".search-bar").val();
            searchGateways(name);
        }
    });

});

function searchGateways(name) {
    var dataJson = {
        "name" : name
    };
    $.ajax({
        url: '/api/v1/gateways/gateway',
        type: 'post',
        data: dataJson,
        success: function (searchResult) {
            if (searchResult.length === 0) {
                alert("Gateway not found")
            } else if (searchResult.length > 0) {
                gatewayList = searchResult;
                $(".gateway-page").empty();
                $.each(gatewayList, function (index, item) {
                    $('.gateway-page').append(gatewayListForm(item));
                });
            } else {
                console.log("What error????");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}



function createGatewayListView() {
    $.ajax({
        url: '/api/v1/gateways',
        type: 'get',
        async: false,
        success: function (gatewayResult) {
            gatewayList = gatewayResult;
            $.each(gatewayList, function (index, item) {

                $('.gateway-page').append(gatewayListForm(item));
            });
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function gatewayListForm(gateway) {
    var dom='<div class="device-card">';
        dom+='<div class="col-12 device-card-top"><div class="col-4 device-left"></div></div>';
        dom+='<div class="device-card-body"><div class="device-card-body-title">'+gateway.name+'</div>';
        dom+='<div class="row device-card-body-content"><div class="content-ipAddress">IP Address</div>';
        dom+='<div class="content-ip">'+gateway.ip+'</div><div class="content-portAddress">PORT Address</div><div class="content-port">'+gateway.port+'</div>';
        dom+='</div></div>';

    return dom;
}

function selectSortList(gateway) {
    var list='<option>'+gateway.name+'</option>';

    return list;
}