var main = function (toDoObjects) {
	"use strict";

	var toDos = toDoObjects.map(function (toDo){
		return toDo.description;
	});

	$(".tabs a span").toArray().forEach(function(element){
		$(element).on("click", function () {

			var $element = $(element),
			$content;
			$(".tabs span").removeClass("active");
			$element.addClass("active");
			$("main .content").empty();

			if ($element.parent().is(":nth-child(1)")) {	//Вкладка "Новые"

				$content = $("<ul>");

				for (var i = toDos.length-1; i >= 0; i--) {
					$content.append($("<li>").text(toDos[i]));

				}
				$("main .content").append($content);
			} else if ($element.parent().is(":nth-child(2)")) {		//Вкладка "Старые"

				$content = $("<ul>");

				toDos.forEach(function(todo) {
					$content.append($("<li>").text(todo));
				});

				$("main .content").append($content);
			} else if ($element.parent().is(":nth-child(3)")) {		//Вкладка "Теги"

				var organizedByTag = [];
				organizedByTag = organizedByTags(toDoObjects);

				organizedByTag.forEach (function (tag) {
					var $tagName = $("<h3>").text(tag.name),
						$content = $("<ul>");
					tag.toDos.forEach (function (description) {
						var $li = $("<li>").text(description);
						$content.append($li);
					});

					$("main .content").append($tagName);
					$("main .content").append($content);
				});
			} else if ($element.parent().is(":nth-child(4)")) {		//Вкладка "Добавить"

				var $input = $("<input>"),
				$button = $("<button>").text("+"),
				$tagInput= $("<input>");

				$button.on("click", function () {

					var description = $input.val(),
					tags = $tagInput.val().split(","),
					newToDo;

					newToDo = {"description":description, "tags":tags};

					$.post("todos", newToDo, function(result) {

						console.log(result);

						toDoObjects.push(newToDo);

						toDos = toDoObjects.map(function (toDo) {
							return toDo.description;
						});

						$input.val("");
						$tagInput.val("");

					});					
				});

				$content = $("<div>").append($input).append($tagInput).append($button);
				$("main .content").append($content);
			}
			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
};
$(document).ready(function () {

	$.getJSON("todos.json", function (toDoObjects) {
		main (toDoObjects);
	});

});

var organizedByTags = function (toDoObjects) {

	var tagsArray = [];

	toDoObjects.forEach (function (toDo) {
		toDo.tags.forEach (function (tag){
			if (tagsArray.indexOf(tag) === -1) {
				tagsArray.push(tag);
			}
		});
	});

	var tagObjects = tagsArray.map (function (tag){

		var toDoWithTag = [];

		toDoObjects.forEach (function (toDo) {
			if (toDo.tags.indexOf(tag) !== -1) {
				toDoWithTag.push(toDo.description);
			}
		});

		return { "name" : tag, "toDos" : toDoWithTag };
	});
	
	return tagObjects;
};