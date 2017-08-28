	var root_url = 'https://api.onefamily.kr';

	var w_width = $(window).width();

	var banner_h = $("#top_banner").height();					/* top-banner 높이 */
	var contents_m = $(".contents_wrap").css("margin-top");		/* top-contents 의 margin-top 값 */
	var c_margin = contents_m.substr( 0, contents_m.length-2 );	/* top-contents 의 margin-top 값 px 제거 */
	var r_margin = c_margin;									/* 실제 적용될 margin-top 값 */

	var position = '';
	var house = id;

	// 자릿수 콤마 정규식
	function numberCommas(x) {
	  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	add_room_option(id);

	// logo 클릭 스크립트
	$(".logo_header").click(function() {
	  location.href="main.html";
	});

	// top-banner 스크립트
	$.ajax({
		url:root_url+'/main/top-banner/',
		async: false,
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
			if(data.text == '' || data.text == null) {
				r_margin = (c_margin-banner_h);
				$("#top_banner").remove();
				$(".contents_wrap").css("margin-top",r_margin+"px");
			} else {
				$("#top_banner").text(data.text);
			}
		}
	});

	//detail 이미지 탭 호버 스크립트
	$(document).on("click",".dt_con01_ul > li",function() {
		$(".dt_con01_ul > li").removeClass("active1");
		$(".dt_con01_imgbox > div").hide();
		$(this).addClass("active1");
		var detail_num = $(this).attr("detail_num");
		//alert(detail_num);
		$(".detail_slider"+detail_num).show();

	});

	// detail 내용 스크립트
	$.ajax({
		url:root_url+'/house/'+id+'/',
		type:'GET',
		async: false,
		dataType:'json',
		contentType : "application/json",
		success:function(data){

			position = data['position'];

			//디테일 이미지
			$.each(data['photo_group'], function(i, val){
				var str = '<li detail_num="'+val.id+'">'+val.name+'</li>'

				var str0 = '<div class="detail_slider'+val.id+'"><ul class="bxslider'+val.id+'">';

				$.each(val.house_photo, function(i0, val0){
					str0 = str0 + '<li class="detail_slider_img"><img src="'+val0.photo+'" /></li>';
				});
				str0 = str0 + '</ul></div>';

				$(".dt_con01_ul").append(str);
				$(".dt_con01_imgbox").append(str0);

				$('.bxslider'+val.id).bxSlider({
					infiniteLoop: false,
					hideControlOnEnd: true
				});

				str0 = '';
			});

			$(".detail_slider1").show();
			$(".dt_con01_ul").children().first().addClass("active1");

			$(".dt_con01_ul").append();

			//지점소개
			var ex_str = data['introduction'].replace( /\r\n/g, "<br>");

			$(".introduction_p").html(ex_str);

			//입주현황
			$.each(data['rooms'], function(i, val){
				var sex = '';
				var is_open = '';
				var open_str = '';
				if(val.sex == 'woman') {
					sex = '여성전용';
				} else {
					sex = '남성전용';
				}
				if(val.is_open) {
					is_open = 'sign';
					open_str = '입주신청';
				} else {
					is_open = 'wait';
					open_str = '입주대기';
				}

				var month_rent = numberCommas(val.month_rent);
				var month_manage_fee = numberCommas(val.month_manage_fee);
				var deposit = numberCommas(val.deposit);

				var str2 = '<tr><td>'+val.name+'</td><td>'+sex+'</td><td>'+val.capacity+'인실</td><td>'+val.area+'㎡</td><td>'+month_rent+'원</td><td>'+month_manage_fee+'원</td><td>'+deposit+'원</td><td>'+val.moving_month+'</td><td><div class="'+is_open+'" room_id="'+val.id+'">'+open_str+'<i class="fa fa-angle-right"></i></div></td></tr>';

				$(".rooms_tb").append(str2);
			});

			//제공 서비스 - 공용서비스
			var common_services = new Array();
			common_services = data['common_service'].split('\r');
			$.each(common_services, function(i, val){
				$(".common_service").append('<li>'+val+'</li>');
			});

			//제공 서비스 - 개인서비스
			var private_services = new Array();
			private_services = data['private_service'].split('\r');
			$.each(private_services, function(i, val){
				$(".private_service").append('<li>'+val+'</li>');
			});

			//교통시설
			var transportations = new Array();
			transportations = data['transportation'].split('\r');
			$.each(transportations, function(i, val){
				$(".t_text").append('<p>'+val+'</p>');
			});

			//대학교 접근성
			var accessibilitys = new Array();
			accessibilitys = data['accessibility'].split('\r');
			$.each(accessibilitys, function(i, val){
				$(".ac_text").append('<p>'+val+'</p>');
			});

			//편의시설
			var amenitys = new Array();
			amenitys = data['amenity'].split('\r');
			$.each(amenitys, function(i, val){
				$(".am_text").append('<p>'+val+'</p>');
			});

		}
	});




	// 구글맵 스크립트
	var map;
      function initMap() {
		positions = position.split(',');
		map = new google.maps.Map(document.getElementById('map'), {
		  center: new google.maps.LatLng(positions[0], positions[1]),
		  zoom: 16,
		  mapTypeId: 'roadmap',
		  disableDefaultUI: true
		});

		var zoomLevel;

		 google.maps.event.addListener(map, 'zoom_changed', function() {
		   zoomLevel = map.getZoom();

		   if (zoomLevel > 16) {
			 map.setZoom(16);
		   }
	     });


		/*
		var marker = new google.maps.Marker({
          position: new google.maps.LatLng(positions[0], positions[1]),
          map: map
        });
		*/

		var Circle = new google.maps.Circle({
            strokeColor: '#3D9E9E',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#BEDD7D',
            fillOpacity: 0.35,
            map: map,
            center: new google.maps.LatLng(positions[0], positions[1]),
            radius: 100
          });

      }




	// 입주 관련 문의 스크립트
	$.ajax({
		url:root_url+'/main/faq/tenant/',
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
			$.each(data, function(i, val) {
				var str = '<li class="info_title">'+data[i]['id']+". "+data[i]['question']+'<div class="info_bullet" updown="down"></div></li><li class="info_txt">'+data[i]['answer']+'</li>';
				$(".info_ul1").append(str);
			});
		}
	});

	// 계약 관련 문의 스크립트
	$.ajax({
		url:root_url+'/main/faq/partner/',
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
			$.each(data, function(i, val) {
				var str = '<li class="info_title">'+data[i]['id']+". "+data[i]['question']+'<div class="info_bullet" updown="down"></div></li><li class="info_txt">'+data[i]['answer']+'</li>';
				$(".info_ul2").append(str);
			});
		}
	});

	// 묻고답하기 탭 스크립트
	$(".tab_btn").click(function() {
		$(".info_txt").slideUp();
		$(".info_title").removeClass("info_title_select");
		var sel_tab = $(this).attr("id");
		$(".tab_btn").removeClass("tab_select");
		$(this).addClass("tab_select");
		if(sel_tab == 'tab1') {
			$(".info_ul").hide();
			$(".info_ul1").show();
		} else if(sel_tab == 'tab2') {
			$(".info_ul").hide();
			$(".info_ul2").show();
		}
	});

	// 묻고답하기 아코디언 스크립트
	var up_arrow = 'up_btn';
	var down_arrow = 'down_btn';
	if(w_width <= 720) {
	  up_arrow = 'up_btn_s';
	  down_arrow = 'down_btn_s';
	}
	$(document).on("click",".info_title",function() {
		$(".info_title").removeClass("info_title_select");
		var arrow_img = $(this).children(".info_bullet");
		var updown = $(arrow_img).attr("updown");
		if(updown == 'up') {
			$(this).next().slideUp();
			$(arrow_img).css("background","url(../images/"+down_arrow+".png) 0 0 no-repeat");
			$(arrow_img).attr("updown","down");
		} else if(updown == 'down') {
			$(this).next().slideDown();
			$(arrow_img).css("background","url(../images/"+up_arrow+".png) 0 0 no-repeat");
			$(arrow_img).attr("updown","up");
			$(this).addClass("info_title_select");
		}
	});

	// 입주신청, 입주대기 버튼 클릭 스크립트
	$(document).on("click",".sign, .wait",function() {
		var room_id = $(this).attr("room_id");
		$(".house_name").val(id).prop("selected", true);
		$(".room_name").val(room_id).prop("selected", true);
		$("html, body").animate({ scrollTop: 0 }, 0);
		$(".dt_pop_black").height($(document).height()).show();
	});

	// 팝업 창 성별클릭 스크립트
	$(".pop_sex > .gd_btn").click(function() {
		$(".pop_sex > .gd_btn").removeClass("tab_select");
		$(this).addClass("tab_select");
	});

	//입주신청 x 버튼 클릭 스크립트
	$(".pop_exit").click(function() {
		$(".dt_pop_black").hide();
	});

	// 네비게이션 클릭시 스크립트
	$(".gnb > li").click(function() {

		var con01 = $("#con01").offset();
		var con05 = $("#con05").offset();
		var con06 = $("#con06").offset();
		var con07 = $("#con07").offset();

		var now_href = $(location).attr('href');

		if(now_href.match('main.html')) {
			var target_str = $(this).text();

			switch(target_str) {
				case 'ABOUT' : $("html, body").animate({ scrollTop: (con01.top-r_margin) }, 300);
							  break;
				case '서비스' : $("html, body").animate({ scrollTop: (con05.top-r_margin) }, 300);
							  break;
				case '입주안내' : $("html, body").animate({ scrollTop: (con06.top-r_margin) }, 300);
							  break;
				case '묻고답하기' : $("html, body").animate({ scrollTop: (con07.top-r_margin) }, 300);
								break;
			}
		} else {
			var target_str = $(this).text();

			switch(target_str) {
				case 'ABOUT' : location.href="main.html?target_num=1";
							  break;
				case '서비스' : location.href="main.html?target_num=5";
							  break;
				case '입주안내' : location.href="main.html?target_num=6";
							  break;
				case '묻고답하기' : location.href="main.html?target_num=7";
								break;
			}

		}


	});

	//detail tap 클릭 스크립트
	$(".detail_tap > li").click(function() {
		var con01 = $(".dt_c2_box2").offset();
		var con05 = $(".dt_c2_box3").offset();
		var con06 = $(".dt_c2_box4").offset();
		var con07 = $(".dt_c2_box5").offset();

		$(".detail_tap > li").removeClass("active2");
		$(this).addClass("active2");
		var tar_num = $(this).attr("tar_num");
		switch(tar_num) {
			case '1' : $("html, body").animate({ scrollTop: (con01.top-r_margin) }, 300);
					   break;
			case '2' : $("html, body").animate({ scrollTop: (con05.top-r_margin) }, 300);
					   break;
			case '3' : $("html, body").animate({ scrollTop: (con06.top-r_margin) }, 300);
					   break;
			case '4' : $("html, body").animate({ scrollTop: (con07.top-r_margin) }, 300);
					   break;
		}
	});


	// Mobile Navigation
	$('.mobile-btn').click(function(){
		$('.gnb').toggleClass('act');
		$('.act').slideDown();
		event.preventDefault();
	});



	// sns 버튼 클릭 이벤트
	$(".sns").click(function() {
		var alt = $(this).attr("alt");
		var href = '';
		switch(alt) {
			case 'naver' : href = 'https://blog.naver.com/dgdr_wonfamily';
						   break;
			case 'insta' : href = 'https://www.instagram.com/dgdr_wonfamily';
						   break;
			case 'facebook' : href = 'https://www.facebook.com/dgdr.wonfamily';
							  break;
		}

		window.open(href);
	});

	//입주신청 셀렉트 박스 - house_name 옵션 생성
	$.ajax({
		url:root_url+'/house/simple/',
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
			$.each(data, function(i, val) {
				var str = '<option value='+val.id+'>'+val.house_name+'</option>';
				$(".house_name").append(str);
			});
		}
	});

	//입주신청 셀렉트 박스 - room_name 옵션 생성
	$(".house_name").change(function() {
		add_room_option($(this).val());
		house = $(this).val();
	});

	// room_name 옵션 생성 함수
	function add_room_option(x) {
		$(".room_name").empty();
		$.ajax({
			url:root_url+'/house/'+x+'/',
			type:'GET',
			dataType:'json',
			contentType : "application/json",
			success:function(data){
				$.each(data.rooms, function(i, val) {
					var str = '<option value='+val.id+'>'+val.name+'</option>';
					$(".room_name").append(str);
				});
			}/*
			error:function(request,status,error){
			  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error+"\n url:"+root_url+'/house/'+x);
			}*/
		})
	};

	//입주신청 버튼 클릭시 스크립트
	$("#apply_btn").click(function() {
		$("#dt_from").attr("action",root_url+"/inquiry/tenant/");
		var name = $("#dt_pop_name").val();
		var email = $("#dt_pop_email").val();
		var phone = $("#dt_pop_phone").val();
		var date = $("#dt_pop_w_date").val();
		var pop_cbox = $(".pop_cbox").is(":checked") ;
		var m_date = $("#dt_pop_w_date").val();
		var memo = $("textarea[name=memo]").val();

		var alert_num = '';

		 if(pop_cbox) {
			if( date == '' ) {
				alert_num = '4';
				if(phone == '') {
					alert_num = '3';
					if(email == '') {
						alert_num = '2';
						if(name == '') {
							alert_num = '1';
						}
					}
				}
			}
		} else {
			alert_num = '5';
		};

		$("input[name='sex']").val($(".pop_sex > .tab_select").attr("sex"));

		switch(alert_num) {
			case '1' : alert("이름을 입력 해 주세요.");
					   return;
					  break;
			case '2' : alert("이메일을 입력 해 주세요.");
					   return;
					  break;
			case '3' : alert("연락처를 입력 해 주세요.");
					   return;
					  break;
			case '4' : alert("희망 입주일을 입력 해 주세요.");
					   return;
					  break;
			case '5' : alert("개인 정보 수집에 동의해주세요.");
					   return;
					  break;
		}

		var conf_r = confirm("입주 신청 하시겠습니까?");
		if(conf_r) {
			/*$("#dt_from").submit();*/

			var data_str = '{"name": "'+name+'","sex": "'+$(".pop_sex > .tab_select").attr("sex")+'","phone_number": "'+phone+'","email": "'+email+'","house": '+house+',"room": '+$("select[name=room]").val()+',"moving_date": "'+m_date+'","memo": "'+memo+'"}';
			//alert(data_str);
			$.ajax({
				url:root_url+"/inquiry/tenant/",
				type:'POST',
				data:data_str,
				dataType:'json',
				contentType : "application/json",

				success:function(data){
					alert("신청 완료 되었습니다.");
					$(".dt_pop_black").hide();
					class_popup();
				},
				error:function(request,status,error){
				  //alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				  alert("신청이 미접수되었습니다.");
			    }


			});
		}



	});

	// 팝업 초기화 함수
	function class_popup() {
		$("#dt_pop_name").val("");
		$("#dt_pop_email").val("");
		$("#dt_pop_phone").val("");
		$("#dt_pop_w_date").val("");
		$("#dt_pop_w_date").val("");
		$("textarea[name=memo]").val("");
		$(".gd_btn").removeClass("tab_select");
		$(".gd_btn[sex=woman]").addClass("tab_select");
		$(".pop_cbox").prop('checked', false) ;
	}


	//모바일 햄버거 닫기 스크립트
	$(document).on("click",function(e) {
	  if($(e.target).parents(".container_01").size() == 0) {
		  $(".act").slideUp();
	  }
	});
	$(window).scroll(function(){
	  $(".act").slideUp();
	});
