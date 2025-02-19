import React, { useState, useEffect } from 'react';

const BrightnessSlider = ({ matrixName }) => {
    const [brightness, setBrightness] = useState(40);
    const [timer, setTimer] = useState(null);

    const handleChange = (event) => {
        const value = event.target.value;
        setBrightness(value);

        if (timer) {
            clearTimeout(timer); 
        }

        const newTimer = setTimeout(() => {
            sendBrightnessToServer(value);
        }, 500);

        setTimer(newTimer);
    };

    const sendBrightnessToServer = async (value) => {
        try {
            const response = await fetch(`/matrix/${matrixName}/brightness`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ level: value }), // Отправляем значение яркости
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке данных на сервер');
            }

            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="slider-container">
            <label htmlFor="brightness-slider">Яркость: {brightness}</label>
            <input
                id="brightness-slider"
                type="range"
                min="1"
                max="100"
                value={brightness}
                onChange={handleChange}
                className="form-range"
            />
        </div>
    );
};

export default BrightnessSlider;
