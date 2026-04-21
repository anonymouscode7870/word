import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [save, setSave] = useState(false);
  const [address, setAddress] = useState(localStorage.getItem("address") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSave(true);
      localStorage.setItem("address", address);
      console.log("Data saved to localStorage");
    }, 1000);

    return () => (clearTimeout(timer), setSave(false));
  }, [address]);

  const changeHandler = (event) => {
    setAddress(event.target.value);
  };

  return (
    <>
      <label htmlFor="address">Address : </label>
      <textarea
        name="address"
        id="address"
        value={address}
        onChange={(event) => changeHandler(event)}
      ></textarea>

      <div>{save ? "Saved 👱‍♂️" : "Typing"}</div>
    </>
  );
}

export default App;
