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
			if ($element.parent().is(":nth-child(1)")) {
				$content = $("<ul>");
				for (var i = toDos.length-1; i >= 0; i--) {
					$content.append($("<li>").text(toDos[i]));
				}
				$("main .content").append($content);
			} else if ($element.parent().is(":nth-child(2)")) {
				$content = $("<ul>");
				toDos.forEach(function(todo) {
					$content.append($("<li>").text(todo));
				});
				$("main .content").append($content);
			} else if ($element.parent().is(":nth-child(3)")) {
				 var organizedByTag = [];
				 organizedByTag = organizedByTags(toDoObjects);
				 console.log(organizedByTag); /*[
					{
						"name" : "покупки",
						"toDos" : ["Купить продукты"]	
					},
					{
						"name" : "рутина",
						"toDos" : ["Купить продукты", "Вывести Грейси на прогулку в парк"]
					},
					{
						"name" : "работа",
						"toDos" : ["Сделать несколько новых задач","Приготовиться к лекции в понедельник",
									"Ответить на электронные письма","Закончить писать книгу"]
					}
				]; */
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
			} else if ($element.parent().is(":nth-child(4)")) {
				var $input = $("<input>"),
				$button = $("<button>").text("+");
				$button.on("click", function () {
					toDos.push($input.val());
					$input.val("");
				});
				$content = $("<div>").append($input).append($button);
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
	var tags = [];
	toDoObjects.forEach (function (toDo) {
		toDo.tags.forEach (function (tag){
			if (tags.indexOf(tag) === -1) {
				tags.push(tag);
			}
		});
	});
	var tagObjects = tags.map (function (tag){
		var toDoWithTag = [];
		toDoObjects.forEach (function (toDo) {
			if (toDo.tags.indexOf(tag) !== -1) {
				toDoWithTag.push(toDo.description);
			}
		});
		return { "name" : tag, "toDos" : toDoWithTag };
	});
	console.log(tagObjects);
	return tagObjects;
};