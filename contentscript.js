/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var stackOverFlowUrl = "stackoverflow.com";
var runnable_url = "http://runnable.com";
var runBadge = chrome.extension.getURL("favicon.ico");
var nodeVersion = "node 0.6.x";


function getNodeCoreApiArray(cb) {
	var results = [];
	$.get("http://nodejs.org/api/index.json", function(data){
		data.desc.forEach(function(apiObj){
			if (apiObj.text)
				results.push(apiObj.text.split("(")[1].split(".")[0]);
		});
		cb(results);
	});
}


function findRequiredPackages (codeText, cb) {
	var ctr = 0;
	var results = [];

	getNodeCoreApiArray(function (apiArray) {
		codeText.split("require(").forEach(function (require){
			ctr++;
			if (ctr > 1) {
				var library = require.split(")").shift().replace(/['"]/g,'');

					console.log(library, ":", $.inArray(library, apiArray));
					if (library.indexOf(".js") == -1 &&
						library.indexOf(".git") == -1 &&
						$.inArray(library, apiArray) <  0) {
						results.push(library);
					}
			}
		});
		console.log(results);
		cb(results);
	});
}

function getPackageJson (codeText, cb) {
	var packagekjson = '{\n"name": "HelloWorld",\n"author": "Runnable",\n"version": "0.0.1",\n"description": "Runnable Sample Application",\n"dependencies": {';
	var ctr = 0;
	findRequiredPackages(codeText, function (packages){
		packages.forEach(function (library){
			if (ctr > 0)
				packagekjson += ',\n"';
			else
				packagekjson += '\n"';

			packagekjson += library + '":"*"';
			ctr++;
		});
		packagekjson += '\n},\n"engine": "' + nodeVersion + '"\n}';
		cb(packagekjson);
	});
}

function openInNewTab (url) {
  var win=window.open(url, '_blank');
  win.focus();
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
			   		getPackageJson(code, function (packagejson){
						$.ajax({
						   url: runnable_url + "/api/projects/" + data._id + "/files/package.json",
						   type: 'PUT',
						   success: function(response_package) {
						   	openInNewTab(runnable_url + "/" + data._id);
						   },
						   data: {"content": packagejson, "name": "package.json"}
						});
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
