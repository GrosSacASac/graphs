export { validateInput };
import { validOperators, validVariables } from "./settings/validOperators.js";


const validateInput = function (start, stop, step, equationString) {
    if (!Number.isFinite(start)) {
        return `Start is not a finite number`;
    }
    if (!Number.isFinite(stop)) {
        return `Stop is not a finite number`;
    }
    if (!Number.isFinite(step)) {
        return `Step is not a finite number`;
    }
    if (step === 0) {
        return `Step must not be 0`;
    }
    if ((step > 0 && start > stop) || (step < 0 && start < stop)) {
        return `Step added to Start should bring us to Stop`;
    }
    if (start === stop) {
        return `Stop must be different than Start`;
    }
    if (Math.abs(step) >= Math.abs(stop - start)) {
        return `Step's absolute value must be smaller`;
    }

    return validateEquationString(equationString);
    
};


const validateEquationString = function (equationString) {
    if (equationString.length === 0) {
        return `Equation must not be empty`;
    }

    const invalidCharacter = equationString.split(``).find(character => {
        return (
            Object.is(NaN, Number(character)) &&
            character !== ` ` && // space
            !validOperators.includes(character) && 
            !validVariables.includes(character)
        ); 
    });

    if (invalidCharacter) {
        return `Invalid character ${invalidCharacter}`;
    }

    // no problems
    return ``;
};
