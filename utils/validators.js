function validateSchoolInput(name, address, latitude, longitude) {
    if (!name || !address || !latitude || !longitude) {
        return { valid: false, message: "All fields are required" };
    }
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return { valid: false, message: "Latitude and longitude must be numbers" };
    }
    return { valid: true };
}

module.exports = { validateSchoolInput };