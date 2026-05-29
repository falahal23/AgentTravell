import products from "../Data/Products.json";
import { Link } from "react-router-dom";

function Product() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-blue-100 p-8">

      {/* HEADER */}
      <div className="text-center mb-12">

        <h1 className="text-5xl font-extrabold text-gray-800">
          Travel Agent Products
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Best Tour & Travel Packages Around The World
        </p>

      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {products.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >

            {/* IMAGE */}
            <div className="relative">

              <img
                src={item.gambar}
                alt={item.title}
                className="w-full h-60 object-cover"
              />

              {/* CATEGORY */}
              <div className="absolute top-4 left-4 bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {item.category}
              </div>

            </div>

            {/* CONTENT */}
            <div className="p-6">

              {/* TITLE */}
              <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">
                {item.title}
              </h2>

              {/* BRAND */}
              <p className="text-gray-400 mt-2">
                {item.brand}
              </p>

              {/* PRICE */}
              <div className="mt-5">

                <p className="text-cyan-500 text-3xl font-extrabold">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>

                <p className="text-sm text-green-500 font-semibold mt-1">
                  Stock : {item.stock}
                </p>

              </div>

              {/* BUTTON */}
              <Link to={`/product/${item.id}`}>

                <button className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition duration-300">
                  Detail Product
                </button>

              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Product;