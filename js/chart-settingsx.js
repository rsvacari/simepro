//DEFINIR A CONFIGURAÇÃO BÁSICA DO GRÁFICO
var dataA = {
	labels:labels,
	datasets:[{
		label: "Temperatura",
		fill: false,
		data: datax,
		borderColor: 'rgba(77,166,253,0.85)',
		backgroundColor: 'transparent'
	}]
};
var config =  {
	type: 'line',
	data : dataA,
	options:{
		responsive:true,
		title:{
			display: true,
			text: 'Temperatura Registrada pelo Arduino'
		},
		tooltips:{
			mode: 'nearest',
			intersect: true
		},
		scales:{
			xAxes:[{
				display: true,

				scaleLabel:{
					display: true,
					labelString: 'Tempo (hs)'
				}
			}],
			yAxes:[{
				display: true,
				//stacked: true,
				ticks:{
					min: 10,
					max: 50
				},
				gridLines:{
					display: true
				},
				scaleLabel:{
					display: true,
					labelString: 'Temperaturas (°C)'
				}
			}]
		}
	}
};
//INICIAR O GRÁFICO COM AS CONFIGURAÇÕES DEFINIDAS AO CARREGAR A PÁGINA
var ctx;

window.onload = function(){
	fazerRequisicao()
	ctx = document.getElementById('chart').getContext('2d');
	window.myLine = new Chart(ctx, config);
};
//RECEBER OS LIMITES
function onChangeMinimo() {
	var minimo = parseInt(document.getElementById("minimo").value);
	myLine.config.options.scales.yAxes[0].ticks.min = minimo;
	myLine.update();
}
function onChangeMaximo(){
	//tem que converter pois o valor que vem do input é uma string
	var maximo = parseInt(document.getElementById("maximo").value);
	myLine.config.options.scales.yAxes[0].ticks.max = maximo;
	myLine.update();
}

var url = 'http://186.250.72.126:1000';
//var url = 'http://192.168.1.20:1000';

	var labels = [], datax=[];
	//var data; 
    var i = 0;
	function fazerRequisicao(){
		$('#status').removeClass('label-success').addClass('label-warning');
		$('#status').text("Enviando Requisição...");
    	$.ajax({
		    url: url,
		    data: { '': ''}, // usaremos em proximas versões
		    dataType: 'jsonp', // IMPORTANTE
		    crossDomain: true, // IMPORTANTE
		    jsonp: false,
		    jsonpCallback: 'dados', // IMPORTANTE
  }).done(function (results) {

    // Split timestamp and data into separate arrays
    var labels = [], datax=[];
    results["dados"].forEach(function(data) {
      labels.push(parseFloat(data.Humidade));
      datax.push(parseFloat(data.Temperatura));
	  $('#Temperatura').text(datax.Temperatura);
    });
  });
	}
 
    // A cada 1000 milis (1 segundo), faça uma nova requisição.
    setInterval(fazerRequisicao, 500);
  	// Acredito que 3000 (3 segundos) ou mais seja o ideal para um serviço online.
  	// Caso use local host, arrisco colocar ate 400 milis, você tera uma boa resposta. 

/*
function removeData(chart){
	chart.data.labels.pop();
	chart.data.datasets.forEach((dataset)=>{
		dataset.data.pop();
	});
	chart.update();
}*/
