/**
 * FetchFunctions
 * 
 * This file contains functions to fetch data from the server.
 * This is to make the code organised and reusable for 
 * other components.
 * 
 * @generated
 * @author Ghulam Hassan Hassani <w20017074>
 */

import ErrorComponent from '../pageFractions/ErrorComponent'
const API_BASE_URL = 'https://w20017074.nuwebspace.co.uk/kf6003API/'

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}register`, {
      method: 'POST',
      body: JSON.stringify({ "username": name, "email": email, "password_hash": password }),
    })
      const data = await response.json()
      return data
  } catch (error) {
    <ErrorComponent message={error.message} />
  }
}