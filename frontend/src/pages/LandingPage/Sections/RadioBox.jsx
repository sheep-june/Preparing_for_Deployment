import React from "react";

const RadioBox = ({ prices, checkedPrice, onFilters }) => {
    const handleChange = (e) => {
        const selectedId = parseInt(e.target.value);
        onFilters(selectedId);
    };

    return (
        <div className="w-full max-w-[256px] p-4 mb-3 border border-[#00C4C4] rounded-md ml-4">
            {prices?.map((price) => (
                <div key={price._id} className="flex items-center">
                    <input
                        type="radio"
                        id={`price-${price._id}`}
                        value={price._id}
                        checked={checkedPrice === price._id}
                        onChange={handleChange}
                    />
                    <label htmlFor={`price-${price._id}`} className="ml-2">
                        {price.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default RadioBox;
