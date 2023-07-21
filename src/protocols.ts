export const qGoProtocol = {
    'protocol': "https://qgo.app/protocol",
    'types': {
        'qGoLink': {
            'schema': "qGoLinkSchema",
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
                    'who': 'author',
                    'of': 'qGoLink',
                    'can': 'read'
                },
                {
                    'who': 'recipient',
                    'of': 'qGoLink',
                    'can': 'read'
                }
            ]
        }
    },
};

