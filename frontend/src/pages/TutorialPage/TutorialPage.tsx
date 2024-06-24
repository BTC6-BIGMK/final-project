import { Link } from "react-router-dom";
export const TutorialPage = () => {
  return (
    <>
      <div className="flex justify-center items-center h-full">
        <Link to="/spots-map">
          <button className="btn btn-accent">スタート</button>
        </Link>
      </div>
    </>
  );
};
