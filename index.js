function App() {
  const [countryData, setCountryData] = React.useState([]);
  const [dataType, setDataType] = React.useState("casesPerOneMillion");
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://disease.sh/v3/covid-19/countries?sort=' + dataType);
      const data = await response.json();
      console.log(data);
      setCountryData(data);
    }
    fetchData();
  }, [dataType]);
  return (
    <div>
      <h1>Covid19 Data</h1>
      <select name="datatype" id="datatype"
      onChange={(e) => setDataType(e.target.value)}
      value={dataType}>
        <option value="casesPerOneMillion">casesPerOneMillion</option>
        <option value="cases">cases</option>
        <option value="deaths">deaths</option>
        <option value="tests">tests</option>
        <option value="deathsPerOneMillion">deathsPerOneMillion</option>
      </select>
    
      
      <div className="visHolder">
        <BarChart
          data={countryData}
          height={500}
          widthOfBar={5}
          width={countryData.length * 5}
          dataType={dataType}
        />
      </div>
    </div>
  );
  }
  
  function BarChart({ data, height, width, widthOfBar, dataType }) {
    React.useEffect(() => {
      createBarChart();
    }, [data]);
  
    const createBarChart = () => {
      const countryData = data.map((country) => country[dataType]);
      const countries = data.map((country) => country.country);
      console.log('countryData', countryData);
      let tooltip = d3
      .select('.visHolder')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);  

          
      const dataMax = d3.max(countryData);
      const yScale = d3.scaleLinear().domain([0, dataMax]).range([0, height]);
      d3.select('svg').selectAll('rect')
        .data(countryData)
        .enter()
        .append('rect')
        .attr('key', (d, i) => i)
        .style('fill', (d, i) => (i % 2 === 0 ? '#9595ff' : '#44ff44'))
        .attr('x', (d, i) => i * widthOfBar)
        .attr('y', (d) => height - yScale(d + dataMax * 0.1))
        .attr('height', (d, i) => yScale(d + dataMax * 0.1))
        .attr('width', widthOfBar)
        .on('mouseover', (event, d, i) => {
          tooltip.style('opacity', 0.9)
            .html(`country: ${i}  <br>${dataType}: ` + d)
            .style('left', i * widthOfBar + 20 + 'px')
            .style('top', d3.event.pageY - 170 + 'px');
        });
    };
  
    return <svg width={width} height={height}></svg>;
  }
  
  ReactDOM.render(<App />, document.getElementById('root'));
  