const C = { reset:'\x1b[0m', dim:'\x1b[2m', cyan:'\x1b[36m', green:'\x1b[32m', yellow:'\x1b[33m', red:'\x1b[31m', magenta:'\x1b[35m' };
const ts = () => new Date().toISOString().split('T').join(' ').slice(0,19);
const wrap = (color, level) => (...args) =>
  console.log(`${C.dim}[${ts()}]${C.reset} ${color}${level}${C.reset}`, ...args);

module.exports = {
  info:  wrap(C.cyan,    'INFO '),
  ok:    wrap(C.green,   'OK   '),
  warn:  wrap(C.yellow,  'WARN '),
  error: wrap(C.red,     'ERROR'),
  debug: wrap(C.magenta, 'DEBUG'),
};
