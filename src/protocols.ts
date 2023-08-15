export const qNavProtocol = {
    'protocol': "https://qnavprotocol",
    'types': {
        'qNavLink': {
            'schema': "qNavLinkSchema",
            'dataFormats': ["application/json"],
        },
        'qNavFollow': {
            'schema': "qNavFollowSchema",
            'dataFormats': ["application/json"],
        }
    },
    'structure': {
        'qNavLink': {
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
        'qNavFollow': {
            '$actions': [
                {
                    'who': 'anyone',
                    'can': 'write'
                },
                {
                    'who': 'author',
                    'of': 'qNavFollow',
                    'can': 'read'
                }
            ]
        }
    },
};
