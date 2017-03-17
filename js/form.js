//checkbox 按钮
function checkboxBtn(obj){
	obj.each(function(){
		var $this = $(this);
		var index = $(this).index();
		$this.parent().on("click",function(){
			if($this.is(":checked")){
				$(this).removeClass("checkbox_on");
				$this.prop("checked",false);
			}else{
				$(this).addClass("checkbox_on");
				$this.prop("checked",true);
			}
		})
		$this.parent().next().on("click",function(){
			$this.parent().trigger("click")	
		})
	})
	
}

