import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [trendingStocks, setTrendingStocks] = useState([]);
    const [allStocks, setAllStocks] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // API configuration
    const optionsTrending = {
        method: "GET",
        url: "https://mboum-finance.p.rapidapi.com/co/collections/most_actives",
        params: { start: "0" },
        headers: {
            "X-RapidAPI-Key":
                "947b801f92msh96b919932628932p1a1413jsncb9cc7188719",
            "X-RapidAPI-Host": "mboum-finance.p.rapidapi.com",
        },
    };

    const optionsAll = {
        method: "GET",
        url: "https://twelve-data1.p.rapidapi.com/stocks",
        params: { exchange: "NASDAQ", format: "json" },
        headers: {
            "X-RapidAPI-Key":
                "947b801f92msh96b919932628932p1a1413jsncb9cc7188719",
            "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com",
        },
    };

    useEffect(() => {
        fetchTrending();
        fetchAllStocks();
    }, []);

    const fetchTrending = async () => {
        try {
            const response = await axios.request(optionsTrending);
            setTrendingStocks(response.data?.quotes || []);
        } catch (error) {
            console.error(error);
            setTrendingStocks([]);
        }
    };

    const fetchAllStocks = async () => {
        try {
            const response = await axios.request(optionsAll);
            setAllStocks(response.data?.data || []);
        } catch (error) {
            console.error(error);
            setAllStocks([]);
        }
    };

    // Safe filter function
    const filteredStocks = () => {
        if (!search) return allStocks;
        return allStocks.filter(
            (stock) =>
                (stock.symbol || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (stock.name || "").toLowerCase().includes(search.toLowerCase())
        );
    };

    return (
        <div className="homePage">
            {/* Trending Stocks Section */}
            <div className="trending-stocks-container">
                <h2>Trending stocks</h2>
                <div className="trending-stocks">
                    {trendingStocks?.length === 0 && (
                        <div className="loading-spinner" />
                    )}

                    {trendingStocks?.map((stock) => (
                        <div
                            className="trending-stock"
                            key={stock.symbol}
                            onClick={() => navigate(`/stock/${stock.symbol}`)}
                        >
                            <span>
                                <h5>Stock name</h5>
                                <p>{stock.shortName || "N/A"}</p>
                            </span>
                            <span>
                                <h5>Symbol</h5>
                                <p>{stock.symbol || "N/A"}</p>
                            </span>
                            <span>
                                <h5>Price</h5>
                                <p
                                    style={
                                        stock.regularMarketChangePercent > 0
                                            ? { color: "green" }
                                            : { color: "red" }
                                    }
                                >
                                    $
                                    {stock.regularMarketOpen?.toFixed(2) ||
                                        "0.00"}{" "}
                                    (
                                    {stock.regularMarketChangePercent?.toFixed(
                                        2
                                    ) || "0.00"}
                                    %)
                                </p>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Stocks Section */}
            <div className="all-stocks-container">
                <div className="all-stocks-container-head">
                    <h2>Watchlist</h2>
                    <div className="all-stocks-container-search">
                        <input
                            type="text"
                            placeholder="Enter Stock Symbol..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <BiSearch id="searchIcon" />
                    </div>
                </div>

                <div className="all-stocks">
                    {allStocks?.length === 0 && (
                        <div className="loading-spinner" />
                    )}

                    {filteredStocks().map((stock) => (
                        <div className="all-stocks-stock" key={stock.symbol}>
                            <h6>{stock.exchange || "N/A"}</h6>
                            <span>
                                <h5>Stock name</h5>
                                <p>{stock.name || "N/A"}</p>
                            </span>
                            <span>
                                <h5>Symbol</h5>
                                <p>{stock.symbol || "N/A"}</p>
                            </span>
                            <span>
                                <h5>Stock Type</h5>
                                <p>{stock.type || "N/A"}</p>
                            </span>
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(`/stock/${stock.symbol}`)
                                }
                            >
                                View Chart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
