import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./DrinkDetail.css";

type DrinkDetailProps = {
  setIsDrinkDetail: (isDrinkDetail: boolean) => void;
};

const DrinkDetail = ({ setIsDrinkDetail }: DrinkDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const [drink, setDrink] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDrink = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        if (!response.ok) {
          throw new Error("Chyba! " + response.status);
        }
        const data = await response.json();
        setDrink(data.drinks[0]);
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
    fetchDrink();
  }, [id]);

  if (loading) return <p>Načítám data...</p>;
  if (error) return <p>CHYBA: {error.message}</p>;
  if (!drink) return null;

  return (
    <div className="drink-detail">
      <img src={drink.strDrinkThumb} alt={drink.strDrink} />
      <h2>{drink.strDrink}</h2>
      <p>
        <strong>Category:</strong> {drink.strCategory}
      </p>
      <p>
        <strong>Type:</strong> {drink.strAlcoholic}
      </p>
      <p>
        <strong>Glass:</strong> {drink.strGlass}
      </p>
      <p>
        <strong>Instructions:</strong> {drink.strInstructions}
      </p>
      <h3>Ingredients</h3>
      <ul>
        {Object.keys(drink)
          .filter((key) => key.startsWith("strIngredient") && drink[key])
          .map((key) => (
            <li key={key}>
              {drink[key]}{" "}
              {drink[`strMeasure${key.slice(13)}`]
                ? `- ${drink[`strMeasure${key.slice(13)}`]}`
                : ""}
            </li>
          ))}
      </ul>
      <Link
        to="/"
        className="back-to-list__button"
        onClick={() => setIsDrinkDetail(false)}
      >
        Back to list
      </Link>
    </div>
  );
};

export default DrinkDetail;
