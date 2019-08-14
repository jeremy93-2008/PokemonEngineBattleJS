/**
 * This file will be for the IA system of computer controled trainers.
 * The Random value will be between 0 and 1.
 * Each attack have the same amount of probability to come out, (0) 0.25 / 0.5 / 0.75 / 1
 * But each attack that are effective against the human pokemon will earn 0.3, 
 * reducing the previous attack of (0.3 / 2) and adding (0.3 / 2) to the current one.
 * (0) 0.1 / 0.65 / 0.75 / 1.
 * Elsewhere if a attack is not effective or the human Pokemon is inmune to it, the Attack lose 0.2.
 * (0) -0.1 / 0.65 / 0.75 / 1.
 * Finally attacks with Status are slighty encouraged adding 0.05 to any attack with Status Kind, but only if the human pokemon is not already affected by a status.
 */
function getAttackComputer() {
    
}