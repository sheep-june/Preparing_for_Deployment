import React from "react";

const Footer = () => {
    return (
        <div className="flex h-20 justify-center items-center text-lg bg-white text-[#00C4C4]">
            <div className="ml-4 text-sm flex flex-col items-start">
                <div className="flex items-center">
                    {/* 김동영 */}
                    キム・ドンヨン<span className="mx-1">→</span>
                    <a
                        href="https://github.com/Muroi6666"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-cyan-600"
                    >
                        GitHub
                    </a>
                </div>
                <div className="flex items-center">
                    {/* 양준 */}
                    ヤン•ジュン <span className="mx-1">→</span>
                    <a
                        href="https://github.com/sheep-june"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-cyan-600"
                    >
                        GitHub
                    </a>
                </div>
                <div className="flex items-center">
                    {/* 이상영 */}
                    イ•サンヨン <span className="mx-1">→</span>
                    <a
                        href="https://github.com/SANGYOUNGS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-cyan-600"
                    >
                        GitHub
                    </a>
                </div>
                <div className="flex items-center">
                    {/* 이윤수 */}
                    イ・ユンス <span className="mx-1">→</span>
                    <a
                        href="https://github.com/tgjpas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-cyan-600"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
