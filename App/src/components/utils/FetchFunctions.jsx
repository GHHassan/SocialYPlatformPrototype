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
const API_BASE_URL = 'https://w20017074.nuwebspace.co.uk/kf6012/coursework/api/'

/** fetch function for GET requests */
const fetchWithGet = async (endpointname) => {
  try {
    const response = await fetch(API_BASE_URL + endpointname)
    if (response.status === 200) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    <ErrorComponent message={error.message} />
  }
}

/** referenced in App component the result is passed to Home page component*/
export const fetchRandomContent = async () => {
  try {
    return await fetchWithGet('previews?limit=1')
  } catch (error) { 
    <ErrorComponent message={error.message} />
  }
}

/** 
 * following fucntions (fetchContents(),
 *  fetchAwards(), fetchTypes()) are called 
 * in ContentsPage component and the results 
 * are passed to ContentsList component
 */
export const fetchContents = async () => {
  try {
    return await fetchWithGet('contents')
  } catch (error) {
    <ErrorComponent message={error.message} />
  }
}

export const fetchAwards = async () => {
  try {
    return fetchWithGet('awards')
  } catch (error) {
    <ErrorComponent message={error.message} />
  }
}

export const fetchTypes = async () => {
  try {
    return fetchWithGet('types')
  } catch (error) {
    <ErrorComponent message={error.message} />
   }
}

/** 
 * following fucntions (fetchNotes(), pushNote(), deleteNote() and
 * fetchAuthorsAndAffiliations()) are references 
 * in Content component
 */
export const fetchNotes = async (token) => {
  return fetch(`${API_BASE_URL}notes`, {
    method: 'GET',
    headers: new Headers({ 'Authorization': 'Bearer ' + token }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      }
    })
}

export const pushNote = async (note, content_id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}notes?note=${note}&content_id=${content_id}`,
      {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + token })
      })
      if (response.status === 200) {
        const data = await response.json()
        return data
      }
  } catch (error) {
    <ErrorComponent message={error.message} />
  }
}

export const deleteNote = async (content_id, token) => {
  try{
    const response = await fetch(`${API_BASE_URL}notes?content_id=${content_id}`,
    {
      method: 'DELETE',
      headers: new Headers({ 'Authorization': 'Bearer ' + token })
    })
    if (response.status === 200) {
      const data = await response.json()
      return data
    }
  }catch (error) {
    <ErrorComponent message={error.message} />
  }
}

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}register?name=${name}&&email=${email}&&password=${password}`, {
      method: 'POST',
    })
      const data = await response.json()
      return data
  } catch (error) {
    <ErrorComponent message={error.message} />
  }
}

export const fetchAuthorsAndAffiliations = async (contentId) => {
  return fetch(`${API_BASE_URL}author-and-affiliations?content=${contentId}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      }
    })
}


/** 
 * following fucntions (fetchCountries() and preloadflags) are
 * called in Countries component
 */
export const fetchCountries = async () => {
  try {
    return fetchWithGet('countries')
  } catch (error) { 
    <ErrorComponent message={error.message} />
  }
}

export const preloadFlags = async (countries) => {
  try {
    const flagPromises = countries.map(async (country) => {
      const response = await fetch(`https://restcountries.com/v3.1/name/${country.country}`)
      const data = await response.json()
      const flagUrl = data[0]?.flags?.svg
      country.flag = flagUrl
    })
    await Promise.all(flagPromises)
    return [...countries]
  } catch (error) {
    <ErrorComponent message={error.message} />
  }
}