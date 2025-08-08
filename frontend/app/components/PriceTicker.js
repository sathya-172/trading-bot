'use client'

import { useEffect, useState } from "react"

const coins = [
    { symbol: 'BTC/USDT', stream: 'btcusdt@trade' },
    { symbol: 'ETH/USDT', stream: 'ethusdt@trade' },
    { symbol: 'BNB/USDT', stream: 'bnbusdt@trade' },
    { symbol: 'SOL/USDT', stream: 'solusdt@trade' },
    { symbol: 'XRP/USDT', stream: 'xrpusdt@trade' }
];

export default function CryptoTicker() {
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const sockets = [];

        coins.forEach((coin) => {
            const connectSocket = () => {
                const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin.stream}`);

                // ws.onopen = () => console.log(`${coin.symbol} connected`);
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    setPrices((prev) => {
                        const prevPrice = prev[coin.symbol]?.price || 0;
                        return {
                            ...prev,
                            [coin.symbol]: {
                                price: parseFloat(data.p).toFixed(2),
                                volume: parseFloat(data.q).toFixed(4),
                                prevPrice,
                            }
                        };
                    });
                };

                ws.onclose = () => {
                    console.warn(`${coin.symbol} disconnected. Reconnecting...`);
                    setTimeout(connectSocket, 3000);
                };

                ws.onerror = (err) => {
                    console.log(`${coin.symbol} error`, err.message);
                    ws.close();
                };
                sockets.push(ws);
            };
            connectSocket();
        });
        return () => sockets.forEach((ws) => ws.close());
    }, []);

    return (
        <div className="p-6 max-w-5xl  mx-auto">
            <h1 className="text-2xl font-bold mb-4">Live Crypto Prices</h1>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {coins.map((coin) => {
                    const data = prices[coin.symbol];
                    return (
                        <div key={coin.symbol} className="rounded p-4 shadow bg-dark">
                            <h2 className="font-semibold text-lg">{coin.symbol}</h2>
                            {data ? (
                                (() => {
                                    const isUp = data.price > data.prevPrice
                                    return (
                                        <>
                                            <p className={`text-2xl font-mono ${isUp ? "text-green-600" : "text-red-600"}`}>${data.price}</p>
                                            <p className="text-sm text-gray-600">Vol: {data.volume}</p>
                                        </>
                                    )
                                })()

                            ) : (
                                <p className="text-sm text-gray-500">Loading...</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}