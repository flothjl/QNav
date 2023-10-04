export const qNavProtocol = {
    'protocol': "https://qnavprotocol_dev",
    'published': true,
    'types': {
        'qNavLink': {
            'schema': "urn:qNavLinkSchema",
            'dataFormats': ["application/json"],
        },
        'qNavFollow': {
            'schema': "urn:qNavFollowSchema",
            'dataFormats': ["application/json"],
        }
    },
    'structure': {
        'qNavLink': {
            '$actions': [
                {
                    'who': 'anyone',
                    'can': 'read'
                },
                {
                    'who': 'anyone',
                    'can': 'write'
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
