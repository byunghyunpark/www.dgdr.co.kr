	var root_url = 'https://api.dgdr.co.kr';

	var w_width = $(window).width();
	var now_href = $(location).attr('href');

	var banner_h = $("#top_banner").height();					/* top-banner 높이 */
	var contents_m = $(".contents_wrap").css("margin-top");		/* top-contents 의 margin-top 값 */
	var c_margin = contents_m.substr( 0, contents_m.length-2 );	/* top-contents 의 margin-top 값 px 제거 */
	var r_margin = c_margin;									/* 실제 적용될 margin-top 값 */



	// logo 클릭 스크립트
	$(".logo_header").click(function() {
	//   location.href="http://d320kovphry0y7.cloudfront.net/";
		location.href = "main.html";
	});


	// 지점 좌표 스크립트
	var features = '[';
	$.ajax({
		url:root_url+'/house/?is_immediately=true&is_main=true',
		async: false,
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
			console.log('data', data);
			$.each(data, function(i, val) {

				features = features + "{ position: new google.maps.LatLng("+data[i]['position']+"), type: 'dgdr_f', link_id:'"+data[i]['id']+"' },";
				// console.log(features);

			});

			//alert(features);
		}
	});
	$.ajax({
		url: root_url +'/house/?is_immediately=false&is_main=true',
		async: false,
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
			console.log('data', data);
			$.each(data, function(i, val) {

				features = features + "{ position: new google.maps.LatLng("+data[i]['position']+"), type: 'dgdr', link_id:'"+data[i]['id']+"' },";

			});

			features = features.substr( 0, features.length-1 );
			features = features + "]";
			//alert(features);
			console.log('features!!!', features)
		}
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



	// 빠른 입주 가능 스크립트
	$.ajax({
		url:root_url+'/house/?is_main=true',
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){

			$.each(data, function(i, val) {

				var search_tag = data[i]['search_tag'][0];
				var gender = '';
				var status = data[i]['status'];
				var open_st = '';
				var li_class = '';
				var back_img = '';
				var ready_str = '';
				var href_str = '';

				if(search_tag == '여성전용') {
					gender = 'con03_woman';
				} else if(search_tag == '남성전용') {
					gender = 'con03_man';
				}

				if(status == 'open') {
					open_st = 'txt_right';
					li_class = 'con03_content';
					back_img = data[i]['main_photo'];
					href_str = "detail.html?id="+data[i]['id'];
				} else {
					open_st = 'txt_right txt_right_no';
					li_class = 'con03_content_no';
					back_img = '/images/close.png';
					ready_str = "<p>"+data[i]['opened_date_char']+"</p>";
					href_str = "#";
				}



				var str = '<li class="'+li_class+'"><a href="'+href_str+'"><div class="con03_img" style="background:url('+back_img+') 0 0 no-repeat; background-size:cover;">'+ready_str+'<div class="caption">'+data[i]['house_name']+'</div></div><div class="con03_txtwrap clearfix"><div class="txt_left"><h4>'+data[i]['main_title']+'</h4><ul class="clearfix"><li class="'+gender+'">'+search_tag+'</li><li>'+data[i]['search_tag'][1]+'</li><li>'+data[i]['search_tag'][2]+'</li><li>'+data[i]['search_tag'][3]+'</li></ul></div><div class="'+open_st+'"><h4>입주문의</h4><p>총인원 '+data[i]['capacity_count']+'</p></div></div></a></li>';

				$(".slider1").append(str);

			});


			// bsSlider
			$('.slider1').bxSlider({
				slideWidth: 427,
				minSlides: 1,
				maxSlides: 3,
				moveSlides: 1,
				slideMargin: 15
			  });


		}
	});


	// 구글맵 스크립트
	function initMap() {
		console.log('map start');
		var z = 12;
		if(w_width <= 720) {
			z = 11;
		}

		map = new google.maps.Map(document.getElementById('map'), {
		  center: new google.maps.LatLng(37.5509993, 126.98806349999996),
		  zoom: z,
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


		var iconBase = '../images/';

		var icons = {
		  dgdr: {
			icon: iconBase + 'map_icon01.png'
		  },
		  dgdr_f: {
			icon: iconBase + 'map_icon02.png'
		  }
		};

		if(w_width <= 720) {
			var icons = {
			  dgdr: {
				icon: iconBase + 'map_icon01_s.png'
			  },
			  dgdr_f: {
				icon: iconBase + 'map_icon02_s.png'
			  }
			};

		}



		function addMarker(feature) {
		  var marker = new google.maps.Marker({
			position: feature.position,
			icon: icons[feature.type].icon,
			optimized: false,
			zIndex: 99999999,
			link_id: feature.link_id,
			map: map
		  });
		  
		  marker.addListener('click', function() {
			// location.href="http://d320kovphry0y7.cloudfront.net/html/detail.html?id="+marker.link_id;
			location.href = "detail.html?id=" + marker.link_id;
	      });
		}

		features = eval("("+features+")");
		console.log('111', features);
		features.reverse()
		console.log('222', features);

		for (var i = 0, feature; feature = features[i]; i++) {
			// console.log('feature', feature);
          addMarker(feature);
        }



	}


	// 동거동락 소식 스크립트
	$.ajax({
		url:root_url+'/main/news/',
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
			$.each(data, function(i, val) {
				var str = '<li class="con04_content" ><a href="'+data[i]['link_url']+'" target="_blank"><div class="con04_img detail" style="background:url('+data[i]['photo']+') 0 0 no-repeat; background-size:cover;"></div><div class="con04_txt"><h3>'+data[i]['title']+'</h3><p>'+data[i]['context']+'</p></div></a></li>';

				$(".slider2").append(str);

			});


			$('.slider2').bxSlider({
				slideWidth: 427,
				minSlides: 1,
				maxSlides: 3,
				moveSlides: 1,
				slideMargin: 15
			  });

		}
	});

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


	// 네비게이션 클릭시 스크립트
	$(".gnb > li").click(function() {

		if(w_width <= 720) {
			$(".gnb").slideUp().removeClass('act');
		}

		var con01 = $("#con01").offset();
		var con05 = $("#con05").offset();
		var con06 = $("#con06").offset();
		var con07 = $("#con07").offset();

		var now_href = $(location).attr('href');

		if(now_href.match('main.html')) {
			var target_str = $(this).text();

			switch(target_str) {
				case 'ABOUT' : $("html, body").animate({ scrollTop: (con01.top-r_margin) }, 1000);
							  break;
				case '서비스' : $("html, body").animate({ scrollTop: (con05.top-r_margin) }, 1000);
							  break;
				case '입주안내' : $("html, body").animate({ scrollTop: (con06.top-r_margin) }, 1000);
							  break;
				case '묻고답하기' : $("html, body").animate({ scrollTop: (con07.top-r_margin) }, 1000);
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

	// 다른페이지에서 네비 클릭시

		var con01_top = 122
		var con05_top = 2950
		var con06_top = 3370
		var con07_top = 4220

		if(w_width <= 720) {
			con01_top = 72
			con05_top = 1507
			con06_top = 1858
			con07_top = 2223
		}

	
	
	if(now_href.match('main.html')) {
	  if(target_num != '') {

		switch(target_num) {
			case '1' : $("html, body").animate({ scrollTop: (con01_top-r_margin) }, 1000);
						  break;
			case '5' : $("html, body").animate({ scrollTop: (con05_top-r_margin) }, 1000);
						  break;
			case '6' : $("html, body").animate({ scrollTop: (con06_top-r_margin) }, 1000);
						  break;
			case '7' : $("html, body").animate({ scrollTop: (con07_top-r_margin) }, 1000);
						  break;
		}
	  }
	}



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
	$('.mobile-btn').click(function(){
		$('.gnb').addClass('act');
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


	//문의하기 버튼 클릭시 스크립트
	$("#qu_btn").click(function() {
		$("#ld_form").attr("action",root_url+"/inquiry/partner/");
		var name = $("#ld_pop_name").val();
		var phone = $("#ld_pop_phone").val();
		var addr = $("#ld_pop_addr").val();
		var pop_cbox = $(".pop_cbox").is(":checked") ;
		var alert_num = '';


		 if(pop_cbox) {
			if( addr == '' ) {
				alert_num = '4';
				if(phone == '') {
					alert_num = '3';
					if(name == '') {
						alert_num = '1';

					}
				}
			};
		} else {
			alert_num = '5';
		};

		switch(alert_num) {
			case '1' : alert("이름을 입력 해 주세요.");
					   return;
					  break;
			case '3' : alert("연락처를 입력 해 주세요.");
					   return;
					  break;
			case '4' : alert("주소를 입력 해 주세요.");
					   return;
					  break;
			case '5' : alert("개인 정보 수집에 동의해주세요.");
					   return;
					  break;
		}

		var conf_r = confirm("문의 하시겠습니까?");
		if(conf_r) {
			/*$("#ld_form").submit();*/

			var data_str = '{ "name": "'+name+'", "phone_number": "'+phone+'", "email": null, "address": "'+addr+'", "memo": null, "inquiry_route": null }';

			$.ajax({
				url:root_url+'/inquiry/partner/',
				type:'POST',
				data:data_str,
				dataType:'json',
				contentType : "application/json",

				success:function(data){
					alert("문의 완료 되었습니다.");
					$(".land_pop_black").hide();
					class_popup();
					window.location.href = "contract.html";
				},
				error:function(request,status,error){
				  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			    }

			});

		}
	});

	// 팝업 초기화 함수
	function class_popup() {
		$("#ld_pop_name").val("");
		$("#ld_pop_phone").val("");
		$("#ld_pop_addr").val("");
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

	//임대관리 문의하기 버튼 클릭시 스크립트
	$("#management_btn").click(function() {
		$("#ld_form").attr("action",root_url+"/inquiry/management/");
		var name = $("#ld_pop_name").val();
		var phone = $("#ld_pop_phone").val();
		var addr = $("#ld_pop_addr").val();
		var pop_cbox = $(".pop_cbox").is(":checked") ;
		var alert_num = '';

		 if(pop_cbox) {
			if( addr == '' ) {
				alert_num = '4';
				if(phone == '') {
					alert_num = '3';
					if(name == '') {
						alert_num = '1';

					}
				}
			};
		} else {
			alert_num = '5';
		};

		switch(alert_num) {
			case '1' : alert("이름을 입력 해 주세요.");
					   return;
					  break;
			case '3' : alert("연락처를 입력 해 주세요.");
					   return;
					  break;
			case '4' : alert("주소를 입력 해 주세요.");
					   return;
					  break;
			case '5' : alert("개인 정보 수집에 동의해주세요.");
					   return;
					  break;
		}

		var conf_r = confirm("문의 하시겠습니까?");
		if(conf_r) {
			/*$("#ld_form").submit();*/

			var data_str = '{ "name": "'+name+'", "phone_number": "'+phone+'", "email": null, "address": "'+addr+'", "memo": null, "inquiry_route": null }';

			$.ajax({
				url:root_url+'/inquiry/management/',
				type:'POST',
				data:data_str,
				dataType:'json',
				contentType : "application/json",

				success:function(data){
					alert("문의 완료 되었습니다.");
					$(".land_pop_black").hide();
					class_popup();
					window.location.href = "contract.html";
				},
				error:function(request,status,error){
				  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			    }
			});

		}
	});
