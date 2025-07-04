const supportedOperatingSystems = ["linux"];
const supportedDistributions = ["ubuntu", "debian", "centos"];
const packageManagers = {
  ubuntu: "apt",
  debian: "apt",
  centos: "yum",
};

module.exports = {
  supportedOperatingSystems,
  supportedDistributions,
  packageManagers,
};
