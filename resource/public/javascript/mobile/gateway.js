

var gatewayList;

$(document).ready(function () {
    createDeviceListView();
    console.log(gatewayList);
})


function createDeviceListView() {
    $.ajax({
        url: '/api/v1/gateways',
        type: 'get',
        async: false,
        success: function (gatewayResult) {
            gatewayList = gatewayResult;
            $.each(gatewayList, function (index, item) {
                $('.gateway-page').append(gatewayListForm(item));
                // $('.device-section').append(selectSortList(item));
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
        dom+='<div class="row device-card-body-content"><div class="content-title">IP Address</div>';
        dom+='<div class="content-ip">'+gateway.ip+'</div><div class="content-port">PORT Address '+gateway.port+'</div>';
        dom+='</div></div>';

    return dom;
}

function selectSortList(gateway) {
    var list='<option>'+gateway.name+'</option>';

    return list;
}