import { Hello } from "../../components/Hello";

export const HelloPage = () => {
  return (
    <>
      <Hello />
      <button className="btn" onClick={() => console.log("hello")}>
        Hello
      </button>
    </>
  );
};
