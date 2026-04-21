import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({
    name: localStorage.getItem("name") || "",
    age: localStorage.getItem("age") || "",
  });

  useEffect(() => {
    console.log("Data is saving...");
    localStorage.setItem("name", data.name);
    localStorage.setItem("age", data.age);
  }, [data]);

  const handleChange = (e) => {
    console.log(e.target);
    console.log(e.target.name);
    console.log(e.target.value);

    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <>
      <h1>Problem: Refresh form data Loss</h1>
      <label htmlFor="name">Name :</label>
      <input
        type="text"
        id="name"
        value={data.name}
        name="name"
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="age">Age :</label>
      <input
        type="number"
        id="age"
        name="age"
        value={data.age}
        onChange={(e) => handleChange(e)}
      />
    </>
  );
}

export default App;
