import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import './MatrixGrid.css';

const ColorGrid = () => {
  const [matrix, setMatrix] = useState(Array.from({ length: 16 }, () => Array(16).fill('#000000')));
  const [color, setColor] = useState('#ff0000');
  const [mousePressed, setMousePressed] = useState(false);

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

  const handleSendClick = () => {

    const rgbMatrix = matrix.flatMap(row => row.map(cellColor => {
      if (cellColor) {
        const [r, g, b] = hexToRgb(cellColor);
        return { red: r, green: g, blue: b };
      }
      return { red: 255, green: 255, blue: 255 };
    }));

    console.log(rgbMatrix);
    fetch('matrix/rgb/hello_world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rgbMatrix)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  return (
    <Container onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="d-flex align-items-start">
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
            <Button variant="primary" size="lg" onClick={handleSendClick}>Send</Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ColorGrid;
