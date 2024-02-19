/**
 * Buttons.jsx
 * 
 * This is a utility file for all the buttons used in the application
 * the purpose of this file is to make the code in the components
 * more readable and maintainable
 * 
 * @returns buttonJSX
 * @author Ghuam Hassan Hassani <w20017074>
 *  
 */

export const imageIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
        </svg>
    );
}