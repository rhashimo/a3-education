<iframe id="datawrapper-chart-test" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="300"></iframe>


// Set dataset
var wealth_status = 'data/wealth_status.csv'
var wealth_int_type = 'data/wealth_int-type.csv'
var wealth_basic = 'data/wealth_basic.csv'
var wealth_arith = 'data/wealth_arith.csv'
var wealth_eng = 'data/wealth_eng.csv'

function update_Dwrap(input_data){

	if(input_data == 'data/wealth_status.csv'){
		document.getElementById("datawrapper-chart-test").src = "//datawrapper.dwcdn.net/NzjJ7/1/";

	}else{
		document.getElementById("datawrapper-chart-test").src = "//datawrapper.dwcdn.net/poTHi/1/";
	}
}

update_Dwrap(wealth_status)
