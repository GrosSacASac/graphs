export {validateInput};


const validateInput  = function (start, stop, step, equationString) {

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
  if (Math.abs(step) >= (Math.abs(stop) - Math.abs(start))) {
    return `Step's absolute value must be smaller`;
  }
  if (equationString.length === 0) {
    return `Equation must not be empty`;
  }

  // todo validate equationString from a whitelist of acceptable operators

  // no problems
  return "";
};