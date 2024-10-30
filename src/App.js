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
              src="awrura.png"
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
