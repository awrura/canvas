// import React, { useState } from 'react';
// import { Container, Button, FormControl } from 'react-bootstrap';
// import { SketchPicker } from 'react-color';
// import './MatrixGrid.css';
//
// const ColorGrid = () => {
//   const [matrix, setMatrix] = useState(Array.from({ length: 16 }, () => Array(16).fill('#000000')));
//   const [color, setColor] = useState('#ff0000');
//   const [mousePressed, setMousePressed] = useState(false);
//   const [matrixName, setMatrixName] = useState('');
//
//   const handleMouseDown = () => setMousePressed(true);
//   const handleMouseUp = () => setMousePressed(false);
//
//   const toggleCellColor = (rowIndex, colIndex) => {
//     setMatrix((prevMatrix) =>
//       prevMatrix.map((row, rIndex) =>
//         row.map((cellColor, cIndex) => (rIndex === rowIndex && cIndex === colIndex) ? (cellColor === color ? null : color) : cellColor)
//       )
//     );
//   };
//
//   const handleCellClick = (rowIndex, colIndex) => {
//     if (!mousePressed) toggleCellColor(rowIndex, colIndex);
//   };
//
//   const handleCellMouseEnter = (rowIndex, colIndex) => {
//     if (mousePressed) {
//       setMatrix((prevMatrix) =>
//         prevMatrix.map((row, rIdx) =>
//           row.map((cellColor, cIdx) => ((rIdx === rowIndex && cIdx === colIndex) ? color : cellColor))
//         )
//       );
//     }
//   };
//
//   const handleColorChange = (colorResult) => setColor(colorResult.hex);
//
//   const handleMatrixNameChange = (event) => setMatrixName(event.target.value);
//
//   const handleSendClick = () => {
//     if (!matrixName) {
//       alert('Пожалуйста, введите имя матрицы.');
//       return;
//     }
//
//     const rgbMatrix = matrix.flatMap(row => row.map(cellColor => {
//       if (cellColor) {
//         const [r, g, b] = hexToRgb(cellColor);
//         return { red: r, green: g, blue: b };
//       }
//       return { red: 0, green: 0, blue: 0 };
//     }));
//
//     fetch(`matrix/rgb/${matrixName}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(rgbMatrix)
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log('Success:', data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   };
//
//   const hexToRgb = (hex) => {
//     const bigint = parseInt(hex.slice(1), 16);
//     const r = (bigint >> 16) & 255;
//     const g = (bigint >> 8) & 255;
//     const b = bigint & 255;
//     return [r, g, b];
//   };
//
//   return (
//     <Container onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
//       <div className="d-flex align-items-start flex-column">
//         <FormControl
//           className="mb-3"
//           placeholder="Введите имя матрицы"
//           value={matrixName}
//           onChange={handleMatrixNameChange}
//         />
//         <div className="d-flex">
//           <div className="grid-container mr-3">
//             {matrix.map((row, rowIndex) =>
//               row.map((cellColor, colIndex) => (
//                 <div
//                   key={`${rowIndex}-${colIndex}`}
//                   className="square"
//                   style={{ backgroundColor: cellColor || 'black' }}
//                   onClick={() => handleCellClick(rowIndex, colIndex)}
//                   onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
//                 >
//                   <div></div>
//                 </div>
//               ))
//             )}
//           </div>
//           <div className="mb-2 sketchpicker-container">
//             <SketchPicker className="mb-3" color={color} disableAlpha onChangeComplete={handleColorChange} />
//             <div className="d-flex justify-content-end mb-3">
//               <Button variant="primary" size="lg" onClick={handleSendClick} disabled={!matrixName}>Send</Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// };
//
// export default ColorGrid;
import React, { useState, useEffect } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { BsGrid } from 'react-icons/bs';
import './MatrixGrid.css';

const ColorGrid = ({ api }) => {
  const [matrix, setMatrix] = useState(Array.from({ length: 16 }, () => Array(16).fill('#000000')));
  const [color, setColor] = useState('#ff0000');
  const [mousePressed, setMousePressed] = useState(false);
  const [matrixName, setMatrixName] = useState('');
  const [availableMatrices, setAvailableMatrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка доступных матриц
  useEffect(() => {
    const fetchMatrices = async () => {
      try {
        const response = await api.get('/matrix/my');
        setAvailableMatrices(response.data);
        if (response.data.length > 0) {
          setMatrixName(response.data[0].name);
        }
      } catch (error) {
        console.error('Error fetching matrices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatrices();
  }, [api]);

  const handleMouseDown = () => setMousePressed(true);
  const handleMouseUp = () => setMousePressed(false);

  const toggleCellColor = (rowIndex, colIndex) => {
    setMatrix((prevMatrix) =>
      prevMatrix.map((row, rIndex) =>
        row.map((cellColor, cIndex) => (rIndex === rowIndex && cIndex === colIndex) ? (cellColor === color ? null : color) : cellColor)
      )
    );
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (!mousePressed) toggleCellColor(rowIndex, colIndex);
  };

  const handleCellMouseEnter = (rowIndex, colIndex) => {
    if (mousePressed) {
      setMatrix((prevMatrix) =>
        prevMatrix.map((row, rIdx) =>
          row.map((cellColor, cIdx) => ((rIdx === rowIndex && cIdx === colIndex) ? color : cellColor))
        )
      );
    }
  };

  const handleColorChange = (colorResult) => setColor(colorResult.hex);

  const handleMatrixChange = (event) => setMatrixName(event.target.value);

  const handleSendClick = async () => {
    if (!matrixName) {
      alert('Пожалуйста, выберите матрицу.');
      return;
    }

    const rgbMatrix = matrix.flatMap(row => row.map(cellColor => {
      if (cellColor) {
        const [r, g, b] = hexToRgb(cellColor);
        return { red: r, green: g, blue: b };
      }
      return { red: 0, green: 0, blue: 0 };
    }));

    try {
      const response = await api.post(`matrix/rgb/${matrixName}`, rgbMatrix);
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="d-flex align-items-start flex-column">
        <div className="d-flex align-items-center mb-3 w-100">
          <BsGrid className="me-2" size={24} />
          <Form.Select 
            value={matrixName} 
            onChange={handleMatrixChange}
            className="flex-grow-1"
          >
            {availableMatrices.map((matrix) => (
              <option key={matrix.name} value={matrix.name}>
                {matrix.name} ({matrix.width}x{matrix.height})
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="d-flex">
          <div className="grid-container mr-3">
            {matrix.map((row, rowIndex) =>
              row.map((cellColor, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="square"
                  style={{ backgroundColor: cellColor || 'black' }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                >
                  <div></div>
                </div>
              ))
            )}
          </div>
          <div className="mb-2 sketchpicker-container">
            <SketchPicker className="mb-3" color={color} disableAlpha onChangeComplete={handleColorChange} />
            <div className="d-flex justify-content-end mb-3">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleSendClick} 
                disabled={!matrixName || availableMatrices.length === 0}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ColorGrid;
