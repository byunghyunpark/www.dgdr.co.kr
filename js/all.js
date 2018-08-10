	var root_url = 'https://api.dgdr.co.kr';

	var w_width = $(window).width();

	var banner_h = $("#top_banner").height();					/* top-banner 높이 */
	var contents_m = $(".contents_wrap").css("margin-top");		/* top-contents 의 margin-top 값 */
	var c_margin = contents_m.substr( 0, contents_m.length-2 );	/* top-contents 의 margin-top 값 px 제거 */
	var r_margin = c_margin;									/* 실제 적용될 margin-top 값 */

	// logo 클릭 스크립트
	$(".logo_header").click(function() {
	  location.href="../index.html";
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
	var _tempUrl = window.location.search.substring(1); //url에서 처음부터 '?'까지 삭제 
	var _tempArray = _tempUrl.split('&'); // '&'을 기준으로 분리하기 
	
	// 지점 목록 스크립트
	// console.log("??", f_str)
	// if (f_str == undefined){
	// 	f_str = ''
	// }
	// console.log("???")
	// console.log(root_url+'/house/?city='+f_str);
	var result_url = ''
	// console.log('f_str???', f_str);
	if (f_str == 0 && p_str == 0) {
		result_url = root_url + '/house/';
		// console.log(000000);
	} else if (f_str != 0) {
		result_url = root_url + '/house/?city=' + f_str;
		// console.log(111111);
	} else if (p_str !=0 ) {
		result_url = root_url + '/house/?province=' + p_str;
		// console.log(222222, p_str);
	}
	
	$.ajax({
		url:result_url,
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
			// console.log('p_str???????????', p_str);
			if(f_str != '' || p_str != '') {
              if(p_str != '') {
				// console.log(data[0]);
				$(".search_name").text(data[0].province);
			  } else {
				// console.log(data[0]);
				$(".search_name").text(data[0].city);
			  }
			} else {
				$(".search_name").text('전국 전체');
			}

			$.each(data, function(i, val) {

				var search_tag = data[i]['search_tag'][0];
				var gender = '';
				var status = data[i]['status'];
				var open_st = '';
				var li_class = '';
				var back_img = '';
				var ready_str = '';
				var href_str = '';
				var href_str_e = '';

				if(search_tag == '여성전용') {
					gender = 'con03_woman';
				} else if(search_tag == '남성전용') {
					gender = 'con03_man';
				}

				if(status == 'open') {
					open_st = 'txt_right';
					li_class = 'con03_content';
					back_img = data[i]['main_photo'];
					href_str = "<a href=detail.html?id="+data[i]['id']+">";
					href_str_e = '</a>';
				} else {
					open_st = 'txt_right txt_right_no';
					li_class = 'con03_content_no';
					back_img = '../images/close.png';
					ready_str = "<p>"+data[i]['opened_date_char']+"</p>";
				}



				var str = '<li class="'+li_class+'">'+href_str+'<div class="con03_img" style="background:url('+back_img+') 0 0 no-repeat; background-size:cover;">'+ready_str+'<div class="caption">'+data[i]['house_name']+'</div></div><div class="con03_txtwrap clearfix"><div class="txt_left"><h4>'+data[i]['main_title']+'</h4><ul class="clearfix"><li class="'+gender+'">'+search_tag+'</li><li>'+data[i]['search_tag'][1]+'</li><li>'+data[i]['search_tag'][2]+'</li><li>'+data[i]['search_tag'][3]+'</li></ul></div><div class="'+open_st+'"><h4>입주문의</h4><p>총인원 '+data[i]['capacity_count']+'</p></div></div>'+href_str_e+'</li>';

				$(".all_list").append(str);

			});


		}
	});

	//지점 필터 클릭 이벤트
	$(".search_btn").click(function() {
	  $(".area_wrap").slideToggle();
	});

	//지점필터 닫기 스크립트
	$(document).on("click",function(e) {
	  if($(e.target).parents(".search_area").size() == 0) {
		  $(".area_wrap").slideUp();
	  }
	});

	//지점 필터 목록 스크립트
	$.ajax({
		url:root_url+'/region/',
		type:'GET',
		dataType:'json',
		contentType : "application/json",
		success:function(data){

			$.each(data, function(i, val) { 
			  var str = '<li class="region_li" region_id="'+data[i]['id']+'">'+data[i]['name']+'</li>';

			  var str3 = '<ul class="area_ul2 area_ul2_'+data[i]['id']+'"><li f_str="?province='+data[i]['id']+'">지역전체</li>';
			//   console.log('str3', str3, data[i]['id']);
			  $.each(data[i]['cities'], function(i2, val2) {
				str3 = str3 + '<li cities_id="'+val2.id+'" f_str="?city='+val2.id+'">'+val2.name+'</li>';
				// console.log('str3', str3, val2.id);
			  });
			  str3 = str3 + '</ul>';

			  $(".area_wrap").append(str3);
			  $(".area_ul1").append(str);
			});

		}
	});

	//지점 필터 클릭 스크립트
	$(document).on("click",".area_ul2 > li",function() {
		// location.href = "http://d320kovphry0y7.cloudfront.net/html/all.html?f_str=" + $(this).attr("f_str"); 
		location.href = "all.html" + $(this).attr("f_str");
		// console.log(location.href, '$(this).attr("f_str")=', $(this).attr("f_str"))
	});


    //지점필터 mouseenter 스크립트
	$(document).on("mouseenter",".region_li",function() {
		$(".area_ul2").hide();
		var region_id = $(this).attr("region_id");
		$(".area_ul2_"+region_id).show();
	});


	// 네비게이션 클릭시 스크립트

	$(".gnb > li").click(function() {

		var con01 = $("#con01").offset();
		var con05 = $("#con05").offset();
		var con06 = $("#con06").offset();
		var con07 = $("#con07").offset();

		var now_href = $(location).attr('href');

		if(now_href.match('../index.html')) {
			var target_str = $(this).text();
			
			console.log('1')
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
			console.log('-1', target_str, target_str.length);
			switch(target_str) {
				case 'ABOUT' : location.href="../index.html?target_num=1";
							  break;
				case '서비스' : location.href="../index.html?target_num=5";
							  break;
				case '입주안내' : location.href="../index.html?target_num=6";
							  break;
				case '묻고답하기' : location.href="../index.html?target_num=7";
								break;
			}

		}


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

	//모바일 햄버거 닫기 스크립트
	$(document).on("click",function(e) {
	  if($(e.target).parents(".container_01").size() == 0) {
		  $(".act").slideUp();
	  }
	});
	$(window).scroll(function(){
	  $(".act").slideUp();
	});
