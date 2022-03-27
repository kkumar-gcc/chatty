export default {
    port: 1337,
    host: "localhost",
    dbUri: "mongodb://localhost:27017/chattyDB",
    saltWorkFactor: 10,
    accessTokenTtl: "15m",
    refreshTokenTtl: "1y",
    publicKey: `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCHQM8Z0pgCJgUG8d/2sGkkaAKv
    sNbmhhdqr1gvu860Hec82z31NV2wFM5RA7to5rFx2kdV9c5/cpoAfUAXiCf+ZfUX
    0j4pKy8JIJm4jb1Ty2FK4LJntXAXFLvzJOdklpx6UCE1CL14F3HOnbJvezV9wHUU
    pbiPRExOXi7viKx09QIDAQAB
    -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
    MIICWwIBAAKBgQCHQM8Z0pgCJgUG8d/2sGkkaAKvsNbmhhdqr1gvu860Hec82z31
    NV2wFM5RA7to5rFx2kdV9c5/cpoAfUAXiCf+ZfUX0j4pKy8JIJm4jb1Ty2FK4LJn
    tXAXFLvzJOdklpx6UCE1CL14F3HOnbJvezV9wHUUpbiPRExOXi7viKx09QIDAQAB
    AoGAAV/dOuvy84KjZnCqz/z29JHCBTsM1Abk0ga6JLIJ5bawFOQ9evJx40oy1ovt
    KaG+h+Op+eunj5AAlKSxNAwELAPR6+b7rcVIlJCY+NjjwehgaeVaW8RXFzc5BoLf
    RwEvwga2v4Qacv9uT15gGbeRAwfxxMeyyOGJ8k9c4NVge3kCQQDeAeglQGeCtbKf
    fFL23T86z3pbbPBTO8m0NmSQxihvAFJjTqjgq1Ip+Ba0yVlinLMgFSERJ5LYB1Dt
    rIUqyEqvAkEAm/ZeORF0aUzOv5AoJBipp4JVm3fGTFlftP5bHEh9Ul4wM0Bknz5Q
    QYmOIgDh8qWhg597FqfTjcb4Utbnk/fTmwJAU4heI94W1HyvaAjsYoye5O76N/pG
    dtrxKwioUDzvK8zwMwN+0YJE2RvK111Hb65MS88HcR/1xakDD1qxhIZ2awJAf2Sy
    ejMDv695gYgjAbkTezw+6Qrg8yRdxN2vVl7v3wQIoxSKHHkt3Rqa+rN13FnmoDj4
    tfzIFRrdY+0epALe2QJAEbYa/eaA6x1BBeahZaKioDGy9cIvJqPmi6vUrIjDsGU+
    Za5T9IvOGlOvGAF2aqzlfAeljl/GiBrwAgPs6Jty0w==
    -----END RSA PRIVATE KEY-----`,

};