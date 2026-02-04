import defaultImage from "../../assets/tea.png";

export default function ImageHandler({onUpload, onRemove, imagePreview}) {
    return (
        <>
            <div className="relative lg:w-[454px] lg:h-[326px] w-[128px] h-[128px] group rounded-lg overflow-hidden shadow-inner bg-stone-200">  
                {imagePreview && (
                    <button
                        type="button"
                        onClick={onRemove} // You will need to create this function
                        className="absolute top-2 right-2 z-30 p-1.5 bg-white/80 hover:bg-white rounded-full text-stone-600 hover:text-red-500 transition-colors shadow-sm backdrop-blur-sm cursor-pointer"
                        title="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>
                )}
                <input type="file" accept="image/jpg, image/jpeg, image/png, image/svg" onChange={onUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"/>
                <img src={imagePreview ?? defaultImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gray-800/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <div className="flex flex-col text-white text-sm font-medium items-center gap-2">
                        <p>Upload Photo</p>
                        <p>(Max 10.00 MB)</p>
                    </div>
                </div>
            </div>
        </>
    );
}