import '../index.css';
import OpusMap from "./components/OpusMap";


const BuyLand = () => {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">Buy Land Page</h2>
          <p className="text-lg mb-6 text-center text-gray-700">Explore available land:</p>
          <div className="w-full max-w-screen-lg">
            <OpusMap />
          </div>
        </div>
      </div>
    );
  };
  
  export default BuyLand;
