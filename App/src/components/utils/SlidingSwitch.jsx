
import React, { useState } from 'react';

const SlidingSwitch = () => {
    const [colour, setColour] = useState("bg-red-500");

    const HandleClick = () => {
        if (colour === "bg-red-500") {
            setColour("bg-blue-700");
            console.log(colour)
        } else {
            setColour("bg-red-500");
            console.log(colour)
        }
    }

    return (
        <div className="flex justify-center">
            <button
                className={`${colour} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full`}
                type="button"
                onClick={HandleClick}
            >
                Switch
            </button>
        </div>
    );
}

export default SlidingSwitch;
