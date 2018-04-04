

$(function () {
    console.log("asd");
    function temp(temp_p) {
        $('section.temp.model-1 > div').before("<style> .temp.model-1 .graph:before {\n" +
            "    transform: rotate(" + temp_p*1.8 + "deg);\n" +
            "}" +
            "</style>");
    };

    temp(23);

    function humi(humi_p) {
        $('section.humi.model-1 > div').before("<style> .humi.model-1 .graph:before {\n" +
            "    transform: rotate(" + humi_p*1.8 + "deg);\n" +
            "}" +
            "</style>");
    };

    humi(50);

    function lumi(lumi_p) {
        $('section.lumi.model-1 > div').before("<style> .lumi.model-1 .graph:before {\n" +
            "    transform: rotate(" + lumi_p*1.8 + "deg);\n" +
            "}" +
            "</style>");
    };

    lumi(100);


    // $("section .changed").after().css("transform","rotate(180deg)");
});