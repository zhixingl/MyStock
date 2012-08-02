var http = require('http'),
		util = require('util'),
    eyes = require('eyes'),
    xml2js = require('xml2js');

/*
600000 - 600999
601000 - 601999
000000 - 000999
002000 - 002694
*/

//Get the data from Sina.com.cn, and send the result to the Parser
//var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=sh600000&scale=30&datalen=144';
var urlTemplate = 'http://money.finance.sina.com.cn/quotes_service/api/xml.php/CN_MarketData.getKLineData?symbol=%s&scale=30&datalen=144';
//var stockCode = 'sh600000';
var url;
var stockCode;
for(var count = 0; count < 2000; count++){
	stockCode = 'sh' + (600000 + count);
	url = util.format(urlTemplate, stockCode);
	sendRequest(stockCode, url);

}

function sendRequest(code, url){
	http.get(url, function(res) {
	  //console.log("Got response: " + res.statusCode);
	  //console.log(url);
	 
	  if(res.statusCode == 200){
	  	var resData = '';
		  res.on('data', function (chunk) {
		    	resData += chunk;
		    	//console.log(chunk);
			  });
			}

			res.on('end', function(){
				//eyes.inspect(resData);

				var parser = new xml2js.Parser();

				parser.on('end', function(result) {
				  	//eyes.inspect(result.item[0]);
				  	//util.log(result.item);
						
						var items = result.item;

						if(items != undefined && items.length == 144){

							//calculate the bandwidth
							var band = getBandwidth(items);
							band.stockId = code;
							
							//eyes.inspect(band);

							//If meets the below 3 conditions, buy it
							var condition1 = (band.bandwidth < (band.close - band.preLow))
																&& (band.bandwidth / band.close < 0.03)
																&& (band.close > band.open)
																&& (band.close > band.maxBandwidth);
							var condition2 = (band.volume / band.prevolume) > 1.0;
							var condition3 = band.purevolume > 0;

							if(condition1 && condition2 && condition3){
								buyStock({
									code: code,
									buyDate: Date.now(),
									buyPrice: band.close.toFixed(2),
									buyVolumn: 1000
								});
							}
						}else{
							console.log('This stock %s does not exist!', code);
						}

				});

				parser.parseString(resData);
				
			});
	})
}


function getBandwidth(items){
	var bandwidth = 0,		//带宽 = 5条均线最大差值
			close = 0,				//收盘价
			preLow = 0,				//前一最小值
			open = 0,					//当天开盘
			maxBandwidth = 0,	//最大带宽，即5条均线的最大值
			growth = 0,				//当天涨幅
			volume = 0,				//当天成交量
			prevolume = 0,		//前一日成交量
			purevolume = 0,		//最近20日净成交量
			ma5 = 0,					//5日线价格
			ma12 = 0,					//12日线价格
			ma50 = 0,					//50日线价格
			ma89 = 0,					//89日线价格
			ma144 = 0;					//144日线价格

	var length = items.length;
	var todayItem = items[length - 1];
	var preItem = items[length - 2];

	close = parseFloat(todayItem.close);
	preLow = parseFloat(preItem.low);
	open = parseFloat(todayItem.open);
	growth = (parseFloat(todayItem.close) - parseFloat(preItem.close)) / parseFloat(preItem.close);
	volume = parseInt(todayItem.volume);
	prevolume = parseInt(preItem.volume);

	
	// var sumMa5, sumMa12, sumMa50, sumMa89, sumMa144;
	// var sumPurevolume;
	//var length = items.length;
	for(var i = length-1; i >= 0; i--){
			item = items[i];

			if(i >= length - 5){
				ma5 += item.close/5;
				//eyes.inspect([item.close, item.day, ma5]);
				//eyes.inspect(ma5);
			}

			if(i >= length - 12){
				ma12 += item.close/12;
			}

			if(i >= length - 50){
				ma50 += item.close/50;
			}

			if(i >= length - 89){
				ma89 += item.close/89;
			}
			
			ma144 += item.close/144;

			if(i >= length - 20){
				//eyes.inspect(purevolume);
				if(item.close > items[i-1].close)
					purevolume += parseInt(item.volume);
				else
					purevolume -= parseInt(item.volume);	
			}
			
	}
	//debugger;
	var max = Math.max(ma5, ma12, ma50, ma89, ma144);
	var min = Math.min(ma5, ma12, ma50, ma89, ma144);

	bandwidth = max - min;
	maxBandwidth = max;

	return {
		bandwidth: bandwidth,
		close: close,
		preLow: preLow,
		open: open,
		maxBandwidth: maxBandwidth,
		growth: growth,
		volume: volume,
		prevolume: prevolume,
		purevolume: purevolume,
		ma5: ma5,
		ma12: ma12,
		ma50: ma50,
		ma89: ma89,
		ma144: ma144
	};
}


function buyStock(stock){
	eyes.inspect(stock);
}





