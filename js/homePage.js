$(function(){
	$.get("data/homePage.json",function(data){
		var html = "";
		$.each(data, function(i) {
			html += '<span id="' + data[i].id + '"><img src="' 
					 + data[i].url + '" title="' + data[i].news + '" alt="" /></span>';
			$("#main").append(html);
		});
		$("#main").html(html);
	},"json");
	
	
	$("footer a").on("click",function(){
        //加载页面显示
        //$(".loading").show();
        $(this).children("span").addClass("curr").parent().siblings().children("span").removeClass("curr");
        var url = $(this).attr("data");
        
        $("#all").load(url,function (){
            //加载页面隐藏
            //$(".loading").hide();
            
//				
//			var html;
//			
//			
//			$("#whole").on("click",".content span",function(){
//				$(".sections").addClass("sections_left");
//				html = '<span class="books">' + $(this).html() + '</span>';
//			});
//          
//			
//			$("#bottom a").click(function(){
//				$(".sections").removeClass("sections_left");
//				$("footer a").eq(0).trigger("click");
//				$("#whole .contents").prepend(html);
//				console.log($(".contents").html())
//				util.storageSetter("con",$(".contents").html());
//			})
        });
        
        
        
    });
    $("footer a:eq(0)").trigger("click");

});


