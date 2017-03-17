/**
 * Created by lx on 2017/1/16.
 */
$(function(){
    $.each(banners,function(i){
        var html = '<a href="javascript:void(0)"><img src="images/banner/' + banners[i].imgUrl + '" /></a>';
        var $li = '<li>' + i + '</li>';
        $(".banner span").append(html);
        $("#bannerBtn").append($li);
    });
    var bannerHtml = $(".banner span a").clone();
    $(".banner span").append(bannerHtml);
    var width = $(".banner").width();
    var len = banners.length;
    var currLeft = width * len;
    $(".banner span").width(currLeft * 2);
    $(".banner span a").width(width);
    $("#bannerBtn li:eq(0)").css("opacity",1);
    $(".banner span").css("margin-left",-currLeft);
    var num = 0;
    var timer;

    $(".banner_prev").click(function(){
        num--;
        if(num < 0){
            num = len-1;
        }
        $('#bannerBtn li').eq(num).animate({
            opacity : 1
        },600,'linear',function(){
            $('#bannerBtn li').eq(num).siblings().css("opacity", 0.2);
        });
        $(".banner span").stop(true,false).animate({
            marginLeft : -currLeft + width,
        },600,'linear',function(){
            var last = $(".banner span a").last();
            $(".banner span").prepend(last);
            $(".banner span").css("margin-left",-currLeft);
        });
    });

    $(".banner_next").click(function(){
        num++;
        if(num > len-1){
            num = 0;
        }
        $('#bannerBtn li').eq(num).animate({
            opacity : 1
        },600,'linear',function(){
            $('#bannerBtn li').eq(num).siblings().css("opacity", 0.2);
        });

        $(".banner span").stop(true,false).animate({
            marginLeft : -currLeft - width
        },600,'linear',function(){
            var first = $(".banner span a").first();
            $(".banner span").append(first);
            $(".banner span").css("margin-left",-currLeft);
        });
    });

    timer = setInterval(function(){
        $(".banner_next").click();
    },1000);


    $(".banner").on("mouseover",function(){
        clearInterval(timer);
    });
    $(".banner").on("mouseout",function(){
        timer = setInterval(function(){
            $(".banner_next").click();
        },1000);
    });
















})