/**
 * @file Navbar.jsx
 * 
 * Navbar component is a reusable component that displays the navigation bar
 * at the top of the page. It is used in the App component to display the
 * navigation bar on all pages of the application.
 * 
 * It dynamically changes the content of the navigation bar based on the
 * user's authentication status. If the user is signed in, it displays the
 * 
 * user's profile picture/avatar links to the settings page.
 * 
 * @uses ClerkProvider from @clerk/clerk-react
 * @uses useContext from react
 * @uses react-hot-toast
 * @uses react-router-dom
 * 
 * @author Ghulam Hassan Hassani <w20017074>
 */

import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useAppState } from "../../contexts/AppStateContext";

const Navbar = () => {

    const { state, dispatch } = useAppState();
    const { signedIn, signedInUser, userProfile } = state;
    const { signOut } = useAuth();
    const ssoUser = useUser();
    const handleSignOut = async () => {
        try {
            if (ssoUser.isSignedIn) {
                await signOut();
                dispatch({ type: 'SET_UNAUTHENTICATED' });
                dispatch({ type: 'REMOVE_TOKEN' });
                toast.success("Signed out successfully");
            }
            if (localStorage.getItem("token")) {
                dispatch({ type: 'REMOVE_TOKEN' });
                dispatch({ type: 'SET_UNAUTHENTICATED' });
                toast.success("Signed out successfully");
                window.location.href = "/kf6003/";
            }
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    return (
        <nav className="relative w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 bg-blue-500 py-4 sm:py-2"
            aria-label="Global"
        >
                <Link to="/" className="text-white font-bold text-xl">
                    SocialY
                </Link>
                <div className="sm:hidden">
                    <button
                        type="button"
                        className="hs-collapse-toggle size-9 flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-white/20 text-white hover:border-white/40 disabled:opacity-50 disabled:pointer-events-none"
                        data-hs-collapse="#navbar-collapse-with-animation"
                        aria-controls="navbar-collapse-with-animation"
                        aria-label="Toggle navigation"
                    >
                        <svg
                            className="hs-collapse-open:hidden flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line
                                x1="3"
                                x2="21"
                                y1="6"
                                y2="6"
                            />
                            <line
                                x1="3"
                                x2="21"
                                y1="12"
                                y2="12"
                            />
                            <line
                                x1="3"
                                x2="21"
                                y1="18"
                                y2="18"
                            />
                        </svg>
                        <svg
                            className="hs-collapse-open:block hidden flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
            <div
                id="navbar-collapse-with-animation"
                className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
            >
                <div className="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:ps-7">
                    {signedIn || ssoUser.isSignedIn ? (
                        <div className="bg-red-600 font-medium hover:text-gray-300 text-white rounded-md px-3 py-1">
                            <Link
                                to="/kf6003/"
                                className=" font-medium hover:text-gray-300 text-white"
                            >
                                <p
                                    className="text-nowrap"
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </p>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="font-medium hover:text-gray-300 text-white">
                                <Link
                                    to="/login"
                                    className="font-medium hover:text-gray-300 text-white"
                                >
                                    <p className="text-nowrap">Sign In</p>
                                </Link>
                            </div>
                            <div className="font-medium hover:text-gray-300 text-white">
                                <Link
                                    to="/signup"
                                    className="font-medium hover:text-gray-300 text-white"
                                >
                                    <p className="text-nowrap">Sign up</p>
                                </Link>
                            </div>
                        </>
                    )}

                    {signedIn && (
                        <Link to="/settings">
                            <span className="inline-block size-[46px] bg-gray-100 rounded-full overflow-hidden cursor-pointer">
                                {signedInUser.imageUrl || userProfile?.profilePicturePath ? (
                                    <img
                                        src={(userProfile?.profilePicturePath || signedInUser?.imageUrl)}
                                        alt=""
                                    ></img>
                                ) : (
                                    <svg
                                        className="size-full text-gray-300"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            x="0.62854"
                                            y="0.359985"
                                            width="15"
                                            height="15"
                                            rx="7.5"
                                            fill="white"
                                        />
                                        <path
                                            d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
