const uuid = require('node-uuid');

function getProblem() {
  const problem = {
    id: uuid.v1(),
    name: 'test problem',
  };

  return problem;
}

module.exports = getProblem;
