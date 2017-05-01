$(document).ready(function(){
	
	$('.add').click(function(event){
		event.preventDefault();
		var foodID = $(this).parent().find('select[name="foodId"]').val();
		var food = $(this).parent().find('option.food-'+foodID).text();
		var html = '<li class="i-list">' + 
					'<span class="i-text">'+food+'</span>' +
					'<span class="right-check" data-id="'+foodID+'">&#10005;</span>' +
				'</li>';

			var foodIDs = $('.foodIDs').val();
			if(foodIDs==''){
				foodIDs = foodID;
			} else {
				foodIDs += "," + foodID;
			}
			$('.foodIDs').val(foodIDs);
		$('.added-food').append(html);
		$(this).parent().find('select[name="foodId"]').val();	
	});

	$('.added-food').on('click', '.right-check', function() {
		var foodIDs = $('.foodIDs').val().split(',');
		var idToDelete = $(this).attr('data-id')
		var newFoodIDs = [];
		for (var i = foodIDs.length - 1; i >= 0; i--) {
			if(foodIDs[i] != idToDelete){
				newFoodIDs.push(foodIDs[i]);
			} else {
				idToDelete = 0;
			}
		}
		$('.foodIDs').val(newFoodIDs.join(','));
		$(this).parent().remove();
	})

});