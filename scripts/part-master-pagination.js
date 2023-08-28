// source : https://codepen.io/dipsichawan/pen/poyxxVY

var total_records = 100;
var perpage = 10;
var total_pages = total_records / perpage;

$(document).ready(function(){
	var pagenum = 1;
    createpagination(pagenum);
	fetch_data(perpage,pagenum);
});


function createpagination(pagenum){
		$("#page_container").html("");
		
		if(pagenum == 1){
			$("#page_container").append("<li class='page-item disabled previous'><a href='javascript:void(0)' class='page-link'><</a></li>");
		}else{
			$("#page_container").append("<li class='page-item' onclick='makecall("+(pagenum-1)+")'><a href='javascript:void(0)' class='page-link'><</a></li>");
		}
		
		var i=0;
		for(i=0; i <= 2; i++){
			if(pagenum == (pagenum+i)){
				$("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>"+(pagenum+i)+"</a></li>");
			}else{
				if((pagenum+i)<=total_pages){
                    $("#page_container").append("<li class='page-item' onclick='makecall("+(pagenum+i)+")'><a href='javascript:void(0)' class='page-link'>"+(pagenum+i)+"</a></li>");					
				}
			}
		}
		
		if(pagenum == total_pages){
			$("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>></a></li>");
		}else{
			$("#page_container").append("<li class='page-item next' onclick='makecall("+(pagenum+1)+")'><a href='javascript:void(0)' class='page-link'>></a></li>");
		}
}

function fetch_data(perpage, pagenum){
	
    $.ajax({
        type:'get',
        url:'https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[per_page]=10&request[page]='+pagenum,
        dataType:'json',
        success:function(data){
			$(".100_list_container").html("");
            $.each( data.plugins, function( key, value ) {
                $(".100_list_container").append("<li class='list-group-item list-item-contains'><div><h5>"+value.name+"</h5>"+value.version+"</div></li>");
            });
        },
        error:function(){
            $(".100_list_container").html("error");
        }
    });
}

function makecall(pagenum){
	createpagination(pagenum);
	fetch_data(perpage,pagenum);
}
