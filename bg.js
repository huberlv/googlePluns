
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.cmd=='displayUpdate'){
		chrome.browserAction.setBadgeText({text:request.updateNum});
		
	}
});
//chrome.tabs.create({"url":"http://www.baidu.com","selected":false},function(tab){alert(tab);});
//chrome.windows.create({"url":"http://www.baidu.com","width":1,"height":1},function(w){alert(w.location.href);});
//chrome.tabs.create({'url':'http://localhost:8080/personalfocus/index.jsp','selected':false,'pinned':true,'index':0},function(tab){} );
//window.showModalDialog("http://localhost:8080/personalfocus/index.jsp",window);
//window.open('http://localhost:8080/personalfocus/index.jsp','_blank','height=0,width=0,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no,alwaysLowered=no,z-look=no')
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://www.baidu.com", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
   
   // document.getElementById("resp").innerHTML = xhr.responseText;
	  var d=document.createElement("document");
	  d.innerHTML=xhr.responseText;

	  alert(d.getElementsByTagName("a").length)
	 
  }
}
xhr.send();