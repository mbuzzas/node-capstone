$(document).ready(function(){
	
	$('.add').click(function(event){
		event.preventDefault();
		var foodID = $(this).parent().find('select[name="foodId"]').val();
		var food = $(this).parent().find('option.food-'+foodID).text();
		var html = '<li class="i-list">' + 
					'<span class="i-text">'+food+'</span>' +
					'<span class="right-check">&#10005;</span>' +
				'</li>';

			var foodIDs = $('.foodIDs').val();
			if(foodIDs==''){
				foodIDs = foodID;
			} else {
				foodIDs += "," + foodID;
			}
			$('.foodIDs').val(foodIDs);
			$(this).parent().attr('id');
		$('.added-food').append(html);
		$(this).parent().find('select[name="foodId"]').val();	
	});

	$('.added-food').on('click', '.right-check', function() {
		$('foodIDs').val('id').replace('');
		$(this).parent().remove();
	})

});