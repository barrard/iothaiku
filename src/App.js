import { useEffect, useState } from "react";
import Socket from "./components/Socket";

import TempDataContext from "./context/TempData";
import TempCharts from "./components/TempCharts";

function App() {
  const [temps, setTemps] = useState([]);

  useEffect(() => {
    getTemps();

    Socket.on("temp_data", (data) => {
      setTemps([...temps, data]);
      // display_latest_temp_data(data);
    });

    return () => {
      Socket.off("rotor_data");
      Socket.off("temp_data");
    };
  }, []);

  const getTemps = async () => {
    console.log("get Temps");
    let temps = await fetch("/tempData");
    console.log(temps);
    temps = await temps.json();
    setTemps(temps);
  };
  const colors = {
    temp: "#00DBFF",
    humidity: "#2AFF00",
    pressure: "#FF6100",
  };
  const current = temps.slice(-1)[0];
  console.log(current);

  return (
    <TempDataContext.Provider value={{ temps }}>
      <div
        style={{
          background: "#333",
          color: "#ccc",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: colors["temp"] }}>Temp. {current?.temp}</h1>
        <h1 style={{ color: colors["humidity"] }}>
          Humidity {current?.humidity}
        </h1>
        <h1 style={{ color: colors["pressure"] }}>
          Pressure {current?.pressure}
        </h1>
        <h2 style={{ color: "#fff" }}>
          {new Date(current?.date || new Date()).toLocaleString()}
        </h2>
        <div
          style={{
            marginBottom: "1em",
            boxShadow: `1px 1px 10px 1px ${colors["temp"]}`,
          }}
        >
          <TempCharts
            label="temp"
            color={colors["temp"]}
            name="Temp."
            units="F."
          />
        </div>
        <div
          style={{
            marginBottom: "1em",
            boxShadow: `1px 1px 10px 1px ${colors["humidity"]}`,
          }}
        >
          <TempCharts
            label="humidity"
            color={colors["humidity"]}
            name="Humidity"
            units="%"
          />
        </div>

        <div
          style={{
            marginBottom: "1em",
            boxShadow: `1px 1px 10px 1px ${colors["pressure"]}`,
          }}
        >
          <TempCharts
            label="pressure"
            color={colors["pressure"]}
            name="Pressure"
            units="mb."
          />
        </div>
      </div>
    </TempDataContext.Provider>
  );
}

export default App;
