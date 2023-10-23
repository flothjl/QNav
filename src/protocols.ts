export const qNavProtocol = {
    'protocol': "https://qnavlinks.io/protocol/v0.7",
    'published': true,
    'types': {
        'link': {
            'schema': "urn:qNavLinkSchema",
            'dataFormats': ["application/json"],
        },
        'privateLink': {
            'schema': "urn:qNavPrivateLinkSchema",
            'dataFormats': ["application/json"],
        },
        'follow': {
            'schema': "urn:qNavFollowSchema",
            'dataFormats': ["application/json"],
        }
    },
    'structure': {
        'link': {
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
        'privateLink': {
            '$actions': [
                {
                    'who': 'anyone',
                    'can': 'write'
                },
                {
                    'who': 'author',
                    'of': 'privateLink',
                    'can': 'read'
                }
            ] 
        },
        'follow': {
            '$actions': [
                {
                    'who': 'anyone',
                    'can': 'write'
                },
                {
                    'who': 'author',
                    'of': 'follow',
                    'can': 'read'
                }
            ]
        }
    },
};
