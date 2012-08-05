module.exports = StockCalculator;

/**
* @param {Array}	items	Each item contains close, low, high properties, and the items are ordered by date from old to new
*/
function StockCalculator(items){
	this.items = items;
	//console.log(items);
}


//EXPMA	http://baike.baidu.com/view/1196584.htm
StockCalculator.prototype.EMA = function(n){
		var self = this;
		//console.log(self.items);
		var length = self.items.length;
		return calculateEma(self.items.slice(length - n), n);
	
};

StockCalculator.prototype.MA = function(values, n){
	var length = values.length;
	var result = 0;
	for(var i = length -1; i >= length - n; i--){
		result += values[i] ;
	}

	return result / n;
}

StockCalculator.prototype.MA0 = function(item){
	//debugger;
	if(!item){
		var self = this;
		var length = self.items.length;
		item = self.items[length-1];
	}
	
	return parseFloat(item.close);
};

StockCalculator.prototype.MA1 = function(item){
	if(!item){
		var self = this;
		var length = self.items.length;
		item = self.items[length - 1];
	}
	return (parseFloat(item.low) + parseFloat(item.high) + parseFloat(item.close)) / 3;

};

StockCalculator.prototype.MA2 = function(myItems){
	//debugger;
	if(!myItems){
		var self = this;
		myItems = self.items;
	}

	var item = null;
	var ma1Array = new Array();
	var length = myItems.length;

	for(var i = length -1; i >= length - 5; i--){
		item = myItems[i];
		ma1Array.push(this.MA1(item));
	}
	
	return this.MA(ma1Array, 5);
};

StockCalculator.prototype.MA3 = function(myItems){

	var self = this;
	if(!myItems){
		myItems = self.items;
	}

	var newItems = null;
	var ma2Array = new Array();
	var length = myItems.length;

	
	//debugger;
	for(var i = length ; i > length - 10; i--){
		//item = self.items[i];
		newItems = myItems.slice(0, i);
		ma2Array.push(this.MA2(newItems));
	}
	

	return self.HHV(ma2Array, 10);
};

StockCalculator.prototype.MA4 = function(myItems){
	var self = this;
	if(!myItems){
		myItems = self.items;
	}
	
	var newItems = null;
	var ma2Array = new Array();
	var length = myItems.length;

	for(var i = length; i > length - 10; i--){
		//item = self.items[i];
		newItems = myItems.slice(0, i);

		ma2Array.push(this.MA2(newItems));
	}
	
	return self.LLV(ma2Array, 10);
};

StockCalculator.prototype.BUY1 = function(myItems){
	var self = this;
	if(!myItems){
		myItems = self.items;
	}
	
	var length = myItems.length;
	var newItems = null;

	var ma0, ma4;
	for(var i = length -1; i >= length - 5; i--){
		ma0 = this.MA0(myItems[i]);
		ma4 = this.MA4(myItems.slice(0, i + 1));
		//console.log('i = ' + i + ', ma0 = ' + ma0 + ', ma4 = ' + ma4);
		if(ma0 < ma4){
			return 50;
		}
	}

	return 0;

}

StockCalculator.prototype.BUY2 = function(myItems){
	var self = this;
	if(!myItems){
		myItems = self.items;
	}
	
	var length = myItems.length;
	//var newItems = null;

	var ma0, ma4;
	debugger;
	for(var i = length -1; i >= length - 10; i--){
		
		ma0 = this.MA0(myItems[i]);
		ma4 = this.MA4(myItems.slice(0, i + 1));
		//console.log('i = ' + i + ', ma0 = ' + ma0 + ', ma4 = ' + ma4);
		if(ma0 < ma4){
			return 50;
		}
	}

	return 0;

}

StockCalculator.prototype.SELL1 = function(myItems){
	var self = this;
	if(!myItems){
		myItems = self.items;
	}
	
	var length = myItems.length;
	//var newItems = null;
	//console.log(myItems);
	var ma0, ma3;
	for(var i = length -1; i >= length - 5; i--){
		
		ma0 = this.MA0(myItems[i]);
		ma3 = this.MA3(myItems.slice(0, i + 1));
		//console.log('i = ' + i + ', ma0 = ' + ma0 + ', ma3 = ' + ma3);
		if(ma0 < ma3){
			return 100;
		}
	}

	return 50;

}

StockCalculator.prototype.SELL2 = function(myItems){
	var self = this;
	if(!myItems){
		myItems = self.items;
	}
	
	var length = myItems.length;
	var newItems = null;

	var ma0, ma3;
	for(var i = length -1; i >= length - 10; i--){
		ma0 = this.MA0(myItems[i]);
		ma3 = this.MA3(myItems.slice(i - 14, i));
		//console.log('i = ' + i + ', ma0 = ' + ma0 + ', ma3 = ' + ma3);
		if(ma0 < ma3){
			return 100;
		}
	}

	return 50;

}

/**
* Calculate the max number in n days
*/
StockCalculator.prototype.HHV = function(values, n){
	//debugger;
	var length = values.length;
	var result = 0;
	var temp = 0;
	for(var i = length -1; i >= length - n; i--){
		temp = values[i];
		if(temp > result){
			result = temp;
		}
	}
	return result;
}

/**
* Calculate the min number in n days
*/
StockCalculator.prototype.LLV = function(values, n){
	var length = values.length;
	var result = values[length - 1];
	var temp = 0;
	for(var i = length -2; i >= length - n; i--){
		temp = values[i];
		if(temp < result){
			result = temp;
		}
	}
	return result;
}



function calculateEma(myItems, n){

	if(n == 1){
		return parseFloat(myItems[0].close);
	}else{
		var todayClose = parseFloat(myItems[n-1].close);
		//[2*X+(N-1)*Y’]/(N+1)，
		return (2*todayClose + (n-1) * calculateEma(myItems, n-1))/(n+1);
	}

}