import { useEffect, useState } from "react";
import Game from "../components/Game";
import { fetchCities, fetchStates, fetchCountries } from "../api/geo";
export default function GamePage({}) {
    const [entityType, setEntityType] = useState(null);
    const [targetEntity, setTargetEntity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
      if (!entityType) return;
      const load = async () => {
        try{
          let data;
          if (entityType === "cities") {
            console.log("entity type is cities")
            data = await fetchCities();
          } else if (entityType === "states") {
            console.log("entity type is states")
            data = await fetchStates();
          } else if (entityType === "countries") {
            console.log("entity type is countries")
            data = await fetchCountries();
          } else {
            console.log(" no entity type")
            data = [];
          }
          const entityList = data || [];
          if (entityList.length > 0){
            const randomEntity = entityList[Math.floor(Math.random()*entityList.length)];
            setTargetEntity(randomEntity)
          }
          else{
            console.log("no entity list")
          }
        } catch {
          setError("Data could not be loaded.");
        } finally {
          setLoading(false);
        }
      };
      setTargetEntity(null);
      setLoading(true);
      setError("");
      load();
    }, [entityType]);
  return (
    <div>
        <div>
          <button onClick={() => setEntityType("cities")}>Cities</button>
          <button onClick={() => setEntityType("states")}>States</button>
          <button onClick={() => setEntityType("countries")}>Countries</button>
        </div>
        {!entityType && <p>Please select an entity type to start the game</p>}
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {targetEntity && !loading && !error &&(
        <Game entityType={entityType} targetEntity={targetEntity} />
        )}
    </div>
  )
}