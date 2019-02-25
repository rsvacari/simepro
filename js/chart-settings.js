//DEFINIR A CONFIGURAÇÃO BÁSICA DO GRÁFICO
var dataA = {
	labels:[],
	datasets:[{
		label: "Temperatura",
		fill: false,
		data: [],
		borderColor: 'rgba(77,166,253,0.85)',
		backgroundColor: cor
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
				ticks: {
					autoSkip: true,
					maxTicksLimit: 10
				},
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
	responsive : true
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

	//var labels = [], datax=[];
	//var data; 
	var cor = [];
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
		    success: function(data,status,xhr) {
				$('#status').removeClass('label-warning').addClass('label-success')
				$('#status').text("Requisição Recebida!");
				$('#Temperatura').text(data.Temperatura);
				$('#Humidade').text(data.Humidade);
				i++;
				myLine.data.labels.push(new Date().formatMMDDYYYY());
				myLine.data.datasets.forEach((dataset) => {
					dataset.data.push(data.Temperatura);
				//myLine.datasets.backgroundColor = "red"; //bar 3
				});
				if (data.Temperatura > 27) {
				 cor = '#333';
				 //myLine.data.datasets.backgroundColor: '#333';
				}else{
					cor = ['transparent'];
				}
				myLine.update();
				console.log(data);
				
		    }
		  });
        return false;
    }
	    // Add a helper to format timestamp data
    Date.prototype.formatMMDDYYYY = function() {
        return this.getDate() +
        "/" +  (this.getMonth() + 1) +
        "/" +  this.getFullYear() +
		" " +  this.getHours() +
		":" +  this.getMinutes();
    }
		function alerta() {
		  alert("A Temperatura está acima de 27 graus!");
		}
    // A cada 1000 milis (1 segundo), faça uma nova requisição.
    setInterval(fazerRequisicao, 5000);
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
