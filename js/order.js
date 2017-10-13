var root_url = 'https://api.dgdr.co.kr';

var w_width = $(window).width();
var now_href = $(location).attr('href');

var banner_h = $("#top_banner").height();					/* top-banner 높이 */
var contents_m = $(".contents_wrap").css("margin-top");		/* top-contents 의 margin-top 값 */
var c_margin = contents_m.substr(0, contents_m.length - 2);	/* top-contents 의 margin-top 값 px 제거 */
var r_margin = c_margin;									/* 실제 적용될 margin-top 값 */



// logo 클릭 스크립트
$(".logo_header").click(function () {
    //   location.href="http://d320kovphry0y7.cloudfront.net/";
    location.href = "main.html";
});



// top-banner 스크립트
$.ajax({
    url: root_url + '/main/top-banner/',
    async: false,
    type: 'GET',
    dataType: 'json',
    contentType: "application/json",
    success: function (data) {
        if (data.text == '' || data.text == null) {
            r_margin = (c_margin - banner_h);
            $("#top_banner").remove();
            $(".contents_wrap").css("margin-top", r_margin + "px");
        } else {
            $("#top_banner").text(data.text);
        }
    }
});




// 네비게이션 클릭시 스크립트
$(".gnb > li").click(function () {

    if (w_width <= 720) {
        $(".gnb").slideUp().removeClass('act');
    }

    var con01 = $("#con01").offset();
    var con05 = $("#con05").offset();
    var con06 = $("#con06").offset();
    var con07 = $("#con07").offset();

    var now_href = $(location).attr('href');

    if (now_href.match('main.html')) {
        var target_str = $(this).text();

        switch (target_str) {
            case 'ABOUT': $("html, body").animate({ scrollTop: (con01.top - r_margin) }, 1000);
                break;
            case '서비스': $("html, body").animate({ scrollTop: (con05.top - r_margin) }, 1000);
                break;
            case '입주안내': $("html, body").animate({ scrollTop: (con06.top - r_margin) }, 1000);
                break;
            case '묻고답하기': $("html, body").animate({ scrollTop: (con07.top - r_margin) }, 1000);
                break;
        }
    } else {
        var target_str = $(this).text();

        switch (target_str) {
            case 'ABOUT': location.href = "main.html?target_num=1";
                break;
            case '서비스': location.href = "main.html?target_num=5";
                break;
            case '입주안내': location.href = "main.html?target_num=6";
                break;
            case '묻고답하기': location.href = "main.html?target_num=7";
                break;
        }

    }


});

// 다른페이지에서 네비 클릭시

var con01_top = 122
var con05_top = 2950
var con06_top = 3370
var con07_top = 4220

if (w_width <= 720) {
    con01_top = 72
    con05_top = 1507
    con06_top = 1858
    con07_top = 2223
}


if (now_href.match('main.html')) {
    if (target_num != '') {

        switch (target_num) {
            case '1': $("html, body").animate({ scrollTop: (con01_top - r_margin) }, 1000);
                break;
            case '5': $("html, body").animate({ scrollTop: (con05_top - r_margin) }, 1000);
                break;
            case '6': $("html, body").animate({ scrollTop: (con06_top - r_margin) }, 1000);
                break;
            case '7': $("html, body").animate({ scrollTop: (con07_top - r_margin) }, 1000);
                break;
        }
    }
}


$('.bxslider1').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});
$('.bxslider2').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});
$('.bxslider3').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});
$('.bxslider4').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});
$('.bxslider5').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});
$('.bxslider6').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});
$('.bxslider7').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});
$('.bxslider8').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});
$('.bxslider9').bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true
});

// Mobile Navigation
$('.mobile-btn').click(function () {
    $('.gnb').addClass('act');
    $('.act').slideDown();
    event.preventDefault();
});



// sns 버튼 클릭 이벤트
$(".sns").click(function () {
    var alt = $(this).attr("alt");
    var href = '';
    switch (alt) {
        case 'naver': href = 'https://blog.naver.com/dgdr_wonfamily';
            break;
        case 'insta': href = 'https://www.instagram.com/dgdr_wonfamily';
            break;
        case 'facebook': href = 'https://www.facebook.com/dgdr.wonfamily';
            break;
    }

    window.open(href);
});


//모바일 햄버거 닫기 스크립트
$(document).on("click", function (e) {
    if ($(e.target).parents(".container_01").size() == 0) {
        $(".act").slideUp();
    }
});
$(window).scroll(function () {
    $(".act").slideUp();
});
