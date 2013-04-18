/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var stackOverFlowUrl = "stackoverflow.com";
var runBadge = chrome.extension.getURL("favicon.ico");

function findRequiredPackages (codeText) {

}
var runnable_url = "http://localhost:3000";

var handleClick = function (code) {
	$.blockUI({ message: '<h1><img src="' + runBadge + '" /> Your Runnable is loading...</h1>' })
	$.ajax({
		url: runnable_url + "/api/projects/",
		type:'POST',
		data: {"framework":"node.js"},
		success: function (data){
			console.log(data._id);
			console.log(data);
			$.ajax({
			   url: runnable_url + "/api/projects/" + data._id + "/files/server.js",
			   type: 'PUT',
			   success: function(response) {
			   	// alert("checkout http://runnable.com/" + data._id);
			   	window.location.replace(runnable_url + "/" + data._id);
			   },
			   data: {"content": code, "name": "server.js"}
			});
		}
	});




}

// Test the text of the body element against our regular expression.
if (document.location.href.indexOf(stackOverFlowUrl) != -1) {
	var codeArray = $(document).find("code");
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
