import {Toaster } from "react-hot-toast";

export default function AppToaster(){
    return (
        <>  
            <Toaster position="top-center" 
            toastOptions={{

                loading:{
                    className: 'emphasis-text font-bold text-amber-50  border-2 border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.5)]',
                },
                success: {
                    iconTheme: {
                      primary: '#10b981', // emerald-500
                      secondary: '#f0fdf4', // emerald-50
                    },
                    className: "emphasis-text text-emerald-100  border-2 border-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
                },

                error: {
                  iconTheme: {
                    primary: '#ef4444', // red-500
                    secondary: '#fef2f2', // red-50
                  },
                  className: "emphasis-text text-red-100  border-2 border-red-900 shadow-[0_0_15px_rgba(239,68,68,0.4)]",
                },

                duration: 3000, //seconds
              }}
            />
        </>
    );
}