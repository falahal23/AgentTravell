import { useParams, Link } from "react-router-dom";
import products from "../Data/Products.json";

function DetailProduct() {

  const { id } = useParams();

  const product = products.find(
    (item) => item.id === parseInt(id)
  );

  // NOT FOUND
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center">

          <h1 className="text-4xl font-bold text-red-500">
            Product Tidak Ditemukan
          </h1>

          <Link to="/product">

            <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl">
              Kembali
            </button>

          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-blue-100 p-8">

      {/* BACK BUTTON */}
      <Link to="/product">

        <button className="mb-8 bg-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-2xl transition font-semibold text-cyan-500 hover:scale-105 duration-300">
          ← Kembali
        </button>

      </Link>

      {/* CARD */}
      <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* LEFT */}
        <div className="relative">

          <img
            src={product.gambar}
            alt={product.title}
            className="w-full h-full object-cover"
          />

          {/* CATEGORY */}
          <div className="absolute top-6 left-6 bg-cyan-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
            {product.category}
          </div>

        </div>

        {/* RIGHT */}
        <div className="p-10 flex flex-col justify-center">

          {/* TITLE */}
          <h1 className="text-5xl font-extrabold text-gray-800">
            {product.title}
          </h1>

          {/* BRAND */}
          <p className="text-gray-400 text-xl mt-3">
            {product.brand}
          </p>

          {/* PRICE */}
          <div className="mt-6">

            <p className="text-cyan-500 text-5xl font-extrabold">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

          </div>

          {/* INFO */}
          <div className="mt-10 space-y-5">

            {/* CODE */}
            <div className="bg-gray-100 p-5 rounded-3xl">

              <p className="text-sm text-gray-400">
                Product Code
              </p>

              <h2 className="text-2xl font-bold text-gray-700 mt-2">
                {product.code}
              </h2>

            </div>

            {/* CATEGORY */}
            <div className="bg-gray-100 p-5 rounded-3xl">

              <p className="text-sm text-gray-400">
                Category
              </p>

              <h2 className="text-2xl font-bold text-gray-700 mt-2">
                {product.category}
              </h2>

            </div>

            {/* STOCK */}
            <div className="bg-gray-100 p-5 rounded-3xl flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-400">
                  Available Stock
                </p>

                <h2 className="text-2xl font-bold text-gray-700 mt-2">
                  {product.stock}
                </h2>

              </div>

              <span className="bg-green-100 text-green-600 px-5 py-2 rounded-full font-bold">
                Available
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DetailProduct;