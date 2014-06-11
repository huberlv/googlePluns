
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.cmd=='displayUpdate'){
		chrome.browserAction.setBadgeText({text:request.updateNum});
		
	}
});
  