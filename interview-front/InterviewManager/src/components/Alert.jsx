// Alert.jsx
import React, { useEffect } from "react";

const Alert = ({ type, title, message, onClose }) => {
    const alertStyles = {
        success: {
            bgColor: "bg-green-500",
            svgPath: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 shrink-0 fill-white inline"
                    viewBox="0 0 512 512"
                >
                    <ellipse
                        cx="256"
                        cy="256"
                        data-original="#000"
                        rx="256"
                        ry="255.832"
                    />
                    <path
                        className="fill-green-500"
                        d="m235.472 392.08-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z"
                        data-original="#000"
                    />
                </svg>
            ),
        },
        warning: {
            bgColor: "bg-yellow-500",
            svgPath: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 shrink-0 fill-white inline"
                    viewBox="0 0 128 128"
                >
                    <path
                        d="M56.463 14.337 6.9 106.644C4.1 111.861 8.173 118 14.437 118h99.126c6.264 0 10.338-6.139 7.537-11.356L71.537 14.337c-3.106-5.783-11.968-5.783-15.074 0z"
                        data-original="#fff"
                    />
                    <g className="fill-yellow-500">
                        <path
                            d="M64 31.726a5.418 5.418 0 0 0-5.5 5.45l1.017 44.289A4.422 4.422 0 0 0 64 85.726a4.422 4.422 0 0 0 4.482-4.261L69.5 37.176a5.418 5.418 0 0 0-5.5-5.45z"
                            data-original="#fff"
                        />
                        <circle
                            cx="64"
                            cy="100.222"
                            r="6"
                            data-original="#fff"
                        />
                    </g>
                </svg>
            ),
        },
        error: {
            bgColor: "bg-red-500",
            svgPath: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 shrink-0 fill-white inline"
                    viewBox="0 0 32 32"
                >
                    <path
                        d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm6.36 20L21 22.36l-5-4.95-4.95 4.95L9.64 21l4.95-5-4.95-4.95 1.41-1.41L16 14.59l5-4.95 1.41 1.41-5 4.95z"
                        data-original="#ea2d3f"
                    />
                </svg>
            ),
        },
        info: {
            bgColor: "bg-blue-500",
            svgPath: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 shrink-0 fill-white inline"
                    viewBox="0 0 23.625 23.625"
                >
                    <path
                        d="M11.812 0C5.289 0 0 5.289 0 11.812s5.289 11.813 11.812 11.813 11.813-5.29 11.813-11.813S18.335 0 11.812 0zm2.459 18.307c-.608.24-1.092.422-1.455.548a3.838 3.838 0 0 1-1.262.189c-.736 0-1.309-.18-1.717-.539s-.611-.814-.611-1.367c0-.215.015-.435.045-.659a8.23 8.23 0 0 1 .147-.759l.761-2.688c.067-.258.125-.503.171-.731.046-.23.068-.441.068-.633 0-.342-.071-.582-.212-.717-.143-.135-.412-.201-.813-.201-.196 0-.398.029-.605.09-.205.063-.383.12-.529.176l.201-.828c.498-.203.975-.377 1.43-.521a4.225 4.225 0 0 1 1.29-.218c.731 0 1.295.178 1.692.53.395.353.594.812.594 1.376 0 .117-.014.323-.041.617a4.129 4.129 0 0 1-.152.811l-.757 2.68a7.582 7.582 0 0 0-.167.736 3.892 3.892 0 0 0-.073.626c0 .356.079.599.239.728.158.129.435.194.827.194.185 0 .392-.033.626-.097.232-.064.4-.121.506-.17l-.203.827zm-.134-10.878a1.807 1.807 0 0 1-1.275.492c-.496 0-.924-.164-1.28-.492a1.57 1.57 0 0 1-.533-1.193c0-.465.18-.865.533-1.196a1.812 1.812 0 0 1 1.28-.497c.497 0 .923.165 1.275.497.353.331.53.731.53 1.196 0 .467-.177.865-.53 1.193z"
                        data-original="#030104"
                    />
                </svg>
            ),
        },
    };

    const { bgColor, svgPath } = alertStyles[type] || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`shadow-[0_3px_10px_-3px_rgba(6,81,237,0.3)] text-black flex w-max max-w-sm rounded-md overflow-hidden mt-4 mx-auto`}
            role="alert"
        >
            <div
                className={`flex items-center justify-center w-14 h-14 ${bgColor}`}
            >
                {svgPath}
            </div>
            <div className="py-2 mx-4 flex-1">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{message}</p>
            </div>
            <button className="px-4" onClick={onClose}>
                <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Alert;
