import React from "react";

const CheckBox = ({ items, checkedItems, onFilters }) => {
    const handleToggle = (itemId) => {
        const newChecked = checkedItems.includes(itemId)
            ? checkedItems.filter((id) => id !== itemId)
            : [...checkedItems, itemId];
        onFilters(newChecked);
    };

    return (
        <div className="w-full max-w-[256px] p-4 mb-3 border border-[#00C4C4] rounded-md ml-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {items?.map((item) => (
                    <div key={item._id} className="flex items-center">
                        <input
                            type="checkbox"
                            onChange={() => handleToggle(item._id)}
                            checked={checkedItems.includes(item._id)}
                            id={`cat-${item._id}`}
                        />
                        <label
                            htmlFor={`cat-${item._id}`}
                            className="ml-2 text-sm"
                        >
                            {item.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckBox;
