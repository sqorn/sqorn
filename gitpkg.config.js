const { execSync } = require('child_process')

module.exports = () => ({
  getTagName: (pkg) =>
    `${pkg.name}-v${pkg.version}-gitpkg-${execSync(
      'git rev-parse --short HEAD',
      { encoding: 'utf-8' }
    ).trim()}`
})
