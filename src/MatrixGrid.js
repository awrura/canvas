import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Toast } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { BsGrid } from 'react-icons/bs';
import './MatrixGrid.css';
import BrightnessSlider from './BrightnessSlider.js' 

const hexToRgb = hex => {
  const bigint = parseInt(hex.slice(1), 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
};

const GridCell = ({ cellColor, rowIndex, colIndex, onCellClick, onCellHover }) => (
  <div
    className="square"
    style={{ backgroundColor: cellColor || 'black' }}
    onClick={() => onCellClick(rowIndex, colIndex)}
    onMouseEnter={() => onCellHover(rowIndex, colIndex)}
  />
);

const MatrixControls = ({ matrixName, availableMatrices, onMatrixChange }) => (
  <div className="d-flex align-items-center mb-3 w-100">
    <BsGrid className="me-2" size={24} />
    <Form.Select value={matrixName} onChange={onMatrixChange} className="flex-grow-1">
      {availableMatrices.map(matrix => (
        <option key={matrix.name} value={matrix.name}>
          {matrix.name} ({matrix.width}x{matrix.height})
        </option>
      ))}
    </Form.Select>
  </div>
);

const ColorGrid = ({ api }) => {
  const [matrix, setMatrix] = useState(Array(16).fill().map(() => Array(16).fill('#000000')));
  const [color, setColor] = useState('#ff0000');
  const [mousePressed, setMousePressed] = useState(false);
  const [matrixName, setMatrixName] = useState('');
  const [availableMatrices, setAvailableMatrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    const loadMatrices = async () => {
      try {
        const { data } = await api.get('/matrix/my');
        setAvailableMatrices(data);
        if (data.length > 0) setMatrixName(data[0].name);
      } catch (error) {
        console.error('Matrix load error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMatrices();
  }, [api]);

  const updateMatrixCell = (row, col, value) => {
    setMatrix(prev => prev.map((r, ri) =>
      r.map((c, ci) => ri === row && ci === col ? value : c)
    ));
  };

  const handleCellClick = (row, col) => {
    if (!mousePressed) updateMatrixCell(row, col, matrix[row][col] === color ? null : color);
  };

  const handleCellHover = (row, col) => {
    if (mousePressed) updateMatrixCell(row, col, color);
  };

  const handleSend = async () => {
    if (!matrixName) return;

    try {
      const rgbData = matrix.flatMap(row =>
        row.map(c => c ? { red: hexToRgb(c)[0], green: hexToRgb(c)[1], blue: hexToRgb(c)[2] } : { red: 0, green: 0, blue: 0 })
      );

      const response = await fetch(`matrix/${matrixName}/rgb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rgbData)
      });

      if (!response.ok) throw new Error('Send failed');

      setToast({ show: true, message: 'Image sent successfully!', variant: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.message || 'Sending failed', variant: 'danger' });
    } finally {
      setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container
      onMouseDown={() => setMousePressed(true)}
      onMouseUp={() => setMousePressed(false)}
      className="d-flex flex-column align-items-center"
    >
      <div className="d-flex align-items-start flex-column w-100">
        <MatrixControls
          matrixName={matrixName}
          availableMatrices={availableMatrices}
          onMatrixChange={e => setMatrixName(e.target.value)}
        />
        
        <div className="d-flex flex-row align-items-start w-100">
          <div className="grid-container me-3 mb-3">
            {matrix.map((row, ri) => row.map((cell, ci) => (
              <GridCell
                key={`${ri}-${ci}`}
                cellColor={cell}
                rowIndex={ri}
                colIndex={ci}
                onCellClick={handleCellClick}
                onCellHover={handleCellHover}
              />
            )))}
          </div>
          <div className="d-flex flex-column align-items-center">
            <SketchPicker
              color={color}
              disableAlpha
              onChangeComplete={c => setColor(c.hex)}
              className="mb-3 sketchpicker-container"
            />
            <BrightnessSlider matrixName={matrixName} />
            <Button
              variant="primary"
              size="lg"
              onClick={handleSend}
              disabled={!matrixName || availableMatrices.length === 0}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
      <Toast
        show={toast.show}
        onClose={() => setToast(t => ({ ...t, show: false }))}
        delay={3000}
        autohide
        bg={toast.variant}
        style={{ position: 'fixed', top: 20, right: 20 }}
      >
        <Toast.Body className="text-white">{toast.message}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default ColorGrid;
