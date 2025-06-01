import React from "react";
import Dropzone from "react-dropzone";
import axiosInstance, { setCsrfToken } from "../utils/axios";

const FileUpload = ({ onImageChange, images }) => {
    const handleDrop = async (files) => {
        const formData = new FormData();
        formData.append("file", files[0]);

        try {
            await setCsrfToken();
            const response = await axiosInstance.post(
                "/products/image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            onImageChange([...images, response.data.fileName]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (image) => {
        const currentIndex = images.indexOf(image);
        const newImages = [...images];
        newImages.splice(currentIndex, 1);
        onImageChange(newImages);
    };

    return (
        <>
            {images.length === 0 ? (
                <div className="min-w-[300px] h-[300px] border flex items-center justify-center">
                    <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                {...getRootProps()}
                                className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                            >
                                <input {...getInputProps()} />
                                <p className="text-2xl text-gray-700">＋</p>
                            </div>
                        )}
                    </Dropzone>
                </div>
            ) : (
                <div className="flex h-[300px] border overflow-x-auto overflow-y-hidden space-x-2 px-2 items-center">
                    <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                {...getRootProps()}
                                className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition flex-shrink-0"
                            >
                                <input {...getInputProps()} />
                                <p className="text-2xl text-gray-700">＋</p>
                            </div>
                        )}
                    </Dropzone>

                    {images.map((image) => (
                        <div
                            key={image}
                            onClick={() => handleDelete(image)}
                            className="min-w-[300px] h-[300px] flex-shrink-0"
                        >
                            <img
                                className="w-full h-full object-cover"
                                src={`${import.meta.env.VITE_SERVER_URL
                                    }/uploads/${image}`}
                                alt={image}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default FileUpload;
