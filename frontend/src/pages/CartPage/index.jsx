import React, { useEffect, useState } from "react";
import axiosInstance, { setCsrfToken } from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCart } from "../../store/userSlice";
import { Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import usePageTitle from "../../hooks/usePageTitle";

const CartPage = () => {
    const dispatch = useDispatch();
    const cartDetail = useSelector((state) => state.user.cartDetail);
    const [cartItems, setCartItems] = useState([]);
    const [selected, setSelected] = useState([]);

    usePageTitle("장바구니");

    useEffect(() => {
        dispatch(fetchUserCart());
    }, [dispatch]);

    useEffect(() => {
        setCartItems(JSON.parse(JSON.stringify(cartDetail)));
    }, [cartDetail]);

    const handleCheck = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleQuantity = (productId, type) => {
        const updatedItems = cartItems.map((item) => {
            if (item._id === productId) {
                const newQty =
                    type === "inc"
                        ? item.quantity + 1
                        : Math.max(1, item.quantity - 1);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCartItems(updatedItems);
    };

    const handlePaymentClick = async () => {
        try {
            await setCsrfToken();

            const selectedItems = cartItems
                .filter((item) => selected.includes(item._id))
                .map((item) => ({
                    ...item,
                    totalPrice: item.price * item.quantity,
                }));

            if (!selectedItems.length) {
                toast.warn("결제할 상품을 선택하세요.");
                return;
            }

            await axiosInstance.post("/users/payment", {
                cartDetail: selectedItems,
            });

            toast.success("결제가 완료되었습니다.");
            dispatch(fetchUserCart());
            setSelected([]);
        } catch (err) {
            console.error("결제 실패:", err);
            toast.error("결제 중 오류 발생");
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await setCsrfToken();

            if (!selected.length) {
                toast.warn("삭제할 상품을 선택하세요.");
                return;
            }

            for (const productId of selected) {
                await axiosInstance.delete("/users/cart", {
                    params: { productId },
                });
            }

            toast.success("선택한 상품이 삭제되었습니다.");
            dispatch(fetchUserCart());
            setSelected([]);
        } catch (err) {
            console.error("삭제 실패:", err);
            toast.error("삭제 중 오류 발생");
        }
    };

    const totalPrice = cartItems
        ?.filter((item) => selected.includes(item._id))
        ?.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);

    return (
        <section className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
                나의 장바구니
            </h2>

            {cartItems?.length === 0 ? (
                <p className="text-center text-gray-500">
                    장바구니가 비었습니다.
                </p>
            ) : (
                <>
                    <table className="w-full text-center border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th></th>
                                <th>사진</th>
                                <th>개수</th>
                                <th>가격</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((product) => (
                                <tr key={product._id} className="border-b">
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(
                                                product._id
                                            )}
                                            onChange={() =>
                                                handleCheck(product._id)
                                            }
                                        />
                                    </td>
                                    <td className="p-2">
                                        <img
                                            // src={`http://localhost:4000/uploads/${product.images[0]}`}
                                            src={`${
                                                import.meta.env.VITE_SERVER_URL
                                            }/uploads/${product.images[0]}`}
                                            alt={product.title}
                                            className="w-20 h-20 object-cover inline-block"
                                        />
                                        <div>{product.title}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                className="p-1 border border-pink-500 text-pink-500 bg-transparent rounded hover:bg-pink-500 hover:text-white transition-colors duration-200"
                                                onClick={() =>
                                                    handleQuantity(
                                                        product._id,
                                                        "dec"
                                                    )
                                                }
                                            >
                                                <Minus size={16} />
                                            </button>
                                            {product.quantity} 개
                                            <button
                                                className="p-1 border border-[#00C4C4] text-[#00C4C4] bg-transparent rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
                                                onClick={() =>
                                                    handleQuantity(
                                                        product._id,
                                                        "inc"
                                                    )
                                                }
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </td>

                                    <td>
                                        {(
                                            product.price * product.quantity
                                        ).toLocaleString()}{" "}
                                        원
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between mt-6">
                        <div className="text-lg font-bold">
                            합계: {totalPrice?.toLocaleString() || 0} 원
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selected.length === 0}
                                className="border border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                삭제
                            </button>

                            <button
                                onClick={handlePaymentClick}
                                disabled={selected.length === 0}
                                className="px-4 py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded hover:bg-[#00C4C4] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                결제하기
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default CartPage;
