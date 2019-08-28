console.log('main')
/* vars */

const latest_temp = document.getElementById('latest_temp')
const latest_humidty = document.getElementById('latest_humidty')
const latest_pressure = document.getElementById('latest_pressure')
const latest_tempData_date = document.getElementById('latest_tempData_date')

main()

async function main(){
  /* get tempData */
  let tempData = await request_temp_data()

  /* find min and max temp, pressure, humidity */

  /* make charts */
  make_dimple_chart('temp_chart', tempData, 'temp')
  make_dimple_chart('pressure_chart', tempData, 'pressure')
  make_dimple_chart('humidity_chart', tempData, 'humidity')
}










/* function to grab temp data */

async function request_temp_data(){
  let tempData  = await $.get(`/tempData`)
  return tempData

}

function display_latest_temp_data(tempData){
  $(latest_temp).text(tempData.temp)
$(latest_humidty).text(tempData.humidity)
$(latest_pressure).text(tempData.pressure)

$(latest_tempData_date).text(new Date(tempData.data).toLocaleString()
)
}


/* Celsius Celcius to Fahrenheit */
function C_to_F(C){
  return C ? 
   (C * 9/5) + 32
   :
   'N/A'
}


function make_dimple_chart(divId, data, prop){
  // console.log(data)
  let svg = dimple.newSvg(`#${divId}`, 600, 300);
  // data = dimple.filterData(data, "Owner", ["Aperture", "Black Mesa"])
  let myChart = new dimple.chart(svg, data);
  myChart.setBounds(60, 30, 505, 305);
      // setMargins(left, top, right, bottom) 
  myChart.setMargins(50, 0, 0, 40) 
  let x = myChart.addTimeAxis("x", "trueDate");
  // x.dateParseFormat = "%H:%M:%S"
  x.tickFormat = "%H:%M:%S"
  // x.timeInterval = 4
  x.addOrderRule("time");
  let y = myChart.addMeasureAxis("y", `${prop}`);
  let prop_min = getMin(data, prop)
  let prop_max = getMax(data, prop)
  console.log({prop_max, prop_min, prop})
  y.overrideMax = prop_max +(prop_max* .1);
  y.overrideMin = prop_min - (prop_min*.2);
  
  let s = myChart.addSeries(null, dimple.plot.line);
  myChart.draw();
}


function getMin(data,prop) {
  return parseFloat(data.reduce((min, p) => p[prop] < min ? p[prop] : min, data[0][prop]));
}
function getMax(data,prop) {
  return parseFloat(data.reduce((max, p) => p[prop] > max ? p[prop] : max, data[0][prop]));
}