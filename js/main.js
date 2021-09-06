(function() {
    var winH = 0; // 창높이
    var sc = 0; // scrollTop

    // swiper객체에 height()메서드 사용불가하므로 래퍼에서 높이 가변처리
    var mainSliderWrap = $('.main_slider_wrap');

     // 메인슬라이더 높이 조절
     $(window).resize(function() {
        winH = $(this).height();
        mainSliderWrap.height(winH - 55);
    }).trigger('resize');

    // 클릭시만 선택이되므로 변수에 담을필요없음
    // gnb 열기
    $('#header .btn_open').on('click', function(e) {
        e.preventDefault();

        $('#header .dimm').show();
        $('#header .gnb_box').addClass('open');
        $('#header .btn_close').fadeIn();
        $('body').addClass('hidden');

        // 통합검색이 열려있으면 닫기
        if($('#header .search_box').hasClass('open')) {
            $('#header .btn_search_toggle').removeClass('on');
            $('#header .search_box').removeClass('open');
            header.removeClass('scroll');
        };
        
    });

    // gnb 닫기
    $('#header .btn_close, #header .dimm').on('click', function() {
        $('#header .dimm').fadeOut();
        $('#header .gnb_box').removeClass('open');
        $('#header .btn_close').fadeOut();
        $('body').removeClass('hidden');
    });

    // gnb 아코디언
    $('.gnb .depth1>li>a').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('active').parent().siblings().find('>a').removeClass('active');

        $(this).next().stop().slideToggle().parent().siblings().find('.depth2').hide();
    });

    
    // header 스타일변경
    var header = $('#header');
    var bgFix = $('.bg_fix');
    var btnTop = $('#footer .btn_top');
    var subFix = $('.sub_fix');
    var docH = 0; // 문서높이

   
    $(window).scroll(function() {
        docH = $(document).height();
        sc = $(this).scrollTop();

        // 메인페이지에서만실행
        if(!header.hasClass('sub_header')) {
            if(sc > 0) {
                header.addClass('scroll');
                
            } else {
                header.removeClass('scroll');
            }
        }


        // ios에서 상단 바운스 스크롤시 fixed 배경이 보이므로 scrollTop판단하여 대응
        // docH - 150 위에 픽스 이미지 가려지지 않게 조정
        // ios에서 문서 상단일경우 sc가 300미만일경우 bgFix 감추기
        // 바운스스크롤을 빠르게 할경우가 있으므로 좀더 미리 감춰줌
        // 문서아래까지 스크롤 판단 (sc + 창높이(=스크롤바높이) === 문서높이)
        if(sc < 300 || sc + $(window).height() > (docH - 150)) {
            bgFix.hide();
            $('.introduce_container').offset();
        } else {
            bgFix.show();
        }
        
        
        // 문서의 가장 아래까지 스크롤했는지 판단
        // if(sc + $(window).height() === docH) {
        //     console.log('문서 아래까지 스크롤함');
        // }

        // $(window).height() 스크롤바의 높이
        // console.log(sc + $(window).height(), docH);



        // 탑버튼, 서브 상단 fixed
        if(sc >= 50) {
            btnTop.fadeIn(300);
            subFix.addClass('fixed');
        } else {
            btnTop.fadeOut(300);
            subFix.removeClass('fixed');
        }


    }).trigger('scroll');


    // 이벤트 안에 이벤트를 넣으면 안됨(중첩x)
    btnTop.on('click', function(e) {
        e.preventDefault();

        $('html, body').animate({ scrollTop:0 },1000);
    });




    // 통합검색 토글
    $('#header .btn_search_toggle').on('click', function() {
        $(this).toggleClass('on');
        $('#header .search_box').toggleClass('open');
        $('body').toggleClass('hidden');

        // scroll이벤트가 걸리면서 removeClass가 걸리므로
        // 지연시간을 주어 addClass해줌
        setTimeout(function() {
            header.toggleClass('scroll');
        },0);
    });


    // 메인 배너 슬라이더
    var mainSlider = new Swiper('.main_slider', {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });


    // 메인 life text
    //  제이쿼리객체 각각에 안쪽내용을 반복실행해줌
    // i는 인덱스(=요소의객체순서 0과 1), v는 제이쿼리객체
    init();

    function init() {
        lifeSliderInit();
        searchTotal();
    }

    function lifeSliderInit() {
        // 두번째 lifeSilder에 이미지주소를 배열로 생성하여 동적으로 페이지네이션 추가
        var imgUrl = [];
        imgUrl.push('images/thumb02.jpg');
        imgUrl.push('images/thumb03.jpg');
        imgUrl.push('images/thumb04.jpg');
        imgUrl.push('images/thumb04.jpg');
        imgUrl.push('images/thumb04.jpg');
        imgUrl.push('images/thumb04.jpg');

        // 첫번째 lifeSlider에 슬라이드의 갯수에서 원본배열 갯수를 뺀만큼 
        // src값을 만들어 배열에 채워서 오류방지
        var result = $('.life_slider1 .swiper-slide').length - imgUrl.length;
    
        for(var i=0; i<result; i++) {
            imgUrl.push(imgUrl[0]);
        }
        // console.log(imgUrl);
    
        // 첫번째 life_slider 슬라이더 갯수 추출
        // console.log($('.life_slider1 .swiper-slide').length);
    
        $('.main_life').each(function (i) {
            // $(this)로 각 main)_life를 따로 선택하여 텍스트 숨김
            $(this).find('.life_txt:gt(0)').hide();
    
            // swiper 메서드 내부에서 각 main_life를 가르키기 위한 변수
            var _this = $(this); // main_life 제이쿼리객체
    
            // main_life안쪽 슬라이더를 각각 변수로 선언하여 swiper객체 두개 생성
            var sliderEl = $(this).find('.life_slider');
            // console.log(_this, sliderEl);
    
    
            // 신메뉴 슬라이더와 각각 텍스트 부분 처리 해줘야 함
            // 메인 life 슬라이더
            var lifeSlider = new Swiper(sliderEl, {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    // 페이지네이션 밖으로 빼고 적어줘야함
                    el: '.main_life .swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                    // pagination은 span이 동적생성, renderBullet 메서드 이용 
                    renderBullet: function (index, className) {
                        // 스판이 동그란모양
                        return '<span class="' + className + '">' + '<img src="' + imgUrl[index] + '" alt=""></span>';
                    }
                }, 
                on: {
                    slideChange: function () {
                        // active슬라이드의 인덱스
                        // loop 아닐경우 activeIndex, loop일 경우 realIndex
                        // swiper객체 안쪽 메서드에서 this, $(this)는 swiper객체를 가르킴
    
                        // 각 life txt를 찾아야 하기 때문에 $this를 변수에 넣어씀
                        _this.find('.life_txt').eq(this.activeIndex).show().siblings().hide();
                        // $('.life_txt_box .life_txt').eq(lifeSlider.activeIndex).show().siblings().hide();
                    },
                }
            });
    
        });
    }


    // $('.life_txt_box .life_txt:gt(0)').hide();
    
    
    // story 슬라이더
    var storySlider = new Swiper('.story_slider', {
        centeredSlides: true,
        loop: true,
        spaceBetween: 15, // 간격
        // css로 크기지정할경우
        // 인라인 스타일이 지워져 이미지크기를 줄 수 있다
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
          },
    });

    
    // footer 패밀리사이트 링크
    // 모바일에서 새창띄울경우 팝업설정에 의해 안열릴 수 있으므로
    // 주소만 이동 
    // select option이 변경될때 발생
    $('#footer select').on('change', function() {
        console.log($(this).val());
        // location.href는 속성임
        // 되돌아와서 value값이 빈값인 경우 새로고침됨
        // 간단하게 표현할때 if($(this).val() !== '') 생략 가능 
        if($(this).val()) {
            location.href = $(this).val();
        }
    });


    function searchTotal() {
        // 통합검색
        var incSchKey = $('#inc_schKey');
        incSchKey.val('마늘');

        $('.search_box .btn_remove').on('click', function() {
            // input value 없애고 포커스이동
            incSchKey.val('').focus();
        });

        $('#inc_brdCd').on('change', function() {
           
            switch($(this).val()) {
               case '':
                    incSchKey.val('마늘');
                   break;

               case 'BF101':
                    incSchKey.val('6쪽마늘닭죽');
                   break;

               case 'BF102':
                    incSchKey.val('매콤불차돌비빔밥');
                   break;

               case 'BF104':
                    incSchKey.val('광양식바싹불고기 반상');
                   break;

               case 'BF105':
                    incSchKey.val('양지시래기해장설렁탕');
                   break;
           
               default:
                    incSchKey.val('마늘');
                   break;
           }
        });
    }

    
    // lnb 리스트
    $('.lnb .btn_lnb').on('click', function() {
        $('.lnb .list_lnb').slideToggle();
        $(this).toggleClass('on');
    });

    var subTab = $('.sub_tab');
    /* 서브페이지 진입시 sub_tap 안쪽 active 클래스의 좌우 위치값을 판단하여 좌우스크롤(scroll left) 애니메이트 안에서만 작동함 css는 없다  */
    // sub_tap 스크롤, sub_tab이 있을때만 실행
    // 메인에서 찾을 수 없다고 나오기 때문에 이프 렝스에 묶어준다
    // 메인에서 랭스가 0 이기때문에 실행이 안되고 서브에서는 1이므로 실행이된다
    if(subTab.length) {
        // 좌측 padding값 만큼 덜이동
        var posX = subTab.find('.active').offset().left - 15;

        subTab.animate({scrollLeft:posX},0)
    }



    // txt 스크롤시 올라오면서 보임
    // 해당요소의 위치를 배열에 넣어서 해야함
    // 회사소개 스크롤 애니메이션
    scrollAni();

    function scrollAni() {
        var posArr = []; // 리스트위치
        // 회사소개 컨텐츠 리스트
        var introduceList = $('.introduce_container .introduce li');
    
        $(window).resize(function() {
            // 제이퀄 반복문은 each사용 인덱스 첨자 사용하기
            // 창크기에 따라 요소 높이가 변하므로 리사이즈마다 위치값 갱신, push 메서드 계속 쌓이기때문에 사용불가
            introduceList.each(function(i) {
                // 290을 빼서 좀더 addClass를 빨리 검어줌
                posArr[i] = $(this).offset().top - 290;
            });
        }).trigger('resize'); //리사이즈 할때마다 요소의 위치값이 변경
    
        $(window).scroll(function() {
            // sc가 각 요소위치 사이에 갔을때 addClass
            
            if(sc >= 100 && sc < posArr[1]) {
                introduceList.eq(0).addClass('on');
            } else if(sc >= posArr[1] && sc < posArr[2]) {
                introduceList.eq(1).addClass('on');
            } else if(sc >= posArr[2]) {
                introduceList.eq(2).addClass('on');
            }
            // console.log(sc, '==> 스크롤탑');
            // console.log(posArr, '==> 요소위치');
        }).trigger('scroll');
    };
})();
