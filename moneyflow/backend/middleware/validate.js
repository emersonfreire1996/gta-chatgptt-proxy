/**
 * Tiny schema validator. Schema: { field: { type, required, min, max, enum, regex, custom } }
 */
function validate(schema, body) {
  const errors = {};
  for (const [key, rule] of Object.entries(schema)) {
    const val = body?.[key];
    if (val === undefined || val === null || val === '') {
      if (rule.required) errors[key] = 'required';
      continue;
    }
    if (rule.type === 'string' && typeof val !== 'string') errors[key] = 'must be string';
    else if (rule.type === 'number' && typeof val !== 'number') errors[key] = 'must be number';
    else if (rule.type === 'enum' && !rule.enum.includes(val)) errors[key] = `must be one of ${rule.enum.join('|')}`;
    if (rule.min !== undefined && typeof val === 'string' && val.length < rule.min) errors[key] = `min length ${rule.min}`;
    if (rule.min !== undefined && typeof val === 'number' && val < rule.min) errors[key] = `min ${rule.min}`;
    if (rule.max !== undefined && typeof val === 'number' && val > rule.max) errors[key] = `max ${rule.max}`;
    if (rule.regex && !rule.regex.test(val)) errors[key] = 'invalid format';
    if (rule.custom && !rule.custom(val)) errors[key] = rule.message || 'invalid';
  }
  return Object.keys(errors).length ? errors : null;
}

module.exports = (schema) => (req, _res, next) => {
  const errors = validate(schema, req.body);
  if (errors) return next({ status: 400, code: 'VALIDATION', message: 'Invalid input', details: errors });
  next();
};

module.exports.validate = validate;
