$(document).ready(function() {

	function loadExplodingPie() {
		am4core.ready(function() {
		        
		    am4core.useTheme(am4themes_animated);
	        
	        var container = am4core.create("chartdiv", am4core.Container);
	        container.width = am4core.percent(90);
	        container.height = am4core.percent(100);
	        container.layout = "horizontal";

		    // Create chart instance
		    var chart = container.createChild(am4charts.PieChart);
		    chart.width = am4core.percent(75);
	        chart.radius = am4core.percent(60);
	        chart.numberFormatter.numberFormat = "#.";

	        var chartTitle = chart.titles.create();
	        chartTitle.text = "Region";
	        chartTitle.marginTop = 20;
	        chartTitle.fontSize = 16;

		    $.get("./data/region.json", function(regionJSON) {
		    	chart.data = JSON.parse(regionJSON);
		    })
		        		        
	        // Set inner radius
	        chart.innerRadius = am4core.percent(0);
	        
	        var innercircle = chart.series.push(new am4charts.PieSeries());
	        innercircle.dataFields.value = "amt";
	        innercircle.dataFields.category = "reg";
	        innercircle.slices.template.stroke = am4core.color("#fff");
	        innercircle.slices.template.strokeWidth = 2;
	        innercircle.slices.template.strokeOpacity = 1;
	        innercircle.ticks.template.disabled = true;
	        innercircle.alignLabels = false
	        innercircle.labels.template.text = "{category}";
	        innercircle.labels.template.radius = am4core.percent(-100);
	        innercircle.slices.template.tooltipText = "{value} Cases";
	        innercircle.slices.template.states.getKey("active").properties.shiftRadius = 0;

	        // Add and configure Series
	        var outercircle = chart.series.push(new am4charts.PieSeries());
	        outercircle.dataFields.value = "litres";
	        outercircle.dataFields.category = "region";
	        outercircle.slices.template.stroke = am4core.color("#fff");
	        outercircle.slices.template.strokeWidth = 2;
	        outercircle.slices.template.strokeOpacity = 1;
	        outercircle.ticks.template.disabled = true;
	        outercircle.alignLabels = false
	        outercircle.labels.template.text = "{category}";
	        outercircle.labels.template.radius = am4core.percent(-30);
	        outercircle.slices.template.tooltipText = "{value.percent}% ({value} Cases)";
	        outercircle.slices.template.states.getKey("hover").properties.scale = 1;
	        outercircle.slices.template.states.getKey("active").properties.shiftRadius = 0;

	        // This creates initial animation
	        outercircle.hiddenState.properties.opacity = 1;
	        outercircle.hiddenState.properties.endAngle = -90;
	        outercircle.hiddenState.properties.startAngle = -90;
	        innercircle.hiddenState.properties.opacity = 1;
	        innercircle.hiddenState.properties.endAngle = -90;
	        innercircle.hiddenState.properties.startAngle = -90;

	        
	        var chart2 = container.createChild(am4charts.PieChart);
	        chart2.width = am4core.percent(100);
	        chart2.radius = am4core.percent(70);
	        var chart2Title = chart2.titles.create();
	        chart2Title.text = "North Breeding Habitats";
	        chart2Title.marginTop = 20;
	        chart2Title.fontSize = 16;

	        //slices
	        outercircle.slices.template.events.on("hit", function(event) {
	            selectSlice(event.target.dataItem);
	            console.log(event.target.dataItem.dataContext);
	            chart2Title.text = event.target.dataItem.dataContext.region + " Breeding Habitats";
	        })
	        innercircle.slices.template.events.on("hit", function(event) {
	            selectSlice(event.target.dataItem);
	            chart2Title.text = event.target.dataItem.dataContext.reg + " Breeding Habitats";
	        })	        

	        var pieSeries2 = chart2.series.push(new am4charts.PieSeries());
	        pieSeries2.dataFields.value = "value";
	        pieSeries2.dataFields.category = "name";
	        pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
	        //pieSeries2.labels.template.radius = am4core.percent(50);
	        //pieSeries2.labels.template.inside = true;
	        //pieSeries2.labels.template.fill = am4core.color("#ffffff");
	        //pieSeries2.labels.template.disabled = true;
	        //pieSeries2.ticks.template.disabled = true;
	        pieSeries2.labels.template.text = "{category}";
	        pieSeries2.labels.template.radius = am4core.percent(20);
	        pieSeries2.alignLabels = true;
	        pieSeries2.events.on("positionchanged", updateLines);

	        var interfaceColors = new am4core.InterfaceColorSet();

	        var line1 = container.createChild(am4core.Line);
	        line1.strokeDasharray = "2,2";
	        line1.strokeOpacity = 0;
	        line1.stroke = interfaceColors.getFor("alternativeBackground");
	        line1.isMeasured = false;

	        var line2 = container.createChild(am4core.Line);
	        line2.strokeDasharray = "2,2";
	        line2.strokeOpacity = 0.;
	        line2.stroke = interfaceColors.getFor("alternativeBackground");
	        line2.isMeasured = false;

	        var selectedSlice = undefined;

	        function selectSlice(dataItem) {
	        	
	        	selectedSlice = dataItem.slice;

	        	var fill = selectedSlice.fill;
	        	var count = dataItem.dataContext.subData.length;
	        
	        	pieSeries2.colors.list = [];
	        	
	        	for (var i = 0; i < count; i++) {
	            	pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
	        	}

	        	chart2.data = dataItem.dataContext.subData;
	        	pieSeries2.appear();

	        	var middleAngle = selectedSlice.middleAngle;
	        	var firstAngle = outercircle.slices.getIndex(0).startAngle;
	        	var animation = outercircle.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
	        	animation.events.on("animationprogress", updateLines);

	        	selectedSlice.events.on("transformed", updateLines);

	        	//  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
	        	//  animation.events.on("animationprogress", updateLines)
	        }

	        function updateLines() {
		        if(selectedSlice) {
		            var p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
		            var p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

		            p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
		            p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

		            var p21 = { x: 0, y: -pieSeries2.pixelRadius };
		            var p22 = { x: 0, y: pieSeries2.pixelRadius };

		            p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
		            p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

		            line1.x1 = p11.x;
		            line1.x2 = p21.x;
		            line1.y1 = p11.y;
		            line1.y2 = p21.y;

		            line2.x1 = p12.x;
		            line2.x2 = p22.x;
		            line2.y1 = p12.y;
		            line2.y2 = p22.y;
		        }
	        }

	        chart.events.on("datavalidated", function() {
	        	setTimeout(function() {
	            	selectSlice(innercircle .dataItems.getIndex(0));
	            	selectSlice(outercircle.dataItems.getIndex(0));
	        	}, 1000);
	        });
    
	    });
	}

	function loadBurstGraph() {
		am4core.ready(function() {
        
	        am4core.useTheme(am4themes_animated);
	 
	        var chart = am4core.create("burstdiv", am4charts.PieChart);
	        chart.numberFormatter.numberFormat = "#.";
	        chart.innerRadius = am4core.percent(20);
	        
	        var legend = new am4charts.Legend();
			legend.parent = chart.chartContainer;
			legend.background.fill = am4core.color("#000");
			legend.background.fillOpacity = 0.05;
			legend.width = 130;
			legend.align = "right";
			legend.data = [{
			  "name": "January",
			  "fill":"#67b7dc"
			}, {
			  "name": "February",
			  "fill": "#6794dc"
			}, {
			  "name": "March",
			  "fill": "#6771dc"
			}, {
			  "name": "April",
			  "fill": "#8067dc"
			}, {
			  "name": "May",
			  "fill": "#a367dc"
			}, {
			  "name": "June",
			  "fill": "#c767dc"
			}, {
			  "name": "July",
			  "fill": "#dc67ce"
			}, {
			  "name": "August",
			  "fill": "#dc67ab"
			}, {
			  "name": "September",
			  "fill": "#dc6788"
			}, {
			  "name": "October",
			  "fill": "#dc6967"
			}, {
			  "name": "November",
			  "fill": "#dc8c67"
			}, {
			  "name": "December",
			  "fill": "#dcaf67"
			}];

	        var chartTitle = chart.titles.create();
	        chartTitle.text = "Temperature to Dengue Cases Correlation Graph";
	        chartTitle.marginTop = 30;
	        chartTitle.fontSize = 16;
	        
	        $.get("./data/month.json", function(jsonData) {
	        	chart.data = JSON.parse(jsonData);
	        });
	        
	        // Add and configure Series
	        var pieSeries = chart.series.push(new am4charts.PieSeries());
	        pieSeries.dataFields.value = "Cases";
	        pieSeries.dataFields.category = "Month";
	        pieSeries.slices.template.stroke = am4core.color("#fff");
	        pieSeries.slices.template.strokeWidth = 2;
	        pieSeries.slices.template.strokeOpacity = 1;
	        //  pieSeries.labels.template.text= "{category}";
	        pieSeries.slices.template.tooltipText = "{value.percent}% ({value} Cases)";

	        // Disabling labels and ticks on inner circle
	        pieSeries.labels.template.disabled = true;
	        pieSeries.ticks.template.disabled = true;
	        
	        // Disable sliding out of slices
	        pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
	        pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	        pieSeries.slices.template.states.getKey("hover").properties.scale = 0.9;
	        
	        // Add second series
	        var pieSeries2 = chart.series.push(new am4charts.PieSeries());
	        //pieSeries2.disabled = true;
	        pieSeries2.dataFields.value = "Temperature";
	        pieSeries2.dataFields.category = "Month";
	        pieSeries2.slices.template.stroke = am4core.color("#fff");
	        pieSeries2.slices.template.strokeWidth = 2;
	        pieSeries2.slices.template.strokeOpacity = 1;
	        pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	        pieSeries2.slices.template.states.getKey("hover").properties.scale = 1.1;
	        pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
	        pieSeries2.labels.template.text = "{value} °C";
	        pieSeries2.labels.template.disabled = true;
	        pieSeries2.ticks.template.disabled = true;
	        pieSeries2.slices.template.tooltipText = "Temperature: ({value}°C)";

	        // pieSeries.slices.template.events.on("hit", function(event) {
	        //     selectSlice(event.target.dataItem);
	        // })

	        // pieSeries2.slices.template.events.on("hit", function(event) {
	        //     selectThirdSlice(event.target.dataItem);
	        // })	 

	        legend.itemContainers.template.events.on("hit", function(ev) {
 				if(ev.target.dataItem.dataContext.name == "January") {
 					if(chart.data[0].Cases != 0 ) {
 						chart.data[0].Cases = 0;
 						chart.data[0].Temperature = 0;
 						chart.data[0].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[0].Cases = data[0].Cases;
 							chart.data[0].Temperature = data[0].Temperature;
 							chart.data[0].Rainfall = data[0].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "February") {
 					if(chart.data[1].Cases != 0 ) {
 						chart.data[1].Cases = 0;
 						chart.data[1].Temperature = 0;
 						chart.data[1].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[1].Cases = data[1].Cases;
 							chart.data[1].Temperature = data[1].Temperature;
 							chart.data[1].Rainfall = data[1].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "March") {
 					if(chart.data[2].Cases != 0 ) {
 						chart.data[2].Cases = 0;
 						chart.data[2].Temperature = 0;
 						chart.data[2].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[2].Cases = data[2].Cases;
 							chart.data[2].Temperature = data[2].Temperature;
 							chart.data[2].Rainfall = data[2].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "April") {
 					if(chart.data[3].Cases != 0 ) {
 						chart.data[3].Cases = 0;
 						chart.data[3].Temperature = 0;
 						chart.data[3].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[3].Cases = data[3].Cases;
 							chart.data[3].Temperature = data[3].Temperature;
 							chart.data[3].Rainfall = data[3].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "May") {
 					if(chart.data[4].Cases != 0 ) {
 						chart.data[4].Cases = 0;
 						chart.data[4].Temperature = 0;
 						chart.data[4].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[4].Cases = data[4].Cases;
 							chart.data[4].Temperature = data[4].Temperature;
 							chart.data[4].Rainfall = data[4].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "June") {
 					if(chart.data[5].Cases != 0 ) {
 						chart.data[5].Cases = 0;
 						chart.data[5].Temperature = 0;
 						chart.data[5].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[5].Cases = data[5].Cases;
 							chart.data[5].Temperature = data[5].Temperature;
 							chart.data[5].Rainfall = data[5].Rainfall;
 							chart.invalidateData();
 						})
 					} 
 				} else if(ev.target.dataItem.dataContext.name == "July") {
 					if(chart.data[6].Cases != 0 ) {
 						chart.data[6].Cases = 0;
 						chart.data[6].Temperature = 0;
 						chart.data[6].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[6].Cases = data[6].Cases;
 							chart.data[6].Temperature = data[6].Temperature;
 							chart.data[6].Rainfall = data[6].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "August") {
 					if(chart.data[7].Cases != 0 ) {
 						chart.data[7].Cases = 0;
 						chart.data[7].Temperature = 0;
 						chart.data[7].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[7].Cases = data[7].Cases;
 							chart.data[7].Temperature = data[7].Temperature;
 							chart.data[7].Rainfall = data[7].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "September") {
 					if(chart.data[8].Cases != 0 ) {
 						chart.data[8].Cases = 0;
 						chart.data[8].Temperature = 0;
 						chart.data[8].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[8].Cases = data[8].Cases;
 							chart.data[8].Temperature = data[8].Temperature;
 							chart.data[8].Rainfall = data[8].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "October") {
 					if(chart.data[9].Cases != 0 ) {
 						chart.data[9].Cases = 0;
 						chart.data[9].Temperature = 0;
 						chart.data[9].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[9].Cases = data[9].Cases;
 							chart.data[9].Temperature = data[9].Temperature;
 							chart.data[9].Rainfall = data[9].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "November") {
 					if(chart.data[10].Cases != 0 ) {
 						chart.data[10].Cases = 0;
 						chart.data[10].Temperature = 0;
 						chart.data[10].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[10].Cases = data[10].Cases;
 							chart.data[10].Temperature = data[10].Temperature;
 							chart.data[10].Rainfall = data[10].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "December") {
 					if(chart.data[11].Cases != 0 ) {
 						chart.data[11].Cases = 0;
 						chart.data[11].Temperature = 0;
 						chart.data[11].Rainfall = 0;
 						chart.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart.data[11].Cases = data[11].Cases;
 							chart.data[11].Temperature = data[11].Temperature;
 							chart.data[11].Rainfall = data[11].Rainfall;
 							chart.invalidateData();
 						})
 					}
 				}
			});       

	        function selectSlice(dataItem){
	           //pieSeries2.disabled = false;
	           if(pieSeries2.disabled == true) {
	           		pieSeries2.disabled = false;
	           		pieSeries2.appear();
	           } else {
	           		pieSeries2.disabled = true;
	           		pieSeries3.disabled = true;
	           }    
	        }

	        function selectThirdSlice(dataItem) {
	           if(pieSeries3.disabled == true) {
	           		pieSeries3.disabled = false;
	           		pieSeries3.appear();
	           } else {
	           		pieSeries3.disabled = true;
	           } 
	        }

	   	}); // end am4core.ready()
	}

	function loadBurstGraph2() {
		am4core.ready(function() {
        
	        am4core.useTheme(am4themes_animated);
	 
	        var chart2 = am4core.create("burstdiv2", am4charts.PieChart);
	        chart2.numberFormatter.numberFormat = "#.";
	        chart2.innerRadius = am4core.percent(20);
	        
	        var legend = new am4charts.Legend();
			legend.parent = chart2.chartContainer;
			legend.background.fill = am4core.color("#000");
			legend.background.fillOpacity = 0.05;
			legend.width = 130;
			legend.align = "right";
			legend.data = [{
			  "name": "January",
			  "fill":"#67b7dc"
			}, {
			  "name": "February",
			  "fill": "#6794dc"
			}, {
			  "name": "March",
			  "fill": "#6771dc"
			}, {
			  "name": "April",
			  "fill": "#8067dc"
			}, {
			  "name": "May",
			  "fill": "#a367dc"
			}, {
			  "name": "June",
			  "fill": "#c767dc"
			}, {
			  "name": "July",
			  "fill": "#dc67ce"
			}, {
			  "name": "August",
			  "fill": "#dc67ab"
			}, {
			  "name": "September",
			  "fill": "#dc6788"
			}, {
			  "name": "October",
			  "fill": "#dc6967"
			}, {
			  "name": "November",
			  "fill": "#dc8c67"
			}, {
			  "name": "December",
			  "fill": "#dcaf67"
			}];

	        var chartTitle = chart2.titles.create();
	        chartTitle.text = "Rainfall to Dengue Cases Correlation Graph";
	        chartTitle.marginTop = 30;
	        chartTitle.fontSize = 16;
	        
	        $.get("./data/month.json", function(jsonData) {
	        	chart2.data = JSON.parse(jsonData);
	        });
	        
	        // Add and configure Series
	        var pie2Series = chart2.series.push(new am4charts.PieSeries());
	        pie2Series.dataFields.value = "Cases";
	        pie2Series.dataFields.category = "Month";
	        pie2Series.slices.template.stroke = am4core.color("#fff");
	        pie2Series.slices.template.strokeWidth = 2;
	        pie2Series.slices.template.strokeOpacity = 1;
	        //  pieSeries.labels.template.text= "{category}";
	        pie2Series.slices.template.tooltipText = "{value.percent}% ({value} Cases)";

	        // Disabling labels and ticks on inner circle
	        pie2Series.labels.template.disabled = true;
	        pie2Series.ticks.template.disabled = true;
	        
	        // Disable sliding out of slices
	        pie2Series.slices.template.states.getKey("active").properties.shiftRadius = 0;
	        pie2Series.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	        pie2Series.slices.template.states.getKey("hover").properties.scale = 0.9;
	        
	        //Add Second Series
	        var pie2Series3 = chart2.series.push(new am4charts.PieSeries());
	        //pieSeries3.disabled = true;
	        pie2Series3.dataFields.value = "Rainfall";
	        pie2Series3.dataFields.category = "Month";
	        pie2Series3.slices.template.stroke = am4core.color("#fff");
	        pie2Series3.slices.template.strokeWidth = 2;
	        pie2Series3.slices.template.strokeOpacity = 1;
	        pie2Series3.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	        pie2Series3.slices.template.states.getKey("hover").properties.scale = 1.1;
	        pie2Series3.slices.template.states.getKey("active").properties.shiftRadius = 0;
	        pie2Series3.labels.template.disabled = true;
	        //pieSeries3.ticks.template.disabled = true;
	        pie2Series3.slices.template.tooltipText = "Rainfall: ({value} CM)";
	        pie2Series3.labels.template.text = "{category}";

	        // pieSeries.slices.template.events.on("hit", function(event) {
	        //     selectSlice(event.target.dataItem);
	        // })

	        // pieSeries2.slices.template.events.on("hit", function(event) {
	        //     selectThirdSlice(event.target.dataItem);
	        // })	 

	        legend.itemContainers.template.events.on("hit", function(ev) {
 				if(ev.target.dataItem.dataContext.name == "January") {
 					if(chart2.data[0].Cases != 0 ) {
 						chart2.data[0].Cases = 0;
 						chart2.data[0].Temperature = 0;
 						chart2.data[0].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[0].Cases = data[0].Cases;
 							chart2.data[0].Temperature = data[0].Temperature;
 							chart2.data[0].Rainfall = data[0].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "February") {
 					if(chart2.data[1].Cases != 0 ) {
 						chart2.data[1].Cases = 0;
 						chart2.data[1].Temperature = 0;
 						chart2.data[1].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[1].Cases = data[1].Cases;
 							chart2.data[1].Temperature = data[1].Temperature;
 							chart2.data[1].Rainfall = data[1].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "March") {
 					if(chart2.data[2].Cases != 0 ) {
 						chart2.data[2].Cases = 0;
 						chart2.data[2].Temperature = 0;
 						chart2.data[2].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[2].Cases = data[2].Cases;
 							chart2.data[2].Temperature = data[2].Temperature;
 							chart2.data[2].Rainfall = data[2].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "April") {
 					if(chart2.data[3].Cases != 0 ) {
 						chart2.data[3].Cases = 0;
 						chart2.data[3].Temperature = 0;
 						chart2.data[3].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[3].Cases = data[3].Cases;
 							chart2.data[3].Temperature = data[3].Temperature;
 							chart2.data[3].Rainfall = data[3].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "May") {
 					if(chart2.data[4].Cases != 0 ) {
 						chart2.data[4].Cases = 0;
 						chart2.data[4].Temperature = 0;
 						chart2.data[4].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[4].Cases = data[4].Cases;
 							chart2.data[4].Temperature = data[4].Temperature;
 							chart2.data[4].Rainfall = data[4].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "June") {
 					if(chart2.data[5].Cases != 0 ) {
 						chart2.data[5].Cases = 0;
 						chart2.data[5].Temperature = 0;
 						chart2.data[5].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[5].Cases = data[5].Cases;
 							chart2.data[5].Temperature = data[5].Temperature;
 							chart2.data[5].Rainfall = data[5].Rainfall;
 							chart2.invalidateData();
 						})
 					} 
 				} else if(ev.target.dataItem.dataContext.name == "July") {
 					if(chart2.data[6].Cases != 0 ) {
 						chart2.data[6].Cases = 0;
 						chart2.data[6].Temperature = 0;
 						chart2.data[6].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[6].Cases = data[6].Cases;
 							chart2.data[6].Temperature = data[6].Temperature;
 							chart2.data[6].Rainfall = data[6].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "August") {
 					if(chart2.data[7].Cases != 0 ) {
 						chart2.data[7].Cases = 0;
 						chart2.data[7].Temperature = 0;
 						chart2.data[7].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[7].Cases = data[7].Cases;
 							chart2.data[7].Temperature = data[7].Temperature;
 							chart2.data[7].Rainfall = data[7].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "September") {
 					if(chart2.data[8].Cases != 0 ) {
 						chart2.data[8].Cases = 0;
 						chart2.data[8].Temperature = 0;
 						chart2.data[8].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[8].Cases = data[8].Cases;
 							chart2.data[8].Temperature = data[8].Temperature;
 							chart2.data[8].Rainfall = data[8].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "October") {
 					if(chart2.data[9].Cases != 0 ) {
 						chart2.data[9].Cases = 0;
 						chart2.data[9].Temperature = 0;
 						chart2.data[9].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[9].Cases = data[9].Cases;
 							chart2.data[9].Temperature = data[9].Temperature;
 							chart2.data[9].Rainfall = data[9].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "November") {
 					if(chart2.data[10].Cases != 0 ) {
 						chart2.data[10].Cases = 0;
 						chart2.data[10].Temperature = 0;
 						chart2.data[10].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[10].Cases = data[10].Cases;
 							chart2.data[10].Temperature = data[10].Temperature;
 							chart2.data[10].Rainfall = data[10].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				} else if(ev.target.dataItem.dataContext.name == "December") {
 					if(chart2.data[11].Cases != 0 ) {
 						chart2.data[11].Cases = 0;
 						chart2.data[11].Temperature = 0;
 						chart2.data[11].Rainfall = 0;
 						chart2.invalidateData(); 						
 					} else {
 						$.get("./data/month.json", function(jsonData) {
 							var data = JSON.parse(jsonData);
 							chart2.data[11].Cases = data[11].Cases;
 							chart2.data[11].Temperature = data[11].Temperature;
 							chart2.data[11].Rainfall = data[11].Rainfall;
 							chart2.invalidateData();
 						})
 					}
 				}
			});       

	        function selectSlice(dataItem){
	           //pieSeries2.disabled = false;
	           if(pie2Series2.disabled == true) {
	           		pie2Series2.disabled = false;
	           		pieSeries2.appear();
	           } else {
	           		pie2Series2.disabled = true;
	           		pieSeries3.disabled = true;
	           }    
	        }

	        function selectThirdSlice(dataItem) {
	           if(pie2Series3.disabled == true) {
	           		pie2Series3.disabled = false;
	           		pie2Series3.appear();
	           } else {
	           		pie2Series3.disabled = true;
	           } 
	        }

	   	}); // end am4core.ready()
	}	


	loadExplodingPie();
	loadBurstGraph();
	loadBurstGraph2();
})