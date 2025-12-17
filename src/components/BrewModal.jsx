
import { leafTypeColors } from "../constants/LeafTypeColors";
import { visibilityColors } from '../constants/VisibilityColors';

export default function BrewModal({tea, onClose}){
    if (!tea) return null;

    const formatSecondsToMMSS = (totalSeconds) =>{
        if (totalSeconds == null || Number.isNaN(Number(totalSeconds))) return '—';
        const secs = Math.max(0, Math.floor(Number(totalSeconds)));
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return (
        <>
            {/* 1. Main container: Centers content and prevents page scroll */}
            <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 font-serif">
                
                    {/* Close Button: Absolute positioned to stay visible */}
                    <button 
                        className='absolute top-4 right-4 text-stone-50 hover:scale-110 cursor-pointer font-bold z-10 bg-white/50 rounded-full w-8 h-8 flex items-center justify-center' 
                        onClick={onClose}
                    >
                        ✕
                    </button>
                {/* 2. Wrapper: Constraints width and max-height to screen size */}
                <div className="w-full lg:w-[50%] max-h-[95vh] flex flex-col relative shadow-xl rounded-lg">
                    

                    {/* 3. Card Content: Scrolls internally (overflow-y-auto) */}
                    <div className="flex flex-col rounded-lg p-6 gap-y-4 bg-linear-45 from-indigo-100 to-red-100 overflow-y-auto">
                        
                        {/* Header Tags */}
                        <div className="flex flex-row items-start pt-2">
                            <div className="flex flex-grow">
                                <p className={`${tea.is_private === 1? visibilityColors['Private']: visibilityColors['Public']} px-2 py-1 rounded text-sm`}>
                                    {tea.is_private === 1 ? 'Private' : 'Public'}
                                </p>
                            </div>
                            <div>
                                <div className={`px-2 py-1 rounded text-sm ${leafTypeColors[tea.leaf_type_id]}`}>
                                    {tea.leaf_type}
                                </div>
                            </div>
                        </div>

                        {/* Image & Title Section */}
                        <div className="flex flex-col items-center gap-y-4 w-full">
                            <h1 className="text-center w-full text-3xl emphasis-text leading-tight">{tea.title}</h1>
                            <p className="text-center w-full font-serif text-lg italic opacity-75">By: {tea.user}</p>
                        </div>

                        <hr className="border-amber-900/20" />
                        
                        <p className='text-justify text-sm lg:text-base leading-relaxed'>{tea.description}</p>
                        
                        <hr className="border-amber-900/20" />

                        {/* Footer Info */}
                        <div className="flex flex-col gap-y-2 text-sm lg:text-base">
                            <div className="flex justify-center mb-2">
                                <h1 className="font-bold complementary-emphasis text-xl">Steeping Info</h1>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between">
                                    <span className='font-bold'>Duration:</span>
                                    <span>{formatSecondsToMMSS(tea.duration)}</span>        
                                </div>
                                <div className="flex justify-between">
                                    <span className='font-bold'>Volume:</span>
                                    <span>{tea.fluid_oz} oz</span>        
                                </div>
                                <div className="flex justify-between">
                                    <span className='font-bold'>Sweetener:</span>
                                    <span name="" id="sweetener"> {tea.sweetener?? 'None'}</span>
                                </div>
                                {tea.sweetener !== 'None' && (
                                    <div className="flex justify-between">
                                        <span className='font-bold'>Amount:</span>
                                        <span>{tea.tsp_sweetener} tsp</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}