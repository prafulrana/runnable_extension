// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when a message is passed.  We assume that the content script
// wants to show the page action.

var isAttached = false

function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.

  $.get("http://localhost:3000/chrome/checkRun", function(data) {
    if (data == "OK") {
      chrome.pageAction.show(sender.tab.id);
      if (!isAttached) {
        isAttached = true;
        chrome.pageAction.onClicked.addListener(function(tab) {
          chrome.tabs.create({'url': "http://runnable.com/express"}, function(tab) {
          // Tab opened.
          });
        });
      }
    }
    // Return nothing to let the connection be cleaned up.
    sendResponse({});
  });

};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
