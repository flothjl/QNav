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

export const qGoFollowedProtocol = {
    'protocol': "https://qgo.app/protocol",
    'types': {
        'qGoFollowed': {
            'schema': "qGoFollowedSchema",
            'dataFormats': ["application/json"],
        }
    },
    'structure': {
        'qGoFollowed': {
            '$actions': [
                {
                    'who': 'anyone',
                    'can': 'write'
                },
                {
                    'who': 'author',
                    'of': 'qGoLink',
                    'can': 'read'
                }
            ]
        }
    },
};

