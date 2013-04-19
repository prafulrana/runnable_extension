/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var stackOverFlowUrl = "stackoverflow.com";
var runnable_url = "http://runnable.com";
var runBadge = chrome.extension.getURL("favicon.ico");
var nodeVersion = "node 0.6.x";

function findRequiredPackages (codeText) {
	var ctr = 0;
	var results = [];
	codeText.split("require(").forEach(function (require){
		ctr++;
		if (ctr > 1) {
			var library = require.split(")").shift().replace(/['"]/g,'');
			if (library.indexOf(".js") == -1 &&
				library.indexOf(".git") == -1 &&
				library != "http") {
				results.push(library);
			}
		}
	});
	return results
}

function getPackageJson (codeText) {
	var packagekjson = '{\n"name": "HelloWorld",\n"author": "Runnable",\n"version": "0.0.1",\n"description": "Runnable Sample Application",\n"dependencies": {';
	var ctr = 0;
	findRequiredPackages(codeText).forEach(function (library){
		if (ctr > 0)
			packagekjson += ',\n"';
		else
			packagekjson += '\n"';

		packagekjson += library + '":"*"';
		ctr++;
	});
	packagekjson += '\n},\n"engine": "' + nodeVersion + '"\n}';
    return packagekjson;
}


var handleClick = function (code) {
	$.blockUI({ message: '<h1><img src="' + runBadge + '" /> Your Runnable is loading...</h1>' });
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
			   success: function(response_server) {
			   	// alert("checkout http://runnable.com/" + data._id);
					$.ajax({
					   url: runnable_url + "/api/projects/" + data._id + "/files/package.json",
					   type: 'PUT',
					   success: function(response_package) {
					   	// alert("checkout http://runnable.com/" + data._id);


					   	window.location.replace(runnable_url + "/" + data._id);
					   },
					   data: {"content": getPackageJson(code), "name": "package.json"}
					});
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
