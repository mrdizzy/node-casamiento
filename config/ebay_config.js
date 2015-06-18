var EbayApi = require('node-ebay-trading-api'),

    sandbox = {
        appId: 'Casmient-2aff-4dab-9163-50f440216b96',
        devId: 'c8d4d396-f869-44d9-8798-df4c2de90717',
        certId: '454dd9f0-47d0-4871-ab91-ab0038a59cd3',
        authToken: 'AgAAAA**AQAAAA**aAAAAA**kRoiTg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4CoAZeCpQ6dj6x9nY+seQ**JpMBAA**AAMAAA**oZA6Ywa6Ma6zNlkw3cqilP+685HQPlP4Bf1XAf+2Rt9V77dU94zFnoj4nhflnUipahn1Fy2roxApfA5ELDRgedWuspTUBirBQ5bAsuq9Btysg3p4KCq5+vsLLi3gyElWAOOOEvjTe24GHXDyHxrJsci0Ht3gMvOQ0rllbdiplsymNRY0+lXrS4jGrLRV3VCwbA2rAuhDhEaJbBH0GNP+YRO2GEerOQUGmA1/zeGYOfa/ZyU/7vQYZoBFG+v+31rxfqlOVo53o9lOo2QVfI1TDRtlsQBaBe159Shbe686AdRod5zAlimUtpzV9/9OqeMDGHqjWi39CsCjTDctOsLm3Ck/h8nJcOkOHCa2aDvW1ney+77L8HljBIBCNBkNookq13s51zRjQh+vekwBi2ja0hZgIlKULFp3QZdF8np9qlhPjWT90udSQiy2hczfFQmK/vCW2dY8OD+6bcPLQa/ruTVMMLQKga3Hdi4oFxJlhLcH3hpi4Z4vunOYnxGhtva2iQpLUfRBwHpCNr2swDQDT8Y4BLkn0GpNAqaOBX700f+uywf0BnOwYwdyL7+kx/8TMR0lwTJvmlPguukEY/zMtrTIChiX6sDAAXTep9H5plEvUKmBwwqxo+Jy15kIkkmMQh5eq58I+/Zw+PWF7sNn7rWLTQyqexrPImWG3hqQlNF2O4F29DWQCfKtiD+Y+RzOF3vngtgeQmCbdWKnP9OXaxIitTuRsDagj5ebjU0DNWkX5/6eQlDScp3fVMNi0pgf',
        siteId: '3',
        use_sandbox: true
    },
    production = {
        appId: 'Casmient-178b-402d-98a6-51e19780d9a0',
        devId: 'c8d4d396-f869-44d9-8798-df4c2de90717',
        certId: 'c0cf2bdb-6ae9-4430-964d-16115594c412',
        authToken: 'AgAAAA**AQAAAA**aAAAAA**GnQDVQ**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wAkIKmDpaCogudj6x9nY+seQ**oy4BAA**AAMAAA**Bjta0tK4vFtDHgYtlG1vKNK/Ha1Hc/YHr+so+QbTSqA+DN8Sf4ZqDj1f3zoTJnJMsXFXyATQ5fZCKJ4jyn/EUp83ScAR/QEDD5T/Aq9f+5v1QkaOIOXCI21Oh73Q8A9CsZhdS5oxfpisdR+7qWVaK0oSYQ4PPggSDohcJZI+DRgWxHfEx6JE3LBkaiGM6j+A6QxzosqBinJXZ1lujITVq8Fm5rGxIBciuShHydNvuR2Gh09NoyfTLIf0wDFgxmtO/3ybfcA/knfiJTbQDJdnLr9eq0pDyNUM7wAKANHISiFo788n52FDFOHQaOpBQ29G93psLX4oVBpDMCg3U2E0ZztQ9/TxMiJ1NTF5mqyitA8yCvwpnjP7/xhVUx9jyXzpKVScFjpAjwXcBVooSHMnfS/MTJw3+fZBPIpb7mqnIvpYMvCWfI8bW9AUikynngA+ov1JSZ/r02JqTTC68niX/Zr0TFTwgg1IGSPMpCfxsmAB/pX16RD/BQI+R+qO/Ug29l878ALPmnNQNcb9vHOW0veq9bwxRY5VpVR6U5Wb8FFlj1qO/10XQ0lDXGdig/DeB1fA0DSrUrRFPfv/lTyt9I9xDO2UeK7CppLhX5k/HgwS7kz7XPAglmE/TesJtb6SFLP40BrdskO/+kdjOWg92F8+3uywM6KJd1Iz4HF80J7R3g25fxZfoCAzKP5PqmAXr0Th65u6Pzs1yIQT+VGv6XYkIBVHY4hSHzVHgcmR2d1XpUL63sFgwjM0XHQu7E0/',
        siteId: '3',
        use_sandbox: false
    }
    
module.exports = function() {
    if (process.env.NODE_ENV == 'test') {
        return new EbayApi(sandbox);
    }
    else {
        return new EbayApi(production);
    }
}