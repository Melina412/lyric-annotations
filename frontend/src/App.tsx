import './App.css';
import Home from './pages/Home';

function App() {
  let str = '勝っ';

  console.log({ str });
  let sliced = str.slice(-1);
  console.log({ sliced });

  return (
    <>
      <Home />
    </>
  );
}

export default App;
