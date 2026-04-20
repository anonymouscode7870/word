import "./App.css";
import useLocalStorage from "./Hooks/localStorage";

function App() {
  const [user, setUser] = useLocalStorage("username", "");

  // i want id as well, but i want to use the same hook, so i can do this:
  const [id, setId] = useLocalStorage("id", "");

  return (
    <>
      <h2>Custom Hook Example</h2>
      <input
        placeholder="name"
        type="text"
        onChange={(e) => setUser(e.target.value)}
      />

      <p>Hello, {user}!</p>

      <input
        placeholder="id"
        type="text"
        onChange={(e) => setId(e.target.value)}
      />
      <p>Hello, {id}!</p>
    </>
  );
}

export default App;
