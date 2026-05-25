import { useEffect,useState } from "react";
import { createContext } from "react";
import { useContext } from "react";




const ThemeContext=createContext();


export function ThemeProvider({children})
{
    //rEAD SAVED THEME from localstorage,default to light
// Why useState(() => localStorage.getItem(...))? The function form of useState runs ONCE on mount. It reads saved preference so dark mode stays after refresh.
    const[theme,setTheme]=useState(()=>{
        return localStorage.getItem('theme') || 'light';
    });



//Apply theme to <body> so css can use [data-theme]
// Why document.body.setAttribute? CSS can't read React state. So we write the theme to the DOM as an HTML attribute on <body>:
{/* <body data-theme="dark"> */}


useEffect(()=>{
    document.body.setAttribute('data-theme',theme);
    localStorage.setItem('theme',theme);
},[theme]);


const toggleTheme=()=>{
    setTheme(prev=>prev==='light' ? 'dark':'light');
};


    return (
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext);
}