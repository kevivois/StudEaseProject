import Joi from 'joi';

/**
 * Valide les données du corps de la requête en fonction du schéma Joi.
 * @param {Object} body - Le corps de la requête
 * @param {Object} schema - Le schéma Joi pour la validation
 * @returns {Object} - Un objet contenant des erreurs ou null si tout est valide
 */
export async function validateData(body, schema) {
  try {
    // Validation des données avec Joi
    await schema.validateAsync(body, { abortEarly: false, allowUnknown: true,warning:true });
    return [];
  } catch (error) {
    // Si une erreur est détectée, on retourne un objet contenant les messages d'erreur
    const errors = error.details.map(err => err.message);
    return errors;
  }
}
