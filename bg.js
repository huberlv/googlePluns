/**
 * monitorInfos:{url1:{path1:{url,path,title,moduleName}}}
 */
var monitorTime=5000;
var key_monitorInfos='monitorInfos';
var currentIndex=0;
var monitorType_xml='XMLHttpRequest';
var monitorType=monitorType_xml;
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	try{
		if(request.cmd=='displayUpdate'){
			displayUpdate(request.updateNum);
		}
		if(request.cmd=='bgRead'){
			localStorage.setItem(request.key,request.value);
		}
		if(request.cmd=='addMonitor'){
			addMonitor(request);
		}
	}catch(e){
		console.log(e);
	}
	sendResponse({'response': "ok"});
});

function addMonitor(monitorInfo){
	var monitorInfos=getMonitorInfos();
	if(monitorInfos[monitorInfo.url]==undefined){
		var module=new Object();
		module[monitorInfo.path]=monitorInfo;
		monitorInfos[monitorInfo.url]=module;
		localStorage.setItem(key_monitorInfos,JSON.stringify(monitorInfos));
	}else{
		if(monitorInfos[monitorInfo.url][monitorInfo.path]==undefined){
			monitorInfos[monitorInfo.url][monitorInfo.path]=monitorInfo;
			localStorage.setItem(key_monitorInfos,JSON.stringify(monitorInfos));
		}
	}
}

function getMonitorInfos(){
	var monitorInfosJson=localStorage.getItem(key_monitorInfos);
	var monitorInfos=null;
	if(monitorInfosJson==null){
		monitorInfos=new Object();
	}else{
		monitorInfos=JSON.parse(''+monitorInfosJson);
	}
	return monitorInfos;
}

function displayUpdate(updateNum){
	chrome.browserAction.setBadgeText({text:updateNum});
}
//chrome.tabs.create({"url":"http://www.baidu.com","selected":false},function(tab){alert(tab);});
//chrome.windows.create({"url":"http://www.baidu.com","width":1,"height":1},function(w){alert(w.location.href);});
//chrome.tabs.create({'url':'http://localhost:8080/personalfocus/index.jsp','selected':false,'pinned':true,'index':0},function(tab){} );
//window.showModalDialog("http://localhost:8080/personalfocus/index.jsp",window);
//window.open('http://localhost:8080/personalfocus/index.jsp','_blank','height=0,width=0,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no,alwaysLowered=no,z-look=no')
function monitor(){
	var url=getAWebToMonitor();
	if(url==null){
		console.log('no web to be monitor now!');
		window.setTimeout(monitor, monitorTime);
		return;
	}
	if(monitorType==monitorType_xml){
		monitorByXMLHttpRequest(url);
	}
}
function monitorByXMLHttpRequest(url){
	var xhr = new XMLHttpRequest();
	xhr.open("GET",url , true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
		  var d=document.createElement("document");
		  d.innerHTML=xhr.responseText;
		  try{
			  setConfig(url);
			  var updateNum=compare(d); 
			  displayUpdate(updateNum);
			  window.setTimeout(monitor, monitorTime);
		  }catch(e){
			  alert(e.message);
		  }
	
	  }
	}
	xhr.send();
}
var currentIndex=0;
function getSizeOfObject(obj){
	var size=0;
	for(var i in obj){
		size++;
	}
	return size;
}
function getObjectAttrByIndex(obj,index){
	var n=0;
	for(var i in obj){
		if(index==n){
			return i;
		}
		n++;
	}
}
function getAWebToMonitor(){
	var monitorInfos=getMonitorInfos();
	var size=getSizeOfObject(monitorInfos);
	if(size==0){
		return null;
	}else{
		currentIndex=currentIndex%size;
		var aweb= getObjectAttrByIndex(monitorInfos,currentIndex);
		currentIndex++;
		console.log("currentIndex:"+currentIndex);
		return aweb;
	}
}

window.setTimeout(monitor, monitorTime);


