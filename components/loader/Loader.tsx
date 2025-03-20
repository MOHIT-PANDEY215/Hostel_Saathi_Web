import React from "react";
import "./Loading.css";

interface LoaderProps {
    loading: boolean
}
const Loader: React.FC<LoaderProps> = ({ loading }) => {
    return (
        <>
            {loading && (
                <div className="loading-container">
                    <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Loader;
