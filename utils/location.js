export const getReverseGeocode = async (lat, lon) => {
    const apiKey = 'ffbabdd99d7845b8b5cfed901563b966' // Replace with your actual API key
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()

        const { results } = data
        const result = results?.[0]

        const { county, city, state_district, state, postcode } = result

        return { county, city, state_district, state, postcode }
    } catch (error) {
        console.error('Error fetching the reverse geocoding data:', error)
        throw error
    }
}
