import { NavLink } from "react-router-dom";

import {
    MdSpaceDashboard,
    MdPayments,
    MdOutlineMessage
} from "react-icons/md";

import {
    FaUsersCog,
    FaFileInvoiceDollar,
    FaSignOutAlt,
    FaBoxOpen,
    FaUsers,
    FaPuzzlePiece
} from "react-icons/fa";

import { IoArrowForward } from "react-icons/io5";


export default function sidebar() {


const menuItems = [
    { path: "/", 
        icon: MdSpaceDashboard, 
        label: "Dashboard" 
    },

    {
        path: "/customers",
        icon: FaUsers,
        label: "Data Customers"
    },


    {
        path: "/data-kontak",
        icon: FaFileInvoiceDollar,
        label: "Data Kontak"
    },


    {
        path: "/membership",
        icon: FaUsersCog,
        label: "Membership Customer"
    },


    {
        path: "/riwayat-interaksi",
        icon: MdOutlineMessage,
        label: "Riwayat Interaksi"
    },


    {
        path: "/data-transaksi",
        icon: MdPayments,
        label: "Data Transaksi"
    },


    {
        path: "/aktivitas-user",
        icon: MdSpaceDashboard,
        label: "Aktivitas User"
    },


    {
        path: "/marketing",
        icon: FaPuzzlePiece,
        label: "Marketing & Engagement"
    },

];


    const menuClass = ({ isActive }) =>

        `
        flex items-center gap-4
        px-4 py-[13px]
        rounded-[10px]
        transition-all duration-300

        ${
            isActive

            ? 
            "bg-[#1018A8] text-white"

            :

            "text-[#707070] hover:bg-gray-100"

        }

        `;



    return (


        <aside
            className="
            h-screen
            w-[235px]
            bg-white
            flex flex-col
            px-5
            py-6
            border-r
            border-[#EEF2FF]
            "
        >



            {/* LOGO */}
            <div className="mb-10 pl-3">


                <h1
                    className="
                    text-[25px]
                    font-extrabold
                    text-[#1018A8]
                    tracking-tight
                    "
                >

                    ✈ GoLand

                </h1>


            </div>





            {/* MENU */}

            <nav className="flex-1">


                <ul className="space-y-4">


                    {

                    menuItems.map((item,index)=>(


                        <li key={index}>


                            <NavLink

                                to={item.path}

                                className={menuClass}

                            >


                                <item.icon
                                    className="
                                    text-[22px]
                                    "
                                />


                                <span
                                    className="
                                    text-[15px]
                                    font-medium
                                    "
                                >

                                    {item.label}

                                </span>


                            </NavLink>



                        </li>


                    ))

                    }


                </ul>


            </nav>





            {/* DISCOUNT CARD */}

            <div className="mb-16">


                <div
                    className="
                    relative
                    h-[150px]
                    rounded-[28px]
                    overflow-hidden
                    bg-[#DCEBFF]
                    "
                >



                    {/* BLUE BOX */}
                    <div
                        className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-[82%]
                        bg-[#1018A8]
                        rounded-r-[55px]
                        px-4
                        py-5
                        text-white
                        "
                    >


                        <h3
                            className="
                            text-[19px]
                            font-bold
                            "
                        >

                            50% Discount!

                        </h3>



                        <p
                            className="
                            text-[11px]
                            leading-5
                            mt-4
                            text-blue-100
                            "
                        >

                            Get a discount on certain
                            days and don't miss it.

                        </p>



                        <button
                            className="
                            absolute
                            bottom-4
                            left-4
                            bg-white
                            w-8
                            h-8
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-[#1018A8]
                            "
                        >


                            <IoArrowForward/>


                        </button>



                    </div>





                    {/* DECORATION */}

                    <div
                        className="
                        absolute
                        right-3
                        bottom-5
                        w-9
                        h-9
                        bg-yellow-400
                        border-[6px]
                        border-[#1018A8]
                        rounded-full
                        "
                    />


                </div>


            </div>





            {/* LOGOUT */}

            <button
                className="
                flex
                items-center
                gap-4
                text-[#777]
                hover:text-red-500
                transition
                pl-3
                mb-2
                "
            >


                <FaSignOutAlt
                    className="
                    rotate-180
                    text-xl
                    "
                />


                <span
                    className="
                    text-[15px]
                    font-medium
                    "
                >

                    Log Out

                </span>



            </button>




        </aside>


    );


}