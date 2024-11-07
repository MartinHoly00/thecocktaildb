import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import { DrinkCard } from "./Components/DrinkCard";
import DrinkDetail from "./Components/DrinkDetail";

function App() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [isDrinkDetail, setIsDrinkDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a`;
        if (search) {
          url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`;
        }
        if (filter) {
          url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${filter}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Chyba! " + response.status);
        }
        const encodedData = await response.json();
        setData(encodedData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Neznámá chyba"));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, filter]);

  useEffect(() => {
    // Fetch default cocktails when the component mounts
    const fetchDefaultCocktails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`
        );
        if (!response.ok) {
          throw new Error("Chyba! " + response.status);
        }
        const encodedData = await response.json();
        setData(encodedData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Neznámá chyba"));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDefaultCocktails();
  }, []);

  return (
    <Router>
      <div className="app-container">
        {!isDrinkDetail && (
          <header>
            <h1>Koktejly</h1>
            <input
              type="text"
              placeholder="Hledat koktejl..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select onChange={(e) => setFilter(e.target.value)}>
              <option value="">Vyberte filtr</option>
              <option value="vodka">Vodka</option>
              <option value="gin">Gin</option>
              <option value="rum">Rum</option>
            </select>
          </header>
        )}
        {loading && <p>Načítám data...</p>}
        {error && <p>CHYBA: {error.message}</p>}
        <Routes>
          <Route
            path="/"
            element={
              data && data.drinks && Array.isArray(data.drinks) ? (
                <div className="drink-list">
                  {data.drinks.map((drink: any) => (
                    <DrinkCard
                      key={drink.idDrink}
                      idDrink={drink.idDrink}
                      strDrink={drink.strDrink}
                      strDrinkThumb={drink.strDrinkThumb}
                      strInstructions={drink.strInstructions}
                      setIsDrinkDetail={setIsDrinkDetail}
                    />
                  ))}
                </div>
              ) : (
                <p>No drinks found</p>
              )
            }
          />
          <Route
            path="/drink/:id"
            element={<DrinkDetail setIsDrinkDetail={setIsDrinkDetail} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
