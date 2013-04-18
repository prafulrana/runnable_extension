/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var stackOverFlowUrl = "stackoverflow.com";

var handleClick = function (code) {
	$.post("http://runnable.com/api/projects/", {"framework":"node.js"}, function (data){
		console.log(data._id);
		$.ajax({
		   url: "http://runnable.com/api/projects/" + data._id + "/files/server.js",
		   type: 'PUT',
		   success: function(response) {
		   	// alert("checkout http://runnable.com/" + data._id);
		   	window.location.replace("http://runnable.com/" + data._id);
		   },
		   data: {"content": code, "name": "server.js"}
		});
	});
}

// Test the text of the body element against our regular expression.
if (document.location.href.indexOf(stackOverFlowUrl) != -1) {
	var codeArray = $(document).find("code");
	var runBadge = chrome.extension.getURL("favicon.ico");
	codeArray.each(function (index, code) {
	var codeText = code.innerText;
		if (codeText.length > 35) {
			var runBadgeElement = $("<img src='"+ runBadge + "'></img>");
			runBadgeElement.click(function (){handleClick(codeText);});
			$(code).append(runBadgeElement);
		}
	});
  chrome.extension.sendRequest({}, function(response) {});
} else {
  // No match was found.
}
