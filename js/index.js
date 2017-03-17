/**
 * Created by anli on 2017/2/12.
 */
(function(){
    var util = (function(){
        var prefix = 'html5_reader_'
        var storageGetter = function(key){
            return localStorage.getItem(prefix + key);
        }
        var storageSetter = function(key,val){
            return localStorage.setItem(prefix + key,val)
        };
        var getBsonp = function(url,callback){
            return $.jsonp({
                url : url,
                cache : true,
                callback : "duokan_fiction_chapter",
                success : function(result){
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data));
                    callback(json);
                }
            })
        }
        return {
            getBsonp      : getBsonp,
            storageGetter : storageGetter,
            storageSetter : storageSetter
        }
    })();

    var Dom = {
        topNav : $("#topNav"),
        footNav : $("#footNav"),
        fontContainer : $(".font_container")
    }
    var win = $(window);
    var doc = $(document);
    var body = $("body");
    var readerModel;
    var readerUi;
    var rootContainer = $("#fictionContainer");
    var initFontSize = parseInt(util.storageGetter("font-size"));
    var initBackgroundColor = util.storageGetter("background-color");
    var initId = util.storageGetter("id");

    if(!initFontSize){
        initFontSize = 14;
    }
    if(!initId){
        initId = "夜间";
    }
    if(!initBackgroundColor){
        initBackgroundColor = "#e9dfc7";
    }
    $("#pattern").children("span").text(initId);
    body.css("background-color",initBackgroundColor);
    rootContainer.css("font-size",initFontSize);
	

    function main(){
        //todo 整个项目的入口函数
        readerModel = ReaderModel();
        readerUi = readerBaseFrame(rootContainer);
        readerModel.init(function(data){
            readerUi(data);
        });
        eventHanlder();
    }
    function ReaderModel(){
        //todo 实现和阅读器相关的数据交互的方法
        var Chapter_id;
        var chapterTotal;
        var init = function(callbackUi){
            getFictionInfo(function(){
                getCurChapterContent(Chapter_id,function(data){
                    //TODO...
                    callbackUi && callbackUi(data);
                });
            });
        };
        var getFictionInfo = function(callback){
            $.get("data/chapter.json",function(data){
                //TODO 获得章节信息之后的回调
                $.each(data.chapters,function(i){
                	var html = "<span>" + data.chapters[i].title + "</span>"
                	$("#navCatalogMain").append(html)
                });
                
                Chapter_id = util.storageGetter("last_chapter_id");
                if(Chapter_id == null){
                    Chapter_id = data.chapters[1].chapter_id;
                }
                chapterTotal = data.chapters.length;
                callback && callback();
            },"json")
        };
        var getCurChapterContent = function(chapter_id,callback){
            $.get("data/data" + chapter_id +".json",function(data){
                if(data.result == 0){
                    var url = data.jsonp;
                    util.getBsonp(url,function(data){
                       callback && callback(data);
                    });
                };
            },"json");
        };
        var prevChapter = function(uiCallback){
            Chapter_id = parseInt(Chapter_id,10);
            if(Chapter_id == 1) {
            	if(confirm("已经是第一章")){
            		window.scrollTo(0,0);
            	}
            	return;
            }
            Chapter_id -= 1;
            getCurChapterContent(Chapter_id,uiCallback);
            util.storageSetter("last_chapter_id",Chapter_id);
            window.scrollTo(0,0);
        }
        var nextChapter = function(uiCallback){
            Chapter_id = parseInt(Chapter_id,10);
            console.log(Chapter_id)
            console.log(chapterTotal)
            if(Chapter_id == 4) {
            	if(confirm("已经是最后一章")){
            		window.scrollTo(0,0);
            	}
            	return;
            }
            Chapter_id += 1;
            getCurChapterContent(Chapter_id,uiCallback);
            util.storageSetter("last_chapter_id",Chapter_id);
            window.scrollTo(0,0)
        }
        

        return {
            init : init,
            prevChapter : prevChapter,
            nextChapter : nextChapter
        }
    }
    function readerBaseFrame(container){
        //todo 渲染基本的UI结构
        function parseChapterDate(jsonData){
            var jsonObj = JSON.parse(jsonData);
            var html = '<h4>' + jsonObj.t + '</h4>';
            $.each(jsonObj.p,function(i){
                html += '<p>' + jsonObj.p[i] + '</p>';
            });
            
            return html;
        }
        return function (data){
            container.html(parseChapterDate(data));
        }
    }
    function eventHanlder(){
        //todo 交互的事件绑定
        //touch
        //zepto tap
        //安卓4.0 click  300ms延迟
        //后期类似click tap


        $("#actionMid").click(function(){
            Dom.fontContainer.hide();
            $("#word em").removeClass("curr");
            if(Dom.topNav.css("display") == "none"){
                Dom.footNav.show();
                Dom.topNav.show();
            }else{
                Dom.footNav.hide();
                Dom.topNav.hide();
            }
        })
        $("#pattern").click(function(){
            //TODO 触发背景切换的事件
            $(this).children("em").toggleClass("curr");
            if($(this).children("span").text() == "夜间"){
                initId = "白天";
                $(this).children("span").text(initId);
                $(".bk_container_black").show();
                $(".bk_container_black").trigger("click");
                util.storageSetter("id",initId);
            }else{
                initId = "夜间";
                $(this).children("span").text(initId);
                $(".bk_container_black").hide();
                $(".bk_container_pink").trigger("click");
                util.storageSetter("id",initId);
            }
        });
        $("#word").click(function(){
            $("#word em").toggleClass("curr");
            if(Dom.fontContainer.css('display') == "none"){
                Dom.fontContainer.show();
            }else{
                Dom.fontContainer.hide();
            }
        });
        $("#largeFont").click(function(){
            if(initFontSize > 20) return;
            initFontSize ++;
            rootContainer.css("font-size",initFontSize);
            util.storageSetter("font-size",initFontSize);
        });
        $("#smalFont").click(function(){
            if(initFontSize < 12) return;
            initFontSize --;
            rootContainer.css("font-size",initFontSize);
            util.storageSetter("font-size",initFontSize);
        });
        $(".bk_container").click(function(){
            initBackgroundColor = $(this).css("background-color");
            body.css("background-color",initBackgroundColor);
            util.storageSetter("background-color",initBackgroundColor);
        });
        win.scroll(function(){
            Dom.footNav.hide();
            Dom.topNav.hide();
            Dom.fontContainer.hide();
            $("#word em").removeClass("curr");
        });
        $("#prevBtn").click(function(){
            //TODO   获得章节的翻页数据->把数据拿出来渲染
            readerModel.prevChapter(function(data){
                readerUi(data);
            });
        });
        $("#nextBtn").click(function(){
            readerModel.nextChapter(function(data){
                readerUi(data);
            });
        })
        
        $(".icon_back").click(function(){
        	window.open("index.html","_self");
        });
        
        $("#catalog").click(function(){
        	$("#navCatalog").addClass("nav_catalog_curr");
        	Dom.footNav.hide();
            Dom.topNav.hide();
            Dom.fontContainer.hide();
        });
        
        $("#navCatalogBg em").click(function(){
        	$("#navCatalog").removeClass("nav_catalog_curr");
        });
        
        $("#navCatalogMain").on("click","span",function(){
        	$("#navCatalog").removeClass("nav_catalog_curr");
        	$("#fictionContainer h4").html($(this).html());
        	window.scrollTo(0,0);
        })
    }
    main();
    if(initId == "白天"){
        $("#pattern").children("em").addClass("curr");
        if(confirm("您当前模式为夜间模式，是否切换至白天模式")){
            $("#pattern").trigger("click");
        }
    }
    window.scrollTo(0,0);
})();