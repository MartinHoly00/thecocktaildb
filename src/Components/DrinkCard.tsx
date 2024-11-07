import { Link } from "react-router-dom";
import "./DrinkCard.css";

type DrinkCardProps = {
  strDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
  idDrink: string;
  setIsDrinkDetail: (isDrinkDetail: boolean) => void;
};

export const DrinkCard = ({
  strDrink,
  strDrinkThumb,
  strInstructions,
  idDrink,
  setIsDrinkDetail,
}: DrinkCardProps) => {
  return (
    <div className="drink-card" onClick={() => setIsDrinkDetail(true)}>
      <Link to={`/drink/${idDrink}`}>
        <img src={strDrinkThumb} alt={strDrink} />
        <h2>{strDrink}</h2>
      </Link>
      <p>{strInstructions}</p>
    </div>
  );
};
