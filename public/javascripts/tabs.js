window.onload=function() {

  // get tab container
  	var container = document.getElementById("tabContainer");
    var tabcon = document.getElementById("tabscontent");
		//alert(tabcon.childNodes.item(1));
    // set current tab
    var navitem = document.getElementById("tabHeader_1");
		
    //store which tab we are on
    var ident = navitem.id.split("_")[1];
	//alert(ident);
    navitem.parentNode.setAttribute("data-current",ident);
    //set current tab with class of activetabheader
    navitem.setAttribute("class","tabActiveHeader");

    //hide two tab contents we don't need
   	var pages = tabcon.getElementsByTagName("div");
    for (var i = 1; i < pages.length; i++) {
     	 pages.item(i).style.display="none";
    };

    //this adds click event to tabs
    var tabs = container.getElementsByTagName("li");
    for (i = 0; i < tabs.length; i++) {
      tabs[i].onclick=displayPage;
    }

    //Initialize the data for the stocks
    initializeData();
}

// on click of one of tabs
function displayPage() {
    var current = this.parentNode.getAttribute("data-current");
    //remove class of activetabheader and hide old contents
    document.getElementById("tabHeader_" + current).removeAttribute("class");
    document.getElementById("tabpage_" + current).style.display="none";

    var ident = this.id.split("_")[1];
    //add class of activetabheader to new active tab and show contents
    this.setAttribute("class","tabActiveHeader");
    document.getElementById("tabpage_" + ident).style.display="block";
    this.parentNode.setAttribute("data-current",ident);
}

function initializeData(){
    retrieveBoughtData();
    retrieveSoldData();
    //setTimeout(initializeData, 30000);
}

function retrieveBoughtData(){
    var tblBought = document.getElementById("tblBought");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./retrieveBought", true);
   // xhr.responseType = "json";
    xhr.onreadystatechange = function () {
      if (xhr.readyState == xhr.DONE) {
        var jsonData = xhr.response;
        var jsonArray = JSON.parse(jsonData);
        
        var content = "";
        var item;
        var row;
        var tBody = tblBought.tBodies[0];
        for(var i = 0; i < jsonArray.length; i ++){
        //var content = "<tr><td>sh600000</td><td>浦发银行</td><td>2012/07/31</td><td>6.78</td><td>1000</td><td>6.89</td><td>3.0%</td></tr>";
        //content += content;
            item = jsonArray[i];
           // content += "<tr>";
            row =  tBody.insertRow(-1);

            content = "";
            content += "<td class='stockcode'>" 
                        + item.code 
                        + "</td>";
            content += "<td>" + item.name + "</td>";
            content += "<td>" + item.buyDate + "</td>";
            content += "<td>" + item.buyPrice + "</td>";
            content += "<td>" + item.buyVolumn + "</td>";
            content += "<td>" + item.currPrice + "</td>";
            content += "<td>" + ((item.currPrice - item.buyPrice) * 100 / item.buyPrice).toFixed(2) + "%</td>";
            
            row.innerHTML = content;
            row.setAttribute("code", item.code);

            row.addEventListener("click", function(){
                var url = "http://finance.sina.com.cn/realstock/company/"
                        + this.getAttribute("code")
                        + "/nc.shtml";
                window.open(url);
            })
            //content +="</tr>\n";
        }

        
      }
    }
    xhr.send();
    
}

function retrieveSoldData(){
    var tblSold = document.getElementById("tblSold");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./retrieveSold", true);
   // xhr.responseType = "json";
    xhr.onreadystatechange = function () {
      if (xhr.readyState == xhr.DONE) {
        var jsonData = xhr.response;
        var jsonArray = JSON.parse(jsonData);
        
        var content = "";
        var item;
        var row;
        var tBody = tblSold.tBodies[0];
        for(var i = 0; i < jsonArray.length; i ++){
        //var content = "<tr><td>sh600000</td><td>浦发银行</td><td>2012/07/31</td><td>6.78</td><td>1000</td><td>6.89</td><td>3.0%</td></tr>";
        //content += content;
            item = jsonArray[i];
           // content += "<tr>";
            row =  tBody.insertRow(-1);

            content = "";
            content += "<td class='stockcode'>" 
                        + item.code 
                        + "</td>";
            content += "<td>" + item.name + "</td>";
            content += "<td>" + item.buyDate + "</td>";
            content += "<td>" + item.buyPrice + "</td>";
            content += "<td>" + item.buyVolumn + "</td>";
            content += "<td>" + item.sellDate + "</td>";
            content += "<td>" + item.sellPrice + "</td>";
            content += "<td>" + item.currPrice + "</td>";
            content += "<td>" + ((item.sellPrice - item.buyPrice) * 100 / item.buyPrice).toFixed(2) + "%</td>";
            
            row.innerHTML = content;
            row.setAttribute("code", item.code);

            row.addEventListener("click", function(){
                var url = "http://finance.sina.com.cn/realstock/company/"
                        + this.getAttribute("code")
                        + "/nc.shtml";
                window.open(url);
            })
            //content +="</tr>\n";
        }

        
      }
    }
    xhr.send();
}