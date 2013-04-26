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
        authToken: 'AgAAAA**AQAAAA**aAAAAA**xjxbUQ**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wAkIKmDpaCogudj6x9nY+seQ**oy4BAA**AAMAAA**sGAfHa71hrOXprLrwJ4y1/9e2LPixG6m1bCXZ55qi82tOL3psMrjWfhvNDUVjVcdnsi66gBDM30Bw4MQ5r0IrzyMwF/6KtijVOSQfhm0iwWK0Vv5ZBZFTWD3DChzg7gEFkp/psvjJPFcACBqKRO0GvDpW/Ph0Ve/YTSbZERYLSJwPQ4WGsfDlEb5/Kv4hI2W4gF2GpKJOsULgUXGiWrTOKfKRO5nxv4H51tHTtQlzQb8Z8bdyL0qd0cnWq01+qeEsKVZX1o4Kuj3goa6piS5haXVgJlPX9zKfPrJCX+6/3KGaftBwDOq9il9sSgw3kNP0soAGvE6hYd0yKir9wmxJmelzpJB6KojrT3eKQa7XO72OIUEtFU2Df4AT96XS0v4XByHC3M3037rhNmnA4Wrmucc/bclQfGIr6EYswGbVPmDTiXTqankF2YnWs60OZk7UacfknRxcHm68IrAS328ZWPEZbbvucuJsv8lGEUBsz7ATyd5BE9EGtdOZi68EB3VA4p5f93ajP0h7gVCupCsJly3xS2Z0LGXRioTqrVNWbaWmALB4ZblgkOC/MR1boe0PjBHCYQNDmgCL2yC3pjyQ8Pi41z3GOms0Lc7f4OWERF5Oz+R0l641nO3cv6f8BLiY9a7olcnfMou6q6PibvTrzZ/yp7IZRHrkD24VUVdg2x53KsehpptEB0xEIbyA3iyam9MOw+znNG0S9YN7aQvMuEvLusS3kCDxq4Qa+GWcm+o1xTVCvhimUC674FfpfLf',
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