const selfsigned = require('selfsigned');

module.exports = {
    GenerateCertificateAndKey: function(commonName, numDays) {
        return GenerateCertificateAndKey(commonName, numDays);
    }
};

function GenerateCertificateAndKey(commonName, numDays = 365) {
    const attrs = [{ name: 'commonName', value: commonName }];

    let pems = selfsigned.generate(attrs, { days: numDays });
    
    return {
        certificate: pems.cert,
        privateKey: pems.private,
        publicKey: pems.public,
        fingerprint: pems.fingerprint
    };
}