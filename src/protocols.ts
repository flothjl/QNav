export const qGoProtocol = {
    'protocol': "https://qnav/protocol",
    'types': {
        'qGoLink': {
            'schema': "qGoLinkSchema",
            'dataFormats': ["application/json"],
        },
        'qGoFollow': {
            'schema': "qGoFollowSchema",
            'dataFormats': ["application/json"],
        }
    },
    'structure': {
        'qGoLink': {
            '$actions': [
                {
                    'who': 'anyone',
                    'can': 'write'
                },
                {
                    'who': 'anyone',
                    'can': 'read'
                }
            ]
        },
        'qGoFollow': {
            '$actions': [
                {
                    'who': 'anyone',
                    'can': 'write'
                },
                {
                    'who': 'author',
                    'of': 'qGoFollow',
                    'can': 'read'
                }
            ]
        }
    },
};
