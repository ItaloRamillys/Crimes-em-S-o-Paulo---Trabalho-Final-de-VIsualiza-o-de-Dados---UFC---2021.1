// https://observablehq.com/@italoramillys/meses-com-maior-incidencia-de-crimes-em-sao-paulo-cidade@1104
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Meses com maior incidência de crimes em São Paulo (Cidade)`
)});
  main.variable(observer("buildvis")).define("buildvis", ["md","container","dc","width","dateDim","xScale","d3","countCrimesGroup"], function(md,container,dc,width,dateDim,xScale,d3,countCrimesGroup)
{
  let view = md`${container('chart1','Meses com maior incidência de crimes em São Paulo (Cidade)')}`
  let lineChart = dc.lineChart(view.querySelector("#chart1"))
  lineChart.width(width)
           .height(400)
           .dimension(dateDim)
           .margins({top: 30, right: 50, bottom: 25, left: 40})
           .renderArea(false)
           .x(xScale)
           .xUnits(d3.timeDays)
           .renderHorizontalGridLines(true)
           .legend(dc.legend().x(width-200).y(10).itemHeight(13).gap(5))
           .brushOn(false)
           .group(countCrimesGroup, 'Meses')
           .ordinalColors(['#f63f3a'])
          .xAxis().tickFormat(d3.format("d"))
  
  
  dc.renderAll()
  return view      
}
);
  main.variable(observer("dataset")).define("dataset", ["d3"], function(d3){return(
d3.csv("https://gist.githubusercontent.com/ItaloRamillys/2da53f313621955a2e5c95a6cecb1d51/raw/1ed44f0cd864d16418d822dbe20edb50e537895b/crimes.csv").then(function(data){
  
  data = data.filter(function(d){
    let parseDate = d3.timeParse("%Y-%m-%d");
    let arr;
    arr = d.time.split(' ');
        if(parseDate(arr[0]).getFullYear() == 2009 || parseDate(arr[0]).getFullYear() == 2010 || parseDate(arr[0]).getFullYear() == 2011 || parseDate(arr[0]).getFullYear() == 2012){
            return false;
        }
        d.date = parseDate(arr[0]).getMonth()+1;
        return true;
  });
  
  return data;
})
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(".1f")
)});
  main.variable(observer("xScale")).define("xScale", ["d3","dateDim"], function(d3,dateDim){return(
d3.scaleTime().domain([dateDim.bottom(1)[0].date, dateDim.top(1)[0].date])
)});
  main.variable(observer()).define(["dateDim"], function(dateDim){return(
dateDim.top(1)[0].date
)});
  main.variable(observer()).define(["dateDim"], function(dateDim){return(
dateDim.bottom(1)[0].date
)});
  main.variable(observer("facts")).define("facts", ["crossfilter","dataset"], function(crossfilter,dataset){return(
crossfilter(dataset)
)});
  main.variable(observer("dateDim")).define("dateDim", ["facts"], function(facts){return(
facts.dimension(d => d.date)
)});
  main.variable(observer("dateMonthDim")).define("dateMonthDim", ["facts","d3"], function(facts,d3){return(
facts.dimension(d => d3.timeMonth(d.date))
)});
  main.variable(observer("countCrimesGroup")).define("countCrimesGroup", ["dateDim"], function(dateDim){return(
dateDim.group().reduceCount(d => d.date)
)});
  main.variable(observer("countCrimesMonthGroup")).define("countCrimesMonthGroup", ["dateMonthDim"], function(dateMonthDim){return(
dateMonthDim.group().reduceCount()
)});
  main.variable(observer()).define(["countCrimesMonthGroup"], function(countCrimesMonthGroup){return(
countCrimesMonthGroup.all()
)});
  main.variable(observer()).define(["countCrimesGroup"], function(countCrimesGroup){return(
countCrimesGroup.all()
)});
  main.variable(observer("container")).define("container", function(){return(
function container(id, title) { 
  return `
<div class='container'>
<div class='content'>
<div class='container'>
<div class='row'>
    <div class='span12' id='${id}'>
      <h4>${title}</h4>
    </div>
  </div>
</div>
</div>
</div>`
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<code>css</code> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<link rel="stylesheet" type="text/css" href="https://unpkg.com/dc@4/dist/style/dc.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
crossorigin=""/>
<style>
#mapid{
width:650px;
height:400px;
}
</style>`
)});
  main.variable(observer("dc")).define("dc", ["require"], function(require){return(
require('dc')
)});
  main.variable(observer("crossfilter")).define("crossfilter", ["require"], function(require){return(
require('crossfilter2')
)});
  main.variable(observer("L")).define("L", ["require"], function(require){return(
require('leaflet@1.6.0')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3')
)});
  main.variable(observer("$")).define("$", ["require"], function(require){return(
require('jquery').then(jquery => {
  window.jquery = jquery;
  return require('popper@1.0.1/index.js').catch(() => jquery);
})
)});
  return main;
}
