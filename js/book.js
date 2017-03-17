$(function(){
	var util = (function(){
        var prefix = 'html5_reader_'
        var storageGetter = function(key){
            return localStorage.getItem(prefix + key);
        }
        var storageSetter = function(key,val){
            return localStorage.setItem(prefix + key,val)
        };
        return {
            storageGetter : storageGetter,
            storageSetter : storageSetter
        }
    })();
	
	$.get("data/homePage.json",function(data){
			
		//判断是否有本地数据
		var initCon = util.storageGetter("con");
	    if(!initCon){
	        initCon = '<span class="add_page" id="addPage"></span>';
	    }
	    
		$(".contents").html(initCon);
//		debugger
		
		
		//页面里面的添加书籍
		$("#addPage").click(function(){
			$(".section").addClass("section_left");
		});
		var html;
		var id;
		
		//添加页面中书籍的点击
		$("#main span").click(function(){
			$(".section").removeClass("section_left");
			$(".sections").addClass("sections_left");
			 id = $(this).prop("id");
			$.each(data,function(i){
				if(id == data[i].id){
					$("#prompt").html(data[i].info);
					$(".sections h2").html(data[i].title);
				}
			});
		
			html = '<span class="books" id="' + id + '">' + $(this).html() + '<input type="checkbox" name="checkbox" /></span>';
		});
		
		//搜索
		$("#search span").click(function(){
			$(".section").addClass("section_left");
		});
		
		//页面中书籍的点击
		$("#whole").on("click",".books",function(){
			if($(this).children("input").css("display") == "none"){
				window.open("reader.html","_self");
			}else{
//				$(this).remove();
//				util.storageSetter("con",$(".contents").html());
//				if($(".books").length == 0){
//					$("header i").text("编辑");
//				}
				if($(this).children("input").prop("checked")){
					$(this).children("input").prop("checked",false);
					$(".edit_main_head i").text((Number($(".edit_main_head i").text())-1));
				}else{
					$(this).children("input").prop("checked",true);
					$(".edit_main_head i").text((Number($(".edit_main_head i").text())+1));
				}
				
			}
			
		});
		
        //头部添加页面
		$("header em").click(function(){
			$(".section").addClass("section_left");
		});
		
		//编辑
		$("header i").click(function(){
			$(".edit_main_head").addClass("edit_main_curr");
			$(".edit_main_foot").addClass("edit_main_curr");
			$(".books input").show();
			$(".add_page").hide();
		});
		
		$(".edit_main_head em").click(function(){
			$(".edit_main_head").removeClass("edit_main_curr");
			$(".edit_main_foot").removeClass("edit_main_curr");
			$(".books input").prop("checked",false).hide();
			$(".edit_main_head i").text(0)
			$(".add_page").show();
		});
		
		$(".edit_main_head dfn").click(function(){
			if($(this).text() == "全选"){
				$(".books input").each(function(){
					if($(this).prop("checked") == false){
						$(this).prop("checked",true);
					}
				});
				$(this).text("全不选");
			}else{
				$(".books input").each(function(){
					if($(this).prop("checked")){
						$(this).prop("checked",false);
					}
				});
				$(this).text("全选");
			}
		});
		
		$(".edit_main_foot").click(function(){
			$(".books").each(function(){
				if($(this).children("input").prop("checked")){
					$(this).remove();
				}
			});
			$(".edit_main_head i").text(0);
			util.storageSetter("con",$(".contents").html());
			$(".edit_main_head em").click();
		});
		
		$(".books").on("click","input",function(e){
			e.stopPropagation();
			if($(this).prop("checked")){
				$(".edit_main_head i").text((Number($(".edit_main_head i").text())+1));
			}else{
				$(".edit_main_head i").text((Number($(".edit_main_head i").text())-1));
			}
		})
		
		//添加按钮
		$("#bottom a").click(function(){
			var flag = true;
			$(".books").each(function(){
				if($(this).prop("id") === id){
					confirmBox("该书已在您的书架中，是否去书架查看");
					flag = false;
					return false;
				}
			});
			if(flag){
				confirmBox("该书已加入您的书架中，是否去书架查看");
				$("#whole .contents").prepend(html);
				util.storageSetter("con",$(".contents").html());
			}
		});
		
		//取消按钮
		$("#bottom span").click(function(){
			$(".sections").removeClass("sections_left");
			$(".section").addClass("section_left");
		});
		
		$(".head em").click(function(){
			$(".section").removeClass("section_left");
		});
	},"json");
});

function confirmBox(txt){
	popTipShow.confirm('弹窗标题',txt,['确 定','取 消'],
		function(e){
		  //callback 处理按钮事件
		  var button = $(e.target).attr('class');
		  if(button == 'ok'){
			//按下确定按钮执行的操作
			//todo ....		
			$(".sections").removeClass("sections_left");
			this.hide();
		  }

		  if(button == 'cancel') {
			//按下取消按钮执行的操作
			//todo ....
			this.hide();
		}
	});
}
