// Copyright (c) 2019-2024 Five Squared Interactive. All rights reserved.

const selfsigned = require('selfsigned');

/**
 * @module CertificateGenerator Generates a self-signed certificate.
 */
module.exports = {
    /**
     * @function GenerateCertificateAndKey Generate a certificate and hey.
     * @param {*} commonName Common Name for the key.
     * @param {*} numDays Number of days the key is valid.
     * @returns The certificate, private key, public key, and fingerprint.
     */
    GenerateCertificateAndKey: function(commonName, numDays) {
        return GenerateCertificateAndKey(commonName, numDays);
    }
};

/**
 * @function GenerateCertificateAndKey Generate a certificate and hey.
 * @param {*} commonName Common Name for the key.
 * @param {*} numDays Number of days the key is valid.
 * @returns The certificate, private key, public key, and fingerprint.
 */
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