
function displyUpdate(dom){
	// dom.style.color="#FF0000";
	// dom.style.textDecoration="overline";
	 dom.style.backgroundColor="#00FF00";
}
chrome.storage.sync.get(personalFocus_oldLinks,function(valueArray) {

});

//chrome.storage.local.clear(function() { alert('清除全部存储项成功')       });
var personalFocus_oldLinks=encodeURIComponent("personalFocus_oldLinks:"+window.location.href);
chrome.storage.local.get(personalFocus_oldLinks, function(valueArray) {
        console.log("*****start personalFocus******"); 	 
		var oldLinks=valueArray[personalFocus_oldLinks];
		var links=document.body.getElementsByTagName("a");
		var newLinks=new Object();
		var exists=false;

		if(oldLinks!=undefined){
			exists=true;
		}
		console.log("visited:"+exists);
		console.log("oldLinks:"+oldLinks);
		var updateNum=0;
		for(var i=0;i<links.length;i++){
		     newLinks[links[i].innerText]="";
			 if(exists){
                 if( oldLinks[links[i].innerText]==undefined){ 
					 displyUpdate(links[i]);
					 updateNum++;
				 }
			 }
		}
		var storage=new Object();
		storage[personalFocus_oldLinks]=newLinks;
		chrome.storage.local.set(storage, function() {
             console.log('storage success!')       
		});
		 console.log("*****end personalFocus******"); 	  

		chrome.extension.sendMessage({cmd: "displayUpdate",'updateNum':updateNum+""},function(response) {
			 console.log("content response:"+response); 	  
		});
});

