$(document).ready(function() {
	
	function loadingBar(limit) {
		return "<div class=\"progress\"><div aria-valuemax=" + limit +" aria-valuemin=\"0\" aria-valuenow=\"0\" role=\"progressbar\" class=\"progress-bar\">reading your profile...</div></div>"
	}
	
	function displayScore(user, score) {
		var content = "<h2 class=\"text-center\">" + user + "</h2>";
		if (score <= 33) {
			content += "<p  style=\"padding:30px 0 20px\" class=\"bg-danger lead text-center\" id=\"score\">You have a musical openness of<br /><span style=\"font-size:72px\"><strong>" + score + " %</strong></span></p>";
		} else if (score > 33 && score <= 66) {
			content += "<p  style=\"padding:30px 0 20px\" class=\"bg-warning lead text-center\" id=\"score\">You have a musical openness of<br /><span style=\"font-size:72px\"><strong>" + score + " %</strong></span></p>";
		} else {
			content += "<p  style=\"padding:30px 0 20px\" class=\"bg-success lead text-center\" id=\"score\">You have a musical openness of<br /><span style=\"font-size:72px\"><strong>" + score + " %</strong></span></p>";
		}
		var url = encodeURIComponent("http://lcreation.fr/artnum/musical-openness-calculator/");
		content += "<div style=\"padding-bottom:20px;\" class=\"text-center\" ><a href=\"https://www.facebook.com/sharer/sharer.php?u=" + url +"\" class=\"btn btn-default btn-primary btn-sm\"><span class=\"glyphicon glyphicon-thumbs-up\"></span> Share on Facebook</a> <a href=\"https://twitter.com/intent/tweet?text="+ escape($("title").html()) + "&url=" + url +"\" class=\"btn btn-default btn-info btn-sm\"><span class=\"glyphicon glyphicon-new-window\"></span> Share on Twitter</a></div>";
		return content;
	}
	
	function GetURLParameter(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	}
	
	function calculateScore() {
		var limit = 100;
		var count = 0;
		var tags = [];
		console.log("submitted");
		if (GetURLParameter("user") != undefined) {
			var username = GetURLParameter("user");
			$("#score").empty();
			$.getJSON("http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=" + username + "&limit=" + limit + "&api_key=e91e0870f65e6cb22546c618781fed90&format=json&callback=?", function (data) {
				if (data.topartists != undefined) {
					if (data.topartists.artist.length < limit)
						limit = data.topartists.artist.length;
					$("#envoi").after(loadingBar(limit));
					$("input").attr("value", username);
					$.each(data.topartists.artist, function (key, val) {
						
						$.getJSON("http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=" + val.name + "&api_key=e91e0870f65e6cb22546c618781fed90&format=json&callback=?", function (data) {
							if (data.toptags != undefined && data.toptags.tag != undefined && data.toptags.tag[0] != undefined && data.toptags.tag[0].name != undefined) {
								tags.push(data.toptags.tag[0].name.toLowerCase())
							}
							count++;
							$(".progress-bar").attr("aria-valuenow", count)
											  .attr("style", "width:" + count + "%")
							if (count == limit) {
								
								var tagTri = tags.sort();
								tagTri = $.unique(tagTri);
								var scoreInt = tagTri.length;
								var oneTag = [];
								console.debug(tagTri, scoreInt);
								
								for (var i = 0; i < tagTri.length; i++) {
									
									var tag = tagTri[i].split(" ");
									for (var j = 0; j < tag.length; j++) {
										oneTag.push(tag[j]);
									}
								}
								
								oneTag = oneTag.sort();
								var oldLength = oneTag.length;
								$.unique(oneTag);
								var dif = (oldLength - oneTag.length) / 2;
								//~ var score = Math.round(Math.log10(scoreInt - dif) * 50);
								var score = Math.round((scoreInt - dif) * 2);
								$(".progress").remove();
								$("title").html("I have a " + score + " % musical openness rating");
								$("#score").append(displayScore(username, score));
								console.debug(oneTag, oneTag.length, dif, score);
							}
						});
					});
				} else {$("#envoi").after("<div id=\"score\" class=\"alert alert-danger\"><p >User not found</p></div>");}
			});
		}
	else {};
	}
	
	calculateScore();
});
