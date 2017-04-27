$(document).ready(function(){
	
	$('.form-control').submit(function(event){
		event.preventDefault();
		var add = $(this).find('select[name="foodId"]').val();
		var html = '<li class="i-list">' + 
					'<span class="i-text">'+add+'</span>' +
					'<span class="right-check">&#10005;</span>' +
				'</li>';
		$(this).siblings('ul').append(html);
		$(this).find('select[name="foodId"]').val('');	
	});
});