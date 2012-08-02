
/*
 * GET home page.
 */

module.exports = function(app)
{

    // home page
    app.get('/', function(req, res){
        res.render('index', { title: 'Home Page.  ' });
        //res.render('index.html');
        //res.json({ 'user': 'Jack' });
    });
    //<tr><td>sh600000</td><td>浦发银行</td><td>2012/07/31</td><td>6.78</td><td>1000</td><td>6.89</td><td>3.0%</td></tr>
    app.get('/retrieveBought', function(req, res){
        ///console.log('retrieveBought');
        var item1 = {
            "code": "sh600000",
            "name": "浦发银行",
            "buyDate": "2012/07/21",
            "buyPrice": "6.78",
            "buyVolumn": "1000",
            "currPrice": "7.65"
        };

        var item2 = {
            "code": "sz002146",
            "name": "荣盛发展",
            "buyDate": "2012/07/12",
            "buyPrice": "9.78",
            "buyVolumn": "1000",
            "currPrice": "10.24"
        };


        var myArray = new Array();
        myArray.push(item1);
        myArray.push(item2);

        //console.log(myArray);
        res.json(myArray);
    });

    app.get('/retrieveSold', function(req, res){
        ///console.log('retrieveBought');
        var item1 = {
            "code": "sh600000",
            "name": "浦发银行",
            "buyDate": "2012/07/21",
            "buyPrice": "6.78",
            "buyVolumn": "1000",
            "sellDate": "2012/07/31",
            "sellPrice": "7.78",
            "currPrice": "7.65"
        };

        var item2 = {
            "code": "sz002146",
            "name": "荣盛发展",
            "buyDate": "2012/07/12",
            "buyPrice": "9.78",
            "buyVolumn": "1000",
            "sellDate": "2012/07/31",
            "sellPrice": "10.78",
            "currPrice": "10.24"
        };
    

        var myArray = new Array();
        myArray.push(item1);
        myArray.push(item2);

        //console.log(myArray);
        res.json(myArray);
    });    

    /*
    // chat area
    app.get('/chat', function(req, res) {
    res.render('chat', { title: 'Chat with Me!  ' })
    });

    // about page
    app.get('/about', function(req, res) {
    res.render('about', { title: 'About Me.  ' })
    });    
    */
}