import { useState } from "react";

import dataKontak from "../Data/DataKontak.json";

import {
    FaEye,
    FaTrash,
    FaSearch
} from "react-icons/fa";


export default function DataKontak() {


    const [kontak, setKontak] = useState(dataKontak);

    const [search, setSearch] = useState("");

    const [detail, setDetail] = useState(null);



    // DELETE DATA
    const handleDelete = (id) => {

        const confirmDelete = confirm(
            "Yakin ingin menghapus data ini?"
        );


        if(confirmDelete){

            const result = kontak.filter(
                item => item.id_customer !== id
            );


            setKontak(result);

        }

    };



    // SEARCH FILTER
    const filteredData = kontak.filter((item)=>

        item.id_customer
        .toLowerCase()
        .includes(search.toLowerCase())

        ||

        item.email
        .toLowerCase()
        .includes(search.toLowerCase())

        ||

        item.kota
        .toLowerCase()
        .includes(search.toLowerCase())

    );





    return (


        <div className="p-6 bg-[#EAF2FF] min-h-screen">


            {/* HEADER */}


            <div className="flex justify-between items-center mb-6">


                <div>


                    <h1 className="text-2xl font-bold text-gray-800">

                        Data Kontak Customer

                    </h1>


                    <p className="text-gray-400">

                        Management data kontak pelanggan

                    </p>


                </div>



                {/* SEARCH */}


                <div
                    className="
                    bg-white
                    px-4
                    py-3
                    rounded-xl
                    flex
                    items-center
                    gap-3
                    shadow-sm
                    "
                >


                    <FaSearch 
                        className="text-gray-400"
                    />


                    <input

                        type="text"

                        placeholder="Cari kontak..."

                        className="
                        outline-none
                        "

                        value={search}

                        onChange={(e)=>
                            setSearch(e.target.value)
                        }

                    />


                </div>



            </div>








            {/* TABLE */}


            <div
                className="
                bg-white
                rounded-2xl
                shadow-sm
                overflow-hidden
                "
            >



                <table className="w-full">


                    <thead
                        className="
                        bg-[#1018A8]
                        text-white
                        "
                    >


                        <tr>

                            <th className="p-4">
                                ID Customer
                            </th>


                            <th>
                                Nomor HP
                            </th>


                            <th>
                                Email
                            </th>


                            <th>
                                Kota
                            </th>


                            <th>
                                Provinsi
                            </th>


                            <th>
                                Aksi
                            </th>


                        </tr>


                    </thead>






                    <tbody>


                        {

                        filteredData.map((item)=>(


                            <tr
                                key={item.id_customer}

                                className="
                                text-center
                                border-b
                                hover:bg-blue-50
                                transition
                                "
                            >



                                <td className="p-4 font-semibold">

                                    {item.id_customer}

                                </td>



                                <td>

                                    {item.nomor_hp}

                                </td>



                                <td>

                                    {item.email}

                                </td>



                                <td>

                                    {item.kota}

                                </td>



                                <td>

                                    {item.provinsi}

                                </td>




                                <td>


                                    <div className="flex justify-center gap-3">



                                        {/* DETAIL */}


                                        <button

                                            onClick={()=>
                                                setDetail(item)
                                            }


                                            className="
                                            bg-blue-100
                                            text-blue-600
                                            p-3
                                            rounded-lg
                                            hover:bg-blue-600
                                            hover:text-white
                                            "

                                        >


                                            <FaEye/>


                                        </button>





                                        {/* DELETE */}


                                        <button

                                            onClick={()=>
                                                handleDelete(
                                                    item.id_customer
                                                )
                                            }


                                            className="
                                            bg-red-100
                                            text-red-600
                                            p-3
                                            rounded-lg
                                            hover:bg-red-600
                                            hover:text-white
                                            "

                                        >


                                            <FaTrash/>


                                        </button>



                                    </div>


                                </td>



                            </tr>



                        ))

                        }



                    </tbody>



                </table>


            </div>









            {/* MODAL DETAIL */}


            {

            detail && (


                <div
                    className="
                    fixed
                    inset-0
                    bg-black/40
                    flex
                    justify-center
                    items-center
                    "
                >



                    <div
                        className="
                        bg-white
                        w-[450px]
                        rounded-2xl
                        p-6
                        "
                    >



                        <h2
                            className="
                            text-xl
                            font-bold
                            mb-5
                            "
                        >

                            Detail Customer


                        </h2>





                        <div className="space-y-3">


                            <p>
                                ID : {detail.id_customer}
                            </p>


                            <p>
                                HP : {detail.nomor_hp}
                            </p>


                            <p>
                                Email : {detail.email}
                            </p>


                            <p>
                                Alamat : {detail.alamat}
                            </p>


                            <p>
                                Kota : {detail.kota}
                            </p>


                            <p>
                                Provinsi : {detail.provinsi}
                            </p>



                        </div>





                        <button

                            onClick={()=>
                                setDetail(null)
                            }


                            className="
                            mt-6
                            bg-[#1018A8]
                            text-white
                            w-full
                            py-3
                            rounded-xl
                            "

                        >

                            Tutup

                        </button>




                    </div>



                </div>


            )

            }



        </div>


    );


}