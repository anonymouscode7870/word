import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [selectedtab, setSelectedtab] = useState(0);

  let tabs = [
    {
      name: "Home",
      content: (
        <div>
          <h2>Home</h2>
          <p>Welcome to the home page!</p>
        </div>
      ),
    },
    {
      name: "Profile",
      content: (
        <div>
          <h2>Profile</h2>
          <p>This is the profile page.</p>
        </div>
      ),
    },
    {
      name: "About",
      content: (
        <div>
          <h2>About</h2>
          <p>This is the about page.</p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Dynamic Component</h1>
      <div className="app">
        {tabs.map((tab, index) => {
          return (
            <div key={index}>
              <button className={` ${selectedtab === index ? "active" : ""}`}
                onClick={() => {
                  setSelectedtab(index);
                }}
              >
                {tab.name}
              </button>
            </div>
          );
        })}
      </div>
      <div className="content">
        {tabs[selectedtab].content}
      </div>
    </div>
  );
}

export default App;
