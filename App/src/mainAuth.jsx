import { useContext } from "react";
import { AuthContext } from "./App";

export const useMainAuth = () => {
	const context = useContext(AuthContext);
	
	if (context === undefined) {
		throw new Error("useMainAuth must be used within an AuthProvider");
	}

	return context;
};
