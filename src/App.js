import './App.css';
import MatrixGrid from './MatrixGrid'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar className="bg-body-tertiary mb-4">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="https://avatars.githubusercontent.com/u/166029138?s=400&u=82feebfa4f6744dc35aada15971814d037d1ad01&v=4"
              width="35"
              height="35"
              className="d-inline-block align-top"
            />{' '}
            Awrura
          </Navbar.Brand>
        </Container>
      </Navbar>
      <MatrixGrid />
    </div>
  );
}

export default App;
