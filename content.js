//是否对比链接 fixme 需入从配置读取
var compareLink=true;
var backgroundColor="rgb(0, 255, 0)";
//链接的key
var personalFocus_oldContent=null;
var personalFocus_oldContent_temp=null;

if(!window.localStorage){
	alert('This browser does NOT support localStorage');
}
//突出显示更新内容 fixme 需入从配置读取
function displyUpdate(dom){
	// dom.style.color="#FF0000";
	 //dom.style.textDecoration="overline";
	 dom.style.backgroundColor_s=dom.style.backgroundColor==undefined?"":dom.style.backgroundColor;
	 dom.style.backgroundColor=backgroundColor;
}

function restUpdate(dom){
	// dom.style.color="#FF0000";
	 //dom.style.textDecoration="overline";
	if(dom.style.backgroundColor_s!=undefined){
	   dom.style.backgroundColor=dom.style.backgroundColor_s;
	}
}

//清除本地存储 fixme 需要实现事件
function clear(){
	localStorage.clear();
}

function setConfig(url){
	personalFocus_oldContent=encodeURIComponent("personalFocus_oldContent:"+url);
	personalFocus_oldContent_temp=encodeURIComponent("personalFocus_oldContent_temp:"+url);
}
//主方法，对比网页内容
function compare(vdocument) {
        console.log("*****start personalFocus******"); 	 
		var oldContenttr=localStorage.getItem(personalFocus_oldContent);

		var exists=false;

		if(oldContenttr!=undefined){
			exists=true;
		}
		var oldContent=JSON.parse(''+oldContenttr);
		console.log("visited:"+exists);
		console.log("oldContent:"+oldContent);
		var content=getContentToCompare(vdocument);
		var newContent=new Object();
		
		var updateNum=0;
		for(var i=0;i<content.length;i++){
			 var compareContent=content[i].innerText;
			 compareContent=compareLink?compareContent+(content[i].href==undefined?"":content[i].href):compareContent;
		     newContent[compareContent]="";
			 if(exists){
                 if( oldContent[compareContent]==undefined){ 
					 displyUpdate(content[i]);
					 updateNum++;
				 }
			 }
		}
		localStorage.setItem(personalFocus_oldContent_temp,JSON.stringify(newContent));
		if(!exists){
			read();
		}
		console.log("*****end personalFocus******"); 
		return updateNum+"";
}
/**
 * 获取需要对比的dom节点
 * @param select
 * @returns
 */
function getContentToCompare(vdocument){
	var select="";
	var content=null;
	if(select==""){
		content=vdocument.getElementsByTagName("a");
	}
	
	return content;
}

function read(){
	var temp=localStorage.getItem(personalFocus_oldContent_temp);
	if(temp!=null){
		var content=getContentToCompare();
		for(var i=0;i<content.length;i++){
			restUpdate(content[i]);
		}
		localStorage.setItem(personalFocus_oldContent,temp);
		bgRead(personalFocus_oldContent,temp);
	}	
}
function bgRead(key,value){
	chrome.extension.sendMessage({cmd: "bgRead",'key':key,'value':value},function(response) {
		 console.log("content response:"+response); 	  
	});
}

function sendUpdateMessage(updateNum){
	chrome.extension.sendMessage({cmd: "displayUpdate",'updateNum':updateNum+""},function(response) {
		 console.log("content response:"+response); 	  
	});
}
//当窗口重新选取时再对比内容
var sourceOnfocus=window.sourceOnfocus;
window.onfocus=function() {
	cmonitor(document);
    if(sourceOnfocus!=undefined){
    	sourceOnfocus();
    }
}
function cmonitor(vdocument){
	setConfig(window.location.href);
	var updateNum=compare(vdocument);
	sendUpdateMessage(updateNum);
}
cmonitor(document);

//***********fixme 需要实现事件
document.body.onclick=read;


