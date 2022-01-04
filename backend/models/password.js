const passwordValidator = require('password-validator')
 
const passwordSchema = new passwordValidator()
passwordSchema
    .is().min(8, 'le mot de passe doit contenir au minimum 8 caractères')                                    // Minimum length 8
    .is().max(100, 'le mot de passe doit contenir au maximum 100 caractères')                                  // Maximum length 100
    .has().uppercase(1, 'le mot de passe doit contenir une lettre majuscule')                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2, 'le mot de passe doit contenir 2 chiffres')                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = passwordSchema