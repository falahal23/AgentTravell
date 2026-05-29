export default function PageHeader({ title, breadcrumb, children }) {
    // Helper function untuk render breadcrumb
    const renderBreadcrumb = () => {
        let breadcrumbArray = [];

        // Jika breadcrumb string → otomatis tambah Dashboard di depan
        if (typeof breadcrumb === "string") {
            breadcrumbArray = ["Dashboard", breadcrumb];
        } 
        // Jika array → langsung pakai
        else if (Array.isArray(breadcrumb)) {
            breadcrumbArray = breadcrumb;
        }

        return breadcrumbArray.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center space-x-2">
                <span className="text-gray-500">
                    {item}
                </span>

                {/* Separator "/" */}
                {index < breadcrumbArray.length - 1 && (
                    <span className="text-gray-500">/</span>
                )}
            </div>
        ));
    };

    return (
        <div className="flex items-center justify-between p-4 mb-4">
            {/* LEFT SIDE */}
            <div className="flex flex-col">
                {/* TITLE */}
                <h1 className="text-3xl font-semibold">
                    {title}
                </h1>

                {/* BREADCRUMB */}
                <div className="flex items-center font-medium space-x-2 mt-2">
                    {renderBreadcrumb()}
                </div>
            </div>

            {/* RIGHT SIDE (BUTTON / ACTION) */}
            <div>
                {children ? (
                    children
                ) : (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Add Button
                    </button>
                )}
            </div>
        </div>
    );
}