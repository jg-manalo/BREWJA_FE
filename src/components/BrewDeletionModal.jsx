import { useModalBehavior } from '../utils/modal/useModal';

export default function BrewDeletionModal({name, onClose, onDelete}) {
   useModalBehavior(onClose);
   return(
    <form onSubmit={onDelete} className="fixed inset-0 z-50 flex flex-col justify-center items-center w-full bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-gradient-to-br from-orange-100 via-amber-200 to-orange-300 rounded-2xl flex flex-col lg:max-w-xl w-[90%] justify-center p-8 gap-y-6 shadow-2xl border-2 border-amber-500">
            <div className='flex justify-between items-start'>
                <h1 className='emphasis-text text-xl grow text-amber-950 pr-4'>Are you sure you want to delete {name}?</h1>
                <button type="button" onClick={onClose} className='text-amber-900 hover:text-amber-700 font-bold px-2'>✕</button>
            </div>
            <h2 className="font-serif text-amber-950">{name} will be obliterated into oblivion.</h2>
            <div className="flex justify-center gap-4">
                <button type="button" onClick={onClose} className="cursor-pointer bg-transparent border-2 border-amber-900/30 text-amber-900 hover:bg-amber-900/10 px-6 py-3 rounded-xl font-bold">CANCEL</button>
                <button className="cursor-pointer bg-gradient-to-b from-red-600 to-red-900 hover:shadow-red-500/50 hover:scale-105 border-2 border-red-950 px-8 py-3 rounded-xl text-white font-bold transition-all">GOODBYE</button>
            </div>
        </div>
    </form>
   );
}